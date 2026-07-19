// GM Helper — GM Quest Routes (with city impact system)
const express = require('express');
const { verifyToken, requireCampaignAccess, requireGM } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const {
  createQuestSchema, updateQuestSchema, createQuestObjectiveSchema,
  createQuestCityImpactSchema, createQuestNpcLinkSchema,
  createQuestLocationLinkSchema, resolveQuestSchema,
  createQuestNodeSchema, updateQuestNodeSchema, createQuestNodeConnectionSchema,
  updateQuestNodeConnectionSchema,
  createQuestItemLinkSchema, createQuestDependencySchema,
} = require('../../validators/schemas');
const { startNodeTimer, cancelNodeTimer, handleNodeTimeout, cancelParentTimers } = require('../../services/questTimers');

const router = express.Router({ mergeParams: true });

router.use(verifyToken, requireCampaignAccess, requireGM);

// GET / — List quests
router.get('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { status, type, cityId } = req.query;
    const where = { campaignId: req.campaignId };
    if (status) where.status = status;
    if (type) where.type = type;

    let quests = await prisma.quest.findMany({
      where,
      include: {
        objectives: { orderBy: { orderIndex: 'asc' } },
        cityImpacts: { include: { city: { include: { location: { select: { name: true } } } } } },
        npcLinks: { include: { npc: { select: { id: true, name: true } } } },
        locationLinks: { include: { location: { select: { id: true, name: true } } } },
        itemLinks: { include: { item: { select: { id: true, name: true } } } },
        dependencies: { include: { dependsOnQuest: { select: { id: true, name: true } } } },
        nodes: { include: { connectionsFrom: true, connectionsTo: true, rewards: true, threatEffects: true }, orderBy: { createdAt: 'asc' } },
        threats: true,
        factionProgress: true,
        characterStates: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Filter by city if requested
    if (cityId) {
      quests = quests.filter(q => q.cityImpacts.some(ci => ci.cityId === cityId));
    }

    res.json({ quests });
  } catch (err) {
    console.error('List quests error:', err);
    res.status(500).json({ error: 'Failed to list quests' });
  }
});

// POST / — Create quest
router.post('/', validate(createQuestSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const quest = await prisma.quest.create({
      data: { ...req.body, campaignId: req.campaignId },
    });
    res.status(201).json({ quest });
  } catch (err) {
    console.error('Create quest error:', err);
    res.status(500).json({ error: 'Failed to create quest' });
  }
});

// GET /:id — Get quest detail
router.get('/:id', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const quest = await prisma.quest.findFirst({
      where: { id: req.params.id, campaignId: req.campaignId },
      include: {
        objectives: { orderBy: { orderIndex: 'asc' } },
        cityImpacts: { include: { city: { include: { location: { select: { id: true, name: true } } } } } },
        npcLinks: { include: { npc: { select: { id: true, name: true, portraitUrl: true } } } },
        locationLinks: { include: { location: { select: { id: true, name: true, type: true } } } },
        itemLinks: { include: { item: { select: { id: true, name: true } } } },
        dependencies: { include: { dependsOnQuest: { select: { id: true, name: true } } } },
        nodes: { include: { connectionsFrom: true, connectionsTo: true, rewards: true, threatEffects: true }, orderBy: { createdAt: 'asc' } },
        threats: true,
        factionProgress: true,
        characterStates: true,
      },
    });
    if (!quest) return res.status(404).json({ error: 'Quest not found' });
    res.json({ quest });
  } catch (err) {
    console.error('Get quest error:', err);
    res.status(500).json({ error: 'Failed to get quest' });
  }
});

