# coding: utf-8
import re
import json

def parse_lore():
    with open('Universe Lore.txt', 'r', encoding='utf-8') as f:
        text = f.read()

    city_matches = list(re.finditer(r'(\d+)\.\s+([^\n]+)\nSpécialité\s*:\s*([^\n]+)\nForce\s*:\s*([^\n]+)\nFaiblesse\s*:\s*([^\n]+)\nParticularité\s*:\s*([^\n]+)\nPosition géographique\s*:\s*([^\n]+)\nParamètres initiaux\s*:\s*([^\n]+)', text, re.IGNORECASE))
    
    lore_data = {"cities": {}}
    
    for i in range(len(city_matches)):
        match = city_matches[i]
        city_name = match.group(2).strip()
        
        city_data = {
            "name": city_name,
            "specialty": match.group(3).strip(),
            "strength": match.group(4).strip(),
            "weakness": match.group(5).strip(),
            "particularity": match.group(6).strip(),
            "buildings": {}
        }
        
        start_idx = match.end()
        end_idx = city_matches[i+1].start() if i + 1 < len(city_matches) else len(text)
        city_text = text[start_idx:end_idx]
        
        b_matches = list(re.finditer(r'>>\s+([^\n]+)', city_text))
        for j in range(len(b_matches)):
            b_match = b_matches[j]
            b_name = b_match.group(1).strip()
            
            b_start = b_match.end()
            b_end = b_matches[j+1].start() if j + 1 < len(b_matches) else len(city_text)
            b_text = city_text[b_start:b_end]
            
            # Simple line-by-line parsing for bullets
            points = []
            lines = b_text.split('\n')
            current_char = ""
            current_desc = ""
            for line in lines:
                if line.startswith('     - '):
                    if current_char:
                        points.append(f"{current_char} : {current_desc.strip()}")
                    current_char = line[7:].strip()
                    current_desc = ""
                elif line.startswith('       - '):
                    current_desc += line[9:].strip() + " "
            if current_char:
                points.append(f"{current_char} : {current_desc.strip()}")
                
            if not points:
                points.append("Lieu emblématique de la cité.")
                
            city_data["buildings"][b_name.lower().strip()] = points
            
        lore_data["cities"][city_name.lower().strip()] = city_data
        
    js_content = "export const loreData = " + json.dumps(lore_data, indent=2, ensure_ascii=False) + ";\n"
    js_content += """
export function getCityLore(cityName) {
  if (!cityName) return null;
  const normalized = cityName.toLowerCase().trim();
  for (const [key, data] of Object.entries(loreData.cities)) {
    if (key.includes(normalized) || normalized.includes(key) || data.name.toLowerCase().includes(normalized)) {
      return data;
    }
  }
  return null;
}

export function getBuildingLore(cityName, buildingName) {
  const city = getCityLore(cityName);
  if (!city || !buildingName) return null;
  const normalizedB = buildingName.toLowerCase().trim();
  for (const [key, points] of Object.entries(city.buildings)) {
    if (key.includes(normalizedB) || normalizedB.includes(key)) {
      return points;
    }
  }
  return null; // Return null to fallback to custom description if needed
}
"""
    with open('client/src/utils/loreData.js', 'w', encoding='utf-8') as out:
        out.write(js_content)

if __name__ == '__main__':
    parse_lore()
