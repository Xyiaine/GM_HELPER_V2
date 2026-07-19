const fs = require('fs');

const text = fs.readFileSync('../Universe Lore.txt', 'utf8');
const lines = text.split('\n');

const locations = [];
let currentLocation = null;
let currentSubLoc = null;
let currentNPC = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  // 1. BUNKER OMÉGA - "LES FANTÔMES D'ACIER"
  const locMatch = line.match(/^\d+\.\s+(.+?)\s+-\s+"(.+?)"/);
  if (locMatch) {
    currentLocation = { name: locMatch[1].trim(), factionName: locMatch[2].trim(), subLocations: [] };
    locations.push(currentLocation);
    currentSubLoc = null;
    currentNPC = null;
    continue;
  }
  
  // >> Le Marché d'Échanges
  const subLocMatch = line.match(/^>>\s*(.+)/);
  if (subLocMatch && currentLocation) {
    currentSubLoc = { name: subLocMatch[1].trim(), npcs: [] };
    currentLocation.subLocations.push(currentSubLoc);
    currentNPC = null;
    continue;
  }
  
  // - Kael Clou (Marchand Principal)
  const npcMatch = line.match(/^-\s+(.+?)\s+\((.+?)\)/);
  if (npcMatch && currentSubLoc) {
    currentNPC = { name: npcMatch[1].trim(), role: npcMatch[2].trim(), traits: [] };
    currentSubLoc.npcs.push(currentNPC);
    continue;
  }
  
  // - Dirige les échanges au sein de Le Marché d'Échanges.
  const traitMatch = line.match(/^-\s+(.+)/);
  if (traitMatch && currentNPC && !npcMatch) {
    currentNPC.traits.push(traitMatch[1].trim());
  }
}

console.log(JSON.stringify(locations, null, 2).substring(0, 1500));
console.log('Total Locations found:', locations.length);
