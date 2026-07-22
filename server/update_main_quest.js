const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Map of node titles from Campagne_v3_Lore.md
const NODE_TITLES = {
  "node_0a": "0.a — Le réveil en mouvement",
  "node_0b": "0.b — La détente encore pressée",
  "node_0c": "0.c — L'épave au loin",
  "node_0d": "0.d — Le sol qui tremble",
  "node_0e": "0.e — Fouille de l'épave (optionnel)",
  "node_1a": "1.a — Cimetière de tôle",
  "node_1b": "1.b — La chaleur écrasante",
  "node_1c": "1.c — Tempête de sable radioactive",
  "node_1d": "1.d — Panne mécanique",
  "node_1e": "1.e — Premier contact avec un convoi rival",
  "node_1f": "1.f — Bivouac du soir (RP & Bruit de fond)",
  "node_15a": "1.5.a — La Suspension",
  "node_15b": "1.5.b — Le chant à travers le blanc",
  "node_15c": "1.5.c — Tempête statique (flashbacks)",
  "node_2Aa": "2A.a — Les Dunes Chantantes",
  "node_2Ab": "2A.b — Le chant grandit",
  "node_2Ac": "2A.c — Poussière et moteurs",
  "node_2Ad": "2A.d — Attaque des Loups de Sel",
  "node_2Ae": "2A.e — Le Ver revient",
  "node_2Af": "2A.f — Les Enfants du Sel",
  "node_2Ba": "2B.a — Le Verre Noir",
  "node_2Bb": "2B.b — Cliquetis et lueurs",
  "node_2Bc": "2B.c — Poches de radiation",
  "node_2Bd": "2B.d — Les Cendres Silencieuses",
  "node_2Be": "2B.e — Le Ver frustré",
  "node_convergence": "convergence-2 — Point de ralliement",
  "node_3a": "3.a — Le Cimetière des Convois",
  "node_3b": "3.b — Convergence des convois",
  "node_3c": "3.c — L'obstacle final",
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
  "node_1a": { x: 400, y: 580 },
  "node_1b": { x: 400, y: 700 },
  "node_1c": { x: 400, y: 820 },
  "node_1d": { x: 400, y: 940 },
  "node_1e": { x: 400, y: 1060 },
  "node_1f": { x: 400, y: 1180 },
  "node_15a": { x: 400, y: 1300 },
  "node_15b": { x: 400, y: 1420 },
  "node_15c": { x: 650, y: 1420 },
  "node_2Aa": { x: 150, y: 1560 },
  "node_2Ab": { x: 150, y: 1680 },
  "node_2Ac": { x: 150, y: 1800 },
  "node_2Ad": { x: 150, y: 1920 },
  "node_2Ae": { x: 150, y: 2040 },
  "node_2Af": { x: 150, y: 2160 },
  "node_2Ba": { x: 650, y: 1560 },
  "node_2Bb": { x: 650, y: 1680 },
  "node_2Bc": { x: 650, y: 1800 },
  "node_2Bd": { x: 650, y: 1920 },
  "node_2Be": { x: 650, y: 2040 },
  "node_convergence": { x: 400, y: 2280 },
  "node_3a": { x: 400, y: 2400 },
  "node_3b": { x: 400, y: 2520 },
  "node_3c": { x: 400, y: 2640 },
  "node_3d": { x: 400, y: 2760 },
  "node_3e": { x: 650, y: 2880 },
  "node_end_success": { x: 250, y: 3000 },
  "node_end_alt": { x: 550, y: 3000 }
};

