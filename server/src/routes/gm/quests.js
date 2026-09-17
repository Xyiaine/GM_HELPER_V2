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
  createQuestThreatSchema, updateQuestThreatSchema,
  createQuestFactionProgressSchema, updateQuestFactionProgressSchema,
  updateQuestCharacterStateSchema, createQuestNPCProfileSchema,
  updateQuestNPCProfileSchema, updateQuestMechanicNotesSchema,
  createQuestNodeRewardSchema, createQuestNodeThreatEffectSchema,
} = require('../../validators/schemas');
const { startNodeTimer, cancelNodeTimer, handleNodeTimeout, cancelParentTimers, executeQuestResolution } = require('../../services/questTimers');
const { instantiateQuestEncounters } = require('../../services/questCombatService');
const { buildCurrentScene } = require('../../services/tableScreenState');

// Architecture Review Utilities (BE-1 to BE-10)
const { evaluateCondition } = require('../../utils/conditionEvaluator');
const { convertRuleSystem } = require('../../utils/ruleConverter');
const { auditQuestIntegrity } = require('../../utils/integrityVerifier');

const router = express.Router({ mergeParams: true });

router.use(verifyToken, requireCampaignAccess, requireGM);

// GET / — List quests (lightweight list query M5)
router.get('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { status, type, cityId } = req.query;
    const where = { campaignId: req.campaignId };
    if (status) where.status = status;
    if (type) where.type = type;

    let quests = await prisma.quest.findMany({
      where,
      select: {
        id: true,
        campaignId: true,
        name: true,
        description: true,
        type: true,
        difficulty: true,
        level: true,
        duration: true,
        visibility: true,
        playerSummary: true,
        status: true,
        progress: true,
        xpReward: true,
        goldReward: true,
        createdAt: true,
        updatedAt: true,
        locationLinks: { select: { id: true, locationId: true } },
        npcLinks: { select: { id: true, npcId: true } },
        cityImpacts: { select: { cityId: true } },
        _count: { select: { nodes: true } },
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
        npcProfiles: true,
        mechanicNotes: true,
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
    if (result.count === 0) return res.status(400).json({ error: 'Quest not found' });
    const quest = await prisma.quest.findUnique({ where: { id: req.params.id } });

    if (req.body.status === 'active') {
      try {
        await instantiateQuestEncounters(prisma, req.campaignId, quest.id);
      } catch (e) {
        console.error('Failed to auto-instantiate quest encounters:', e);
      }
    }

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
    
    // Cancel in-memory timers for nodes belonging to this quest
    const nodes = await prisma.questNode.findMany({
      where: { questId: req.params.id, quest: { campaignId: req.campaignId } },
      select: { id: true }
    });
    nodes.forEach(n => cancelNodeTimer(n.id));

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
    });

    if (!quest) return res.status(404).json({ error: 'Quest not found' });

    if (['completed', 'failed', 'abandoned'].includes(quest.status)) {
      return res.status(400).json({ error: `Quest is already ${quest.status} and cannot be re-resolved` });
    }

    const { appliedImpacts } = await executeQuestResolution(prisma, quest.id, req.campaignId, outcome, status);

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
    const existing = await prisma.questNode.findFirst({
      where: { id: req.params.nodeId, questId: req.params.id, quest: { campaignId: req.campaignId } }
    });
    if (!existing) return res.status(404).json({ error: 'Node not found' });

    const node = await prisma.questNode.update({
      where: { id: req.params.nodeId },
      data: req.body
    });

    if (req.body.combatTemplate !== undefined) {
      const quest = await prisma.quest.findUnique({ where: { id: req.params.id } });
      if (quest && quest.status === 'active') {
        try {
          await instantiateQuestEncounters(prisma, req.campaignId, quest.id);
        } catch (e) {
          console.error('Failed to auto-instantiate quest encounters for node:', e);
        }
      }
    }

    res.json({ node });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update node' });
  }
});

