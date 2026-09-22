/**
 * Répare les étapes de quête pointant vers des entités « stub ».
 *
 * ── Le problème ─────────────────────────────────────────────────────────────
 * Certaines entités de lieu existent en DOUBLE : une version nommée
 * correctement (« Le Cimetière des Convois », décrite), et une version en
 * minuscules, vide, créée par un autre chemin de code (« cimetiere des
 * convois »). Les liens de quête pointent parfois vers le stub et non vers
 * l'entité réelle — si bien que « La Course du Sel » perd deux de ses sept
 * étapes dans l'interface, alors qu'elles existent et sont renseignées.
 *
 * ── Le correctif ────────────────────────────────────────────────────────────
 * Reparenter chaque `QuestLocationLink` du stub vers l'entité réelle, en
 * conservant son `role`, puis supprimer le stub. Le reparentage est explicite,
 * entité par entité : aucune correspondance n'est devinée automatiquement, car
 * une erreur ici déplacerait une étape de quête vers le mauvais lieu.
 *
 * Usage :  node reparer-liens-lieux.js            -> simulation, n'écrit rien
 *          node reparer-liens-lieux.js --ecrire   -> applique
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const ECRIRE = process.argv.includes('--ecrire');

/**
 * Table explicite : id du stub -> id de l'entité réelle à lui substituer.
 * Écrite à la main, volontairement : un rapprochement par nom normalisé
 * pourrait confondre deux lieux distincts qui ne diffèrent que par la casse.
 */
const CORRESPONDANCES = [
  {
    stubId: 'cms7blqr2002put0cbudltsix', // "cite du divertissement" (region, vide)
    stubNom: 'cite du divertissement',
    reelId: 'cmrakek8q00etut180995hvvl', // "CITÉ DU DIVERTISSEMENT" (City-State, 9 sous-lieux)
    reelNom: "CITÉ DU DIVERTISSEMENT",
  },
  {
    stubId: 'cms7blqqs002lut0c0si3vkmf', // "cimetiere des convois" (region, vide)
    stubNom: 'cimetiere des convois',
    reelId: 'cmrvv1z1f002put44ol90tanj', // "Le Cimetière des Convois" (region, décrit)
    reelNom: 'Le Cimetière des Convois',
  },
];

/** Résout les id manquants par recherche sur le nom, sans deviner. */
async function completerCorrespondances() {
  for (const c of CORRESPONDANCES) {
    if (!c.stubId) {
      const s = await prisma.location.findFirst({ where: { name: c.stubNom } });
      c.stubId = s?.id ?? null;
    }
    if (!c.reelId) {
      const r = await prisma.location.findFirst({ where: { name: c.reelNom } });
      c.reelId = r?.id ?? null;
    }
  }
}

(async () => {
  await completerCorrespondances();

  console.log(ECRIRE ? '=== APPLICATION ===' : '=== SIMULATION (rien ne sera écrit) ===');
  console.log('');

  let aTraiter = 0;
  const plan = [];

  for (const c of CORRESPONDANCES) {
    console.log(`${c.stubNom}  ->  ${c.reelNom}`);
    if (!c.stubId) {
      console.log('   stub introuvable, ignoré');
      console.log('');
      continue;
    }
    if (!c.reelId) {
      console.log('   entité réelle introuvable, ignoré');
      console.log('');
      continue;
    }

    const liens = await prisma.questLocationLink.findMany({
      where: { locationId: c.stubId },
      include: { quest: { select: { name: true } } },
    });

    if (liens.length === 0) {
      console.log('   aucun lien de quête : le stub peut être supprimé directement');
    }

    for (const l of liens) {
      // Si la quête est DÉJÀ liée à l'entité réelle, on ne reparente pas :
      // on supprime le lien en double, sinon la quête afficherait deux fois
      // la même étape.
      const deja = await prisma.questLocationLink.findFirst({
        where: { questId: l.questId, locationId: c.reelId },
      });
      console.log(
        `   quête « ${l.quest?.name} » [role=${l.role}] -> ` +
          (deja ? 'déjà présente sur la cible : lien en double à supprimer' : 'à reparenter')
      );
      plan.push({ lienId: l.id, reelId: c.reelId, supprimer: Boolean(deja) });
      aTraiter++;
    }

    console.log(`   puis suppression du stub ${c.stubId}`);
    console.log('');
  }

  console.log(`${aTraiter} lien(s) à traiter, ${CORRESPONDANCES.length} stub(s) à supprimer.`);

  if (!ECRIRE) {
    console.log('');
    console.log('Relancer avec --ecrire pour appliquer.');
    await prisma.$disconnect();
    return;
  }

  // Une seule transaction : une réparation partielle laisserait la quête dans
  // un état incohérent, avec une étape pointant vers une entité supprimée.
  await prisma.$transaction(async (tx) => {
    for (const p of plan) {
      if (p.supprimer) {
        await tx.questLocationLink.delete({ where: { id: p.lienId } });
      } else {
        await tx.questLocationLink.update({
          where: { id: p.lienId },
          data: { locationId: p.reelId },
        });
      }
    }
    for (const c of CORRESPONDANCES) {
      if (!c.stubId) continue;
      // Les enfants éventuels seraient orphelinés : on refuse d'agir si le
      // stub en porte, signe qu'il n'est pas un simple résidu.
      const enfants = await tx.location.count({ where: { parentLocationId: c.stubId } });
      if (enfants > 0) {
        throw new Error(`le stub « ${c.stubNom} » porte ${enfants} sous-lieu(x) : arrêt par prudence`);
      }
      await tx.location.delete({ where: { id: c.stubId } });
    }
  });

  console.log('');
  console.log('Réparation appliquée.');
  await prisma.$disconnect();
})().catch(async (e) => {
  console.error('ÉCHEC :', e.message);
  await prisma.$disconnect();
  process.exit(1);
});
