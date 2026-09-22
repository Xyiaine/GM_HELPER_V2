// Audit de contraste WCAG sur une page de l'application.
//
// Parcourt le DOM dans Chrome (via le protocole de débogage) et calcule, pour
// chaque texte visible, le rapport de contraste reel entre sa couleur et le
// fond effectif — c'est-a-dire en composant les fonds translucides des
// ancetres, ce que l'oeil fait et qu'une simple lecture de `background-color`
// ne fait pas.
//
// Seuils WCAG 2.1 niveau AA :
//   - texte normal   : 4,5 : 1
//   - grand texte    : 3,0 : 1  (>= 24 px, ou >= 18,66 px en gras)
//
// Prerequis : Chrome lance avec --remote-debugging-port=9222
//
// Usage : node scripts/audit_contraste.js <url> [chemin-jeton] ["expression JS"]

const fs = require('fs');

const CDP = 'http://127.0.0.1:9222';
const args = process.argv.slice(2);
const indexInspection = args.indexOf('--inspect');
const MODE_INSPECTION = indexInspection !== -1 ? args[indexInspection + 1] : null;
// Sans --inspect, indexInspection vaut -1 : filtrer sur -1 et 0 supprimerait
// l'URL. On ne retire les arguments que si l'option est presente.
const argsUtiles = indexInspection === -1
  ? args
  : args.filter((a, i) => i !== indexInspection && i !== indexInspection + 1);
const [url, cheminJeton, expression] = argsUtiles;

if (!url) {
  console.error('Usage : node scripts/audit_contraste.js <url> [chemin-jeton] ["expression JS"]');
  console.error('        node scripts/audit_contraste.js <url> [chemin-jeton] --inspect "texte exact"');
  process.exit(1);
}

const attendre = (ms) => new Promise((r) => setTimeout(r, ms));

async function nouvelOnglet() {
  const res = await fetch(`${CDP}/json/new?about:blank`, { method: 'PUT' });
  if (!res.ok) throw new Error(`Impossible d'ouvrir un onglet : ${res.status}`);
  return res.json();
}

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
                rej(new Error(`Delai depasse sur ${method}`));
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

    ws.addEventListener('error', () => reject(new Error('Echec de la connexion CDP')));
  });
}

