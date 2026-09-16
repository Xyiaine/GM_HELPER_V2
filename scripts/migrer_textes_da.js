// Deuxième passe de la migration DA : les textes devenus illisibles.
//
// La première passe a converti des fonds sombres en jetons clairs. Certains
// composants écrivaient en blanc par-dessus — ce qui donnait du blanc sur du
// blanc. Cette passe ne touche QUE ces cas précis.
//
// Règle appliquée : à l'intérieur d'un même objet `style={{ … }}`, si le fond
// est devenu une surface claire de la famille « papier », alors une couleur de
// texte très claire écrite en dur devient l'encre.
//
// Les textes clairs posés sur un aplat coloré (bouton rouge, badge vert) ne
// sont pas concernés : ils restent lisibles et doivent le rester.
//
// Usage :
//   node scripts/migrer_textes_da.js            → simulation
//   node scripts/migrer_textes_da.js --appliquer → écrit

const fs = require('fs');
const path = require('path');

const RACINE = path.join(__dirname, '..', 'client', 'src');
const APPLIQUER = process.argv.includes('--appliquer');

// Mêmes exclusions que la passe sur les fonds : ces surfaces restent sombres,
// leur texte clair est donc légitime.
const DOSSIERS_EXCLUS = ['courseDuSel'];
const FICHIERS_EXCLUS = ['TableScreenView.jsx'];

// Surfaces devenues claires.
const FONDS_CLAIRS = /var\(--(paper|paper-raised|paper-sunken|paper-inset|color-surface|color-background|bg-primary|bg-secondary|bg-tertiary|bg-hover)\b/;

// Textes très clairs, illisibles sur ces surfaces.
const TEXTE_CLAIR = /(color\s*:\s*)(['"])(#(?:fff|ffffff|f8fafc|f0f0f0|e5e7eb|f1f5f9|fafafa|d1d5db|e2e8f0)\b|white)\2/gi;

const rapport = [];
let total = 0;

function parcourir(dossier) {
  for (const entree of fs.readdirSync(dossier, { withFileTypes: true })) {
    const chemin = path.join(dossier, entree.name);
    if (entree.isDirectory()) parcourir(chemin);
    else if (/\.(jsx|js)$/.test(entree.name)) traiter(chemin);
  }
}

function traiter(chemin) {
  if (FICHIERS_EXCLUS.some((f) => chemin.endsWith(f))) return;
  if (DOSSIERS_EXCLUS.some((d) => chemin.includes(path.sep + d + path.sep))) return;

  const source = fs.readFileSync(chemin, 'utf8');
  let remplacements = 0;

  // On découpe sur les objets de style pour ne comparer que ce qui va ensemble.
  const resultat = source.replace(/style=\{\{[\s\S]*?\}\}/g, (bloc) => {
    if (!FONDS_CLAIRS.test(bloc)) return bloc;

    return bloc.replace(TEXTE_CLAIR, (entier, prefixe, quote) => {
      remplacements += 1;
      return `${prefixe}${quote}var(--ink)${quote}`;
    });
  });

  if (remplacements > 0) {
    total += remplacements;
    rapport.push({ fichier: path.relative(RACINE, chemin), remplacements });
    if (APPLIQUER) fs.writeFileSync(chemin, resultat, 'utf8');
  }
}

parcourir(RACINE);

rapport.sort((a, b) => b.remplacements - a.remplacements);

console.log(APPLIQUER ? '=== MIGRATION APPLIQUÉE ===' : '=== SIMULATION — aucun fichier modifié ===');
console.log('');
for (const l of rapport) console.log(String(l.remplacements).padStart(4), ' ', l.fichier);
console.log('');
console.log('Fichiers touchés :', rapport.length);
console.log('Remplacements    :', total);
if (!APPLIQUER) console.log('\nRelancer avec --appliquer pour écrire.');
