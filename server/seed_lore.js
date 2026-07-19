const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Get campaign
  const campaign = await prisma.campaign.findFirst({
    where: { name: "Chroniques de l'Apocalypse" }
  });

  if (!campaign) {
    console.error("Campaign not found!");
    process.exit(1);
  }

  // 2. Clear old lore
  console.log('Clearing old lore data...');
  await prisma.nPC.deleteMany({ where: { campaignId: campaign.id } });
  await prisma.faction.deleteMany({ where: { campaignId: campaign.id } });
  await prisma.location.deleteMany({ where: { campaignId: campaign.id } });

  // 3. Parse text
  const text = fs.readFileSync('../Universe Lore.txt', 'utf8');
  const lines = text.split('\n');

  const locationsData = [];
  let currentLocation = null;
  let currentSubLoc = null;
  let currentNPC = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const locMatch = line.match(/^\d+\.\s+(.+?)\s+-\s+"(.+?)"/);
    if (locMatch) {
      currentLocation = { name: locMatch[1].trim(), factionName: locMatch[2].trim(), description: [], subLocations: [] };
      locationsData.push(currentLocation);
      currentSubLoc = null;
      currentNPC = null;
      continue;
    }
    
    const subLocMatch = line.match(/^>>\s*(.+)/);
    if (subLocMatch && currentLocation) {
      currentSubLoc = { name: subLocMatch[1].trim(), npcs: [] };
      currentLocation.subLocations.push(currentSubLoc);
      currentNPC = null;
      continue;
    }
    
    const npcMatch = line.match(/^-\s+(.+?)\s+\((.+?)\)/);
    if (npcMatch && currentSubLoc) {
      currentNPC = { name: npcMatch[1].trim(), role: npcMatch[2].trim(), traits: [] };
      currentSubLoc.npcs.push(currentNPC);
      continue;
    }
    
    const traitMatch = line.match(/^-\s+(.+)/);
    if (traitMatch && currentNPC && !npcMatch) {
      currentNPC.traits.push(traitMatch[1].trim());
      continue;
    }

    if (currentLocation && !currentSubLoc && !line.startsWith('Lieux et Personnages') && !line.startsWith('==================')) {
      currentLocation.description.push(line);
    }
  }

  console.log(`Parsed ${locationsData.length} City-States.`);

  // 4. Insert into DB
  for (const loc of locationsData) {
    const city = await prisma.location.create({
      data: {
        campaignId: campaign.id,
        name: loc.name,
        type: 'City-State',
        description: loc.description.join('\n').trim()
      }
    });

    await prisma.faction.create({
      data: {
        campaignId: campaign.id,
        name: loc.factionName,
        description: `Faction au contrôle de ${loc.name}`
      }
    });

    for (const subLoc of loc.subLocations) {
      const dbSubLoc = await prisma.location.create({
        data: {
          campaignId: campaign.id,
          name: `${loc.name} - ${subLoc.name}`,
          type: 'Point of Interest',
          description: `Un lieu clé dans ${loc.name}.`
        }
      });

      for (const npc of subLoc.npcs) {
        await prisma.nPC.create({
          data: {
            campaignId: campaign.id,
            name: npc.name,
            role: npc.role,
            locationId: dbSubLoc.id,
            personality: npc.traits.join('\n'),
            description: `Rôle : ${npc.role} à ${subLoc.name}`
          }
        });
      }
    }
  }

  console.log('Lore successfully seeded into database!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
