/**
 * Canon géographique du Bassin — source d'autorité unique.
 *
 * ── Pourquoi ce fichier existe ──────────────────────────────────────────────
 * La géographie du monde était auparavant décrite à DEUX endroits : `mapX`/`mapY`
 * en base, et une table latitude/longitude codée en dur dans `MapManager.jsx`.
 * Les deux ont divergé sans que rien ne le signale — le composant affichait
 * encore « Athènes » pour la Cité des Métaux alors que la base avait été
 * corrigée vers Malte. Deux sources pour une même vérité finissent toujours par
 * se contredire.
 *
 * Ce module inverse la relation : ce n'est PAS une seconde source de vérité.
 * C'est la source. La base contient des `mapX`/`mapY` qui en sont DÉRIVÉS à
 * l'initialisation, et le client ne fait que les lire.
 *
 * ── Ce qui vit ici et ce qui n'y vit pas ────────────────────────────────────
 * VIVENT ICI : le lieu réel associé à chaque cité, ses coordonnées GPS, et la
 * projection Mercator qui en découle. Ce sont des faits d'univers, ils ne
 * changent qu'avec le lore.
 *
 * NE VIVENT PAS ICI : la taille de la planche, le cadrage, le zoom, les
 * positions à l'écran. Ce sont des choix de rendu, ils appartiennent au client.
 * La projection reste exprimée en BASE 1200 — un référentiel mathématique, pas
 * une taille de fichier.
 *
 * Référence : `Cahier des charges/Corrections_positions_v2.md` § 4.5, et
 * `architecture et fonctionnement.md` § 7 pour la formule de projection.
 */

// CommonJS, comme le reste de `server/src` : le projet n'a pas de
// `"type": "module"` dans son package.json, un fichier ESM isolé obligerait
// Node à re-parser tout le graphe à chaque démarrage.
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// ── La projection ───────────────────────────────────────────────────────────

/**
 * Projection sphérique de Mercator, exprimée en base 1200.
 *
 * Les deux coefficients viennent du rapport de forme : le Bassin couvre
 * 38,4° de longitude, soit 1830 px en base 1200, d'où 47,63 px par degré.
 * L'ordonnée est multipliée par 1,400 (1 / cos 44,42°) parce que Mercator
 * étire les latitudes à mesure qu'on s'éloigne de l'équateur.
 *
 * Le point d'ancrage du X à longitude 0 tombe à 476,04 : c'est ce qui a
 * longtemps fait croire que l'origine de la carte était le bord ouest du
 * Bassin, alors qu'elle est à −10,0° de longitude. Une planche carrée de
 * 2048 px ne pouvait donc pas contenir l'emprise réelle (ratio 1,83).
 *
 * @param {number} lon  longitude en degrés (positif = est)
 * @param {number} lat  latitude en degrés (positif = nord)
 * @returns {{x: number, y: number}} coordonnées en base 1200
 */
function projeter(lon, lat) {
  return {
    x: 47.63 * lon + 476.04,
    y: -66.68 * lat + 3200.45,
  };
}

// ── Le canon ────────────────────────────────────────────────────────────────

/**
 * Les dix cités, indexées par leur nom tel qu'il est stocké en base
 * (`Location.name`). Le nom est la clé de rapprochement : `City` n'a pas de
 * champ `nom` propre, il vit sur la `Location` liée.
 *
 * `lieuReel` et `gps` sont des champs D'UNIVERS. Ils servent à la fois à
 * dériver les coordonnées et à les afficher dans l'interface du MJ — c'est
 * volontaire : afficher une valeur dérivée séparément de sa source est ce qui
 * produit les divergences.
 */
const CITES_CANON = {
  'BUNKER OMÉGA': {
    lieuReel: 'Genève',
    gps: '46.2044° N, 6.1432° E',
    lon: 6.1432,
    lat: 46.2044,
  },
  'CITÉ INDUSTRIELLE': {
    lieuReel: 'Turin',
    gps: '45.0703° N, 7.6869° E',
    lon: 7.6869,
    lat: 45.0703,
  },
  'CITÉ DU DIVERTISSEMENT': {
    lieuReel: 'Rome',
    gps: '41.9028° N, 12.4964° E',
    lon: 12.4964,
    lat: 41.9028,
  },
  'NUKE CITY': {
    lieuReel: 'Marseille',
    gps: '43.2965° N, 5.3698° E',
    lon: 5.3698,
    lat: 43.2965,
  },
  "CITÉ DE L'EAU & ALIMENTATION": {
    lieuReel: 'Camargue, delta du Rhône',
    gps: '43.5000° N, 4.6000° E',
    lon: 4.6,
    lat: 43.5,
  },
  'CITÉ DU CARBURANT': {
    lieuReel: 'Alger',
    gps: '36.7538° N, 3.0588° E',
    lon: 3.0588,
    lat: 36.7538,
  },
  "CITÉ DE L'ARMEMENT & DÉFENSE": {
    lieuReel: 'Gibraltar',
    gps: '36.1408° N, 5.3536° O',
    lon: -5.3536,
    lat: 36.1408,
  },
  "L'ILE DES ANCIENS": {
    lieuReel: 'Atlantique, à 200 km à l\'ouest du détroit de Gibraltar',
    gps: '36.0000° N, 8.5000° O',
    lon: -8.5,
    lat: 36.0,
  },
  // Corrigée d'Athènes vers Malte : Malte est le point le plus central du
  // Bassin (1 259 px de distance moyenne aux autres cités, contre 1 684 px
  // pour Athènes) — c'est ce que le lore demande à la Cité des Métaux.
  'CITÉ DES MÉTAUX & RECYCLAGE': {
    lieuReel: 'Malte',
    gps: '35.8989° N, 14.5146° E',
    lon: 14.5146,
    lat: 35.8989,
  },
  'CITÉ MÉDICALE': {
    lieuReel: 'Alexandrie',
    gps: '31.2001° N, 29.9187° E',
    lon: 29.9187,
    lat: 31.2001,
  },
};

