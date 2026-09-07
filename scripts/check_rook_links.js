const path = require('path');
const { PrismaClient } = require(path.join(__dirname, '../server/node_modules/@prisma/client'));
const prisma = new PrismaClient();

async function checkLinks() {
  const id1 = 'cmrakeomi00fnut18yso02e14';
  const id2 = 'cmrvv1z030021ut44ag3gt5b2';

  for (const id of [id1, id2]) {
    const qLinks = await prisma.questNPCLink.findMany({ where: { npcId: id } });
    const combatants = await prisma.encounterCombatant.findMany({ where: { npcId: id } });
    const nodes = await prisma.questNode.findMany({ where: { linkedNpcId: id } });
    const profiles = await prisma.questNPCProfile.findMany({ where: { npcId: id } });
    console.log(`NPC ${id}: qLinks=${qLinks.length}, combatants=${combatants.length}, nodes=${nodes.length}, profiles=${profiles.length}`);
  }
  await prisma.$disconnect();
}
checkLinks();
