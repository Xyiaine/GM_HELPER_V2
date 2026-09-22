# Référentiel visuel des cartes — v1

**Projet :** GM Helper / *La Course du Sel*
**Objet :** méthode de cohérence visuelle applicable aux seize planches
**Date :** 21 septembre 2026
**Statut :** proposition de méthode — les arbitrages sont listés au § 6

---

## Portée et méthode

Ce document ne dit pas **quoi** montrer. Il dit **comment** produire des planches
lisibles côte à côte dans la même application. Le cahier des charges
fonctionnel des cartes (à quoi sert chaque vue, quels lieux y figurent, quels
seuils de brouillard) est un livrable distinct.

Sources utilisées, toutes vérifiables :

| Source | Ce qu'elle fournit |
|---|---|
| `Cahier des charges/Chantier_cartes_v1_Constat.md` | Le relevé des défauts mesurés (§ 1.4, § 2.6, § 2.7, § 2.8) |
| `Cahier des charges/DA_Cahier_des_charges_v1.html` | La direction artistique « Sel et rouille », la métaphore du carnet de terrain |
| `client/src/index.css` | Les valeurs hexadécimales exactes (couches 1 et 2) |
| `Lore et univers/Universe_Lore_v9.txt` | Le vocabulaire sensoriel : Sel Blanc, Mur de Sel, vents, tempêtes, Rhône |
| `client/src/utils/loreData.js` | Les neuf cités : paramètres, géographie réelle, liste complète des lieux |
| `Cahier des charges/architecture et fonctionnement.md` § 7 | La table GPS officielle des dix cités |
| Les treize planches de `client/public/assets/` | Le « avant » mesuré au § 1 |

### Note de forme sur les fichiers existants

Les treize fichiers de `client/public/assets/` portent l'extension `.png` mais
leur signature binaire est `FF D8 FF E0 …` — ce sont des **JPEG**. C'est
inoffensif à l'affichage (le navigateur renifle le type), mais c'est un piège
pour tout script de contrôle qualité qui se fierait au suffixe. Les planches
sont toutes en **1024 × 1024**, sans exception — c'est le seul paramètre
aujourd'hui respecté, et il l'est par hasard.

---

## 1. Diagnostic d'écart

### 1.1 Méthode de mesure

Pour éviter un jugement d'œil, les treize planches ont été redimensionnées en
128 × 128 puis décodées colonne par colonne en TSL (teinte, saturation,
luminance). Ce qui suit est mesuré, pas ressenti.

### 1.2 Le tableau des écarts

Luminance moyenne sur 0–100, saturation moyenne sur 0–100, teinte dominante en
degrés. `% sombre` = proportion de pixels sous 15 % de luminance.

| Planche | Luminance moy. | p10 | p90 | Saturation | Teinte dom. | % sombre | % clair |
|---|---:|---:|---:|---:|---:|---:|---:|
| `bunker_omega.png` | **21,9** | 10,2 | 38,0 | 17,7 | — (neutre) | **34 %** | 0 % |
| `cite_industrielle.png` | **23,8** | 15,7 | 32,9 | 23,1 | 30° | 8 % | 0 % |
| `ile_anciens.png` | 25,7 | 13,3 | 39,6 | 31,9 | **180°** | 16 % | 0 % |
| `cite_divertissement.png` | 32,4 | 17,6 | 52,2 | 30,0 | 30° | 4 % | 0 % |
| `map-lore-base.png` | 33,4 | 13,3 | 59,6 | 32,3 | 30° | 13 % | 1 % |
| `nuke_city.png` | 34,4 | 18,8 | 54,9 | 26,7 | **60°** | 4 % | 3 % |
| `cite_armement.png` | 37,5 | 22,7 | 54,9 | 29,2 | 30° | 0 % | 3 % |
| `cite_metaux.png` | 41,5 | 24,3 | 63,9 | **42,0** | — (neutre) | 0 % | 4 % |
| `world_map.png` | 47,9 | 25,5 | 74,9 | 27,1 | 30° | 2 % | 10 % |
| `cite_carburant.png` | 48,2 | 25,9 | 72,9 | 38,7 | — (neutre) | 1 % | 8 % |
| `cite_medicale.png` | 49,1 | 30,2 | 70,2 | 22,0 | 30° | 0 % | 7 % |
| `local_city_map.png` | 51,6 | 31,0 | 74,5 | 22,7 | 30° | 0 % | 10 % |
| `cite_eau.png` | **55,6** | 32,9 | 83,9 | 35,7 | 30° | 0 % | **21 %** |

**Écart de luminance : 21,9 contre 55,6, soit un rapport de 2,5 pour 1.** Deux
planches posées côte à côte dans la même vue n'ont pas la même exposition du
tout. `bunker_omega.png` est un îlot nocturne à 34 % de pixels quasi noirs ;
`cite_eau.png` est une planche de plein jour avec 21 % de pixels quasi blancs.
Aucune des deux n'est fautive en soi — c'est leur coexistence qui l'est, et
c'est exactement ce que le § 2.8 du constat décrit.

### 1.3 Quatre écoles graphiques coexistent

En croisant les mesures et l'examen des planches, quatre familles se
distinguent nettement. Ce ne sont pas des nuances : ce sont des méthodes de
travail différentes, probablement obtenues par des prompts différents, voire
par des modèles différents.

**École A — le plan d'architecte nocturne** (`bunker_omega.png`, et dans une
moindre mesure `ile_anciens.png`).
Trait géométrique, orthogonale, vue strictement de dessus, aplats sombres `#3E3A36`
à `#4A443C`, et surtout des **traits lumineux néon** (cyan, vert, orange) en
incrustation. La boussole est réduite à une lettre `E`, `O`, `C` — une
convention de plan technique, pas de carte. Luminance 21,9. C'est une planche
de *blueprint* de science-fiction : elle ne doit rien au carnet de terrain.