// PUT /:id — Update quest
router.put('/:id', validate(updateQuestSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    
    // Check status transition logic
    if (req.body.status && ['completed', 'failed'].includes(req.body.status)) {
      const current = await prisma.quest.findFirst({ where: { id: req.params.id } });
      if (current && !['active', 'paused'].includes(current.status)) {
        return res.status(400).json({ error: 'Quest must be active or paused to be completed/failed' });
      }
    }

    const result = await prisma.quest.updateMany({
      where: { id: req.params.id, campaignId: req.campaignId },
      data: req.body,
    });
    if (result.count === 0) return res.status(404).json({ error: 'Quest not found' });
    const quest = await prisma.quest.findUnique({ where: { id: req.params.id } });
    res.json({ quest });
  } catch (err) {
    console.error('Update quest error:', err);
    res.status(500).json({ error: 'Failed to update quest' });
  }
});

// DELETE /:id — Delete quest
router.delete('/:id', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const result = await prisma.quest.deleteMany({
      where: { id: req.params.id, campaignId: req.campaignId },
    });
    if (result.count === 0) return res.status(404).json({ error: 'Quest not found' });
    res.json({ message: 'Quest deleted' });
  } catch (err) {
    console.error('Delete quest error:', err);
    res.status(500).json({ error: 'Failed to delete quest' });
  }
});

// --- Objectives ---
router.post('/:id/objectives', validate(createQuestObjectiveSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const quest = await prisma.quest.findFirst({
      where: { id: req.params.id, campaignId: req.campaignId },
    });
    if (!quest) return res.status(404).json({ error: 'Quest not found' });

    const objective = await prisma.questObjective.create({
      data: { ...req.body, questId: req.params.id },
    });
    res.status(201).json({ objective });
  } catch (err) {
    console.error('Create objective error:', err);
    res.status(500).json({ error: 'Failed to create objective' });
  }
});

router.patch('/:id/objectives/:objId', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const objective = await prisma.questObjective.update({
      where: { id: req.params.objId },
      data: req.body,
    });
    // Recalculate quest progress
    const objectives = await prisma.questObjective.findMany({
      where: { questId: req.params.id },
    });
    const completed = objectives.filter(o => o.status === 'completed').length;
    const progress = objectives.length > 0 ? Math.round((completed / objectives.length) * 100) : 0;
    await prisma.quest.update({
      where: { id: req.params.id },
      data: { progress },
    });

    res.json({ objective, progress });
  } catch (err) {
    console.error('Update objective error:', err);
    res.status(500).json({ error: 'Failed to update objective' });
  }
});

router.delete('/:id/objectives/:objId', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    await prisma.questObjective.delete({ where: { id: req.params.objId } });
    res.json({ message: 'Objective deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete objective' });
  }
});

// --- City Impacts ---
router.post('/:id/impacts', validate(createQuestCityImpactSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const impact = await prisma.questCityImpact.create({
      data: { ...req.body, questId: req.params.id },
      include: { city: { include: { location: { select: { name: true } } } } },
    });
    res.status(201).json({ impact });
  } catch (err) {
    console.error('Create impact error:', err);
    res.status(500).json({ error: 'Failed to create city impact' });
  }
});

router.delete('/:id/impacts/:impactId', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    await prisma.questCityImpact.delete({ where: { id: req.params.impactId } });
    res.json({ message: 'Impact deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete impact' });
  }
});

// --- NPC Links ---
router.post('/:id/npcs', validate(createQuestNpcLinkSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const link = await prisma.questNPCLink.create({
      data: { ...req.body, questId: req.params.id },
      include: { npc: { select: { id: true, name: true } } },
    });
    res.status(201).json({ link });
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'NPC already linked' });
    res.status(500).json({ error: 'Failed to link NPC' });
  }
});

router.delete('/:id/npcs/:linkId', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    await prisma.questNPCLink.delete({ where: { id: req.params.linkId } });
    res.json({ message: 'NPC link removed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove NPC link' });
  }
});

