import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create GM User
  const gmPassword = await bcrypt.hash('password123', 10);
  const gm = await prisma.user.upsert({
    where: { email: 'gm@example.com' },
    update: {},
    create: {
      email: 'gm@example.com',
      passwordHash: gmPassword,
      displayName: 'Master GM',
    },
  });

  // 2. Create Player User
  const playerPassword = await bcrypt.hash('password123', 10);
  const player = await prisma.user.upsert({
    where: { email: 'player@example.com' },
    update: {},
    create: {
      email: 'player@example.com',
      passwordHash: playerPassword,
      displayName: 'Hero Player',
    },
  });

  // 3. Create Campaign
  const campaign = await prisma.campaign.create({
    data: {
      name: 'The Shattered Wastes',
      description: 'A post-apocalyptic fantasy setting where city-states fight over resources.',
      gameSystem: 'D&D 5e',
      gmUserId: gm.id,
    },
  });

  // 4. Add Memberships
  await prisma.campaignMembership.create({
    data: {
      campaignId: campaign.id,
      userId: gm.id,
      role: 'GM',
      status: 'active',
    },
  });

  await prisma.campaignMembership.create({
    data: {
      campaignId: campaign.id,
      userId: player.id,
      role: 'PLAYER',
      status: 'active',
    },
  });

  // 5. Create a Character
  await prisma.character.create({
    data: {
      campaignId: campaign.id,
      ownerUserId: player.id,
      name: 'Kaelen',
      race: 'Human',
      class: 'Fighter',
      level: 3,
      strength: 16,
      dexterity: 14,
      constitution: 15,
      intelligence: 10,
      wisdom: 12,
      charisma: 8,
      hpCurrent: 28,
      hpMax: 28,
      armorClass: 16,
      canBeEditedByPlayer: true,
      skills: JSON.stringify({ athletics: true, survival: true }),
    },
  });

  // 6. Create Locations & Cities
  const loc = await prisma.location.create({
    data: {
      campaignId: campaign.id,
      name: 'Neon Harbor',
      type: 'city',
      description: 'A sprawling port city powered by arcane generators.',
    },
  });

  await prisma.city.create({
    data: {
      locationId: loc.id,
      health: 80,
      wealth: 60,
      technology: 90,
      food: 40,
      happiness: 55,
      armament: 70,
      fuel: 85,
    },
  });

  // 7. Create NPC
  await prisma.nPC.create({
    data: {
      campaignId: campaign.id,
      name: 'Sergeant Rex',
      role: 'Guard Captain',
      locationId: loc.id,
      description: 'A gruff, battle-scarred veteran.',
    },
  });

  // 8. Create Quest
  await prisma.quest.create({
    data: {
      campaignId: campaign.id,
      name: 'Secure the Generators',
      description: 'Bandits have taken over the backup generators. We need them cleared out.',
      status: 'active',
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
