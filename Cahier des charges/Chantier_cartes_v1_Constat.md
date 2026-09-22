# Chantier cartes v1 — Constat mesuré

**Date :** 21 septembre 2026
**Périmètre :** carte du monde (`MapManager.jsx`) et carte de ville
(`LocalMapManager.jsx`) de GM Helper.
**Objet :** établir sur pièces ce qui est cassé, avant toute refonte.

Ce document n'est pas une proposition. C'est le relevé de ce que le code, la
base et le rendu réel montrent aujourd'hui. Les documents de refonte
(`Refonte_carte_du_monde_*.md`, `Refonte_carte_de_ville_*.md`) s'appuient dessus.

---

## 1. Carte du monde

### 1.1 Une projection existe et elle est bonne — elle n'a jamais été branchée

Le cahier des charges (`architecture et fonctionnement.md`, § 7) définit une
**projection GPS → canvas** pour les dix cités. Vérification faite : les dix
couples du tableau officiel sont reproduits par une transformation linéaire
exacte, à moins d'un pixel près sur l'ensemble des points.

```
X = 47,63 × longitude + 476,04
Y = −66,68 × latitude + 3200,45        (base 1200 × 1200 px)
```

Le rapport des deux coefficients vaut **1,400** (66,68 / 47,63 = 1,39996), ce
qui correspond à une **Mercator sphérique** centrée sur la latitude **44,42°**
— car `1 / cos(44,42°) = 1,400`. Ce n'est donc pas un placement approximatif à
la main : c'est de la cartographie réelle, et elle est juste.

> *Rectification du 21 septembre 2026.* Ce paragraphe a d'abord écrit que 1,400
> valait « exactement `1 / cos(45,6°)` ». C'est faux : `1 / cos(45,6°) = 1,42926`,
> soit 2,1 % d'écart. La conclusion ne change pas — l'écart est trop faible pour
> déplacer un point de plus d'un pixel sur la grille 1200 — mais le référent
> exact est **44,42°**, ce qui centre la projection au cœur du bassin
> (31,2°–46,2° N) plutôt qu'à son bord nord.

