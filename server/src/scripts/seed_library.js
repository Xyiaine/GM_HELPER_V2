const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Initialisation de la Bibliothèque de Véhicules et Personnages ---');

  // Trouver un utilisateur (le premier GM) pour être propriétaire
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error('Aucun utilisateur trouvé. Veuillez créer un compte via l\'interface d\'abord.');
    process.exit(1);
  }

  // Trouver ou créer une campagne pour stocker ces éléments
  let campaign = await prisma.campaign.findFirst({
    where: { name: 'Campagne de Démonstration' }
  });

  if (!campaign) {
    campaign = await prisma.campaign.create({
      data: {
        name: 'Campagne de Démonstration',
        description: 'Campagne générée automatiquement pour tester les véhicules et les personnages.',
        gameSystem: '5e Hybrid',
        gmUserId: user.id,
        memberships: {
          create: {
            userId: user.id,
            role: 'GM',
            status: 'active'
          }
        }
      }
    });
    console.log(`Campagne créée: ${campaign.name}`);
  } else {
    console.log(`Campagne trouvée: ${campaign.name}`);
  }

  // --- VÉHICULES ---
  const vehicles = [
    {
      name: 'Interceptor V8',
      modelType: 'Voiture',
      description: 'Un muscle car lourdement modifié pour le combat sur route.',
      speedBase: 120,
      acBase: 16,
      hpMaxBase: 60,
      hpCurrent: 60,
      fuelMax: 80,
      fuelCurrent: 80,
      exhaustionLevel: 0,
      tags: 'Rapide, Blindé'
    },
    {
      name: 'Dune Buggy',
      modelType: 'Voiture',
      description: 'Léger et agile, idéal pour le hors-piste.',
      speedBase: 90,
      acBase: 12,
      hpMaxBase: 35,
      hpCurrent: 35,
      fuelMax: 50,
      fuelCurrent: 50,
      exhaustionLevel: 0,
      tags: 'Tout-terrain, Fragile'
    },
    {
      name: 'Chasseur de Poussière',
      modelType: 'Moto',
      description: 'Une moto cross modifiée avec des pointes et un moteur suralimenté.',
      speedBase: 140,
      acBase: 14,
      hpMaxBase: 25,
      hpCurrent: 25,
      fuelMax: 30,
      fuelCurrent: 30,
      exhaustionLevel: 0,
      tags: 'Extrême, Dangereux'
    },
    {
      name: 'Chopper Nomade',
      modelType: 'Moto',
      description: 'Lourde et stable, conçue pour les longs trajets sur les autoroutes désertes.',
      speedBase: 110,
      acBase: 15,
      hpMaxBase: 40,
      hpCurrent: 40,
      fuelMax: 45,
      fuelCurrent: 45,
      exhaustionLevel: 0,
      tags: 'Voyage, Robuste'
    },
    {
      name: 'Béhémoth Cuirassé',
      modelType: 'Camion',
      description: 'Un camion blindé de transport lourd. Lent mais quasi-indestructible.',
      speedBase: 60,
      acBase: 19,
      hpMaxBase: 150,
      hpCurrent: 150,
      fuelMax: 300,
      fuelCurrent: 300,
      exhaustionLevel: 0,
      tags: 'Lent, Transport'
    },
    {
      name: 'Camion-Citerne',
      modelType: 'Camion',
      description: 'Transporte de l\'eau ou du carburant. Une cible de choix pour les pillards.',
      speedBase: 70,
      acBase: 13,
      hpMaxBase: 100,
      hpCurrent: 100,
      fuelMax: 200,
      fuelCurrent: 200,
      exhaustionLevel: 0,
      tags: 'Précieux, Dangereux'
    }
  ];

  for (const v of vehicles) {
    // Vérifier si le véhicule existe déjà dans la campagne
    const exists = await prisma.vehicle.findFirst({ where: { campaignId: campaign.id, name: v.name } });
    if (!exists) {
      await prisma.vehicle.create({
        data: {
          ...v,
          campaignId: campaign.id
        }
      });
    }
  }
  console.log('Véhicules ajoutés.');

  // --- PERSONNAGES EXEMPLES ---
  const characters = [
    {
      name: 'Rook le Mécano',
      background: 'Ancien technicien de l\'Abri 42.',
      strength: 14, dexterity: 12, constitution: 15, intelligence: 18, wisdom: 10, charisma: 8,
      hpCurrent: 24, hpMax: 24, armorClass: 13, speed: 30,
      level: 3, proficiencyBonus: 2,
      class: JSON.stringify([{"id":"technologie","name":"Technologie","level":3,"pointsInvested":6}]),
      unlockedSkills: JSON.stringify(["reparation_improviser", "bricolage_genial", "surcharge_moteur", "blindage_renforce", "piratage_basique", "drone_compagnon"]),
      skills: JSON.stringify({ "investigation": 1, "sleight_of_hand": 1 }),
      savingThrows: JSON.stringify({ "intelligence": true, "constitution": true })
    },
    {
      name: 'Kael le Tireur',
      background: 'Chasseur de primes solitaire.',
      strength: 12, dexterity: 18, constitution: 14, intelligence: 10, wisdom: 16, charisma: 10,
      hpCurrent: 52, hpMax: 52, armorClass: 16, speed: 40,
      level: 6, proficiencyBonus: 3,
      class: JSON.stringify([{"id":"combat_distance","name":"Combat à Distance","level":4,"pointsInvested":8}, {"id":"survie","name":"Survie","level":2,"pointsInvested":4}]),
      unlockedSkills: JSON.stringify(["tir_precis", "rechargement_rapide", "sniper", "tir_couverture", "oeil_de_lynx", "pistolero", "double_tir", "munitions_perforantes", "pisteur", "chasseur", "resistance_froid", "endurance_desert"]),
      skills: JSON.stringify({ "perception": 2, "stealth": 1, "survival": 1 }),
      savingThrows: JSON.stringify({ "dexterity": true, "wisdom": true })
    },
    {
      name: 'Doc',
      background: 'Médecin de terrain de l\'Ancien Monde.',
      strength: 8, dexterity: 14, constitution: 10, intelligence: 16, wisdom: 18, charisma: 14,
      hpCurrent: 12, hpMax: 12, armorClass: 12, speed: 30,
      level: 1, proficiencyBonus: 2,
      class: JSON.stringify([{"id":"medecine","name":"Médecine","level":1,"pointsInvested":2}]),
      unlockedSkills: JSON.stringify(["trousse_de_fortune", "sang_froid_rafistoleur"]),
      skills: JSON.stringify({ "medicine": 2, "insight": 1 }),
      savingThrows: JSON.stringify({ "wisdom": true, "intelligence": true })
    },
    {
      name: 'Goliath',
      background: 'Colosse génétiquement modifié pour la guerre.',
      strength: 20, dexterity: 10, constitution: 18, intelligence: 8, wisdom: 10, charisma: 12,
      hpCurrent: 105, hpMax: 105, armorClass: 18, speed: 25,
      level: 10, proficiencyBonus: 4,
      class: JSON.stringify([{"id":"combat_rapproche","name":"Combat Rapproché","level":7,"pointsInvested":14}, {"id":"defense","name":"Défense","level":3,"pointsInvested":6}]),
      unlockedSkills: JSON.stringify(["frappe_lourde", "balayage", "charge_brutale", "coup_etourdissant", "brise_armure", "fureur_berserker", "tourbillon_lames", "peau_cuir", "blocage_parfait", "rempart_vivant", "provocation", "mur_acier", "infatigable", "titan_acier", "coup_critique", "saignement", "maitrise_masse", "frappe_tellurique", "soif_de_sang", "increvable"]),
      skills: JSON.stringify({ "athletics": 2, "intimidation": 1 }),
      savingThrows: JSON.stringify({ "strength": true, "constitution": true })
    }
  ];

  for (const c of characters) {
    const exists = await prisma.character.findFirst({ where: { campaignId: campaign.id, name: c.name } });
    if (!exists) {
      await prisma.character.create({
        data: {
          ...c,
          campaignId: campaign.id,
          ownerUserId: user.id
        }
      });
    }
  }
  console.log('Personnages exemples ajoutés.');

  console.log('--- Terminé ! ---');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
