/**
 * GM Helper — Rule System Converter Utility (BE-10 / FE-11)
 * Converts generic post-apocalyptic challenge descriptions [PROBLÈME]
 * into concrete D&D 5e (or target ruleset) skill checks and difficulty classes (DC).
 * 
 * Prevents duplicating quest text files across different rulesets.
 */

const DEFAULT_DND5E_MAPPING = {
  // Perception & Sensory
  'perception': { skill: 'Perception', ability: 'intelligence', baseDC: 13 },
  'detection': { skill: 'Perception', ability: 'wisdom', baseDC: 14 },
  'observation': { skill: 'Perception', ability: 'wisdom', baseDC: 12 },

  // Survival & Wasteland
  'survie': { skill: 'Survie', ability: 'wisdom', baseDC: 14 },
  'orientation': { skill: 'Survie', ability: 'wisdom', baseDC: 13 },
  'pistage': { skill: 'Survie', ability: 'wisdom', baseDC: 15 },
  'convoi': { skill: 'Dressage / Survie', ability: 'wisdom', baseDC: 14 },

  // Technology & Vehicles
  'piratage': { skill: 'Histoire (Technologie)', ability: 'intelligence', baseDC: 15 },
  'mecanique': { skill: 'Investigation (Mécanique)', ability: 'intelligence', baseDC: 14 },
  'pilotage': { skill: 'Acrobaties / Survie (Conduite)', ability: 'dexterity', baseDC: 14 },
  'reparation': { skill: 'Outils de réparateur', ability: 'intelligence', baseDC: 13 },

  // Social & Factions
  'négociation': { skill: 'Persuasion', ability: 'charisma', baseDC: 14 },
  'intimidation': { skill: 'Intimidation', ability: 'charisma', baseDC: 15 },
  'tromperie': { skill: 'Tromperie', ability: 'charisma', baseDC: 14 },
  'diplomatie': { skill: 'Persuasion', ability: 'charisma', baseDC: 13 },

  // Athletics & Physical
  'escalade': { skill: 'Athlétisme', ability: 'strength', baseDC: 13 },
  'endurance': { skill: 'Jet de Sauvegarde de Constitution', ability: 'constitution', baseDC: 14 },
  'discretion': { skill: 'Discrétion', ability: 'dexterity', baseDC: 14 },
  'agilite': { skill: 'Acrobaties', ability: 'dexterity', baseDC: 13 },

  // Combat & Hazards
  'danger': { skill: 'Jet de Sauvegarde de Dextérité', ability: 'dexterity', baseDC: 14 },
  'radiation': { skill: 'Jet de Sauvegarde de Constitution (Rad)', ability: 'constitution', baseDC: 15 },
  'toxine': { skill: 'Jet de Sauvegarde de Vigueur', ability: 'constitution', baseDC: 14 }
};

/**
 * Converts generic challenge text into structured target rule system check.
 * 
 * @param {string} text - The input problem/sensory description text
 * @param {string} targetSystem - 'dnd5e' | 'generic'
 * @returns {{ originalText: string, convertedText: string, detectedChecks: Array }}
 */
function convertRuleSystem(text, targetSystem = 'dnd5e') {
  if (!text || typeof text !== 'string') {
    return { originalText: '', convertedText: '', detectedChecks: [] };
  }

  if (targetSystem === 'generic') {
    return { originalText: text, convertedText: text, detectedChecks: [] };
  }

  const detectedChecks = [];
  let convertedText = text;

  // Regex matches patterns like [PROBLÈME: Survie DD 14] or [PROBLÈME - Perception] or [PROBLÈME: Piratage]
  const problemRegex = /\[PROBLÈME(?::| -)?\s*([^\]]+)\]/gi;

  convertedText = text.replace(problemRegex, (match, challengeDetails) => {
    const detailTrimmed = challengeDetails.trim();
    const parts = detailTrimmed.toLowerCase().split(/\s+/);
    
    let matchedMapping = null;
    let explicitDC = null;

    // Look for explicit DC number (e.g. DD 15 or DC 15)
    const dcMatch = detailTrimmed.match(/(?:DD|DC|difficulté)\s*(\d+)/i);
    if (dcMatch) {
      explicitDC = parseInt(dcMatch[1], 10);
    }

    // Match keywords against mapping dictionary
    for (const key of Object.keys(DEFAULT_DND5E_MAPPING)) {
      if (parts.some(p => p.includes(key))) {
        matchedMapping = DEFAULT_DND5E_MAPPING[key];
        break;
      }
    }

    if (matchedMapping) {
      const finalDC = explicitDC || matchedMapping.baseDC;
      const dndCheckLabel = `Jet de ${matchedMapping.skill} (DD ${finalDC})`;
      detectedChecks.push({
        rawTag: match,
        category: detailTrimmed,
        dndCheckLabel,
        dc: finalDC,
        ability: matchedMapping.ability
      });
      return `[🎲 DD 5e : ${dndCheckLabel} — Origine: ${detailTrimmed}]`;
    }

    // Fallback if no specific keyword matched
    const fallbackDC = explicitDC || 14;
    const fallbackLabel = `Test de caractéristique (DD ${fallbackDC})`;
    detectedChecks.push({
      rawTag: match,
      category: detailTrimmed,
      dndCheckLabel: fallbackLabel,
      dc: fallbackDC
    });
    return `[🎲 DD 5e : ${detailTrimmed} → ${fallbackLabel}]`;
  });

  return {
    originalText: text,
    convertedText,
    detectedChecks
  };
}

module.exports = {
  convertRuleSystem,
  DEFAULT_DND5E_MAPPING
};
