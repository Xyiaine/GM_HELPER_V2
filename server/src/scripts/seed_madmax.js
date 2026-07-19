const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Ajout de Véhicules Supplémentaires (Convoi Mad Max) ---');

  const campaign = await prisma.campaign.findFirst({
    where: { name: 'Campagne de Démonstration' }
  });

  if (!campaign) {
    console.error('Campagne de Démonstration introuvable. Veuillez d\'abord exécuter le script de base.');
    process.exit(1);
  }

  // --- NOUVEAUX VÉHICULES ---
  const madMaxVehicles = [
    {
      name: 'Le Dévoreur',
      modelType: 'Camion Lourd Modifié',
      description: 'Un semi-remorque massif, hérissé de piques et recouvert de plaques de blindage rouillées. La pièce maîtresse d\'un convoi de guerre.',
      speedBase: 65,
      acBase: 20,
      hpMaxBase: 250,
      hpCurrent: 250,
      fuelMax: 400,
      fuelCurrent: 400,
      exhaustionLevel: 0,
      tags: 'Forteresse Mobile, Lent, Dévastateur',
      slots: [
        { role: 'Conducteur Principal', description: 'Pilote la bête.' },
        { role: 'Artilleur Avant', description: 'Gère le lance-harpon lourd fixé à l\'avant.' },
        { role: 'Artilleur Toit', description: 'Opère la tourelle double-mitrailleuse sur le toit.' },
        { role: 'Ingénieur de Soute', description: 'Répare le moteur de l\'intérieur et gère la nitro.' },
        { role: 'Sentinelle Arrière', description: 'Repousse les abordages depuis la remorque.' }
      ]
    },
    {
      name: 'Charognard',
      modelType: 'Camion Benne',
      description: 'Un camion benne aménagé pour ramasser les carcasses sur la route et transporter les prises de guerre.',
      speedBase: 75,
      acBase: 16,
      hpMaxBase: 120,
      hpCurrent: 120,
      fuelMax: 200,
      fuelCurrent: 200,
      exhaustionLevel: 0,
      tags: 'Collecte, Robuste, Lourd',
      slots: [
        { role: 'Conducteur', description: 'Conduit le camion.' },
        { role: 'Opérateur de Grue', description: 'Actionne le bras mécanique pour soulever les épaves.' },
        { role: 'Tireur Flanc Droit', description: 'Protection latérale.' },
        { role: 'Tireur Flanc Gauche', description: 'Protection latérale.' }
      ]
    },
    {
      name: 'Hurleur',
      modelType: 'Voiture d\'Interception',
      description: 'Voiture de sport modifiée avec un moteur V12 à l\'air libre, crachant des flammes. Conçue pour harceler les proies.',
      speedBase: 150,
      acBase: 15,
      hpMaxBase: 55,
      hpCurrent: 55,
      fuelMax: 70,
      fuelCurrent: 70,
      exhaustionLevel: 0,
      tags: 'Intercepteur, Très Rapide, Bruyant',
      slots: [
        { role: 'Pilote', description: 'Doit avoir des réflexes surhumains.' },
        { role: 'Tireur de Hayon', description: 'Lance des explosifs et tire vers l\'arrière.' }
      ]
    },
    {
      name: 'Hachoir',
      modelType: 'Voiture Tout-Terrain',
      description: 'Buggy lourdement blindé équipé de lames tranchantes sur les jantes. Fait pour percer les défenses ennemies.',
      speedBase: 110,
      acBase: 18,
      hpMaxBase: 80,
      hpCurrent: 80,
      fuelMax: 90,
      fuelCurrent: 90,
      exhaustionLevel: 0,
      tags: 'Bélier, Lames, Offensif',
      slots: [
        { role: 'Conducteur Bélier', description: 'Vise les points faibles de l\'ennemi.' },
        { role: 'Artilleur Tourelle', description: 'Opère la mitrailleuse rotative.' }
      ]
    },
    {
      name: 'Traqueur des Sables',
      modelType: 'Voiture Éclaireur',
      description: 'Petit 4x4 léger équipé d\'antennes radio et de systèmes de brouillage pour ouvrir la voie au convoi.',
      speedBase: 130,
      acBase: 13,
      hpMaxBase: 45,
      hpCurrent: 45,
      fuelMax: 60,
      fuelCurrent: 60,
      exhaustionLevel: 0,
      tags: 'Éclaireur, Radar, Fragile',
      slots: [
        { role: 'Conducteur', description: 'Navigue le terrain.' },
        { role: 'Spécialiste Coms/Radar', description: 'Analyse l\'environnement et brouille les signaux.' },
        { role: 'Tireur Léger', description: 'Couverture d\'appoint.' }
      ]
    }
  ];

  for (const v of madMaxVehicles) {
    const exists = await prisma.vehicle.findFirst({ where: { campaignId: campaign.id, name: v.name } });
    if (!exists) {
      const slots = v.slots;
      delete v.slots;

      const vehicle = await prisma.vehicle.create({
        data: {
          ...v,
          campaignId: campaign.id
        }
      });

      // Ajouter les postes dédiés
      if (slots && slots.length > 0) {
        for (const slot of slots) {
          await prisma.vehicleCrewSlot.create({
            data: {
              vehicleId: vehicle.id,
              role: slot.role,
              description: slot.description
            }
          });
        }
      }
    }
  }
  
  console.log('Véhicules et postes dédiés ajoutés avec succès !');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
