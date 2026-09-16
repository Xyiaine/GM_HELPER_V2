// GM Helper — Génération de cartes à imprimer
//
// Les joueurs n'ont que leur fiche papier : tout ce qui doit exister à la table
// passe par l'imprimante. Ce service produit des PDF de cartes au format tarot
// agrandi ×1,5, soit 105 × 180 mm, tel que défini au cadrage (décision G4).
//
// Aucun moteur de rendu HTML n'est utilisé : pdfkit dessine directement en
// points, ce qui garantit des dimensions exactes au millimètre et évite
// d'embarquer un navigateur sur le serveur.

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const MM = 2.8346456692913; // points par millimètre
const CARD_W = 105 * MM;
const CARD_H = 180 * MM;

const A4_LANDSCAPE_W = 297 * MM;
const A4_LANDSCAPE_H = 210 * MM;

// Palette alignée sur l'écran de table : sable, ambre, métal poussiéreux.
const INK = '#1c1a17';
const MUTED = '#6f695f';
const RULE = '#d9d3c7';
const PAPER = '#fbf9f5';

const RARITIES = {
  common: { label: 'Courant', accent: '#6f695f', wash: '#f4f1eb' },
  uncommon: { label: 'Peu courant', accent: '#3f6b1f', wash: '#f0f6e8' },
  rare: { label: 'Rare', accent: '#1f5d8f', wash: '#e9f1f8' },
  very_rare: { label: 'Très rare', accent: '#6b3fa0', wash: '#f2ecfa' },
  legendary: { label: 'Légendaire', accent: '#a2691a', wash: '#faf2e2' },
};

const TYPES = {
  weapon: 'Arme',
  armor: 'Armure',
  potion: 'Potion',
  tool: 'Outil',
  consumable: 'Consommable',
  valuable: 'Objet de valeur',
  quest: 'Objet de quête',
  misc: 'Divers',
};

/**
 * pdfkit utilise l'encodage WinAnsi. Les caractères hors Latin-1 (emoji,
 * symboles exotiques) produiraient des glyphes manquants ou une exception :
 * on les retire, en conservant la ponctuation typographique française.
 */
function sanitize(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/\u00a0/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[^\u0000-\u00ff]/g, '')
    .trim();
}

function formatValue(value) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') return String(value);
  return sanitize(value);
}

/**
 * Aplatit un objet `properties` en liste de paires lisibles.
 *
 * Les formes rencontrées en base sont très variables : un objet avec des clés
 * libres, des tableaux imbriqués, des valeurs numériques. On produit une liste
 * plate « Libellé : valeur » plutôt que d'imposer un schéma qui n'existe pas.
 */
function flattenProperties(raw, depth = 0) {
  const out = [];
  if (!raw || depth > 2) return out;

  let parsed = raw;
  if (typeof raw === 'string') {
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      return [{ label: null, value: sanitize(raw) }];
    }
  }

  if (Array.isArray(parsed)) {
    parsed.forEach((entry) => {
      if (entry === null || entry === undefined) return;
      if (typeof entry === 'object') {
        out.push(...flattenProperties(entry, depth + 1));
      } else {
        out.push({ label: null, value: sanitize(entry) });
      }
    });
    return out;
  }

  if (typeof parsed === 'object') {
    Object.entries(parsed).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') return;
      if (Array.isArray(value)) {
        out.push({ label: key, value: value.map((v) => sanitize(v)).filter(Boolean).join(', ') });
      } else if (typeof value === 'object') {
        out.push(...flattenProperties(value, depth + 1));
      } else {
        out.push({ label: key, value: sanitize(value) });
      }
    });
    return out;
  }

  out.push({ label: null, value: sanitize(parsed) });
  return out;
}

/** Charge une illustration, quelle que soit son origine. Renvoie null si absente. */
async function loadImage(src) {
  if (!src) return null;
  try {
    if (/^https?:\/\//i.test(src)) {
      const res = await fetch(src, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) return null;
      return Buffer.from(await res.arrayBuffer());
    }

    // Chemin local servi par l'application (/uploads/...)
    const uploadsDir = process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads');
    const relative = src.replace(/^\/?uploads\/?/, '');
    const filePath = path.join(uploadsDir, relative);
    if (!fs.existsSync(filePath)) return null;
    return fs.readFileSync(filePath);
  } catch (err) {
    console.warn('Illustration illisible, carte sans image :', src, err.message);
    return null;
  }
}

