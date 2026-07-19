const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const campaigns = await prisma.campaign.findMany();
  console.log('Remaining campaigns:');
  campaigns.forEach(c => console.log(c.name));
  
  if (campaigns.length === 0) {
    console.log('Restoring Chroniques de l\'Apocalypse...');
    const user = await prisma.user.findFirst({ where: { email: 'xyaine@admin.com' } });
    await prisma.campaign.create({
      data: {
        name: "Chroniques de l'Apocalypse",
        description: 'Campagne principale',
        gameSystem: '5e Hybrid',
        gmUserId: user.id,
        memberships: {
          create: {
            userId: user.id,
            role: 'GM',
            status: 'active'
          }
        }
      }
    });
    console.log('Restored!');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