**École B — la gravure enluminée** (`cite_eau.png`, `cite_medicale.png`,
`local_city_map.png`, `world_map.png`, `cite_armement.png`).
Trait à la plume, perspective cavalière (trois quarts), ombres hachurées,
texture de papier visible, cartouche de titre en bas, rose des vents dessinée.
Luminance 37 à 55. C'est de très loin l'école la plus proche de la direction
artistique « carnet de terrain » — mais elle est peinte en **clair**, alors que
la DA range les cartes parmi les îlots sombres (`--ink-on-dark`).

**École C — le diorama vidéoludique** (`nuke_city.png`, `cite_industrielle.png`,
`cite_metaux.png`, `cite_carburant.png`, `cite_divertissement.png`).
Vue quasi à l'horizon, profondeur atmosphérique marquée, éclairage dramatique
avec sources colorées intenses — le vert de réacteur saturé de `nuke_city.png`,
l'orange de forge de `cite_metaux.png`. Rendu de moteur de jeu, dense, avec de
la brume de profondeur. `cite_metaux.png` atteint **42,0 de saturation** — dix
points au-dessus de tout le reste — précisément à cause de cet orange.

**École D — la carte topographique désaturée** (`map-lore-base.png`).
Vue de dessus, palette de gris-brun `#423C2F` à `#898263`, aucun cartouche,
aucune rose des vents, aucune étiquette. Luminance 33,4. C'est un fond, pas une
planche — mais c'est aussi le seul document qui prétend couvrir tout le bassin.

### 1.4 L'écart le plus grave : `nuke_city.png` contre `cite_eau.png`

C'est la comparaison demandée, et elle porte sur **six paramètres simultanés** :

| Paramètre | `cite_eau.png` (école B) | `nuke_city.png` (école C) |
|---|---|---|
| **Perspective** | Trois quarts plongeante, caméra à ~45° | Quasi frontale, horizon visible en haut de cadre |
| **Horizon** | Absent — la planche est entièrement vue du dessus | Présent à ~8 % de la hauteur, avec ciel et nuages |
| **Palette** | Beige `#A48A68`, bleu canal `#6E7C6E`, vert serre `#7A8C5E` | Vert `#3C4A3A` à `#4E5A3C`, sol brun-gris, vert néon saturé `#6EE03A` |
| **Saturation** | 35,7 % | 26,7 %, mais avec des pointes néon à 100 % |
| **Lumière** | Jour haut, ombres portées franches vers le nord-ouest | Nuit tombante, ciel plombé, lueurs vertes auto-émises au sol |
| **Niveau de détail** | ~40 bâtiments individualisables, tous lisibles | ~70 masses distinctes, dont la plupart sont des textures non différenciées |
| **Trait** | Contour d'encre continu, 2–3 px, présent sur chaque arête | Trait absent par endroits, remplacé par du contraste de valeur |
| **Texte incrusté** | Cartouche `- LA CITÉ DE L'EAU -` en bas, rose des vents en bas à gauche | Étiquettes anglaises flottantes : `Zones I`, `Main St.`, `Shattered` |
| **Orientation** | Rose des vents explicite, nord en haut | Aucun repère cardinal |
| **Cadre** | Filet à coin orné, marge de ~30 px | Filet noir pointillé, marge de ~12 px |

Deux défauts sautent aux yeux et sont les plus coûteux :

1. **Le texte incrusté de `nuke_city.png` est en anglais** (`Main St.`,
   `Shattered`). Une planche française portant des étiquettes anglaises est
   inutilisable telle quelle devant des joueurs.
2. **`cite_eau.png` montre une rivière bleue en eau.** Le lore est explicite :
   le bassin est un désert de sel, et le Rhône est *le seul* cours d'eau vivant.
   Une planche qui peint de l'eau bleue à sept autres cités contredit la bible.
   C'est un défaut de contenu, pas de style, mais il naît du même laisser-faire.

### 1.5 Ce qui diverge, en une ligne par paramètre

| Paramètre | État actuel | Ce que le § 2 doit fixer |
|---|---|---|
| Cadrage | 1024² partout, mais marges de 12 à 30 px et quatre styles de filet | Une marge et un filet uniques |
| Orientation | Rose des vents explicite sur 4 planches, lettre `E` sur 1, rien sur 8 | Nord en haut, rose des vents normalisée |
| Trait | Quatre natures : plume, contour synthétique, géométrique, absent | Une seule nature |
| Palette | Luminance 21,9 → 55,6 ; saturation 17,7 → 42,0 | Une plage bornée par cité |
| Lumière | Jour rasant, nuit, heure dorée, studio | Une convention d'azimut |
| Détail | 25 → plus de 100 structures lisibles | Une fourchette cible |
| Texte | Incrusté sur 2 planches, en anglais | Aucun texte incrusté |
| Genre | Plan technique, gravure, diorama, carte topographique | Le carnet de terrain, et lui seul |

---

## 2. La signature visuelle commune

C'est le cœur du document. Tout ce qui figure ici doit être **identique** sur
les seize planches, sans négociation par cité. Seule la couleur dominante de la
cité (§ 3) varie.

### 2.1 Cadrage, marge et filet

| Élément | Valeur | Justification |
|---|---|---|
| Format | **1024 × 1024 px**, carré | Déjà respecté par les treize planches — on ne casse pas l'acquis |
| Marge de sécurité | **56 px** sur les quatre côtés | L'interface superpose des contrôles (zoom, légende, boutons) sur les bords. 56 px est la zone que le canvas recouvre aujourd'hui |
| Filet extérieur | Rectangle **plein**, épaisseur **6 px**, à 24 px du bord | Trait peint, pas vectoriel : deux passes de pinceau, léger débord aux angles |
| Filet intérieur | Rectangle **plein**, épaisseur **2 px**, à 34 px du bord | Le double filet est la signature du carnet de terrain — c'est la convention des planches gravées |
| Zone de dessin utile | **936 × 936 px** centrée | 1024 − 2 × 44 |
| Cartouche de titre | Emplacement **réservé bas-centre**, 340 × 92 px, à 96 px du bas | Zone **laissée vide**, non peinte. Le cartouche est ajouté par l'interface (§ 2.6) |