// ─── Primitives de dessin ────────────────────────────────────────────────────

function drawParagraph(doc, text, x, y, width, options = {}) {
  const {
    size = 9,
    color = INK,
    font = 'Helvetica',
    lineGap = 2,
    maxHeight = Infinity,
  } = options;

  if (!text) return y;

  doc.font(font).fontSize(size).fillColor(color);
  const height = doc.heightOfString(text, { width, lineGap });

  if (height <= maxHeight) {
    doc.text(text, x, y, { width, lineGap });
    return y + height;
  }

  doc.text(text, x, y, { width, lineGap, height: maxHeight, ellipsis: true });
  return y + maxHeight;
}

function drawRule(doc, x, y, width, color = RULE) {
  doc.save().strokeColor(color).lineWidth(0.6)
    .moveTo(x, y).lineTo(x + width, y).stroke().restore();
  return y;
}

function drawField(doc, x, y, width, label, value, options = {}) {
  const { size = 9, labelColor = MUTED } = options;
  if (!value) return y;

  doc.font('Helvetica-Bold').fontSize(size - 1.5).fillColor(labelColor);
  doc.text(label.toUpperCase(), x, y, { width, characterSpacing: 0.4 });
  const labelHeight = doc.heightOfString(label.toUpperCase(), { width, characterSpacing: 0.4 });

  return drawParagraph(doc, value, x, y + labelHeight + 2, width, { size });
}

// ─── Contenu des cartes ──────────────────────────────────────────────────────

/**
 * Transforme une entité en description de carte, indépendante du rendu.
 * Ajouter un nouveau type de carte revient à ajouter un constructeur ici.
 */
function buildItemCard(item, campaignName) {
  const rarity = RARITIES[item.rarity] || RARITIES.common;
  const typeLabel = TYPES[item.type] || (item.type ? sanitize(item.type) : null);

  const footer = [];
  if (item.value !== null && item.value !== undefined) footer.push(`Valeur ${item.value}`);
  if (item.weight !== null && item.weight !== undefined) footer.push(`Poids ${item.weight}`);

  return {
    kind: 'item',
    title: sanitize(item.name),
    subtitle: typeLabel,
    banner: rarity.label,
    accent: rarity.accent,
    wash: rarity.wash,
    imageUrl: item.imageUrl || null,
    imageRatio: 1,
    blocks: [
      { label: 'Propriétés', entries: flattenProperties(item.properties) },
      { label: 'Description', text: sanitize(item.description) },
    ],
    footer: footer.join('  ·  '),
    campaign: sanitize(campaignName),
  };
}

