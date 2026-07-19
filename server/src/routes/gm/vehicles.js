const express = require('express');
const { verifyToken, requireCampaignAccess, requireGM } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { createVehicleSchema, updateVehicleSchema } = require('../../validators/schemas');

const router = express.Router({ mergeParams: true });

router.use(verifyToken, requireCampaignAccess, requireGM);

// GET / — List all vehicles in campaign
router.get('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const vehicles = await prisma.vehicle.findMany({
      where: { campaignId: req.campaignId },
      include: {
        partSlots: { include: { part: true } },
        crewSlots: { include: { character: true } },
      },
    });
    res.json({ vehicles });
  } catch (err) {
    console.error('List vehicles error:', err);
    res.status(500).json({ error: 'Failed to list vehicles' });
  }
});

// POST / — Create a vehicle
router.post('/', validate(createVehicleSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const vehicle = await prisma.vehicle.create({
      data: { ...req.body, campaignId: req.campaignId },
    });
    res.status(201).json({ vehicle });
  } catch (err) {
    console.error('Create vehicle error:', err);
    res.status(500).json({ error: 'Failed to create vehicle' });
  }
});

// GET /:id — Get vehicle detail
router.get('/:id', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: req.params.id, campaignId: req.campaignId },
      include: {
        partSlots: { include: { part: true } },
        crewSlots: { include: { character: true } },
      },
    });
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    res.json({ vehicle });
  } catch (err) {
    console.error('Get vehicle error:', err);
    res.status(500).json({ error: 'Failed to get vehicle' });
  }
});

// PUT /:id — Update vehicle
router.put('/:id', validate(updateVehicleSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const vehicle = await prisma.vehicle.updateMany({
      where: { id: req.params.id, campaignId: req.campaignId },
      data: req.body,
    });
    if (vehicle.count === 0) return res.status(404).json({ error: 'Vehicle not found' });

    const updated = await prisma.vehicle.findUnique({
      where: { id: req.params.id },
      include: {
        partSlots: { include: { part: true } },
        crewSlots: { include: { character: true } },
      },
    });

    const io = req.app.get('io');
    if (io) {
      io.to(`campaign:${req.campaignId}`).emit('vehicle:updated', { vehicleId: updated.id });
    }

    res.json({ vehicle: updated });
  } catch (err) {
    console.error('Update vehicle error:', err);
    res.status(500).json({ error: 'Failed to update vehicle' });
  }
});

// DELETE /:id — Delete vehicle
router.delete('/:id', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const result = await prisma.vehicle.deleteMany({
      where: { id: req.params.id, campaignId: req.campaignId },
    });
    if (result.count === 0) return res.status(404).json({ error: 'Vehicle not found' });
    res.json({ message: 'Vehicle deleted' });
  } catch (err) {
    console.error('Delete vehicle error:', err);
    res.status(500).json({ error: 'Failed to delete vehicle' });
  }
});

module.exports = router;