Le filet est **peint avec la même encre que le trait de la carte**, en valeur
légèrement plus soutenue. Il ne doit jamais être un rectangle vectoriel net :
c'est un tracé de plume qui a un peu bougé.

### 2.2 Orientation cardinale

**Le nord est en haut, sur les seize planches. Aucune exception, sur aucune
planche, quelle que soit la cité.** C'est le paramètre le moins négociable du
référentiel : la carte du monde, la carte de ville et les planches de secours
seront lues ensemble, et un décalage d'orientation rend le raisonnement
spatial faux.

Matérialisation, identique partout :

- **Rose des vents à huit branches**, dans l'angle **supérieur gauche**.
- Boîte de 104 × 104 px, centrée à **82 px du bord gauche** et **82 px du bord
  haut**, donc entièrement dans la marge de sécurité.
- Branche nord plus longue, terminée par une pointe pleine, et portant la
  lettre **`N`** — pas `Nord`, pas de lettre ailleurs. Les sept autres
  branches sont vides.
- Tracée au même trait, en `--ink-on-dark` ou en teinte dominante de la cité.
- **Pas de graduation, pas de degrés, pas de second repère.** Une rose
  décorative est un naufrage visuel à 1024 px.

Pourquoi l'angle supérieur gauche : le cartouche occupe le bas-centre, la
légende de cité occupera le bas-droit, et l'interface pose ses contrôles de zoom
en haut à droite. Le seul coin libre sur toutes les planches est en haut à
gauche.

### 2.3 Traitement du trait

| Élément | Décision |
|---|---|
| Nature | **Encre gravée.** Trait de plume à épaisseur variable, avec un léger empâtement aux angles et un effilement aux extrémités |
| Épaisseur | **1,5 px** pour les détails intérieurs, **3 px** pour les contours de structure, **5 px** pour le périmètre de la cité et le trait de côte |
| Rapport au remplissage | **Toute masse est cernée.** Aucune forme n'existe par sa seule valeur — c'est la règle qui distingue une gravure d'un rendu 3D |
| Ombres | **Hachures parallèles**, à 45°, densité proportionnelle à l'ombre. Jamais de dégradé lisse, jamais d'ombre portée floue |
| Réserve | Le **hachage est réservé aux volumes verticaux** (tours, falaises, murs). Au sol, la hiérarchie passe par la trame de texture, pas par l'ombre |

**Interdit explicitement :** le contour synthétique uniforme et la texture
photographique. Ce sont les deux signatures qui trahissent un rendu 3D
(école C) et qu'il faut éliminer.

### 2.4 Palette et règle d'emploi

Toutes les valeurs ci-dessous viennent de `client/src/index.css`, couches 1 et
2. Aucune n'est inventée. Les trois valeurs marquées **(extension)** sont
proposées ici parce que la DA n'a pas prévu de teinte de sol, et sont signalées
comme telles.

**Socle de l'îlot sombre.** Une planche est un îlot sombre : l'interface autour
est en papier clair, la planche est le document posé dessus, dans l'ombre de sa
propre reliure.

| Rôle | Jeton | Valeur | Emploi |
|---|---|---|---|
| Fond général | — | `#1B1916` **(extension)** | Aplat de fond, hors zone dessinée. Dérivé de `--ink #1F1C18` descendu de 2 % |
| Sol / terrain | — | `#2E2A25` **(extension)** | Désert de sel, reg, sable durci. Dérivé de `--paper-sunken` inversé |
| Sel Blanc | `--ink-on-dark` | `#E8E3D8` | Étendues salines, cristallisation, traînées de vent. **C'est la valeur la plus claire autorisée** |
| Sel en lumière | — | `#F2EEE4` **(extension)** | Uniquement les crêtes surexposées sous le soleil, ≤ 4 % de la surface |
| Eau / Rhône | `--artificial` | `#3A5F8A` | Le **seul** cours d'eau du bassin. Interdit partout ailleurs |
| Végétation mutante | `--reactor` | `#4A7C3F` | Serres, cultures, flore adaptée |
| Rouille / ferraille | `--rust` | `#A8501E` | Carcasses de navires, tôles, charpentes effondrées |
| Rouille claire | `--rust-soft` | `#C97A3E` | Arêtes de métal accrochant la lumière |
| Braise | `--ember` | `#C4801A` | Horizon, poussière en suspension, fournaises |
| Danger | `--ember-red` | `#B3392E` | Zones irradiées, friches radioactives, issues condamnées |
| Neutre technique | `--artificial` | `#3A5F8A` | Structures pré-guerre intactes, béton, verre |
| Mystère | `--arcane` | `#6B4E8C` | Lieux secrets — **usage réservé à la couche interface, jamais peint** |
| Encre de trait | `--ink-on-dark` | `#E8E3D8` | Tous les contours |
| Encre secondaire | `--ink-on-dark-muted` | `#A9A399` | Étiquettes peintes, si le § 2.6 est infirmé |

**Règle d'emploi, en cinq points :**

1. **Le sol occupe 60 à 75 % de la surface.** C'est la règle qui empêche
   `nuke_city.png` de se reproduire : sur cette planche, les verts néon
   couvrent près de 40 % de la surface, alors qu'ils devraient en couvrir 8.
2. **Une seule teinte d'accent est saturée par planche** — celle de la cité
   (§ 3). Toutes les autres sont employées en valeur, à moins de 40 % de
   saturation. C'est ce qui fait tenir la cohérence d'ensemble : seize planches,
   seize accents différents, mais **jamais deux accents saturés sur la même
   image**.
