// État standard d'un combattant.
//
// Deux listes divergentes coexistaient dans l'interface : le suivi de combat en
// proposait 14, l'arène tactique 11. Trois états (Charmé, Assourdi, Incapable
// d'agir) étaient donc impossibles à poser depuis l'arène, sans que rien ne le
// signale. Une seule source de vérité désormais.
export const CONDITIONS_DND5E = [
  'Aveuglé',
  'Charmé',
  'Assourdi',
  'Effrayé',
  'Agrippé',
  "Incapable d'agir",
  'Invisible',
  'Paralysé',
  'Pétrifié',
  'Empoisonné',
  'À terre',
  'Entravé',
  'Étourdi',
  'Inconscient',
];

export default CONDITIONS_DND5E;
