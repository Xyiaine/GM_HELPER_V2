// Corrige les couleurs de TEXTE heritees qui ne tiennent pas le contraste.
//
// Contexte : la direction artistique « Sel et rouille » a bascule l'interface
// sur un fond papier clair. Les couleurs Tailwind ecrites en dur a l'epoque du
// theme sombre sont restees : pensees pour un fond noir, elles tombent entre
// 1,7:1 et 3,6:1 sur le papier. Le texte bleu ciel de la liste des PNJ atteint
// 1,78:1 — il est litteralement illisible.
//
// Ce script remplace les couleurs de TEXTE par les jetons d'encre de la DA,
// calibres pour tenir 5:1 sur les trois fonds papier.
//
// Il ne touche QUE la propriete `color:` des objets de style JSX. Jamais
// `backgroundColor`, `borderColor`, `background`, `border` : ces couleurs-la
// servent d'aplats et sont correctes telles quelles.
//
// Les ilots sombres sont exclus : leur contenu est peint pour un fond noir,
// les assombrir le rendrait illisible.
//
// Usage :
//   node scripts/corriger_contraste_da.js            (simulation)
//   node scripts/corriger_contraste_da.js --appliquer
//   node scripts/corriger_contraste_da.js --icones   (inclut la prop color= des icones)

const fs = require('fs');
const path = require('path');

const APPLIQUER = process.argv.includes('--appliquer');
const ICONES = process.argv.includes('--icones');

const RACINE = path.join(__dirname, '..', 'client', 'src');

// Ilots sombres : fond noir assume, encres claires. On n'y touche pas.
const EXCLUS = [
  'courseDuSel',
  path.join('gm', 'MapManager.jsx'),
  path.join('gm', 'LocalMapManager.jsx'),
  path.join('gm', 'SkillTreeViewer.jsx'),
  path.join('table', 'TableScreenView.jsx'),
];

// Couleur heritee -> jeton d'encre de la DA.
const CORRESPONDANCE = {
  // Rouges -> danger
  '#ef4444': 'var(--danger-text)',
  '#f87171': 'var(--danger-text)',
  '#fca5a5': 'var(--danger-text)',
  '#fecaca': 'var(--danger-text)',
  '#dc2626': 'var(--danger-text)',
  '#b91c1c': 'var(--danger-text)',

  // Ambres et jaunes -> braise
  '#f59e0b': 'var(--ember-text)',
  '#fbbf24': 'var(--ember-text)',
  '#facc15': 'var(--ember-text)',
  '#fcd34d': 'var(--ember-text)',
  '#fef3c7': 'var(--ember-text)',
  '#d97706': 'var(--ember-text)',
  '#eab308': 'var(--ember-text)',

  // Verts -> reacteur
  '#10b981': 'var(--success-text)',
  '#34d399': 'var(--success-text)',
  '#4ade80': 'var(--success-text)',
  '#22c55e': 'var(--success-text)',
  '#059669': 'var(--success-text)',
  '#16a34a': 'var(--success-text)',

  // Bleus -> bleu artificiel
  '#60a5fa': 'var(--info-text)',
  '#38bdf8': 'var(--info-text)',
  '#3b82f6': 'var(--info-text)',
  '#93c5fd': 'var(--info-text)',
  '#0ea5e9': 'var(--info-text)',
  '#2563eb': 'var(--info-text)',

  // Violets -> arcane
  '#a78bfa': 'var(--arcane-text)',
  '#c084fc': 'var(--arcane-text)',
  '#8b5cf6': 'var(--arcane-text)',
  '#a855f7': 'var(--arcane-text)',

  // Indigo -> c'etait la couleur primaire du theme sombre ; elle devient rouille
  '#818cf8': 'var(--rust-text)',
  '#6366f1': 'var(--rust-text)',
  '#4f46e5': 'var(--rust-text)',

  // Gris ardoise -> encre attenuee
  '#94a3b8': 'var(--ink-muted)',
  '#9ca3af': 'var(--ink-muted)',
  '#cbd5e1': 'var(--ink-muted)',
  '#64748b': 'var(--ink-muted)',
  '#6b7280': 'var(--ink-muted)',
  '#d1d5db': 'var(--ink-muted)',
};