3. **Le Sel Blanc est la seule valeur claire.** Aucun autre élément ne dépasse
   `--ink-on-dark` en luminance, à l'exception de la crête de sel surexposée.
4. **Les teintes d'accent sont peintes en aplats tramés**, pas en dégradés
   lumineux. Un vert de réacteur se peint comme une trame, pas comme un halo.
5. **Le noir pur est interdit.** Comme sur le papier, où l'on n'écrit jamais
   au noir `#000` : le fond le plus sombre est `#1B1916`.

**Conciliation avec la hiérarchie de valeurs.** Une carte topographique exige
sept ou huit paliers de valeur lisibles. Un îlot sombre semble n'en offrir que
trois ou quatre. La solution est de **caler l'échelle non pas sur la luminosité
mais sur la teinte et la trame**, et de réserver la valeur à trois usages
seulement :

- `#1B1916` → `#2E2A25` : fond, hors-sujet
- `#2E2A25` → `#5A5347` : sol, gravier, ombres hachurées (5 paliers possibles par densité de hachage)
- `#A9A399` → `#E8E3D8` : sel, eau en lumière, arêtes

Entre ces trois zones, la distinction se fait par **la densité de trame et la
teinte**, pas par le gris. C'est exactement ce que fait une gravure ancienne
imprimée en deux encres, et c'est la technique que le référentiel impose.
Contrôle : réduite en niveaux de gris, une planche conforme doit montrer **au
moins six paliers distincts** sur l'histogramme.

### 2.5 Lumière

Le lore fournit deux régimes, et ils sont exploitables tels quels
(`Universe_Lore_v9.txt`, `LES VENTS DU BASSIN`, l. 269-286) :

- **Le Vent Blanc (jour)** : le sol du bassin chauffe et aspire le froid du
  Nord. Vent Nord → Sud, toute la journée, constant.
- **L'Haleine du Sud (nuit)** : le vent s'inverse, Sud → Nord, toute la nuit.

À quoi s'ajoute (`LES TEMPÊTES DU BASSIN`, l. 288-341) le fait qu'une tempête de
sel « lave » l'air de ses radiations — l'air est donc **plus clair, plus
cisaillé, plus contrasté** après une tempête qu'avant.

**Convention de lumière commune, applicable aux seize planches :**

| Paramètre | Valeur |
|---|---|
| Azimut | **Soleil au sud-est**, donc venant de la droite et légèrement de l'arrière du cadre |
| Direction des ombres | **Vers le nord-ouest**, soit vers le haut et la gauche du cadre |
| Hauteur | Basse — entre 10° et 20°, ce qui allonge toutes les ombres |
| Rendu | Lumière dure, ombres nettes, **aucune brume de profondeur** |
| Contraste | Élevé : rapport de 1 à 9 entre les hautes lumières de sel et les ombres de sol |
| Température | Chaude au sol (`#C4801A` en poussière), froide dans les ombres (`#3A5F8A` en pénombre) |

Deux conséquences pratiques. D'abord, **les ombres vont toutes du même côté sur
les seize planches** : c'est le repère qui donne l'impression d'un monde, et non
de seize commandes. Ensuite, l'azimut sud-est est choisi pour que la rose des
vents, en haut à gauche, tombe **du côté éclairé** — un objet de lecture ne doit
jamais être dans l'ombre.

*Variante assumée pour Nuke City et Bunker Oméga :* ces deux cités sont
nocturnes par nature (§ 3). Pour elles seules, la convention est **inversée sans
être abandonnée** : l'azimut passe au nord-ouest et les ombres vont au sud-est,
symétriquement. La direction change, la règle ne change pas.

### 2.6 Niveau de détail — la règle mesurable

C'est, comme annoncé, le paramètre le plus difficile à garantir par prompt.
Soyons directs : **aucun générateur d'images ne respecte une consigne de
densité numérique de façon fiable.** Demander « exactement 48 structures » ne
produit pas 48 structures. La consigne utile est donc différente : on ne compte
pas les structures, on **borne la hiérarchie de tailles**, ce qui est une
contrainte que les modèles respectent beaucoup mieux.

**Règle des quatre rangs.** Chaque planche doit montrer un objet de chaque rang,
et un seul objet de rang 1 :

| Rang | Nombre | Taille relative | Nature |
|---|---:|---|---|
| 1 — l'objet signature | **1** | 25 à 40 % de la zone utile | Le réacteur, le Colisée, la raffinerie, le cénotaphe. C'est ce qu'on reconnaît en vignette |
| 2 — les monuments | **3 à 5** | 8 à 15 % chacun | Les lieux structurels de la cité : Citerne, Générateur, Mur, Marché |
| 3 — les quartiers | **5 à 8** | 2 à 6 % chacun | Tissu urbain différencié, identifiable par sa texture |
| 4 — le grain | illimité | < 1 % | Habitations, tentes, débris. Non compté, non étiquetable |

**Cible chiffrée, à titre de contrôle :** entre **26 et 40 éléments de rang 2
à 4 lisibles à 100 % de zoom**, hors grain. En dessous de 26, la planche paraît
vide (`cite_medicale.png` est dans ce cas : de grandes étendues sans
information). Au-dessus de 40, elle devient illisible en vignette et
impossible à étiqueter (`cite_industrielle.png` y est franchement).

**Stratégie de repli, à appliquer systématiquement.** Comme le respect du
compte n'est pas garanti, la conformité d'une planche ne se juge **jamais** sur
le total. Elle se juge sur :

1. la présence **certaine** de l'objet de rang 1 (si le réacteur n'est pas
   identifiable en vignette, la planche est rejetée, quel que soit le reste) ;
