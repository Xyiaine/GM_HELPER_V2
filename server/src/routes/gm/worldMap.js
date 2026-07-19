// GM Helper — World Map Routes
// One world map per campaign: GET (auto-create), PUT (update state), POST base-image upload

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { verifyToken, requireCampaignAccess, requireGM } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { z } = require('zod');

const router = express.Router({ mergeParams: true });

router.use(verifyToken, requireCampaignAccess, requireGM);

// ─── Multer for map base image uploads (10 MB) ─────────────────────────────
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uid = crypto.randomBytes(8).toString('hex') + '-' + Date.now();
    cb(null, `map-${uid}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Invalid file type'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

// ─── Validation schemas ────────────────────────────────────────────────────
const updateWorldMapSchema = z.object({
  baseMapImageUrl: z.string().nullable().optional(),
  canvasState: z.string().nullable().optional(),
  zoom: z.number().min(0.1).max(10).optional(),
  panX: z.number().optional(),
  panY: z.number().optional(),
});

// ─── GET / — Get (or auto-create) world map for this campaign ─────────────
router.get('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');

    // Upsert: return existing or create fresh
    let worldMap = await prisma.worldMap.findUnique({
      where: { campaignId: req.campaignId },
    });

    if (!worldMap) {
      worldMap = await prisma.worldMap.create({
        data: { campaignId: req.campaignId },
      });
    }

    // Also return cities with map data so the canvas can render immediately
    const cityLocations = await prisma.location.findMany({
      where: { campaignId: req.campaignId, type: { in: ['city', 'City-State'] } },
      include: { city: true },
      orderBy: { name: 'asc' },
    });

    const cities = cityLocations
      .filter((l) => l.city)
      .map((l) => ({
        ...l.city,
        location: { id: l.id, name: l.name, type: l.type },
      }));

    res.json({ worldMap, cities });
  } catch (err) {
    console.error('Get world map error:', err);
    res.status(500).json({ error: 'Failed to fetch world map' });
  }
});

// ─── PUT / — Update world map (canvas state, zoom, pan) ──────────────────
router.put('/', validate(updateWorldMapSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');

    const worldMap = await prisma.worldMap.upsert({
      where: { campaignId: req.campaignId },
      update: req.body,
      create: { campaignId: req.campaignId, ...req.body },
    });

    res.json({ worldMap });
  } catch (err) {
    console.error('Update world map error:', err);
    res.status(500).json({ error: 'Failed to update world map' });
  }
});

// ─── POST /base-image — Upload a base map image ───────────────────────────
router.post('/base-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const prisma = req.app.get('prisma');
    const fileUrl = `/uploads/${req.file.filename}`;

    // Save URL into world map record
    const worldMap = await prisma.worldMap.upsert({
      where: { campaignId: req.campaignId },
      update: { baseMapImageUrl: fileUrl },
      create: { campaignId: req.campaignId, baseMapImageUrl: fileUrl },
    });

    res.status(201).json({ url: fileUrl, worldMap });
  } catch (err) {
    console.error('Upload base map error:', err);
    res.status(500).json({ error: 'Failed to upload base map' });
  }
});

// --- World Map Revealed Zones (Fog of War) ---
router.get('/revealed-zones', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const zones = await prisma.mapRevealedZone.findMany({
      where: { campaignId: req.campaignId, isWorldMap: true },
      orderBy: { revealedAt: 'asc' }
    });
    res.json({ zones });
  } catch (err) {
    res.status(500).json({ error: 'Failed to list revealed zones' });
  }
});

router.post('/reveal', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { zoneData } = req.body;
    if (!zoneData) return res.status(400).json({ error: 'zoneData is required' });

    const zone = await prisma.mapRevealedZone.create({
      data: {
        campaignId: req.campaignId,
        isWorldMap: true,
        zoneData
      }
    });

    const io = req.app.get('io');
    if (io) {
      io.to(`campaign:${req.campaignId}`).emit('map_zone_revealed', zone);
    }

    res.status(201).json({ zone });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reveal zone' });
  }
});

router.delete('/revealed-zones/:zoneId', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    await prisma.mapRevealedZone.delete({
      where: { id: req.params.zoneId, campaignId: req.campaignId }
    });
    
    const io = req.app.get('io');
    if (io) {
      io.to(`campaign:${req.campaignId}`).emit('map_zone_hidden', { id: req.params.zoneId });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to hide zone' });
  }
});

module.exports = router;