function estExclu(cheminComplet) {
  return EXCLUS.some((motif) => cheminComplet.includes(motif));
}

function parcourir(dossier, resultats = []) {
  for (const entree of fs.readdirSync(dossier, { withFileTypes: true })) {
    const complet = path.join(dossier, entree.name);
    if (entree.isDirectory()) {
      if (entree.name === 'node_modules') continue;
      parcourir(complet, resultats);
    } else if (/\.jsx?$/.test(entree.name)) {
      resultats.push(complet);
    }
  }
  return resultats;
}

// Remplace les couleurs de texte heritees par les jetons d'encre de la DA.
//
// Trois formes rencontrees dans le code :
//   1. `color: '#xxx'`                       — le cas direct
//   2. `color: cond ? '#xxx' : '#yyy'`       — un ternaire sur la meme ligne
//   3. `text: '#xxx'`                        — les tables de couleur des cartes
//
// La ligne n'est traitee que si elle porte une cle de couleur de TEXTE. C'est
// ce qui protege `backgroundColor`, `borderColor` et `background`, dont les
// valeurs doivent rester des aplats.
const CLE_TEXTE = /(^|[\s,{])text\s*:/;

function corriger(source) {
  let n = 0;
  const details = [];

  const remplacerHex = (hex) => {
    const jeton = CORRESPONDANCE[hex.toLowerCase()];
    if (!jeton) return null;
    n++;
    details.push(`${hex} -> ${jeton}`);
    return jeton;
  };

  source = source
    .split('\n')
    .map((ligne) => {
      // `color:` en minuscule, jamais `backgroundColor:` ni `borderColor:`.
      const porteColor = /(^|[^\w])color\s*:/.test(ligne);
      const porteText = CLE_TEXTE.test(ligne);
      if (!porteColor && !porteText) return ligne;

      return ligne.replace(/'(#[0-9a-fA-F]{3,6})'/g, (tout, hex) => {
        const jeton = remplacerHex(hex);
        return jeton ? `'${jeton}'` : tout;
      });
    })
    .join('\n');

  // Prop `color=` des icones Lucide (contraste non-textuel, seuil 3:1).
  if (ICONES) {
    source = source.replace(/(\bcolor=)"(#[0-9a-fA-F]{3,6})"/g, (tout, prefixe, hex) => {
      const jeton = remplacerHex(hex);
      return jeton ? `${prefixe}"${jeton}"` : tout;
    });
  }

  return { source, n, details };
}

const fichiers = parcourir(RACINE).filter((f) => !estExclu(f));
let total = 0;
let fichiersTouches = 0;
const parFichier = [];

for (const fichier of fichiers) {
  const avant = fs.readFileSync(fichier, 'utf8');
  const { source, n, details } = corriger(avant);
  if (n === 0) continue;

  total += n;
  fichiersTouches++;
  parFichier.push({ fichier: path.relative(RACINE, fichier), n, details });

  if (APPLIQUER) fs.writeFileSync(fichier, source, 'utf8');
}

parFichier.sort((a, b) => b.n - a.n);

console.log(APPLIQUER ? '=== APPLICATION ===' : '=== SIMULATION (aucune ecriture) ===');
console.log(`Jetons inclus : ${ICONES ? 'texte + icones' : 'texte seul'}`);
console.log(`${total} remplacements dans ${fichiersTouches} fichiers\n`);

for (const { fichier, n, details } of parFichier) {
  const compte = {};
  for (const d of details) compte[d] = (compte[d] || 0) + 1;
  const resume = Object.entries(compte).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([d, c]) => `${d}${c > 1 ? ' x' + c : ''}`).join(', ');
  console.log(`  ${String(n).padStart(3)}  ${fichier}`);
  console.log(`       ${resume}`);
}

console.log(`\nIlots sombres exclus : ${EXCLUS.join(', ')}`);
if (!APPLIQUER) console.log('\nRelancer avec --appliquer pour ecrire.');