2. la présence d'au moins trois objets de rang 2 (les lieux du lore, § 4) ;
3. un sol couvrant 60 à 75 % de la surface (§ 2.4, règle 1) — c'est le
   contrôle de densité qui, lui, **est mesurable objectivement** après coup.

Autrement dit : on ne mesure pas le détail, on mesure **le vide**. Un excès de
grain n'est pas récupérable, mais un manque de détail se corrige au tirage.

### 2.7 Densité de texte incrusté — la recommandation

**Avis : je confirme, le texte ne doit pas être incrusté dans l'image.** Quatre
raisons, dans l'ordre de force :

1. **Il ne sera pas traduisible.** Le cas est déjà là : `nuke_city.png` porte
   `Main St.`, `Zones I`, `Shattered`. Une planche française avec des étiquettes
   anglaises ne peut pas être montrée telle quelle. Une image incrustée ne se
   corrige pas — il faut regénérer, et une regénération ne redonne jamais la
   même image.
2. **Il ne sera pas repositionnable.** L'interface doit pouvoir dessiner une
   étiquette *à côté* du lieu, la décaler quand elle chevauche, la masquer
   quand le brouillard est actif, l'afficher en infobulle au survol. Tout cela
   est impossible sur du texte peint.
3. **Il sera illisible à l'impression et à la réduction.** Les aperçus PDF du
   projet (`Apercu_cartes_105x180mm.pdf`, `Apercu_planche_A4.pdf`) imposent un
   format de 105 × 180 mm. Une étiquette peinte sur une planche de 1024 px
   rétrécie à cette taille devient une tache. Le texte de l'interface, lui,
   reste net à toute échelle : il est vectoriel.
4. **Il mentira.** Les positions des lieux sont aujourd'hui tirées au hasard
   (`Chantier_cartes_v1_Constat.md` § 2.1) et le brouillard de guerre ne
   fonctionne pas (§ 1.5). Une étiquette peinte afficherait donc des noms sur
   des lieux qui ne sont pas à leur place, et des lieux que le joueur n'a pas
   encore découverts.

**Ce que le référentiel impose à la place :**

- **Zéro texte incrusté**, à l'exception du chiffre `06h12` s'il est justifié
  diégétiquement (§ 6, point 4). Ce chiffre est un motif du lore, pas une
  étiquette — sa présence dans la matière de l'image est cohérente, sa
  fonction n'est pas informative.
- **Le cartouche de titre est réservé mais vide** (§ 2.1). L'interface y posera
  le titre en `--font-title` (Zilla Slab), conformément à l'attribution de la
  DA : « titres de cartes ».
- **Les lettres seules sont tolérées** : le `N` de la rose des vents. Une
  lettre ne se traduit pas et ne se repositionne pas.
- **Aucun chiffre, aucun toponyme, aucune légende peinte.**

Corollaire pour l'autre intervenant : le cahier des charges fonctionnel des
cartes doit prévoir, côté interface, une **couche d'étiquettes** — police
`--font-data` (IBM Plex Mono) pour les codes et coordonnées, `--font-ui` pour
les noms de lieux, en `--ink-on-dark` sur fond `#1B1916` à 85 % d'opacité, avec
un filet de 1 px en `--rule-strong`. C'est cette couche, et non l'image, qui
portera l'information.

---

## 3. L'identité chromatique par cité

Les teintes proposées sont toutes dérivées de la palette `index.css`. Les
paramètres cités viennent de `loreData.js` (champ `params`, sur 100).
**Rappel de la règle § 2.4, point 2 : une seule teinte saturée par planche.**

| # | Cité | Teinte dominante | Teinte secondaire | Justification tirée du lore |
|---|---|---|---|---|
| 1 | **Divertissement** (Rome) | `--arcane` `#6B4E8C` — pourpre profond, en aplat tramé | `--ember` `#C4801A` — or des gradins | Bonheur **95** (le plus haut du monde), Armement **35** (le plus bas). Cité du spectacle et du mensonge : le pourpre est la couleur du rideau et de l'illusion. Aucune rouille, aucun fer — la cité achète ce qu'elle ne produit pas |
| 2 | **Médicale** (Alexandrie) | `--ink-on-dark` `#E8E3D8` — blanc clinique | `--artificial` `#3A5F8A` — bleu des instruments | Santé **95**, Carburant **25**. La cité du blanc : linge, chaux, verre. C'est la seule cité dont la dominante est une valeur plutôt qu'une teinte, et c'est volontaire — le blanc du Sel Blanc est aussi son monopole de filtration |
| 3 | **Nuke City** (Marseille) | `--reactor` `#4A7C3F` — vert de réacteur | `--ember-red` `#B3392E` — rouge irradié | Technologie **95**, Carburant **100**, Santé **25**, Bonheur **35**. « Ville lumineuse dans le désert, crainte de tous. » C'est la planche que le lore autorise à être nocturne, et la seule où un vert saturé est légitime |
| 4 | **Eau & Alimentation** (Camargue) | `--reactor` `#4A7C3F` — vert des serres | `--artificial` `#3A5F8A` — le Rhône | Nourriture **95**, Armement **85**. C'est la seule cité où l'eau bleue est légitime — le Rhône y finit sa course. Attention : **risque de confusion avec Nuke City**, voir ci-dessous |
| 5 | **Bunker Oméga** (Genève) | `--artificial` `#3A5F8A` — « lumière d'un bleu artificiel » | `--ink-on-dark` `#E8E3D8` — acier nu | Technologie **100**, Armement **100**, Bonheur **55**. Le lore nomme littéralement « la lumière d'un bleu artificiel ». Cité souterraine : la planche est un plan technique, vue de dessus stricte |
| 6 | **Armement & Défense** (Gibraltar) | `--rule-strong` `#B8B0A0` — pierre sèche | `--rust` `#A8501E` — acier corrodé | Armement **100**, Santé **60**. Adossée au Mur de Sel. La dominante est minérale, pas métallique : c'est un ouvrage de pierre fortifié, la rouille n'est que l'usure du fer |
| 7 | **Industrielle** (Turin) | `--rust-deep` `#8A3D14` — rouille profonde | `--ember` `#C4801A` — braise des hauts-fourneaux | Technologie **95**, Santé **35**, Bonheur **45**. « Usines colossales, ville noyée dans la fumée. » La cité la plus rouille du bassin, au sens propre |
| 8 | **Métaux & Recyclage** (Malte) | `--rust-soft` `#C97A3E` — ferraille claire | `--rule-strong` `#B8B0A0` — alliages | Richesse **90**, Santé **30**. « Gratte-ciels effondrés, cernée de carcasses de milliers de navires. » Dominante plus claire que la Cité Industrielle : ici le métal est *récupéré*, donc oxydé en surface et brillant là où il est cassé. Attention : **risque de confusion avec la Cité Industrielle**, voir ci-dessous |
| 9 | **Carburant** (Alger) | `--ink` `#1F1C18` — le Sang Noir | `--ember` `#C4801A` — torchères | Carburant **95**. Le pétrole est sacralisé en « Sang Noir » par un culte omniprésent. Dominante **noire** et non brune : c'est la planche la plus sombre du jeu avec Bunker Oméga, mais pour une raison opposée — Oméga est bleu-acier, Alger est suie |
| 10 | **Île des Anciens** (Atlantique) | `--artificial` `#3A5F8A` — houle atlantique | `--reactor` `#4A7C3F` — végétation | La seule terre non asséchée du jeu : elle a émergé du recul des mers. Dominante froide et **verte**, unique dans le corpus — la planche la plus saturée en vert après Nuke City, mais un vert végétal, jamais néon |