**Le problème : cette projection n'est nulle part dans le code.** Recherche
faite sur `server/src`, `client/src` et `scripts/` : aucun appel, aucune
fonction, aucun fichier `update_city_gps.js` (le script est référencé au § 8.3
du cahier des charges mais n'existe pas). Les coordonnées ont été **écrites une
fois en base puis figées**, et depuis elles dérivent avec les retouches
manuelles.

### 1.2 Le référentiel de la projection ne correspond pas à l'image de fond

C'est la cause directe du défaut visible. La projection officielle produit des
coordonnées sur une grille **1200 × 1200**. L'image de fond réellement utilisée,
`client/public/assets/map-lore-base.png`, est une **PNG 1024 × 1024**.

Résultat : les villes situées à l'est du bassin tombent **hors du cadre**.

| Cité | Position en base | En % de l'image | Diagnostic |
|---|---|---|---|
| Cité Médicale | `1901, 1120` | 185,6 % × 109,4 % | **hors cadre** |
| Cité des Métaux & Recyclage | `1606, 668` | 156,8 % × 65,2 % | **hors cadre** |

Une troisième ville est également hors cadre dans le tableau officiel mais a
été « rentrée » à la main en base, ce qui l'a déplacée de 137 px :

| Cité | Spec officielle | Valeur en base | Décalage |
|---|---|---|---|
| Cité du Divertissement | `1071, 406` | `934, 426` | 137 px |

**Trois valeurs en base ne correspondent plus à rien** — ni au tableau
officiel, ni à une quelconque projection :

| Cité | Valeur en base | Origine |
|---|---|---|
| Cité de l'Eau & Alimentation | `687,33 ; 309,86` | retouche manuelle à la souris |
| Cité du Carburant | `622, 750` | spec, mais Y aberrant (voir § 1.3) |
| Cité de l'Armement & Défense | `221, 791` | spec, mais Y aberrant |

### 1.3 Trois cités se chevauchent au point de se confondre

Écarts mesurés sur les valeurs actuellement en base, en unités de monde :

| Paire | Écart | Constat |
|---|---|---|
| Carburant ↔ Armement | 401 px | se confondent à tout zoom < 40 % |
| Nuke City ↔ Eau & Alimentation | 45 px | **superposées** |
| Nuke City ↔ Divertissement | 227 px | proches |
| Eau & Alimentation ↔ Divertissement | 272 px | proches |

Sur les quatre cités du nord du bassin — Bunker Oméga, Cité Industrielle, Nuke
City, Cité de l'Eau — **trois tiennent dans 165 × 195 px**, soit 6 % de la
surface de la carte, alors qu'elles sont censées être réparties de Genève à la
Camargue. C'est le défaut le plus visible à l'écran.

### 1.4 L'image de fond n'est pas à l'échelle du monde qu'elle représente

Vérification par superposition de repères terrestres réels sur
`map-lore-base.png` (planche `reperes-terrestres.png`) :

- **Gibraltar** tombe vers **y = 475 px**, soit **46 %** de la hauteur. Or la
  projection officielle place le détroit à **y = 791 px** sur 1200, soit
  **66 %** de la hauteur.
- **Genève** tombe vers **y = 270 px**, soit **26 %**. La projection officielle
  donne **y = 120 px** sur 1200, soit **10 %** — en pleine zone alpine
  stylisée, très au nord de la position dessinée.

Autrement dit : **l'image de fond et la projection officielle ne décrivent pas
le même cadrage.** La carte dessinée étire le nord (Alpes, Europe centrale) et
comprime le sud, là où la projection est régulière. Recaler les villes sur
l'image demande donc une **correspondance affine mesurée sur des repères
réels**, pas un simple changement d'échelle.

Repères relevés sur l'image, exploitables comme points de calage :

| Repère réel | Position sur l'image (px / 1024) |
|---|---|
| Détroit de Gibraltar | `108, 487` |
| Delta du Rhône (Camargue) | `302, 436` |
| Marseille | `343, 446` |
| Turin | `481, 308` |
| Genève | `430, 250` |
| Rome | `625, 368` |
| Malte *(repère de calage, pas un lieu du lore au départ)* | `814, 404` |
| Alexandrie | `865, 512` |
| Alger | `404, 655` |

> **Avertissement du 21 septembre 2026 — ce tableau a été relevé à l'œil, et la
> mesure au pixel le contredit partiellement.** Une segmentation du lit de sel
> par seuil de luminance (`mesure_cote.py`) donne un bassin asséché de
> **53,7 % × 49,2 %** de l'image, barycentre à **(549, 503)** — soit le centre
> géométrique de la planche. Confrontée à la projection officielle, cette
> mesure établit des écarts de **317 px (Gibraltar) à 1 044 px (Alexandrie)**.
>
> Autrement dit : **la projection officielle ne dessine pas la Méditerranée.**
> C'est une droite de régression calée sur dix points du bassin (31,2° N à
> 46,2° N) ; extrapolée, elle ne suit plus aucun trait de côte. Elle place Malte
> en Égée (`X = 1167`, 114 % de la largeur 1024) et Alexandrie à 186 %.
>
> **Conséquence pour le chantier :** la projection garde un seul rôle légitime —
> poser les dix cités de façon reproductible. Elle **ne peut pas** servir à
> dessiner la carte, et l'image de fond ne sera **pas** retouchée pour la faire
> coïncider. Voir `Corrections_positions_v2.md` § 3 pour la démonstration
> complète. Ce paragraphe remplace l'affirmation du § 1.4 selon laquelle
> « les deux ne décrivent pas le même cadrage » : c'est vrai, mais ce n'est pas
> un défaut de calage réparable — c'est une limite de méthode.

### 1.5 La couche de brouillard de guerre est branchée sur une route inexistante