function modifier(score) {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

function buildCharacterCard(character, campaignName) {
  const abilities = [
    ['Force', character.strength],
    ['Dextérité', character.dexterity],
    ['Constitution', character.constitution],
    ['Intelligence', character.intelligence],
    ['Sagesse', character.wisdom],
    ['Charisme', character.charisma],
  ];

  let skills = {};
  try {
    skills = character.skills ? JSON.parse(character.skills) : {};
  } catch (e) {
    skills = {};
  }

  const trained = Object.entries(skills)
    .filter(([, level]) => Number(level) > 0)
    .map(([key, level]) => `${sanitize(key.replace(/_/g, ' '))}${Number(level) > 1 ? ' (expertise)' : ''}`);

  const identity = [character.race, character.class]
    .map((v) => sanitize(v))
    .filter(Boolean)
    .join(' · ');

  return {
    kind: 'character',
    title: sanitize(character.name),
    subtitle: identity || null,
    banner: `Niveau ${character.level || 1}`,
    accent: '#3d5a80',
    wash: '#eef2f7',
    imageUrl: character.portraitUrl || null,
    imageRatio: 1,
    blocks: [
      {
        label: 'Caractéristiques',
        grid: abilities.map(([label, score]) => ({
          label,
          value: `${score}`,
          detail: modifier(score),
        })),
      },
      {
        label: 'Combat',
        grid: [
          { label: 'PV', value: `${character.hpCurrent}/${character.hpMax}` },
          { label: 'CA', value: `${character.armorClass}` },
          { label: 'Vitesse', value: `${character.speed}` },
          { label: 'Init.', value: `${character.initiative >= 0 ? '+' : ''}${character.initiative}` },
          { label: 'Maîtrise', value: `+${character.proficiencyBonus}` },
        ],
      },
      { label: 'Compétences maîtrisées', text: trained.join(', ') },
    ],
    footer: '',
    campaign: sanitize(campaignName),
  };
}

// ─── Rendu d'une carte ───────────────────────────────────────────────────────

function renderCard(doc, card, originX, originY, images) {
  const pad = 8 * MM;
  const innerW = CARD_W - pad * 2;

  // Fond teinté par la rareté, bordure fine : la carte doit rester lisible
  // même imprimée sur une imprimante économique.
  doc.save();
  doc.rect(originX, originY, CARD_W, CARD_H).fill(card.wash || PAPER);
  doc.rect(originX + 0.5, originY + 0.5, CARD_W - 1, CARD_H - 1)
    .lineWidth(1).strokeColor(card.accent).stroke();
  doc.restore();

  // Bandeau supérieur
  const bandH = 9 * MM;
  doc.save();
  doc.rect(originX, originY, CARD_W, bandH).fill(card.accent);
  doc.restore();

  doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#ffffff');
  doc.text(sanitize(card.banner || '').toUpperCase(), originX + pad, originY + bandH / 2 - 4, {
    width: innerW, characterSpacing: 1.2,
  });

  let y = originY + bandH + pad;

  // Titre
  y = drawParagraph(doc, card.title, originX + pad, y, innerW, {
    size: 16, font: 'Helvetica-Bold', lineGap: 1, maxHeight: 34 * MM / 3,
  });
  y += 4;

  if (card.subtitle) {
    y = drawParagraph(doc, card.subtitle, originX + pad, y, innerW, { size: 9.5, color: MUTED });
    y += 3;
  }

  y += 3;
  drawRule(doc, originX + pad, y, innerW, card.accent);
  y += 7;

  // Illustration
  const image = card.imageUrl ? images[card.imageUrl] : null;
  const imageH = 52 * MM;
  if (image) {
    try {
      doc.save();
      doc.rect(originX + pad, y, innerW, imageH).clip();
      doc.image(image, originX + pad, y, { cover: [innerW, imageH], align: 'center', valign: 'center' });
      doc.restore();
      doc.rect(originX + pad, y, innerW, imageH).lineWidth(0.6).strokeColor(RULE).stroke();
    } catch (err) {
      doc.rect(originX + pad, y, innerW, imageH).lineWidth(0.6).strokeColor(RULE).stroke();
    }
    y += imageH + 8;
  }

  // Blocs de contenu
  const footerReserve = 14 * MM;
  const maxY = originY + CARD_H - pad - footerReserve;

  for (const block of card.blocks || []) {
    if (y > maxY) break;

    if (block.label) {
      doc.font('Helvetica-Bold').fontSize(7).fillColor(MUTED);
      doc.text(sanitize(block.label).toUpperCase(), originX + pad, y, { width: innerW, characterSpacing: 0.6 });
      y += 11;
    }

    if (block.entries && block.entries.length) {
      for (const entry of block.entries) {
        if (y > maxY) break;
        const line = entry.label
          ? `${sanitize(entry.label)} : ${entry.value}`
          : entry.value;
        y = drawParagraph(doc, `- ${line}`, originX + pad, y, innerW, {
          size: 8.5, lineGap: 1.5, maxHeight: maxY - y,
        });
        y += 1.5;
      }
      y += 4;
    }

    if (block.grid) {
      const cols = block.grid.length > 4 ? 3 : Math.min(block.grid.length, 3);
      const cellW = innerW / cols;
      let rowY = y;
      block.grid.forEach((cell, idx) => {
        const col = idx % cols;
        const x = originX + pad + col * cellW;
        if (col === 0 && idx > 0) rowY += 20 * MM / 2.6;

        doc.font('Helvetica-Bold').fontSize(11).fillColor(INK);
        doc.text(cell.value, x, rowY, { width: cellW - 4 });
        if (cell.detail) {
          doc.font('Helvetica').fontSize(8).fillColor(MUTED);
          doc.text(cell.detail, x, rowY, { width: cellW - 4, align: 'right' });
        }
        doc.font('Helvetica').fontSize(6.5).fillColor(MUTED);
        doc.text(sanitize(cell.label).toUpperCase(), x, rowY + 13, { width: cellW - 4, characterSpacing: 0.3 });
      });
      y = rowY + 24;
      y += 4;
    }

    if (block.text) {
      y = drawParagraph(doc, block.text, originX + pad, y, innerW, {
        size: 8.5, lineGap: 2, maxHeight: Math.max(0, maxY - y),
      });
      y += 6;
    }
  }

  // Pied de carte
  const footerY = originY + CARD_H - pad - 8;
  drawRule(doc, originX + pad, footerY - 6, innerW, RULE);

  if (card.footer) {
    doc.font('Helvetica-Bold').fontSize(8).fillColor(INK);
    doc.text(card.footer, originX + pad, footerY, { width: innerW });
  }
  doc.font('Helvetica').fontSize(6.5).fillColor(MUTED);
  doc.text(card.campaign || '', originX + pad, footerY + 10, { width: innerW });
}

// ─── Documents ───────────────────────────────────────────────────────────────

/**
 * Produit un PDF de cartes.
 *
 * @param {Array<object>} cards Descriptions produites par les constructeurs
 * @param {object} options
 * @param {'card'|'planche'} options.layout
 *   `card`    : une page par carte, au format exact 105 × 180 mm, pour un
 *               imprimeur ou du papier prédécoupé.
 *   `planche` : deux cartes par feuille A4 paysage, avec traits de coupe,
 *               pour une impression domestique.
 * @returns {Promise<PDFKit.PDFDocument>} Flux PDF, à rediriger vers la réponse
 */
async function renderCards(cards, options = {}) {
  const layout = options.layout === 'planche' ? 'planche' : 'card';

  // Les illustrations sont chargées une fois, avant de commencer à écrire :
  // pdfkit ne permet pas d'attendre au milieu d'une page.
  const images = {};
  for (const card of cards) {
    if (card.imageUrl && !images[card.imageUrl]) {
      images[card.imageUrl] = await loadImage(card.imageUrl);
    }
  }

  const doc = new PDFDocument({
    autoFirstPage: false,
    size: layout === 'card' ? [CARD_W, CARD_H] : [A4_LANDSCAPE_W, A4_LANDSCAPE_H],
    margin: 0,
    info: { Title: 'GM Helper - Cartes', Creator: 'GM Helper' },
  });

  if (layout === 'card') {
    cards.forEach((card) => {
      doc.addPage();
      renderCard(doc, card, 0, 0, images);
    });
  } else {
    const gutter = 10 * MM;
    const totalW = CARD_W * 2 + gutter;
    const startX = (A4_LANDSCAPE_W - totalW) / 2;
    const startY = (A4_LANDSCAPE_H - CARD_H) / 2;

    for (let i = 0; i < cards.length; i += 2) {
      doc.addPage();

      // Traits de coupe aux quatre coins de chaque emplacement
      doc.save().strokeColor('#b9b3a7').lineWidth(0.4).dash(2, { space: 2 });
      [0, 1].forEach((col) => {
        const x = startX + col * (CARD_W + gutter);
        const y = startY;
        doc.moveTo(x - 4, y).lineTo(x - 1, y)
          .moveTo(x, y - 4).lineTo(x, y - 1)
          .moveTo(x + CARD_W + 1, y).lineTo(x + CARD_W + 4, y)
          .moveTo(x + CARD_W, y - 4).lineTo(x + CARD_W, y - 1)
          .moveTo(x - 4, y + CARD_H).lineTo(x - 1, y + CARD_H)
          .moveTo(x, y + CARD_H + 1).lineTo(x, y + CARD_H + 4)
          .moveTo(x + CARD_W + 1, y + CARD_H).lineTo(x + CARD_W + 4, y + CARD_H)
          .moveTo(x + CARD_W, y + CARD_H + 1).lineTo(x + CARD_W, y + CARD_H + 4)
          .stroke();
      });
      doc.undash().restore();

      renderCard(doc, cards[i], startX, startY, images);
      if (cards[i + 1]) {
        renderCard(doc, cards[i + 1], startX + CARD_W + gutter, startY, images);
      }
    }
  }

  doc.end();
  return doc;
}

module.exports = {
  renderCards,
  buildItemCard,
  buildCharacterCard,
  flattenProperties,
  CARD_W,
  CARD_H,
  RARITIES,
};
