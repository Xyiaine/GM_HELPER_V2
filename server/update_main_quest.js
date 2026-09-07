const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Map of node titles from Campagne_v4_QuestData.json & Campagne_v3_Lore.md
const NODE_TITLES = {
  "node_0a": "0.a — Le réveil en mouvement",
  "node_0b": "0.b — La détente encore pressée",
  "node_0c": "0.c — L'épave au loin",
  "node_0d": "0.d — Le sol qui tremble",
  "node_0e": "0.e — Fouille de l'épave (optionnel)",
  "node_1_route_choice": "1.route — Choix stratégique d'itinéraire",
  "node_1a": "1.a — Cimetière de tôle",
  "node_1a_carcasse_imprevue": "1.a-génératif — Carcasse imprévue",
  "node_1b": "1.b — La chaleur écrasante",
  "node_1c": "1.c — Tempête de sable radioactive",
  "node_1d": "1.d — Panne mécanique",
  "node_1d_bis": "1.d-bis — La caisse qui craque",
  "node_1e": "1.e — Premier contact avec un convoi rival",
  "node_1f": "1.f — Bivouac du soir (RP & Bruit de fond)",
  "node_1f_bis": "1.f-bis — Le nom qui manque (Ines)",
  "node_1f_ter": "1.f-ter — Un geste qu'on croit reconnaître",
  "node_15a": "1.5.a — La Suspension",
  "node_15b": "1.5.b — Le chant à travers le blanc",
  "node_15c": "1.5.c — Tempête statique (flashbacks)",
  "node_2Aa": "2A.a — Les Dunes Chantantes",
  "node_2Ab": "2A.b — Le chant grandit",
  "node_2Ac": "2A.c — Poussière et moteurs",
  "node_2Ad": "2A.d — Attaque des Loups de Sel",
  "node_2Ad_marche_doran": "2A.d-marché — Le marché de Doran",
  "node_2Ae": "2A.e — Le Ver revient",
  "node_2Af": "2A.f — Les Enfants du Sel",
  "node_2Ba": "2B.a — Le Verre Noir",
  "node_2Bb": "2B.b — Cliquetis et lueurs",
  "node_2Bc": "2B.c — Poches de radiation",
  "node_2Bd": "2B.d — Les Cendres Silencieuses",
  "node_2Be": "2B.e — Le Ver frustré",
  "node_2x_echo_frontiere": "2.x — Écho de la frontière",
  "node_2y_convoi_en_detresse": "2.y — Convoi en détresse",
  "node_convergence": "convergence-2 — Point de ralliement",
  "node_3a": "3.a — Le Cimetière des Convois",
  "node_3a_bis": "3.a-bis — L'ombre de la Garde",
  "node_3b": "3.b — Convergence des convois",
  "node_3c": "3.c — L'obstacle final",
  "node_3c_raccourci_risque": "3.c-génératif — Raccourci risqué",
  "node_3d": "3.d — Sprint final",
  "node_3e": "3.e — Ultime apparition du ver (optionnelle)",
  "node_end_success": "FIN-succes — Recrutement dans la Garde",
  "node_end_alt": "FIN-alternative — Échec au sprint"
};

