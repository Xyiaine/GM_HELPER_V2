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

export function getModifier(score) {
  if (!score) return 0;
  return Math.floor((score - 10) / 2);
}

export function formatModifier(mod) {
  return mod >= 0 ? `+${mod}` : mod.toString();
}

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
