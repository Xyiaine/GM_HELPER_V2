// GM Helper — GM Convoy Routes
// Full CRUD + procedural generation + real-time sync for convoy missions
const express = require('express');
const { verifyToken, requireCampaignAccess, requireGM } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const {
  createConvoySchema, updateConvoySchema,
  createConvoyVehicleSchema, updateConvoyVehicleSchema,
  createConvoyEventSchema, updateConvoyEventSchema,
  updateConvoyResourcesSchema, selectConvoyRewardsSchema,
} = require('../../validators/schemas');
const { generateRoadmap, proposeRewards } = require('../../services/convoyGenerator');

const router = express.Router({ mergeParams: true });
router.use(verifyToken, requireCampaignAccess, requireGM);

// ─── Helper: full convoy include ─────────────────────────────
const FULL_INCLUDE = {
  originCity: { include: { location: { select: { name: true } } } },
  destCity: { include: { location: { select: { name: true } } } },
  vehicles: { orderBy: { createdAt: 'asc' } },
  events: { orderBy: { orderIndex: 'asc' } },
};

// ─── LIST all convoys for a campaign ─────────────────────────
router.get('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const convoys = await prisma.convoy.findMany({
      where: { campaignId: req.campaignId },
      include: FULL_INCLUDE,
      orderBy: { updatedAt: 'desc' },
    });
    res.json({ convoys });
  } catch (err) {
    console.error('List convoys error:', err);
    res.status(500).json({ error: 'Failed to list convoys' });
  }
});

// ─── GET single convoy ───────────────────────────────────────
router.get('/:convoyId', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const convoy = await prisma.convoy.findUnique({
      where: { id: req.params.convoyId },
      include: FULL_INCLUDE,
    });
    if (!convoy || convoy.campaignId !== req.campaignId) {
      return res.status(404).json({ error: 'Convoy not found' });
    }
    res.json({ convoy });
  } catch (err) {
    console.error('Get convoy error:', err);
    res.status(500).json({ error: 'Failed to get convoy' });
  }
});

// ─── CREATE convoy + generate roadmap ────────────────────────
router.post('/', validate(createConvoySchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { name, originCityId, destinationCityId, difficulty, cargoType, cargoDetails } = req.body;

    // Fetch origin and destination cities (with location data for biome detection)
    const [originCity, destCity] = await Promise.all([
      prisma.city.findUnique({ where: { id: originCityId }, include: { location: true } }),
      prisma.city.findUnique({ where: { id: destinationCityId }, include: { location: true } }),
    ]);

    if (!originCity || !destCity) {
      return res.status(400).json({ error: 'Invalid origin or destination city' });
    }

    // Fetch all cities for biome influence calculation
    const allCities = await prisma.city.findMany({
      where: { location: { campaignId: req.campaignId } },
      include: { location: true },
    });

    // Generate procedural roadmap
    const roadmapEvents = generateRoadmap({
      originCity, destCity, allCities, difficulty: difficulty || 50,
    });

    // Create convoy with all events in a transaction
    const convoy = await prisma.convoy.create({
      data: {
        campaignId: req.campaignId,
        name,
        originCityId,
        destinationCityId,
        difficulty: difficulty || 50,
        cargoType,
        cargoDetails: cargoDetails || null,
        totalSteps: roadmapEvents.length,
        events: {
          create: roadmapEvents,
        },
      },
      include: FULL_INCLUDE,
    });

    // Emit socket event
    const io = req.app.get('io');
    io.to(`campaign:${req.campaignId}`).emit('convoy_created', { convoy });

    res.status(201).json({ convoy });
  } catch (err) {
    console.error('Create convoy error:', err);
    res.status(500).json({ error: 'Failed to create convoy' });
  }
});

