// GM Helper — GM NPC Routes
const express = require('express');
const { verifyToken, requireCampaignAccess, requireGM } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { createNpcSchema, updateNpcSchema } = require('../../validators/schemas');

const router = express.Router({ mergeParams: true });

router.use(verifyToken, requireCampaignAccess, requireGM);

// GET / — List NPCs
router.get('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { search, favorite, active } = req.query;
    const where = { campaignId: req.campaignId };

    if (search) where.name = { contains: search };
    if (favorite === 'true') where.isFavorite = true;
    if (active === 'true') where.isActive = true;

    const npcs = await prisma.nPC.findMany({
      where,
      include: {
        location: {
          select: {
            id: true,
            name: true,
            type: true,
            parentLocationId: true,
            parentLocation: { select: { id: true, name: true, type: true } }
          }
        },
        questLinks: { include: { quest: { select: { id: true, name: true } } } },
      },
      orderBy: { name: 'asc' },
    });
    res.json({ npcs });
  } catch (err) {
    console.error('List NPCs error:', err);
    res.status(500).json({ error: 'Failed to list NPCs' });
  }
});

// POST / — Create NPC
router.post('/', validate(createNpcSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const npc = await prisma.nPC.create({
      data: { ...req.body, campaignId: req.campaignId },
      include: { location: { select: { id: true, name: true } } },
    });
    res.status(201).json({ npc });
  } catch (err) {
    console.error('Create NPC error:', err);
    res.status(500).json({ error: 'Failed to create NPC' });
  }
});

// GET /:id — Get NPC detail
router.get('/:id', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const npc = await prisma.nPC.findFirst({
      where: { id: req.params.id, campaignId: req.campaignId },
      include: {
        location: { select: { id: true, name: true, type: true } },
        questLinks: { include: { quest: { select: { id: true, name: true, status: true } } } },
      },
    });
    if (!npc) return res.status(404).json({ error: 'NPC not found' });
    res.json({ npc });
  } catch (err) {
    console.error('Get NPC error:', err);
    res.status(500).json({ error: 'Failed to get NPC' });
  }
});

// PUT /:id — Update NPC
router.put('/:id', validate(updateNpcSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const result = await prisma.nPC.updateMany({
      where: { id: req.params.id, campaignId: req.campaignId },
      data: req.body,
    });
    if (result.count === 0) return res.status(404).json({ error: 'NPC not found' });
    const npc = await prisma.nPC.findUnique({ where: { id: req.params.id } });

    // Sync HP or AC changes to any linked encounter combatants
    if (req.body.hpCurrent !== undefined || req.body.hpMax !== undefined || req.body.armorClass !== undefined) {
      const combatantUpdates = {};
      if (req.body.hpCurrent !== undefined) combatantUpdates.hpCurrent = req.body.hpCurrent;
      if (req.body.hpMax !== undefined) combatantUpdates.hpMax = req.body.hpMax;
      if (req.body.armorClass !== undefined) combatantUpdates.armorClass = req.body.armorClass;

      await prisma.encounterCombatant.updateMany({
        where: { npcId: req.params.id },
        data: combatantUpdates,
      }).catch(e => console.error('Error syncing NPC updates to encounter combatants:', e));
    }

    res.json({ npc });
  } catch (err) {
    console.error('Update NPC error:', err);
    res.status(500).json({ error: 'Failed to update NPC' });
  }
});

// DELETE /:id — Delete NPC
router.delete('/:id', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const result = await prisma.nPC.deleteMany({
      where: { id: req.params.id, campaignId: req.campaignId },
    });
    if (result.count === 0) return res.status(404).json({ error: 'NPC not found' });
    res.json({ message: 'NPC deleted' });
  } catch (err) {
    console.error('Delete NPC error:', err);
    res.status(500).json({ error: 'Failed to delete NPC' });
  }
});

// PATCH /:id/favorite — Toggle favorite
router.patch('/:id/favorite', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const npc = await prisma.nPC.findFirst({
      where: { id: req.params.id, campaignId: req.campaignId },
    });
    if (!npc) return res.status(404).json({ error: 'NPC not found' });
    const updated = await prisma.nPC.update({
      where: { id: req.params.id },
      data: { isFavorite: !npc.isFavorite },
    });
    res.json({ npc: updated });
  } catch (err) {
    console.error('Toggle favorite error:', err);
    res.status(500).json({ error: 'Failed to toggle favorite' });
  }
});

module.exports = router;
