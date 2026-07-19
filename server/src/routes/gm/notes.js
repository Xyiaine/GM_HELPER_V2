// GM Helper — GM Note Routes
const express = require('express');
const { verifyToken, requireCampaignAccess, requireGM } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { createNoteSchema, updateNoteSchema } = require('../../validators/schemas');

const router = express.Router({ mergeParams: true });

router.use(verifyToken, requireCampaignAccess, requireGM);

router.get('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { folderId, pinned } = req.query;
    const where = { campaignId: req.campaignId };
    if (folderId) where.parentFolderId = folderId;
    else where.parentFolderId = null; // root level
    if (pinned === 'true') where.isPinned = true;

    const notes = await prisma.note.findMany({
      where,
      include: { _count: { select: { children: true } } },
      orderBy: [{ isPinned: 'desc' }, { updatedAt: 'desc' }],
    });
    res.json({ notes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to list notes' });
  }
});

router.post('/', validate(createNoteSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const note = await prisma.note.create({
      data: { ...req.body, campaignId: req.campaignId },
    });
    res.status(201).json({ note });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create note' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const note = await prisma.note.findFirst({
      where: { id: req.params.id, campaignId: req.campaignId },
      include: {
        children: { orderBy: { updatedAt: 'desc' } },
        parentFolder: { select: { id: true, title: true } },
      },
    });
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json({ note });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get note' });
  }
});

router.put('/:id', validate(updateNoteSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const result = await prisma.note.updateMany({
      where: { id: req.params.id, campaignId: req.campaignId },
      data: req.body,
    });
    if (result.count === 0) return res.status(404).json({ error: 'Note not found' });
    const note = await prisma.note.findUnique({ where: { id: req.params.id } });
    res.json({ note });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update note' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const result = await prisma.note.deleteMany({
      where: { id: req.params.id, campaignId: req.campaignId },
    });
    if (result.count === 0) return res.status(404).json({ error: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

module.exports = router;