// ─── UPDATE convoy (status, name, currentStepIndex, etc.) ────
router.put('/:convoyId', validate(updateConvoySchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const existing = await prisma.convoy.findUnique({ where: { id: req.params.convoyId } });
    if (!existing || existing.campaignId !== req.campaignId) {
      return res.status(404).json({ error: 'Convoy not found' });
    }

    const convoy = await prisma.convoy.update({
      where: { id: req.params.convoyId },
      data: req.body,
      include: FULL_INCLUDE,
    });

    // Emit socket event
    const io = req.app.get('io');
    io.to(`campaign:${req.campaignId}`).emit('convoy_updated', { convoy });

    res.json({ convoy });
  } catch (err) {
    console.error('Update convoy error:', err);
    res.status(500).json({ error: 'Failed to update convoy' });
  }
});

// ─── DELETE convoy ───────────────────────────────────────────
router.delete('/:convoyId', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const existing = await prisma.convoy.findUnique({ where: { id: req.params.convoyId } });
    if (!existing || existing.campaignId !== req.campaignId) {
      return res.status(404).json({ error: 'Convoy not found' });
    }

    await prisma.convoy.delete({ where: { id: req.params.convoyId } });

    const io = req.app.get('io');
    io.to(`campaign:${req.campaignId}`).emit('convoy_deleted', { convoyId: req.params.convoyId });

    res.json({ success: true });
  } catch (err) {
    console.error('Delete convoy error:', err);
    res.status(500).json({ error: 'Failed to delete convoy' });
  }
});

// ─── SET ACTIVE STEP (non-linear timeline control) ───────────
router.put('/:convoyId/step/:stepIndex', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const stepIndex = parseInt(req.params.stepIndex, 10);

    const convoy = await prisma.convoy.findUnique({
      where: { id: req.params.convoyId },
      include: { events: { orderBy: { orderIndex: 'asc' } } },
    });
    if (!convoy || convoy.campaignId !== req.campaignId) {
      return res.status(404).json({ error: 'Convoy not found' });
    }
    if (stepIndex < 0 || stepIndex >= convoy.events.length) {
      return res.status(400).json({ error: 'Invalid step index' });
    }

    // Set the targeted event as active, mark previous active as resolved
    await prisma.$transaction([
      // Deactivate all active events
      prisma.convoyEvent.updateMany({
        where: { convoyId: convoy.id, status: 'active' },
        data: { status: 'resolved' },
      }),
      // Set new active
      prisma.convoyEvent.updateMany({
        where: { convoyId: convoy.id, orderIndex: stepIndex },
        data: { status: 'active' },
      }),
      // Update convoy currentStepIndex
      prisma.convoy.update({
        where: { id: convoy.id },
        data: { currentStepIndex: stepIndex },
      }),
    ]);

    const updated = await prisma.convoy.findUnique({
      where: { id: convoy.id },
      include: FULL_INCLUDE,
    });

    const io = req.app.get('io');
    io.to(`campaign:${req.campaignId}`).emit('convoy_step_changed', { convoy: updated });

    res.json({ convoy: updated });
  } catch (err) {
    console.error('Set step error:', err);
    res.status(500).json({ error: 'Failed to set active step' });
  }
});

// ─── UPDATE RESOURCES ────────────────────────────────────────
router.put('/:convoyId/resources', validate(updateConvoyResourcesSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const existing = await prisma.convoy.findUnique({ where: { id: req.params.convoyId } });
    if (!existing || existing.campaignId !== req.campaignId) {
      return res.status(404).json({ error: 'Convoy not found' });
    }

    const convoy = await prisma.convoy.update({
      where: { id: req.params.convoyId },
      data: req.body,
      include: FULL_INCLUDE,
    });

    const io = req.app.get('io');
    io.to(`campaign:${req.campaignId}`).emit('convoy_resources_updated', { convoy });

    res.json({ convoy });
  } catch (err) {
    console.error('Update resources error:', err);
    res.status(500).json({ error: 'Failed to update resources' });
  }
});

// ═══════════════════════════════════════════════════════════════
// VEHICLES
// ═══════════════════════════════════════════════════════════════

