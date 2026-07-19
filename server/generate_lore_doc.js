const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('Generating full Universe Lore document from DB...');

  const campaign = await prisma.campaign.findFirst({
    where: { name: "Chroniques de l'Apocalypse" }
  });

  if (!campaign) {
    console.error("Campaign not found.");
    process.exit(1);
  }

  // Load the first part of the lore from the existing Universe Lore.txt
  const lorePath = path.join(__dirname, '..', 'Universe Lore.txt');
  let existingLore = "";
  try {
    existingLore = fs.readFileSync(lorePath, 'utf8');
    // We only want the content up to the beginning of the cities section so we don't duplicate.
    // The existing file has "LES 10 CITES-ETATS ET LEURS INFRASTRUCTURES MAJEURES"
    const splitIndex = existingLore.indexOf("LES 10 CITES-ETATS ET LEURS INFRASTRUCTURES MAJEURES");
    if (splitIndex !== -1) {
      existingLore = existingLore.substring(0, splitIndex).trim();
    }
  } catch (err) {
    console.warn("Could not read existing lore, starting fresh.");
  }

  let output = existingLore + "\n\n";
  output += "========================================================================\n";
  output += "LES 10 CITES-ETATS, LEURS INFRASTRUCTURES ET LEURS HABITANTS\n";
  output += "========================================================================\n\n";

  // Fetch cities with their locations and NPCs
  const cities = await prisma.location.findMany({
    where: { campaignId: campaign.id, type: 'city' },
    include: {
      childLocations: {
        include: {
          npcs: true
        }
      },
      city: true
    },
    orderBy: { name: 'asc' }
  });

  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];
    output += `------------------------------------------------------------------------\n`;
    output += `${i + 1}. ${city.name.toUpperCase()}\n`;
    
    if (city.city) {
      output += `Spécialité : ${city.city.specialty}\n`;
      output += `Force : ${city.city.strength}\n`;
      output += `Faiblesse : ${city.city.weakness}\n`;
      output += `Particularité : ${city.city.peculiarity}\n`;
      output += `Paramètres initiaux : Santé ${city.city.health}, Technologie ${city.city.technology}, Richesse ${city.city.wealth}, Carburant ${city.city.fuel}, Nourriture ${city.city.food}, Bonheur ${city.city.happiness}, Armement ${city.city.armament}\n`;
    }
    
    output += `\nLieux et Personnages Notables :\n`;

    for (const loc of city.childLocations) {
      output += `\n  >> ${loc.name}\n`;
      if (loc.npcs && loc.npcs.length > 0) {
        for (const npc of loc.npcs) {
          output += `     - ${npc.name} (${npc.role})\n`;
          // Split the description by lines and indent it
          const descLines = npc.description.split('\n');
          for (const line of descLines) {
            output += `       ${line}\n`;
          }
        }
      } else {
        output += `     (Aucun PNJ assigné)\n`;
      }
    }
    output += `\n`;
  }

  fs.writeFileSync(lorePath, output, 'utf8');
  console.log(`Successfully generated and updated ${lorePath}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