router.delete('/:id/nodes/:nodeId', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const existing = await prisma.questNode.findFirst({
      where: { id: req.params.nodeId, questId: req.params.id, quest: { campaignId: req.campaignId } }
    });
    if (!existing) return res.status(404).json({ error: 'Node not found' });

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
    const existing = await prisma.questNode.findFirst({
      where: { id: req.params.nodeId, questId: req.params.id, quest: { campaignId: req.campaignId } }
    });
    if (!existing) return res.status(404).json({ error: 'Node not found' });

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
    const existingConn = await prisma.questNodeConnection.findFirst({
      where: { id: req.params.connId, fromNodeId: req.params.nodeId, fromNode: { questId: req.params.id, quest: { campaignId: req.campaignId } } }
    });
    if (!existingConn) return res.status(404).json({ error: 'Connection not found' });

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
    const existingConn = await prisma.questNodeConnection.findFirst({
      where: { id: req.params.connId, fromNodeId: req.params.nodeId, fromNode: { questId: req.params.id, quest: { campaignId: req.campaignId } } }
    });
    if (!existingConn) return res.status(404).json({ error: 'Connection not found' });

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
    const node = await prisma.questNode.findFirst({
      where: { id: req.params.nodeId, questId: req.params.id, quest: { campaignId: req.campaignId } }
    });
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
          io.to(`campaign:${req.campaignId}:player`).emit('quest_node_timer_started', timerPayload);
          // L'écran de table rejoint `campaign:{id}:table_screen` à la connexion :
          // plus besoin de rechercher la session ni de vérifier le mode de jeu.
          io.to(`campaign:${req.campaignId}:table_screen`).emit('quest_node_timer_started', timerPayload);
        }
      }
    }

    // Cancel parent timers
    await cancelParentTimers(prisma, updated.id);
    
    if (io && !alreadyReached) {
      if (updated.sensoryText) {
        io.to(`campaign:${req.campaignId}:gm`).emit('quest_node_reached', {
          questId: req.params.id,
          nodeId: updated.id,
          sensoryText: updated.sensoryText
        });
      }

      // L'écran de table suit la progression de la quête : dès qu'un nœud
      // devient la scène courante, son illustration et son texte sensoriel y
      // sont poussés. C'est ce qui évite au MJ de pousser une image à la main
      // à chaque changement de scène.
      const scene = await buildCurrentScene(prisma, req.campaignId);
      io.to(`campaign:${req.campaignId}:table_screen`).emit('table_scene_changed', { scene });
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
    const node = await prisma.questNode.findFirst({
      where: { id: req.params.nodeId, questId: req.params.id, quest: { campaignId: req.campaignId } }
    });
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
        io.to(`campaign:${req.campaignId}:player`).emit('quest_node_timer_started', timerPayload);
        io.to(`campaign:${req.campaignId}:table_screen`).emit('quest_node_timer_started', timerPayload);
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
    const node = await prisma.questNode.findFirst({
      where: { id: req.params.nodeId, questId: req.params.id, quest: { campaignId: req.campaignId } }
    });
    if (!node) return res.status(404).json({ error: 'Node not found' });

    const updated = await prisma.questNode.update({
      where: { id: req.params.nodeId },
      data: { status: 'not_reached', reachedAt: null }
    });
    cancelNodeTimer(req.params.nodeId);
    
    if (io) {
      io.to(`campaign:${req.campaignId}:gm`).emit('quest_node_timer_cleared', { nodeId: updated.id });
      if (updated.timerVisibleToPlayers) {
        io.to(`campaign:${req.campaignId}:player`).emit('quest_node_timer_cleared', { nodeId: updated.id });
        io.to(`campaign:${req.campaignId}:table_screen`).emit('quest_node_timer_cleared', { nodeId: updated.id });
      }

      // Revenir en arrière change la scène courante : l'écran de table doit
      // suivre, sinon il continue d'afficher la scène que le MJ vient d'annuler.
      const scene = await buildCurrentScene(prisma, req.campaignId);
      io.to(`campaign:${req.campaignId}:table_screen`).emit('table_scene_changed', { scene });
    }

    res.json({ node: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to unreach node' });
  }
});

