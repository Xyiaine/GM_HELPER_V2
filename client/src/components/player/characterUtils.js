export const SKILLS_LIST = [
  { id: 'acrobatics', label: 'Acrobaties', ability: 'dexterity' },
  { id: 'animalHandling', label: 'Dressage', ability: 'wisdom' },
  { id: 'arcana', label: 'Arcanes', ability: 'intelligence' },
  { id: 'athletics', label: 'Athlétisme', ability: 'strength' },
  { id: 'deception', label: 'Tromperie', ability: 'charisma' },
  { id: 'history', label: 'Histoire', ability: 'intelligence' },
  { id: 'insight', label: 'Intuition', ability: 'wisdom' },
  { id: 'intimidation', label: 'Intimidation', ability: 'charisma' },
  { id: 'investigation', label: 'Investigation', ability: 'intelligence' },
  { id: 'medicine', label: 'Médecine', ability: 'wisdom' },
  { id: 'nature', label: 'Nature', ability: 'intelligence' },
  { id: 'perception', label: 'Perception', ability: 'wisdom' },
  { id: 'performance', label: 'Représentation', ability: 'charisma' },
  { id: 'persuasion', label: 'Persuasion', ability: 'charisma' },
  { id: 'religion', label: 'Religion', ability: 'intelligence' },
  { id: 'sleightOfHand', label: 'Escamotage', ability: 'dexterity' },
  { id: 'stealth', label: 'Discrétion', ability: 'dexterity' },
  { id: 'survival', label: 'Survie', ability: 'wisdom' }
];

export const ABILITIES_LIST = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];

export function calculateInvestedPoints(character) {
  let totalCost = 0;
  for (const stat of ABILITIES_LIST) {
    const val = character[stat] || 10;
    if (val >= 10) {
      totalCost += (val - 10);
    } else {
      totalCost += (val - 10) / 2;
    }
  }
  return totalCost;
}

export function getModifier(score) {
  if (!score) return 0;
  return Math.floor((score - 10) / 2);
}

export function formatModifier(mod) {
  return mod >= 0 ? `+${mod}` : mod.toString();
}

export function getProficiencyBonus(level) {
  const lvl = level || 1;
  return Math.ceil(1 + (lvl / 4));
}

export function calculateCarryCapacity(strength) {
  return (strength || 10) * 7.5; // Capacité normale en kg (15 x Force en livres = 7.5 kg)
}

export function calculateTotalWeight(inventoryItems) {
  if (!Array.isArray(inventoryItems)) return 0;
  return inventoryItems.reduce((acc, itemRow) => {
    const weight = itemRow.item?.weight || 0;
    const qty = itemRow.quantity || 1;
    return acc + (weight * qty);
  }, 0);
}

export function parseCurrency(currencyJson) {
  const defaultCurrency = { cp: 0, sp: 0, gp: 0, pp: 0 };
  if (!currencyJson) return defaultCurrency;
  try {
    const parsed = typeof currencyJson === 'string' ? JSON.parse(currencyJson) : currencyJson;
    return { ...defaultCurrency, ...parsed };
  } catch (e) {
    return defaultCurrency;
  }
}

export function parseAttacks(attacksJson) {
  if (!attacksJson) return [];
  try {
    const parsed = typeof attacksJson === 'string' ? JSON.parse(attacksJson) : attacksJson;
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

export function parseDeathSaves(deathSavesJson) {
  const defaultSaves = { successes: 0, failures: 0 };
  if (!deathSavesJson) return defaultSaves;
  try {
    const parsed = typeof deathSavesJson === 'string' ? JSON.parse(deathSavesJson) : deathSavesJson;
    return {
      successes: Math.max(0, Math.min(3, parseInt(parsed.successes) || 0)),
      failures: Math.max(0, Math.min(3, parseInt(parsed.failures) || 0))
    };
  } catch (e) {
    return defaultSaves;
  }
}

export function parseHitDice(hitDiceJson, level = 1) {
  const defaultDice = { dieType: 'd10', total: level, used: 0 };
  if (!hitDiceJson) return defaultDice;
  try {
    const parsed = typeof hitDiceJson === 'string' ? JSON.parse(hitDiceJson) : hitDiceJson;
    return {
      dieType: parsed.dieType || 'd10',
      total: parsed.total !== undefined ? parsed.total : level,
      used: parsed.used || 0
    };
  } catch (e) {
    return defaultDice;
  }
}

export function parseRoleplayTraits(traitsJson) {
  const defaultTraits = { personality: '', ideals: '', bonds: '', flaws: '' };
  if (!traitsJson) return defaultTraits;
  try {
    const parsed = typeof traitsJson === 'string' ? JSON.parse(traitsJson) : traitsJson;
    if (typeof parsed === 'object' && !Array.isArray(parsed)) {
      return { ...defaultTraits, ...parsed };
    }
    return defaultTraits;
  } catch (e) {
    return defaultTraits;
  }
}
