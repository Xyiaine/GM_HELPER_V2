const path = require('path');
const { PrismaClient } = require(path.join(__dirname, '../server/node_modules/@prisma/client'));
const prisma = new PrismaClient();

async function check() {
  console.log('=== 1. NPCS ===');
  const npcs = await prisma.nPC.findMany();
  for (const n of npcs) {
    console.log(`${n.id} | ${n.name} | AC: ${n.armorClass} | HP: ${n.hpCurrent}/${n.hpMax} | Speed: ${n.speed} | stats: ${n.stats}`);
  }

  console.log('\n=== 2. QUEST NPC PROFILES ===');
  const profiles = await prisma.questNPCProfile.findMany();
  for (const p of profiles) {
    console.log(`${p.npcId} | ${p.name} | ${p.role} | speech: ${p.speechPattern ? p.speechPattern.slice(0, 40) : 'none'}`);
  }

  await prisma.$disconnect();
}

check().catch(console.error);
