// GM Helper — GM City Routes (City-States with dynamic parameters)
const express = require('express');
const { verifyToken, requireCampaignAccess, requireGM } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { createCitySchema, updateCitySchema, adjustCityParamSchema,
        updateCityMapPositionSchema, updateCityTerritorySchema, updateCityFactionColorSchema } = require('../../validators/schemas');

const router = express.Router({ mergeParams: true });

router.use(verifyToken, requireCampaignAccess, requireGM);

// GET / — List all cities in campaign
router.get('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const locations = await prisma.location.findMany({
      where: { campaignId: req.campaignId, type: 'city' },
      include: { city: true },
      orderBy: { name: 'asc' },
    });

    const cities = locations
      .filter(l => l.city)
      .map(l => ({ ...l.city, location: { id: l.id, name: l.name, type: l.type } }));

    res.json({ cities });
  } catch (err) {
    console.error('List cities error:', err);
    res.status(500).json({ error: 'Failed to list cities' });
  }
});

// POST / — Create city (attach to a location)
router.post('/', validate(createCitySchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    // Verify location belongs to this campaign and is type "city"
    const location = await prisma.location.findFirst({
      where: { id: req.body.locationId, campaignId: req.campaignId },
    });
    if (!location) return res.status(404).json({ error: 'Location not found' });

    const city = await prisma.city.create({
      data: req.body,
      include: { location: { select: { id: true, name: true } } },
    });

    res.status(201).json({ city });
  } catch (err) {
    console.error('Create city error:', err);
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'City already exists for this location' });
    }
    res.status(500).json({ error: 'Failed to create city' });
  }
});

// GET /:id — Get city detail with history
router.get('/:id', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const city = await prisma.city.findUnique({
      where: { id: req.params.id },
      include: {
        location: {
          select: { id: true, name: true, type: true, campaignId: true },
        },
        parameterHistory: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
        questImpacts: {
          include: { quest: { select: { id: true, name: true, status: true } } },
        },
      },
    });

    if (!city || city.location.campaignId !== req.campaignId) {
      return res.status(404).json({ error: 'City not found' });
    }

    res.json({ city });
  } catch (err) {
    console.error('Get city error:', err);
    res.status(500).json({ error: 'Failed to get city' });
  }
});

// PUT /:id — Update city parameters
router.put('/:id', validate(updateCitySchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const city = await prisma.city.findUnique({
      where: { id: req.params.id },
      include: { location: { select: { campaignId: true } } },
    });
    if (!city || city.location.campaignId !== req.campaignId) {
      return res.status(404).json({ error: 'City not found' });
    }

    const updated = await prisma.city.update({
      where: { id: req.params.id },
      data: req.body,
      include: { location: { select: { id: true, name: true } } },
    });

    res.json({ city: updated });
  } catch (err) {
    console.error('Update city error:', err);
    res.status(500).json({ error: 'Failed to update city' });
  }
});

// POST /:id/adjust — Manually adjust a single parameter (with history tracking)
router.post('/:id/adjust', validate(adjustCityParamSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { parameter, value, cause } = req.body;

    const city = await prisma.city.findUnique({
      where: { id: req.params.id },
      include: { location: { select: { campaignId: true, name: true } } },
    });
    if (!city || city.location.campaignId !== req.campaignId) {
      return res.status(404).json({ error: 'City not found' });
    }

    const oldValue = city[parameter];
    const newValue = Math.max(0, Math.min(100, oldValue + value));

    // Update parameter and create history entry
    const [updated] = await prisma.$transaction([
      prisma.city.update({
        where: { id: req.params.id },
        data: { [parameter]: newValue },
        include: { location: { select: { id: true, name: true } } },
      }),
      prisma.cityParameterHistory.create({
        data: {
          cityId: req.params.id,
          parameter,
          oldValue,
          newValue,
          cause,
        },
      }),
    ]);

    res.json({ city: updated, adjustment: { parameter, oldValue, newValue, cause } });
  } catch (err) {
    console.error('Adjust city param error:', err);
    res.status(500).json({ error: 'Failed to adjust parameter' });
  }
});

// GET /:id/history — Get parameter history
router.get('/:id/history', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { parameter, limit = 50 } = req.query;

    const where = { cityId: req.params.id };
    if (parameter) where.parameter = parameter;

    const history = await prisma.cityParameterHistory.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit, 10),
    });

    res.json({ history });
  } catch (err) {
    console.error('Get city history error:', err);
    res.status(500).json({ error: 'Failed to get history' });
  }
});

// DELETE /:id — Delete city (keeps the location)
router.delete('/:id', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const city = await prisma.city.findUnique({
      where: { id: req.params.id },
      include: { location: { select: { campaignId: true } } },
    });
    if (!city || city.location.campaignId !== req.campaignId) {
      return res.status(404).json({ error: 'City not found' });
    }
    await prisma.city.delete({ where: { id: req.params.id } });
    res.json({ message: 'City deleted' });
  } catch (err) {
    console.error('Delete city error:', err);
    res.status(500).json({ error: 'Failed to delete city' });
  }
});

// ─── MAP POSITION (world map canvas coords) ───────────────────────────────
router.patch('/:id/map-position', validate(updateCityMapPositionSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const city = await prisma.city.findUnique({
      where: { id: req.params.id },
      include: { location: { select: { campaignId: true } } },
    });
    if (!city || city.location.campaignId !== req.campaignId) {
      return res.status(404).json({ error: 'City not found' });
    }
    const updated = await prisma.city.update({
      where: { id: req.params.id },
      data: { mapX: req.body.mapX, mapY: req.body.mapY },
    });
    res.json({ city: updated });
  } catch (err) {
    console.error('Update city map position error:', err);
    res.status(500).json({ error: 'Failed to update map position' });
  }
});

// ─── TERRITORY DATA (polygon JSON) ───────────────────────────────────────
router.put('/:id/territory', validate(updateCityTerritorySchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const city = await prisma.city.findUnique({
      where: { id: req.params.id },
      include: { location: { select: { campaignId: true } } },
    });
    if (!city || city.location.campaignId !== req.campaignId) {
      return res.status(404).json({ error: 'City not found' });
    }
    const updated = await prisma.city.update({
      where: { id: req.params.id },
      data: { territoryData: req.body.territoryData },
    });
    res.json({ city: updated });
  } catch (err) {
    console.error('Update city territory error:', err);
    res.status(500).json({ error: 'Failed to update territory' });
  }
});

// ─── FACTION COLOR ────────────────────────────────────────────────────────
router.patch('/:id/faction-color', validate(updateCityFactionColorSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const city = await prisma.city.findUnique({
      where: { id: req.params.id },
      include: { location: { select: { campaignId: true } } },
    });
    if (!city || city.location.campaignId !== req.campaignId) {
      return res.status(404).json({ error: 'City not found' });
    }
    const updated = await prisma.city.update({
      where: { id: req.params.id },
      data: { factionColor: req.body.factionColor },
    });
    res.json({ city: updated });
  } catch (err) {
    console.error('Update city faction color error:', err);
    res.status(500).json({ error: 'Failed to update faction color' });
  }
});

module.exports = router;
