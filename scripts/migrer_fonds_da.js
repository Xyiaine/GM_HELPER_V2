// Migration des fonds codés en dur vers les jetons de la direction artistique.
//
// Ne touche QUE les propriétés de fond (background, backgroundColor,
// background-color). Les couleurs de texte, de bordure et d'icône ne sont pas
// concernées : elles suivent leurs propres règles et une conversion mécanique
// y ferait plus de dégâts que de bien.
//
// Usage :
//   node scripts/migrer_fonds_da.js            → simulation, n'écrit rien
//   node scripts/migrer_fonds_da.js --appliquer → écrit les fichiers

const fs = require('fs');
const path = require('path');

const RACINE = path.join(__dirname, '..', 'client', 'src');
const APPLIQUER = process.argv.includes('--appliquer');

// Exclusions.
//
// L'écran de table porte sa propre palette, autonome, et doit rester sombre
// puisqu'il est projeté dans une pièce éteinte.
//
// Le dossier de la Course du Sel est la table de jeu en cartes : 4 000 lignes
// et près de 500 couleurs écrites en dur, conçues comme un ensemble sombre et
// cohérent. Une conversion mécanique de ses fonds le casserait sans le
// convertir réellement. Il reste un îlot sombre assumé, à reprendre dans une
// passe dédiée. Son texte, lui, est aligné sur les jetons « encre sur sombre ».
const DOSSIERS_EXCLUS = ['courseDuSel'];
const FICHIERS_EXCLUS = ['TableScreenView.jsx'];

// Valeurs exclues : ce sont des zones de dessin (carte du monde, carte locale,
// arbre de compétences). Leur contenu est peint avec sa propre échelle de
// couleurs, qui deviendrait illisible sur un fond clair. Elles restent des
// panneaux sombres, comme des écrans d'instruments sur un bureau clair.
const VALEURS_EXCLUES = ['#030712', '#0f172a', '#111827', '#0f1118', '#0a0d14', '#0d111a', '#0c0e14', '#07090e'];

