// GM Helper — GM Encounter Routes (D&D 5e Combat Engine)
const express = require('express');
const { verifyToken, requireCampaignAccess, requireGM } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const {
  createEncounterSchema,
  updateEncounterSchema,
  createCombatantSchema,
  updateCombatantSchema,
  bulkAddCombatantsSchema,
} = require('../../validators/schemas');

const router = express.Router({ mergeParams: true });

router.use(verifyToken, requireCampaignAccess, requireGM);

/**
 * Filter encounter payload for public view (Players / TV screen).
 *
 * Hit points and armor class are deliberately never exposed here: the table
 * screen shows the initiative order and the encounter map, not the numbers.
 * Players track their own hit points on their paper sheet.
 * A player still receives their own character's hit points through the targeted
 * `character:hp-updated` event emitted to `user:{ownerUserId}`.
 */
function filterEncounterForPublic(encounter) {
  if (!encounter) return null;
  return {
    id: encounter.id,
    name: encounter.name,
    status: encounter.status,
    phase: encounter.phase,
    currentRound: encounter.currentRound,
    currentTurnIndex: encounter.currentTurnIndex,
    combatants: (encounter.combatants || []).map(c => {
      if (c.isVisibleToPlayers) {
        return {
          id: c.id,
          name: c.name,
          type: c.type,
          sourceType: c.sourceType,
          initiative: c.initiative,
          conditions: c.conditions,
          isSurprised: c.isSurprised,
          characterId: c.characterId,
        };
      }
      return {
        id: c.id,
        name: c.name,
        type: c.type,
        sourceType: c.sourceType,
        initiative: c.initiative,
        isSurprised: c.isSurprised,
      };
    }),
  };
}

/**
 * Helper to emit Socket.IO events with differentiated payloads (GM vs Public)
 */
function emitEncounterState(io, campaignId, encounter) {
  if (!io || !encounter) return;
  // Full payload for GM
  io.to(`campaign:${campaignId}:gm`).emit('encounter_state_changed', { encounter });

  // Filtered payload for Players & TV Screen
  const publicPayload = filterEncounterForPublic(encounter);
  io.to(`campaign:${campaignId}:player`).emit('encounter_state_changed', { encounter: publicPayload });

  // Was `io.emit(...)`, which broadcast every encounter of every campaign to all
  // connected sockets. The table screen now joins a campaign-scoped room instead.
  io.to(`campaign:${campaignId}:table_screen`).emit('encounter_state_changed_public', {
    encounter: publicPayload,
  });
}

// GET / — List encounters
router.get('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const encounters = await prisma.encounter.findMany({
      where: { campaignId: req.campaignId },
      include: {
        location: { select: { id: true, name: true } },
        questNode: {
          select: {
            id: true,
            title: true,
            displayCode: true,
            quest: { select: { id: true, name: true, status: true } },
          },
        },
        _count: { select: { combatants: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
    res.json({ encounters });
  } catch (err) {
    res.status(500).json({ error: 'Failed to list encounters' });
  }
});

// POST / — Create encounter
router.post('/', validate(createEncounterSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const encounter = await prisma.encounter.create({
      data: {
        ...req.body,
        campaignId: req.campaignId,
        phase: req.body.phase || 'planned',
        status: req.body.status || 'planned',
      },
      include: {
        location: { select: { id: true, name: true } },
        combatants: true,
      },
    });

    const io = req.app.get('io');
    emitEncounterState(io, req.campaignId, encounter);

    res.status(201).json({ encounter });
  } catch (err) {
    console.error('Create encounter error:', err);
    res.status(500).json({ error: 'Failed to create encounter' });
  }
});

// GET /:id — Get encounter with combatants
router.get('/:id', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const encounter = await prisma.encounter.findFirst({
      where: { id: req.params.id, campaignId: req.campaignId },
      include: {
        location: { select: { id: true, name: true } },
        combatants: {
          orderBy: [{ initiative: 'desc' }, { orderIndex: 'asc' }],
          include: {
            character: { select: { id: true, name: true, ownerUserId: true, armorClass: true, hpCurrent: true, hpMax: true } },
            npc: { select: { id: true, name: true, armorClass: true, hpMax: true, hpCurrent: true, stats: true, bestiaryId: true } },
            bestiary: { select: { id: true, name: true, armorClass: true, hpMax: true, challengeRating: true, category: true } },
            vehicle: { select: { id: true, name: true, acBase: true, hpMaxBase: true, hpCurrent: true, modelType: true } },
          },
        },
      },
    });
    if (!encounter) return res.status(404).json({ error: 'Encounter not found' });
    res.json({ encounter });
  } catch (err) {
    console.error('Get encounter error:', err);
    res.status(500).json({ error: 'Failed to get encounter' });
  }
});

