const { PrismaClient } = require('@prisma/client');
const http = require('http');

const prisma = new PrismaClient();

async function run() {
  console.log('Testing GM Endpoint Security...');
  try {
    // 1. Create a dummy player user
    const playerUser = await prisma.user.upsert({
      where: { email: 'test_player@example.com' },
      update: {},
      create: {
        email: 'test_player@example.com',
        passwordHash: 'dummy',
        displayName: 'Test Player',
      }
    });

    const gmUser = await prisma.user.upsert({
      where: { email: 'test_gm@example.com' },
      update: {},
      create: {
        email: 'test_gm@example.com',
        passwordHash: 'dummy',
        displayName: 'Test GM',
      }
    });

    // 2. Create a campaign and add the player
    const campaign = await prisma.campaign.create({
      data: {
        name: 'Test Campaign for Security',
        gmUserId: gmUser.id,
        memberships: {
          create: [
            { userId: gmUser.id, role: 'GM', status: 'active' },
            { userId: playerUser.id, role: 'PLAYER', status: 'active' }
          ]
        }
      }
    });

    console.log('Test Campaign Created:', campaign.id);

    // 3. Generate a JWT for the player user
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { userId: playerUser.id, email: playerUser.email }, 
      process.env.JWT_SECRET || 'dev_secret_key'
    );

    // 4. Start the server temporarily to test (if it's not already running)
    const port = process.env.PORT || 3000;
    
    console.log(`Sending request as PLAYER to GM endpoint: GET /api/v1/gm/campaigns/${campaign.id}/quests`);
    
    const options = {
      hostname: 'localhost',
      port: port,
      path: `/api/v1/gm/campaigns/${campaign.id}/quests`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    const req = http.request(options, (res) => {
      console.log('Response Status:', res.statusCode);
      if (res.statusCode === 403) {
        console.log('✅ SUCCESS: Player correctly received 403 Forbidden when trying to access GM routes.');
      } else {
        console.error(`❌ FAILED: Expected 403, got ${res.statusCode}`);
      }
    });

    req.on('error', (e) => {
      console.error('Request Error: Make sure the GM_Helper server is running on port', port);
      console.error(e.message);
    });

    req.end();

  } catch (err) {
    console.error('Test error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
