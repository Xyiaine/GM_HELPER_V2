# coding: utf-8
import os
import re
import json

def parse_lore():
    lore_path = os.path.join('Lore et univers', 'Universe_Lore_v9.txt')
    with open(lore_path, 'r', encoding='utf-8') as f:
        text = f.read()

    # Find headers for each city
    header_regex = re.compile(r'^([0-9]+)\.\s+((?:CITÉ|NUKE CITY|BUNKER|L\'ÎLE|LE BUNKER)[^\n]+)', re.IGNORECASE | re.MULTILINE)
    matches = list(header_regex.finditer(text))

    lore_data = {"cities": {}}

    for i in range(len(matches)):
        m = matches[i]
        city_num = m.group(1)
        full_title = m.group(2).strip()

        start_idx = m.end()
        end_idx = matches[i+1].start() if i + 1 < len(matches) else len(text)
        city_text = text[start_idx:end_idx]

        # Extract main fields
        def extract_field(pattern):
            res = re.search(pattern, city_text, re.IGNORECASE)
            return res.group(1).strip().replace('\n', ' ') if res else ""

        specialty = extract_field(r'Spécialité\s*:\s*([^\n]+(?:\n[^\n]+)?)')
        strength = extract_field(r'Force\s*:\s*([^\n]+(?:\n[^\n]+)?)')
        weakness = extract_field(r'Faiblesse\s*:\s*([^\n]+(?:\n[^\n]+)?)')
        particularity = extract_field(r'Particularité\s*:\s*([^\n]+(?:\n[^\n]+)?)')
        geo = extract_field(r'Position géographique\s*:\s*([^\n]+)')
        params = extract_field(r'Paramètres initiaux\s*:\s*([^\n]+)')

        city_data = {
            "num": city_num,
            "name": full_title,
            "specialty": specialty,
            "strength": strength,
            "weakness": weakness,
            "particularity": particularity,
            "geo": geo,
            "params": params,
            "buildings": {}
        }

        # Find buildings under Lieux et Personnages Notables
        b_matches = list(re.finditer(r'>>\s+([^\n]+)', city_text))
        for j in range(len(b_matches)):
            b_m = b_matches[j]
            b_name = b_m.group(1).strip()
            b_start = b_m.end()
            b_end = b_matches[j+1].start() if j + 1 < len(b_matches) else len(city_text)
            b_text = city_text[b_start:b_end]

            points = []
            lines = b_text.split('\n')
            current_char = ""
            current_desc = ""
            for line in lines:
                sline = line.strip()
                if sline.startswith('- '):
                    if current_char:
                        points.append(f"{current_char} : {current_desc.strip()}")
                    parts = sline[2:].split(':', 1)
                    if len(parts) == 2:
                        current_char = parts[0].strip()
                        current_desc = parts[1].strip() + " "
                    else:
                        current_char = sline[2:].strip()
                        current_desc = ""
                elif sline.startswith('[Description du lieu'):
                    desc_text = sline.strip('[]').replace('Description du lieu :', '').strip()
                    points.append(f"Description : {desc_text}")
                elif current_char and sline:
                    current_desc += sline + " "

            if current_char:
                points.append(f"{current_char} : {current_desc.strip()}")

            if not points:
                points.append("Lieu emblématique de la cité.")

            city_data["buildings"][b_name.lower().strip()] = points

        norm_key = full_title.lower().strip()
        lore_data["cities"][norm_key] = city_data

    js_content = "export const loreData = " + json.dumps(lore_data, indent=2, ensure_ascii=False) + ";\n\n"
    js_content += """export function getCityLore(cityName) {
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
  return null;
}
"""

    out_path = os.path.join('client', 'src', 'utils', 'loreData.js')
    with open(out_path, 'w', encoding='utf-8') as out:
        out.write(js_content)

    print(f"Successfully generated {out_path} with {len(lore_data['cities'])} cities.")

if __name__ == '__main__':
    parse_lore()