async function main() {
  console.log("=== Updating Main Quest with Campagne_v3_QuestData.json & Campagne_v3_Lore.md ===");

  // Read JSON data
  const jsonPath = path.join(__dirname, '..', 'Campagne_v3_QuestData.json');
  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  const questData = JSON.parse(rawData);

  // Find Campaign
  const campaign = await prisma.campaign.findFirst({
    where: { name: "Chroniques de l'Apocalypse" }
  });

  if (!campaign) {
    console.error("Campaign 'Chroniques de l'Apocalypse' not found.");
    process.exit(1);
  }

  console.log(`Campaign found: ${campaign.name} (${campaign.id})`);

  // Find existing main quest or create it
  let quest = await prisma.quest.findFirst({
    where: {
      campaignId: campaign.id,
      OR: [
        { type: "main" },
        { name: { contains: "Course" } }
      ]
    }
  });

  const questPayload = {
    campaignId: campaign.id,
    name: questData.Quest.name,
    description: questData.Quest.description,
    gmNotes: questData.Quest.gmNotes,
    playerSummary: questData.Quest.playerSummary,
    type: "main",
    difficulty: questData.Quest.difficulty,
    level: 1,
    duration: questData.Quest.estimatedDuration,
    itemRewards: JSON.stringify(questData.Quest.itemRewards),
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
  console.log("Clearing old nodes, objectives, threats, connections, links...");
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

  // 1. Objectives
  console.log("Creating Objectives...");
  for (const obj of questData.QuestObjective) {
    let fullDesc = obj.label;
    if (obj.notes) {
      fullDesc += ` (${obj.notes})`;
    }
    await prisma.questObjective.create({
      data: {
        questId: quest.id,
        description: fullDesc,
        orderIndex: obj.order || 1,
        isHidden: !!obj.isHidden,
        isOptional: !!obj.isOptional,
        status: obj.status || "pending"
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
        maxLevel: threat.maxLevel || 4,
        stateLabel: threat.stateLabel || "dormant",
        description: threat.description
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
        factionName: faction.factionName + (faction.notes ? ` - ${faction.notes}` : ""),
        progressValue: faction.progressValue || 0
      }
    });
  }

  // 4. Character States (Template for campaign characters)
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

  // 5. NPC Links
  console.log("Creating NPC Links...");
  const npcDefinitions = [
    { jsonId: "npc_mira", name: "Mira", role: "a secourir / alliee potentielle", description: "Apprentie technicienne du Convoi 5, amnésique suite à l'explosion." },
    { jsonId: "npc_ashen_roka", name: "Ashen Roka", role: "antagoniste / rival de convoi", description: "Chef des Loups de Sel (Convoi 1). Ancien esclave de l'Arène devenu pillard." },
    { jsonId: "npc_selia_sel_blanc", name: "Selia Sel-Blanc", role: "rival de convoi", description: "Cheffe de la Caravane du Sel Blanc (Convoi 3). Marchande prudente." },
    { jsonId: "npc_vray_cendres", name: "Vray Cendres", role: "rival de convoi", description: "Cheffe des Cendres Silencieuses (Convoi 4). Éclaireuse instinctive." },
    { jsonId: "npc_enfants_du_sel", name: "Les Enfants du Sel", role: "clan nomade", description: "Adorateurs du Chant des Dunes. Nomades du désert asséché." },
    { jsonId: "npc_rook_cendre", name: "Capitaine Rook Cendre", role: "recruteur de la Garde", description: "Officier de la Garde de la Cité du Divertissement, agent du Réseau." }
  ];

  for (const npcDef of npcDefinitions) {
    let npc = await prisma.nPC.findFirst({
      where: {
        campaignId: campaign.id,
        name: { contains: npcDef.name }
      }
    });

    if (!npc) {
      npc = await prisma.nPC.create({
        data: {
          campaignId: campaign.id,
          name: npcDef.name,
          role: npcDef.role,
          description: npcDef.description
        }
      });
    }

    await prisma.questNPCLink.create({
      data: {
        questId: quest.id,
        npcId: npc.id,
        role: npcDef.role
      }
    });
  }

  // 6. Location Links
  console.log("Creating Location Links...");
  const locDefinitions = [
    { jsonId: "loc_puits_blanc", name: "Puits Blanc", type: "region", description: "Point de départ officiel de la Course du Sel." },
    { jsonId: "loc_route_des_carcasses", name: "Route des Carcasses", type: "region", description: "Cimetière de tôle jonché d'épaves rouillées." },
    { jsonId: "loc_la_crevasse", name: "La Crevasse", type: "region", description: "Passage rocheux abritant des tempêtes et du ver des sables." },
    { jsonId: "loc_dunes_chantantes", name: "Les Dunes Chantantes", type: "region", description: "Dunes titanesques vibrant au son du chant du désert." },
    { jsonId: "loc_passe_du_sel_noir", name: "La Passe du Sel Noir", type: "region", description: "Étendue de sable vitrifié et zones d'anciennes radiations." },
    { jsonId: "loc_cimetiere_des_convois", name: "Le Cimetière des Convois", type: "region", description: "Dernière étape avant la Cité du Divertissement." },
    { jsonId: "loc_cite_du_divertissement", name: "Cité du Divertissement", type: "city", description: "Destination finale de la Course du Sel." }
  ];

  for (const locDef of locDefinitions) {
    let location = await prisma.location.findFirst({
      where: {
        campaignId: campaign.id,
        name: { contains: locDef.name }
      }
    });

    if (!location) {
      location = await prisma.location.create({
        data: {
          campaignId: campaign.id,
          name: locDef.name,
          type: locDef.type,
          description: locDef.description
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
  const itemDefinitions = [
    { jsonId: "item_caisse_scellee", name: "Caisse Scellée (Convoi 2)", description: "Cargaison mystère du Convoi 2 (PJ). Contenu non révélé." },
    { jsonId: "item_flacon_precurseur_nostalgics", name: "Flacon de précurseur neurochimique", description: "Échantillon issu de l'épave du Convoi 5." }
  ];

  for (const itemDef of itemDefinitions) {
    let item = await prisma.item.findFirst({
      where: {
        campaignId: campaign.id,
        name: { contains: itemDef.name }
      }
    });

    if (!item) {
      item = await prisma.item.create({
        data: {
          campaignId: campaign.id,
          name: itemDef.name,
          description: itemDef.description,
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

  // 8. Quest Nodes
  console.log("Creating Nodes...");
  const nodeMap = {}; // jsonId -> dbNodeId

  for (const jsonNode of questData.QuestNode) {
    const title = NODE_TITLES[jsonNode.id] || `${jsonNode.displayCode} — Node`;
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

    // Format mjDescription to include hooks & actions
    let fullMjDesc = jsonNode.mjDescription || "";
    if (jsonNode.actionsNarrativeHook) {
      fullMjDesc += `\n\n**Amorce Narrative** : ${jsonNode.actionsNarrativeHook}`;
    }
    if (jsonNode.suggestedActions && jsonNode.suggestedActions.length > 0) {
      fullMjDesc += `\n\n**Actions Suggérées** :\n` + jsonNode.suggestedActions.map(a => `- ${a}`).join('\n');
    }

    // Timer check
    const isTimed = jsonNode.timer ? jsonNode.timer.enabled : false;

    // Detection mechanic object
    const detectionMechanicStr = jsonNode.detectionMechanic ? JSON.stringify(jsonNode.detectionMechanic) : null;

    const createdNode = await prisma.questNode.create({
      data: {
        questId: quest.id,
        title: title,
        nodeType: jsonNode.type === "convergence" ? "intermediate" : jsonNode.type, // DB enum: start, intermediate, end
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
        status: jsonNode.reached ? "reached" : "not_reached"
      }
    });

    nodeMap[jsonNode.id] = createdNode.id;
  }

  // Update timeout node references (e.g. node_15a -> node_15c)
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

  // 9. Node Connections
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
        isTimeoutConnection: isTimeout
      }
    });
  }

  // 10. Threat Effects
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
          effectValue: effect.effectValue || 1
        }
      });
    }
  }

  // 11. Node Rewards
  console.log("Creating Node Rewards...");
  for (const reward of questData.QuestNodeReward) {
    const nodeId = nodeMap[reward.nodeId];
    if (nodeId) {
      await prisma.questNodeReward.create({
        data: {
          nodeId: nodeId,
          rewardType: reward.rewardType,
          rewardValue: reward.rewardValue,
          conditional: reward.conditional || null
        }
      });
    }
  }

  console.log(`\nSUCCESS! Main quest "${quest.name}" updated cleanly with all v3 Lore and QuestData!`);
  console.log(`- Nodes created: ${Object.keys(nodeMap).length}`);
  console.log(`- Connections created: ${questData.QuestNodeConnection.length}`);
  console.log(`- Objectives created: ${questData.QuestObjective.length}`);
  console.log(`- Threat Trackers: ${questData.QuestThreatTracker.length}`);
  console.log(`- Faction Progress entries: ${questData.QuestFactionProgress.length}`);
}

main()
  .catch(err => {
    console.error("Error updating main quest:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