// Correspondances. L'ordre compte : les motifs les plus spécifiques d'abord.
const CORRESPONDANCES = [
  // ─── Encres translucides des accents ────────────────────────────────
  [/rgba\(\s*239\s*,\s*68\s*,\s*68\s*,\s*0\.0[0-9]+\s*\)/g, 'var(--danger-tint)'],
  [/rgba\(\s*239\s*,\s*68\s*,\s*68\s*,\s*0\.1[0-9]?\s*\)/g, 'var(--danger-tint)'],
  [/rgba\(\s*239\s*,\s*68\s*,\s*68\s*,\s*0\.2[0-9]?\s*\)/g, 'var(--danger-tint-strong)'],
  [/rgba\(\s*239\s*,\s*68\s*,\s*68\s*,\s*0\.3[0-9]?\s*\)/g, 'var(--danger-border)'],

  [/rgba\(\s*16\s*,\s*185\s*,\s*129\s*,\s*0\.0[0-9]+\s*\)/g, 'var(--success-tint)'],
  [/rgba\(\s*16\s*,\s*185\s*,\s*129\s*,\s*0\.1[0-9]?\s*\)/g, 'var(--success-tint)'],
  [/rgba\(\s*16\s*,\s*185\s*,\s*129\s*,\s*0\.2[0-9]?\s*\)/g, 'var(--success-tint-strong)'],
  [/rgba\(\s*34\s*,\s*197\s*,\s*94\s*,[^)]*\)/g, 'var(--success-tint-strong)'],
  [/rgba\(\s*52\s*,\s*211\s*,\s*153\s*,[^)]*\)/g, 'var(--success-tint)'],

  [/rgba\(\s*245\s*,\s*158\s*,\s*11\s*,\s*0\.0[0-9]+\s*\)/g, 'var(--warning-tint)'],
  [/rgba\(\s*245\s*,\s*158\s*,\s*11\s*,\s*0\.1[0-9]?\s*\)/g, 'var(--warning-tint)'],
  [/rgba\(\s*245\s*,\s*158\s*,\s*11\s*,\s*0\.2[0-9]?\s*\)/g, 'var(--warning-tint-strong)'],
  [/rgba\(\s*249\s*,\s*115\s*,\s*22\s*,[^)]*\)/g, 'var(--warning-tint-strong)'],
  [/rgba\(\s*234\s*,\s*179\s*,\s*8\s*,[^)]*\)/g, 'var(--warning-tint-strong)'],

  [/rgba\(\s*99\s*,\s*102\s*,\s*241\s*,\s*0\.0[0-9]+\s*\)/g, 'var(--primary-tint)'],
  [/rgba\(\s*99\s*,\s*102\s*,\s*241\s*,\s*0\.1[0-9]?\s*\)/g, 'var(--primary-tint-strong)'],
  [/rgba\(\s*99\s*,\s*102\s*,\s*241\s*,\s*0\.2[0-9]?\s*\)/g, 'var(--primary-tint-strong)'],
  [/rgba\(\s*99\s*,\s*102\s*,\s*241\s*,\s*0\.3[0-9]?\s*\)/g, 'var(--primary-border)'],

  [/rgba\(\s*59\s*,\s*130\s*,\s*246\s*,[^)]*\)/g, 'var(--info-tint)'],
  [/rgba\(\s*96\s*,\s*165\s*,\s*250\s*,[^)]*\)/g, 'var(--info-tint)'],
  [/rgba\(\s*56\s*,\s*189\s*,\s*248\s*,[^)]*\)/g, 'var(--info-tint)'],

  [/rgba\(\s*139\s*,\s*92\s*,\s*246\s*,[^)]*\)/g, 'var(--arcane-tint)'],
  [/rgba\(\s*168\s*,\s*85\s*,\s*247\s*,[^)]*\)/g, 'var(--arcane-tint-strong)'],
  [/rgba\(\s*167\s*,\s*139\s*,\s*250\s*,[^)]*\)/g, 'var(--arcane-tint)'],

  [/rgba\(\s*13\s*,\s*148\s*,\s*136\s*,[^)]*\)/g, 'var(--success-tint)'],

  // ─── Calques neutres ────────────────────────────────────────────────
  // Sur fond clair, un calque se teinte de brun, jamais de noir pur.
  [/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.0[0-9]+\s*\)/g, 'var(--overlay-subtle)'],
  [/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.1[0-9]?\s*\)/g, 'var(--overlay-soft)'],
  [/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.[2-9][0-9]?\s*\)/g, 'var(--overlay-medium)'],

  // Creux et champs de saisie
  [/rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\.1[0-9]?\s*\)/g, 'var(--paper-sunken)'],
  [/rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\.2[0-9]?\s*\)/g, 'var(--paper-sunken)'],
  [/rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\.3[0-9]?\s*\)/g, 'var(--paper-inset)'],
  [/rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\.[4-9][0-9]?\s*\)/g, 'var(--paper-inset)'],

  // ─── Aplats sombres opaques ─────────────────────────────────────────
  [/#1[ef]1[ef]1[ef]/gi, 'var(--paper-sunken)'],
  [/#1[ef]1[ef]1[ef]1[ef]/gi, 'var(--paper-sunken)'],
  [/#(222|2d2d2d|27272a|1f2937|18181b|1a1a1a)\b/gi, 'var(--paper-sunken)'],
  [/#353535\b/gi, 'var(--paper-inset)'],

  // ─── Boutons pleins ─────────────────────────────────────────────────
  [/#10b981\b/gi, 'var(--success)'],
  [/#ef4444\b/gi, 'var(--danger)'],
  [/#f59e0b\b/gi, 'var(--warning)'],
];

// Ne traite qu'une valeur qui suit immédiatement une propriété de fond.
//
// Trois motifs, parce qu'une valeur peut être entre guillemets simples, entre
// guillemets doubles, ou nue (CSS). Le premier jet utilisait une classe de
// caractères excluant la virgule : toutes les valeurs `rgba(...)` passaient au
// travers, soit la majorité des cas.
const MOTIFS_PROPRIETE = [
  /(background(?:Color|-color)?\s*:\s*)'([^'\n]+)'/g,
  /(background(?:Color|-color)?\s*:\s*)"([^"\n]+)"/g,
  /(background-color\s*:\s*)(#[0-9a-fA-F]{3,8})/g,
];

const rapport = [];
let totalRemplacements = 0;

function parcourir(dossier) {
  for (const entree of fs.readdirSync(dossier, { withFileTypes: true })) {
    const chemin = path.join(dossier, entree.name);
    if (entree.isDirectory()) {
      parcourir(chemin);
    } else if (/\.(jsx|js|css)$/.test(entree.name)) {
      traiter(chemin);
    }
  }
}

function traiter(chemin) {
  if (FICHIERS_EXCLUS.some((f) => chemin.endsWith(f))) return;
  if (DOSSIERS_EXCLUS.some((d) => chemin.includes(path.sep + d + path.sep))) return;

  const source = fs.readFileSync(chemin, 'utf8');
  let remplacements = 0;
  let resultat = source;

  for (const motif of MOTIFS_PROPRIETE) {
    resultat = resultat.replace(motif, (entier, prefixe, valeur) => {
      const brute = valeur.trim();

      // Les dégradés et les variables sont laissés intacts.
      if (brute.includes('gradient') || brute.startsWith('var(')) return entier;
      if (VALEURS_EXCLUES.some((v) => brute.toLowerCase().startsWith(v))) return entier;

      let convertie = brute;
      for (const [cherche, remplacement] of CORRESPONDANCES) {
        convertie = convertie.replace(cherche, remplacement);
      }

      if (convertie === brute) return entier;

      remplacements += 1;
      // Le guillemet d'origine est retrouvé dans le texte capturé.
      const quote = entier.includes(`'${valeur}'`) ? "'" : entier.includes(`"${valeur}"`) ? '"' : '';
      return `${prefixe}${quote}${convertie}${quote}`;
    });
  }

  if (remplacements > 0) {
    totalRemplacements += remplacements;
    rapport.push({ fichier: path.relative(RACINE, chemin), remplacements });
    if (APPLIQUER) fs.writeFileSync(chemin, resultat, 'utf8');
  }
}

parcourir(RACINE);

rapport.sort((a, b) => b.remplacements - a.remplacements);

console.log(APPLIQUER ? '=== MIGRATION APPLIQUÉE ===' : '=== SIMULATION — aucun fichier modifié ===');
console.log('');
for (const ligne of rapport) {
  console.log(String(ligne.remplacements).padStart(4), ' ', ligne.fichier);
}
console.log('');
console.log('Fichiers touchés :', rapport.length);
console.log('Remplacements    :', totalRemplacements);
if (!APPLIQUER) {
  console.log('');
  console.log('Relancer avec --appliquer pour écrire.');
}