// PUT /:id — Update encounter (phase, status, round, turn, summary)
router.put('/:id', validate(updateEncounterSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const result = await prisma.encounter.updateMany({
      where: { id: req.params.id, campaignId: req.campaignId },
      data: req.body,
    });
    if (result.count === 0) return res.status(404).json({ error: 'Encounter not found' });

    const encounter = await prisma.encounter.findUnique({
      where: { id: req.params.id },
      include: { combatants: { orderBy: [{ initiative: 'desc' }, { orderIndex: 'asc' }] } },
    });

    const io = req.app.get('io');
    emitEncounterState(io, req.campaignId, encounter);

    res.json({ encounter });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update encounter' });
  }
});

// DELETE /:id — Delete encounter
router.delete('/:id', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const result = await prisma.encounter.deleteMany({
      where: { id: req.params.id, campaignId: req.campaignId },
    });
    if (result.count === 0) return res.status(404).json({ error: 'Encounter not found' });
    res.json({ message: 'Encounter deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete encounter' });
  }
});

// ============================================================
// COMBATANTS & BULK ADDITION
// ============================================================

// POST /:id/combatants/bulk — Add combatants in bulk with auto stats resolution
router.post('/:id/combatants/bulk', validate(bulkAddCombatantsSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const encounter = await prisma.encounter.findFirst({
      where: { id: req.params.id, campaignId: req.campaignId },
      include: { combatants: true },
    });

    if (!encounter) return res.status(404).json({ error: 'Encounter not found' });

    const newCombatantsData = [];
    let currentMaxOrder = encounter.combatants.reduce((max, c) => Math.max(max, c.orderIndex), 0);

    for (const item of req.body.combatants) {
      const count = item.count || 1;

      for (let i = 0; i < count; i++) {
        currentMaxOrder += 1;
        let cName = item.name;
        let cType = 'monster';
        let cSourceType = item.sourceType;
        let cSourceId = item.sourceId;
        let cArmorClass = item.armorClass ?? 10;
        let cHpMax = item.hpMax ?? 10;
        let cHpCurrent = cHpMax;
        let cCharacterId = null;
        let cNpcId = null;
        let cBestiaryId = null;
        let cVehicleId = null;
        let cVisibleToPlayers = false;

        // Resolution rules based on sourceType
        if (item.sourceType === 'character' && item.sourceId) {
          const char = await prisma.character.findFirst({
            where: { id: item.sourceId, campaignId: req.campaignId },
          });
          if (char) {
            cName = cName || char.name;
            cType = 'character';
            cArmorClass = char.armorClass || 10;
            cHpMax = char.hpMax || 10;
            cHpCurrent = char.hpCurrent || 10;
            cCharacterId = char.id;
            cVisibleToPlayers = true;
          }
        } else if (item.sourceType === 'bestiary') {
          let beast = null;
          if (item.sourceId) {
            beast = await prisma.bestiary.findFirst({
              where: { id: item.sourceId, campaignId: req.campaignId },
            });
          }
          if (!beast && (item.name || item.sourceId)) {
            beast = await prisma.bestiary.findFirst({
              where: { campaignId: req.campaignId, name: item.name || item.sourceId },
            });
          }
          if (beast) {
            const suffix = count > 1 ? ` ${i + 1}` : '';
            cName = (item.name || beast.name) + suffix;
            cType = 'monster';
            cBestiaryId = beast.id;
            cSourceId = beast.id;
            cArmorClass = beast.armorClass || 10;
            cHpMax = beast.hpMax || 10;
            cHpCurrent = beast.hpMax || 10;
          }
        } else if (item.sourceType === 'npc') {
          let npc = null;
          if (item.sourceId) {
            npc = await prisma.npc.findFirst({
              where: { id: item.sourceId, campaignId: req.campaignId },
              include: { bestiary: true },
            });
          }
          if (!npc && (item.name || item.sourceId)) {
            npc = await prisma.npc.findFirst({
              where: { campaignId: req.campaignId, name: item.name || item.sourceId },
              include: { bestiary: true },
            });
          }
          if (npc) {
            cName = item.name || npc.name;
            cType = 'npc';
            cNpcId = npc.id;
            cSourceId = npc.id;

            if (npc.armorClass !== null && npc.armorClass !== undefined) {
              cArmorClass = npc.armorClass;
            } else if (npc.bestiary && npc.bestiary.armorClass) {
              cArmorClass = npc.bestiary.armorClass;
            } else {
              cArmorClass = 10;
            }

            if (npc.hpMax !== null && npc.hpMax !== undefined) {
              cHpMax = npc.hpMax;
              cHpCurrent = npc.hpCurrent !== null && npc.hpCurrent !== undefined ? npc.hpCurrent : npc.hpMax;
            } else if (npc.bestiary && npc.bestiary.hpMax) {
              cHpMax = npc.bestiary.hpMax;
              cHpCurrent = npc.bestiary.hpMax;
            } else {
              cHpMax = 10;
              cHpCurrent = 10;
            }
          }
        } else if (item.sourceType === 'vehicle' && item.sourceId) {
          const vehicle = await prisma.vehicle.findFirst({
            where: { id: item.sourceId, campaignId: req.campaignId },
            include: {
              crewSlots: {
                include: { character: true },
              },
            },
          });
          if (vehicle) {
            cName = cName || vehicle.name;
            cType = 'vehicle';
            cVehicleId = vehicle.id;
            cArmorClass = vehicle.acBase || 10;
            cHpMax = vehicle.hpMaxBase || 50;
            cHpCurrent = vehicle.hpCurrent || 50;

            // User choice #3: Automatically add crew members as combatants!
            if (vehicle.crewSlots && vehicle.crewSlots.length > 0) {
              for (const slot of vehicle.crewSlots) {
                if (slot.character) {
                  const crewChar = slot.character;
                  currentMaxOrder += 1;
                  newCombatantsData.push({
                    encounterId: encounter.id,
                    name: `${crewChar.name} (${slot.role || 'Équipage'})`,
                    type: 'character',
                    sourceType: 'character',
                    sourceId: crewChar.id,
                    characterId: crewChar.id,
                    armorClass: crewChar.armorClass || 10,
                    hpMax: crewChar.hpMax || 10,
                    hpCurrent: crewChar.hpCurrent || 10,
                    isVisibleToPlayers: true,
                    orderIndex: currentMaxOrder,
                  });
                }
              }
            }
          }
        } else {
          // Manual fallback
          cName = cName || 'Combattant Manuel';
          cType = 'monster';
        }

        newCombatantsData.push({
          encounterId: encounter.id,
          name: cName || 'Inconnu',
          type: cType,
          sourceType: cSourceType,
          sourceId: cSourceId,
          armorClass: cArmorClass,
          hpMax: cHpMax,
          hpCurrent: cHpCurrent,
          characterId: cCharacterId,
          npcId: cNpcId,
          bestiaryId: cBestiaryId,
          vehicleId: cVehicleId,
          isVisibleToPlayers: cVisibleToPlayers,
          orderIndex: currentMaxOrder,
        });
      }
    }

    if (newCombatantsData.length > 0) {
      await prisma.encounterCombatant.createMany({
        data: newCombatantsData,
      });
    }

    const updatedEncounter = await prisma.encounter.findUnique({
      where: { id: req.params.id },
      include: {
        combatants: {
          orderBy: [{ initiative: 'desc' }, { orderIndex: 'asc' }],
        },
      },
    });

    const io = req.app.get('io');
    emitEncounterState(io, req.campaignId, updatedEncounter);

    res.status(201).json({ encounter: updatedEncounter });
  } catch (err) {
    console.error('Bulk add combatants error:', err);
    res.status(500).json({ error: 'Failed to add combatants' });
  }
});

