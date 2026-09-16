// GM Helper — État de séance et journal de campagne
//
// Ces deux ressources vivaient auparavant dans le localStorage du navigateur du
// MJ. Elles sont désormais persistées côté serveur : elles survivent à un
// rafraîchissement, suivent le MJ d'un appareil à l'autre, et deviennent
// exploitables par le récapitulatif de séance et par le système de jeu du MJ.
//
// La Menace reste strictement côté MJ : rien de cet état n'est diffusé aux
// joueurs ni à l'écran de table (décision F3 du cadrage).

const express = require('express');
const { verifyToken, requireCampaignAccess, requireGM } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const {
  updateCampaignStateSchema,
  createSessionLogEntrySchema,
} = require('../../validators/schemas');

const router = express.Router({ mergeParams: true });

router.use(verifyToken, requireCampaignAccess, requireGM);

const DEFAULT_STATE = {
  doomPool: 3,
  complications: [],
  customCards: [],
  wormClock: 0,
};

/**
 * Récupère l'état de la campagne, en le créant à la première demande.
 * Un upsert évite la course entre deux requêtes simultanées.
 */
async function getOrCreateState(prisma, campaignId) {
  return prisma.campaignState.upsert({
    where: { campaignId },
    update: {},
    create: { campaignId },
  });
}

// GET / — état courant
router.get('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const state = await getOrCreateState(prisma, req.campaignId);
    res.json({ state });
  } catch (err) {
    console.error('Fetch campaign state error:', err);
    res.status(500).json({ error: 'Failed to fetch campaign state' });
  }
});

// PATCH / — mise à jour partielle
router.patch('/', validate(updateCampaignStateSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { doomPool, complications, customCards, wormClock } = req.body;

    const data = {};
    if (doomPool !== undefined) data.doomPool = doomPool;
    if (complications !== undefined) data.complications = complications;
    if (customCards !== undefined) data.customCards = customCards;
    if (wormClock !== undefined) data.wormClock = wormClock;

    if (Object.keys(data).length === 0) {
      const current = await getOrCreateState(prisma, req.campaignId);
      return res.json({ state: current });
    }

    const state = await prisma.campaignState.upsert({
      where: { campaignId: req.campaignId },
      update: data,
      create: { campaignId: req.campaignId, ...DEFAULT_STATE, ...data },
    });

    res.json({ state });
  } catch (err) {
    console.error('Update campaign state error:', err);
    res.status(500).json({ error: 'Failed to update campaign state' });
  }
});

// POST /log — consigner un fait de séance
router.post('/log', validate(createSessionLogEntrySchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { kind, payload, sessionId } = req.body;

    const entry = await prisma.sessionLog.create({
      data: {
        campaignId: req.campaignId,
        sessionId: sessionId || null,
        kind,
        payload,
      },
    });

    res.status(201).json({ entry });
  } catch (err) {
    console.error('Create session log entry error:', err);
    res.status(500).json({ error: 'Failed to create session log entry' });
  }
});

// GET /log — journal de la campagne, du plus récent au plus ancien
router.get('/log', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const limit = Math.min(parseInt(req.query.limit, 10) || 100, 500);
    const sessionId = req.query.sessionId;

    const entries = await prisma.sessionLog.findMany({
      where: {
        campaignId: req.campaignId,
        ...(sessionId ? { sessionId } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    res.json({ entries });
  } catch (err) {
    console.error('Fetch session log error:', err);
    res.status(500).json({ error: 'Failed to fetch session log' });
  }
});

module.exports = router;