### 3.1 Les trois risques de confusion, et comment les séparer

**Risque 1 — Nuke City / Cité de l'Eau (le plus grave).**
Les deux ont le vert de réacteur pour dominante. Écart actuel des positions en
base : **45 px**, elles sont superposées (`Constat` § 1.3). Séparation retenue :

- Nuke City est **nocturne, saturée, rouge en secondaire** ; la Cité de l'Eau
  est **diurne, dessaturée, bleue en secondaire**.
- Le vert de Nuke City est un vert **auto-émis** — il apparaît en trame dense
  au centre de l'image, sur un fond noir. Le vert de la Cité de l'Eau est un
  vert **réfléchi** — il apparaît en trames clairsemées sous les serres, sur un
  sol de sel clair.
- Test de reconnaissance en vignette : si la planche paraît lumineuse par
  elle-même, c'est Nuke City.

**Risque 2 — Cité Industrielle / Cité des Métaux.**
Même famille brun-orangé. Séparation retenue : l'Industrielle est **verticale**
(cheminées, hauts-fourneaux, masses hautes) et sa rouille est *profonde*
(`#8A3D14`) ; les Métaux sont **horizontales** (champs de carcasses, gratte-ciels
couchés) et leur rouille est *claire* (`#C97A3E`). La silhouette générale de la
planche doit suffire à les distinguer avant toute couleur.

**Risque 3 — Armement / Métaux.**
Les deux emploient `--rule-strong` en secondaire. L'Armement est **minéral et
compact** (un seul ouvrage fortifié, masse continue) ; les Métaux sont
**éclatés et dispersés** (pas de périmètre continu). À l'Armement, le secondaire
est un remplissage ; aux Métaux, c'est un accent sur des arêtes.

**Contrôle automatique proposé.** Après génération, calculer la **teinte
dominante** de chaque planche et vérifier qu'aucune paire du tableau § 3 ne
tombe dans un écart inférieur à 25° de teinte *ou* 15 points de saturation.
C'est une vérification scriptable, et c'est le seul paramètre chromatique qui
se contrôle réellement par machine.

---

## 4. Le gabarit de prompt

### 4.1 Ordre canonique des blocs

Chaque prompt suit **exactement** cet ordre, sur seize planches. L'ordre
n'est pas cosmétique : les générateurs accordent plus de poids aux premiers
tokens, et placer le style invariant en tête garantit qu'il n'est pas écrasé par
le contenu propre à la cité.

```
[1] PRÉAMBULE INVARIANT      — collé tel quel, identique sur les 16 planches
[2] SUJET                    — la cité et son objet de rang 1
[3] CADRAGE                  — format, perspective, échelle, orientation
[4] PALETTE                  — dominante, secondaire, taux de sol, littéraux hex
[5] LUMIÈRE                  — azimut, hauteur, dureté, température
[6] TRAIT ET TEXTURE         — nature du trait, ombres, trame
[7] ÉLÉMENTS OBLIGATOIRES    — les lieux réels, dans l'ordre hiérarchique
[8] GRAIN ET DÉTAIL          — règle des quatre rangs, densité de sol
[9] NÉGATIFS                 — la liste noire, identique sur les 16 planches
```

Les blocs **[1]** et **[9]** sont rigoureusement identiques d'une planche à
l'autre. Les blocs **[3]**, **[5]**, **[6]** et **[8]** sont **identiques à 90 %**
et ne varient que sur les trois exceptions documentées (Nuke City, Bunker Oméga,
Île des Anciens). Les blocs **[2]**, **[4]** et **[7]** sont propres à la cité.

### 4.2 Le préambule de style invariant

> **Bloc [1] — à coller à l'identique en tête de chaque prompt. Ne rien y changer.**

