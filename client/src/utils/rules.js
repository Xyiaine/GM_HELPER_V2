// Référentiel de règles partagé entre l'interface joueur et l'interface MJ.
//
// Ces listes vivaient dans `components/player/characterUtils.js`, ce qui
// obligeait l'interface du MJ à importer depuis le dossier du joueur. Elles
// sont désormais au même endroit que le reste des règles communes, comme
// `utils/conditions.js`.

// Les identifiants sont en camelCase : c'est ce que le serveur attend depuis
// la correction de `services/dice.js`, et ce qui est réellement stocké dans le
// champ JSON `skills` des personnages.
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
  { id: 'survival', label: 'Survie', ability: 'wisdom' },
];

export const ABILITIES_LIST = [
  'strength',
  'dexterity',
  'constitution',
  'intelligence',
  'wisdom',
  'charisma',
];

export const ABILITY_LABELS = {
  strength: 'Force',
  dexterity: 'Dextérité',
  constitution: 'Constitution',
  intelligence: 'Intelligence',
  wisdom: 'Sagesse',
  charisma: 'Charisme',
};

export function abilityLabel(key) {
  return ABILITY_LABELS[key] || key;
}

export function skillLabel(id) {
  const found = SKILLS_LIST.find((s) => s.id === id);
  return found ? found.label : id;
}