// POST /:id/combatants — Add single combatant
router.post('/:id/combatants', validate(createCombatantSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const combatant = await prisma.encounterCombatant.create({
      data: { ...req.body, encounterId: req.params.id },
    });

    const updatedEncounter = await prisma.encounter.findUnique({
      where: { id: req.params.id },
      include: { combatants: { orderBy: [{ initiative: 'desc' }, { orderIndex: 'asc' }] } },
    });
    const io = req.app.get('io');
    emitEncounterState(io, req.campaignId, updatedEncounter);

    res.status(201).json({ combatant, encounter: updatedEncounter });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add combatant' });
  }
});

// PATCH /:id/combatants/:combatantId — Update combatant (HP, conditions, surprise, etc.)
router.patch('/:id/combatants/:combatantId', validate(updateCombatantSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const combatant = await prisma.encounterCombatant.update({
      where: { id: req.params.combatantId },
      data: req.body,
    });

    const updatedEncounter = await prisma.encounter.findUnique({
      where: { id: req.params.id },
      include: { combatants: { orderBy: [{ initiative: 'desc' }, { orderIndex: 'asc' }] } },
    });

    const io = req.app.get('io');
    emitEncounterState(io, req.campaignId, updatedEncounter);

    // If HP changed and combatant is a character, emit update to owner user
    if (req.body.hpCurrent !== undefined && combatant.characterId) {
      const character = await prisma.character.findUnique({ where: { id: combatant.characterId } });
      if (io && character && character.ownerUserId) {
        io.to(`user:${character.ownerUserId}`).emit('character:hp-updated', {
          characterId: character.id,
          hpCurrent: combatant.hpCurrent,
          hpMax: combatant.hpMax,
        });
      }
    }

    // If HP changed and combatant is an NPC, keep the NPC record synced
    if (req.body.hpCurrent !== undefined && combatant.npcId) {
      await prisma.nPC.update({
        where: { id: combatant.npcId },
        data: { hpCurrent: combatant.hpCurrent },
      }).catch(e => console.error('Error syncing combatant HP to NPC:', e));
    }

    res.json({ combatant, encounter: updatedEncounter });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update combatant' });
  }
});

