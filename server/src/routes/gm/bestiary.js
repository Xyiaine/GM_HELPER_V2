// GM Helper — Bestiary Routes
const express = require('express');
const { verifyToken, requireCampaignAccess, requireGM } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { createBestiarySchema, updateBestiarySchema } = require('../../validators/schemas');

const router = express.Router({ mergeParams: true });

router.use(verifyToken, requireCampaignAccess, requireGM);

// GET / — List bestiary entries for a campaign
router.get('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { category, search, favoriteOnly } = req.query;

    const where = { campaignId: req.campaignId };

    if (category) {
      where.category = category;
    }
    if (favoriteOnly === 'true') {
      where.isFavorite = true;
    }
    if (search) {
      where.name = { contains: search };
    }

    const bestiary = await prisma.bestiary.findMany({
      where,
      orderBy: [{ isFavorite: 'desc' }, { name: 'asc' }],
    });

    res.json({ bestiary });
  } catch (err) {
    console.error('Bestiary list error:', err);
    res.status(500).json({ error: 'Failed to fetch bestiary' });
  }
});

// POST / — Create a new stat block
router.post('/', validate(createBestiarySchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const entry = await prisma.bestiary.create({
      data: {
        ...req.body,
        campaignId: req.campaignId,
      },
    });

    res.status(201).json({ entry });
  } catch (err) {
    console.error('Bestiary create error:', err);
    res.status(500).json({ error: 'Failed to create bestiary entry' });
  }
});

// GET /:id — Get single stat block
router.get('/:id', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const entry = await prisma.bestiary.findFirst({
      where: { id: req.params.id, campaignId: req.campaignId },
      include: {
        npcs: { select: { id: true, name: true } },
      },
    });

    if (!entry) return res.status(404).json({ error: 'Bestiary entry not found' });
    res.json({ entry });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bestiary entry' });
  }
});

// PATCH /:id — Update stat block
router.patch('/:id', validate(updateBestiarySchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const existing = await prisma.bestiary.findFirst({
      where: { id: req.params.id, campaignId: req.campaignId },
    });

    if (!existing) return res.status(404).json({ error: 'Bestiary entry not found' });

    const entry = await prisma.bestiary.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json({ entry });
  } catch (err) {
    console.error('Bestiary update error:', err);
    res.status(500).json({ error: 'Failed to update bestiary entry' });
  }
});

// DELETE /:id — Delete stat block
router.delete('/:id', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    
    // Check if used in an active encounter
    const activeCombatant = await prisma.encounterCombatant.findFirst({
      where: {
        bestiaryId: req.params.id,
        encounter: { status: 'active' },
      },
    });

    if (activeCombatant) {
      return res.status(400).json({
        error: 'Cannot delete bestiary entry while it is participating in an active combat encounter',
      });
    }

    const result = await prisma.bestiary.deleteMany({
      where: { id: req.params.id, campaignId: req.campaignId },
    });

    if (result.count === 0) return res.status(404).json({ error: 'Bestiary entry not found' });

    res.json({ message: 'Bestiary entry deleted' });
  } catch (err) {
    console.error('Bestiary delete error:', err);
    res.status(500).json({ error: 'Failed to delete bestiary entry' });
  }
});

module.exports = router;
