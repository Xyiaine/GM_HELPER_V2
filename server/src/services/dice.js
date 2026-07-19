// GM Helper — Dice Service
// Server-side dice computation (anti-cheat per Part H.5)

/**
 * Parse and roll a dice expression like "2d6+3", "1d20", "4d6kh3" (keep highest 3)
 * @param {string} expression - Dice expression
 * @returns {{ total: number, rolls: number[], expression: string, details: string }}
 */
function rollDice(expression) {
  const cleanExpr = expression.toLowerCase().replace(/\s+/g, '');

  // Match patterns like: 2d6, 1d20+5, 2d6+1d4+3, 4d6kh3
  const dicePattern = /(\d+)d(\d+)(?:k([hl])(\d+))?/g;
  const modifierPattern = /([+-]\d+)(?!d)/g;

  let total = 0;
  let allRolls = [];
  let details = [];
  let remaining = cleanExpr;

  // Roll each dice group
  let match;
  while ((match = dicePattern.exec(cleanExpr)) !== null) {
    const count = parseInt(match[1], 10);
    const sides = parseInt(match[2], 10);
    const keepType = match[3]; // 'h' or 'l'
    const keepCount = match[4] ? parseInt(match[4], 10) : null;

    if (count <= 0 || count > 100 || sides <= 0 || sides > 1000) {
      throw new Error('Invalid dice parameters');
    }

    const rolls = [];
    for (let i = 0; i < count; i++) {
      rolls.push(Math.floor(Math.random() * sides) + 1);
    }

    let keptRolls = [...rolls];
    if (keepType && keepCount) {
      const sorted = [...rolls].sort((a, b) => a - b);
      if (keepType === 'h') {
        keptRolls = sorted.slice(-keepCount);
      } else {
        keptRolls = sorted.slice(0, keepCount);
      }
    }

    const groupTotal = keptRolls.reduce((sum, r) => sum + r, 0);
    total += groupTotal;
    allRolls.push(...rolls);

    if (keepType && keepCount) {
      details.push(`${count}d${sides}k${keepType}${keepCount}[${rolls.join(',')}→${keptRolls.join(',')}]=${groupTotal}`);
    } else {
      details.push(`${count}d${sides}[${rolls.join(',')}]=${groupTotal}`);
    }
  }

  // Add flat modifiers
  let modMatch;
  // Remove dice parts to find remaining modifiers
  const withoutDice = cleanExpr.replace(dicePattern, '');
  while ((modMatch = modifierPattern.exec(withoutDice)) !== null) {
    const mod = parseInt(modMatch[1], 10);
    total += mod;
    details.push(`${mod >= 0 ? '+' : ''}${mod}`);
  }

  // Handle standalone number (no dice, just a modifier like "+5")
  if (allRolls.length === 0 && /^\d+$/.test(cleanExpr)) {
    total = parseInt(cleanExpr, 10);
    details.push(`${total}`);
  }

  return {
    total,
    rolls: allRolls,
    expression,
    details: details.join(' '),
  };
}

/**
 * Calculate ability modifier from ability score
 * @param {number} score - Ability score (1-30)
 * @returns {number} Modifier
 */
function abilityModifier(score) {
  return Math.floor((score - 10) / 2);
}

/**
 * Compute a dice roll based on character stats (for player rolls)
 * @param {object} character - Character data from DB
 * @param {object} rollRequest - { type, ability, skill, advantage, disadvantage }
 * @returns {{ total, rolls, expression, details, modifier, label }}
 */
function computeCharacterRoll(character, rollRequest) {
  const { type, ability, skill, advantage, disadvantage } = rollRequest;
  let modifier = 0;
  let label = '';
  let baseDice = '1d20';

  const profBonus = character.proficiencyBonus || 2;

  // Parse skills and saving throws from JSON
  let skills = {};
  let savingThrows = {};
  try { skills = character.skills ? JSON.parse(character.skills) : {}; } catch (e) { /* empty */ }
  try { savingThrows = character.savingThrows ? JSON.parse(character.savingThrows) : {}; } catch (e) { /* empty */ }

  const abilityScores = {
    strength: character.strength,
    dexterity: character.dexterity,
    constitution: character.constitution,
    intelligence: character.intelligence,
    wisdom: character.wisdom,
    charisma: character.charisma,
  };

  // Skill → ability mapping (D&D 5e standard)
  const skillAbilityMap = {
    acrobatics: 'dexterity',
    animal_handling: 'wisdom',
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
    sleight_of_hand: 'dexterity',
    stealth: 'dexterity',
    survival: 'wisdom',
  };

  switch (type) {
    case 'ability_check': {
      if (!ability || !abilityScores[ability]) {
        throw new Error('Valid ability required for ability check');
      }
      modifier = abilityModifier(abilityScores[ability]);
      label = `${ability.charAt(0).toUpperCase() + ability.slice(1)} Check`;
      break;
    }
    case 'saving_throw': {
      if (!ability || !abilityScores[ability]) {
        throw new Error('Valid ability required for saving throw');
      }
      modifier = abilityModifier(abilityScores[ability]);
      if (savingThrows[ability]) {
        modifier += profBonus;
      }
      label = `${ability.charAt(0).toUpperCase() + ability.slice(1)} Saving Throw`;
      break;
    }
    case 'skill_check': {
      if (!skill || !skillAbilityMap[skill]) {
        throw new Error('Valid skill required for skill check');
      }
      const linkedAbility = skillAbilityMap[skill];
      modifier = abilityModifier(abilityScores[linkedAbility]);
      if (skills[skill]) {
        modifier += profBonus;
      }
      const skillName = skill.replace(/_/g, ' ');
      label = `${skillName.charAt(0).toUpperCase() + skillName.slice(1)} Check`;
      break;
    }
    case 'attack': {
      // Default attack: STR-based, player can override
      const attackAbility = ability || 'strength';
      modifier = abilityModifier(abilityScores[attackAbility]) + profBonus;
      label = `Attack Roll (${attackAbility})`;
      break;
    }
    case 'damage': {
      // Free expression for damage, just roll
      const expr = rollRequest.expression || '1d6';
      const result = rollDice(expr);
      return { ...result, modifier: 0, label: rollRequest.label || 'Damage' };
    }
    case 'initiative': {
      modifier = abilityModifier(abilityScores.dexterity) + (character.initiative || 0);
      label = 'Initiative';
      break;
    }
    case 'free': {
      const expr = rollRequest.expression || '1d20';
      const result = rollDice(expr);
      return { ...result, modifier: 0, label: rollRequest.label || 'Free Roll' };
    }
    default:
      throw new Error(`Unknown roll type: ${type}`);
  }

  // Handle advantage/disadvantage (roll 2d20, keep highest/lowest)
  if (advantage && !disadvantage) {
    baseDice = '2d20kh1';
    label += ' (Advantage)';
  } else if (disadvantage && !advantage) {
    baseDice = '2d20kl1';
    label += ' (Disadvantage)';
  }

  // Roll the dice
  const diceResult = rollDice(baseDice);
  const total = diceResult.total + modifier;

  return {
    total,
    rolls: diceResult.rolls,
    expression: `${baseDice}${modifier >= 0 ? '+' : ''}${modifier}`,
    details: `${diceResult.details} ${modifier >= 0 ? '+' : ''}${modifier} = ${total}`,
    modifier,
    label: rollRequest.label || label,
  };
}

module.exports = {
  rollDice,
  abilityModifier,
  computeCharacterRoll,
};