`PlayerMapView.jsx` appelle :

```
GET /api/v1/gm/campaigns/:campaignId/maps/world/revealed-zones
```

Cette route **n'existe pas**. Le routeur `gm/maps.js` déclare
`/:mapId/revealed-zones` (avec un identifiant d'asset à la place de `world`), et
le routeur `gm/worldMap.js` déclare `/revealed-zones` **sans préfixe**. Aucune
des deux ne répond à l'URL appelée.

Conséquence en cascade : le 404 est **avalé silencieusement** par le `try/catch`
de `loadRevealedZones` (l'erreur part en `console.error`, personne ne la voit),
donc le joueur affiche systématiquement **zéro zone révélée**. Comme le canvas
part d'un aplat noir plein et n'en retire que les zones révélées, la vue joueur
affiche **un rectangle noir uni**, toujours, quoi que fasse le MJ.

Aggravant : l'API joueur qui lirait cette donnée est montée sous
`/api/v1/gm/…`, donc protégée par `verifyToken + requireCampaignAccess +
requireGM`. Un joueur non-MJ recevrait un 403 même si la route existait. Et le
jeton de session écran de table ne renseigne pas forcément `userId`, ce qui fait
retomber `requireCampaignAccess` sur un refus.

### 1.6 Le placement d'une ville est perdu par intermittence

`handleMouseUp` est appelé à la fois sur `onMouseUp` **et** sur `onMouseLeave`.
Sortir le curseur du canvas pendant un glissement déclenche donc deux
sauvegardes concurrentes de la même position. La seconde peut partir avec un
état antérieur au `setCities` de la première.

### 1.7 Défauts secondaires relevés dans `MapManager.jsx`

- **Effet de lueur mort.** Le bloc `ctx.shadowBlur` / `ctx.shadowColor` est
  entouré d'un `save()` / `restore()` **sans aucun tracé entre les deux** : il
  ne peint rien. La mise en avant de la ville sélectionnée est purement
  décorative dans le code, invisible à l'écran.
- **Territoire indépendant du zoom.** `territoryRadius` vaut 30 à 150 unités
  *monde*, puis est multiplié par le zoom au tracé — alors que les marqueurs,
  eux, gardent une taille écran constante. Dézoomer fait donc disparaître les
  disques de territoire sous les marqueurs, et les chevauchements des § 1.3
  deviennent illisibles.
- **`saveMap` relancé à chaque `mousemove`** pendant un pan : un `PUT` complet
  toutes les 1,5 s pendant tout le glissement.
- **`hoveredEntity` déclenche un `setState` par `mousemove`**, sans garde :
  re-rendu complet du composant à chaque pixel parcouru, alors que la détection
  pourrait être locale.
- **`Cité Médicale` à 109 % de hauteur** est le symptôme visible en jeu : le
  marqueur n'est jamais atteignable à la souris.

### 1.8 Une donnée de lore fausse en dur dans le composant

`MapManager.jsx` (l. 1052-1067) embarque une table `nom → GPS` **écrite en
dur**, avec un libellé « Position GPS » qui présente ces valeurs comme des
données du monde. Trois cités du lore n'y figurent pas (Cité des Métaux,
Cité Industrielle, Cité du Carburant), qui affichent donc « GPS non
renseigné ». Cette table doit venir des données, pas du composant.

---

## 2. Carte de ville

### 2.1 Le placement des lieux est tiré au hasard à chaque chargement

`LocalMapManager.jsx` (l. 103-104) :

```js
wx: 300 + Math.random() * 400,
wy: 300 + Math.random() * 400,
```

Chaque lieu enfant d'une ville est donc posé **au hasard dans un carré de
400 × 400**, sans aucun rapport avec la carte dessinée : le Marché d'Échanges
peut tomber dans une zone irradiée, la Citerne Centrale au milieu du désert.
Et comme la position n'est **jamais persistée** pour un lieu créé ainsi, le
tirage recommence à chaque visite. Un lieu ne se stabilise que si le MJ l'a
déplacé à la main.

### 2.2 La sauvegarde écrase le champ qu'elle croit écrire

Le composant enregistre les marqueurs dans `location.notableFeatures` sous la
forme `{ markers: [...] }`. Or `notableFeatures` est, dans le lore, un champ
**narratif** (« particularités notables » d'un lieu). En base aujourd'hui :

```
CITÉ DE L'ARMEMENT & DÉFENSE  notableFeatures = {"markers":[ … 11 entrées … ]}
NUKE CITY                     notableFeatures = {"markers":[ …  9 entrées … ]}
BUNKER OMÉGA                  notableFeatures = null
```

Le contenu narratif est donc perdu dès que le MJ place un premier marqueur, et
le format du champ dépend de s'il a été touché ou non. Les huit autres villes
ont `null` : leur carte locale est vide.

### 2.3 Le champ est absent du schéma de validation

`updateLocationSchema` (dérivé de `createLocationSchema`) déclare : `name`,
`parentLocationId`, `type`, `description`, `climate`, `population`,
`government`, `notableFeatures`. La sauvegarde des marqueurs passe donc — mais
elle fait transiter un objet métier par un champ narratif, et **il n'existe
aucun champ dédié** à la géométrie de la carte locale. C'est le motif d'erreur
déjà rencontré trois fois sur ce projet : un champ non déclaré dans un schéma
Zod est supprimé en silence.

### 2.4 Bandeau de titre absent, fond perdu

`location.imageUrl` n'est renseigné que pour **10 lieux sur 109** — les dix
cités-états. Les 99 autres (points d'intérêt, quartiers, bâtiments) n'ont
aucune image : leur carte locale s'ouvre sur un canvas vide portant des
pastilles flottantes.

L'image de secours, `client/public/assets/local_city_map.png`, **n'est
référencée nulle part** dans le code : ni dans `LocalMapManager.jsx`, ni dans
`locations.js`. Les neuf cités dont `notableFeatures` est `null` affichent
donc un vide, alors qu'une planche par défaut existe sur le disque.

### 2.5 Défauts secondaires relevés dans `LocalMapManager.jsx`

- **Les boutons de zoom sont inertes.** Ils font `setZoom(...)` sur l'état
  d'affichage, mais la boucle de rendu lit `zoomRef.current`, qui n'est jamais
  touché. Se dans `handleWheel` les deux sont mis à jour — la molette marche,
  les boutons non.
- **Le pan horizontal est perdu à chaque manipulation de marqueur.** Il n'existe
  aucun `saveLocalMap` à la fin d'un pan : seul le glissement de marqueur
  déclenche une sauvegarde, et elle ne transporte pas `pan`/`zoom`.
- **`loadBgImage` ne teste pas `onerror`.** Contrairement à la carte du monde,
  une image manquante laisse le canvas vide sans message.
- **Une taille de gizmo n'est pas exprimée en tant que telle** (rayon 10 codé en
  dur au lieu d'une constante nommée), ce qui rend le rayon de préhension
  incohérent avec le rayon de tracé (7 px).

### 2.6 Le rendu ne distingue pas la nature des lieux

Les personnes, les quartiers, les bâtiments et les lieux secrets du MJ sont
tous peints comme **la même pastille verte de 7 px**, avec la même étiquette.
Or le lore range explicitement ces lieux en familles :

- **Huit lieux structurels** présents dans les dix cités : Marché d'Échanges,
  Citerne Centrale, Générateur Principal, Mur d'Enceinte & Portes, Quartier
  Résidentiel / Taudis — plus, selon la cité, Fonderie, Raffinerie, Serres…
- **Des quartiers** (`quartier des plaisirs de la chair`, `quartier des
  chem'artistes`, `quartier des sculpteurs`…), marqués par la mention
  « quartier de l'actionnaire fondateur ».
- **Des lieux secrets, réservés au MJ** — repérés par `[mj — …]` ou
  `[lieu secret, réservé au mj]` : `les nostalgics`, `le sénat fantôme`,
  `la salle du trône — le passeur`, `la passerelle : le cyberespace de la
  source`, `la clinique du rite`, `le poste d'écoute atlantique`.
- **Des factions** (`la bourse de la douleur`, `la garde`, `les barons du jeu`).

Un lieu secret du MJ est aujourd'hui **aussi visible qu'une citerne** sur la
carte de ville. C'est un défaut de conception, pas de style.

### 2.7 Le catalogue des lieux existe déjà et n'est pas exploité

`client/src/utils/loreData.js` (160 ko) contient, pour les **neuf cités**
documentées, la liste complète de leurs lieux, la description du lieu, et les
personnages qui l'habitent. Il contient aussi les sept paramètres de chaque
cité, sa spécialité, sa force, sa faiblesse, sa particularité et son ancrage
géographique réel.

Exemple — **Nuke City** (« Le Réacteur à Ciel Ouvert »), 9 lieux :
Marché d'Échanges · Citerne Centrale · Générateur Principal · Mur d'Enceinte &
Portes · Quartier Résidentiel / Taudis · Cœur du Réacteur Nucléaire · Zone de
Refroidissement Irradiée · Centre de Recherche sur l'Énergie · Dépôt de Déchets
Toxiques.

Ce catalogue est aujourd'hui utilisé **uniquement pour les infobulles sur la
carte du monde**. Il n'alimente ni la carte de ville, ni les lieux en base — d'où
des cartes locales vides dans huit villes sur dix.

### 2.8 Ce qui manque, en une phrase

Il n'existe aujourd'hui **aucune description de ce à quoi doit ressembler la
carte d'une ville** — ni à l'écran, ni à l'impression. Les dix planches
existantes (`cite_eau.png`, `nuke_city.png`, `bunker_omega.png`…) ont été
produites sans cadre commun : styles, échelles, orientations cardinales et
densités de détail diffèrent d'une planche à l'autre. C'est cet écart que le
chantier de refonte doit d'abord combler, avant toute nouvelle production.

---

## 3. Ce que le chantier doit produire

Trois livrables, dans cet ordre.

1. **Le cahier des charges de la carte de ville** — ce qu'elle doit montrer,
   comment, et selon quelles règles. Il conditionne tout le reste : sans lui,
   toute nouvelle planche reproduira l'écart constaté au § 2.8.
2. **Le référentiel de rendu** — palette, échelle de détail, orientation,
   conventions de légende, gabarit de cadre, partagé par les seize planches
   (la carte du monde, les dix villes, et les cinq à produire).
3. **La correction du code** — brancher la projection au lieu de figer des
   coordonnées, dériver les positions de la carte du monde d'une
   correspondance mesurée sur l'image (§ 1.4), persister le placement des
   lieux, et distinguer les familles de lieux à l'écran.

---

## Annexe — Ce qui n'est pas en cause

Pour éviter de refaire ce qui est déjà fait :

- La **projection GPS** elle-même est juste (§ 1.1). C'est son branchement qui
  manque, pas son calcul.
- Les **jetons de direction artistique** sont complets et documentés
  (`index.css`, 3 couches, palette « Sel et rouille » validée). Les cartes n'ont
  pas à en inventer une nouvelle — elles doivent s'y conformer, y compris pour
  leurs îlots sombres (`--ink-on-dark`, `--ink-on-dark-muted`).
- Le **routeur `worldMap.js`** est correctement protégé
  (`verifyToken + requireCampaignAccess + requireGM`). Le défaut du § 1.5 est un
  problème de chemin et de niveau de protection pour les joueurs, pas d'absence
  d'authentification.
- Le **service `convoyGenerator.js`** consomme `city.mapX / mapY` pour calculer
  les distances de traversée. Toute correction des positions doit donc
  resynchroniser ce service — les distances de convoi sont aujourd'hui calculées
  sur des coordonnées fausses.
