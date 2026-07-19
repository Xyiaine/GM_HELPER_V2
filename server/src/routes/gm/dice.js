// GM Helper — GM Dice Routes
const express = require('express');
const { verifyToken, requireCampaignAccess, requireGM } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { diceRollSchema } = require('../../validators/schemas');
const { rollDice } = require('../../services/dice');

const router = express.Router({ mergeParams: true });

router.use(verifyToken, requireCampaignAccess, requireGM);

// POST / — Roll dice
router.post('/', validate(diceRollSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { expression, label, visibleToAll = true, characterId } = req.body;

    const result = rollDice(expression);

    const roll = await prisma.diceRoll.create({
      data: {
        campaignId: req.campaignId,
        userId: req.user.id,
        characterId,
        expression,
        result: result.total,
        details: JSON.stringify(result),
        label,
        visibleToAll,
      },
    });

    // Broadcast if visible
    const io = req.app.get('io');
    if (io && visibleToAll) {
      io.to(`campaign:${req.campaignId}`).emit('dice:rolled', {
        id: roll.id,
        expression,
        result: result.total,
        details: result.details,
        label,
        rolledBy: req.user.displayName,
        rolledByRole: 'GM',
        timestamp: roll.createdAt,
      });
    }

    res.json({ roll: { ...roll, parsed: result } });
  } catch (err) {
    if (err.message === 'Invalid dice parameters') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Failed to roll dice' });
  }
});

// GET / — Dice history
router.get('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { limit = 50 } = req.query;
    const rolls = await prisma.diceRoll.findMany({
      where: { campaignId: req.campaignId },
      include: {
        user: { select: { id: true, displayName: true } },
        character: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit, 10),
    });
    res.json({ rolls });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get dice history' });
  }
});

module.exports = router;
