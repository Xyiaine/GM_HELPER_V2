// GM Helper — Construction des charges utiles publiques
//
// Ce que les joueurs et l'écran de table ont le droit de voir. Ces fonctions
// étaient enfermées dans la route des rencontres ; elles sont désormais
// partagées, parce que l'écran de table a besoin exactement du même filtrage
// et qu'une divergence entre deux copies serait invisible jusqu'à ce qu'une
// information du MJ fuite sur la télévision.

/**
 * Filtre une rencontre pour l'affichage public (joueurs et écran de table).
 *
 * Les points de vie et la classe d'armure n'y figurent jamais : l'écran de
 * table montre l'ordre d'initiative et la carte du combat, pas les chiffres.
 * Chaque joueur tient ses propres points de vie sur sa fiche papier et reçoit
 * les siens par l'événement ciblé `character:hp-updated`.
 *
 * Les secrets du MJ (`mjDescription`, notes, gabarits de combat) ne sont pas
 * transmis non plus.
 *
 * @param {object|null} encounter Rencontre avec ses combattants
 * @returns {object|null}
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
    combatants: (encounter.combatants || []).map((c) => {
      const base = {
        id: c.id,
        name: c.name,
        type: c.type,
        sourceType: c.sourceType,
        initiative: c.initiative,
        isSurprised: c.isSurprised,
      };

      // Un combattant masqué n'expose rien de plus que son existence dans
      // l'ordre d'initiative.
      if (!c.isVisibleToPlayers) return base;

      return {
        ...base,
        conditions: c.conditions,
        characterId: c.characterId,
      };
    }),
  };
}

/**
 * Filtre un nœud de quête pour l'affichage public.
 *
 * Seuls les éléments destinés à la table sont conservés : le titre, le code
 * d'affichage et le texte sensoriel. `mjDescription` et les secrets restent
 * côté MJ.
 */
function filterQuestNodeForPublic(node, quest) {
  if (!node) return null;

  return {
    nodeId: node.id,
    displayCode: node.displayCode,
    title: node.title,
    nodeType: node.nodeType,
    pacingTag: node.pacingTag,
    sensoryText: node.sensoryText,
    sensoryVisual: node.sensoryVisual,
    sensorySound: node.sensorySound,
    sensorySmell: node.sensorySmell,
    reachedAt: node.reachedAt,
    questId: node.questId,
    questName: quest ? quest.name : null,
    // L'illustration de la scène, avec repli sur celle de la quête.
    imageUrl: node.imageUrl || (quest ? quest.imageUrl : null) || null,
  };
}

module.exports = {
  filterEncounterForPublic,
  filterQuestNodeForPublic,
};
