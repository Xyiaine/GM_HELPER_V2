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

    res.json(character);
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
    });

    // Notify GM of the update
    io.to(`campaign:${req.campaignId}:gm`).emit('character:updated', {
      characterId: updatedCharacter.id,
      updates: dataToUpdate,
      updatedBy: req.user.displayName,
    });

    res.json(updatedCharacter);
  } catch (err) {
    console.error('Error updating player character:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
