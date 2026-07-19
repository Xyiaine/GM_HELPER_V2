// GM Helper — GM Encounter Routes (Combat Tracker)
const express = require('express');
const { verifyToken, requireCampaignAccess, requireGM } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { createEncounterSchema, updateEncounterSchema, createCombatantSchema, updateCombatantSchema } = require('../../validators/schemas');

const router = express.Router({ mergeParams: true });

router.use(verifyToken, requireCampaignAccess, requireGM);

// GET / — List encounters
router.get('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const encounters = await prisma.encounter.findMany({
      where: { campaignId: req.campaignId },
      include: {
        location: { select: { id: true, name: true } },
        _count: { select: { combatants: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
    res.json({ encounters });
  } catch (err) {
    res.status(500).json({ error: 'Failed to list encounters' });
  }
});

// POST / — Create encounter
router.post('/', validate(createEncounterSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const encounter = await prisma.encounter.create({
      data: { ...req.body, campaignId: req.campaignId },
    });
    res.status(201).json({ encounter });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create encounter' });
  }
});

// GET /:id — Get encounter with combatants
router.get('/:id', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const encounter = await prisma.encounter.findFirst({
      where: { id: req.params.id, campaignId: req.campaignId },
      include: {
        location: { select: { id: true, name: true } },
        combatants: {
          orderBy: [{ initiative: 'desc' }, { orderIndex: 'asc' }],
          include: {
            character: { select: { id: true, name: true, ownerUserId: true } },
            npc: { select: { id: true, name: true } },
          },
        },
      },
    });
    if (!encounter) return res.status(404).json({ error: 'Encounter not found' });
    res.json({ encounter });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get encounter' });
  }
});

// PUT /:id — Update encounter (status, round, turn)
router.put('/:id', validate(updateEncounterSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const result = await prisma.encounter.updateMany({
      where: { id: req.params.id, campaignId: req.campaignId },
      data: req.body,
    });
    if (result.count === 0) return res.status(404).json({ error: 'Encounter not found' });

    const encounter = await prisma.encounter.findUnique({
      where: { id: req.params.id },
      include: { combatants: { orderBy: [{ initiative: 'desc' }, { orderIndex: 'asc' }] } },
    });

    // Emit turn update to players
    const io = req.app.get('io');
    if (io && encounter.status === 'active') {
      const currentCombatant = encounter.combatants[encounter.currentTurnIndex];
      if (currentCombatant && currentCombatant.characterId) {
        const character = await prisma.character.findUnique({
          where: { id: currentCombatant.characterId },
        });
        if (character && character.ownerUserId) {
          io.to(`user:${character.ownerUserId}`).emit('encounter:your-turn', {
            encounterId: encounter.id,
            round: encounter.currentRound,
            combatantName: currentCombatant.name,
          });
        }
      }
    }

    res.json({ encounter });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update encounter' });
  }
});

// DELETE /:id
router.delete('/:id', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const result = await prisma.encounter.deleteMany({
      where: { id: req.params.id, campaignId: req.campaignId },
    });
    if (result.count === 0) return res.status(404).json({ error: 'Encounter not found' });
    res.json({ message: 'Encounter deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete encounter' });
  }
});

// --- Combatants ---
router.post('/:id/combatants', validate(createCombatantSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const combatant = await prisma.encounterCombatant.create({
      data: { ...req.body, encounterId: req.params.id },
    });
    res.status(201).json({ combatant });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add combatant' });
  }
});

router.put('/:id/combatants/:combatantId', validate(updateCombatantSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const combatant = await prisma.encounterCombatant.update({
      where: { id: req.params.combatantId },
      data: req.body,
    });

    // If HP changed and combatant is a player character, emit update
    if (req.body.hpCurrent !== undefined && combatant.characterId) {
      const io = req.app.get('io');
      const character = await prisma.character.findUnique({
        where: { id: combatant.characterId },
      });
      if (io && character && character.ownerUserId) {
        io.to(`user:${character.ownerUserId}`).emit('character:hp-updated', {
          characterId: character.id,
          hpCurrent: combatant.hpCurrent,
          hpMax: combatant.hpMax,
        });
      }
    }

    res.json({ combatant });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update combatant' });
  }
});

router.delete('/:id/combatants/:combatantId', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    await prisma.encounterCombatant.delete({ where: { id: req.params.combatantId } });
    res.json({ message: 'Combatant removed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove combatant' });
  }
});

// POST /:id/next-turn — Advance to next turn
router.post('/:id/next-turn', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const encounter = await prisma.encounter.findFirst({
      where: { id: req.params.id, campaignId: req.campaignId },
      include: { combatants: { orderBy: [{ initiative: 'desc' }, { orderIndex: 'asc' }] } },
    });
    if (!encounter) return res.status(404).json({ error: 'Encounter not found' });

    let nextIndex = encounter.currentTurnIndex + 1;
    let nextRound = encounter.currentRound;
    if (nextIndex >= encounter.combatants.length) {
      nextIndex = 0;
      nextRound += 1;
    }

    const updated = await prisma.encounter.update({
      where: { id: req.params.id },
      data: { currentTurnIndex: nextIndex, currentRound: nextRound },
      include: { combatants: { orderBy: [{ initiative: 'desc' }, { orderIndex: 'asc' }] } },
    });

    // Notify the player whose turn it is
    const currentCombatant = updated.combatants[nextIndex];
    const io = req.app.get('io');
    if (io && currentCombatant && currentCombatant.characterId) {
      const character = await prisma.character.findUnique({
        where: { id: currentCombatant.characterId },
      });
      if (character && character.ownerUserId) {
        io.to(`user:${character.ownerUserId}`).emit('encounter:your-turn', {
          encounterId: encounter.id,
          round: nextRound,
          combatantName: currentCombatant.name,
        });
      }
    }

    res.json({ encounter: updated, currentTurn: currentCombatant });
  } catch (err) {
    res.status(500).json({ error: 'Failed to advance turn' });
  }
});

module.exports = router;
