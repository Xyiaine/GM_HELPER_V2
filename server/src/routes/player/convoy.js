// GM Helper — Player Convoy Routes
// Read-only access: current event, vehicle states, resources
const express = require('express');
const { verifyToken, requireCampaignAccess, requireMember } = require('../../middleware/auth');

const router = express.Router({ mergeParams: true });
router.use(verifyToken, requireCampaignAccess, requireMember);

// ─── GET active convoy for this campaign (player view) ───────
router.get('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    // Find in-progress convoys for this campaign
    const convoys = await prisma.convoy.findMany({
      where: {
        campaignId: req.campaignId,
        status: 'in_progress',
      },
      select: {
        id: true,
        name: true,
        status: true,
        cargoType: true,
        fuel: true,
        water: true,
        food: true,
        medicine: true,
        ammo: true,
        currentStepIndex: true,
        totalSteps: true,
        originCity: {
          select: { location: { select: { name: true } } },
        },
        destCity: {
          select: { location: { select: { name: true } } },
        },
        vehicles: {
          select: {
            id: true,
            type: true,
            name: true,
            hpCurrent: true,
            hpMax: true,
            passengers: true,
            isDestroyed: true,
          },
          orderBy: { createdAt: 'asc' },
        },
        // Only the ACTIVE event is visible to players
        events: {
          where: { status: 'active' },
          select: {
            id: true,
            orderIndex: true,
            category: true,
            title: true,
            description: true,
            severity: true,
            status: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({ convoys });
  } catch (err) {
    console.error('Player list convoys error:', err);
    res.status(500).json({ error: 'Failed to list convoys' });
  }
});

// ─── GET single convoy (player view) ─────────────────────────
router.get('/:convoyId', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const convoy = await prisma.convoy.findUnique({
      where: { id: req.params.convoyId },
      select: {
        id: true,
        name: true,
        status: true,
        cargoType: true,
        fuel: true,
        water: true,
        food: true,
        medicine: true,
        ammo: true,
        currentStepIndex: true,
        totalSteps: true,
        originCity: {
          select: { location: { select: { name: true } } },
        },
        destCity: {
          select: { location: { select: { name: true } } },
        },
        vehicles: {
          select: {
            id: true,
            type: true,
            name: true,
            hpCurrent: true,
            hpMax: true,
            passengers: true,
            isDestroyed: true,
          },
          orderBy: { createdAt: 'asc' },
        },
        events: {
          where: { status: 'active' },
          select: {
            id: true,
            orderIndex: true,
            category: true,
            title: true,
            description: true,
            severity: true,
            status: true,
          },
        },
      },
    });

    if (!convoy) {
      return res.status(404).json({ error: 'Convoy not found' });
    }

    res.json({ convoy });
  } catch (err) {
    console.error('Player get convoy error:', err);
    res.status(500).json({ error: 'Failed to get convoy' });
  }
});

module.exports = router;