// POST /:id/nodes/:nodeId/spawn-encounter — Create encounter automatically from quest node template
router.post('/:id/nodes/:nodeId/spawn-encounter', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const node = await prisma.questNode.findFirst({
      where: { id: req.params.nodeId, questId: req.params.id, quest: { campaignId: req.campaignId } },
      include: { quest: true },
    });

    if (!node) return res.status(404).json({ error: 'Quest node not found' });

    // If already linked to an encounter, check if it exists
    if (node.linkedEncounterId) {
      const existing = await prisma.encounter.findUnique({
        where: { id: node.linkedEncounterId },
        include: { combatants: true },
      });
      if (existing) {
        return res.json({ encounterId: existing.id, encounter: existing, isExisting: true });
      }
    }

    // Parse combatTemplate JSON
    let templateItems = [];
    if (node.combatTemplate) {
      try {
        templateItems = JSON.parse(node.combatTemplate);
      } catch (e) {
        console.error('Failed to parse combatTemplate JSON:', e);
      }
    }

    // Create encounter
    const encounter = await prisma.encounter.create({
      data: {
        campaignId: req.campaignId,
        name: `Combat: ${node.title}`,
        description: `Rencontre déclenchée par la quête "${node.quest.name}" (Nœud: ${node.title})`,
        locationId: node.linkedLocationId || null,
        questNodeId: node.id,
        phase: 'planned',
        status: 'planned',
      },
    });

    // Populate combatants if template items exist
    if (Array.isArray(templateItems) && templateItems.length > 0) {
      const combatantsData = [];
      let maxOrder = 0;

      for (const item of templateItems) {
        const count = item.count || 1;
        for (let i = 0; i < count; i++) {
          maxOrder += 1;
          let cName = item.name;
          let cType = 'monster';
          let cSourceType = item.sourceType || 'manual';
          let cSourceId = item.sourceId;
          let cArmorClass = item.armorClass ?? 10;
          let cHpMax = item.hpMax ?? 10;
          let cHpCurrent = cHpMax;
          let cCharacterId = null;
          let cNpcId = null;
          let cBestiaryId = null;
          let cVehicleId = null;
          let cVisibleToPlayers = false;

          if (cSourceType === 'character' && cSourceId) {
            const char = await prisma.character.findFirst({ where: { id: cSourceId } });
            if (char) {
              cName = cName || char.name;
              cType = 'character';
              cArmorClass = char.armorClass || 10;
              cHpMax = char.hpMax || 10;
              cHpCurrent = char.hpCurrent || 10;
              cCharacterId = char.id;
              cVisibleToPlayers = true;
            }
          } else if (cSourceType === 'npc' && cSourceId) {
            const npc = await prisma.npc.findFirst({ where: { id: cSourceId }, include: { bestiary: true } });
            if (npc) {
              cName = cName || npc.name;
              cType = 'npc';
              cNpcId = npc.id;
              if (npc.armorClass !== null && npc.armorClass !== undefined) cArmorClass = npc.armorClass;
              else if (npc.bestiary) cArmorClass = npc.bestiary.armorClass;

              if (npc.hpMax !== null && npc.hpMax !== undefined) {
                cHpMax = npc.hpMax;
                cHpCurrent = npc.hpCurrent ?? npc.hpMax;
              } else if (npc.bestiary) {
                cHpMax = npc.bestiary.hpMax;
                cHpCurrent = npc.bestiary.hpMax;
              }
            }
          } else if (cSourceType === 'bestiary' && cSourceId) {
            const beast = await prisma.bestiary.findFirst({ where: { id: cSourceId } });
            if (beast) {
              const suffix = count > 1 ? ` ${i + 1}` : '';
              cName = (cName || beast.name) + suffix;
              cType = 'monster';
              cBestiaryId = beast.id;
              cArmorClass = beast.armorClass || 10;
              cHpMax = beast.hpMax || 10;
              cHpCurrent = beast.hpMax || 10;
            }
          } else if (cSourceType === 'vehicle' && cSourceId) {
            const vehicle = await prisma.vehicle.findFirst({
              where: { id: cSourceId },
              include: { crewSlots: { include: { character: true } } },
            });
            if (vehicle) {
              cName = cName || vehicle.name;
              cType = 'vehicle';
              cVehicleId = vehicle.id;
              cArmorClass = vehicle.acBase || 10;
              cHpMax = vehicle.hpMaxBase || 50;
              cHpCurrent = vehicle.hpCurrent || 50;

              // Auto add vehicle crew
              if (vehicle.crewSlots) {
                for (const slot of vehicle.crewSlots) {
                  if (slot.character) {
                    maxOrder += 1;
                    combatantsData.push({
                      encounterId: encounter.id,
                      name: `${slot.character.name} (${slot.role || 'Équipage'})`,
                      type: 'character',
                      sourceType: 'character',
                      sourceId: slot.character.id,
                      characterId: slot.character.id,
                      armorClass: slot.character.armorClass || 10,
                      hpMax: slot.character.hpMax || 10,
                      hpCurrent: slot.character.hpCurrent || 10,
                      isVisibleToPlayers: true,
                      orderIndex: maxOrder,
                    });
                  }
                }
              }
            }
          }

          combatantsData.push({
            encounterId: encounter.id,
            name: cName || 'Inconnu',
            type: cType,
            sourceType: cSourceType,
            sourceId: cSourceId,
            armorClass: cArmorClass,
            hpMax: cHpMax,
            hpCurrent: cHpCurrent,
            characterId: cCharacterId,
            npcId: cNpcId,
            bestiaryId: cBestiaryId,
            vehicleId: cVehicleId,
            isVisibleToPlayers: cVisibleToPlayers,
            orderIndex: maxOrder,
          });
        }
      }

      if (combatantsData.length > 0) {
        await prisma.encounterCombatant.createMany({ data: combatantsData });
      }
    }

    // Link node to encounter
    await prisma.questNode.update({
      where: { id: node.id },
      data: { linkedEncounterId: encounter.id },
    });

    const fullEncounter = await prisma.encounter.findUnique({
      where: { id: encounter.id },
      include: { combatants: true },
    });

    res.status(201).json({ encounterId: encounter.id, encounter: fullEncounter });
  } catch (err) {
    console.error('Spawn encounter error:', err);
    res.status(500).json({ error: 'Failed to spawn encounter' });
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

    // Le graphe était copié création par création : une interruption laissait
    // une quête à moitié dupliquée. La transaction garantit que soit tout est
    // copié, soit rien ne l'est.
    const newQuest = await prisma.$transaction(async (tx) => {
      // 1. Create duplicate quest
      const created = await tx.quest.create({
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
        const createdNode = await tx.questNode.create({
          data: {
            questId: created.id,
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
          await tx.questNode.update({
            where: { id: nodeMapping[node.id] },
            data: { timeoutNodeId: nodeMapping[node.timeoutNodeId] }
          });
        }
      }

      // 4. Duplicate connections
      const originalConnections = await tx.questNodeConnection.findMany({
        where: { fromNode: { questId: req.params.id } }
      });

      for (const conn of originalConnections) {
        if (nodeMapping[conn.fromNodeId] && nodeMapping[conn.toNodeId]) {
          await tx.questNodeConnection.create({
            data: {
              fromNodeId: nodeMapping[conn.fromNodeId],
              toNodeId: nodeMapping[conn.toNodeId],
              label: conn.label,
              isTimeoutConnection: conn.isTimeoutConnection
            }
          });
        }
      }

      return created;
    }, { timeout: 30000 });

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
// ============================================================
// v2 Extensions (Threats, Rewards, Factions, Characters)
// ============================================================

router.post('/:id/threats', validate(createQuestThreatSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const quest = await prisma.quest.findFirst({
      where: { id: req.params.id, campaignId: req.campaignId }
    });
    if (!quest) return res.status(404).json({ error: 'Quest not found' });

    const threat = await prisma.questThreatTracker.create({
      data: { ...req.body, questId: req.params.id }
    });
    res.json({ threat });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create threat' });
  }
});

router.put('/:id/threats/:threatId', validate(updateQuestThreatSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const threat = await prisma.questThreatTracker.findFirst({
      where: { id: req.params.threatId, questId: req.params.id, quest: { campaignId: req.campaignId } }
    });
    if (!threat) return res.status(404).json({ error: 'Threat not found' });

    const updated = await prisma.questThreatTracker.update({
      where: { id: req.params.threatId },
      data: req.body
    });
    res.json({ threat: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update threat' });
  }
});

router.post('/:id/nodes/:nodeId/rewards', validate(createQuestNodeRewardSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const node = await prisma.questNode.findFirst({
      where: { id: req.params.nodeId, questId: req.params.id, quest: { campaignId: req.campaignId } }
    });
    if (!node) return res.status(404).json({ error: 'Node not found' });

    const reward = await prisma.questNodeReward.create({
      data: { ...req.body, nodeId: req.params.nodeId }
    });
    res.json({ reward });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create reward' });
  }
});

router.post('/:id/nodes/:nodeId/threat-effects', validate(createQuestNodeThreatEffectSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const node = await prisma.questNode.findFirst({
      where: { id: req.params.nodeId, questId: req.params.id, quest: { campaignId: req.campaignId } }
    });
    if (!node) return res.status(404).json({ error: 'Node not found' });

    const effect = await prisma.questNodeThreatEffect.create({
      data: { ...req.body, nodeId: req.params.nodeId }
    });
    res.json({ effect });
  } catch (err) {
    res.status(500).json({ error: 'Failed to link threat effect' });
  }
});

router.post('/:id/factions', validate(createQuestFactionProgressSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const quest = await prisma.quest.findFirst({
      where: { id: req.params.id, campaignId: req.campaignId }
    });
    if (!quest) return res.status(404).json({ error: 'Quest not found' });

    const faction = await prisma.questFactionProgress.create({
      data: { ...req.body, questId: req.params.id }
    });
    res.json({ faction });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add faction progress' });
  }
});

router.post('/:id/characters/state', validate(updateQuestCharacterStateSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { characterId, stateKey, stateValue } = req.body;

    const quest = await prisma.quest.findFirst({
      where: { id: req.params.id, campaignId: req.campaignId }
    });
    if (!quest) return res.status(404).json({ error: 'Quest not found' });

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

// POST /:id/threats/:threatId/advance — Avancer l'horloge de 1 et vérifier les seuils
router.post('/:id/threats/:threatId/advance', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const io = req.app.get('io');
    const { direction } = req.body; // "increment" ou "decrement"
    
    const threat = await prisma.questThreatTracker.findFirst({
      where: { id: req.params.threatId, questId: req.params.id, quest: { campaignId: req.campaignId } }
    });
    if (!threat) return res.status(404).json({ error: 'Threat not found' });

    const delta = (direction === 'decrement') ? -1 : 1;
    const newLevel = Math.max(0, Math.min(threat.maxLevel, threat.currentLevel + delta));
    
    // Check thresholds
    let thresholds = [];
    try { thresholds = JSON.parse(threat.thresholds || '[]'); } catch(e) {}
    
    const triggeredThreshold = thresholds.find(t => t.level === newLevel);
    
    const updated = await prisma.questThreatTracker.update({
      where: { id: req.params.threatId },
      data: { currentLevel: newLevel }
    });

    if (triggeredThreshold && io) {
      io.to(`campaign:${req.campaignId}:gm`).emit('threat_threshold_reached', {
        questId: req.params.id,
        threatId: threat.id,
        threatName: threat.name,
        level: newLevel,
        maxLevel: threat.maxLevel,
        effect: triggeredThreshold.effect
      });
    }

    res.json({ threat: updated, triggeredThreshold: triggeredThreshold || null });
  } catch (err) {
    console.error('Advance threat error:', err);
    res.status(500).json({ error: 'Failed to advance threat' });
  }
});

// PATCH /:id/factions/:factionId — Mettre à jour l'état de relation
router.patch('/:id/factions/:factionId', validate(updateQuestFactionProgressSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { relationshipState, notes, progressValue } = req.body;

    const existing = await prisma.questFactionProgress.findFirst({
      where: { id: req.params.factionId, questId: req.params.id, quest: { campaignId: req.campaignId } }
    });
    if (!existing) return res.status(404).json({ error: 'Faction progress not found' });

    const faction = await prisma.questFactionProgress.update({
      where: { id: req.params.factionId },
      data: {
        ...(relationshipState !== undefined && { relationshipState }),
        ...(notes !== undefined && { notes }),
        ...(progressValue !== undefined && { progressValue }),
      }
    });
    res.json({ faction });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update faction' });
  }
});

