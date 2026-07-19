/**
 * GM Helper - D&D 5e Math Utilities
 * Used to calculate derived statistics on the server side to prevent client tampering.
 */

// Calculate ability modifier from score
function getAbilityModifier(score) {
  if (typeof score !== 'number' || isNaN(score)) return 0;
  return Math.floor((score - 10) / 2);
}

// Calculate proficiency bonus based on total level
function getProficiencyBonus(totalLevel) {
  if (typeof totalLevel !== 'number' || isNaN(totalLevel) || totalLevel < 1) return 2;
  return Math.ceil(1 + (totalLevel / 4));
}

// Calculate saving throw modifier
function getSavingThrowModifier(score, isProficient, totalLevel) {
  const mod = getAbilityModifier(score);
  const pb = isProficient ? getProficiencyBonus(totalLevel) : 0;
  return mod + pb;
}

// Calculate skill modifier (0: none, 1: proficient, 2: expertise)
function getSkillModifier(score, proficiencyLevel, totalLevel) {
  const mod = getAbilityModifier(score);
  let pb = 0;
  if (proficiencyLevel === 1) {
    pb = getProficiencyBonus(totalLevel);
  } else if (proficiencyLevel === 2) {
    pb = getProficiencyBonus(totalLevel) * 2;
  }
  return mod + pb;
}

// Map 5e skills to their base ability
const SKILL_ABILITY_MAP = {
  acrobatics: 'dexterity',
  animalHandling: 'wisdom',
  arcana: 'intelligence',
  athletics: 'strength',
  deception: 'charisma',
  history: 'intelligence',
  insight: 'wisdom',
  intimidation: 'charisma',
  investigation: 'intelligence',
  medicine: 'wisdom',
  nature: 'intelligence',
  perception: 'wisdom',
  performance: 'charisma',
  persuasion: 'charisma',
  religion: 'intelligence',
  sleightOfHand: 'dexterity',
  stealth: 'dexterity',
  survival: 'wisdom',
};

// Calculate all skill modifiers given character abilities and skill proficiencies
function calculateAllSkills(character, totalLevel) {
  const calculatedSkills = {};
  
  let parsedSkills = {};
  if (character.skills) {
    try {
      parsedSkills = typeof character.skills === 'string' ? JSON.parse(character.skills) : character.skills;
    } catch (e) {
      console.warn("Failed to parse skills", e);
    }
  }

  for (const [skillName, abilityName] of Object.entries(SKILL_ABILITY_MAP)) {
    const score = character[abilityName] || 10;
    const profLevel = parsedSkills[skillName] || 0; // 0, 1, or 2
    calculatedSkills[skillName] = {
      modifier: getSkillModifier(score, profLevel, totalLevel),
      proficiencyLevel: profLevel,
      ability: abilityName
    };
  }

  return calculatedSkills;
}

// Calculate vehicle dynamic stats based on installed parts
function calculateVehicleStats(vehicleBase, parts) {
  let ac = vehicleBase.acBase || 10;
  let hpMax = vehicleBase.hpMaxBase || 50;
  let speed = vehicleBase.speedBase || 40;

  for (const part of parts) {
    if (!part || !part.modifiers) continue;
    try {
      const mods = typeof part.modifiers === 'string' ? JSON.parse(part.modifiers) : part.modifiers;
      // Depending on condition, we could reduce the bonus, but for now we apply it raw
      if (mods.acBonus) ac += mods.acBonus;
      if (mods.hpBonus) hpMax += mods.hpBonus;
      if (mods.speedBonus) speed += mods.speedBonus;
    } catch (e) {
      console.warn("Failed to parse vehicle part modifiers", e);
    }
  }

  return { ac, hpMax, speed };
}

module.exports = {
  getAbilityModifier,
  getProficiencyBonus,
  getSavingThrowModifier,
  getSkillModifier,
  SKILL_ABILITY_MAP,
  calculateAllSkills,
  calculateVehicleStats
};
