const path = require('path');
const { PrismaClient } = require(path.join(__dirname, '../server/node_modules/@prisma/client'));
const prisma = new PrismaClient();

async function checkNode() {
  const node = await prisma.questNode.findFirst({
    where: { OR: [{ displayCode: '2A.d' }, { id: 'node_2Ad' }] },
    include: { encounters: { include: { combatants: true } } }
  });
  console.log('Node:', node?.id, '| Code:', node?.displayCode, '| linkedEncounterId:', node?.linkedEncounterId);
  console.log('Encounters linked:', node?.encounters?.length);
  for (const e of node?.encounters || []) {
    console.log('Encounter:', e.id, '|', e.name, '| Combatants:', e.combatants.length);
    for (const c of e.combatants) {
      console.log('  ->', c.name, '| type:', c.type, '| AC:', c.armorClass, '| HP:', c.hpCurrent, '/', c.hpMax);
    }
  }
  await prisma.$disconnect();
}
checkNode().catch(console.error);
