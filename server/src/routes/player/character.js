// GM Helper — Player Character Routes

const express = require('express');
const { verifyToken, requireCampaignAccess, requirePlayer } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { playerUpdateCharacterSchema } = require('../../validators/schemas');
const { calculateHybridProgression } = require('../../utils/hybridProgression');
const { getProficiencyBonus } = require('../../utils/dnd5eMath');

const router = express.Router({ mergeParams: true });

// Use middlewares for all routes here
router.use(verifyToken);
router.use(requireCampaignAccess);
router.use(requirePlayer);

// Get player's character in the campaign
router.get('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    
    // Find the character owned by the user in this campaign
    const character = await prisma.character.findFirst({
      where: {
        campaignId: req.campaignId,
        ownerUserId: req.user.id,
      },
      include: {
        inventoryItems: {
          include: {
            item: true,
          },
        },
      },
    });

    if (!character) {
      return res.status(404).json({ error: 'Character not found for this user in this campaign' });
    }

    // Never expose GM private notes to the player
    const safeCharacter = { ...character };
    delete safeCharacter.gmNotes;

    res.json(safeCharacter);
  } catch (err) {
    console.error('Error fetching player character:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update player's character (if allowed)
router.put('/', validate(playerUpdateCharacterSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const io = req.app.get('io');
    const dataToUpdate = { ...req.body };

    // Prevent players from sending protected fields directly, even if schema allows them
    delete dataToUpdate.proficiencyBonus;
    delete dataToUpdate.level;
    delete dataToUpdate.gmNotes;

    // Server-side derivations
    if (dataToUpdate.unlockedSkills !== undefined) {
      let parsedSkills = [];
      try {
        parsedSkills = typeof dataToUpdate.unlockedSkills === 'string' ? JSON.parse(dataToUpdate.unlockedSkills) : dataToUpdate.unlockedSkills;
      } catch (e) {}
      
      const { totalLevel } = calculateHybridProgression(parsedSkills);
      dataToUpdate.level = totalLevel;
      dataToUpdate.proficiencyBonus = getProficiencyBonus(totalLevel);
    }

    // Find the character
    const character = await prisma.character.findFirst({
      where: {
        campaignId: req.campaignId,
        ownerUserId: req.user.id,
      },
    });

    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    if (!character.canBeEditedByPlayer) {
      return res.status(403).json({ error: 'The GM has not enabled editing for this character' });
    }

    const updatedCharacter = await prisma.character.update({
      where: { id: character.id },
      data: dataToUpdate,
      include: {
        inventoryItems: {
          include: {
            item: true,
          },
        },
      },
    });

    // Notify GM of the update
    io.to(`campaign:${req.campaignId}:gm`).emit('character:updated', {
      characterId: updatedCharacter.id,
      updates: dataToUpdate,
      updatedBy: req.user.displayName,
    });

    const safeResult = { ...updatedCharacter };
    delete safeResult.gmNotes;
    res.json(safeResult);
  } catch (err) {
    console.error('Error updating player character:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /inventory — Add item to character inventory
router.post('/inventory', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    let { itemId, name, type, weight, value, description, quantity = 1 } = req.body;

    const character = await prisma.character.findFirst({
      where: { campaignId: req.campaignId, ownerUserId: req.user.id },
    });
    if (!character) return res.status(404).json({ error: 'Character not found' });
    if (!character.canBeEditedByPlayer) return res.status(403).json({ error: 'Editing disabled by GM' });

    if (!itemId && name) {
      const createdItem = await prisma.item.create({
        data: {
          campaignId: req.campaignId,
          name: name.trim(),
          type: type || 'misc',
          weight: weight ? parseFloat(weight) : 0,
          value: value ? parseInt(value) : 0,
          description: description || '',
        },
      });
      itemId = createdItem.id;
    }

    if (!itemId) return res.status(400).json({ error: 'itemId or name is required' });

    const inventoryItem = await prisma.characterInventoryItem.upsert({
      where: { characterId_itemId: { characterId: character.id, itemId } },
      update: { quantity: { increment: quantity } },
      create: { characterId: character.id, itemId, quantity },
      include: { item: true },
    });

    res.json({ inventoryItem });
  } catch (err) {
    console.error('Player add inventory error:', err);
    res.status(500).json({ error: 'Failed to add item to inventory' });
  }
});

// PATCH /inventory/:itemId/toggle-equip — Toggle equipped state
router.patch('/inventory/:itemId/toggle-equip', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const character = await prisma.character.findFirst({
      where: { campaignId: req.campaignId, ownerUserId: req.user.id },
    });
    if (!character) return res.status(404).json({ error: 'Character not found' });
    if (!character.canBeEditedByPlayer) return res.status(403).json({ error: 'Editing disabled by GM' });

    const existing = await prisma.characterInventoryItem.findUnique({
      where: { characterId_itemId: { characterId: character.id, itemId: req.params.itemId } },
    });
    if (!existing) return res.status(404).json({ error: 'Item not found in inventory' });

    const updated = await prisma.characterInventoryItem.update({
      where: { characterId_itemId: { characterId: character.id, itemId: req.params.itemId } },
      data: { equipped: !existing.equipped },
      include: { item: true },
    });

    res.json({ inventoryItem: updated });
  } catch (err) {
    console.error('Player toggle equip error:', err);
    res.status(500).json({ error: 'Failed to toggle equip state' });
  }
});

// PATCH /inventory/:itemId/quantity — Update item quantity
router.patch('/inventory/:itemId/quantity', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { quantity } = req.body;
    if (typeof quantity !== 'number') return res.status(400).json({ error: 'Invalid quantity' });

    const character = await prisma.character.findFirst({
      where: { campaignId: req.campaignId, ownerUserId: req.user.id },
    });
    if (!character) return res.status(404).json({ error: 'Character not found' });
    if (!character.canBeEditedByPlayer) return res.status(403).json({ error: 'Editing disabled by GM' });

    if (quantity <= 0) {
      await prisma.characterInventoryItem.delete({
        where: { characterId_itemId: { characterId: character.id, itemId: req.params.itemId } },
      });
      return res.json({ message: 'Item deleted', removed: true });
    }

    const updated = await prisma.characterInventoryItem.update({
      where: { characterId_itemId: { characterId: character.id, itemId: req.params.itemId } },
      data: { quantity },
      include: { item: true },
    });

    res.json({ inventoryItem: updated });
  } catch (err) {
    console.error('Player update quantity error:', err);
    res.status(500).json({ error: 'Failed to update quantity' });
  }
});

// DELETE /inventory/:itemId — Remove item from inventory
router.delete('/inventory/:itemId', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const character = await prisma.character.findFirst({
      where: { campaignId: req.campaignId, ownerUserId: req.user.id },
    });
    if (!character) return res.status(404).json({ error: 'Character not found' });
    if (!character.canBeEditedByPlayer) return res.status(403).json({ error: 'Editing disabled by GM' });

    await prisma.characterInventoryItem.delete({
      where: { characterId_itemId: { characterId: character.id, itemId: req.params.itemId } },
    });
    res.json({ message: 'Item removed from inventory' });
  } catch (err) {
    console.error('Player remove inventory error:', err);
    res.status(500).json({ error: 'Failed to remove item from inventory' });
  }
});

module.exports = router;