// Le code injecte dans la page. Renvoie la liste des textes sous le seuil.
const AUDIT = `(() => {
  const analysables = [];
  const indetermines = [];

  function parse(c) {
    const m = String(c).match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    const p = m[1].split(',').map((x) => parseFloat(x.trim()));
    if (p.length < 3 || p.some((v) => Number.isNaN(v))) return null;
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  }

  function luminance(c) {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  }

  function rapport(a, b) {
    const l1 = luminance(a), l2 = luminance(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }

  // Composition alpha correcte : la couche du dessus posee sur celle du dessous,
  // les deux pouvant etre translucides. Une composition naive, qui traite la
  // couche du dessous comme opaque, assombrit artificiellement les fonds
  // empiles — c'est l'erreur qui faisait croire a un fond rouge sombre derriere
  // la pastille M.
  function composer(haut, bas) {
    const ah = haut.a === undefined ? 1 : haut.a;
    const ab = bas.a === undefined ? 1 : bas.a;
    const a = ah + ab * (1 - ah);
    if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
    return {
      r: (haut.r * ah + bas.r * ab * (1 - ah)) / a,
      g: (haut.g * ah + bas.g * ab * (1 - ah)) / a,
      b: (haut.b * ah + bas.b * ab * (1 - ah)) / a,
      a,
    };
  }

  // L'opacite d'un element (ou d'un ancetre) delave tout ce qu'il contient.
  // C'est un angle mort classique : un bouton desactive a opacity 0.5 affiche
  // un contraste reel deux fois plus faible que sa couleur declaree. Une
  // opacite nulle sur un ancetre rend le texte invisible.
  function opaciteCumulee(el, arreter) {
    let o = 1;
    let noeud = el;
    while (noeud && noeud.nodeType === 1 && noeud !== arreter) {
      const v = parseFloat(getComputedStyle(noeud).opacity);
      if (!Number.isNaN(v)) o *= v;
      noeud = noeud.parentElement;
    }
    return o;
  }

  function fondEffectif(el) {
    let noeud = el;
    let accumule = null;
    let imageQuelquePart = false;
    let opacite = 1;

    while (noeud && noeud.nodeType === 1) {
      const style = getComputedStyle(noeud);
      if (style.backgroundImage && style.backgroundImage !== 'none') imageQuelquePart = true;

      const o = parseFloat(style.opacity);
      if (!Number.isNaN(o)) opacite *= o;

      const c = parse(style.backgroundColor);
      if (c && c.a > 0) {
        const couche = { r: c.r, g: c.g, b: c.b, a: c.a * opacite };
        accumule = accumule ? composer(accumule, couche) : couche;
        if (accumule.a >= 0.999) break;
      }
      noeud = noeud.parentElement;
    }

    const fondCorps = parse(getComputedStyle(document.body).backgroundColor);
    const base = fondCorps && fondCorps.a > 0 ? fondCorps : { r: 255, g: 255, b: 255, a: 1 };
    return { couleur: accumule ? composer(accumule, base) : base, imageQuelquePart };
  }

  function chemin(el) {
    const bouts = [];
    let noeud = el;
    for (let i = 0; i < 4 && noeud && noeud.nodeType === 1; i++) {
      let bout = noeud.tagName.toLowerCase();
      if (noeud.className && typeof noeud.className === 'string') {
        const cls = noeud.className.trim().split(/\\s+/).slice(0, 2).join('.');
        if (cls) bout += '.' + cls;
      }
      bouts.unshift(bout);
      noeud = noeud.parentElement;
    }
    return bouts.join(' > ');
  }

  const tous = document.querySelectorAll('body *');
  for (const el of tous) {
    // Uniquement les elements qui portent directement du texte.
    let texte = '';
    for (const noeud of el.childNodes) {
      if (noeud.nodeType === 3) texte += noeud.textContent;
    }
    texte = texte.trim();
    if (!texte) continue;

    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') continue;
    if (parseFloat(style.opacity) === 0) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) continue;

    const avant = parse(style.color);
    if (!avant) continue;

    // Le texte subit l'opacite de son propre element et de tous ses ancetres.
    const opaciteTexte = opaciteCumulee(el, null);
    avant.a = (avant.a === undefined ? 1 : avant.a) * opaciteTexte;

    const { couleur: fond, imageQuelquePart } = fondEffectif(el);
    const avantOpaque = composer(avant, fond);
    const ratio = rapport(avantOpaque, fond);

    const taille = parseFloat(style.fontSize);
    const gras = parseInt(style.fontWeight, 10) >= 700 || style.fontWeight === 'bold';
    const grandTexte = taille >= 24 || (taille >= 18.66 && gras);
    const seuil = grandTexte ? 3 : 4.5;

    const entree = {
      texte: texte.slice(0, 60),
      chemin: chemin(el),
      couleur: style.color,
      fond: 'rgb(' + Math.round(fond.r) + ', ' + Math.round(fond.g) + ', ' + Math.round(fond.b) + ')',
      taille: Math.round(taille * 10) / 10,
      gras,
      ratio: Math.round(ratio * 100) / 100,
      seuil,
    };

    if (ratio < seuil) {
      if (imageQuelquePart) indetermines.push(entree);
      else analysables.push(entree);
    }
  }

  analysables.sort((a, b) => a.ratio - b.ratio);
  return JSON.stringify({ violations: analysables, indetermines, total: tous.length });
})()`;