// DELETE /:id/combatants/:combatantId — Remove combatant
router.delete('/:id/combatants/:combatantId', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    await prisma.encounterCombatant.delete({ where: { id: req.params.combatantId } });

    const updatedEncounter = await prisma.encounter.findUnique({
      where: { id: req.params.id },
      include: { combatants: { orderBy: [{ initiative: 'desc' }, { orderIndex: 'asc' }] } },
    });
    const io = req.app.get('io');
    emitEncounterState(io, req.campaignId, updatedEncounter);

    res.json({ message: 'Combatant removed', encounter: updatedEncounter });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove combatant' });
  }
});

// ============================================================
// PHASE TRANSITIONS & TURN NAVIGATION
// ============================================================

// POST /:id/start-surprise-check — Move phase to "surprise_check"
router.post('/:id/start-surprise-check', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const encounter = await prisma.encounter.update({
      where: { id: req.params.id },
      data: { phase: 'surprise_check', surpriseEnabled: true },
      include: { combatants: true },
    });

    const io = req.app.get('io');
    emitEncounterState(io, req.campaignId, encounter);

    res.json({ encounter });
  } catch (err) {
    res.status(500).json({ error: 'Failed to start surprise check' });
  }
});

// POST /:id/start-initiative-entry — Move phase to "initiative_entry"
router.post('/:id/start-initiative-entry', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const encounter = await prisma.encounter.update({
      where: { id: req.params.id },
      data: { phase: 'initiative_entry' },
      include: { combatants: true },
    });

    const io = req.app.get('io');
    emitEncounterState(io, req.campaignId, encounter);

    res.json({ encounter });
  } catch (err) {
    res.status(500).json({ error: 'Failed to start initiative entry' });
  }
});

