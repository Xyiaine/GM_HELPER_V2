const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const campaign = await prisma.campaign.findFirst({ where: { name: 'Chroniques de l\'Apocalypse' } });
  const cities = await prisma.city.findMany({
    where: { location: { campaignId: campaign.id } }
  });

  console.log(`Found ${cities.length} cities. Distributing around 1024x1024 map...`);

  const centerX = 512;
  const centerY = 512;
  const radius = 350;

  for (let i = 0; i < cities.length; i++) {
    const angle = (i / cities.length) * Math.PI * 2;
    // Add a bit of random jitter so it doesn't look too perfectly circular
    const r = radius + (Math.random() * 60 - 30);
    const mapX = centerX + Math.cos(angle) * r;
    const mapY = centerY + Math.sin(angle) * r;

    await prisma.city.update({
      where: { id: cities[i].id },
      data: { mapX, mapY }
    });
    console.log(`Updated city ${cities[i].id} position to ${mapX.toFixed(0)}, ${mapY.toFixed(0)}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
