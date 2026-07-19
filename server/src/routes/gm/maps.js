const express = require('express');
const { verifyToken, requireCampaignAccess, requireGM } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { z } = require('zod');

const router = express.Router({ mergeParams: true });

router.use(verifyToken, requireCampaignAccess, requireGM);

const mapAssetSchema = z.object({
  name: z.string().min(1),
  imageUrl: z.string().url().optional().nullable(),
  layerData: z.string().optional().nullable(), // JSON string for fog of war, drawings
});

const mapMarkerSchema = z.object({
  x: z.number(),
  y: z.number(),
  type: z.string(), // "npc" | "location" | "quest" | "custom"
  label: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  linkedNpcId: z.string().optional().nullable(),
  linkedLocationId: z.string().optional().nullable(),
  linkedQuestId: z.string().optional().nullable(),
});

// Get all maps for campaign
router.get('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const maps = await prisma.mapAsset.findMany({
      where: { campaignId: req.campaignId },
      include: { markers: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ maps });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch maps' });
  }
});

// Create a new map
router.post('/', validate(mapAssetSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const newMap = await prisma.mapAsset.create({
      data: {
        ...req.body,
        campaignId: req.campaignId,
      },
      include: { markers: true }
    });
    res.status(201).json({ map: newMap });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create map' });
  }
});

// Get single map
router.get('/:mapId', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const map = await prisma.mapAsset.findFirst({
      where: { id: req.params.mapId, campaignId: req.campaignId },
      include: { markers: true }
    });
    if (!map) return res.status(404).json({ error: 'Map not found' });
    res.json({ map });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch map' });
  }
});

// Update map (e.g. saving fog of war / layer data)
router.put('/:mapId', validate(mapAssetSchema.partial()), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    
    // Ensure map exists in campaign
    const existing = await prisma.mapAsset.findFirst({
      where: { id: req.params.mapId, campaignId: req.campaignId }
    });
    if (!existing) return res.status(404).json({ error: 'Map not found' });

    const updated = await prisma.mapAsset.update({
      where: { id: req.params.mapId },
      data: req.body,
      include: { markers: true }
    });
    res.json({ map: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update map' });
  }
});

// Delete map
router.delete('/:mapId', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const existing = await prisma.mapAsset.findFirst({
      where: { id: req.params.mapId, campaignId: req.campaignId }
    });
    if (!existing) return res.status(404).json({ error: 'Map not found' });

    await prisma.mapAsset.delete({
      where: { id: req.params.mapId }
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete map' });
  }
});

// Add a marker to a map
router.post('/:mapId/markers', validate(mapMarkerSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const existing = await prisma.mapAsset.findFirst({
      where: { id: req.params.mapId, campaignId: req.campaignId }
    });
    if (!existing) return res.status(404).json({ error: 'Map not found' });

    const marker = await prisma.mapMarker.create({
      data: {
        ...req.body,
        mapAssetId: req.params.mapId
      }
    });
    res.status(201).json({ marker });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add marker' });
  }
});

// Delete a marker
router.delete('/:mapId/markers/:markerId', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    
    // First ensure the map belongs to this campaign
    const existingMap = await prisma.mapAsset.findFirst({
      where: { id: req.params.mapId, campaignId: req.campaignId }
    });
    if (!existingMap) return res.status(404).json({ error: 'Map not found' });

    await prisma.mapMarker.delete({
      where: { id: req.params.markerId }
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete marker' });
  }
});

// --- Map Revealed Zones (Fog of War) ---
router.get('/:mapId/revealed-zones', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const zones = await prisma.mapRevealedZone.findMany({
      where: { campaignId: req.campaignId, mapAssetId: req.params.mapId, isWorldMap: false },
      orderBy: { revealedAt: 'asc' }
    });
    res.json({ zones });
  } catch (err) {
    res.status(500).json({ error: 'Failed to list revealed zones' });
  }
});

router.post('/:mapId/reveal', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { zoneData } = req.body;
    if (!zoneData) return res.status(400).json({ error: 'zoneData is required' });

    const existingMap = await prisma.mapAsset.findFirst({
      where: { id: req.params.mapId, campaignId: req.campaignId }
    });
    if (!existingMap) return res.status(404).json({ error: 'Map not found' });

    const zone = await prisma.mapRevealedZone.create({
      data: {
        campaignId: req.campaignId,
        mapAssetId: req.params.mapId,
        isWorldMap: false,
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

router.delete('/:mapId/revealed-zones/:zoneId', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    await prisma.mapRevealedZone.delete({
      where: { id: req.params.zoneId, campaignId: req.campaignId }
    });
    
    // We can emit an event to tell clients to remove the zone, or just tell them to refetch.
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
