// GM Helper — Socket.IO Handlers

const jwt = require('jsonwebtoken');

function setupSocketHandlers(io, prisma) {
  // ─── Authentication ────────────────────────────────────────────────
  // Two kinds of clients connect here:
  //   1. Authenticated users (GM desktop app, player mobile app) — JWT in auth.token
  //   2. The public table screen — its session token, flagged by auth.isTableScreen
  //
  // The table screen token has historically been sent as `tableScreenToken` while
  // the server only read `token`. Both shapes are accepted so the TV screen can
  // authenticate regardless of which client version is deployed.
  io.use(async (socket, next) => {
    const auth = socket.handshake.auth || {};
    const isTableScreen = auth.isTableScreen === true || Boolean(auth.tableScreenToken);
    const token = auth.token || auth.tableScreenToken;

    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    if (isTableScreen) {
      try {
        const session = await prisma.session.findFirst({
          where: { tableScreenToken: token, status: 'live' },
        });
        if (!session) {
          return next(new Error('Authentication error: Invalid table screen token'));
        }
        socket.isTableScreen = true;
        socket.sessionId = session.id;
        socket.campaignId = session.campaignId;
        socket.tableScreenToken = token;
        return next();
      } catch (err) {
        return next(new Error('Authentication error: DB error'));
      }
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // { userId, email, displayName }
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // ─── Room helpers ──────────────────────────────────────────────────
  // The campaign room is the backbone of the realtime layer: every broadcast
  // (spotlight, session messages, timers, convoys, encounters, map reveals) is
  // addressed to `campaign:{id}` or one of its role sub-rooms.
  //
  // Clients have historically emitted both `join_campaign` and `join:campaign`,
  // and sent the payload either as `{ campaignId }` or as a bare string. A
  // mismatch leaves the client in no room at all, which is invisible from the
  // UI: the socket connects, nothing errors, and no event ever arrives.
  // Both spellings and both payload shapes are therefore accepted on purpose.
  function normaliseCampaignId(data) {
    if (!data) return null;
    if (typeof data === 'string') return data;
    return data.campaignId || data.campaign || null;
  }

  async function handleJoinCampaign(socket, data) {
    try {
      const campaignId = normaliseCampaignId(data);
      if (!campaignId) {
        console.warn(`join_campaign called without a campaign id by ${socket.user.displayName}`);
        return;
      }

      const membership = await prisma.campaignMembership.findUnique({
        where: {
          campaignId_userId: {
            campaignId,
            userId: socket.user.userId,
          },
        },
      });

      if (!membership || membership.status !== 'active') {
        socket.emit('error', { message: 'No access to this campaign' });
        return;
      }

      socket.join(`campaign:${campaignId}`);
      socket.join(`user:${socket.user.userId}`);

      if (membership.role === 'GM') {
        socket.join(`campaign:${campaignId}:gm`);
      } else {
        socket.join(`campaign:${campaignId}:player`);
        socket.campaignId = campaignId;
        socket.role = 'PLAYER';
        socket.to(`campaign:${campaignId}:gm`).emit('player_joined', {
          userId: socket.user.userId,
          displayName: socket.user.displayName,
        });
      }

      console.log(`User ${socket.user.displayName} joined campaign:${campaignId} as ${membership.role}`);
      socket.emit('joined_campaign', { campaignId, role: membership.role });
    } catch (err) {
      console.error('Socket join campaign error:', err);
    }
  }

  function handleLeaveCampaign(socket, data) {
    const campaignId = normaliseCampaignId(data);
    if (!campaignId) return;
    socket.leave(`campaign:${campaignId}`);
    socket.leave(`campaign:${campaignId}:gm`);
    socket.leave(`campaign:${campaignId}:player`);
  }

  // ─── Connection ────────────────────────────────────────────────────
  io.on('connection', (socket) => {
    if (socket.isTableScreen) {
      console.log(`Table screen connected for session ${socket.sessionId}`);

      // `table_screen:{token}` targets this single screen.
      // `campaign:{id}:table_screen` targets every screen of the campaign and is
      // used for public state that is not tied to one session (encounters, maps).
      socket.join(`table_screen:${socket.tableScreenToken}`);
      if (socket.campaignId) {
        socket.join(`campaign:${socket.campaignId}:table_screen`);
      }

      socket.emit('joined_table_screen', { sessionId: socket.sessionId });

      socket.on('disconnect', () => {
        console.log('Table screen disconnected');
      });
      return; // Skip normal user logic
    }

    console.log(`User connected: ${socket.user.displayName} (${socket.user.userId})`);

    // Accept both spellings — see normaliseCampaignId above.
    socket.on('join_campaign', (data) => handleJoinCampaign(socket, data));
    socket.on('join:campaign', (data) => handleJoinCampaign(socket, data));

    socket.on('leave_campaign', (data) => handleLeaveCampaign(socket, data));
    socket.on('leave:campaign', (data) => handleLeaveCampaign(socket, data));

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.displayName}`);
      if (socket.campaignId && socket.role === 'PLAYER') {
        socket.to(`campaign:${socket.campaignId}:gm`).emit('player_left', {
          userId: socket.user.userId,
          displayName: socket.user.displayName,
        });
      }
    });
  });
}

module.exports = {
  setupSocketHandlers,
};
