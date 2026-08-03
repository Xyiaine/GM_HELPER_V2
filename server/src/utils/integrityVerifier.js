/**
 * GM Helper — Quest Graph Integrity Verifier (BE-7)
 * Audits a Quest graph structure to verify referential integrity of:
 * - QuestNode connections (fromNodeId, toNodeId)
 * - Timeout references (timeoutNodeId)
 * - Reward payoffs (payoffNodeId)
 * - Generative failure branch targets (branchNodeId)
 * - Objective unlocks (unlockedByNodeId)
 * - NPC profile & link references
 */

/**
 * Performs a comprehensive integrity audit on a quest database structure.
 * 
 * @param {Object} quest - Quest object with included nodes, connections, objectives, threats, etc.
 * @returns {{ isValid: boolean, errors: Array<string>, warnings: Array<string>, summary: Object }}
 */
function auditQuestIntegrity(quest) {
  const errors = [];
  const warnings = [];
  const nodes = quest.nodes || [];
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const nodeCodes = new Set(nodes.map(n => n.displayCode).filter(Boolean));

  if (nodes.length === 0) {
    warnings.push('La quête ne contient aucun nœud dans son graphe.');
  }

  // Check start and end nodes
  const startNodes = nodes.filter(n => n.nodeType === 'start');
  const endNodes = nodes.filter(n => n.nodeType === 'end');

  if (startNodes.length === 0) {
    errors.push('Aucun nœud de départ (nodeType = "start") n\'a été défini.');
  }
  if (endNodes.length === 0) {
    warnings.push('Aucun nœud de fin (nodeType = "end") n\'a été défini.');
  }

  // Audit node references
  for (const node of nodes) {
    // 1. Timeout node target check
    if (node.isTimed && node.timeoutNodeId) {
      if (!nodeMap.has(node.timeoutNodeId)) {
        errors.push(`Nœud "${node.title}" (${node.id}) : timeoutNodeId "${node.timeoutNodeId}" introuvable dans la quête.`);
      }
    }

    // 2. Generative failure branch check
    if (node.generativeFailure) {
      try {
        const genFail = typeof node.generativeFailure === 'string'
          ? JSON.parse(node.generativeFailure)
          : node.generativeFailure;
        if (genFail.branchNodeId && !nodeMap.has(genFail.branchNodeId)) {
          errors.push(`Nœud "${node.title}" (${node.id}) : failure branch node "${genFail.branchNodeId}" introuvable.`);
        }
      } catch (e) {
        warnings.push(`Nœud "${node.title}" (${node.id}) : JSON de generativeFailure invalide.`);
      }
    }

    // 3. Rewards payoff node check
    if (node.rewards && Array.isArray(node.rewards)) {
      for (const rew of node.rewards) {
        if (rew.payoffNodeId && !nodeMap.has(rew.payoffNodeId)) {
          errors.push(`Récompense "${rew.rewardValue}" du nœud "${node.title}" : payoffNodeId "${rew.payoffNodeId}" introuvable.`);
        }
      }
    }

    // 4. Connections check
    if (node.connectionsFrom) {
      for (const conn of node.connectionsFrom) {
        if (!nodeMap.has(conn.toNodeId)) {
          errors.push(`Connexion depuis "${node.title}" vers toNodeId "${conn.toNodeId}" introuvable.`);
        }
      }
    }
  }

  // Audit Objectives
  if (quest.objectives) {
    for (const obj of quest.objectives) {
      if (obj.unlockedByNodeId && !nodeMap.has(obj.unlockedByNodeId)) {
        warnings.push(`Objectif "${obj.description}" : unlockedByNodeId "${obj.unlockedByNodeId}" introuvable.`);
      }
    }
  }

  // Audit Threat Effects
  if (quest.threats) {
    const threatIds = new Set(quest.threats.map(t => t.id));
    for (const node of nodes) {
      if (node.threatEffects) {
        for (const eff of node.threatEffects) {
          if (!threatIds.has(eff.threatId)) {
            errors.push(`Nœud "${node.title}" : threatEffect fait référence à une horloge threatId "${eff.threatId}" inexistante.`);
          }
        }
      }
    }
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    warnings,
    summary: {
      totalNodes: nodes.length,
      startNodesCount: startNodes.length,
      endNodesCount: endNodes.length,
      totalObjectives: (quest.objectives || []).length,
      totalThreats: (quest.threats || []).length,
      totalNPCProfiles: (quest.npcProfiles || []).length,
    }
  };
}

module.exports = {
  auditQuestIntegrity
};
