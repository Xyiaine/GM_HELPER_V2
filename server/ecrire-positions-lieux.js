// Écrit en base la disposition canon des lieux de ville.
//
// ── Pourquoi passer par la base ─────────────────────────────────────────────
// `LocalMapManager.jsx` stocke déjà les marqueurs dans
// `Location.notableFeatures` (JSON `{markers:[...]}`) et sait les relire. Le
// seul défaut était que leur position initiale venait de `Math.random()`.
//
// On se contente donc d'écrire une fois pour toutes les positions calculées
// par `proposer-plan-villes.js` dans le même champ : le client les lit sans
// rien changer. Pas de nouvelle route, pas de nouveau format.
//
// ── Les marqueurs existants sont préservés ──────────────────────────────────
// Un marqueur que le MJ a créé lui-même (un id qui n'est pas un lieu enfant)
// n'est jamais touché. On n'écrase que les marqueurs d'identifiant connu.

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const PLAN = JSON.parse(fs.readFileSync(path.join(__dirname, 'plan-villes.json'), 'utf8'));

// Une position du plan est en base 1000 (référentiel mathématique) ; le client
// travaille en base 1000 lui aussi, donc aucune conversion n'est nécessaire.
async function main() {
  const ecrire = process.argv.includes('--ecrire');

  const cites = await prisma.location.findMany({
    where: { type: 'City-State' },
    include: { childLocations: { select: { id: true, name: true } } },
    orderBy: { name: 'asc' },
  });

  let maj = 0;
  let deja = 0;
  let inconnues = 0;
  const rapport = [];

  for (const cite of cites) {
    const plan = PLAN[cite.name];
    if (!plan) {
      rapport.push({ cite: cite.name, statut: 'ABSENTE DU PLAN', lieux: 0 });
      continue;
    }

    // Marqueurs déjà enregistrés pour cette cité.
    let existants = [];
    try {
      existants = JSON.parse(cite.notableFeatures || '{}').markers || [];
    } catch (e) {
      existants = [];
    }

    const parId = new Map(existants.map((m) => [m.id, m]));
    const resultat = [];

    for (const enfant of cite.childLocations) {
      const p = plan.find((x) => x.id === enfant.id);
      const ancien = parId.get(enfant.id);

      if (!p) {
        inconnues++;
        // Un lieu enfant absent du plan garde sa position, ou en reçoit une
        // neutre : on ne le laisse jamais sans coordonnées.
        resultat.push(
          ancien || {
            id: enfant.id,
            wx: 500,
            wy: 500,
            label: enfant.name,
            color: '#10b981',
          }
        );
        continue;
      }

      const memePosition = ancien && ancien.wx === p.wx && ancien.wy === p.wy;
      if (memePosition) deja++;
      else maj++;

      resultat.push({
        ...(ancien || {}),
        id: enfant.id,
        wx: p.wx,
        wy: p.wy,
        label: enfant.name,
        color: ancien?.color || '#10b981',
        description: ancien?.description,
      });
    }

    // Les marqueurs créés par le MJ (id hors lieux enfants) sont conservés.
    const idsEnfants = new Set(cite.childLocations.map((c) => c.id));
    const perso = existants.filter((m) => !idsEnfants.has(m.id));

    const markers = [...resultat, ...perso];

    rapport.push({
      cite: cite.name,
      statut: 'PLANIFIE',
      lieux: resultat.length,
      perso: perso.length,
      apercu: resultat.slice(0, 2).map((m) => `${m.label} (${m.wx},${m.wy})`),
    });

    if (ecrire) {
      await prisma.location.update({
        where: { id: cite.id },
        data: { notableFeatures: JSON.stringify({ markers }) },
      });
    }
  }

  console.log(ecrire ? '=== ÉCRITURE ===' : '=== SIMULATION (ajouter --ecrire) ===');
  for (const r of rapport) {
    const extra = r.perso ? ` +${r.perso} marqueur(s) du MJ` : '';
    console.log('  ' + r.cite.padEnd(34) + r.statut.padEnd(18) + (r.lieux || 0) + ' lieux' + extra);
    if (r.apercu) for (const a of r.apercu) console.log('        ' + a);
  }
  console.log('');
  console.log('à mettre à jour :', maj, '| déjà conformes :', deja, '| lieux hors plan :', inconnues);

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error('ÉCHEC :', e.message);
  await prisma.$disconnect();
  process.exit(1);
});