```
Illustration cartographique dans le style d'un carnet de terrain d'expédition
du début du XXe siècle, gravée à la plume et à l'encre, puis lavée à l'aquarelle
sèche. Vue plongeante d'une cité fortifiée isolée dans un désert de sel.
Technique : trait de plume à épaisseur variable, contours cernant chaque masse,
ombres rendues par hachures parallèles à 45 degrés, texture de trame au sol,
aucune ombre floue, aucun dégradé lisse, aucune brume de profondeur.
Palette : image à dominante sombre — le fond est un noir chaud #1B1916, le sol
un gris-brun #2E2A25, les hautes lumières sont un blanc de sel #E8E3D8. Une
seule teinte d'accent saturée par image. Pas de noir pur, pas de couleur fluo.
Lumière : soleil bas à 15 degrés au-dessus de l'horizon, venant du sud-est,
toutes les ombres portées vers le nord-ouest, contraste élevé, air sec et net.
Cartographie : orientation nord en haut, une rose des vents à huit branches dans
l'angle supérieur gauche, une seule branche longue portant la lettre N.
Composition : filet peint de 6 pixels en bordure à 24 pixels du bord, second
filet de 2 pixels à 34 pixels du bord, zone de dessin centrée laissant une marge
de 44 pixels sur les quatre côtés, et une zone vide réservée au bas-centre de
l'image pour recevoir un cartouche de titre.
```

### 4.3 Les négatifs — liste canonique

> **Bloc [9] — à coller à l'identique en fin de chaque prompt.**

```
NÉGATIFS : texte, lettres, mots, chiffres, étiquettes, légende, cartouche
rempli, échelle graduée, nom de lieu écrit, signature, filigrane, cadre
vectoriel net, image de synthèse, rendu 3D lisse, moteur de jeu vidéo, éclairage
de studio, source lumineuse visible dans le cadre, halo lumineux, néon, glow,
bloom, flou, bokeh, profondeur de champ, symétrie artificielle, motif répétitif
régulier, perspective isométrique parfaite, lignes droites mécaniques, dégradé
de ciel lisse, nuages photoréalistes, eau bleue turquoise, mer, océan plein,
vague, palmier, forêt tempérée, arbre feuillu européen, verdure luxuriante,
pelouse, neige, glace, architecture moderne, gratte-ciel intact en verre, voiture
récente, panneau de signalisation contemporain, éclairage électrique urbain
fonctionnel, personne au premier plan, visage, foule, animal fantastique, dragon,
robot, vaisseau spatial, élément médiéval européen, château de conte, style
aquarelle enfantine, style dessin animé, style comic, contours épais uniformes,
couleurs pastel vives, saturation maximale, image claire lumineuse de plein jour,
plage de sable jaune, ciel bleu d'été.
```

**Justification des trois familles de négatifs**, car une liste noire sans
explication se dégrade dès qu'on l'allège :

- **Le texte.** Conséquence directe du § 2.6. `nuke_city.png` en porte trois
  occurrences en anglais.
- **Les marqueurs de rendu 3D** (`rendu 3D lisse`, `moteur de jeu vidéo`,
  `perspective isométrique parfaite`, `contours épais uniformes`). Ce sont les
  signatures de l'école C, celle de `nuke_city.png` et `cite_industrielle.png`.
- **L'imaginaire méditerranéen tempéré** (`eau bleue turquoise`, `palmier`,
  `forêt tempérée`, `pelouse`, `carte postale balnéaire`). C'est le piège
  spécifique de ce projet : demander une ville du sud à un générateur produit
  par défaut une marina. Or le bassin est un **désert de sel**. C'est ce
  négatif qui empêche `cite_eau.png` de se reproduire avec sa rivière bleue.

---

## 5. Stratégie de contrôle qualité

### 5.1 Ce qui se contrôle par machine

Trois vérifications sont scriptables et doivent être **systématiques** :

| # | Contrôle | Mesure | Seuil |
|---|---|---|---|
| M1 | Format | Dimensions du fichier | Exactement 1024 × 1024 |
| M2 | Exposition | Luminance moyenne sur 128 × 128 | Entre **28 et 42** / 100. Hors bornes → rejet |
| M3 | Occupation du sol | Proportion de pixels dans la plage `#242019`–`#3A352C` | Entre **60 et 75 %** de la surface |
| M4 | Accent unique | Nombre de familles de teintes saturées (S > 55) distinctes | **1 seule** |
| M5 | Confusion inter-cités | Écart de teinte dominante entre paires du § 3.1 | > 25° de teinte **ou** > 15 pts de saturation |
| M6 | Paliers de valeur | Paliers distincts sur l'histogramme en niveaux de gris | **≥ 6** |
| M7 | Marge | Luminance moyenne des bandes de 40 px en bordure | Inférieure à celle du centre (la marge est un vide sombre) |

M2 est le contrôle le plus utile : c'est lui qui aurait rejeté `bunker_omega.png`
(21,9) et `cite_eau.png` (55,6) d'un seul coup, sans débat.

### 5.2 Ce qui se contrôle par l'œil — dans l'ordre

L'ordre compte : un défaut de l'étape 1 rend les suivantes sans objet.

1. **L'objet de rang 1 est-il identifiable en vignette à 96 px ?**
   Si non → rejet immédiat, sans discussion. C'est le seul contrôle
   éliminatoire.
2. **La planche est-elle lisible en niveaux de gris ?** Réduire la planche en
   noir et blanc. Si l'information disparaît, la planche repose sur la couleur
   et s'effondrera à l'impression.
3. **Les ombres vont-elles toutes dans la même direction, aux quatre coins ?**
   C'est le contrôle de la lumière § 2.5, et l'erreur la plus fréquente.
4. **La rose des vents est-elle en haut à gauche, à la bonne taille, avec un
   N ?** Vérifier qu'aucun texte parasite ne s'y est glissé.
5. **Les lieux obligatoires du § 4 sont-ils présents et à leur place relative ?**
   Présence d'abord, position ensuite.
6. **Le sol couvre-t-il bien deux tiers de l'image ?** C'est la version visuelle
   de M3.
