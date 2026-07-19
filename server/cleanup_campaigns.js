const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const campaigns = await prisma.campaign.findMany();
  
  for (const c of campaigns) {
    if (c.name.toLowerCase() !== "les chroniques de l'apocalypse") {
      console.log(`Deleting campaign: ${c.name}`);
      await prisma.campaign.delete({ where: { id: c.id } });
    } else {
      console.log(`Keeping campaign: ${c.name}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