// ─── ADD VEHICLE ─────────────────────────────────────────────
router.post('/:convoyId/vehicles', validate(createConvoyVehicleSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const existing = await prisma.convoy.findUnique({ where: { id: req.params.convoyId } });
    if (!existing || existing.campaignId !== req.campaignId) {
      return res.status(404).json({ error: 'Convoy not found' });
    }

    const { type, name, hpMax, passengers } = req.body;
    const hpDefaults = { moto: 50, car: 100, truck: 200 };

    const vehicle = await prisma.convoyVehicle.create({
      data: {
        convoyId: req.params.convoyId,
        type,
        name,
        hpMax: hpMax || hpDefaults[type] || 100,
        hpCurrent: hpMax || hpDefaults[type] || 100,
        passengers: passengers || null,
      },
    });

    const io = req.app.get('io');
    io.to(`campaign:${req.campaignId}`).emit('convoy_vehicle_added', { convoyId: req.params.convoyId, vehicle });

    res.status(201).json({ vehicle });
  } catch (err) {
    console.error('Add vehicle error:', err);
    res.status(500).json({ error: 'Failed to add vehicle' });
  }
});

// ─── UPDATE VEHICLE (HP, passengers, destroyed) ──────────────
router.put('/:convoyId/vehicles/:vehicleId', validate(updateConvoyVehicleSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const existing = await prisma.convoyVehicle.findUnique({ where: { id: req.params.vehicleId } });
    if (!existing || existing.convoyId !== req.params.convoyId) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    const updateData = { ...req.body };

    // Auto-destroy if HP reaches 0
    if (updateData.hpCurrent !== undefined && updateData.hpCurrent <= 0) {
      updateData.hpCurrent = 0;
      updateData.isDestroyed = true;
    }

    const vehicle = await prisma.convoyVehicle.update({
      where: { id: req.params.vehicleId },
      data: updateData,
    });

    const io = req.app.get('io');
    io.to(`campaign:${req.campaignId}`).emit('convoy_vehicle_updated', {
      convoyId: req.params.convoyId,
      vehicle,
    });

    // If destroyed, notify with special event
    if (vehicle.isDestroyed && !existing.isDestroyed) {
      io.to(`campaign:${req.campaignId}`).emit('convoy_vehicle_destroyed', {
        convoyId: req.params.convoyId,
        vehicle,
      });
    }

    res.json({ vehicle });
  } catch (err) {
    console.error('Update vehicle error:', err);
    res.status(500).json({ error: 'Failed to update vehicle' });
  }
});

// ─── DELETE VEHICLE ──────────────────────────────────────────
router.delete('/:convoyId/vehicles/:vehicleId', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    await prisma.convoyVehicle.delete({ where: { id: req.params.vehicleId } });
    res.json({ success: true });
  } catch (err) {
    console.error('Delete vehicle error:', err);
    res.status(500).json({ error: 'Failed to delete vehicle' });
  }
});

// ═══════════════════════════════════════════════════════════════
// EVENTS (Roadmap)
// ═══════════════════════════════════════════════════════════════

// ─── ADD custom event ────────────────────────────────────────
router.post('/:convoyId/events', validate(createConvoyEventSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const event = await prisma.convoyEvent.create({
      data: {
        convoyId: req.params.convoyId,
        ...req.body,
      },
    });

    // Update totalSteps
    const count = await prisma.convoyEvent.count({ where: { convoyId: req.params.convoyId } });
    await prisma.convoy.update({
      where: { id: req.params.convoyId },
      data: { totalSteps: count },
    });

    res.status(201).json({ event });
  } catch (err) {
    console.error('Add event error:', err);
    res.status(500).json({ error: 'Failed to add event' });
  }
});