// POST /:id/draw-event — Tirer un événement aléatoire du floatingEventDrawTable
router.post('/:id/draw-event', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const io = req.app.get('io');
    
    const mechanicNotes = await prisma.questMechanicNotes.findFirst({
      where: { questId: req.params.id, quest: { campaignId: req.campaignId } }
    });
    if (!mechanicNotes || !mechanicNotes.floatingEventDrawTable) {
      return res.status(404).json({ error: 'No draw table found for this quest' });
    }
    
    let drawTable;
    try { drawTable = JSON.parse(mechanicNotes.floatingEventDrawTable); } catch(e) {
      return res.status(500).json({ error: 'Invalid draw table JSON' });
    }
    
    const keys = Object.keys(drawTable.table || {});
    if (keys.length === 0) return res.status(400).json({ error: 'Draw table is empty' });
    
    // Pick uniformly from table keys
    const selectedKey = keys[Math.floor(Math.random() * keys.length)];
    const result = drawTable.table[selectedKey];
    const roll = parseInt(selectedKey, 10) || selectedKey;
    
    if (io) {
      io.to(`campaign:${req.campaignId}:gm`).emit('random_event_drawn', {
        questId: req.params.id,
        roll,
        result
      });
    }
    
    res.json({ roll, result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to draw event' });
  }
});

