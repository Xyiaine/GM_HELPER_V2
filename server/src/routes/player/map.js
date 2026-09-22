// GM Helper — Player Map Routes
//
// Lecture seule. Le joueur voit les zones déjà révélées par le MJ, jamais
// l'inverse : il n'y a donc aucune route d'écriture ici, et il ne doit pas y en
// avoir.
//
// Pourquoi ce fichier existe : `PlayerMapView.jsx` appelait
// `/api/v1/gm/campaigns/:id/maps/world/revealed-zones` — une route du routeur
// MJ, qui n'existe pas sous ce chemin et qu'un joueur n'a de toute façon pas le
// droit d'atteindre (`requireGM`). L'appel échouait à chaque chargement, la
// liste restait vide, et le brouillard de guerre ne s'affichait jamais côté
// joueur alors que le serveur le servait déjà.

const express = require('express');
const { verifyToken, requireCampaignAccess } = require('../../middleware/auth');

const router = express.Router({ mergeParams: true });

router.use(verifyToken);
router.use(requireCampaignAccess);

// ─── GET / — Zones révélées de la carte du monde ──────────────────────────
router.get('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const zones = await prisma.mapRevealedZone.findMany({
      where: { campaignId: req.campaignId, isWorldMap: true },
      orderBy: { revealedAt: 'asc' },
    });
    res.json({ zones });
  } catch (err) {
    console.error('Player revealed zones error:', err);
    res.status(500).json({ error: 'Failed to list revealed zones' });
  }
});

module.exports = router;
