// GM Helper — GM Character Routes
const express = require('express');
const { verifyToken, requireCampaignAccess, requireGM } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { createCharacterSchema, updateCharacterSchema } = require('../../validators/schemas');
const { calculateHybridProgression } = require('../../utils/hybridProgression');
const { getProficiencyBonus } = require('../../utils/dnd5eMath');

const router = express.Router({ mergeParams: true });

router.use(verifyToken, requireCampaignAccess, requireGM);

// GET / — List all characters in campaign
router.get('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const characters = await prisma.character.findMany({
      where: { campaignId: req.campaignId },
      include: {
        owner: { select: { id: true, displayName: true, email: true } },
        inventoryItems: { include: { item: true } },
      },
      orderBy: { name: 'asc' },
    });
    res.json({ characters });
  } catch (err) {
    console.error('List characters error:', err);
    res.status(500).json({ error: 'Failed to list characters' });
  }
});

// POST / — Create a character
router.post('/', validate(createCharacterSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    
    let data = { ...req.body, campaignId: req.campaignId };
    
    // Server-side derivations
    if (data.unlockedSkills) {
      let parsedSkills = [];
      try {
        parsedSkills = typeof data.unlockedSkills === 'string' ? JSON.parse(data.unlockedSkills) : data.unlockedSkills;
      } catch (e) {}
      
      const { classes, totalLevel } = calculateHybridProgression(parsedSkills);
      data.level = totalLevel;
      data.proficiencyBonus = getProficiencyBonus(totalLevel);
      data.class = JSON.stringify(classes);
    }

    const character = await prisma.character.create({
      data,
      include: { owner: { select: { id: true, displayName: true } } },
    });
    res.status(201).json({ character });
  } catch (err) {
    console.error('Create character error:', err);
    res.status(500).json({ error: 'Failed to create character' });
  }
});

// GET /:id — Get character detail
router.get('/:id', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const character = await prisma.character.findFirst({
      where: { id: req.params.id, campaignId: req.campaignId },
      include: {
        owner: { select: { id: true, displayName: true, email: true } },
        inventoryItems: { include: { item: true } },
      },
    });
    if (!character) return res.status(404).json({ error: 'Character not found' });
    res.json({ character });
  } catch (err) {
    console.error('Get character error:', err);
    res.status(500).json({ error: 'Failed to get character' });
  }
});

// PUT /:id — Update character
router.put('/:id', validate(updateCharacterSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    
    let data = { ...req.body };
    
    // Server-side derivations
    if (data.unlockedSkills !== undefined) {
      let parsedSkills = [];
      try {
        parsedSkills = typeof data.unlockedSkills === 'string' ? JSON.parse(data.unlockedSkills) : data.unlockedSkills;
      } catch (e) {}
      
      const { classes, totalLevel } = calculateHybridProgression(parsedSkills);
      data.level = totalLevel;
      data.proficiencyBonus = getProficiencyBonus(totalLevel);
      data.class = JSON.stringify(classes);
    }

    const character = await prisma.character.updateMany({
      where: { id: req.params.id, campaignId: req.campaignId },
      data,
    });
    if (character.count === 0) return res.status(404).json({ error: 'Character not found' });

    const updated = await prisma.character.findUnique({
      where: { id: req.params.id },
      include: { owner: { select: { id: true, displayName: true } } },
    });

    // Emit real-time update if character owner is connected
    const io = req.app.get('io');
    if (io && updated.ownerUserId) {
      io.to(`campaign:${req.campaignId}`).emit('character:updated', {
        characterId: updated.id,
        updatedBy: 'GM',
      });
    }

    res.json({ character: updated });
  } catch (err) {
    console.error('Update character error:', err);
    res.status(500).json({ error: 'Failed to update character' });
  }
});

// DELETE /:id — Delete character
router.delete('/:id', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const result = await prisma.character.deleteMany({
      where: { id: req.params.id, campaignId: req.campaignId },
    });
    if (result.count === 0) return res.status(404).json({ error: 'Character not found' });
    res.json({ message: 'Character deleted' });
  } catch (err) {
    console.error('Delete character error:', err);
    res.status(500).json({ error: 'Failed to delete character' });
  }
});

// PATCH /:id/toggle-edit — Toggle player edit permission
router.patch('/:id/toggle-edit', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const character = await prisma.character.findFirst({
      where: { id: req.params.id, campaignId: req.campaignId },
    });
    if (!character) return res.status(404).json({ error: 'Character not found' });

    const updated = await prisma.character.update({
      where: { id: req.params.id },
      data: { canBeEditedByPlayer: !character.canBeEditedByPlayer },
    });

    res.json({ character: updated, canBeEditedByPlayer: updated.canBeEditedByPlayer });
  } catch (err) {
    console.error('Toggle edit error:', err);
    res.status(500).json({ error: 'Failed to toggle edit permission' });
  }
});

// POST /:id/inventory — Add item to character inventory
router.post('/:id/inventory', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { itemId, quantity = 1 } = req.body;
    const character = await prisma.character.findFirst({
      where: { id: req.params.id, campaignId: req.campaignId },
    });
    if (!character) return res.status(404).json({ error: 'Character not found' });

    const inventoryItem = await prisma.characterInventoryItem.upsert({
      where: { characterId_itemId: { characterId: req.params.id, itemId } },
      update: { quantity: { increment: quantity } },
      create: { characterId: req.params.id, itemId, quantity },
      include: { item: true },
    });

    res.json({ inventoryItem });
  } catch (err) {
    console.error('Add inventory error:', err);
    res.status(500).json({ error: 'Failed to add item to inventory' });
  }
});

// DELETE /:id/inventory/:itemId — Remove item from inventory
router.delete('/:id/inventory/:itemId', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    await prisma.characterInventoryItem.delete({
      where: { characterId_itemId: { characterId: req.params.id, itemId: req.params.itemId } },
    });
    res.json({ message: 'Item removed from inventory' });
  } catch (err) {
    console.error('Remove inventory error:', err);
    res.status(500).json({ error: 'Failed to remove item from inventory' });
  }
});

module.exports = router;