// --- NPC Profiles ---
router.get('/:id/npc-profiles', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const profiles = await prisma.questNPCProfile.findMany({
      where: { questId: req.params.id, quest: { campaignId: req.campaignId } }
    });
    res.json({ profiles });
  } catch (err) {
    res.status(500).json({ error: 'Failed to list NPC profiles' });
  }
});

router.post('/:id/npc-profiles', validate(createQuestNPCProfileSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const quest = await prisma.quest.findFirst({
      where: { id: req.params.id, campaignId: req.campaignId }
    });
    if (!quest) return res.status(404).json({ error: 'Quest not found' });

    const profile = await prisma.questNPCProfile.create({
      data: { ...req.body, questId: req.params.id }
    });
    res.json({ profile });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create NPC profile' });
  }
});

router.put('/:id/npc-profiles/:profileId', validate(updateQuestNPCProfileSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const existing = await prisma.questNPCProfile.findFirst({
      where: { id: req.params.profileId, questId: req.params.id, quest: { campaignId: req.campaignId } }
    });
    if (!existing) return res.status(404).json({ error: 'NPC profile not found' });

    const profile = await prisma.questNPCProfile.update({
      where: { id: req.params.profileId },
      data: req.body
    });
    res.json({ profile });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update NPC profile' });
  }
});

router.delete('/:id/npc-profiles/:profileId', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const existing = await prisma.questNPCProfile.findFirst({
      where: { id: req.params.profileId, questId: req.params.id, quest: { campaignId: req.campaignId } }
    });
    if (!existing) return res.status(404).json({ error: 'NPC profile not found' });

    await prisma.questNPCProfile.delete({ where: { id: req.params.profileId } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete NPC profile' });
  }
});

// --- Mechanic Notes ---
router.get('/:id/mechanic-notes', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const notes = await prisma.questMechanicNotes.findFirst({
      where: { questId: req.params.id, quest: { campaignId: req.campaignId } }
    });
    res.json({ mechanicNotes: notes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get mechanic notes' });
  }
});

