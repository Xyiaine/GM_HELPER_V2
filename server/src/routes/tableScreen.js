const express = require('express');

const router = express.Router();

// GET /api/v1/table-screen/:token
// No verifyToken middleware — authenticated by token possession
router.get('/:token', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const session = await prisma.session.findFirst({
      where: { tableScreenToken: req.params.token, status: 'live' },
    });
    
    if (!session) {
      return res.status(404).json({ error: 'Invalid or expired token' });
    }
    
    // Return active broadcasts and history for the session
    const broadcasts = await prisma.spotlightBroadcast.findMany({
      where: { sessionId: session.id },
      orderBy: { createdAt: 'desc' },
    });
    
    res.json({ session: { id: session.id, mode: session.mode }, broadcasts });
  } catch (err) {
    console.error('Table screen error:', err);
    res.status(500).json({ error: 'Failed to load table screen data' });
  }
});

module.exports = router;
