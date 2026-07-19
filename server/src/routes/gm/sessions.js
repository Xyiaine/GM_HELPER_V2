// GM Helper — GM Session Routes (Live Mode)
const express = require('express');
const { verifyToken, requireCampaignAccess, requireGM } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { createSessionSchema, updateSessionSchema, createSpotlightSchema } = require('../../validators/schemas');
const crypto = require('crypto');

const router = express.Router({ mergeParams: true });

router.use(verifyToken, requireCampaignAccess, requireGM);

router.get('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const sessions = await prisma.session.findMany({
      where: { campaignId: req.campaignId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ sessions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to list sessions' });
  }
});

router.post('/', validate(createSessionSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { mode, ...rest } = req.body;
    let data = { ...rest, campaignId: req.campaignId };
    
    if (mode) data.mode = mode;
    
    if (data.mode === 'in_person') {
      data.tableScreenToken = crypto.randomBytes(32).toString('hex');
    }
    
    const session = await prisma.session.create({ data });
    res.status(201).json({ session });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create session' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const session = await prisma.session.findFirst({
      where: { id: req.params.id, campaignId: req.campaignId },
    });
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json({ session });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get session' });
  }
});

// Active connected players via sockets
router.get('/:id/players', async (req, res) => {
  try {
    const io = req.app.get('io');
    if (!io) return res.json({ players: [] });

    // Fetch sockets in the player room for this campaign
    const sockets = await io.in(`campaign:${req.campaignId}:player`).fetchSockets();
    
    // Extract unique players (a player might have multiple tabs open)
    const playersMap = new Map();
    for (const s of sockets) {
      if (s.user) {
        playersMap.set(s.user.userId, { userId: s.user.userId, displayName: s.user.displayName });
      }
    }
    
    res.json({ players: Array.from(playersMap.values()) });
  } catch (err) {
    console.error('Error fetching connected players:', err);
    res.status(500).json({ error: 'Failed to fetch connected players' });
  }
});

router.put('/:id', validate(updateSessionSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const session = await prisma.session.findFirst({
      where: { id: req.params.id, campaignId: req.campaignId },
    });
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const updates = { ...req.body };
    if (updates.status === 'live' && session.status !== 'live') {
      const incompleteTimed = await prisma.questNode.findMany({
        where: {
          quest: { campaignId: req.campaignId, status: 'active' },
          isTimed: true,
          timeoutNodeId: null,
        },
      });
      if (incompleteTimed.length > 0) {
        return res.status(400).json({
          error: 'Cannot start session: timed nodes without timeout target',
          nodes: incompleteTimed.map(n => ({ id: n.id, title: n.title })),
        });
      }
      if (!session.startedAt) updates.startedAt = new Date();
    }
    if (updates.status === 'ended' && !session.endedAt) {
      updates.endedAt = new Date();
    }

    const updated = await prisma.session.update({
      where: { id: req.params.id },
      data: updates,
    });

    // Notify players of session status change
    const io = req.app.get('io');
    if (io) {
      if (updated.status === 'live') {
        io.to(`campaign:${req.campaignId}`).emit('session:started', {
          sessionId: updated.id,
          campaignId: req.campaignId,
        });
      } else if (updated.status === 'ended') {
        io.to(`campaign:${req.campaignId}`).emit('session:ended', {
          sessionId: updated.id,
          campaignId: req.campaignId,
        });
      }
    }

    res.json({ session: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update session' });
  }
});

// POST /:id/broadcast — Send a message to all players
router.post('/:id/broadcast', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    const io = req.app.get('io');
    if (io) {
      io.to(`campaign:${req.campaignId}`).emit('session:message', {
        message,
        from: 'GM',
        timestamp: new Date().toISOString(),
      });
    }

    res.json({ message: 'Broadcast sent' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to broadcast' });
  }
});

// GET /active — Get the active session for this campaign
router.get('/status/active', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const session = await prisma.session.findFirst({
      where: { campaignId: req.campaignId, status: 'live' },
    });
    res.json({ session: session || null, isLive: !!session });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check active session' });
  }
});

// --- Spotlight Endpoints ---
router.post('/:id/spotlight', validate(createSpotlightSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const session = await prisma.session.findUnique({ where: { id: req.params.id } });
    if (!session || session.campaignId !== req.campaignId) {
      return res.status(404).json({ error: 'Session not found' });
    }

    await prisma.spotlightBroadcast.updateMany({
      where: { sessionId: session.id, isActive: true },
      data: { isActive: false },
    });

    const broadcast = await prisma.spotlightBroadcast.create({
      data: { ...req.body, sessionId: session.id, isActive: true }
    });

    const io = req.app.get('io');
    if (io) {
      if (session.mode === 'remote') {
        io.to(`campaign:${req.campaignId}:player`).emit('spotlight_update', broadcast);
      } else if (session.mode === 'in_person' && session.tableScreenToken) {
        io.to(`table_screen:${session.tableScreenToken}`).emit('spotlight_update', broadcast);
      }
    }

    res.status(201).json({ broadcast });
  } catch (err) {
    res.status(500).json({ error: 'Failed to broadcast spotlight' });
  }
});

router.delete('/:id/spotlight', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const session = await prisma.session.findUnique({ where: { id: req.params.id } });
    if (!session || session.campaignId !== req.campaignId) {
      return res.status(404).json({ error: 'Session not found' });
    }

    await prisma.spotlightBroadcast.updateMany({
      where: { sessionId: session.id, isActive: true },
      data: { isActive: false },
    });

    const io = req.app.get('io');
    if (io) {
      if (session.mode === 'remote') {
        io.to(`campaign:${req.campaignId}:player`).emit('spotlight_clear');
      } else if (session.mode === 'in_person' && session.tableScreenToken) {
        io.to(`table_screen:${session.tableScreenToken}`).emit('spotlight_clear');
      }
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear spotlight' });
  }
});

router.get('/:id/spotlight/history', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const broadcasts = await prisma.spotlightBroadcast.findMany({
      where: { sessionId: req.params.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ broadcasts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get spotlight history' });
  }
});

router.get('/:id/table-screen-token', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const session = await prisma.session.findUnique({ where: { id: req.params.id } });
    if (!session || session.campaignId !== req.campaignId) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json({ token: session.tableScreenToken });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get token' });
  }
});

module.exports = router;