// POST /:id/start-combat — Sort by initiative and start combat active phase
router.post('/:id/start-combat', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const encounter = await prisma.encounter.findFirst({
      where: { id: req.params.id, campaignId: req.campaignId },
      include: { combatants: true },
    });

    if (!encounter) return res.status(404).json({ error: 'Encounter not found' });

    // Sort combatants by initiative descending
    const sorted = [...encounter.combatants].sort((a, b) => b.initiative - a.initiative);

    // Update orderIndex
    for (let i = 0; i < sorted.length; i++) {
      await prisma.encounterCombatant.update({
        where: { id: sorted[i].id },
        data: { orderIndex: i },
      });
    }

    const updated = await prisma.encounter.update({
      where: { id: req.params.id },
      data: {
        phase: 'active',
        status: 'active',
        currentRound: 1,
        currentTurnIndex: 0,
      },
      include: {
        combatants: {
          orderBy: [{ initiative: 'desc' }, { orderIndex: 'asc' }],
        },
      },
    });

    const io = req.app.get('io');
    emitEncounterState(io, req.campaignId, updated);

    res.json({ encounter: updated });
  } catch (err) {
    console.error('Start combat error:', err);
    res.status(500).json({ error: 'Failed to start combat' });
  }
});

// POST /:id/next-turn — Advance turn in active combat
router.post('/:id/next-turn', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const encounter = await prisma.encounter.findFirst({
      where: { id: req.params.id, campaignId: req.campaignId },
      include: { combatants: { orderBy: [{ initiative: 'desc' }, { orderIndex: 'asc' }] } },
    });
    if (!encounter) return res.status(404).json({ error: 'Encounter not found' });
    if (encounter.combatants.length === 0) {
      return res.status(400).json({ error: 'No combatants in encounter' });
    }

    let nextIndex = encounter.currentTurnIndex + 1;
    let nextRound = encounter.currentRound;

    if (nextIndex >= encounter.combatants.length) {
      nextIndex = 0;
      nextRound += 1;
    }

    // Check if next combatant is surprised during round 1
    let activeCombatant = encounter.combatants[nextIndex];
    if (nextRound === 1 && activeCombatant && activeCombatant.isSurprised) {
      // Auto-advance if surprised on round 1 (or highlight)
      // We still select them so GM sees "Surprised - Turn passed", but next click moves on
    }

    const updated = await prisma.encounter.update({
      where: { id: req.params.id },
      data: { currentTurnIndex: nextIndex, currentRound: nextRound },
      include: { combatants: { orderBy: [{ initiative: 'desc' }, { orderIndex: 'asc' }] } },
    });

    const io = req.app.get('io');
    emitEncounterState(io, req.campaignId, updated);

    // Notify player whose turn it is
    if (io && activeCombatant && activeCombatant.characterId) {
      const character = await prisma.character.findUnique({ where: { id: activeCombatant.characterId } });
      if (character && character.ownerUserId) {
        io.to(`user:${character.ownerUserId}`).emit('encounter:your-turn', {
          encounterId: encounter.id,
          round: nextRound,
          combatantName: activeCombatant.name,
        });
      }
    }

    res.json({ encounter: updated, currentTurn: activeCombatant });
  } catch (err) {
    console.error('Next turn error:', err);
    res.status(500).json({ error: 'Failed to advance turn' });
  }
});

// POST /:id/end-combat — Complete combat and create summary
router.post('/:id/end-combat', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const encounter = await prisma.encounter.findFirst({
      where: { id: req.params.id, campaignId: req.campaignId },
      include: { combatants: true },
    });
    if (!encounter) return res.status(404).json({ error: 'Encounter not found' });

    const fallen = encounter.combatants.filter(c => c.hpCurrent <= 0).map(c => c.name);
    const summary = JSON.stringify({
      endedAt: new Date().toISOString(),
      totalRounds: encounter.currentRound,
      totalCombatants: encounter.combatants.length,
      fallenCombatants: fallen,
    });

    const updated = await prisma.encounter.update({
      where: { id: req.params.id },
      data: {
        phase: 'completed',
        status: 'completed',
        summary,
      },
      include: { combatants: true },
    });

    const io = req.app.get('io');
    emitEncounterState(io, req.campaignId, updated);

    res.json({ encounter: updated });
  } catch (err) {
    console.error('End combat error:', err);
    res.status(500).json({ error: 'Failed to end combat' });
  }
});

