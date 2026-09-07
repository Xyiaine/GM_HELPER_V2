// scripts/sync_all_game_resources.js
// Script to unify and eliminate discordances between NPCs, Convoys, Quests, Bestiary, and Combatants.

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const NPC_CANONICAL_DATA = [
  {
    name: 'Doran Roka',
    key: 'npc_doran_roka',
    role: 'antagoniste / rival de convoi',
    armorClass: 15,
    hpMax: 42,
    hpCurrent: 42,
    speed: '9m (Buggy 18m)',
    stats: JSON.stringify({ str: 16, dex: 14, con: 16, int: 12, wis: 10, cha: 12 }),
    gmNotes: "Fusil de chasse à canon scié (+5 au toucher, 2d8+3 perforant/feu). Chef des Loups de Sel (Convoi 1).",
    personality: "Phrases courtes, voix métallique et sèche, jamais de politesse superflue. Fait tourner un anneau d'acier à son pouce gauche quand il évalue le rapport de force. Ne menace jamais deux fois : la première fois il prévient, la seconde il ouvre le feu.",
    description: "Chef des Loups de Sel (Convoi 1) de la Cité de l'Armement & Défense. Transporte des précurseurs chimiques pour les Chem'Artistes. Prêt à saboter le convoi des PJ pour assurer sa place dans la Garde.",
    voiceNotes: {
      speechPattern: "Phrases courtes, jamais de politesse superflue.",
      physicalTic: "Fait tourner un anneau métallique à son doigt quand il évalue un rapport de force.",
      signatureBehavior: "Ne menace jamais deux fois - la deuxième fois, il agit."
    }
  },
  {
    name: 'Ines',
    key: 'npc_ines',
    role: 'a secourir / alliee potentielle',
    armorClass: 10,
    hpMax: 12,
    hpCurrent: 12,
    speed: '9m',
    stats: JSON.stringify({ str: 10, dex: 14, con: 11, int: 16, wis: 12, cha: 10 }),
    gmNotes: "Clé à molette lourde (+2 au toucher, 1d4 contondant). Survivante amnésique du Convoi 5 (Nostalgics).",
    personality: "Voix fébrile et murmurée, trébuche sur les mots puis sort soudain un terme d'ingénierie ultra-précis. Se frotte les tempes à deux mains dès qu'un bruit fort retentit. Observe fixement les mains des PJ quand ils manipulent des armes ou des outils.",
    description: "Survivante amnésique du Convoi 5 (Nostalgics) de la Cité du Divertissement. Ne sait pas que ce sont les PJ qui ont fait sauter son convoi. Si elle recouvre la mémoire avant eux, la bascule sera dramatique.",
    voiceNotes: {
      speechPattern: "Voix fébrile et murmurée, trébuche sur les mots puis sort soudain un terme d'ingénierie ultra-précis.",
      physicalTic: "Se frotte les tempes à deux mains dès qu'un bruit fort retentit, comme pour chasser un bourdonnement.",
      signatureBehavior: "Observe fixement les mains des PJ quand ils manipulent des armes ou des outils."
    }
  },
  {
    name: 'Meya Sel-Blanc',
    key: 'npc_meya_sel_blanc',
    role: 'rival de convoi',
    armorClass: 12,
    hpMax: 28,
    hpCurrent: 28,
    speed: '9m (Camion 12m)',
    stats: JSON.stringify({ str: 12, dex: 10, con: 13, int: 16, wis: 14, cha: 15 }),
    gmNotes: "Pistolet lourd ouvragé (+4 au toucher, 1d10+1 perforant). Matriarche de la Caravane du Sel Blanc (Convoi 3).",
    personality: "Parle posément et lentement, pose toujours une question en retour avant de répondre à la vôtre. Garde une paume appuyée contre la carrosserie pour sentir les vibrations. Propose toujours un échange ou un troc avant qu'on ne lui demande quoi que ce soit.",
    description: "Matriarche de la Caravane du Sel Blanc (Convoi 3) de la Cité de l'Eau & Alimentation. Sa cargaison de parfums et soies est fragile. Elle craint le ver plus que tout et est prête à partager de l'eau contre une escorte sur les dunes.",
    voiceNotes: {
      speechPattern: "Parle lentement, pose une question avant de répondre à celle qu'on lui pose.",
      physicalTic: "Garde toujours une main posée sur le bord de son véhicule, comme pour en sentir la vibration.",
      signatureBehavior: "Propose un échange avant qu'on le lui demande, jamais l'inverse."
    }
  },
  {
    name: 'Ashka Cendres',
    key: 'npc_ashka_cendres',
    role: 'rival de convoi',
    armorClass: 14,
    hpMax: 32,
    hpCurrent: 32,
    speed: '10.5m (Voiture 16m)',
    stats: JSON.stringify({ str: 12, dex: 18, con: 12, int: 14, wis: 15, cha: 8 }),
    gmNotes: "Carabine de précision (+6 au toucher, 1d12+4 perforant, portée 45/150m). Éclaireuse des Cendres Silencieuses (Convoi 4).",
    personality: "Chuchote en permanence, même lorsqu'il n'y a aucune raison de se cacher. Ne regarde jamais directement son interlocuteur, scrute le terrain. Termine chaque échange par une mise en garde sur ce qui rôde.",
    description: "Éclaireuse des Cendres Silencieuses (Convoi 4) de la Cité Médicale. Connaît les raccourcis radioactifs évitant le Ver de Vitre. Transporte des greffons et organes cryogénisés pour les Sculpteurs.",
    voiceNotes: {
      speechPattern: "Chuchote presque tout, même sans raison de discrétion.",
      physicalTic: "Ne regarde jamais directement son interlocuteur, seulement le terrain.",
      signatureBehavior: "Termine chaque échange par une mise en garde sur ce qui rôde, vraie ou non."
    }
  },
  {
    name: 'Sura Voix-des-Dunes',
    key: 'npc_enfants_du_sel',
    role: 'meneuse clan nomade',
    armorClass: 13,
    hpMax: 30,
    hpCurrent: 30,
    speed: '9m',
    stats: JSON.stringify({ str: 14, dex: 16, con: 14, int: 12, wis: 16, cha: 12 }),
    gmNotes: "Épieu d'os renforcé (+5 au toucher, 1d8+3 perforant). Meneuse du clan nomade des Adorateurs du Chant des Dunes.",
    personality: "Voix chantante ponctuée de claquements de langue, langage imagé teinté de légendes sur le Dieu-Sel. Saupoudre une pincée de sel blanc purifiée devant ses pas. Ne regarde jamais les armes, observe les yeux et les mains.",
    description: "Meneuse du clan nomade des sables. Sait que le ver qui chasse les PJ est un nouveau-né attiré par une résonance de la caisse scellée.",
    voiceNotes: {
      speechPattern: "Phrases brèves suivies d'un silence qu'elle ne remplit jamais elle-même.",
      physicalTic: "Incline légèrement la tête sur le côté en écoutant, comme pour capter un son sous le son.",
      signatureBehavior: "Touche le sol du bout des doigts avant toute décision importante, geste rituel plus que superstitieux."
    }
  },
  {
    name: 'Capitaine Rook Cendre',
    key: 'npc_rook_cendre',
    role: 'recruteur de la Garde',
    armorClass: 17,
    hpMax: 65,
    hpCurrent: 65,
    speed: '9m',
    stats: JSON.stringify({ str: 16, dex: 14, con: 16, int: 16, wis: 14, cha: 15 }),
    gmNotes: "Sabre d'acier et revolver lourd (+7 au toucher, 2d8+4 tranchant/perforant). Capitaine de la Garde & Recruteur officiel.",
    personality: "Ton posé, glacial et cérémonial d'un officier qui a tout vu et que rien ne surprend. Passe lentement un doigt ganté sur le pommeau poli de son sabre d'apparat. Écoute sans interrompre, laisse de longs silences peser avant d'accorder sa décision.",
    description: "Capitaine de la Garde de la Cité du Divertissement. Juge suprême de la Course. Agent secret du Réseau / Bunker Oméga. Évalue qui nommer capitaine pour servir de pion politique dans la Garde.",
    voiceNotes: {
      speechPattern: "Ton posé, glacial et cérémonial d'un officier qui a tout vu et que rien ne surprend.",
      physicalTic: "Passe lentement un doigt ganté sur le pommeau poli de son sabre d'apparat.",
      signatureBehavior: "Écoute sans interrompre, laisse de longs silences peser avant d'accorder sa décision."
    }
  }
];

