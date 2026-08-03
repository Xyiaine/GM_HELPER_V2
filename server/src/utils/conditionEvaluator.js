/**
 * GM Helper — Condition Evaluator Utility
 * Evaluates condition expressions for quest node connections and threat effects.
 * 
 * Supports syntax:
 * - Simple equality: "route == 'longue'", "route == 'rapide'"
 * - Faction state: "relationship.loups_de_sel == 'hostile'", "relationship.loups_de_sel == 'allie'"
 * - Threat levels: "threat.ver_des_sables.level >= 3", "threat.level > 2"
 * - Character state: "characterState.key == 'value'"
 * - Legacy tags: "route_longue", "route_rapide", "si l'affrontement a lieu"
 * - Boolean combinators: "&&", "||"
 * 
 * Safe evaluation without eval() or Function() constructor.
 */

/**
 * Parses and evaluates a condition string against a quest playthrough context.
 * 
 * @param {string|null} condition - The condition expression string
 * @param {Object} context - The current quest playthrough state:
 *   {
 *     route: 'longue'|'rapide'|...,
 *     threats: { [threatIdOrName]: { currentLevel, maxLevel } },
 *     factions: { [factionName]: { relationshipState, progressValue } },
 *     characterStates: { [key]: value },
 *     reachedNodeIds: Array<string>
 *   }
 * @returns {{ isMet: boolean, reason: string }}
 */
function evaluateCondition(condition, context = {}) {
  if (!condition || typeof condition !== 'string' || condition.trim() === '') {
    return { isMet: true, reason: 'Aucune condition spécifiée' };
  }

  const normalized = condition.trim();

  // Handle boolean OR (||)
  if (normalized.includes('||')) {
    const parts = normalized.split('||');
    const results = parts.map(p => evaluateCondition(p.trim(), context));
    const anyMet = results.some(r => r.isMet);
    return {
      isMet: anyMet,
      reason: anyMet ? 'Au moins une condition (OU) est remplie' : 'Aucune condition (OU) n\'est remplie'
    };
  }

  // Handle boolean AND (&&)
  if (normalized.includes('&&')) {
    const parts = normalized.split('&&');
    const results = parts.map(p => evaluateCondition(p.trim(), context));
    const allMet = results.every(r => r.isMet);
    return {
      isMet: allMet,
      reason: allMet ? 'Toutes les conditions (ET) sont remplies' : 'Certaines conditions (ET) ne sont pas remplies'
    };
  }

  // Legacy simple keyword matches
  if (normalized === 'route_longue' || normalized === 'route == longue' || normalized === "route == 'longue'") {
    const isMet = (context.route === 'longue' || context.route === 'route_longue');
    return { isMet, reason: isMet ? 'Route longue sélectionnée' : 'Route longue non sélectionnée' };
  }

  if (normalized === 'route_rapide' || normalized === 'route == rapide' || normalized === "route == 'rapide'") {
    const isMet = (context.route === 'rapide' || context.route === 'route_rapide');
    return { isMet, reason: isMet ? 'Route rapide sélectionnée' : 'Route rapide non sélectionnée' };
  }

  // Regex comparison matcher: identifier OP value
  // Example: relationship.loups_de_sel == 'hostile' or threat.level >= 3
  const opRegex = /^([a-zA-Z0-9_\.\-]+)\s*(==|!=|>=|<=|>|<|contains)\s*['"]?([^'"]+)['"]?$/;
  const match = normalized.match(opRegex);

  if (match) {
    const [, key, op, expectedVal] = match;
    const actualVal = resolveContextKey(key, context);

    let isMet = false;
    switch (op) {
      case '==':
        isMet = String(actualVal).toLowerCase() === String(expectedVal).toLowerCase();
        break;
      case '!=':
        isMet = String(actualVal).toLowerCase() !== String(expectedVal).toLowerCase();
        break;
      case '>=':
        isMet = Number(actualVal) >= Number(expectedVal);
        break;
      case '<=':
        isMet = Number(actualVal) <= Number(expectedVal);
        break;
      case '>':
        isMet = Number(actualVal) > Number(expectedVal);
        break;
      case '<':
        isMet = Number(actualVal) < Number(expectedVal);
        break;
      case 'contains':
        isMet = String(actualVal).toLowerCase().includes(String(expectedVal).toLowerCase());
        break;
      default:
        isMet = true;
    }

    return {
      isMet,
      reason: isMet
        ? `Condition vérifiée: ${key} (${actualVal}) ${op} ${expectedVal}`
        : `Condition non remplie: ${key} (${actualVal}) n'est pas ${op} ${expectedVal}`
    };
  }

  // If node ID check: "reached(node_1a)"
  const nodeCheckMatch = normalized.match(/^reached\(([^)]+)\)$/);
  if (nodeCheckMatch) {
    const targetNodeId = nodeCheckMatch[1].trim();
    const isMet = (context.reachedNodeIds || []).includes(targetNodeId);
    return {
      isMet,
      reason: isMet ? `Nœud ${targetNodeId} atteint` : `Nœud ${targetNodeId} non encore atteint`
    };
  }

  // Fallback for non-strict condition strings (always evaluate to true in default mode, but log for GM awareness)
  return { isMet: true, reason: `Condition textuelle: "${normalized}" (non restrictive)` };
}

/**
 * Resolves context key like "relationship.loups_de_sel" or "threat.ver_des_sables.level"
 */
function resolveContextKey(key, context) {
  const parts = key.split('.');
  
  if (parts[0] === 'relationship' || parts[0] === 'faction') {
    const factionKey = parts[1]?.toLowerCase();
    const factionData = Object.entries(context.factions || {}).find(
      ([fName]) => fName.toLowerCase().includes(factionKey)
    );
    return factionData ? factionData[1].relationshipState : 'neutre';
  }

  if (parts[0] === 'threat') {
    const threatKey = parts[1]?.toLowerCase();
    if (parts[2] === 'level' || parts.length === 2) {
      const threatData = Object.entries(context.threats || {}).find(
        ([tName]) => tName.toLowerCase().includes(threatKey || '')
      );
      return threatData ? threatData[1].currentLevel : 0;
    }
  }

  if (parts[0] === 'characterState') {
    const stateKey = parts[1];
    return context.characterStates?.[stateKey] || null;
  }

  if (key === 'route') {
    return context.route || 'inconnue';
  }

  return context[key] !== undefined ? context[key] : null;
}

module.exports = {
  evaluateCondition,
  resolveContextKey
};
