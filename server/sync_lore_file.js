const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

async function main() {
  const filePath = path.join(__dirname, '..', 'Universe Lore.txt');
  let content = fs.readFileSync(filePath, 'utf-8');
  let newContent = "";
  
  const lines = content.split('\n');
  
  // Pre-fetch all POIs
  const subLocs = await prisma.location.findMany({
    where: { type: 'Point of Interest' },
    include: { parentLocation: true }
  });

  const getDesc = (cityName, subName) => {
    // subName in DB is "CityName - SubName"
    const fullName = `${cityName} - ${subName}`;
    const match = subLocs.find(l => l.name === fullName);
    return match ? match.description : null;
  };

  let currentCity = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    newContent += line + '\n';
    
    // Detect city section
    const cityMatch = line.match(/^(\d+)\. (.*?) - "/);
    if (cityMatch) {
      currentCity = cityMatch[2]; // e.g., BUNKER OMÉGA
    }
    
    // Detect sub-location
    const subMatch = line.match(/^  >> (.*)/);
    if (subMatch && currentCity) {
      const subName = subMatch[1].trim();
      const desc = getDesc(currentCity, subName);
      if (desc) {
        newContent += `     [Description du lieu : ${desc}]\n`;
      }
    }
  }

  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log("Universe Lore.txt updated with descriptions.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
