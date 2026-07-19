// GM Helper — GM Location Routes
const express = require('express');
const { verifyToken, requireCampaignAccess, requireGM } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { createLocationSchema, updateLocationSchema } = require('../../validators/schemas');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'loc-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

const router = express.Router({ mergeParams: true });

router.use(verifyToken, requireCampaignAccess, requireGM);

// GET / — List locations (flat or tree)
router.get('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { tree } = req.query;
    const locations = await prisma.location.findMany({
      where: { campaignId: req.campaignId },
      include: {
        city: true,
        npcs: { select: { id: true, name: true } },
        _count: { select: { childLocations: true } },
      },
      orderBy: { name: 'asc' },
    });

    if (tree === 'true') {
      // Build tree structure
      const locationMap = {};
      locations.forEach(l => { locationMap[l.id] = { ...l, children: [] }; });
      const roots = [];
      locations.forEach(l => {
        if (l.parentLocationId && locationMap[l.parentLocationId]) {
          locationMap[l.parentLocationId].children.push(locationMap[l.id]);
        } else {
          roots.push(locationMap[l.id]);
        }
      });
      return res.json({ locations: roots });
    }

    res.json({ locations });
  } catch (err) {
    console.error('List locations error:', err);
    res.status(500).json({ error: 'Failed to list locations' });
  }
});

// POST / — Create location
router.post('/', validate(createLocationSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const location = await prisma.location.create({
      data: { ...req.body, campaignId: req.campaignId },
      include: { city: true },
    });
    res.status(201).json({ location });
  } catch (err) {
    console.error('Create location error:', err);
    res.status(500).json({ error: 'Failed to create location' });
  }
});

// GET /:id — Get location detail
router.get('/:id', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const location = await prisma.location.findFirst({
      where: { id: req.params.id, campaignId: req.campaignId },
      include: {
        parentLocation: { select: { id: true, name: true, type: true } },
        childLocations: { select: { id: true, name: true, type: true } },
        city: { include: { parameterHistory: { orderBy: { createdAt: 'desc' }, take: 20 } } },
        npcs: { select: { id: true, name: true, role: true, portraitUrl: true } },
        questLinks: { include: { quest: { select: { id: true, name: true, status: true } } } },
        encounters: { select: { id: true, name: true, status: true } },
      },
    });
    if (!location) return res.status(404).json({ error: 'Location not found' });
    res.json({ location });
  } catch (err) {
    console.error('Get location error:', err);
    res.status(500).json({ error: 'Failed to get location' });
  }
});

// PUT /:id — Update location
router.put('/:id', validate(updateLocationSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const result = await prisma.location.updateMany({
      where: { id: req.params.id, campaignId: req.campaignId },
      data: req.body,
    });
    if (result.count === 0) return res.status(404).json({ error: 'Location not found' });
    const location = await prisma.location.findUnique({
      where: { id: req.params.id },
      include: { city: true },
    });
    res.json({ location });
  } catch (err) {
    console.error('Update location error:', err);
    res.status(500).json({ error: 'Failed to update location' });
  }
});

// POST /:id/image — Upload location map/image
router.post('/:id/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const prisma = req.app.get('prisma');
    const fileUrl = `/uploads/${req.file.filename}`;

    const result = await prisma.location.updateMany({
      where: { id: req.params.id, campaignId: req.campaignId },
      data: { imageUrl: fileUrl }
    });

    if (result.count === 0) return res.status(404).json({ error: 'Location not found' });

    res.json({ url: fileUrl });
  } catch (err) {
    console.error('Location image upload error:', err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// DELETE /:id — Delete location
router.delete('/:id', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const result = await prisma.location.deleteMany({
      where: { id: req.params.id, campaignId: req.campaignId },
    });
    if (result.count === 0) return res.status(404).json({ error: 'Location not found' });
    res.json({ message: 'Location deleted' });
  } catch (err) {
    console.error('Delete location error:', err);
    res.status(500).json({ error: 'Failed to delete location' });
  }
});

module.exports = router;
