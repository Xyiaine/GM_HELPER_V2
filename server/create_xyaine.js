const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Creating admin Xyaine...');

  const passwordHash = await bcrypt.hash('1995', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'xyaine@admin.com' },
    update: {
      passwordHash,
      displayName: 'Xyaine',
    },
    create: {
      email: 'xyaine@admin.com',
      passwordHash,
      displayName: 'Xyaine',
    },
  });

  const campaign = await prisma.campaign.create({
    data: {
      name: "Xyaine's Campaign",
      description: 'A newly created campaign for Admin Xyaine.',
      gameSystem: 'Custom',
      gmUserId: user.id,
    },
  });

  await prisma.campaignMembership.create({
    data: {
      campaignId: campaign.id,
      userId: user.id,
      role: 'GM',
      status: 'active',
    },
  });

  console.log('Xyaine created successfully with a new campaign!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