// 2D Spatial positions layout for graph visualization
const NODE_POSITIONS = {
  "node_0a": { x: 400, y: 100 },
  "node_0b": { x: 400, y: 220 },
  "node_0c": { x: 400, y: 340 },
  "node_0d": { x: 400, y: 460 },
  "node_0e": { x: 650, y: 460 },
  "node_1_route_choice": { x: 400, y: 550 },
  "node_1a": { x: 250, y: 680 },
  "node_1a_carcasse_imprevue": { x: 100, y: 680 },
  "node_1b": { x: 400, y: 680 },
  "node_1c": { x: 550, y: 680 },
  "node_1d": { x: 700, y: 680 },
  "node_1d_bis": { x: 850, y: 680 },
  "node_1e": { x: 400, y: 800 },
  "node_1f": { x: 400, y: 920 },
  "node_1f_bis": { x: 250, y: 920 },
  "node_1f_ter": { x: 550, y: 920 },
  "node_15a": { x: 400, y: 1060 },
  "node_15b": { x: 400, y: 1180 },
  "node_15c": { x: 650, y: 1180 },
  "node_2Aa": { x: 150, y: 1320 },
  "node_2Ab": { x: 150, y: 1440 },
  "node_2Ac": { x: 150, y: 1560 },
  "node_2Ad": { x: 150, y: 1680 },
  "node_2Ad_marche_doran": { x: 20, y: 1680 },
  "node_2Ae": { x: 150, y: 1800 },
  "node_2Af": { x: 150, y: 1920 },
  "node_2Ba": { x: 650, y: 1320 },
  "node_2Bb": { x: 650, y: 1440 },
  "node_2Bc": { x: 650, y: 1560 },
  "node_2Bd": { x: 650, y: 1680 },
  "node_2Be": { x: 650, y: 1800 },
  "node_2x_echo_frontiere": { x: 400, y: 1440 },
  "node_2y_convoi_en_detresse": { x: 400, y: 1560 },
  "node_convergence": { x: 400, y: 2040 },
  "node_3a": { x: 400, y: 2160 },
  "node_3a_bis": { x: 650, y: 2160 },
  "node_3b": { x: 400, y: 2280 },
  "node_3c": { x: 400, y: 2400 },
  "node_3c_raccourci_risque": { x: 650, y: 2400 },
  "node_3d": { x: 400, y: 2520 },
  "node_3e": { x: 650, y: 2520 },
  "node_end_success": { x: 250, y: 2660 },
  "node_end_alt": { x: 550, y: 2660 }
};

const COMBAT_TEMPLATES = {
  "node_2Ad": [
    { sourceType: "bestiary", name: "Loup du Désert / Meute du Bassin", count: 3 }
  ],
  "node_2Ae": [
    { sourceType: "bestiary", name: "Jeune Ver des Sables", count: 1 }
  ],
  "node_2Bb": [
    { sourceType: "bestiary", name: "Scorpion de Verre", count: 2 }
  ],
  "node_3c": [
    { sourceType: "bestiary", name: "Essaim de Criquets-Blindés", count: 2 }
  ],
  "node_3e": [
    { sourceType: "bestiary", name: "Ver de Ferraille", count: 3 }
  ]
};

