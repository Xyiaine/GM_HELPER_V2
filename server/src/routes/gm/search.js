// GM Helper — GM Search Routes (Global search across entities)
const express = require('express');
const { verifyToken, requireCampaignAccess, requireGM } = require('../../middleware/auth');

const router = express.Router({ mergeParams: true });

router.use(verifyToken, requireCampaignAccess, requireGM);

// GET / — Global search
router.get('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { q, type } = req.query;
    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const campaignId = req.campaignId;
    const results = [];

    const searchTypes = type ? [type] : ['character', 'npc', 'location', 'quest', 'item', 'note'];

    if (searchTypes.includes('character')) {
      const characters = await prisma.character.findMany({
        where: { campaignId, name: { contains: q } },
        select: { id: true, name: true, race: true, class: true },
        take: 10,
      });
      results.push(...characters.map(c => ({ ...c, entityType: 'character' })));
    }

    if (searchTypes.includes('npc')) {
      const npcs = await prisma.nPC.findMany({
        where: { campaignId, name: { contains: q } },
        select: { id: true, name: true, role: true },
        take: 10,
      });
      results.push(...npcs.map(n => ({ ...n, entityType: 'npc' })));
    }

    if (searchTypes.includes('location')) {
      const locations = await prisma.location.findMany({
        where: { campaignId, name: { contains: q } },
        select: { id: true, name: true, type: true },
        take: 10,
      });
      results.push(...locations.map(l => ({ ...l, entityType: 'location' })));
    }

    if (searchTypes.includes('quest')) {
      const quests = await prisma.quest.findMany({
        where: { campaignId, name: { contains: q } },
        select: { id: true, name: true, status: true, type: true },
        take: 10,
      });
      results.push(...quests.map(q => ({ ...q, entityType: 'quest' })));
    }

    if (searchTypes.includes('item')) {
      const items = await prisma.item.findMany({
        where: { campaignId, name: { contains: q } },
        select: { id: true, name: true, type: true, rarity: true },
        take: 10,
      });
      results.push(...items.map(i => ({ ...i, entityType: 'item' })));
    }

    if (searchTypes.includes('note')) {
      const notes = await prisma.note.findMany({
        where: { campaignId, title: { contains: q } },
        select: { id: true, title: true, isFolder: true },
        take: 10,
      });
      results.push(...notes.map(n => ({ ...n, name: n.title, entityType: 'note' })));
    }

    res.json({ results, query: q, total: results.length });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;
