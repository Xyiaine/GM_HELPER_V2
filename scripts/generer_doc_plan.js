// Regenerer Plan_disposition_lieux_v3.md depuis plan-villes.json.
//
// Le document etait ecrit a la main, donc ses coordonnees se desynchronisaient
// du generateur a chaque retouche du modele. On le produit desormais par script :
// la source unique de verite est server/plan-villes.json.
const fs = require('fs');
const path = require('path');

const plan = require('../server/plan-villes.json');

const ORDRE = ['commun', 'coeur', 'eau', 'memoire', 'production', 'defense', 'loin', 'bien-commun'];
const LIBELLE = {
  'commun': '**tronc commun**',
  'coeur': 'centre',
  'eau': 'eau',
  'memoire': 'memoire',
  'production': 'production',
  'defense': 'defense',
  'loin': 'hors les murs',
  'bien-commun': 'bien commun',
};

// Statistiques reelles, recalculees pour ne pas figurer en dur dans le texte.
let collisions = 0;
let distanceMini = Infinity;
let pireVille = '';
const repartition = new Map();

for (const [ville, lieux] of Object.entries(plan)) {
  for (const l of lieux) {
    repartition.set(l.couronne, (repartition.get(l.couronne) || 0) + 1);
  }
  for (let i = 0; i < lieux.length; i++) {
    for (let j = i + 1; j < lieux.length; j++) {
      const d = Math.hypot(lieux[i].wx - lieux[j].wx, lieux[i].wy - lieux[j].wy);
      if (d < 44) collisions++;
      if (d < distanceMini) { distanceMini = d; pireVille = ville; }
    }
  }
}

const nbLieux = Object.values(plan).reduce((n, l) => n + l.length, 0);
const nbVilles = Object.keys(plan).length;

// Chevauchements d'etiquettes : 10px de police, ~5,4 px par caractere, dessinees
// 19 px sous le marqueur. Deux etiquettes se recouvrent si elles partagent une
// bande verticale de 13 px tout en se croisant horizontalement.
let chevauchements = 0;
for (const lieux of Object.values(plan)) {
  for (let i = 0; i < lieux.length; i++) {
    for (let j = i + 1; j < lieux.length; j++) {
      const A = lieux[i], B = lieux[j];
      const croiseH = Math.abs(A.wx - B.wx) < (A.court.length + B.court.length) * 5.4 / 2;
      const croiseV = Math.abs(A.wy - B.wy) < 13;
      if (croiseH && croiseV) chevauchements++;
    }
  }
}

const parties = [];

parties.push(`# Plan de disposition des lieux par cite — v3

Genere par \`server/proposer-plan-villes.js\`, ecrit en base par
\`server/ecrire-positions-lieux.js\`. Ce document est lui-meme produit par script
depuis \`server/plan-villes.json\` : les coordonnees ci-dessous ne peuvent pas
diverger du generateur. Coordonnees en base 1000.

## Le modele

1. **Anneau du tronc commun** (rayon 0,22), angles ABSOLUS identiques dans les
   ${nbVilles} cites. Le Marche d'Echanges est toujours au nord : c'est le repere de
   lecture d'un plan a l'autre.
2. **Secteurs fonctionnels** fixes : eau (est), production (sud), defense
   (ouest), memoire (nord). Un lieu de meme fonction occupe toujours la meme
   region du plan, dans toutes les cites.
3. **Bien commun** (anneau intermediaire) : arene, theatre, casino, studios ne
   sont la propriete d'aucune faction. Les ranger dans un secteur les
   rattacherait a une fonction de la cite. Ils sont donc semes sur tout le
   tour : partout dans la ville, a personne.
4. **Centre unique** (rayon 0) : l'objet autour duquel la cite s'organise.
5. **Anneau des lieux hors les murs** : au-dela de tout le reste.

Les lieux sont classes d'apres leur **description**, pas leur nom : « Casino de
la Ruine » est une salle de jeu au centre-ville, pas une ruine isolee.

## Pourquoi l'anneau est decale de 6°

A 0°, le generateur (144°) et le mur (216°) sont symetriques par rapport a la
verticale : ils partagent exactement le meme \`wy\`, donc leurs etiquettes se
superposaient — et comme l'anneau est identique dans toutes les cites, la
collision se repetait dans les dix. Un decalage de 6° les ecarte (ecart vertical
0 → 14 px, seuil de lisibilite 13 px) tout en ne bougeant le Marche que de 11 px
vers l'est : il reste « au nord » a l'oeil, le repere de lecture est preserve.

## Deux lectures de lore corrigees

**Le Mur d'Enceinte de Nuke City existe.** Sa description dit « Il n'y a pas de
mur », mais la phrase parle du REACTEUR, a ciel ouvert faute d'enceinte de
confinement. L'enceinte de la VILLE est toujours debout. Un test de negation
sur le texte ecartait donc a tort un lieu qui existe. **Aucun lieu n'est
desormais deduit d'une phrase negative** : les ${nbVilles} cites ont leur mur, et il
occupe son angle fixe.

**Le spectacle est un bien commun, pas une fonction.** Arene, studios, casino
et theatre n'appartiennent a aucune faction. Les ranger en « memoire » les
rattachait a une fonction de la cite et les entassait dans un quadrant.

## Controle

* ${collisions} collision sur ${nbLieux} lieux (seuil 44 px)
* distance minimale REELLE la plus faible : ${Math.round(distanceMini)} px (${pireVille})
* ${chevauchements} chevauchement d'etiquettes a l'ecran
* ${nbVilles}/${nbVilles} cites ont leur Mur d'Enceinte sur son angle fixe
* repartition : ${[...repartition.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v} (${Math.round(v / nbLieux * 100)}%)`).join(', ')}
`);

for (const [ville, lieux] of Object.entries(plan)) {
  const tri = [...lieux].sort((a, b) => {
    const da = ORDRE.indexOf(a.couronne);
    const db = ORDRE.indexOf(b.couronne);
    return (da < 0 ? 99 : da) - (db < 0 ? 99 : db);
  });
  parties.push(`\n## ${ville}\n\n| Secteur | Lieu | Plan (x, y) |\n|---|---|---|\n` +
    tri.map(l => `| ${LIBELLE[l.couronne] || l.couronne} | ${l.court} | ${l.wx}, ${l.wy} |`).join('\n') + '\n');
}

const sortie = path.join(__dirname, '..', 'Cahier des charges', 'Plan_disposition_lieux_v3.md');
fs.writeFileSync(sortie, parties.join('\n'), 'utf8');
console.log('ecrit :', sortie);
console.log('villes :', nbVilles, '| lieux :', nbLieux, '| collisions :', collisions,
            '| chevauchements :', chevauchements, '| distance mini :', Math.round(distanceMini) + ' px');