async function main() {
  console.log("=== Updating Main Quest with Campagne_v4_QuestData.json ===");

  // Read JSON v4
  let jsonPath = path.join(__dirname, '..', 'Cahier des charges', 'Campagne_v4_QuestData.json');
  if (!fs.existsSync(jsonPath)) {
    jsonPath = path.join(__dirname, '..', 'Campagne_v4_QuestData.json');
  }
  console.log(`Loading quest data from: ${jsonPath}`);
  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  const questData = JSON.parse(rawData);

  // Find Campaign
  let campaign = await prisma.campaign.findFirst({
    where: { name: "Chroniques de l'Apocalypse" }
  });

  if (!campaign) {
    campaign = await prisma.campaign.findFirst();
  }

  if (!campaign) {
    console.error("No campaign found in database.");
    process.exit(1);
  }

  console.log(`Campaign found: ${campaign.name} (${campaign.id})`);

  // Find existing main quest or create it
  let quest = await prisma.quest.findFirst({
    where: {
      campaignId: campaign.id,
      OR: [
        { type: "principale" },
        { type: "main" },
        { name: { contains: "Course" } }
      ]
    }
  });

  // Extract secrets vs notes per BE-8
  const fullGmNotes = questData.Quest.gmNotes || "";
  const secretMarkerIndex = fullGmNotes.indexOf("MISE À JOUR v4");
  const gmSecrets = secretMarkerIndex !== -1 ? fullGmNotes.substring(0, secretMarkerIndex).trim() : fullGmNotes;
  const gmChangelog = secretMarkerIndex !== -1 ? fullGmNotes.substring(secretMarkerIndex).trim() : "";

  const questPayload = {
    campaignId: campaign.id,
    name: questData.Quest.name,
    description: questData.Quest.description,
    gmNotes: fullGmNotes,
    gmSecrets: gmSecrets,
    gmChangelog: gmChangelog,
    playerSummary: questData.Quest.playerSummary,
    type: "principale",
    difficulty: questData.Quest.difficulty,
    level: 1,
    duration: questData.Quest.estimatedDuration,
    itemRewards: JSON.stringify(questData.Quest.itemRewards || []),
    status: questData.Quest.status || "not_started",
    progress: questData.Quest.progress || 0,
    visibility: questData.Quest.visibility || "partial"
  };

  if (quest) {
    console.log(`Updating existing quest: ${quest.name} (${quest.id})`);
    quest = await prisma.quest.update({
      where: { id: quest.id },
      data: questPayload
    });
  } else {
    console.log(`Creating main quest: ${questData.Quest.name}`);
    quest = await prisma.quest.create({
      data: questPayload
    });
  }

  // Clear previous quest components to rebuild cleanly
  console.log("Clearing old nodes, objectives, threats, connections, links, profiles, notes...");
  await prisma.questNodeConnection.deleteMany({
    where: {
      OR: [
        { fromNode: { questId: quest.id } },
        { toNode: { questId: quest.id } }
      ]
    }
  });
  await prisma.questNodeThreatEffect.deleteMany({
    where: { node: { questId: quest.id } }
  });
  await prisma.questNodeReward.deleteMany({
    where: { node: { questId: quest.id } }
  });
  await prisma.questNode.deleteMany({ where: { questId: quest.id } });
  await prisma.questObjective.deleteMany({ where: { questId: quest.id } });
  await prisma.questThreatTracker.deleteMany({ where: { questId: quest.id } });
  await prisma.questFactionProgress.deleteMany({ where: { questId: quest.id } });
  await prisma.questCharacterState.deleteMany({ where: { questId: quest.id } });
  await prisma.questNPCLink.deleteMany({ where: { questId: quest.id } });
  await prisma.questLocationLink.deleteMany({ where: { questId: quest.id } });
  await prisma.questItemLink.deleteMany({ where: { questId: quest.id } });
  await prisma.questNPCProfile.deleteMany({ where: { questId: quest.id } });
  await prisma.questMechanicNotes.deleteMany({ where: { questId: quest.id } });

  // 1. Objectives
  console.log("Creating Objectives...");
  for (const obj of questData.QuestObjective) {
    await prisma.questObjective.create({
      data: {
        questId: quest.id,
        description: obj.label,
        orderIndex: obj.order || 1,
        isHidden: !!obj.isHidden,
        isOptional: !!obj.isOptional,
        status: obj.status || "pending",
        notes: obj.notes || null,
        investigationLeads: obj.investigationLeads ? JSON.stringify(obj.investigationLeads) : null,
        unlockedByNodeId: obj.unlockedByNodeId || null
      }
    });
  }

  // 2. Threat Trackers
  console.log("Creating Threat Trackers...");
  const threatMap = {};
  for (const threat of questData.QuestThreatTracker) {
    const createdThreat = await prisma.questThreatTracker.create({
      data: {
        questId: quest.id,
        name: threat.name,
        currentLevel: threat.currentLevel || 0,
        maxLevel: threat.maxLevel || 6,
        stateLabel: threat.stateLabel || "dormant",
        description: threat.description,
        thresholds: threat.thresholds ? JSON.stringify(threat.thresholds) : null,
        directApparitionBudget: threat.directApparitionBudget ? JSON.stringify(threat.directApparitionBudget) : null
      }
    });
    threatMap[threat.id] = createdThreat.id;
  }

  // 3. Faction Progress
  console.log("Creating Faction Progress...");
  for (const faction of questData.QuestFactionProgress) {
    await prisma.questFactionProgress.create({
      data: {
        questId: quest.id,
        factionName: faction.factionName,
        progressValue: faction.progressValue || 0,
        lastUpdatedNodeId: faction.lastUpdatedNodeId || null,
        relationshipState: faction.relationshipState || "neutre",
        relationshipUpdateNodeIds: faction.relationshipUpdateNodeIds ? JSON.stringify(faction.relationshipUpdateNodeIds) : null,
        relationshipNotes: faction.relationshipNotes || null,
        notes: faction.notes || null
      }
    });
  }

  // 4. Character States
  console.log("Creating Character States template...");
  const campaignCharacters = await prisma.character.findMany({
    where: { campaignId: campaign.id }
  });
  if (questData.QuestCharacterState && questData.QuestCharacterState.stateKeysTemplate) {
    for (const char of campaignCharacters) {
      for (const tpl of questData.QuestCharacterState.stateKeysTemplate) {
        await prisma.questCharacterState.create({
          data: {
            questId: quest.id,
            characterId: char.id,
            stateKey: tpl.stateKey,
            stateValue: String(tpl.defaultValue)
          }
        });
      }
    }
  }

  // 5. NPC Profiles & Links
  console.log("Creating NPC Profiles & Links...");
  for (const prof of (questData.QuestNPCProfile || [])) {
    await prisma.questNPCProfile.create({
      data: {
        questId: quest.id,
        npcId: prof.npcId,
        name: prof.name,
        speechPattern: prof.voiceNotes?.speechPattern || null,
        physicalTic: prof.voiceNotes?.physicalTic || null,
        signatureBehavior: prof.voiceNotes?.signatureBehavior || null
      }
    });
  }

  for (const link of (questData.QuestNPCLink || [])) {
    let npc = await prisma.nPC.findFirst({
      where: {
        campaignId: campaign.id,
        OR: [
          { id: link.npcId },
          { name: { contains: link.npcId.replace('npc_', '').replace('_', ' ') } }
        ]
      }
    });

    if (!npc) {
      npc = await prisma.nPC.create({
        data: {
          campaignId: campaign.id,
          name: link.npcId.replace('npc_', '').replace(/_/g, ' '),
          role: link.role
        }
      });
    }

    await prisma.questNPCLink.create({
      data: {
        questId: quest.id,
        npcId: npc.id,
        role: link.role
      }
    });
  }

  // 6. Location Links
  console.log("Creating Location Links...");
  for (const locLink of (questData.QuestLocationLink || [])) {
    let location = await prisma.location.findFirst({
      where: {
        campaignId: campaign.id,
        name: { contains: locLink.locationId.replace('loc_', '').replace(/_/g, ' ') }
      }
    });

    if (!location) {
      location = await prisma.location.create({
        data: {
          campaignId: campaign.id,
          name: locLink.locationId.replace('loc_', '').replace(/_/g, ' '),
          type: "region",
          description: locLink.notes || null
        }
      });
    }

    await prisma.questLocationLink.create({
      data: {
        questId: quest.id,
        locationId: location.id,
        role: "exploration"
      }
    });
  }

  // 7. Item Links
  console.log("Creating Item Links...");
  for (const itemLink of (questData.QuestItemLink || [])) {
    let item = await prisma.item.findFirst({
      where: {
        campaignId: campaign.id,
        name: { contains: itemLink.itemId.replace('item_', '').replace(/_/g, ' ') }
      }
    });

    if (!item) {
      item = await prisma.item.create({
        data: {
          campaignId: campaign.id,
          name: itemLink.itemId.replace('item_', '').replace(/_/g, ' '),
          description: itemLink.notes || null,
          type: "quest"
        }
      });
    }

    await prisma.questItemLink.create({
      data: {
        questId: quest.id,
        itemId: item.id
      }
    });
  }

  // 8. Mechanic Notes
  console.log("Creating Mechanic Notes...");
  if (questData.QuestMechanicNotes) {
    const mn = questData.QuestMechanicNotes;
    await prisma.questMechanicNotes.create({
      data: {
        questId: quest.id,
        scenePoolFramework: mn.scenePoolFramework ? JSON.stringify(mn.scenePoolFramework) : null,
        rivalConvoyEncounterFramework: mn.rivalConvoyEncounterFramework ? JSON.stringify(mn.rivalConvoyEncounterFramework) : null,
        generativeFailures: mn.generativeFailures ? JSON.stringify(mn.generativeFailures) : null,
        stakesBeforeRoll: mn.stakesBeforeRoll ? JSON.stringify(mn.stakesBeforeRoll) : null,
        sensoryPresentationVariety: mn.sensoryPresentationVariety ? JSON.stringify(mn.sensoryPresentationVariety) : null,
        tableCalibration: mn.tableCalibration ? JSON.stringify(mn.tableCalibration) : null,
        ruleSystemConversion: mn.ruleSystemConversion ? JSON.stringify(mn.ruleSystemConversion) : null,
        floatingEventDrawTable: mn.floatingEventDrawTable ? JSON.stringify(mn.floatingEventDrawTable) : null,
        postSessionDebrief: mn.postSessionDebrief ? JSON.stringify(mn.postSessionDebrief) : null,
        tableMusic: mn.tableMusic ? JSON.stringify(mn.tableMusic) : null
      }
    });
  }

  // 9. Quest Nodes
  console.log("Creating Nodes...");
  const nodeMap = {}; // jsonId -> dbNodeId

  for (const jsonNode of questData.QuestNode) {
    const title = NODE_TITLES[jsonNode.id] || `${jsonNode.displayCode || jsonNode.id} — Node`;
    const pos = NODE_POSITIONS[jsonNode.id] || { x: 400, y: 500 };

    // Format sensoryText
    let sensoryText = jsonNode.sensoryText;
    if (!sensoryText && (jsonNode.sensoryVisual || jsonNode.sensorySound || jsonNode.sensorySmell)) {
      const parts = [];
      if (jsonNode.sensoryVisual) parts.push(`VISUEL : ${jsonNode.sensoryVisual}`);
      if (jsonNode.sensorySound) parts.push(`BRUIT : ${jsonNode.sensorySound}`);
      if (jsonNode.sensorySmell) parts.push(`ODEUR : ${jsonNode.sensorySmell}`);
      sensoryText = parts.join('\n\n');
    }

    let fullMjDesc = jsonNode.mjDescription || "";
    if (jsonNode.problems && jsonNode.problems.length > 0) {
      fullMjDesc += `\n\n**Problèmes à résoudre** :\n` + jsonNode.problems.map(p => `- "${p.description}" [${p.skillCheck}] → ${p.failureConsequence}`).join('\n');
    }
    if (jsonNode.actionsNarrativeHook) {
      fullMjDesc += `\n\n**Amorce Narrative** : ${jsonNode.actionsNarrativeHook}`;
    }
    if (jsonNode.suggestedActions && jsonNode.suggestedActions.length > 0) {
      fullMjDesc += `\n\n**Actions Suggérées** :\n` + jsonNode.suggestedActions.map(a => `- ${a}`).join('\n');
    }

    const isTimed = jsonNode.timer ? jsonNode.timer.enabled : false;
    const detectionMechanicStr = jsonNode.detectionMechanic ? JSON.stringify(jsonNode.detectionMechanic) : null;

    // Define combat template if provided in JSON or mapped defaults
    let combatTemplateStr = jsonNode.combatTemplate ? JSON.stringify(jsonNode.combatTemplate) : null;
    if (!combatTemplateStr && COMBAT_TEMPLATES[jsonNode.id]) {
      combatTemplateStr = JSON.stringify(COMBAT_TEMPLATES[jsonNode.id]);
    }

    const createdNode = await prisma.questNode.create({
      data: {
        questId: quest.id,
        title: title,
        nodeType: jsonNode.type === "convergence" ? "intermediate" : jsonNode.type,
        endOutcome: jsonNode.outcome || null,
        mjDescription: fullMjDesc,
        sensoryText: sensoryText,
        sensoryVisual: jsonNode.sensoryVisual || null,
        sensorySound: jsonNode.sensorySound || null,
        sensorySmell: jsonNode.sensorySmell || null,
        isTimed: isTimed,
        timerDurationSeconds: isTimed ? 180 : null,
        positionX: pos.x,
        positionY: pos.y,
        detectionMechanic: detectionMechanicStr,
        pathGroup: jsonNode.pathGroup || null,
        displayCode: jsonNode.displayCode || null,
        isOptional: !!jsonNode.isOptional,
        pacingTag: jsonNode.pacingTag || null,
        requiredSkillCategory: jsonNode.requiredSkillCategory || null,
        status: jsonNode.reached ? "reached" : "not_reached",
        isStrategicChoice: !!jsonNode.isStrategicChoice,
        routeChoiceOptions: jsonNode.routeChoiceOptions ? JSON.stringify(jsonNode.routeChoiceOptions) : null,
        poolNotes: jsonNode.poolNotes || null,
        generativeFailure: jsonNode.generativeFailure ? JSON.stringify(jsonNode.generativeFailure) : null,
        captainSelection: jsonNode.captainSelection ? JSON.stringify(jsonNode.captainSelection) : null,
        resolutionBranches: jsonNode.resolutionBranches ? JSON.stringify(jsonNode.resolutionBranches) : null,
        combatTemplate: combatTemplateStr
      }
    });

    nodeMap[jsonNode.id] = createdNode.id;
  }

  // Update timeout node references
  for (const jsonNode of questData.QuestNode) {
    if (jsonNode.timer && jsonNode.timer.timeoutNodeId) {
      const dbNodeId = nodeMap[jsonNode.id];
      const timeoutDbNodeId = nodeMap[jsonNode.timer.timeoutNodeId];
      if (dbNodeId && timeoutDbNodeId) {
        await prisma.questNode.update({
          where: { id: dbNodeId },
          data: { timeoutNodeId: timeoutDbNodeId }
        });
      }
    }
  }

  // 10. Node Connections
  console.log("Creating Connections...");
  for (const conn of questData.QuestNodeConnection) {
    const fromId = nodeMap[conn.fromNodeId];
    const toId = nodeMap[conn.toNodeId];

    if (!fromId || !toId) {
      console.warn(`Connection missing node mapping: ${conn.fromNodeId} -> ${conn.toNodeId}`);
      continue;
    }

    const isTimeout = conn.fromNodeId === "node_15a" && conn.toNodeId === "node_15c";

    await prisma.questNodeConnection.create({
      data: {
        fromNodeId: fromId,
        toNodeId: toId,
        label: conn.label || null,
        isTimeoutConnection: isTimeout,
        condition: conn.condition || null
      }
    });
  }

  // 11. Threat Effects
  console.log("Creating Threat Effects...");
  for (const effect of questData.QuestNodeThreatEffect) {
    const nodeId = nodeMap[effect.nodeId];
    const threatId = threatMap[effect.threatId];
    if (nodeId && threatId) {
      await prisma.questNodeThreatEffect.create({
        data: {
          nodeId: nodeId,
          threatId: threatId,
          effect: effect.effect,
          effectValue: effect.effectValue || 1,
          condition: effect.condition || null,
          notes: effect.notes || null
        }
      });
    }
  }

  // 12. Node Rewards
  console.log("Creating Node Rewards...");
  for (const reward of questData.QuestNodeReward) {
    const nodeId = nodeMap[reward.nodeId];
    if (nodeId) {
      await prisma.questNodeReward.create({
        data: {
          nodeId: nodeId,
          rewardType: reward.rewardType,
          rewardValue: reward.rewardValue,
          conditional: reward.conditional || null,
          payoffNodeId: reward.payoffNodeId || null
        }
      });
    }
  }

  const { instantiateQuestEncounters } = require('./src/services/questCombatService');
  console.log("Instantiating quest combat encounters...");
  const encounters = await instantiateQuestEncounters(prisma, campaign.id, quest.id);

  console.log(`\nSUCCESS! Main quest "${quest.name}" updated cleanly with all v4 QuestData!`);
  console.log(`- Nodes created: ${Object.keys(nodeMap).length}`);
  console.log(`- Connections created: ${questData.QuestNodeConnection.length}`);
  console.log(`- Objectives created: ${questData.QuestObjective.length}`);
  console.log(`- Threat Trackers: ${questData.QuestThreatTracker.length}`);
  console.log(`- Faction Progress entries: ${questData.QuestFactionProgress.length}`);
  console.log(`- NPC Profiles created: ${(questData.QuestNPCProfile || []).length}`);
  console.log(`- Encounters instantiated: ${encounters.length}`);
}

main()
  .catch(err => {
    console.error("Error updating main quest:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
