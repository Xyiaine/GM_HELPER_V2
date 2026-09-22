// Disposition des lieux sur les plans de ville, déduite du lore.
//
// ── Le problème ─────────────────────────────────────────────────────────────
// Les 9 lieux de chaque cité sont placés au HASARD à chaque chargement
// (`Math.random()` dans LocalMapManager.jsx:103-104), et ces positions ne sont
// jamais enregistrées. La disposition change donc à chaque rafraîchissement et
// le MJ ne peut pas s'y repérer.
//
// ── La méthode ──────────────────────────────────────────────────────────────
// On ne tire pas des coordonnées : on les DÉDUIT de la description du lieu,
// qui dit sa fonction réelle. Le nom seul ment souvent (« Casino de la Ruine »
// est une salle de jeu au centre-ville, pas une ruine isolée).
//
// ── Pourquoi pas des anneaux concentriques ──────────────────────────────────
// Le premier modèle rangeait les lieux en couronnes (centre / urbain /
// périphérie / extérieur). Il bute sur un cas réel : **Nuke City**, où quatre
// lieux sont tous « infrastructure centrale » (cœur du réacteur, zone de
// refroidissement, centre de recherche, dépôt de toxiques). En anneaux, ils
// s'empilent dans le même quadrant et les étiquettes se recouvrent.
//
// On découpe donc le plan en SECTEURS ANGULAIRES, un par fonction. Un lieu
// « ressource » et un lieu « production » ne peuvent pas se chevaucher, même
// s'ils sont tous deux centraux : ils sont dans des parts différentes du
// disque. Chaque secteur se subdivise en rayons si plusieurs lieux y tombent.
//
// ── Ce que le lore impose, et qu'on respecte ────────────────────────────────
// Nuke City n'a PAS de mur : « Il n'y a pas de mur. La zone est tellement
// irradiée que seuls les fous ou les mutants natifs osent s'y aventurer. »
// Le tronc commun est donc reconnu, jamais imposé : un lieu dont la
// description nie son existence est traité comme absent (il reste dans le
// plan, mais sans angle fixe, et il est signalé).

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// ── Le tronc commun ─────────────────────────────────────────────────────────
// Correspondance sur le nom ENTIER (`$`) : « Marché aux Alliages Rares » est
// un lieu propre à la Cité des Métaux, pas le Marché d'Échanges. Un motif trop
// large écraserait le vrai Marché commun.
const COMMUNS = [
  { cle: 'marche', motif: /^(le )?march[ée] d'[ée]changes$/i },
  { cle: 'citerne', motif: /^(la )?citerne centrale$/i },
  { cle: 'generateur', motif: /^(le )?g[ée]n[ée]rateur principal$/i },
  { cle: 'mur', motif: /^(le |les )?murs? d'enceinte( & les portes)?$/i },
  { cle: 'quartier', motif: /^(le )?quartier r[ée]sidentiel( \/ les taudis)?$/i },
];

// Décalage de l'anneau du tronc commun, en degrés.
//
// À 0°, le générateur (144°) et le mur (216°) sont symétriques par rapport à la
// verticale : même « wy », donc leurs étiquettes se superposent exactement — et
// comme l'anneau est identique dans toutes les cités, la collision se répétait
// dans les dix. Un décalage de 6° suffit à les écarter (écart vertical 0 → 14 px)
// tout en ne bougeant le Marché que de 8 px vers l'est, ce qui reste « plein
// nord » à l'œil : le repère de lecture est préservé.
const DECALAGE_COMMUN = 6;

// Secteur angulaire de chaque commun, en degrés depuis le nord (sens horaire).
// Fixes, donc identiques dans toutes les cités : un joueur qui connaît une
// cité sait lire les autres. Le Marché, tout en haut, sert de repère de lecture.
const SECTEUR_COMMUN = {
  marche: 0 + DECALAGE_COMMUN,
  citerne: 72 + DECALAGE_COMMUN,
  generateur: 144 + DECALAGE_COMMUN,
  mur: 216 + DECALAGE_COMMUN,
  quartier: 288 + DECALAGE_COMMUN,
};

// ── Les secteurs fonctionnels ───────────────────────────────────────────────
// Chaque fonction occupe une part FIXE du disque, identique dans toutes les
// cités : c'est ce qui permet de lire un plan qu'on ne connaît pas. Un lieu
// « eau » est toujours à l'est, un lieu « production » toujours au sud.
//
// Largeurs : 75° à 90° chacune, soit assez pour 3 lieux espacés (3 × 44 px de
// distance mini au rayon 0,30 demande ~50°). Les vides entre secteurs ne sont
// pas du gaspillage : ce sont les marges qui garantissent que deux étiquettes
// de secteurs voisins ne se touchent jamais.
const SECTEURS = {
  eau: { debut: 25, fin: 110 },
  production: { debut: 130, fin: 215 },
  defense: { debut: 235, fin: 310 },
  memoire: { debut: 330, fin: 55 },
};

// ── Les biens communs ───────────────────────────────────────────────────────
// Le spectacle, le marché, les lieux de rassemblement n'appartiennent à aucune
// faction : ce sont des biens communs. Les ranger dans un secteur les
// rattacherait à une fonction de la cité, ce qu'ils ne sont pas.
//
// Ils sont donc répartis SUR TOUT LE TOUR, à un rayon intermédiaire : ils
// occupent la ville sans la structurer. C'est ce qui distingue « bien commun »
// (partout, à personne) de « fonction » (un secteur, un usage).
const BIENS_COMMUNS = /ar[èe]ne|th[ée][âa]tre|casino|studios?|radiodiffusion|spectacle|festival|sc[èe]ne/i;

// Deux secteurs particuliers, traités à part.
//
// `coeur` n'occupe aucune part du disque : c'est le point central lui-même,
// réservé à l'objet autour duquel la cité s'organise (le réacteur de Nuke
// City, la raffinerie du Carburant). Un seul lieu par cité.
//
// `loin` est un rayon, pas un secteur : les lieux « hors les murs » sont
// répartis SUR TOUT LE TOUR, au rayon le plus grand, puisqu'ils sont dehors.
// Les confondre avec un secteur les faisait tomber à 180°, en collision avec
// la production.
const SECTEUR_COEUR = 'coeur';
const SECTEUR_LOIN = 'loin';

// Rayon de l'anneau des 5 communs, et rayons d'étagement dans un secteur.
const RAYON_COMMUN = 0.22;
const RAYONS_SECTEUR = {
  coeur: 0.08,
  proche: 0.36,
  moyen: 0.46,
  loin: 0.54,
};

// Les lieux « hors les murs » sont posés plus loin que tout le reste : ils ne
// sont pas dans la cité, ils l'entourent.
const RAYON_LOIN = RAYONS_SECTEUR.loin * 1.12;

// Les biens communs forment un anneau intermédiaire : dans la ville, mais
// sans appartenir à un secteur.
const RAYON_BIEN_COMMUN = RAYONS_SECTEUR.moyen * 0.92;

const CENTRE = 500;

// Distance minimale entre deux lieux d'une même cité, en unités de plan.
// 44 px laisse passer le libellé d'un marqueur sans qu'il recouvre son voisin.
const DISTANCE_MINI = 44;

// ── La règle de classement ──────────────────────────────────────────────────
// La DESCRIPTION passe avant le nom : elle dit la fonction réelle du lieu.
// L'ordre fixe la priorité — le motif « cœur / noyau / sanctuaire » passe
// AVANT les motifs de matière, sinon « Cœur du Réacteur » (dont le texte parle
// de « centrale ») tombe en périphérie au lieu de rester au centre.
//
// Les motifs sont écrits sur le vocabulaire RÉEL du lore (bassins, derricks,
// camions-citernes, pilleurs), pas sur des synonymes devinés : c'est en lisant
// les descriptions qu'on découvre les mots qui manquent.
const REGLES = [
  // Le cœur de la cité, l'objet autour duquel tout s'organise
  { motif: /coeur|cœur|noyau|sanctuaire/i, secteur: 'coeur' },

  // Eau et alimentation : puits, bassins, réserves, cultures
  { motif: /nappe phr[ée]atique|puits|distill|r[ée]serve d'eau|citerne centrale/i, secteur: 'eau' },
  { motif: /bassin|saum[âa]tre|filtration|purifi|dessalinisation/i, secteur: 'eau' },
  { motif: /serre|hydroponique|culture|champ|élev[ée]|b[ée]tail|enclos|r[ée]serve de semences/i, secteur: 'eau' },

  // Production : ce qui transforme, fabrique, extrait
  { motif: /fonderie|usine|assemblage|atelier|forge|raffinerie|recyclage|carri[èe]re/i, secteur: 'production' },
  { motif: /derrick|pomp(e|ent)|mine profonde|extraction/i, secteur: 'production' },
  { motif: /g[ée]n[ée]rateur|centrale|r[ée]acteur|piscine|refroidissement|recherche sur l'[ée]nergie/i, secteur: 'production' },
  { motif: /camions?-citernes?|convois?|hangar|garage/i, secteur: 'production' },

  // ── Hors les murs, explicitement ──────────────────────────────────────────
  // Ce bloc passe AVANT la défense et la production : un site décrit comme
  // extérieur l'est, même si son texte mentionne de la ferraille ou un dépôt.
  // « Cimetière des Gratte-Ciels » parle de « pilleurs de ferraille » — c'est
  // un champ de ruines, pas un entrepôt gardé.
  { motif: /hors les murs|à l'ext[ée]rieur|au-dehors|en dehors|hors de la cit[ée]/i, secteur: 'loin' },
  { motif: /caveau|sous-sol|enfoui|enterr|profond[ée]ment|for[êe]t de tours|champ de ruines|d[ée]sert|isol[ée]|pilleurs/i, secteur: 'loin' },

  // Défense, garde, stockage sensible
  { motif: /enceinte|rempart|muraille|digue|d[ée]fend|prot[èe]g(e|ent)|caserne|garde d'[ée]lite|milice/i, secteur: 'defense' },
  { motif: /sniper|haute(m ent)? s[ée]curis|sous haute garde|armes? lourdes/i, secteur: 'defense' },
  { motif: /d[ée]p[ôo]t|stock|entrep[ôo]t|citernes? souterraines?|ferraille|toxique|caustique/i, secteur: 'defense' },

  // Mémoire, savoir, soin : ce qui se transmet
  { motif: /laboratoire|clinique|h[ôo]pital|soin|virologie|m[ée]dicament|quarantaine/i, secteur: 'memoire' },
  { motif: /archive|donn[ée]es|compagnonnage|instruction|t[ée]l[ée]communication/i, secteur: 'memoire' },
  { motif: /banque m[ée]morielle|savoir|coordination/i, secteur: 'memoire' },
];

/**
 * Le tronc commun est reconnu par le nom du lieu, sans exception.
 *
 * On a un temps cru devoir écarter le Mur d'Enceinte de Nuke City, dont la
 * description dit « Il n'y a pas de mur ». C'était une erreur de lecture : la
 * phrase parle du RÉACTEUR, qui est à ciel ouvert faute d'enceinte de
 * confinement. L'enceinte de la VILLE, elle, est toujours debout. Un test de
 * négation sur le texte écartait donc un lieu qui existe — le même piège que
 * pour la Citerne de l'Île des Anciens (« sans aucun effort apparent »).
 *
 * Conclusion : le lore d'un lieu ne se déduit pas d'une phrase négative
 * trouvée dans sa description. Pas de test de négation.
 */

/** Reconnaît un lieu du tronc commun et renvoie sa clé, ou null. */
function cleCommune(nom) {
  const court = nom.includes(' - ') ? nom.split(' - ').slice(1).join(' - ') : nom;
  const trouve = COMMUNS.find((c) => c.motif.test(court.trim()));
  return trouve ? trouve.cle : null;
}

/** Nom court d'un lieu, sans le préfixe de sa cité. */
function nomCourt(nom) {
  return nom.includes(' - ') ? nom.split(' - ').slice(1).join(' - ') : nom;
}

/**
 * Classe un lieu PROPRE dans un secteur, d'après sa description puis son nom.
 * Renvoie `{ secteur, rayon }` — `rayon` permet d'étager deux lieux d'un même
 * secteur au lieu de les coller côte à côte.
 */
function classer(nom, description) {
  const court = nomCourt(nom);
  const desc = (description || '').replace(/\s+/g, ' ');

  for (const r of REGLES) {
    if (r.motif.test(desc)) return { secteur: r.secteur, source: 'desc:' + r.motif.source };
  }
  for (const r of REGLES) {
    if (r.motif.test(court)) return { secteur: r.secteur, source: 'nom:' + r.motif.source };
  }
  return { secteur: 'memoire', source: '(aucun, defaut)' };
}

/** Écart angulaire minimal entre deux angles, dans [0, 180]. */
function ecartAngle(a, b) {
  const d = (((a - b) % 360) + 360) % 360;
  return Math.min(d, 360 - d);
}

/**
 * Normalise les bornes d'un secteur qui franchit 0°.
 * « memoire » va de 330° à 55° : sa largeur réelle est 85°, pas −275°.
 */
function largeurSecteur(bornes) {
  const l = bornes.fin - bornes.debut;
  return l < 0 ? l + 360 : l;
}

/** Angle absolu pour une position relative `t` dans [0, 1] d'un secteur. */
function angleDans(bornes, t) {
  return (bornes.debut + largeurSecteur(bornes) * t + 360) % 360;
}

/** Point du plan pour un angle (degrés depuis le nord, horaire) et un rayon. */
function point(angleDeg, rayon) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    wx: Math.round(CENTRE + Math.cos(rad) * rayon * CENTRE),
    wy: Math.round(CENTRE + Math.sin(rad) * rayon * CENTRE),
  };
}

/**
 * Construit le plan d'UNE cité.
 *
 * Étapes :
 *  1. reconnaître les lieux du tronc commun présents (et éliminer ceux dont le
 *     lore dit qu'ils n'existent pas — le mur de Nuke City) ;
 *  2. les placer sur leur secteur fixe ;
 *  3. ranger les lieux propres par secteur, et les étager en rayons ;
 *  4. à l'intérieur d'un secteur, espacer les angles au maximum.
 */
function planifier(lieux) {
  const communs = [];
  const propres = [];

  lieux.forEach((e, i) => {
    const cle = cleCommune(e.name);
    const court = nomCourt(e.name);

    if (cle) {
      communs.push({ id: e.id, court, index: i, cle });
    } else {
      const c = classer(e.name, e.description);
      propres.push({ id: e.id, index: i, court, ...c });
    }
  });

  const places = new Map();

  // 1) Les communs — secteur absolu, identique dans toutes les cités.
  for (const c of communs) {
    const angle = SECTEUR_COMMUN[c.cle];
    const { wx, wy } = point(angle, RAYON_COMMUN);
    places.set(c.id, { ...c, angle, rayon: RAYON_COMMUN, pivot: true, wx, wy });
  }

  // 2) Les lieux propres — une bande angulaire par secteur, étagée en rayons.
  const parSecteur = new Map();
  for (const p of propres) {
    if (!parSecteur.has(p.secteur)) parSecteur.set(p.secteur, []);
    parSecteur.get(p.secteur).push(p);
  }

  // 2b) Les biens communs : répartis sur TOUT le tour, à un rayon intermédiaire.
  //     Arène, théâtre, casino, studios ne sont la propriété d'aucune faction :
  //     les ranger dans un secteur les rattacherait à une fonction de la cité.
  //     On les sème donc tout autour, en évitant les angles déjà pris.
  const biensCommuns = propres.filter((p) => BIENS_COMMUNS.test(p.court));
  const biensIds = new Set(biensCommuns.map((p) => p.id));
  for (const p of biensCommuns) {
    // Libelle « bien commun » et non « commun-autre » : ces lieux ne sont pas un
    // reliquat du tronc commun, ils forment un anneau a part entiere. Le nom de
    // la couronne sert aussi de titre de section dans le plan ecrit, donc il
    // doit dire ce qu'ils sont.
    p.secteur = 'bien-commun';
    p.source = 'bien-commun:' + (p.source || '');
  }

  biensCommuns.forEach((p, k) => {
    const angle = (55 + (360 * k) / Math.max(biensCommuns.length, 1)) % 360;
    const { wx, wy } = point(angle, RAYON_BIEN_COMMUN);
    places.set(p.id, { ...p, angle, rayon: RAYON_BIEN_COMMUN, pivot: false, wx, wy });
  });

  // 3a) Le cœur : un seul lieu, au centre exact. C'est l'objet autour duquel
  //     la cité s'organise. S'il y en a plusieurs, le premier garde le centre
  //     et les autres rejoignent leur secteur de repli.
  const coeurs = (parSecteur.get(SECTEUR_COEUR) || []).filter((p) => !biensIds.has(p.id));
  parSecteur.delete(SECTEUR_COEUR);
  coeurs.forEach((p, k) => {
    if (k === 0) {
      const { wx, wy } = point(0, 0);
      places.set(p.id, { ...p, angle: 0, rayon: 0, pivot: false, wx, wy, auCentre: true });
    } else {
      p.secteur = 'production';
      p.source = 'coeur-deborde:' + p.source;
      if (!parSecteur.has('production')) parSecteur.set('production', []);
      parSecteur.get('production').push(p);
    }
  });

  // 3b) Les lieux « hors les murs » : répartis sur tout le tour, au plus loin.
  //     Ils ne forment pas un secteur mais un anneau extérieur, puisqu'ils sont
  //     justement en dehors de la cité.
  const loins = (parSecteur.get(SECTEUR_LOIN) || []).filter((p) => !biensIds.has(p.id));
  parSecteur.delete(SECTEUR_LOIN);
  loins.forEach((p, k) => {
    const angle = (140 + (360 * k) / Math.max(loins.length, 1)) % 360;
    const { wx, wy } = point(angle, RAYON_LOIN);
    places.set(p.id, { ...p, angle, rayon: RAYON_LOIN, pivot: false, wx, wy });
  });

  // 3c) Les secteurs fonctionnels. Les biens communs sont exclus : ils ont déjà
  //     reçu leur angle à l'étape 2b, les replacer ici les ferait disparaître.
  const ordreSecteurs = Object.keys(SECTEURS);
  for (const secteur of ordreSecteurs) {
    const liste = (parSecteur.get(secteur) || []).filter((p) => !biensIds.has(p.id));
    if (!liste.length) continue;
    const bornes = SECTEURS[secteur];

    liste.forEach((p, k) => {
      // On étage les rayons quand plusieurs lieux partagent un secteur : le
      // 1er reste près du centre, les suivants s'éloignent. Sinon « production »
      // empile réacteur et refroidissement au même endroit.
      const rayons = [RAYONS_SECTEUR.proche, RAYONS_SECTEUR.moyen, RAYONS_SECTEUR.loin];
      const rayon = rayons[k % rayons.length];

      const angle = chercherAngle(
        angleDeSecteur(bornes, k, liste.length),
        angleVoisin(bornes, k, liste.length)
      );
      const { wx, wy } = point(angle, rayon);
      places.set(p.id, { ...p, angle, rayon, pivot: false, wx, wy });
    });
  }

  const proposition = lieux.map((e) => {
    const p = places.get(e.id);
    return {
      id: e.id,
      index: p.index,
      court: p.court,
      couronne: p.pivot ? 'commun' : p.secteur,
      motif: p.source || '(tronc commun)',
      pivot: !!p.pivot,
      wx: p.wx,
      wy: p.wy,
    };
  });

  proposition.sort((a, b) => a.index - b.index);

  // Contrôle : aucun lieu ne doit se superposer à un autre.
  const collisions = [];
  for (let i = 0; i < proposition.length; i++) {
    for (let j = i + 1; j < proposition.length; j++) {
      const d = Math.hypot(
        proposition[i].wx - proposition[j].wx,
        proposition[i].wy - proposition[j].wy
      );
      if (d < DISTANCE_MINI) {
        collisions.push({ a: proposition[i].court, b: proposition[j].court, d: Math.round(d) });
      }
    }
  }

  return { proposition, collisions };
}

/**
 * Angle de base pour le `k`-ième lieu d'un secteur : réparti régulièrement
 * sur la largeur RÉELLE du secteur, centré sur chaque part égale.
 */
function angleDeSecteur(bornes, k, total) {
  if (total <= 1) return angleDans(bornes, 0.5);
  return angleDans(bornes, (k + 0.5) / total);
}

/** Angle du voisin de gauche, pour vérifier qu'on ne se colle pas à lui. */
function angleVoisin(bornes, k, total) {
  if (k === 0) return null;
  return angleDeSecteur(bornes, k - 1, total);
}

/** Applique un décalage si l'angle proposé est trop proche du voisin. */
function chercherAngle(angle, voisin) {
  if (voisin === null || ecartAngle(angle, voisin) >= 18) return angle;
  return angle + (18 - ecartAngle(angle, voisin));
}

if (require.main === module) {
  (async () => {
    const cites = await prisma.location.findMany({
      where: { type: 'City-State' },
      include: { childLocations: { select: { id: true, name: true, description: true } } },
      orderBy: { name: 'asc' },
    });

    let totalLieux = 0;
    let totalCollisions = 0;
    const plan = {};

    for (const cite of cites) {
      const { proposition, collisions } = planifier(cite.childLocations);
      totalLieux += proposition.length;
      totalCollisions += collisions.length;
      plan[cite.name] = proposition;

      console.log('=== ' + cite.name + ' ===');
      for (const p of proposition) {
        console.log(
          '  ' +
            String(p.couronne).padEnd(11) +
            (p.pivot ? '* ' : '  ') +
            p.court.slice(0, 42).padEnd(44) +
            '(' + String(p.wx).padStart(4) + ', ' + String(p.wy).padStart(4) + ')'
        );
      }
      for (const c of collisions) {
        console.log('  COLLISION : ' + c.a + ' / ' + c.b + ' (' + c.d + ' px)');
      }
      console.log('');
    }

    console.log('cités :', cites.length, '| lieux :', totalLieux);
    console.log('collisions :', totalCollisions, totalCollisions === 0 ? '=> viable' : '=> a corriger');

    require('fs').writeFileSync(__dirname + '/plan-villes.json', JSON.stringify(plan, null, 2));
    console.log('plan écrit dans server/plan-villes.json');

    await prisma.$disconnect();
  })().catch(async (e) => {
    console.error('ÉCHEC :', e.message);
    await prisma.$disconnect();
    process.exit(1);
  });
}

module.exports = { planifier, classer, cleCommune, COMMUNS, SECTEURS, BIENS_COMMUNS };