// --- Location Links ---
router.post('/:id/locations', validate(createQuestLocationLinkSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const link = await prisma.questLocationLink.create({
      data: { ...req.body, questId: req.params.id },
      include: { location: { select: { id: true, name: true } } },
    });
    res.status(201).json({ link });
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'Location already linked' });
    res.status(500).json({ error: 'Failed to link location' });
  }
});

router.delete('/:id/locations/:linkId', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    await prisma.questLocationLink.delete({ where: { id: req.params.linkId } });
    res.json({ message: 'Location link removed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove location link' });
  }
});

// --- RESOLVE QUEST (apply city impacts) ---
router.post('/:id/resolve', validate(resolveQuestSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { outcome, status } = req.body;

    const quest = await prisma.quest.findFirst({
      where: { id: req.params.id, campaignId: req.campaignId },
      include: {
        cityImpacts: {
          where: { outcome },
          include: { city: { include: { location: { select: { name: true } } } } },
        },
      },
    });

    if (!quest) return res.status(404).json({ error: 'Quest not found' });

    // Apply each city impact within a transaction
    const appliedImpacts = [];
    await prisma.$transaction(async (tx) => {
      for (const impact of quest.cityImpacts) {
        const city = await tx.city.findUnique({ where: { id: impact.cityId } });
        if (!city) continue;

        const oldValue = city[impact.parameter];
        const newValue = Math.max(0, Math.min(100, oldValue + impact.modifier));

        await tx.city.update({
          where: { id: impact.cityId },
          data: { [impact.parameter]: newValue },
        });

        await tx.cityParameterHistory.create({
          data: {
            cityId: impact.cityId,
            parameter: impact.parameter,
            oldValue,
            newValue,
            cause: `Quest "${quest.name}" — ${outcome}`,
            questId: quest.id,
          },
        });

        appliedImpacts.push({
          cityName: impact.city.location.name,
          parameter: impact.parameter,
          oldValue,
          newValue,
          modifier: impact.modifier,
        });
      }

      // Update quest status
      await tx.quest.update({
        where: { id: quest.id },
        data: { status, progress: status === 'completed' ? 100 : quest.progress },
      });
    });

    res.json({
      message: `Quest resolved: ${outcome}`,
      quest: { id: quest.id, name: quest.name, status },
      appliedImpacts,
    });
  } catch (err) {
    console.error('Resolve quest error:', err);
    res.status(500).json({ error: 'Failed to resolve quest' });
  }
});

// --- Preview impact ---
router.get('/:id/preview-impact', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { outcome } = req.query;
    if (!outcome) return res.status(400).json({ error: 'Outcome parameter required' });

    const impacts = await prisma.questCityImpact.findMany({
      where: { questId: req.params.id, outcome },
      include: { city: { include: { location: { select: { name: true } } } } },
    });

    const preview = impacts.map(impact => ({
      cityName: impact.city.location.name,
      parameter: impact.parameter,
      currentValue: impact.city[impact.parameter],
      modifier: impact.modifier,
      projectedValue: Math.max(0, Math.min(100, impact.city[impact.parameter] + impact.modifier)),
    }));

    res.json({ preview });
  } catch (err) {
    console.error('Preview impact error:', err);
    res.status(500).json({ error: 'Failed to preview impact' });
  }
});

// --- Nodes ---
router.get('/:id/nodes', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const nodes = await prisma.questNode.findMany({
      where: { questId: req.params.id },
      include: { connectionsFrom: true, connectionsTo: true, rewards: true, threatEffects: true },
      orderBy: { createdAt: 'asc' }
    });
    res.json({ nodes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to list nodes' });
  }
});

router.post('/:id/nodes', validate(createQuestNodeSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const node = await prisma.questNode.create({
      data: { ...req.body, questId: req.params.id }
    });
    res.status(201).json({ node });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create node' });
  }
});

router.put('/:id/nodes/:nodeId', validate(updateQuestNodeSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const node = await prisma.questNode.update({
      where: { id: req.params.nodeId },
      data: req.body
    });
    res.json({ node });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update node' });
  }
});