async function syncAll() {
  console.log('=== SYNCING ALL GAME RESOURCES ===');

  // 1. Find Campaign and Main Quest
  const campaign = await prisma.campaign.findFirst({
    where: { name: "Chroniques de l'Apocalypse" }
  }) || await prisma.campaign.findFirst();

  if (!campaign) {
    console.error('No campaign found');
    return;
  }
  console.log(`Campaign: ${campaign.name} (${campaign.id})`);

  const quest = await prisma.quest.findFirst({
    where: { campaignId: campaign.id, OR: [{ name: { contains: 'Course' } }, { type: 'principale' }] }
  });
  if (!quest) {
    console.error('Main quest not found');
    return;
  }
  console.log(`Quest: ${quest.name} (${quest.id})`);

  // 2. Clean up legacy / outdated duplicate NPCs if any
  const legacyNames = ['Ashen Roka', 'Selia Sel-Blanc', 'Vray Cendres', 'Les Enfants du Sel'];
  for (const leg of legacyNames) {
    const found = await prisma.nPC.findMany({ where: { campaignId: campaign.id, name: leg } });
    for (const f of found) {
      console.log(`Cleaning up legacy duplicate NPC: ${f.name} (${f.id})`);
      await prisma.questNPCLink.deleteMany({ where: { npcId: f.id } });
      await prisma.nPC.delete({ where: { id: f.id } });
    }
  }

  // 3. Upsert canonical NPC records with true HP, AC, Speed, Stats, Attacks
  const npcMap = {};
  for (const nData of NPC_CANONICAL_DATA) {
    let npc = await prisma.nPC.findFirst({
      where: {
        campaignId: campaign.id,
        OR: [
          { name: nData.name },
          { name: { contains: nData.name } },
          { name: nData.name.replace('Capitaine ', '') }
        ]
      }
    });

    const payload = {
      name: nData.name,
      role: nData.role,
      armorClass: nData.armorClass,
      hpMax: nData.hpMax,
      hpCurrent: nData.hpCurrent,
      speed: nData.speed,
      stats: nData.stats,
      gmNotes: nData.gmNotes,
      personality: nData.personality,
      description: nData.description,
      isActive: true,
      campaignId: campaign.id
    };

    if (npc) {
      console.log(`Updating canonical NPC stats: ${nData.name} -> CA ${nData.armorClass}, PV ${nData.hpMax}`);
      npc = await prisma.nPC.update({
        where: { id: npc.id },
        data: payload
      });
    } else {
      console.log(`Creating canonical NPC: ${nData.name} -> CA ${nData.armorClass}, PV ${nData.hpMax}`);
      npc = await prisma.nPC.create({ data: payload });
    }
    npcMap[nData.key] = npc;

    // Ensure QuestNPCLink exists
    const existingLink = await prisma.questNPCLink.findFirst({
      where: { questId: quest.id, npcId: npc.id }
    });
    if (!existingLink) {
      await prisma.questNPCLink.create({
        data: {
          questId: quest.id,
          npcId: npc.id,
          role: nData.role
        }
      });
    }

    // Ensure QuestNPCProfile exists
    const existingProfile = await prisma.questNPCProfile.findFirst({
      where: { questId: quest.id, npcId: nData.key }
    });
    if (existingProfile) {
      await prisma.questNPCProfile.update({
        where: { id: existingProfile.id },
        data: {
          name: nData.name,
          speechPattern: nData.voiceNotes.speechPattern,
          physicalTic: nData.voiceNotes.physicalTic,
          signatureBehavior: nData.voiceNotes.signatureBehavior
        }
      });
    } else {
      await prisma.questNPCProfile.create({
        data: {
          questId: quest.id,
          npcId: nData.key,
          name: nData.name,
          speechPattern: nData.voiceNotes.speechPattern,
          physicalTic: nData.voiceNotes.physicalTic,
          signatureBehavior: nData.voiceNotes.signatureBehavior
        }
      });
    }
  }

  // 4. Update node_2Ad combat template to include Doran Roka with true HP & AC
  const node2Ad = await prisma.questNode.findFirst({
    where: { questId: quest.id, OR: [{ displayCode: '2A.d' }, { title: { contains: '2A.d' } }] }
  });
  if (node2Ad) {
    const doranNpc = npcMap['npc_doran_roka'];
    const updatedCombatTemplate = [
      {
        sourceType: 'npc',
        sourceId: doranNpc?.id,
        name: 'Doran Roka',
        count: 1,
        hpMax: 42,
        armorClass: 15
      },
      {
        sourceType: 'bestiary',
        name: 'Loup du Désert / Meute du Bassin',
        count: 3
      }
    ];

    console.log(`Updating node 2A.d combat template with Doran Roka (PV 42, CA 15)...`);
    await prisma.questNode.update({
      where: { id: node2Ad.id },
      data: { combatTemplate: JSON.stringify(updatedCombatTemplate) }
    });

    // Also update any existing encounter for this node
    const encounter = await prisma.encounter.findFirst({
      where: { questNodeId: node2Ad.id }
    });
    if (encounter) {
      console.log(`Synchronizing encounter combatants for node 2A.d...`);
      // Update or create Doran Roka combatant
      const existingDoranCombatant = await prisma.encounterCombatant.findFirst({
        where: { encounterId: encounter.id, OR: [{ name: { contains: 'Doran' } }, { npcId: doranNpc?.id }] }
      });
      if (existingDoranCombatant) {
        await prisma.encounterCombatant.update({
          where: { id: existingDoranCombatant.id },
          data: {
            name: 'Doran Roka',
            type: 'npc',
            sourceType: 'npc',
            sourceId: doranNpc?.id,
            npcId: doranNpc?.id,
            hpMax: 42,
            hpCurrent: 42,
            armorClass: 15
          }
        });
      } else {
        await prisma.encounterCombatant.create({
          data: {
            encounterId: encounter.id,
            name: 'Doran Roka',
            type: 'npc',
            sourceType: 'npc',
            sourceId: doranNpc?.id,
            npcId: doranNpc?.id,
            hpMax: 42,
            hpCurrent: 42,
            armorClass: 15,
            orderIndex: 0,
            isVisibleToPlayers: true
          }
        });
      }
    }
  }

  // 5. Align Convoys and Faction Progress
  console.log('Synchronizing Convoys and Faction Progress...');
  const convoys = await prisma.convoy.findMany({ where: { campaignId: campaign.id } });
  const factionProgresses = await prisma.questFactionProgress.findMany({ where: { questId: quest.id } });

  const CONVOY_FACTION_MAPPING = [
    { convoySub: 'Convoi 1', factionSub: 'Loups de Sel', leaderNpcKey: 'npc_doran_roka' },
    { convoySub: 'Convoi 2', factionSub: 'Convoi 2 (PJ)', leaderNpcKey: null },
    { convoySub: 'Convoi 3', factionSub: 'Caravane du Sel Blanc', leaderNpcKey: 'npc_meya_sel_blanc' },
    { convoySub: 'Convoi 4', factionSub: 'Cendres Silencieuses', leaderNpcKey: 'npc_ashka_cendres' },
    { convoySub: 'Convoi 5', factionSub: 'Nostalgics', leaderNpcKey: 'npc_ines' }
  ];

  for (const mapItem of CONVOY_FACTION_MAPPING) {
    const matchingConvoy = convoys.find(c => c.name.includes(mapItem.convoySub));
    const matchingFaction = factionProgresses.find(f => f.factionName.includes(mapItem.factionSub));
    const leaderNpc = mapItem.leaderNpcKey ? npcMap[mapItem.leaderNpcKey] : null;

    if (matchingConvoy && matchingFaction) {
      console.log(`Linked: ${matchingConvoy.name} <---> ${matchingFaction.factionName}${leaderNpc ? ` (Chef: ${leaderNpc.name})` : ''}`);
    }
  }

  console.log('=== SYNC COMPLETED SUCCESSFULLY ===');
}

syncAll().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
}).finally(() => prisma.$disconnect());
