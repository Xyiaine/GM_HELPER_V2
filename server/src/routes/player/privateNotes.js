const express = require('express');
const { verifyToken, requireCampaignAccess, requirePlayer } = require('../../middleware/auth');

const router = express.Router({ mergeParams: true });

router.use(verifyToken);
router.use(requireCampaignAccess);
router.use(requirePlayer);

router.get('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const character = await prisma.character.findFirst({
      where: { campaignId: req.campaignId, ownerUserId: req.user.id }
    });
    if (!character) return res.status(404).json({ error: 'Character not found' });

    const notes = await prisma.characterPrivateNote.findMany({
      where: { characterId: character.id },
      orderBy: { updatedAt: 'desc' }
    });
    res.json({ notes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to list notes' });
  }
});

router.post('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'content is required' });

    const character = await prisma.character.findFirst({
      where: { campaignId: req.campaignId, ownerUserId: req.user.id }
    });
    if (!character) return res.status(404).json({ error: 'Character not found' });

    const note = await prisma.characterPrivateNote.create({
      data: {
        characterId: character.id,
        content
      }
    });
    res.status(201).json({ note });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create note' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { content } = req.body;
    
    // Check ownership
    const note = await prisma.characterPrivateNote.findUnique({
      where: { id: req.params.id },
      include: { character: true }
    });
    
    if (!note || note.character.ownerUserId !== req.user.id || note.character.campaignId !== req.campaignId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updated = await prisma.characterPrivateNote.update({
      where: { id: req.params.id },
      data: { content }
    });
    res.json({ note: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update note' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    
    // Check ownership
    const note = await prisma.characterPrivateNote.findUnique({
      where: { id: req.params.id },
      include: { character: true }
    });
    
    if (!note || note.character.ownerUserId !== req.user.id || note.character.campaignId !== req.campaignId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.characterPrivateNote.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

module.exports = router;