router.delete('/:id/nodes/:nodeId', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    await prisma.questNode.delete({
      where: { id: req.params.nodeId }
    });
    cancelNodeTimer(req.params.nodeId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete node' });
  }
});

router.post('/:id/nodes/:nodeId/connections', validate(createQuestNodeConnectionSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const conn = await prisma.questNodeConnection.create({
      data: req.body
    });
    res.status(201).json({ connection: conn });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create connection' });
  }
});

router.delete('/:id/nodes/:nodeId/connections/:connId', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    await prisma.questNodeConnection.delete({
      where: { id: req.params.connId }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete connection' });
  }
});

router.put('/:id/nodes/:nodeId/connections/:connId', validate(updateQuestNodeConnectionSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const conn = await prisma.questNodeConnection.update({
      where: { id: req.params.connId },
      data: req.body
    });
    res.json({ connection: conn });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update connection' });
  }
});

router.post('/:id/nodes/:nodeId/reach', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const io = req.app.get('io');
    const node = await prisma.questNode.findUnique({ where: { id: req.params.nodeId } });
    if (!node) return res.status(404).json({ error: 'Node not found' });
    
    // If the node was already reached, don't re-emit sensory text
    const alreadyReached = node.status === 'reached';
    
    const updated = await prisma.questNode.update({
      where: { id: req.params.nodeId },
      data: { status: 'reached', reachedAt: new Date() }
    });
    
    if (updated.nodeType === 'end' && updated.endOutcome) {
      await prisma.quest.update({
        where: { id: req.params.id },
        data: { status: updated.endOutcome === 'success' ? 'completed' : updated.endOutcome === 'failure' ? 'failed' : 'abandoned' }
      });
    }
    
    // Auto-start timer if timed
    if (updated.isTimed && updated.timerDurationSeconds) {
      startNodeTimer(prisma, io, req.campaignId, req.params.id, updated.id, updated.timerDurationSeconds, handleNodeTimeout);
      
      const timerPayload = {
        questId: req.params.id,
        nodeId: updated.id,
        title: updated.title,
        duration: updated.timerDurationSeconds,
        expiresAt: new Date(Date.now() + updated.timerDurationSeconds * 1000)
      };
      
      if (io) {
        io.to(`campaign:${req.campaignId}:gm`).emit('quest_node_timer_started', timerPayload);
        if (updated.timerVisibleToPlayers) {
          const session = await prisma.session.findFirst({
            where: { campaignId: req.campaignId, status: 'live' }
          });
          io.to(`campaign:${req.campaignId}:player`).emit('quest_node_timer_started', timerPayload);
          if (session && session.mode === 'in_person' && session.tableScreenToken) {
            io.to(`table_screen:${session.tableScreenToken}`).emit('quest_node_timer_started', timerPayload);
          }
        }
      }
    }

    // Cancel parent timers
    await cancelParentTimers(prisma, updated.id);
    
    if (io && updated.sensoryText && !alreadyReached) {
      io.to(`campaign:${req.campaignId}:gm`).emit('quest_node_reached', {
        questId: req.params.id,
        nodeId: updated.id,
        sensoryText: updated.sensoryText
      });
    }
    
    res.json({ node: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to reach node' });
  }
});

