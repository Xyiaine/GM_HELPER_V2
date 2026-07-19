// GM Helper — GM Item Routes
const express = require('express');
const { verifyToken, requireCampaignAccess, requireGM } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { createItemSchema, updateItemSchema } = require('../../validators/schemas');

const router = express.Router({ mergeParams: true });

router.use(verifyToken, requireCampaignAccess, requireGM);

router.get('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { search, type, rarity } = req.query;
    const where = { campaignId: req.campaignId };
    if (search) where.name = { contains: search };
    if (type) where.type = type;
    if (rarity) where.rarity = rarity;

    const items = await prisma.item.findMany({
      where,
      orderBy: { name: 'asc' },
    });
    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: 'Failed to list items' });
  }
});

router.post('/', validate(createItemSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const item = await prisma.item.create({
      data: { ...req.body, campaignId: req.campaignId },
    });
    res.status(201).json({ item });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create item' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const item = await prisma.item.findFirst({
      where: { id: req.params.id, campaignId: req.campaignId },
      include: {
        inventoryItems: {
          include: { character: { select: { id: true, name: true } } },
        },
      },
    });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json({ item });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get item' });
  }
});

router.put('/:id', validate(updateItemSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const result = await prisma.item.updateMany({
      where: { id: req.params.id, campaignId: req.campaignId },
      data: req.body,
    });
    if (result.count === 0) return res.status(404).json({ error: 'Item not found' });
    const item = await prisma.item.findUnique({ where: { id: req.params.id } });
    res.json({ item });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const result = await prisma.item.deleteMany({
      where: { id: req.params.id, campaignId: req.campaignId },
    });
    if (result.count === 0) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

module.exports = router;
