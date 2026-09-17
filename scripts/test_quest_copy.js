// Verifie que la duplication et l'instanciation de quete copient un graphe
// complet. Les deux operations tournent dans une transaction : en cas d'echec,
// rien ne doit subsister (voir le test de rollback dans l'historique git).
//
// Usage : node scripts/test_quest_copy.js <baseUrl> <tokenFile> <campaignId> <questId>

const fs = require('fs');
const path = require('path');

const BASE = process.argv[2] || 'http://localhost:3000';
const TOKEN_FILE = process.argv[3];
const CAMPAIGN = process.argv[4];
const QUEST = process.argv[5];

if (!TOKEN_FILE || !CAMPAIGN || !QUEST) {
  console.error('Usage : node scripts/test_quest_copy.js <baseUrl> <tokenFile> <campaignId> <questId>');
  process.exit(1);
}

const token = fs.readFileSync(TOKEN_FILE, 'utf8').trim();

const { PrismaClient } = require(path.join(__dirname, '..', 'server', 'node_modules', '@prisma/client'));
const prisma = new PrismaClient();

async function api(method, url, body) {
  const res = await fetch(`${BASE}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const texte = await res.text();
  let json = null;
  try { json = JSON.parse(texte); } catch { /* reponse non JSON */ }
  return { status: res.status, json, texte };
}

async function compter(questId) {
  const [nodes, conns, rewards, threats, objectives] = await Promise.all([
    prisma.questNode.count({ where: { questId } }),
    prisma.questNodeConnection.count({ where: { fromNode: { questId } } }),
    prisma.questNodeReward.count({ where: { node: { questId } } }),
    prisma.questThreatTracker.count({ where: { questId } }),
    prisma.questObjective.count({ where: { questId } }),
  ]);
  return { nodes, conns, rewards, threats, objectives };
}

let echecs = 0;
function verifier(condition, message) {
  console.log(`  ${condition ? 'OK  ' : 'ECHEC'} ${message}`);
  if (!condition) echecs++;
}

(async () => {
  console.log('=== Reference : quete source ===');
  const source = await compter(QUEST);
  console.log('  ', JSON.stringify(source));

  // ---------- Duplication ----------
  console.log('\n=== POST /duplicate ===');
  const dup = await api('POST', `/api/v1/gm/campaigns/${CAMPAIGN}/quests/${QUEST}/duplicate`);
  verifier(dup.status === 200, `statut 200 (recu ${dup.status})`);
  const dupId = dup.json?.quest?.id;
  verifier(!!dupId, 'la reponse contient un id de quete');

  if (dupId) {
    const copie = await compter(dupId);
    console.log('  ', JSON.stringify(copie));
    verifier(copie.nodes === source.nodes, `noeuds copies (${copie.nodes}/${source.nodes})`);
    verifier(copie.conns === source.conns, `connexions copiees (${copie.conns}/${source.conns})`);
    verifier(copie.rewards === 0 || copie.rewards === source.rewards, `recompenses coherentes (${copie.rewards})`);

    await prisma.quest.delete({ where: { id: dupId } });
    console.log('  (copie de test supprimee)');
  }

  // ---------- Instanciation ----------
  console.log('\n=== POST /instantiate ===');
  const inst = await api('POST', `/api/v1/gm/campaigns/${CAMPAIGN}/quests/${QUEST}/instantiate`);
  verifier(inst.status === 201, `statut 201 (recu ${inst.status})`);
  const instId = inst.json?.quest?.id;
  verifier(!!instId, 'la reponse contient un id de quete');

  if (instId) {
    const copie = await compter(instId);
    console.log('  ', JSON.stringify(copie));
    verifier(copie.nodes === source.nodes, `noeuds copies (${copie.nodes}/${source.nodes})`);
    verifier(copie.conns === source.conns, `connexions copiees (${copie.conns}/${source.conns})`);
    verifier(copie.threats === source.threats, `menaces copiees (${copie.threats}/${source.threats})`);
    verifier(copie.objectives === source.objectives, `objectifs copies (${copie.objectives}/${source.objectives})`);

    await prisma.quest.delete({ where: { id: instId } });
    console.log('  (copie de test supprimee)');
  }

  console.log(`\n=== ${echecs === 0 ? 'TOUS LES TESTS PASSENT' : echecs + ' ECHEC(S)'} ===`);
  await prisma.$disconnect();
  process.exit(echecs === 0 ? 0 : 1);
})().catch(async (e) => {
  console.error('Erreur de test :', e.message);
  await prisma.$disconnect();
  process.exit(1);
});
