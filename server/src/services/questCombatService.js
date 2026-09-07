const { PrismaClient } = require('@prisma/client');

/**
 * Instantiates or updates encounters for all nodes of a quest that have a combatTemplate.
 * Uses upsert logic on Encounter (by questNodeId) to prevent duplicate encounters.
 * Parses combatTemplate JSON and populates EncounterCombatant without duplicating or overwriting active states.
 */
async function instantiateQuestEncounters(prisma, campaignId, questId) {
  try {
    const quest = await prisma.quest.findUnique({
      where: { id: questId },
      include: {
        nodes: true,
      },
    });

    if (!quest) return [];

    const createdOrUpdatedEncounters = [];

    // Fetch active PCs in the campaign
    const pcs = await prisma.character.findMany({
      where: { campaignId },
      select: {
        id: true,
        name: true,
        armorClass: true,
        hpCurrent: true,
        hpMax: true,
      },
    });

    for (const node of quest.nodes) {
      if (!node.combatTemplate) continue;

      let template = [];
      try {
        template = typeof node.combatTemplate === 'string'
          ? JSON.parse(node.combatTemplate)
          : node.combatTemplate;
      } catch (e) {
        console.error(`Invalid combatTemplate JSON for node ${node.id}:`, e);
        continue;
      }

      if (!Array.isArray(template) || template.length === 0) continue;

      // Find or create encounter for this node
      let encounter = await prisma.encounter.findFirst({
        where: { questNodeId: node.id, campaignId },
        include: { combatants: true },
      });

      const displayCode = node.displayCode ? `${node.displayCode}` : '';
      const encounterName = displayCode
        ? `[${quest.name} - ${displayCode}] ${node.title}`
        : `[${quest.name}] ${node.title}`;

      if (!encounter) {
        encounter = await prisma.encounter.create({
          data: {
            campaignId,
            questNodeId: node.id,
            name: encounterName,
            description: node.mjDescription || node.sensoryText || null,
            status: 'planned',
            phase: 'planned',
          },
          include: { combatants: true },
        });
      } else {
        await prisma.encounter.update({
          where: { id: encounter.id },
          data: { name: encounterName },
        });
      }

      // Link encounter back to questNode if not linked
      if (node.linkedEncounterId !== encounter.id) {
        await prisma.questNode.update({
          where: { id: node.id },
          data: { linkedEncounterId: encounter.id },
        });
      }

      // 1. Sync PCs into combatants
      for (const pc of pcs) {
        const existingPcCombatant = encounter.combatants.find(
          c => c.characterId === pc.id || (c.type === 'character' && c.name === pc.name)
        );

        if (!existingPcCombatant) {
          const newPc = await prisma.encounterCombatant.create({
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
          encounter.combatants.push(newPc);
        }
      }

      // 2. Sync Enemies from combatTemplate
      let orderIndexCounter = encounter.combatants.length;
      for (const item of template) {
        const count = item.count || 1;
        const sourceType = item.sourceType || item.type || 'bestiary';
        const sourceId = item.sourceId || item.id;

        let baseEntity = null;
        let resolvedSourceId = sourceId;

        if (sourceType === 'bestiary') {
          if (resolvedSourceId) {
            baseEntity = await prisma.bestiary.findUnique({ where: { id: resolvedSourceId } });
          } else if (item.name) {
            baseEntity = await prisma.bestiary.findFirst({
              where: { campaignId, name: item.name },
            });
            if (baseEntity) resolvedSourceId = baseEntity.id;
          }
        } else if (sourceType === 'npc') {
          if (resolvedSourceId) {
            baseEntity = await prisma.nPC.findUnique({ where: { id: resolvedSourceId } });
          } else if (item.name) {
            baseEntity = await prisma.nPC.findFirst({
              where: { campaignId, name: item.name },
            });
            if (baseEntity) resolvedSourceId = baseEntity.id;
          }
        }

        const baseName = item.name || (baseEntity ? baseEntity.name : 'Ennemi');
        const hpMax = baseEntity ? (baseEntity.hpMax || 10) : (item.hpMax || 10);
        const armorClass = baseEntity ? (baseEntity.armorClass || 10) : (item.armorClass || 10);

        // Check how many combatants of this source/name already exist in this encounter
        const existingCombatants = encounter.combatants.filter(
          c => (resolvedSourceId && (c.bestiaryId === resolvedSourceId || c.npcId === resolvedSourceId || c.sourceId === resolvedSourceId)) || c.name.startsWith(baseName)
        );

        if (baseEntity) {
          for (const c of existingCombatants) {
            const needsUpdate = (!c.sourceId && resolvedSourceId) || (c.hpMax === 10 && hpMax !== 10) || (c.armorClass === 10 && armorClass !== 10);
            if (needsUpdate) {
              await prisma.encounterCombatant.update({
                where: { id: c.id },
                data: {
                  sourceId: resolvedSourceId,
                  bestiaryId: sourceType === 'bestiary' ? resolvedSourceId : c.bestiaryId,
                  npcId: sourceType === 'npc' ? resolvedSourceId : c.npcId,
                  hpMax: hpMax,
                  hpCurrent: (c.hpCurrent === c.hpMax || c.hpMax === 10) ? hpMax : c.hpCurrent,
                  armorClass: armorClass,
                },
              });
              c.sourceId = resolvedSourceId;
              c.hpMax = hpMax;
              c.armorClass = armorClass;
            }
          }
        }

        const existingCount = existingCombatants.length;
        const needed = count - existingCount;

        for (let i = 0; i < needed; i++) {
          const suffix = (count > 1 || existingCount > 0) ? ` #${existingCount + i + 1}` : '';
          const combatantName = `${baseName}${suffix}`;

          const newEnemy = await prisma.encounterCombatant.create({
            data: {
              encounterId: encounter.id,
              name: combatantName,
              type: sourceType === 'npc' ? 'npc' : 'monster',
              sourceType: sourceType,
              sourceId: resolvedSourceId || null,
              bestiaryId: sourceType === 'bestiary' ? (resolvedSourceId || null) : null,
              npcId: sourceType === 'npc' ? (resolvedSourceId || null) : null,
              hpCurrent: hpMax,
              hpMax: hpMax,
              armorClass: armorClass,
              orderIndex: orderIndexCounter++,
              isVisibleToPlayers: true,
            },
          });
          encounter.combatants.push(newEnemy);
        }
      }

      createdOrUpdatedEncounters.push(encounter);
    }

    return createdOrUpdatedEncounters;
  } catch (err) {
    console.error('Error in instantiateQuestEncounters:', err);
    throw err;
  }
}

module.exports = {
  instantiateQuestEncounters,
};
