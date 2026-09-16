// GM Helper — Exports imprimables
//
// Les joueurs n'ont que leur fiche papier. Tout ce qui doit exister à la table
// — objets rares et plus, fiches de personnage — passe donc par l'imprimante.
// Ces routes produisent des PDF de cartes au format 105 × 180 mm.

const express = require('express');
const { verifyToken, requireCampaignAccess, requireGM } = require('../../middleware/auth');
const {
  renderCards,
  buildItemCard,
  buildCharacterCard,
} = require('../../services/cardRenderer');

const router = express.Router({ mergeParams: true });

router.use(verifyToken, requireCampaignAccess, requireGM);

const RARITIES = ['common', 'uncommon', 'rare', 'very_rare', 'legendary'];

function parseList(value) {
  if (!value) return [];
  return String(value)
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

function slugify(value) {
  return String(value || 'export')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || 'export';
}

/** Prépare la réponse pour un flux PDF téléchargeable. */
function sendPdf(res, doc, filename) {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  doc.pipe(res);
}

// GET /items — cartes d'objets
//
// Sélection par identifiants (`ids`) ou par rareté (`rarity`). Sans paramètre,
// tous les objets de la campagne sont exportés.
router.get('/items', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const campaign = await prisma.campaign.findUnique({
      where: { id: req.campaignId },
      select: { name: true },
    });

    const ids = parseList(req.query.ids);
    const rarities = parseList(req.query.rarity).filter((r) => RARITIES.includes(r));

    const where = { campaignId: req.campaignId };
    if (ids.length) where.id = { in: ids };
    else if (rarities.length) where.rarity = { in: rarities };

    const items = await prisma.item.findMany({
      where,
      orderBy: [{ rarity: 'desc' }, { name: 'asc' }],
    });

    if (items.length === 0) {
      return res.status(404).json({ error: 'Aucun objet à imprimer pour cette sélection' });
    }

    const cards = items.map((item) => buildItemCard(item, campaign ? campaign.name : ''));
    const doc = await renderCards(cards, { layout: req.query.layout });

    sendPdf(res, doc, `objets-${slugify(campaign && campaign.name)}.pdf`);
  } catch (err) {
    console.error('Export items error:', err);
    res.status(500).json({ error: "Échec de la génération des cartes d'objets" });
  }
});

// GET /characters — cartes de personnage
router.get('/characters', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const campaign = await prisma.campaign.findUnique({
      where: { id: req.campaignId },
      select: { name: true },
    });

    const ids = parseList(req.query.ids);
    const where = { campaignId: req.campaignId };
    if (ids.length) where.id = { in: ids };

    const characters = await prisma.character.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    if (characters.length === 0) {
      return res.status(404).json({ error: 'Aucun personnage à imprimer pour cette sélection' });
    }

    const cards = characters.map((c) => buildCharacterCard(c, campaign ? campaign.name : ''));
    const doc = await renderCards(cards, { layout: req.query.layout });

    sendPdf(res, doc, `personnages-${slugify(campaign && campaign.name)}.pdf`);
  } catch (err) {
    console.error('Export characters error:', err);
    res.status(500).json({ error: 'Échec de la génération des cartes de personnage' });
  }
});

// GET /preview — inventaire de ce qui est imprimable, pour l'interface
router.get('/preview', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');

    const [items, characters] = await Promise.all([
      prisma.item.findMany({
        where: { campaignId: req.campaignId },
        select: { id: true, name: true, rarity: true, type: true, imageUrl: true },
        orderBy: [{ rarity: 'desc' }, { name: 'asc' }],
      }),
      prisma.character.findMany({
        where: { campaignId: req.campaignId },
        select: { id: true, name: true, level: true, class: true, portraitUrl: true },
        orderBy: { name: 'asc' },
      }),
    ]);

    res.json({
      items,
      characters,
      cardSizeMm: { width: 105, height: 180 },
    });
  } catch (err) {
    console.error('Export preview error:', err);
    res.status(500).json({ error: "Échec de la lecture des éléments imprimables" });
  }
});

module.exports = router;
