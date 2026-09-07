const path = require('path');
const { PrismaClient } = require(path.join(__dirname, '../server/node_modules/@prisma/client'));
const prisma = new PrismaClient();

async function fullAudit() {
  console.log('=== FULL DISCORDANCE & DUPLICATION AUDIT ===\n');

  // Clean phantom duplicate Rook Cendre if present
  try {
    const phantom = await prisma.nPC.findUnique({ where: { id: 'cmrvv1z030021ut44ag3gt5b2' } });
    if (phantom) {
      await prisma.nPC.delete({ where: { id: phantom.id } });
      console.log('Cleaned phantom duplicate Rook Cendre (cmrvv1z030021ut44ag3gt5b2)');
    }
  } catch (e) {
    // Already deleted
  }

  // 1. Check duplicate NPC names in the same campaign
  const npcs = await prisma.nPC.findMany({
    include: { questLinks: true, combatants: true }
  });

  const nameCounts = {};
  for (const n of npcs) {
    nameCounts[n.name] = (nameCounts[n.name] || 0) + 1;
  }
  const duplicatedNames = Object.entries(nameCounts).filter(([name, count]) => count > 1);
  console.log('--- Duplicate NPC Names in Campaign ---');
  for (const [name, count] of duplicatedNames) {
    const list = npcs.filter(n => n.name === name);
    console.log(`[DUPLICATE] "${name}" appears ${count} times:`);
    for (const item of list) {
      console.log(`  ID: ${item.id} | AC: ${item.armorClass} | HP: ${item.hpCurrent}/${item.hpMax} | links: ${item.questLinks.length} | combatants: ${item.combatants.length}`);
    }
  }

  // 2. Check Key Course du Sel NPCs
  console.log('\n--- Canonical Course du Sel NPCs State ---');
  const keyNpcs = [
    'Doran Roka',
    'Ines',
    'Meya Sel-Blanc',
    'Ashka Cendres',
    'Sura Voix-des-Dunes',
    'Capitaine Rook Cendre'
  ];
  for (const kn of keyNpcs) {
    const matches = npcs.filter(n => n.name.includes(kn) || kn.includes(n.name));
    console.log(`Key NPC: ${kn} -> ${matches.length} matches:`);
    for (const m of matches) {
      console.log(`  ID: ${m.id} | Name: "${m.name}" | AC: ${m.armorClass} | HP: ${m.hpCurrent}/${m.hpMax} | Speed: ${m.speed} | Stats: ${m.stats}`);
    }
  }

  // 3. Check Combatants vs NPCs and Bestiary
  console.log('\n--- Combatants vs Source Entities Audit ---');
  const combatants = await prisma.encounterCombatant.findMany({
    include: {
      encounter: true,
      npc: true,
      bestiary: true,
      character: true,
    }
  });

  let discordances = 0;
  for (const c of combatants) {
    if (c.type === 'npc' && c.npc) {
      if (c.hpMax !== c.npc.hpMax || c.armorClass !== c.npc.armorClass) {
        console.log(`[DISCORDANCE NPC COMBATANT] Encounter "${c.encounter.name}", Combatant "${c.name}": Combatant (HP ${c.hpMax}, AC ${c.armorClass}) != NPC (HP ${c.npc.hpMax}, AC ${c.npc.armorClass})`);
        discordances++;
      }
    } else if (c.type === 'monster' && c.bestiary) {
      if (c.hpMax !== c.bestiary.hpMax || c.armorClass !== c.bestiary.armorClass) {
        console.log(`[DISCORDANCE MONSTER COMBATANT] Encounter "${c.encounter.name}", Combatant "${c.name}": Combatant (HP ${c.hpMax}, AC ${c.armorClass}) != Bestiary (HP ${c.bestiary.hpMax}, AC ${c.bestiary.armorClass})`);
        discordances++;
      }
    } else if (c.type === 'character' && c.character) {
      if (c.hpMax !== c.character.hpMax || c.armorClass !== c.character.armorClass) {
        console.log(`[NOTE PC COMBATANT STATS] Encounter "${c.encounter.name}", Combatant "${c.name}": Combatant (HP ${c.hpMax}, AC ${c.armorClass}) vs Character Sheet (HP ${c.character.hpMax}, AC ${c.character.armorClass})`);
      }
    }
  }
  console.log(`Total Combatant Discordances with Base Entities: ${discordances}`);

  // 4. Check Convoys vs Vehicles
  console.log('\n--- Convoys and Vehicles ---');
  const convoys = await prisma.convoy.findMany({ include: { vehicles: true } });
  for (const cv of convoys) {
    console.log(`Convoy: ${cv.name} (${cv.id}) | Status: ${cv.status} | Step: ${cv.currentStepIndex}/${cv.totalSteps}`);
    for (const v of cv.vehicles) {
      console.log(`  -> ConvoyVehicle: ${v.name} | Type: ${v.type} | HP: ${v.hpCurrent}/${v.hpMax}`);
    }
  }

  // 5. Check QuestThreatTracker
  console.log('\n--- Threat Trackers ---');
  const threats = await prisma.questThreatTracker.findMany({ include: { quest: true } });
  for (const t of threats) {
    console.log(`Threat: "${t.name}" on Quest "${t.quest?.name}" | Level: ${t.currentLevel}/${t.maxLevel} | State: ${t.stateLabel}`);
  }

  // 6. Check QuestFactionProgress
  console.log('\n--- Faction Progress ---');
  const factions = await prisma.questFactionProgress.findMany({ include: { quest: true } });
  for (const f of factions) {
    console.log(`Faction: "${f.factionName}" on Quest "${f.quest?.name}" | Progress: ${f.progressValue}% | Relation: ${f.relationshipState}`);
  }

  await prisma.$disconnect();
}

fullAudit().catch(console.error);