router.post('/:id/nodes/:nodeId/start-timer', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const io = req.app.get('io');
    const node = await prisma.questNode.findUnique({ where: { id: req.params.nodeId } });
    if (!node) return res.status(404).json({ error: 'Node not found' });
    if (!node.isTimed || !node.timerDurationSeconds) {
      return res.status(400).json({ error: 'Node is not timed' });
    }
    
    startNodeTimer(prisma, io, req.campaignId, req.params.id, node.id, node.timerDurationSeconds, handleNodeTimeout);
    
    const timerPayload = {
      questId: req.params.id,
      nodeId: node.id,
      title: node.title,
      duration: node.timerDurationSeconds,
      expiresAt: new Date(Date.now() + node.timerDurationSeconds * 1000)
    };
    
    if (io) {
      io.to(`campaign:${req.campaignId}:gm`).emit('quest_node_timer_started', timerPayload);
      if (node.timerVisibleToPlayers) {
        const session = await prisma.session.findFirst({
          where: { campaignId: req.campaignId, status: 'live' }
        });
        io.to(`campaign:${req.campaignId}:player`).emit('quest_node_timer_started', timerPayload);
        if (session && session.mode === 'in_person' && session.tableScreenToken) {
          io.to(`table_screen:${session.tableScreenToken}`).emit('quest_node_timer_started', timerPayload);
        }
      }
    }
    
    res.json({ success: true, message: 'Timer started' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to start timer' });
  }
});

router.post('/:id/nodes/:nodeId/unreach', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const io = req.app.get('io');
    const updated = await prisma.questNode.update({
      where: { id: req.params.nodeId },
      data: { status: 'not_reached', reachedAt: null }
    });
    cancelNodeTimer(req.params.nodeId);
    
    if (io) {
      io.to(`campaign:${req.campaignId}:gm`).emit('quest_node_timer_cleared', { nodeId: updated.id });
      if (updated.timerVisibleToPlayers) {
        const session = await prisma.session.findFirst({
          where: { campaignId: req.campaignId, status: 'live' }
        });
        io.to(`campaign:${req.campaignId}:player`).emit('quest_node_timer_cleared', { nodeId: updated.id });
        if (session && session.mode === 'in_person' && session.tableScreenToken) {
          io.to(`table_screen:${session.tableScreenToken}`).emit('quest_node_timer_cleared', { nodeId: updated.id });
        }
      }
    }
    
    res.json({ node: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to unreach node' });
  }
});
// POST /:id/duplicate
router.post('/:id/duplicate', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const originalQuest = await prisma.quest.findUnique({
      where: { id: req.params.id },
      include: {
        nodes: true,
      }
    });

    if (!originalQuest || originalQuest.campaignId !== req.campaignId) {
      return res.status(404).json({ error: 'Quest not found' });
    }

    // 1. Create duplicate quest
    const newQuest = await prisma.quest.create({
      data: {
        campaignId: originalQuest.campaignId,
        name: originalQuest.name + ' (Copie)',
        description: originalQuest.description,
        type: originalQuest.type,
        difficulty: originalQuest.difficulty,
        level: originalQuest.level,
        duration: originalQuest.duration,
        visibility: originalQuest.visibility,
        playerSummary: originalQuest.playerSummary,
        gmNotes: originalQuest.gmNotes,
        questGiverNpcId: originalQuest.questGiverNpcId,
        xpReward: originalQuest.xpReward,
        goldReward: originalQuest.goldReward,
        itemRewards: originalQuest.itemRewards,
        status: 'not_started',
      }
    });

    // 2. Duplicate nodes
    const nodeMapping = {}; // oldId -> newId
    for (const node of originalQuest.nodes) {
      const createdNode = await prisma.questNode.create({
        data: {
          questId: newQuest.id,
          title: node.title,
          mjDescription: node.mjDescription,
          sensoryText: node.sensoryText,
          nodeType: node.nodeType,
          endOutcome: node.endOutcome,
          isTimed: node.isTimed,
          timerDurationSeconds: node.timerDurationSeconds,
          timerVisibleToPlayers: node.timerVisibleToPlayers,
          linkedNpcId: node.linkedNpcId,
          linkedLocationId: node.linkedLocationId,
          linkedEncounterId: node.linkedEncounterId,
          positionX: node.positionX + 20,
          positionY: node.positionY + 20,
          status: 'not_reached',
        }
      });
      nodeMapping[node.id] = createdNode.id;
    }

    // 3. Update timeoutNodeId
    for (const node of originalQuest.nodes) {
      if (node.timeoutNodeId && nodeMapping[node.timeoutNodeId]) {
        await prisma.questNode.update({
          where: { id: nodeMapping[node.id] },
          data: { timeoutNodeId: nodeMapping[node.timeoutNodeId] }
        });
      }
    }

    // 4. Duplicate connections
    const originalConnections = await prisma.questNodeConnection.findMany({
      where: { fromNode: { questId: req.params.id } }
    });

    for (const conn of originalConnections) {
      if (nodeMapping[conn.fromNodeId] && nodeMapping[conn.toNodeId]) {
        await prisma.questNodeConnection.create({
          data: {
            fromNodeId: nodeMapping[conn.fromNodeId],
            toNodeId: nodeMapping[conn.toNodeId],
            label: conn.label,
            isTimeoutConnection: conn.isTimeoutConnection
          }
        });
      }
    }

    res.json({ quest: newQuest });
  } catch (err) {
    console.error('Duplicate quest error:', err);
    res.status(500).json({ error: 'Failed to duplicate quest' });
  }
});

