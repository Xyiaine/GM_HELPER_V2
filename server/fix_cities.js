const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const campaign = await prisma.campaign.findFirst({
    where: { name: "Chroniques de l'Apocalypse" }
  });

  if (!campaign) {
    console.log("Campaign not found");
    return;
  }

  const locations = await prisma.location.findMany({
    where: { campaignId: campaign.id, type: 'City-State' }
  });

  for (const loc of locations) {
    const existingCity = await prisma.city.findUnique({
      where: { locationId: loc.id }
    });

    if (!existingCity) {
      console.log(`Creating City profile for ${loc.name}...`);
      await prisma.city.create({
        data: {
          locationId: loc.id,
          // We can use defaults or random values
          health: 50 + Math.floor(Math.random() * 30),
          wealth: 50 + Math.floor(Math.random() * 30),
          technology: 50 + Math.floor(Math.random() * 30),
          food: 50 + Math.floor(Math.random() * 30),
          happiness: 50 + Math.floor(Math.random() * 30),
          armament: 50 + Math.floor(Math.random() * 30),
          fuel: 50 + Math.floor(Math.random() * 30),
        }
      });
    }
  }
  console.log("Cities generated successfully.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