// ─── UPDATE event ────────────────────────────────────────────
router.put('/:convoyId/events/:eventId', validate(updateConvoyEventSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const event = await prisma.convoyEvent.update({
      where: { id: req.params.eventId },
      data: req.body,
    });

    const io = req.app.get('io');
    io.to(`campaign:${req.campaignId}`).emit('convoy_event_updated', {
      convoyId: req.params.convoyId,
      event,
    });

    res.json({ event });
  } catch (err) {
    console.error('Update event error:', err);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// ─── DELETE event ────────────────────────────────────────────
router.delete('/:convoyId/events/:eventId', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    await prisma.convoyEvent.delete({ where: { id: req.params.eventId } });

    // Recount
    const count = await prisma.convoyEvent.count({ where: { convoyId: req.params.convoyId } });
    await prisma.convoy.update({
      where: { id: req.params.convoyId },
      data: { totalSteps: count },
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Delete event error:', err);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// ─── RESOLVE event ───────────────────────────────────────────
router.put('/:convoyId/events/:eventId/resolve', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { outcome } = req.body; // 'failure', 'partial', 'success'

    if (!['failure', 'partial', 'success'].includes(outcome)) {
      return res.status(400).json({ error: 'Invalid outcome' });
    }

    const event = await prisma.convoyEvent.findUnique({ where: { id: req.params.eventId } });
    if (!event || event.convoyId !== req.params.convoyId) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const convoy = await prisma.convoy.findUnique({ 
      where: { id: req.params.convoyId },
      include: { vehicles: true }
    });

    let appliedNotes = `Résolu avec succès (${outcome}).`;
    let updateData = {};

    if (event.effects) {
      try {
        const effects = JSON.parse(event.effects);
        let multiplier = 0;

        if (effects.type === 'damage') {
          if (outcome === 'failure') multiplier = 1;
          else if (outcome === 'partial') multiplier = 0.5;
          else if (outcome === 'success') multiplier = 0; // minimal or no damage
        } else if (effects.type === 'restore') {
          if (outcome === 'failure') multiplier = 0;
          else if (outcome === 'partial') multiplier = 0.5;
          else if (outcome === 'success') multiplier = 1;
        }

        if (multiplier > 0) {
          // Resource changes
          if (effects.baseResource) {
            const resKey = Object.keys(effects.baseResource)[0];
            const baseAmount = effects.baseResource[resKey];
            const actualAmount = Math.round(baseAmount * multiplier);
            
            const currentAmount = convoy[resKey] || 0;
            const newAmount = effects.type === 'damage' 
              ? Math.max(0, currentAmount - actualAmount)
              : Math.min(200, currentAmount + actualAmount); // arbitrary cap 200 for now
              
            updateData[resKey] = newAmount;
            appliedNotes += `\n${effects.type === 'damage' ? '-' : '+'}${actualAmount} ${resKey}.`;
          }

          // Vehicle changes
          if (effects.baseVehicleHp) {
            const actualHp = Math.round(effects.baseVehicleHp * multiplier);
            // Apply evenly across active vehicles
            const activeVehicles = convoy.vehicles.filter(v => !v.isDestroyed);
            if (activeVehicles.length > 0) {
              const hpPerVehicle = Math.round(actualHp / activeVehicles.length);
              
              for (const v of activeVehicles) {
                const newHp = effects.type === 'damage'
                  ? Math.max(0, v.hpCurrent - hpPerVehicle)
                  : Math.min(v.hpMax, v.hpCurrent + hpPerVehicle);
                
                await prisma.convoyVehicle.update({
                  where: { id: v.id },
                  data: {
                    hpCurrent: newHp,
                    isDestroyed: newHp <= 0
                  }
                });
              }
              appliedNotes += `\n${effects.type === 'damage' ? '-' : '+'}${hpPerVehicle} PV/véhicule.`;
            }
          }
        }
      } catch (e) {
        console.error('Failed to parse effects JSON', e);
      }
    }

    // Update the event to resolved, save notes
    await prisma.convoyEvent.update({
      where: { id: req.params.eventId },
      data: {
        status: 'resolved',
        gmNotes: event.gmNotes ? `${event.gmNotes}\n\n${appliedNotes}` : appliedNotes
      }
    });

    // Apply resource changes to convoy if any
    if (Object.keys(updateData).length > 0) {
      await prisma.convoy.update({
        where: { id: req.params.convoyId },
        data: updateData
      });
    }

    const updatedConvoy = await prisma.convoy.findUnique({
      where: { id: req.params.convoyId },
      include: FULL_INCLUDE
    });

    const io = req.app.get('io');
    io.to(`campaign:${req.campaignId}`).emit('convoy_updated', { convoy: updatedConvoy });

    res.json({ convoy: updatedConvoy });
  } catch (err) {
    console.error('Resolve event error:', err);
    res.status(500).json({ error: 'Failed to resolve event' });
  }
});

// ─── REGENERATE roadmap ──────────────────────────────────────
router.post('/:convoyId/regenerate', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const convoy = await prisma.convoy.findUnique({
      where: { id: req.params.convoyId },
      include: {
        originCity: { include: { location: true } },
        destCity: { include: { location: true } },
      },
    });
    if (!convoy || convoy.campaignId !== req.campaignId) {
      return res.status(404).json({ error: 'Convoy not found' });
    }

    const allCities = await prisma.city.findMany({
      where: { location: { campaignId: req.campaignId } },
      include: { location: true },
    });

    const roadmapEvents = generateRoadmap({
      originCity: convoy.originCity,
      destCity: convoy.destCity,
      allCities,
      difficulty: convoy.difficulty,
    });

    // Delete old events, create new ones
    await prisma.$transaction([
      prisma.convoyEvent.deleteMany({ where: { convoyId: convoy.id } }),
      ...roadmapEvents.map(e => prisma.convoyEvent.create({ data: { convoyId: convoy.id, ...e } })),
      prisma.convoy.update({
        where: { id: convoy.id },
        data: { totalSteps: roadmapEvents.length, currentStepIndex: -1 },
      }),
    ]);

    const updated = await prisma.convoy.findUnique({
      where: { id: convoy.id },
      include: FULL_INCLUDE,
    });

    res.json({ convoy: updated });
  } catch (err) {
    console.error('Regenerate roadmap error:', err);
    res.status(500).json({ error: 'Failed to regenerate roadmap' });
  }
});

// ═══════════════════════════════════════════════════════════════
// REWARDS
// ═══════════════════════════════════════════════════════════════

// ─── PROPOSE rewards (calculate based on convoy state) ───────
router.post('/:convoyId/rewards/propose', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const convoy = await prisma.convoy.findUnique({
      where: { id: req.params.convoyId },
      include: { vehicles: true },
    });
    if (!convoy || convoy.campaignId !== req.campaignId) {
      return res.status(404).json({ error: 'Convoy not found' });
    }

    const proposed = proposeRewards(convoy);

    await prisma.convoy.update({
      where: { id: convoy.id },
      data: { proposedRewards: JSON.stringify(proposed) },
    });

    res.json({ proposedRewards: proposed });
  } catch (err) {
    console.error('Propose rewards error:', err);
    res.status(500).json({ error: 'Failed to propose rewards' });
  }
});

// ─── SELECT rewards (GM picks from proposals) ────────────────
router.put('/:convoyId/rewards/select', validate(selectConvoyRewardsSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const convoy = await prisma.convoy.update({
      where: { id: req.params.convoyId },
      data: {
        selectedRewards: req.body.selectedRewards,
        status: 'completed',
      },
      include: FULL_INCLUDE,
    });

    const io = req.app.get('io');
    io.to(`campaign:${req.campaignId}`).emit('convoy_completed', { convoy });

    res.json({ convoy });
  } catch (err) {
    console.error('Select rewards error:', err);
    res.status(500).json({ error: 'Failed to select rewards' });
  }
});

module.exports = router;
