// GM Helper — GM Campaign Routes
const express = require('express');
const { verifyToken, requireCampaignAccess, requireGM } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { createCampaignSchema, updateCampaignSchema, invitePlayerSchema } = require('../../validators/schemas');

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// ============================================================
// GET / — List campaigns where user is GM
// ============================================================
router.get('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const memberships = await prisma.campaignMembership.findMany({
      where: { userId: req.user.id, role: 'GM', status: 'active' },
      include: {
        campaign: {
          include: {
            _count: {
              select: {
                characters: true,
                npcs: true,
                locations: true,
                quests: true,
              },
            },
            memberships: {
              select: { userId: true, role: true, status: true,
                user: { select: { id: true, displayName: true, email: true } }
              },
            },
          },
        },
      },
    });

    const campaigns = memberships.map(m => ({
      ...m.campaign,
      memberCount: m.campaign.memberships.length,
    }));

    res.json({ campaigns });
  } catch (err) {
    console.error('List campaigns error:', err);
    res.status(500).json({ error: 'Failed to list campaigns' });
  }
});

// ============================================================
// POST / — Create a new campaign
// ============================================================
router.post('/', validate(createCampaignSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { name, description, gameSystem } = req.body;

    const campaign = await prisma.campaign.create({
      data: {
        name,
        description,
        gameSystem: gameSystem || 'Custom',
        gmUserId: req.user.id,
        memberships: {
          create: {
            userId: req.user.id,
            role: 'GM',
            status: 'active',
          },
        },
      },
      include: {
        memberships: {
          include: {
            user: { select: { id: true, displayName: true, email: true } },
          },
        },
      },
    });

    res.status(201).json({ campaign });
  } catch (err) {
    console.error('Create campaign error:', err);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

// ============================================================
// GET /:campaignId — Get campaign details (GM only)
// ============================================================
router.get('/:campaignId', requireCampaignAccess, requireGM, async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const campaign = await prisma.campaign.findUnique({
      where: { id: req.campaignId },
      include: {
        _count: {
          select: {
            characters: true,
            npcs: true,
            locations: true,
            quests: true,
            encounters: true,
            items: true,
            notes: true,
            sessions: true,
          },
        },
        memberships: {
          include: {
            user: { select: { id: true, displayName: true, email: true } },
          },
        },
      },
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json({ campaign });
  } catch (err) {
    console.error('Get campaign error:', err);
    res.status(500).json({ error: 'Failed to get campaign' });
  }
});

// ============================================================
// PUT /:campaignId — Update campaign
// ============================================================
router.put('/:campaignId', requireCampaignAccess, requireGM, validate(updateCampaignSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const campaign = await prisma.campaign.update({
      where: { id: req.campaignId },
      data: req.body,
    });

    res.json({ campaign });
  } catch (err) {
    console.error('Update campaign error:', err);
    res.status(500).json({ error: 'Failed to update campaign' });
  }
});

// ============================================================
// DELETE /:campaignId — Delete campaign
// ============================================================
router.delete('/:campaignId', requireCampaignAccess, requireGM, async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    await prisma.campaign.delete({ where: { id: req.campaignId } });
    res.json({ message: 'Campaign deleted' });
  } catch (err) {
    console.error('Delete campaign error:', err);
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
});

// ============================================================
// POST /:campaignId/invite — Invite a player
// ============================================================
router.post('/:campaignId/invite', requireCampaignAccess, requireGM, validate(invitePlayerSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { email } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found with this email' });
    }

    // Check if already a member
    const existing = await prisma.campaignMembership.findUnique({
      where: {
        campaignId_userId: {
          campaignId: req.campaignId,
          userId: user.id,
        },
      },
    });

    if (existing) {
      return res.status(409).json({ error: 'User is already a member of this campaign' });
    }

    // Create membership
    const membership = await prisma.campaignMembership.create({
      data: {
        campaignId: req.campaignId,
        userId: user.id,
        role: 'PLAYER',
        status: 'active',
      },
      include: {
        user: { select: { id: true, displayName: true, email: true } },
      },
    });

    res.status(201).json({ membership });
  } catch (err) {
    console.error('Invite player error:', err);
    res.status(500).json({ error: 'Failed to invite player' });
  }
});

// ============================================================
// DELETE /:campaignId/members/:userId — Remove a member
// ============================================================
router.delete('/:campaignId/members/:userId', requireCampaignAccess, requireGM, async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { userId } = req.params;

    // Can't remove yourself as GM
    if (userId === req.user.id) {
      return res.status(400).json({ error: 'Cannot remove yourself as GM' });
    }

    await prisma.campaignMembership.delete({
      where: {
        campaignId_userId: {
          campaignId: req.campaignId,
          userId,
        },
      },
    });

    res.json({ message: 'Member removed' });
  } catch (err) {
    console.error('Remove member error:', err);
    res.status(500).json({ error: 'Failed to remove member' });
  }
});

module.exports = router;
