const express = require('express');
const { verifyToken } = require('../../middleware/auth');

const router = express.Router();

router.use(verifyToken);

// Get campaigns where the user is a player
router.get('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const memberships = await prisma.campaignMembership.findMany({
      where: { userId: req.user.id, role: 'PLAYER', status: 'active' },
      include: {
        campaign: true,
      },
      orderBy: { joinedAt: 'desc' },
    });

    res.json(memberships.map(m => ({ ...m.campaign, role: m.role, joinedAt: m.joinedAt })));
  } catch (err) {
    console.error('Error fetching player campaigns:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Join a campaign using campaignId and password
router.post('/join', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { campaignId, password } = req.body;

    if (!campaignId || !password) {
      return res.status(400).json({ error: 'L\'ID de la campagne et le mot de passe sont requis' });
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId.trim() },
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campagne introuvable avec cet identifiant' });
    }

    if (!campaign.joinPassword) {
      return res.status(400).json({ error: 'Cette campagne n\'a pas configuré de mot de passe de vérification' });
    }

    if (campaign.joinPassword.trim() !== password.trim()) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    // Check if already member
    const existing = await prisma.campaignMembership.findUnique({
      where: {
        campaignId_userId: {
          campaignId: campaign.id,
          userId: req.user.id,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ error: 'Vous êtes déjà membre de cette campagne' });
    }

    // Create membership
    const membership = await prisma.campaignMembership.create({
      data: {
        campaignId: campaign.id,
        userId: req.user.id,
        role: 'PLAYER',
        status: 'active',
      },
      include: {
        campaign: true,
      },
    });

    res.json({ success: true, campaign: membership.campaign });
  } catch (err) {
    console.error('Error joining campaign:', err);
    res.status(500).json({ error: 'Erreur lors de la tentative d\'accès à la campagne' });
  }
});

module.exports = router;
