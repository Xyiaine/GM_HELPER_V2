// Capture d'écran de l'interface via le protocole de débogage de Chrome (CDP).
//
// L'outil agent-browser se bloque dans cet environnement ; ce script parle
// directement à Chrome, ce qui suffit pour naviguer et capturer.
//
// Prérequis : Chrome lancé avec --remote-debugging-port=9222
//
// Usage : node scripts/capture_ui.js <url> <fichier-de-sortie> [chemin-localStorage-jeton]

const fs = require('fs');
const path = require('path');

const CDP = 'http://127.0.0.1:9222';
const [url, sortie, cheminJeton, expression] = process.argv.slice(2);

if (!url || !sortie) {
  console.error('Usage : node scripts/capture_ui.js <url> <sortie.png> [jeton.txt] ["expression JS"]');
  process.exit(1);
}

const attendre = (ms) => new Promise((r) => setTimeout(r, ms));

async function nouvelOnglet() {
  const res = await fetch(`${CDP}/json/new?about:blank`, { method: 'PUT' });
  if (!res.ok) throw new Error(`Impossible d'ouvrir un onglet : ${res.status}`);
  return res.json();
}

/** Petit client CDP : envoie des commandes et attend leurs réponses. */
function connecter(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    let id = 0;
    const enAttente = new Map();

    ws.addEventListener('open', () => {
      resolve({
        envoyer(method, params = {}) {
          return new Promise((res, rej) => {
            const messageId = ++id;
            enAttente.set(messageId, { res, rej });
            ws.send(JSON.stringify({ id: messageId, method, params }));
            setTimeout(() => {
              if (enAttente.has(messageId)) {
                enAttente.delete(messageId);
                rej(new Error(`Délai dépassé sur ${method}`));
              }
            }, 30000);
          });
        },
        fermer: () => ws.close(),
      });
    });

    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && enAttente.has(msg.id)) {
        const { res, rej } = enAttente.get(msg.id);
        enAttente.delete(msg.id);
        if (msg.error) rej(new Error(msg.error.message));
        else res(msg.result);
      }
    });

    ws.addEventListener('error', () => reject(new Error('Échec de la connexion CDP')));
  });
}

async function capturer() {
  const onglet = await nouvelOnglet();
  const cdp = await connecter(onglet.webSocketDebuggerUrl);

  await cdp.envoyer('Page.enable');
  await cdp.envoyer('Emulation.setDeviceMetricsOverride', {
    width: 1600, height: 1000, deviceScaleFactor: 1, mobile: false,
  });

  // On passe d'abord par l'origine pour pouvoir écrire dans son localStorage.
  const origine = new URL(url).origin;
  await cdp.envoyer('Page.navigate', { url: `${origine}/login` });
  await attendre(3500);

  if (cheminJeton && fs.existsSync(cheminJeton)) {
    const jeton = fs.readFileSync(cheminJeton, 'utf8').trim();
    await cdp.envoyer('Runtime.evaluate', {
      expression: `localStorage.setItem('accessToken', ${JSON.stringify(jeton)}); 'ok'`,
    });
    console.log('Jeton injecté dans le localStorage.');
  }

  await cdp.envoyer('Page.navigate', { url });
  await attendre(6000);

  // Action facultative avant la capture (ouvrir un tiroir, dérouler une section…).
  if (expression) {
    await cdp.envoyer('Runtime.evaluate', { expression, awaitPromise: true });
    await attendre(1500);
  }

  const capture = await cdp.envoyer('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  const chemin = path.resolve(sortie);
  fs.mkdirSync(path.dirname(chemin), { recursive: true });
  fs.writeFileSync(chemin, Buffer.from(capture.data, 'base64'));

  console.log('Capture écrite :', chemin, `(${Math.round(fs.statSync(chemin).size / 1024)} Ko)`);

  cdp.fermer();
}

capturer().catch((err) => {
  console.error('ERREUR :', err.message);
  process.exit(1);
});