7. **Le cartouche réservé est-il bien vide, en bas-centre ?**
8. **La planche tient-elle à 25 % de zoom à côté de ses voisines ?**
   Contrôle final, et le plus révélateur : c'est l'usage réel.

### 5.3 La planche de comparaison

Le seul contrôle qui répond vraiment à « les planches sont-elles cohérentes »
est de les **regarder ensemble**. Construire une image de contact unique
contenant les seize planches en 4 × 4, chacune réduite à 320 px, légendée. Deux
planches qui jurent se voient instantanément, et aucune mesure ne remplace ça.

**Ce que cette planche révèle, et qu'aucun test unitaire ne montre :**

- la dérive de luminance (une planche plus claire que ses voisines) ;
- la dérive de saturation (une planche plus vive) ;
- la dérive de densité (une planche plus chargée ou plus vide) ;
- la dérive de perspective (une planche vue de plus haut ou de plus loin).

Conserver la planche de contact de chaque version. Comparer v1, v2, v3 : ce qui
s'améliore et ce qui régresse saute aux yeux d'une version à l'autre.

*Note : une planche de contact a été construite pendant la rédaction de ce
document à partir des treize planches existantes. Elle est reproductible en
quelques lignes avec n'importe quelle bibliothèque d'images — inutile de la
versionner.*

### 5.4 Rejets immédiats

Sans hiérarchie, sans jugement à porter :

- du texte, des lettres ou des chiffres incrustés, dans n'importe quelle langue ;
- un horizon et un ciel visibles (sauf mention explicite, cas de Nuke City
  uniquement, et même alors en bandeau étroit) ;
- de l'eau bleue en surface, hors du Rhône à la Cité de l'Eau et de la houle à
  l'Île des Anciens ;
- une source lumineuse visible dans le cadre, ou un halo / bloom ;
- des ombres partant dans deux directions différentes ;
- une perspective isométrique parfaite, ou des lignes mécaniquement droites ;
- une planche vide (moins de 26 éléments lisibles) ou saturée de grain
  (plus de 40) ;
- un périmètre non fermé pour une cité fortifiée — le Mur d'Enceinte figure dans
  les dix cités, sans exception.

---

## 6. Points à trancher par Hadrien

Six décisions ne relèvent pas de ce référentiel. Elles conditionnent la
production et doivent être prises avant le premier prompt.

**1. La luminance de base — le choix qui décide de tout.**
La DA range les cartes parmi les îlots sombres (`--ink-on-dark`, `index.css`
l. 29-35) et c'est ce que ce référentiel applique. Mais l'école B — celle de
`cite_eau.png`, `cite_medicale.png`, `local_map` — est peinte **en clair**, et
c'est la plus proche du « carnet de terrain » dans l'esprit. Deux voies :

- **Voie A (retenue ici)** : îlots sombres, luminance cible 28–42. Fidèle à la
  DA écrite, cohérent avec l'écran de table, mais impose une hiérarchie de
  valeurs obtenue par trame plutôt que par gris — techniquement plus difficile
  et jamais parfaitement garanti par prompt.
- **Voie B** : planches claires en papier `#F4F1EA`, posées comme des documents
  sur l'interface claire. Plus faciles à réussir, plus proches de l'école B,
  mais contredisent la note explicite de `index.css` sur les zones de dessin.

**Recommandation : voie A**, parce que la DA est écrite et validée, et parce
qu'une planche claire sur une interface claire disparaît. Mais l'arbitrage est
réel et il vous appartient.

**2. Le nombre exact de planches, et la cinquième.**
Le constat annonce seize planches ; neuf cités sont documentées dans
`loreData.js` et dix figurent au tableau GPS (`architecture et
fonctionnement.md` § 7) — l'Île des Anciens est la dixième, sans fiche
`loreData`. La bibliothèque de prompts en livre seize : carte du monde, dix
cités, cinq planches de secours. **Lesquelles des cinq sont réellement
nécessaires ?** Les deux premières de la liste (§ `Prompts_visuels_cartes_v1.md`)
sont indispensables — la planche générique comble un vide actuel. Les trois
suivantes sont un pari sur l'usage.

**3. Le Mur de Sel figure-t-il sur la carte du monde ?**
Le lore en fait l'élément structurant du monde (`Universe_Lore_v9.txt`
l. 206-220), et il est « quasiment inépuisable en Sel Blanc ». Le placer sur la
planche du monde oriente toute la campagne. À vous de dire s'il doit être
visible, ou si sa découverte fait partie du jeu.

**4. Le motif `06h12`.**
C'est un motif fort de l'univers, et la DA en fait le porteur du caractère de
l'interface (`DA_Cahier_des_charges_v1.html`, § 04). Faut-il le **graver dans la
matière** des planches — sur une stèle, un cadran, une plaque à la Citerne
Centrale ? Une seule occurrence par planche, aucune sur la carte du monde. C'est
cohérent avec le lore, mais c'est du texte incrusté, donc à autoriser
explicitement ou à écarter.

**5. Les lieux secrets et leur représentation.**
Le constat § 2.6 relève qu'un lieu `[mj — …]` est aujourd'hui dessiné comme une
citerne. Le référentiel pose que **les planches ne peignent aucun lieu secret** —
ce sont des lieux narratifs, ils n'ont pas à exister visuellement sur une
planche montrable. Confirmez-vous ? Si non, il faut une convention graphique
distincte, et elle ne peut pas être peinte (elle serait visible des joueurs).

**6. Les planches et la couche de brouillard.**
Le brouillard de guerre est branché sur une route inexistante (constat § 1.5) —
la vue joueur affiche un rectangle noir uni. Les planches doivent-elles être
pensées pour être **révélées par zones**, ou pour être vues entières ? Cela
change la composition : une planche révélée par zones doit rester lisible
découpée en quartiers indépendants, ce qui interdit les compositions centrées
fortes. À trancher avant de générer.
