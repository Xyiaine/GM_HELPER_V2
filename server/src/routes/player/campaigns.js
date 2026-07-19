const express = require('express');
const { verifyToken } = require('../../middleware/auth');

const router = express.Router();

router.use(verifyToken);

// Get campaigns where the user is a player
router.get('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const memberships = await prisma.campaignMembership.findMany({
      where: { userId: req.user.id, role: 'PLAYER', status: 'active' },
      include: {
        campaign: true,
      },
      orderBy: { joinedAt: 'desc' },
    });

    res.json(memberships.map(m => ({ ...m.campaign, role: m.role, joinedAt: m.joinedAt })));
  } catch (err) {
    console.error('Error fetching player campaigns:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