router.put('/:id/mechanic-notes', validate(updateQuestMechanicNotesSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const quest = await prisma.quest.findFirst({
      where: { id: req.params.id, campaignId: req.campaignId }
    });
    if (!quest) return res.status(404).json({ error: 'Quest not found' });

    const notes = await prisma.questMechanicNotes.upsert({
      where: { questId: req.params.id },
      update: req.body,
      create: { ...req.body, questId: req.params.id }
    });
    res.json({ mechanicNotes: notes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update mechanic notes' });
  }
});

// ============================================================
// ARCHITECTURE REVIEW ADVANCED ENDPOINTS (BE-1 to BE-10)
// ============================================================

/**
 * BE-1: POST /:id/instantiate — Instancier un modèle de quête (QuestTemplate -> QuestInstance)
 * Duplique la structure statique d'une quête tout en réinitialisant l'état dynamique de la partie.
 */
router.post('/:id/instantiate', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');

    // Fetch full source template quest.
    // Le filtre sur campaignId manquait : un MJ d'une campagne pouvait instancier
    // le modele d'une autre campagne et en obtenir une copie complete. La route
    // soeur /duplicate verifiait pourtant la propriete.
    const templateQuest = await prisma.quest.findFirst({
      where: { id: req.params.id, campaignId: req.campaignId },
      include: {
        objectives: true,
        cityImpacts: true,
        npcLinks: true,
        locationLinks: true,
        itemLinks: true,
        nodes: { include: { connectionsFrom: true, rewards: true, threatEffects: true } },
        threats: true,
        factionProgress: true,
        npcProfiles: true,
        mechanicNotes: true,
      }
    });

    if (!templateQuest) {
      return res.status(404).json({ error: 'Source quest template not found' });
    }

    // Le graphe est copie enfant par enfant : une interruption laissait une
    // quete a moitie instanciee derriere elle. La transaction garantit que
    // soit tout est copie, soit rien ne l'est.
    const newQuest = await prisma.$transaction(async (tx) => {
      const created = await tx.quest.create({
        data: {
          campaignId: req.campaignId,
          name: `${templateQuest.name} (Instance Table)`,
          description: templateQuest.description,
          type: templateQuest.type,
          difficulty: templateQuest.difficulty,
          level: templateQuest.level,
          duration: templateQuest.duration,
          imageUrl: templateQuest.imageUrl,
          visibility: templateQuest.visibility,
          playerSummary: templateQuest.playerSummary,
          gmNotes: templateQuest.gmNotes,
          gmSecrets: templateQuest.gmSecrets,
          gmChangelog: templateQuest.gmChangelog,
          questGiverNpcId: templateQuest.questGiverNpcId,
          xpReward: templateQuest.xpReward,
          goldReward: templateQuest.goldReward,
          itemRewards: templateQuest.itemRewards,
          status: 'not_started',
          progress: 0,
          isTemplate: false,
          templateQuestId: templateQuest.id,
        }
      });

      // Map old node IDs to newly created node IDs
      const nodeIdMap = new Map();

      for (const n of templateQuest.nodes) {
        const createdNode = await tx.questNode.create({
          data: {
            questId: created.id,
            title: n.title,
            mjDescription: n.mjDescription,
            sensoryText: n.sensoryText,
            sensoryVisual: n.sensoryVisual,
            sensorySound: n.sensorySound,
            sensorySmell: n.sensorySmell,
            nodeType: n.nodeType,
            endOutcome: n.endOutcome,
            isTimed: n.isTimed,
            timerDurationSeconds: n.timerDurationSeconds,
            timerVisibleToPlayers: n.timerVisibleToPlayers,
            linkedNpcId: n.linkedNpcId,
            linkedLocationId: n.linkedLocationId,
            linkedEncounterId: n.linkedEncounterId,
            positionX: n.positionX,
            positionY: n.positionY,
            status: 'not_reached', // Reset runtime state
            reachedAt: null,
            detectionMechanic: n.detectionMechanic,
            pathGroup: n.pathGroup,
            displayCode: n.displayCode,
            isOptional: n.isOptional,
            pacingTag: n.pacingTag,
            requiredSkillCategory: n.requiredSkillCategory,
            isStrategicChoice: n.isStrategicChoice,
            routeChoiceOptions: n.routeChoiceOptions,
            poolNotes: n.poolNotes,
            generativeFailure: n.generativeFailure,
            captainSelection: n.captainSelection,
            resolutionBranches: n.resolutionBranches,
          }
        });
        nodeIdMap.set(n.id, createdNode.id);
      }

      // Re-create node connections with mapped IDs
      for (const n of templateQuest.nodes) {
        const newFromId = nodeIdMap.get(n.id);
        for (const conn of n.connectionsFrom) {
          const newToId = nodeIdMap.get(conn.toNodeId);
          if (newFromId && newToId) {
            await tx.questNodeConnection.create({
              data: {
                fromNodeId: newFromId,
                toNodeId: newToId,
                label: conn.label,
                isTimeoutConnection: conn.isTimeoutConnection,
                condition: conn.condition,
              }
            });
          }
        }

        // Re-create rewards
        for (const rew of n.rewards) {
          await tx.questNodeReward.create({
            data: {
              nodeId: newFromId,
              rewardType: rew.rewardType,
              rewardValue: rew.rewardValue,
              conditional: rew.conditional,
              payoffNodeId: rew.payoffNodeId ? nodeIdMap.get(rew.payoffNodeId) || rew.payoffNodeId : null
            }
          });
        }
      }

      // Duplicate Threat Trackers
      const threatIdMap = new Map();
      for (const threat of templateQuest.threats) {
        const createdThreat = await tx.questThreatTracker.create({
          data: {
            questId: created.id,
            name: threat.name,
            currentLevel: 0, // Reset clock level
            maxLevel: threat.maxLevel,
            stateLabel: threat.stateLabel,
            description: threat.description,
            thresholds: threat.thresholds,
            directApparitionBudget: threat.directApparitionBudget,
          }
        });
        threatIdMap.set(threat.id, createdThreat.id);
      }

      // Duplicate Threat Effects
      for (const n of templateQuest.nodes) {
        const newFromId = nodeIdMap.get(n.id);
        for (const eff of n.threatEffects) {
          const newThreatId = threatIdMap.get(eff.threatId);
          if (newFromId && newThreatId) {
            await tx.questNodeThreatEffect.create({
              data: {
                nodeId: newFromId,
                threatId: newThreatId,
                effect: eff.effect,
                effectValue: eff.effectValue,
                condition: eff.condition,
                notes: eff.notes,
              }
            });
          }
        }
      }

      // Duplicate Objectives (reset status to pending)
      for (const obj of templateQuest.objectives) {
        await tx.questObjective.create({
          data: {
            questId: created.id,
            description: obj.description,
            orderIndex: obj.orderIndex,
            isHidden: obj.isHidden,
            isOptional: obj.isOptional,
            status: 'pending',
            notes: obj.notes,
            investigationLeads: obj.investigationLeads,
            unlockedByNodeId: obj.unlockedByNodeId ? nodeIdMap.get(obj.unlockedByNodeId) || obj.unlockedByNodeId : null,
          }
        });
      }

      // Duplicate Faction Progress (reset to neutral/0)
      for (const f of templateQuest.factionProgress) {
        await tx.questFactionProgress.create({
          data: {
            questId: created.id,
            factionName: f.factionName,
            progressValue: 0,
            relationshipState: 'neutre',
            notes: f.notes,
          }
        });
      }

      // Duplicate NPC Profiles
      for (const prof of templateQuest.npcProfiles) {
        await tx.questNPCProfile.create({
          data: {
            questId: created.id,
            npcId: prof.npcId,
            name: prof.name,
            speechPattern: prof.speechPattern,
            physicalTic: prof.physicalTic,
            signatureBehavior: prof.signatureBehavior,
          }
        });
      }

      // Duplicate Mechanic Notes
      if (templateQuest.mechanicNotes) {
        const mn = templateQuest.mechanicNotes;
        await tx.questMechanicNotes.create({
          data: {
            questId: created.id,
            scenePoolFramework: mn.scenePoolFramework,
            rivalConvoyEncounterFramework: mn.rivalConvoyEncounterFramework,
            generativeFailures: mn.generativeFailures,
            stakesBeforeRoll: mn.stakesBeforeRoll,
            sensoryPresentationVariety: mn.sensoryPresentationVariety,
            tableCalibration: mn.tableCalibration,
            ruleSystemConversion: mn.ruleSystemConversion,
            floatingEventDrawTable: mn.floatingEventDrawTable,
            postSessionDebrief: mn.postSessionDebrief,
            tableMusic: mn.tableMusic,
          }
        });
      }

      return created;
    }, { timeout: 30000 });

    res.status(201).json({ quest: newQuest });
  } catch (err) {
    console.error('Instantiate quest error:', err);
    res.status(500).json({ error: 'Failed to instantiate quest' });
  }
});

