const path = require('path');
const { PrismaClient } = require(path.join(__dirname, '../server/node_modules/@prisma/client'));
const prisma = new PrismaClient();

async function checkRook() {
  const found = await prisma.nPC.findMany({
    where: { name: { contains: 'Rook' } }
  });
  console.log('NPCs with Rook:', found);
  await prisma.$disconnect();
}
checkRook();
