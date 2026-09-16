/**
 * GM Helper - Hybrid Progression System
 * Calculates class levels based on invested points in skill trees.
 */
const fs = require('fs');
const path = require('path');
const { getProficiencyBonus } = require('./dnd5eMath');

let skillTreesCache = null;

function loadSkillTrees() {
  if (skillTreesCache) return skillTreesCache;
  
  skillTreesCache = [];
  const dirPath = path.join(__dirname, '../data/skill_trees');
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = fs.readFileSync(path.join(dirPath, file), 'utf8');
        try {
          skillTreesCache.push(JSON.parse(content));
        } catch (e) {
          console.error("Error parsing skill tree:", file, e);
        }
      }
    }
  }
  return skillTreesCache;
}

// Helper to find which tree a skill belongs to and its cost
function getSkillInfo(skillId) {
  const trees = loadSkillTrees();
  for (const treeWrapper of trees) {
    const tree = treeWrapper.arbre;
    for (const branch of tree.branches) {
      for (const node of branch.noeuds) {
        if (node.id === skillId) {
          return { treeId: tree.id, treeName: tree.nom, cost: node.cout_points || 1 };
        }
      }
    }
  }
  return null;
}

/**
 * Calculates derived classes based on unlocked skills.
 * @param {Array<string>} unlockedSkills Array of skill IDs
 * @returns {Object} Object containing derived classes and total level
 */
function calculateHybridProgression(unlockedSkills) {
  if (!Array.isArray(unlockedSkills)) {
    return { classes: [], totalLevel: 1 }; // Base level 1 if no skills
  }

  const pointsPerTree = {};
  const namesPerTree = {};

  // Sum points spent in each tree
  for (const skillId of unlockedSkills) {
    const info = getSkillInfo(skillId);
    if (info) {
      pointsPerTree[info.treeId] = (pointsPerTree[info.treeId] || 0) + info.cost;
      namesPerTree[info.treeId] = info.treeName;
    }
  }

  const classes = [];
  let totalLevel = 0;

  // Calculate level per tree. For instance: 1 level per 2 points spent.
  // If at least 1 point is spent, you are level 1.
  const POINTS_PER_LEVEL = 2;

  for (const [treeId, points] of Object.entries(pointsPerTree)) {
    // One level for the first point, then one more every POINTS_PER_LEVEL points.
    const level = Math.ceil(points / POINTS_PER_LEVEL);

    if (level > 0) {
      classes.push({
        id: treeId,
        name: namesPerTree[treeId],
        level: level,
        pointsInvested: points
      });
      totalLevel += level;
    }
  }

  // Ensure character is at least level 1
  if (totalLevel === 0) {
    totalLevel = 1;
  }

  return { classes, totalLevel };
}

/**
 * Derive every character statistic that depends on the unlocked skill trees.
 *
 * Unlocking a node used to update `unlockedSkills` and `skillPoints` but leave
 * `level` and `proficiencyBonus` untouched, so a player could spend points and
 * see no progression at all. Any write to `unlockedSkills` must go through this
 * helper so the derived values stay in sync.
 *
 * @param {Array<string>} unlockedSkills Array of unlocked node ids
 * @returns {{ level: number, proficiencyBonus: number, classes: Array }}
 */
function deriveProgression(unlockedSkills) {
  const { classes, totalLevel } = calculateHybridProgression(unlockedSkills);
  return {
    level: totalLevel,
    proficiencyBonus: getProficiencyBonus(totalLevel),
    classes,
  };
}

module.exports = {
  loadSkillTrees,
  calculateHybridProgression,
  deriveProgression,
};
