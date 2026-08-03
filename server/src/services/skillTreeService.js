const fs = require('fs').promises;
const path = require('path');

let cachedTrees = null;
let nodeMapCache = null;

async function getAllTrees() {
  if (cachedTrees) {
    return cachedTrees;
  }

  const dataDir = path.join(__dirname, '../data/skill_trees');
  const files = await fs.readdir(dataDir);
  const trees = [];
  const nodeMap = new Map();

  for (const file of files) {
    if (file.endsWith('.json')) {
      const content = await fs.readFile(path.join(dataDir, file), 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && parsed.arbre) {
        trees.push(parsed.arbre);
        if (parsed.arbre.branches) {
          for (const branch of parsed.arbre.branches) {
            if (branch.noeuds) {
              for (const node of branch.noeuds) {
                nodeMap.set(node.id, { ...node, treeId: parsed.arbre.id });
              }
            }
          }
        }
      }
    }
  }

  cachedTrees = trees;
  nodeMapCache = nodeMap;
  return cachedTrees;
}

async function getNodeById(nodeId) {
  if (!nodeMapCache) {
    await getAllTrees();
  }
  return nodeMapCache.get(nodeId);
}

/**
 * Server-side validation for unlocking a skill node on a character
 */
async function validateAndUnlockSkill(character, nodeId) {
  await getAllTrees();

  const node = await getNodeById(nodeId);
  if (!node) {
    return { success: false, error: `Skill node '${nodeId}' not found.` };
  }

  let unlockedSkills = [];
  try {
    unlockedSkills = character.unlockedSkills ? JSON.parse(character.unlockedSkills) : [];
    if (!Array.isArray(unlockedSkills)) unlockedSkills = [];
  } catch (e) {
    unlockedSkills = [];
  }

  if (unlockedSkills.includes(nodeId)) {
    return { success: false, error: `Skill '${node.nom || nodeId}' is already unlocked.` };
  }

  // Calculate spent points and available budget
  const spentPoints = character.skillPoints || 0;
  const maxPoints = (character.level || 1) * 2;
  const availablePoints = maxPoints - spentPoints;

  const cost = node.cout_points || 1;
  if (availablePoints < cost) {
    return { 
      success: false, 
      error: `Insufficient skill points. Required: ${cost}, Available: ${availablePoints}.` 
    };
  }

  // Check prerequisites
  const reqs = node.prerequis || [];
  if (reqs.length > 0) {
    const isUnlocked = (reqId) => unlockedSkills.includes(reqId);
    if (node.prerequis_logique === 'et') {
      const missing = reqs.filter(reqId => !isUnlocked(reqId));
      if (missing.length > 0) {
        return { 
          success: false, 
          error: `Missing required prerequisite skills: ${missing.join(', ')}.` 
        };
      }
    } else {
      // 'ou' or default logic: at least one prerequisite must be unlocked
      const satisfiesAtLeastOne = reqs.some(reqId => isUnlocked(reqId));
      if (!satisfiesAtLeastOne) {
        return { 
          success: false, 
          error: `At least one prerequisite skill required from: ${reqs.join(', ')}.` 
        };
      }
    }
  }

  const updatedUnlocked = [...unlockedSkills, nodeId];
  const updatedSpent = spentPoints + cost;

  return {
    success: true,
    node,
    unlockedSkills: JSON.stringify(updatedUnlocked),
    skillPoints: updatedSpent,
  };
}

module.exports = {
  getAllTrees,
  getNodeById,
  validateAndUnlockSkill,
};