// Mode inspection : pour un texte donne, remonte la chaine des ancetres et
// affiche la couleur de fond de chacun. Sert a comprendre d'ou vient un fond
// inattendu — un parent dont on avait oublie le backgroundColor, par exemple.
const INSPECTER = (cible) => `(() => {
  const trouves = [];
  for (const el of document.querySelectorAll('body *')) {
    let texte = '';
    for (const n of el.childNodes) if (n.nodeType === 3) texte += n.textContent;
    if (texte.trim() !== ${JSON.stringify(cible)}) continue;

    const chaine = [];
    let noeud = el;
    while (noeud && noeud.nodeType === 1) {
      const s = getComputedStyle(noeud);
      chaine.push({
        balise: noeud.tagName.toLowerCase(),
        classe: typeof noeud.className === 'string' ? noeud.className : '',
        fond: s.backgroundColor,
        couleur: s.color,
      });
      noeud = noeud.parentElement;
    }
    trouves.push(chaine);
  }
  return JSON.stringify(trouves);
})()`;

async function auditer() {
  const onglet = await nouvelOnglet();
  const cdp = await connecter(onglet.webSocketDebuggerUrl);

  await cdp.envoyer('Page.enable');
  await cdp.envoyer('Emulation.setDeviceMetricsOverride', {
    width: 1600, height: 1000, deviceScaleFactor: 1, mobile: false,
  });

  const origine = new URL(url).origin;
  await cdp.envoyer('Page.navigate', { url: `${origine}/login` });
  await attendre(3500);

  if (cheminJeton && fs.existsSync(cheminJeton)) {
    const jeton = fs.readFileSync(cheminJeton, 'utf8').trim();
    await cdp.envoyer('Runtime.evaluate', {
      expression: `localStorage.setItem('accessToken', ${JSON.stringify(jeton)}); 'ok'`,
    });
  }

  await cdp.envoyer('Page.navigate', { url });
  await attendre(6000);

  if (expression) {
    await cdp.envoyer('Runtime.evaluate', { expression, awaitPromise: true });
    await attendre(1500);
  }

  const expressionFinale = MODE_INSPECTION
    ? INSPECTER(MODE_INSPECTION)
    : AUDIT;
  const resultat = await cdp.envoyer('Runtime.evaluate', { expression: expressionFinale, returnByValue: true });
  const donnees = JSON.parse(resultat.result.value);
  cdp.fermer();
  return donnees;
}

auditer()
  .then((donnees) => {
    if (MODE_INSPECTION) {
      console.log(`\n=== chaine des fonds pour "${MODE_INSPECTION}" ===`);
      if (donnees.length === 0) {
        console.log('  Aucun element ne porte exactement ce texte.');
        return;
      }
      donnees.forEach((chaine, i) => {
        console.log(`\n  occurrence ${i + 1} :`);
        chaine.forEach((n, profondeur) => {
          console.log(`    ${'  '.repeat(profondeur)}${n.balise}${n.classe ? '.' + n.classe : ''}`);
          console.log(`    ${'  '.repeat(profondeur)}  fond ${n.fond} | texte ${n.couleur}`);
        });
      });
      return;
    }

    const { violations, indetermines, total } = donnees;
    console.log(`\n=== ${url} ===`);
    console.log(`${total} elements examines | ${violations.length} textes sous le seuil | ${indetermines.length} indetermines (fond image)`);

    if (violations.length === 0) {
      console.log('  Aucun contraste insuffisant.');
    } else {
      for (const v of violations) {
        console.log(`  ${String(v.ratio).padStart(5)}:1  (seuil ${v.seuil})  ${v.taille}px${v.gras ? ' gras' : ''}  ${v.couleur} sur ${v.fond}`);
        console.log(`         "${v.texte}"`);
        console.log(`         ${v.chemin}`);
      }
    }

    if (indetermines.length > 0) {
      console.log(`\n  -- indetermines (fond avec image, a verifier a l'oeil) : ${indetermines.length}`);
      for (const v of indetermines.slice(0, 8)) {
        console.log(`  ${String(v.ratio).padStart(5)}:1  "${v.texte}"  ${v.chemin}`);
      }
    }
  })
  .catch((err) => {
    console.error('ERREUR :', err.message);
    process.exit(1);
  });