// QuestItemLink routes
router.post('/:id/items', validate(createQuestItemLinkSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const link = await prisma.questItemLink.create({
      data: { questId: req.params.id, itemId: req.body.itemId }
    });
    res.json({ link });
  } catch (err) {
    res.status(500).json({ error: 'Failed to link item' });
  }
});

router.delete('/:id/items/:itemId', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    await prisma.questItemLink.deleteMany({
      where: { questId: req.params.id, itemId: req.params.itemId }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to unlink item' });
  }
});

// QuestDependency routes
router.post('/:id/dependencies', validate(createQuestDependencySchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const link = await prisma.questDependency.create({
      data: { 
        questId: req.params.id, 
        dependsOnQuestId: req.body.dependsOnQuestId,
        type: req.body.type || 'prerequisite'
      }
    });
    res.json({ link });
  } catch (err) {
    res.status(500).json({ error: 'Failed to link dependency' });
  }
});

router.delete('/:id/dependencies/:dependsOnId', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    await prisma.questDependency.deleteMany({
      where: { questId: req.params.id, dependsOnQuestId: req.params.dependsOnId }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to unlink dependency' });
  }
});

// ============================================================
// v2 Extensions (Threats, Rewards, Factions, Characters)
// ============================================================

router.post('/:id/threats', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const threat = await prisma.questThreatTracker.create({
      data: { ...req.body, questId: req.params.id }
    });
    res.json({ threat });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create threat' });
  }
});

router.put('/:id/threats/:threatId', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const threat = await prisma.questThreatTracker.update({
      where: { id: req.params.threatId },
      data: req.body
    });
    res.json({ threat });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update threat' });
  }
});

router.post('/:id/nodes/:nodeId/rewards', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const reward = await prisma.questNodeReward.create({
      data: { ...req.body, nodeId: req.params.nodeId }
    });
    res.json({ reward });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create reward' });
  }
});

router.post('/:id/nodes/:nodeId/threat-effects', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const effect = await prisma.questNodeThreatEffect.create({
      data: { ...req.body, nodeId: req.params.nodeId }
    });
    res.json({ effect });
  } catch (err) {
    res.status(500).json({ error: 'Failed to link threat effect' });
  }
});

router.post('/:id/factions', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const faction = await prisma.questFactionProgress.create({
      data: { ...req.body, questId: req.params.id }
    });
    res.json({ faction });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add faction progress' });
  }
});

router.post('/:id/characters/state', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { characterId, stateKey, stateValue } = req.body;
    const state = await prisma.questCharacterState.upsert({
      where: { questId_characterId_stateKey: { questId: req.params.id, characterId, stateKey } },
      update: { stateValue },
      create: { questId: req.params.id, characterId, stateKey, stateValue }
    });
    res.json({ state });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update character state' });
  }
});

module.exports = router;
