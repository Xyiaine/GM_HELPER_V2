export function formatClasses(classData) {
  if (!classData) return 'Sans Classe';
  try {
    let parsed = typeof classData === 'string' ? JSON.parse(classData) : classData;
    if (!Array.isArray(parsed) || parsed.length === 0) return 'Sans Classe';
    
    // Convert array like: [{id, name, level, pointsInvested}]
    // to "Combat Rapproché (Lvl 7), Défense (Lvl 3)"
    return parsed.map(c => `${c.name || c.id} (Lvl ${c.level})`).join(', ');
  } catch (err) {
    return 'Classes';
  }
}