/**
 * BE-1: POST /:id/reset-instance — Réinitialiser l'état d'une partie en cours
 */
router.post('/:id/reset-instance', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const questId = req.params.id;

    // Reset quest status
    await prisma.quest.update({
      where: { id: questId },
      data: { status: 'not_started', progress: 0 }
    });

    // Reset all node statuses
    await prisma.questNode.updateMany({
      where: { questId },
      data: { status: 'not_reached', reachedAt: null }
    });

    // Reset threat trackers
    await prisma.questThreatTracker.updateMany({
      where: { questId },
      data: { currentLevel: 0 }
    });

    // Reset objectives
    await prisma.questObjective.updateMany({
      where: { questId },
      data: { status: 'pending' }
    });

    // Reset faction progress
    await prisma.questFactionProgress.updateMany({
      where: { questId },
      data: { progressValue: 0, relationshipState: 'neutre' }
    });

    // Clear character states
    await prisma.questCharacterState.deleteMany({ where: { questId } });

    res.json({ success: true, message: 'Partie réinitialisée à l\'état vierge.' });
  } catch (err) {
    console.error('Reset quest instance error:', err);
    res.status(500).json({ error: 'Failed to reset quest instance' });
  }
});

/**
 * BE-4: POST /:id/evaluate-conditions — Évaluer la validité des branches conditionnelles du graphe
 */