/**
 * Renvoie la fiche canon d'une cité, ou `null` si elle n'est pas documentée.
 *
 * Le rapprochement tolère les écarts de casse, d'accents et d'apostrophes :
 * une cité créée par le MJ avec un nom légèrement différent ne doit pas se
 * retrouver sans géographie.
 *
 * @param {string} nom
 * @returns {object|null}
 */
function getCanonCite(nom) {
  if (!nom) return null;

  const normaliser = (s) =>
    String(s)
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // retire les accents
      .replace(/[''`]/g, "'") // unifie les apostrophes typographiques
      .replace(/\s+/g, ' ')
      .trim();

  const cible = normaliser(nom);

  for (const [cle, fiche] of Object.entries(CITES_CANON)) {
    if (normaliser(cle) === cible) return { nom: cle, ...fiche };
  }

  // Repli : inclusion, pour absorber les suffixes du type « (détruite) ».
  for (const [cle, fiche] of Object.entries(CITES_CANON)) {
    const k = normaliser(cle);
    if (cible.includes(k) || k.includes(cible)) return { nom: cle, ...fiche };
  }

  return null;
}

/**
 * Coordonnées de carte d'une cité, dérivées de son lieu réel.
 *
 * @param {string} nom
 * @returns {{mapX: number, mapY: number}|null}
 */
function getCoordonneesCarte(nom) {
  const fiche = getCanonCite(nom);
  if (!fiche) return null;
  const { x, y } = projeter(fiche.lon, fiche.lat);
  return { mapX: Math.round(x), mapY: Math.round(y) };
}

// ── Alignement de la base sur le canon ──────────────────────────────────────

/**
 * Écrit dans `City` les `mapX`/`mapY` dérivés du canon.
 *
 * Idempotent : les cités déjà conformes ne sont pas réécrites, ce qui rend la
 * fonction sûre à appeler à chaque démarrage du serveur. Les cités absentes du
 * canon (créées par le MJ) sont laissées intactes — c'est là tout l'intérêt
 * de conserver la table côté serveur plutôt que de la supprimer.
 *
 * `ecrire: false` permet de simuler : la fonction renvoie alors ce qu'elle
 * aurait fait sans rien modifier.
 *
 * @param {{ecrire?: boolean, journal?: boolean}} [options]
 * @returns {Promise<{alignees: string[], dejaBonnes: string[], inconnues: string[]}>}
 */
async function alignerPositionsCites(options = {}) {
  const { ecrire = true, journal = false } = options;

  const cites = await prisma.city.findMany({
    include: { location: { select: { name: true } } },
  });

  const alignees = [];
  const dejaBonnes = [];
  const inconnues = [];

  for (const cite of cites) {
    const nom = cite.location?.name;

    const coordonnees = nom ? getCoordonneesCarte(nom) : null;

    if (!coordonnees) {
      inconnues.push(nom ?? `(cité ${cite.id})`);
      continue;
    }

    const { mapX, mapY } = coordonnees;

    // Tolérance d'un demi-pixel : les valeurs dérivées sont arrondies, une
    // différence de 0,5 px n'est pas une divergence mais un arrondi.
    const conforme =
      cite.mapX != null &&
      cite.mapY != null &&
      Math.abs(cite.mapX - mapX) < 0.5 &&
      Math.abs(cite.mapY - mapY) < 0.5;

    if (conforme) {
      dejaBonnes.push(nom);
      continue;
    }

    if (ecrire) {
      await prisma.city.update({
        where: { id: cite.id },
        data: { mapX, mapY },
      });
    }
    alignees.push(nom);
  }

  if (journal && alignees.length > 0) {
    console.log(
      `[canon] ${ecrire ? 'positions alignées' : 'à aligner'} : ${alignees.join(', ')}`
    );
  }

  return { alignees, dejaBonnes, inconnues };
}

module.exports = {
  projeter,
  CITES_CANON,
  getCanonCite,
  getCoordonneesCarte,
  alignerPositionsCites,
  prismaCanon: prisma,
};
