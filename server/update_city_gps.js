const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Exact GPS coordinates from Universe Lore v8
const GPS_DATA = {
  "BUNKER OMÉGA": { lat: 46.2044, lon: 6.1432, realLocation: "Genève (Suisse)" },
  "CITÉ INDUSTRIELLE": { lat: 45.0703, lon: 7.6869, realLocation: "Turin (Italie)" },
  "CITÉ DU DIVERTISSEMENT": { lat: 41.9028, lon: 12.4964, realLocation: "Rome (Italie)" },
  "NUKE CITY": { lat: 43.2965, lon: 5.3698, realLocation: "Marseille (France)" },
  "CITÉ DE L'EAU & ALIMENTATION": { lat: 43.5000, lon: 4.6000, realLocation: "Camargue / Rhône (France)" },
  "CITÉ DU CARBURANT": { lat: 36.7538, lon: 3.0588, realLocation: "Alger (Algérie)" },
  "CITÉ DE L'ARMEMENT & DÉFENSE": { lat: 36.1408, lon: -5.3536, realLocation: "Gibraltar" },
  "L'ILE DES ANCIENS": { lat: 36.0000, lon: -8.5000, realLocation: "Atlantique, Ouest Gibraltar" },
  "CITÉ DES MÉTAUX & RECYCLAGE": { lat: 37.9838, lon: 23.7275, realLocation: "Athènes (Grèce)" },
  "CITÉ MÉDICALE": { lat: 31.2001, lon: 29.9187, realLocation: "Alexandrie (Égypte)" }
};

// Canvas conversion helper for Mediterranean bounds (2000 x 1200)
// Longitude: -10° E à +32° E (Span 42°)
// Latitude: +30° N à +48° N (Span 18°)
function convertGpsToCanvas(lat, lon, width = 2000, height = 1200) {
  const minLon = -10.0;
  const maxLon = 32.0;
  const minLat = 30.0;
  const maxLat = 48.0;

  const mapX = Math.round(((lon - minLon) / (maxLon - minLon)) * width);
  const mapY = Math.round(((maxLat - lat) / (maxLat - minLat)) * height);

  return { mapX, mapY };
}

async function main() {
  console.log("=== Updating City Map Coordinates using Exact Lore GPS Data ===");

  const cities = await prisma.city.findMany({
    include: { location: true }
  });

  if (cities.length === 0) {
    console.log("No cities found in database.");
    return;
  }

  for (const city of cities) {
    const locName = city.location?.name?.trim()?.toUpperCase();
    
    // Find matching key in GPS_DATA
    let matchKey = null;
    if (locName) {
      matchKey = Object.keys(GPS_DATA).find(k => k.toUpperCase() === locName || locName.includes(k.toUpperCase()) || k.toUpperCase().includes(locName));
    }

    if (matchKey) {
      const gps = GPS_DATA[matchKey];
      const { mapX, mapY } = convertGpsToCanvas(gps.lat, gps.lon);

      await prisma.city.update({
        where: { id: city.id },
        data: { mapX, mapY }
      });

      console.log(`✅ ${city.location.name} (${gps.realLocation}): GPS [${gps.lat}° N, ${gps.lon}° E] ➔ Map Canvas (${mapX}, ${mapY})`);
    } else {
      console.warn(`⚠️ Could not match city "${city.location?.name}" to GPS data.`);
    }
  }

  console.log("=== City Coordinates Updated Successfully ===");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
