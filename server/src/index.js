// GM Helper — Server Entry Point
require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');

const { setupSocketHandlers } = require('./sockets');
const { restoreTimersFromDB } = require('./services/questTimers');
const authRoutes = require('./routes/auth');
const gmCampaignRoutes = require('./routes/gm/campaigns');
const gmCharacterRoutes = require('./routes/gm/characters');
const gmNpcRoutes = require('./routes/gm/npcs');
const gmLocationRoutes = require('./routes/gm/locations');
const gmCityRoutes = require('./routes/gm/cities');
const gmQuestRoutes = require('./routes/gm/quests');
const gmEncounterRoutes = require('./routes/gm/encounters');
const gmBestiaryRoutes = require('./routes/gm/bestiary');
const gmItemRoutes = require('./routes/gm/items');
const gmNoteRoutes = require('./routes/gm/notes');
const gmDiceRoutes = require('./routes/gm/dice');
const gmSessionRoutes = require('./routes/gm/sessions');
const gmTagRoutes = require('./routes/gm/tags');
const gmLinkRoutes = require('./routes/gm/links');
const gmSearchRoutes = require('./routes/gm/search');
const gmUploadRoutes = require('./routes/gm/uploads');
const gmMapsRoutes = require('./routes/gm/maps');
const gmWorldMapRoutes = require('./routes/gm/worldMap');
const gmConvoyRoutes = require('./routes/gm/convoys');
const gmSkillTreeRoutes = require('./routes/gm/skillTrees');
const gmVehicleRoutes = require('./routes/gm/vehicles');
const playerCampaignRoutes = require('./routes/player/campaigns');
const playerCharacterRoutes = require('./routes/player/character');
const playerDiceRoutes = require('./routes/player/dice');
const playerSessionRoutes = require('./routes/player/session');
const playerConvoyRoutes = require('./routes/player/convoy');
const playerPrivateNotesRoutes = require('./routes/player/privateNotes');
const tableScreenRoutes = require('./routes/tableScreen');

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
});

// Make prisma and io available to routes
app.set('prisma', prisma);
app.set('io', io);

// ============================================================
// MIDDLEWARE
// ============================================================

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', apiLimiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts, please try again later.' },
});
app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/register', authLimiter);

// Static files for uploads
app.use('/uploads', express.static(process.env.UPLOAD_DIR || './uploads'));

// ============================================================
// ROUTES
// ============================================================

// Auth (public)
app.use('/api/v1/auth', authRoutes);

// GM endpoints (protected — GM role required)
app.use('/api/v1/gm/campaigns', gmCampaignRoutes);
app.use('/api/v1/gm/campaigns/:campaignId/characters', gmCharacterRoutes);
app.use('/api/v1/gm/campaigns/:campaignId/npcs', gmNpcRoutes);
app.use('/api/v1/gm/campaigns/:campaignId/locations', gmLocationRoutes);
app.use('/api/v1/gm/campaigns/:campaignId/cities', gmCityRoutes);
app.use('/api/v1/gm/campaigns/:campaignId/quests', gmQuestRoutes);
app.use('/api/v1/gm/campaigns/:campaignId/encounters', gmEncounterRoutes);
app.use('/api/v1/gm/campaigns/:campaignId/bestiary', gmBestiaryRoutes);
app.use('/api/v1/gm/campaigns/:campaignId/items', gmItemRoutes);
app.use('/api/v1/gm/campaigns/:campaignId/notes', gmNoteRoutes);
app.use('/api/v1/gm/campaigns/:campaignId/dice', gmDiceRoutes);
app.use('/api/v1/gm/campaigns/:campaignId/sessions', gmSessionRoutes);
app.use('/api/v1/gm/campaigns/:campaignId/tags', gmTagRoutes);
app.use('/api/v1/gm/campaigns/:campaignId/links', gmLinkRoutes);
app.use('/api/v1/gm/campaigns/:campaignId/search', gmSearchRoutes);
app.use('/api/v1/gm/campaigns/:campaignId/uploads', gmUploadRoutes);
app.use('/api/v1/gm/campaigns/:campaignId/maps', gmMapsRoutes);
app.use('/api/v1/gm/campaigns/:campaignId/world-map', gmWorldMapRoutes);
app.use('/api/v1/gm/campaigns/:campaignId/convoys', gmConvoyRoutes);
app.use('/api/v1/gm/campaigns/:campaignId/skill-trees', gmSkillTreeRoutes);
app.use('/api/v1/gm/campaigns/:campaignId/vehicles', gmVehicleRoutes);

// Player endpoints (protected — Player role, own data only)
app.use('/api/v1/player/campaigns', playerCampaignRoutes);
app.use('/api/v1/player/campaigns/:campaignId/character', playerCharacterRoutes);
app.use('/api/v1/player/campaigns/:campaignId/dice', playerDiceRoutes);
app.use('/api/v1/player/campaigns/:campaignId/session', playerSessionRoutes);
app.use('/api/v1/player/campaigns/:campaignId/convoys', playerConvoyRoutes);
app.use('/api/v1/player/campaigns/:campaignId/private-notes', playerPrivateNotesRoutes);

// Public table screen endpoint (token-auth)
app.use('/api/v1/table-screen', tableScreenRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend static build in production (SPA fallback)
const path = require('path');
const fs = require('fs');
const clientDistPath = path.join(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  // 404 handler for API/unserved routes
  app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

// ============================================================
// SOCKET.IO
// ============================================================

setupSocketHandlers(io, prisma);
restoreTimersFromDB(prisma, io);

// ============================================================
// START SERVER
// ============================================================

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🎲 GM Helper API running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down...');
  await prisma.$disconnect();
  server.close();
  process.exit(0);
});

module.exports = { app, server, prisma, io };
