// GM Helper — Player Session Routes

const express = require('express');
const { verifyToken, requireCampaignAccess, requirePlayer } = require('../../middleware/auth');

const router = express.Router({ mergeParams: true });

router.use(verifyToken);
router.use(requireCampaignAccess);
router.use(requirePlayer);

// Get current session info (limited view)
router.get('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    
    // Get live session
    const session = await prisma.session.findFirst({
      where: {
        campaignId: req.campaignId,
        status: 'live',
      },
      include: {
        campaign: { select: { name: true } },
      }
    });

    if (!session) {
      return res.json({ status: 'no_active_session' });
    }

    let turnInfo = null;

    // If initiative is shared, figure out if it's the player's turn
    if (session.shareInitiative && session.activeEncounterId) {
      const encounter = await prisma.encounter.findUnique({
        where: { id: session.activeEncounterId },
        include: { combatants: { orderBy: { orderIndex: 'asc' } } },
      });

      if (encounter && encounter.combatants.length > 0) {
        const currentCombatant = encounter.combatants[encounter.currentTurnIndex % encounter.combatants.length];
        
        // Check if the current combatant is this user's character
        const character = await prisma.character.findFirst({
          where: { campaignId: req.campaignId, ownerUserId: req.user.id }
        });

        if (character && currentCombatant.characterId === character.id) {
          turnInfo = { isMyTurn: true, round: encounter.currentRound };
        } else {
          turnInfo = { isMyTurn: false, round: encounter.currentRound };
        }
      }
    }

    res.json({
      status: 'live',
      sessionId: session.id,
      startedAt: session.startedAt,
      turnInfo
    });
  } catch (err) {
    console.error('Error getting session info:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /recap — Récapitulatif de la dernière séance terminée
router.get('/recap', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const lastSession = await prisma.session.findFirst({
      where: { campaignId: req.campaignId, status: 'ended' },
      orderBy: { endedAt: 'desc' },
      select: { id: true, summary: true, startedAt: true, endedAt: true },
    });

    if (!lastSession || !lastSession.summary) {
      return res.json({ recap: null });
    }

    res.json({ recap: lastSession.summary, session: lastSession });
  } catch (err) {
    console.error('Get player recap error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
