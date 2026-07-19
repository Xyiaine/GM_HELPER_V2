// GM Helper — Player Dice Routes

const express = require('express');
const { verifyToken, requireCampaignAccess, requirePlayer } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { playerDiceRollSchema } = require('../../validators/schemas');
const { computeCharacterRoll } = require('../../services/dice');

const router = express.Router({ mergeParams: true });

router.use(verifyToken);
router.use(requireCampaignAccess);
router.use(requirePlayer);

// Roll dice
router.post('/', validate(playerDiceRollSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const io = req.app.get('io');
    
    const { type, ability, skill, expression, label, advantage, disadvantage } = req.body;

    const character = await prisma.character.findFirst({
      where: {
        campaignId: req.campaignId,
        ownerUserId: req.user.id,
      },
    });

    if (!character && type !== 'free') {
      return res.status(400).json({ error: 'Character required for stat-based rolls' });
    }

    const rollRequest = { type, ability, skill, expression, label, advantage, disadvantage };
    let result;
    
    try {
      result = computeCharacterRoll(character || {}, rollRequest);
    } catch (computeErr) {
      return res.status(400).json({ error: computeErr.message });
    }

    // Save roll
    const savedRoll = await prisma.diceRoll.create({
      data: {
        campaignId: req.campaignId,
        userId: req.user.id,
        characterId: character ? character.id : null,
        expression: result.expression,
        result: result.total,
        details: result.details,
        label: result.label,
        visibleToAll: true,
      },
      include: {
        character: { select: { name: true } },
      }
    });

    // Broadcast roll to everyone in the campaign
    io.to(`campaign:${req.campaignId}`).emit('dice:rolled', {
      id: savedRoll.id,
      expression: result.expression,
      result: result.total,
      details: result.details,
      label: result.label,
      rolledBy: req.user.displayName,
      rolledByRole: 'PLAYER',
      timestamp: savedRoll.createdAt,
    });

    res.json(savedRoll);
  } catch (err) {
    console.error('Error rolling dice:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get dice history for this player only
router.get('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const rolls = await prisma.diceRoll.findMany({
      where: {
        campaignId: req.campaignId,
        userId: req.user.id, // Only their own rolls
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json(rolls);
  } catch (err) {
    console.error('Error getting dice rolls:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