router.post('/:id/evaluate-conditions', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const questId = req.params.id;
    const { route } = req.body;

    const quest = await prisma.quest.findFirst({
      where: { id: questId, campaignId: req.campaignId },
      include: {
        nodes: { include: { connectionsFrom: true } },
        threats: true,
        factionProgress: true,
        characterStates: true,
      }
    });

    if (!quest) return res.status(404).json({ error: 'Quest not found' });

    // Build playthrough context
    const threatsMap = {};
    (quest.threats || []).forEach(t => { threatsMap[t.name] = t; threatsMap[t.id] = t; });

    const factionsMap = {};
    (quest.factionProgress || []).forEach(f => { factionsMap[f.factionName] = f; });

    const charStatesMap = {};
    (quest.characterStates || []).forEach(cs => { charStatesMap[cs.stateKey] = cs.stateValue; });

    const reachedNodeIds = (quest.nodes || []).filter(n => n.status === 'reached').map(n => n.id);

    const context = {
      route: route || 'longue',
      threats: threatsMap,
      factions: factionsMap,
      characterStates: charStatesMap,
      reachedNodeIds
    };

    // Evaluate connections
    const evaluatedConnections = [];
    for (const node of quest.nodes) {
      for (const conn of node.connectionsFrom) {
        const evalResult = evaluateCondition(conn.condition, context);
        evaluatedConnections.push({
          connectionId: conn.id,
          fromNodeId: conn.fromNodeId,
          toNodeId: conn.toNodeId,
          condition: conn.condition,
          isAvailable: evalResult.isMet,
          reason: evalResult.reason
        });
      }
    }

    res.json({ context, evaluatedConnections });
  } catch (err) {
    console.error('Evaluate conditions error:', err);
    res.status(500).json({ error: 'Failed to evaluate conditions' });
  }
});

/**
 * BE-5: POST /:id/scene-pool/draw — Tirage procédural du pool de scènes
 */
router.post('/:id/scene-pool/draw', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const questId = req.params.id;

    const notes = await prisma.questMechanicNotes.findFirst({
      where: { questId }
    });

    if (!notes || !notes.scenePoolFramework) {
      return res.status(404).json({ error: 'No scene pool framework defined for this quest' });
    }

    let framework;
    try { framework = JSON.parse(notes.scenePoolFramework); } catch (e) {
      return res.status(500).json({ error: 'Invalid scene pool JSON framework' });
    }

    const availableNodes = framework.availableNodeIds || [];
    const drawn = framework.drawnNodeIds || [];
    const remaining = availableNodes.filter(id => !drawn.includes(id));

    if (remaining.length === 0) {
      return res.json({
        completed: true,
        message: 'Toutes les scènes du pool ont déjà été tirées.',
        mandatoryClosureNodeId: framework.mandatoryClosureNodeId
      });
    }

    // Pick random node from remaining pool
    const selectedNodeId = remaining[Math.floor(Math.random() * remaining.length)];
    const updatedDrawn = [...drawn, selectedNodeId];

    framework.drawnNodeIds = updatedDrawn;

    // Update mechanic notes
    await prisma.questMechanicNotes.update({
      where: { id: notes.id },
      data: { scenePoolFramework: JSON.stringify(framework) }
    });

    // Mark selected node as reached or available
    const node = await prisma.questNode.findUnique({ where: { id: selectedNodeId } });

    res.json({
      selectedNode: node,
      drawnCount: updatedDrawn.length,
      requiredCount: framework.requiredCount || 3,
      remainingCount: availableNodes.length - updatedDrawn.length,
      isPoolComplete: updatedDrawn.length >= (framework.requiredCount || 3)
    });
  } catch (err) {
    console.error('Scene pool draw error:', err);
    res.status(500).json({ error: 'Failed to draw scene from pool' });
  }
});

/**
 * BE-7: GET /:id/audit-integrity — Contrôle d'intégrité référentielle du graphe
 */
router.get('/:id/audit-integrity', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const quest = await prisma.quest.findFirst({
      where: { id: req.params.id, campaignId: req.campaignId },
      include: {
        nodes: { include: { connectionsFrom: true, rewards: true, threatEffects: true } },
        objectives: true,
        threats: true,
        factionProgress: true,
        npcProfiles: true,
      }
    });

    if (!quest) return res.status(404).json({ error: 'Quest not found' });

    const report = auditQuestIntegrity(quest);
    res.json({ report });
  } catch (err) {
    console.error('Audit integrity error:', err);
    res.status(500).json({ error: 'Failed to audit quest integrity' });
  }
});

/**
 * BE-10: POST /:id/convert-rules — Module de conversion du système de règles
 */
router.post('/:id/convert-rules', async (req, res) => {
  try {
    const { text, targetSystem } = req.body;
    const conversion = convertRuleSystem(text || '', targetSystem || 'dnd5e');
    res.json({ conversion });
  } catch (err) {
    console.error('Convert rules error:', err);
    res.status(500).json({ error: 'Failed to convert rules' });
  }
});

module.exports = router;

