// GM Helper — Socket.IO Handlers

const jwt = require('jsonwebtoken');

function setupSocketHandlers(io, prisma) {
  // Middleware to authenticate socket connections
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    const isTableScreen = socket.handshake.auth.isTableScreen;
    
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    if (isTableScreen) {
      try {
        const session = await prisma.session.findFirst({
          where: { tableScreenToken: token, status: 'live' }
        });
        if (session) {
          socket.isTableScreen = true;
          socket.sessionId = session.id;
          socket.tableScreenToken = token;
          return next();
        } else {
          return next(new Error('Authentication error: Invalid table screen token'));
        }
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

  io.on('connection', (socket) => {
    if (socket.isTableScreen) {
      console.log(`Table screen connected for session ${socket.sessionId}`);
      socket.join(`table_screen:${socket.tableScreenToken}`);
      socket.emit('joined_table_screen', { sessionId: socket.sessionId });
      
      socket.on('disconnect', () => {
        console.log(`Table screen disconnected`);
      });
      return; // Skip normal user logic
    }

    console.log(`User connected: ${socket.user.displayName} (${socket.user.userId})`);

    // Join a campaign room
    socket.on('join_campaign', async (data) => {
      try {
        const { campaignId } = data;
        if (!campaignId) return;

        // Verify membership
        const membership = await prisma.campaignMembership.findUnique({
          where: {
            campaignId_userId: {
              campaignId,
              userId: socket.user.userId,
            },
          },
        });

        if (membership && membership.status === 'active') {
          socket.join(`campaign:${campaignId}`);
          socket.join(`user:${socket.user.userId}`);
          // Also join role-specific sub-room
          if (membership.role === 'GM') {
            socket.join(`campaign:${campaignId}:gm`);
          } else {
            socket.join(`campaign:${campaignId}:player`);
            // Store player info on socket for quick reference
            socket.campaignId = campaignId;
            socket.role = 'PLAYER';
            socket.to(`campaign:${campaignId}:gm`).emit('player_joined', { userId: socket.user.userId, displayName: socket.user.displayName });
          }
          console.log(`User ${socket.user.displayName} joined campaign:${campaignId} as ${membership.role}`);
          socket.emit('joined_campaign', { campaignId, role: membership.role });
        } else {
          socket.emit('error', { message: 'No access to this campaign' });
        }
      } catch (err) {
        console.error('Socket join_campaign error:', err);
      }
    });

    // Leave campaign room
    socket.on('leave_campaign', (data) => {
      const { campaignId } = data;
      socket.leave(`campaign:${campaignId}`);
      socket.leave(`campaign:${campaignId}:gm`);
      socket.leave(`campaign:${campaignId}:player`);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.displayName}`);
      if (socket.campaignId && socket.role === 'PLAYER') {
        socket.to(`campaign:${socket.campaignId}:gm`).emit('player_left', { userId: socket.user.userId, displayName: socket.user.displayName });
      }
    });
  });
}

module.exports = {
  setupSocketHandlers,
};