// POST /:id/sync-pcs — Sync PCs HP/AC from Character table into combatants
router.post('/:id/sync-pcs', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const encounter = await prisma.encounter.findFirst({
      where: { id: req.params.id, campaignId: req.campaignId },
      include: { combatants: true },
    });
    if (!encounter) return res.status(404).json({ error: 'Encounter not found' });

    const pcs = await prisma.character.findMany({
      where: { campaignId: req.campaignId },
      select: { id: true, name: true, hpCurrent: true, hpMax: true, armorClass: true },
    });

    for (const pc of pcs) {
      const existing = encounter.combatants.find(
        c => c.characterId === pc.id || (c.type === 'character' && c.name === pc.name)
      );

      if (existing) {
        await prisma.encounterCombatant.update({
          where: { id: existing.id },
          data: {
            hpCurrent: pc.hpCurrent || existing.hpCurrent,
            hpMax: pc.hpMax || existing.hpMax,
            armorClass: pc.armorClass || existing.armorClass,
          },
        });
      } else {
        await prisma.encounterCombatant.create({
          data: {
            encounterId: encounter.id,
            name: pc.name,
            type: 'character',
            sourceType: 'character',
            characterId: pc.id,
            hpCurrent: pc.hpCurrent || 10,
            hpMax: pc.hpMax || 10,
            armorClass: pc.armorClass || 10,
            isVisibleToPlayers: true,
          },
        });
      }
    }

    const updatedEncounter = await prisma.encounter.findFirst({
      where: { id: req.params.id },
      include: {
        location: { select: { id: true, name: true } },
        questNode: {
          select: {
            id: true,
            title: true,
            displayCode: true,
            quest: { select: { id: true, name: true, status: true } },
          },
        },
        combatants: {
          orderBy: [{ initiative: 'desc' }, { orderIndex: 'asc' }],
          include: {
            character: { select: { id: true, name: true, armorClass: true, hpCurrent: true, hpMax: true } },
            npc: { select: { id: true, name: true, armorClass: true, hpMax: true, hpCurrent: true } },
            bestiary: { select: { id: true, name: true, armorClass: true, hpMax: true } },
          },
        },
      },
    });

    const io = req.app.get('io');
    emitEncounterState(io, req.campaignId, updatedEncounter);

    res.json({ encounter: updatedEncounter });
  } catch (err) {
    console.error('Sync PCs error:', err);
    res.status(500).json({ error: 'Failed to sync PCs' });
  }
});

// POST /:id/reset — Reset encounter back to preparation phase with full HP and cleared statuses
router.post('/:id/reset', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const encounter = await prisma.encounter.findFirst({
      where: { id: req.params.id, campaignId: req.campaignId },
      include: { combatants: true },
    });
    if (!encounter) return res.status(404).json({ error: 'Encounter not found' });

    // Reset encounter state
    await prisma.encounter.update({
      where: { id: encounter.id },
      data: {
        status: 'planned',
        phase: 'planned',
        currentRound: 0,
        currentTurnIndex: 0,
      },
    });

    // Reset combatants (Full HP, 0 initiative, no surprise, no conditions)
    for (const c of encounter.combatants) {
      await prisma.encounterCombatant.update({
        where: { id: c.id },
        data: {
          hpCurrent: c.hpMax,
          initiative: 0,
          isSurprised: false,
          conditions: '[]',
        },
      });
    }

    const updatedEncounter = await prisma.encounter.findFirst({
      where: { id: req.params.id },
      include: {
        location: { select: { id: true, name: true } },
        questNode: {
          select: {
            id: true,
            title: true,
            displayCode: true,
            quest: { select: { id: true, name: true, status: true } },
          },
        },
        combatants: {
          orderBy: [{ initiative: 'desc' }, { orderIndex: 'asc' }],
          include: {
            character: { select: { id: true, name: true, armorClass: true, hpCurrent: true, hpMax: true } },
            npc: { select: { id: true, name: true, armorClass: true, hpMax: true, hpCurrent: true } },
            bestiary: { select: { id: true, name: true, armorClass: true, hpMax: true } },
          },
        },
      },
    });

    const io = req.app.get('io');
    emitEncounterState(io, req.campaignId, updatedEncounter);

    res.json({ encounter: updatedEncounter });
  } catch (err) {
    console.error('Reset encounter error:', err);
    res.status(500).json({ error: 'Failed to reset encounter' });
  }
});

module.exports = router;
