const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Ajout d\'Armes et Améliorations de Véhicules ---');

  const campaign = await prisma.campaign.findFirst({
    where: { name: 'Campagne de Démonstration' }
  });

  if (!campaign) {
    console.error('Campagne de Démonstration introuvable. Veuillez d\'abord exécuter le script de base.');
    process.exit(1);
  }

  // Nettoyage des anciennes pièces pour appliquer les nouvelles catégories
  await prisma.vehiclePart.deleteMany({ where: { campaignId: campaign.id } });

  // --- AMÉLIORATIONS (UPGRADES) ---
  const upgrades = [
    {
      name: 'Pneus Increvables en Kevlar',
      partType: 'carrosserie',
      description: 'Pneus renforcés conçus pour résister aux tirs de petit calibre et aux clous sur la route.',
      rarity: 'rare',
      value: 300,
      weight: 50,
      modifiers: JSON.stringify({ speedBase: -5, acBase: 1 })
    },
    {
      name: 'Blindage Réactif',
      partType: 'carrosserie',
      description: 'Plaques d\'acier explosives qui annulent une partie des dégâts lors d\'un impact.',
      rarity: 'very_rare',
      value: 800,
      weight: 300,
      modifiers: JSON.stringify({ acBase: 3, hpMaxBase: 40, speedBase: -10 })
    },
    {
      name: 'Système d\'Injection de Nitro',
      partType: 'kit nos',
      description: 'Un système permettant d\'injecter de la nitro pour un boost de vitesse incroyable, mais dangereux pour le moteur.',
      rarity: 'rare',
      value: 500,
      weight: 25,
      modifiers: JSON.stringify({ speedBase: 40 })
    },
    {
      name: 'Radar de Longue Portée',
      partType: 'carrosserie',
      description: 'Antenne parabolique modifiée pour détecter les véhicules à plusieurs kilomètres à la ronde.',
      rarity: 'uncommon',
      value: 250,
      weight: 15,
      modifiers: JSON.stringify({})
    }
  ];

  // --- ARMES (WEAPONS) ---
  const weapons = [
    {
      name: 'Mitrailleuse Rotative Cal. 50',
      partType: 'armes',
      description: 'Une tourelle classique infligeant des dégâts soutenus. Consomme beaucoup de munitions.',
      rarity: 'uncommon',
      value: 400,
      weight: 80,
      modifiers: JSON.stringify({ damage: '3d8' })
    },
    {
      name: 'Lance-Harpon Lourd',
      partType: 'armes',
      description: 'Tire un énorme harpon relié à un treuil. Idéal pour éventrer les petits véhicules ou s\'accrocher aux gros.',
      rarity: 'rare',
      value: 600,
      weight: 120,
      modifiers: JSON.stringify({ damage: '2d10', effect: 'grapple' })
    },
    {
      name: 'Lance-Flammes Frontal',
      partType: 'armes',
      description: 'Projete un cône de feu dévastateur. Très dangereux si le réservoir est touché.',
      rarity: 'rare',
      value: 750,
      weight: 150,
      modifiers: JSON.stringify({ damage: '4d6' })
    },
    {
      name: 'Canon Sans Recul de 75mm',
      partType: 'armes',
      description: 'Une arme antichar capable de pulvériser presque n\'importe quel blindage léger d\'un seul coup.',
      rarity: 'very_rare',
      value: 1200,
      weight: 400,
      modifiers: JSON.stringify({ damage: '6d10' })
    },
    {
      name: 'Distributeur de Mines Terrestres',
      partType: 'armes',
      description: 'Lâche des mines derrière le véhicule pour décourager toute poursuite.',
      rarity: 'rare',
      value: 550,
      weight: 100,
      modifiers: JSON.stringify({ damage: '3d10' })
    },
    {
      name: 'Tourelle Laser Improvisée',
      partType: 'armes',
      description: 'Une arme énergétique expérimentale nécessitant un générateur puissant.',
      rarity: 'legendary',
      value: 2000,
      weight: 200,
      modifiers: JSON.stringify({ damage: '3d12' })
    },
    {
      name: 'Bélier à Pointes Cinétiques',
      partType: 'armes',
      description: 'Monté à l\'avant, ce bélier transfère l\'énergie cinétique lors des collisions pour maximiser les dégâts.',
      rarity: 'uncommon',
      value: 300,
      weight: 250,
      modifiers: JSON.stringify({ damage: '2d8' })
    },
    {
      name: 'Mortier Incendiaire',
      partType: 'armes',
      description: 'Tire des obus remplis de napalm improvisé en cloche. Imprécis mais couvre une large zone.',
      rarity: 'very_rare',
      value: 900,
      weight: 180,
      modifiers: JSON.stringify({ damage: '4d8' })
    },
    {
      name: 'Scies Latérales Rétractables',
      partType: 'armes',
      description: 'De grandes lames circulaires qui sortent des flancs pour trancher les roues et jambes des poursuivants.',
      rarity: 'rare',
      value: 450,
      weight: 60,
      modifiers: JSON.stringify({ damage: '2d6' })
    },
    {
      name: 'Projecteur d\'Aveuglement',
      partType: 'armes',
      description: 'Un ensemble de phares surpuissants conçus pour éblouir temporairement les conducteurs ennemis.',
      rarity: 'uncommon',
      value: 200,
      weight: 20,
      modifiers: JSON.stringify({ effect: 'blindness' })
    }
  ];

  const allParts = [...upgrades, ...weapons];

  for (const p of allParts) {
    const exists = await prisma.vehiclePart.findFirst({ where: { campaignId: campaign.id, name: p.name } });
    if (!exists) {
      await prisma.vehiclePart.create({
        data: {
          ...p,
          campaignId: campaign.id
        }
      });
    }
  }
  
  console.log(`Ajouté ${upgrades.length} améliorations et ${weapons.length} armes de véhicules avec succès !`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
