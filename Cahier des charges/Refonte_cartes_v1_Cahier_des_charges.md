# Refonte des cartes v1 — Cahier des charges

**Date :** 21 septembre 2026
**Auteur du lore :** Hadrien Pérattone (MJ)
**Périmètre :** carte du monde (`MapManager.jsx`), carte de ville (`LocalMapManager.jsx`), et référentiel de rendu des seize planches graphiques.
**Document amont :** `Cahier des charges/Chantier_cartes_v1_Constat.md` — les renvois `§ x.y` désignent ses sections.
**Direction artistique :** `Cahier des charges/DA_Cahier_des_charges_v1.html`, implémentée dans `client/src/index.css`.

Ce document a deux usages, et il est écrit pour les deux :

1. **Spécification de code** — ce que les deux cartes doivent montrer et selon quelles règles (§ 2, 3, 4).
2. **Spécification de production graphique** — de quoi générer seize planches par un générateur d'images, sans question de relance (§ 5, 6).

Il ne contient ni code applicatif, ni image. Les points relevant d'un arbitrage de Hadrien sont regroupés au § 9.

---

## 1. Parti pris et héritage de la DA

### 1.1 La carte est un îlot sombre assumé

`index.css` (l. 29-35) pose déjà l'exception, et il faut la reprendre telle quelle :

> « Encres pour les surfaces sombres assumées. La table de jeu de la Course du Sel et les zones de dessin (carte du monde, carte locale, arbre de compétences) restent des îlots sombres : leur contenu est peint avec sa propre échelle de couleurs, qui deviendrait illisible sur fond clair. Elles ont donc besoin d'encres claires, distinctes de l'encre principale. »

La carte est donc légitimement un aplat sombre dans une interface de papier clair. Les raisons ne sont pas esthétiques, elles sont de lecture :

- **Le sujet de la carte est clair sur fond sombre, pas l'inverse.** Le Sel Blanc, les sols vitrifiés, les étendues salines et les cristallisations sont les éléments les plus lumineux du bassin. Les peindre sur du papier `#F4F1EA` les rendrait indistinguables de leur support. Le lore impose que le Sel Blanc soit *lu comme* une masse blanche — *Universe_Lore_v9.txt*, « LE SEL BLANC (RESSOURCE) » : « distinct du sel commun par sa pureté ». Un désert de sel ne se dessine pas sur du sable clair.
- **Les accents du monde sont des lumières, pas des encres.** Le vert du cristal de l'Aiguille Silencieuse « pulse comme un battement de cœur, visible à des kilomètres, la nuit » ; le bleu artificiel de Bunker Oméga est une source lumineuse ; l'orange braise teinte un horizon nocturne. Ces teintes sont calibrées dans `index.css` comme des **aplats**, et le commentaire l. 51-59 est explicite : posées en texte sur le papier, `--ember` (2,89:1) et `--rust-soft` (2,94:1) tombent sous le seuil de lisibilité. Sur un fond sombre, elles retrouvent leur fonction d'origine.
- **Cohérence avec l'écran de table.** La DA tranche (§ 02) que l'écran de table est la version nocturne de la même identité. La carte est projetée à la table : elle doit déjà être dans la version nocturne pour ne pas produire un flash blanc au moment de la projection.

**Conséquence directe :** `--ink-on-dark` (`#E8E3D8`) et `--ink-on-dark-muted` (`#A9A399`) sont les seules encres autorisées à porter du texte **sur** la carte. Aucun texte de carte n'utilise `--ink`, `--ink-muted` ou `--ink-faint` : ces teintes disparaissent sur le fond.

### 1.2 La métaphore du carnet de terrain, appliquée à la carte

Le carnet de terrain (DA § 02) veut dire trois choses concrètes pour une carte :

| Principe du carnet | Traduction cartographique |
|---|---|
| Le relevé est **daté et signé** | Chaque planche porte une mention de relevé en `--font-data` : un code d'identification, une date de campagne, un indice de fiabilité. C'est l'interface qui la dessine, pas la planche (§ 4.7). |
| L'annotation est **manuscrite, marginale, incomplète** | Les étiquettes sont posées **par-dessus** la planche, jamais dedans. Une note de marge peut être fausse, raturée, ajoutée après coup — c'est le principe du brouillard de guerre et des lieux secrets. |
| Le support est **un instrument de mesure** | Échelle, rose des vents, graticule : en `--font-data`, traits fins, toujours présents au même endroit. Ces repères sont ce qui distingue une carte de jeu d'une illustration. |

### 1.3 Palette autorisée pour les cartes

Les cartes forment une **palette fermée**. Aucune teinte en dehors de cette table n'est employée, hors les deux extensions nommées au § 1.4.

| Jeton `index.css` | Valeur | Emploi sur la carte |
|---|---|---|
| `--ink-on-dark` | `#E8E3D8` | Étiquettes principales, traits de graticule, rose des vents, chevrons |
| `--ink-on-dark-muted` | `#A9A399` | Étiquettes secondaires, cours d'eau mineurs, hachures de relief |
| `--paper-sunken` | `#EAE5DA` | Le **Sel Blanc** : masse saline, bassin asséché, lit d'évaporation |
| `--rule` | `#D8D2C4` | Cristallisations secondaires, croûtes de sel, voiles de poussière |
| `--rule-strong` | `#B8B0A0` | Massifs montagneux nus (Alpes, Atlas), reliefs hors bassin |
| `--ink` | `#1F1C18` | Fond de carte, eau libre (Atlantique), ombres portées |
| `--rust` | `#A8501E` | Zones vitrifiées, sols brûlés, épaves de convoi, axes routiers majeurs |
| `--rust-soft` | `#C97A3E` | Ferraille, tôle, matière urbaine rouillée |
| `--rust-deep` | `#8A3D14` | Zones irradiées profondes (dégradé sous `--rust`), cuirasses de porte |
| `--ember` | `#C4801A` | Aurore, horizon, lueurs de fonderie, feux de camp allumés |
| `--reactor` | `#4A7C3F` | **Végétation vivante uniquement** — Rhône, serres, canopée survivante |
| `--ember-red` | `#B3392E` | Marqueurs de danger, zones interdites, dispositifs actifs |
| `--artificial` | `#3A5F8A` | Eau du réseau souterrain, instrumentation pré-guerre, champs de force |
| `--arcane` | `#6B4E8C` | Ce qui relève du mythe et du spectacle (L'Île des Anciens, Cité du Divertissement) |

Trois règles d'usage, qui découlent du reste de la DA :

- **`--reactor` est un jeton rare.** Le bassin est un désert : la couleur vivante n'apparaît que là où la vie existe (le Rhône, les serres de la Cité de l'Eau, L'Île des Anciens). La répandre « pour faire joli » détruit le seul signal de survie du monde. Max 5 % de la surface d'une planche.
- **`--arcane` ne porte jamais un lieu réel.** Il signale le doute, l'illusion, la propagande. C'est la teinte de L'Île des Anciens (§ 3.6) et des spectacles de la Cité du Divertissement.
- **Tout dégradé passe par `--ink`.** Un fond de carte va de `--ink` (pleine nuit) vers `--rule-strong` (sable nu). Aucun dégradé noir→blanc pur.

### 1.4 Deux extensions de palette, à valider

Deux teintes sont nécessaires et n'existent pas dans les jetons. Elles sont nommées ici comme **extensions**, jamais employées sans cette mention.

| Nom proposé | Valeur | Justification | Si refusée |
|---|---|---|---|
| `--salt-glare` | `#F2EEE2` | Le Sel Blanc au soleil, « distinct du sel commun par sa pureté » (lore). `--paper-sunken` `#EAE5DA` tient les masses salines froides, mais pas les crêtes éclairées : sans cette réserve de blanc, le désert de sel se lit comme du sable gris, alors que c'est le sujet central du monde. | Se rabattre sur `--ink-on-dark` `#E8E3D8` en crête, au prix d'une perte de hiérarchie entre sel et étiquettes. |
| `--glass-crust` | `#6E8B8A` | Les sols vitrifiés. Le lore les décrit comme un verre poli « comme un miroir » qui reflète le ciel (*LE CIEL DU BASSIN*, *LES NUITS DU BASSIN*). Ni `--rust` ni `--artificial` ne rendent ce gris-vert luisant. | Se rabattre sur `--rule-strong` en aplat avec hachures `--ink-on-dark-muted` par-dessus. |

À ajouter, si acceptées, en couche 1 de `index.css`, sous les accents.

---

## 2. Les deux natures de carte, et pourquoi elles diffèrent

### 2.1 Ce que la carte du monde doit résoudre

Un MJ y vient pour **situer et mesurer**. En séance, trois questions, toujours les mêmes :

1. *Où est la chose ?* — un convoi, une cité, un site dangereux, une faction, un joueur.
2. *Combien de temps pour y aller ?* — la distance, donc l'échelle. `convoyGenerator.js` calcule les durées de traversée à partir de `city.mapX / mapY` (constat, annexe) : la carte **est** un instrument de mesure, pas une décoration.
3. *À qui est-ce ?* — l'appartenance de faction, et ce que les joueurs savent.

Conséquence : une carte du monde est **topographique et continue**. Elle doit rester cohérente à tous les niveaux de zoom, parce qu'on y dézoome pour lire une distance globale et qu'on y zoome pour cliquer une cité.

### 2.2 Ce que la carte de ville doit résoudre

Un MJ y vient pour **explorer et peupler**. Deux questions :

1. *Où sont les lieux ?* — les lieux réels du catalogue (`loreData.js`), pas des pastilles abstraites. Marché d'Échanges, Citerne Centrale, Cœur du Réacteur, Zone de Refroidissement Irradiée.
2. *Qu'est-ce qui est caché, et à qui ?* — ce que les joueurs voient, ce que le MJ seul voit, ce qui n'apparaît qu'une fois révélé.

Conséquence : une carte de ville est **chorographique et discontinue**. Elle montre un lieu clos, cadré, dont la composition porte du sens : là où se trouve le mur, là où est le pouvoir, là où l'on meurt.

### 2.3 Les deux grammaires

| | Carte du monde | Carte de ville |
|---|---|---|
| **Cadrage** | Le bassin entier, un seul cadrage possible | Une cité, cadrage fixe et clos |
| **Échelle** | Continue, zoom de 20 % à 400 % | Continue, zoom de 100 % à 300 %, mais l'échelle *relative* des lieux est fixe |
| **Nature du fond** | Carte topographique peinte, un seul fichier, lisible à tout zoom | Plan en perspective cavalière d'une cité, une planche par cité |
| **Sujet central** | Le désert de sel méditerranéen | Le corps urbain et son point d'ancrage au monde (le Rhône pour la Cité de l'Eau, le Mur de Sel pour l'Armement) |
| **Orientation** | Nord en haut, Mercator, graticule visible | Nord en haut, **rose des vents unique et identique sur les dix planches** |
| **Marqueurs** | 10 cités + sites de lore + convois, taille écran constante | 5 familles de lieux, tailles hiérarchisées, taille écran constante |
| **Couche dynamique** | Brouillard de guerre (zones révélées, aujourd'hui cassé — § 1.5 du constat) | Révélation par lieu (secrets MJ) et état narratif (lieu détruit, occupé) |
| **Ce qui est écrit dessus** | Rien. Aucun texte dans l'image | Rien. Aucun texte dans l'image |
| **Ajouté par l'interface** | Étiquettes, cartouche, graticule de zoom, échelle dynamique, tracés de convoi | Étiquettes, cartouche à 7 paramètres, cadre de relevé, gizmos de déplacement |

### 2.4 Ce qui est commun, ce qui diffère

**Commun — les invariants, non négociables :**

1. Fond sombre assumé, encres `--ink-on-dark` / `--ink-on-dark-muted`.
2. Palette fermée du § 1.3.
3. Aucun texte incrusté dans l'image.
4. Image au rapport du SUJET (carte du monde : **1 743 × 1 024**, rapport du bassin ; planches locales : 1024 × 1024, carrées).
5. Nord en haut.
6. Bord perdu sur une image source débordante (§ 3.4).
7. Cadrage identique d'une planche à l'autre de la même famille.

**Diffère — et c'est assumé :**

1. La carte du monde est **la seule** projection GPS exacte ; les cartes de ville sont en perspective et ne sont *pas* géoréférençables.
2. Le nombre de familles de marqueurs : 2 sur la carte du monde (cité / site), 5 sur la carte de ville.
3. La présence du brouillard de guerre : la carte du monde cache des *zones* entières ; la carte de ville cache des *lieux*.
4. Le cartouche : la carte du monde porte un titre et une échelle kilométrique ; la carte de ville porte le nom de la cité et ses **sept paramètres**.

---

## 3. La carte du monde — spécification

### 3.1 Conventions

**Projection et échelle.** La projection officielle (`architecture et fonctionnement.md`, § 7) est vérifiée exacte : les dix couples du tableau sont reproduits par la transformation linéaire à moins d'un pixel près sur l'ensemble des points (contrôle refait le 21 septembre 2026). Elle est exprimée dans sa base d'origine, **1200 × 1200** :

```
X = 47,63 × longitude + 476,04
Y = −66,68 × latitude + 3200,45        (base de référence 1200 × 1200 px)
```

Le rapport des deux coefficients vaut **1,400**.

> **Divergence relevée avec le constat.** Le constat § 1.1 écrit que 1,400 est « exactement 1 / cos(45,6°) ». C'est faux à la deuxième décimale : 1 / cos(45,6°) = **1,4293**, et 1,400 correspond à cos φ = 1/1,400, soit une latitude de **44,42°**. La conclusion du constat reste juste — c'est bien une Mercator sphérique régulière centrée sur le bassin — et le fait que le bassin s'étende de 31,2° N à 46,2° N, donc de part et d'autre de 44,4° N, est même *plus* cohérent que 45,6°. Mais la valeur 1,400 doit être employée telle quelle, et le commentaire du cahier des charges corrigé. L'écart est de 2 % d'étirement vertical : sur la hauteur du bassin (120 à 1120 px), cela représente 20 px, assez pour décaler une côte.

**Conséquence directe sur le dessin :** la carte est étirée verticalement de 40 %. Un degré de latitude occupe 66,68 px quand un degré de longitude en occupe 47,63. Les distances **ne se mesurent pas à la règle sur l'image** : toute distance affichée vient du calcul `convoyGenerator.js`, pas d'une mesure graphique. Voir règle d'or § 7.

**Extension du cadre.** La projection place les dix cités entre `X = 71` (L'Île des Anciens) et `X = 1901` (Cité Médicale), et entre `Y = 120` (Bunker Oméga) et `Y = 1120` (Cité Médicale) — soit une étendue utile de **1 830 × 1 000 px**.

> **Correction du 21 septembre 2026 (deuxième passe) — le cadre n'est pas carré.**
>
> La correction précédente retenait **2048 × 2048** en s'appuyant sur le contrôle
> ci-dessous, qui était lui-même faux : il donnait à la Cité des Métaux la
> position d'Athènes. Le contrôle refait, avec Malte et un balayage complet :
>
> ```
> grille 1024 : hors cadre — Divertissement, Métaux, VILLE MÉDICALE
> grille 1200 : hors cadre — VILLE MÉDICALE
> grille 1400 : hors cadre — VILLE MÉDICALE
> grille 2048 : hors cadre — VILLE MÉDICALE seule (X = 3244, soit 158 %)
> grille 3328 : les dix tiennent — mais 60 % de la planche est vide
> ```
>
> **Un carré ne peut pas contenir le bassin**, quelle que soit sa taille. Le
> rapport d'échelle de la projection est de 1,400 (Mercator à 44,42° N) : un
> degré de latitude occupe 66,68 px quand un degré de longitude en occupe 47,63.
> L'emprise canonique fait donc `47,63 × 38,4 = 1 830 px` de large pour
> `66,68 × 15,0 = 1 000 px` de haut — **un rapport de 1,83**. Un carré de 2048
> est trop étroit ; un carré de 3328 contient tout mais gaspille 40 % de sa
> surface en désert et en océan.
>
> **Le cadre de référence est 1 743 × 1 024** (soit **3 486 × 2 048** en double
> résolution). Cadrage sur l'emprise canonique, origin
> `(latitude 46,2044 / longitude −8,5000)`, marge de 90 px en base 1200.

**Pourquoi ce format, et pas un carré.** Trois raisons, dans l'ordre de force :

1. **C'est la seule forme qui contient les dix cités sans rogner personne.**
   Vérifié : les dix tombent dans le cadre, réparties de 4,5 % à 95,5 % de la
   largeur et de 7,6 % à 92,4 % de la hauteur. Aucune n'est à la marge.
2. **C'est la géographie du sujet.** Le bassin méditerranéen asséché est
   intrinsèquement plus large que haut — 38,4° de longitude sur 15,0° de
   latitude. Le cadre carré était une contrainte esthétique importée, pas une
   donnée du monde.
3. **La résolution utile est mieux employée.** Dans un carré 2048 contenant les
   dix, la bande de sel n'occuperait qu'un tiers de la hauteur. Dans un
   1 743 × 1 024, elle occupe la quasi-totalité — c'est le sujet de la planche.

La projection reste exprimée dans sa base d'origine (1200) : c'est un référentiel
mathématique, pas une taille de fichier. Le passage à la taille de production est
une **mise à l'échelle et un recadrage** — à faire à un seul endroit du code,
jamais dupliquée.

**Le point du constat § 1.4 — quelle est la vérité de référence.** Le constat établit que l'image actuelle et la projection ne décrivent pas le même cadrage : sur `map-lore-base.png`, Gibraltar tombe à 46 % de la hauteur et Genève à 26 %, là où la projection les place à 66 % et 10 %.

**La vérité de référence est le couple lore + projection GPS.** Ce n'est pas un choix de confort, c'est un fait du projet, pour quatre raisons :

1. **Le lore donne des coordonnées réelles, pas des positions de dessin.** Chaque fiche de cité (`loreData.js`) porte un ancrage géographique nommé — Rome, Marseille, Alger, Gibraltar, Genève, Turin, Malte, Alexandrie, Atlantique Ouest. On ne peut pas déplacer Rome pour arranger un dessin sans renier la fiche. *(Corrigé le 21 septembre : la liste citait « Athènes » ; c'est Malte. Voir le bloc de correction du tableau de calage ci-dessus.)*
2. **Le calcul de distance en dépend, en production.** `convoyGenerator.js` consomme `city.mapX / mapY` (constat, annexe). Si la vérité était l'image, les durées de traversée de la campagne seraient arbitrées par un illustrateur.
3. **La projection est réparable, l'image ne l'est pas.** Une Mercator est une fonction : elle se recalcule, se re-échelonne, s'automatise (`update_city_gps.js`, script référencé au § 8.3 et inexistant — constat § 1.1). Une image peinte à la main ne se recalcule pas.
4. **Les repères réels du constat § 1.4 confirment la projection, pas l'image.** L'image « étire le nord et comprime le sud » : c'est précisément ce qu'une Mercator ne fait pas, et précisément ce que fait un illustrateur qui veut caser les Alpes. C'est l'image qui est fautive.

**Décision :** la nouvelle planche `map-lore-base.png` est générée **en 1 743 × 1 024, sur la projection ci-dessus**, et l'échelle de repli constante du constat § 1.4 (la table des neuf repères terrestres relevés) n'est plus nécessaire. Elle devient un **jeu de contrôle**, pas un jeu de calage : si un repère ne tombe pas à sa position projetée, la planche est refusée.

Positions de contrôle à respecter, **dans le format retenu `1 743 × 1 024`**.
Les pourcentages sont indépendants de la résolution : c'est la forme à vérifier.

| Repère réel | Latitude / longitude | Position attendue (px / 1743 × 1024) | En % |
|---|---|---|---|
| Détroit de Gibraltar | 36,1408° N / 5,3536° O | `208, 660` | 11,9 % × 64,5 % |
| Delta du Rhône (Camargue) | 43,5000° N / 4,6000° E | `619, 234` | 35,5 % × 22,9 % |
| Marseille | 43,2965° N / 5,3698° E | `651, 246` | 37,3 % × 24,0 % |
| Turin | 45,0703° N / 7,6869° E | `747, 144` | 42,8 % × 14,0 % |
| Genève | 46,2044° N / 6,1432° E | `683, 78` | 39,2 % × 7,6 % |
| Rome | 41,9028° N / 12,4964° E | `945, 327` | 54,2 % × 31,9 % |
| **Malte** | 35,8989° N / 14,5146° E | `1029, 674` | 59,0 % × 65,8 % |
| Alexandrie | 31,2001° N / 29,9187° E | `1665, 946` | 95,5 % × 92,4 % |
| Alger | 36,7538° N / 3,0588° E | `555, 625` | 31,9 % × 61,0 % |
| L'Île des Anciens | 36,0000° N / 8,5000° O | `78, 668` | 4,5 % × 65,2 % |

> **Correction du 21 septembre 2026 — Malte, et le format n'est pas carré.**
>
> Athènes n'est pas un lieu du lore. Le tableau § 7 du cahier des charges lui
> attribuait par erreur la Cité des Métaux & Recyclage, dont le lore dit
> explicitement « *sur l'ancienne île de Malte* ». La valeur exacte de la
> projection pour Athènes est `(1606, 668)` en base 1200, soit `(2741, 1140)`
> en 2048 — ce qui explique le 133,8 % de la ligne supprimée. **Malte est le
> référent correct**, à `(1167, 807)` en base 1200.
>
> **Et le tableau ci-dessus est recalculé dans le format réel.** L'emprise
> canonique des dix cités fait 38,4° de longitude sur 15,0° de latitude, soit un
> rapport de **1,83** en pixels après projection : **un carré ne peut pas la
> contenir.** Un carré de 2048 est trop étroit (Alexandrie sort à 158 %) ; un
> carré de 3328 contient tout mais laisse 40 % de désert et d'océan vides.
>
> **Format retenu : `1 743 × 1 024`** (double résolution : `3 486 × 2 048`).
> Origin du cadrage : `(latitude 46,2044 / longitude −8,5000)`, marge 90 px en
> base 1200. Voir `Corrections_positions_v2.md` § 4 pour la démonstration et
> l'aperçu, `planche-monde-emprise-canonique.png`.

**Orientation.** Nord en haut. Aucune rotation, aucun perspective, aucune inclinaison. Une rose des vents sobre, dessinée par l'interface en `--font-data` + un tracé fin `--ink-on-dark-muted`, ancrée à `(300, 2000)` en coordonnées 2048 (soit `(176, 1172)` en base 1200).

**Cadre.** Un liseré de 12 px en `--rule` posant la limite du monde connu, avec **bord perdu** : la planche doit déborder au-delà du liseré de 24 px de chaque côté, pour que le zoom et le pan ne découvrent jamais de vide. Le liseré est un élément de l'image (périphérie du monde), pas un cadre décoratif.

**Légende.** Pas dans l'image. La légende est un panneau d'interface, repliable, en `--paper-raised` sur l'interface claire (§ 4.7 pour la règle frontière).

**Cartouche de titre.** Pas dans l'image. Titre d'interface : « LA COURSE DU SEL » en `--font-title`, sous-titre « Bassin méditerranéen — relevé cartographique » en `--font-data` `--text-xs`, plus un **indice de fiabilité** (§ 1.2) : les zones à radiation variable sont explicitement incertaines, le lore dit qu'« aucune carte de radiations n'est jamais tout à fait fiable plus de quelques semaines » (*RADIATIONS ET DUNES*).

### 3.2 Le désert de sel méditerranéen — traitement

C'est **le sujet de la carte**. Le lore est sans ambiguïté (*LE MUR DE SEL*) : « le bassin méditerranéen s'est asséché […] pour devenir le gigantesque désert de sel que les Cités connaissent aujourd'hui ». Rien dans la planche ne doit laisser croire qu'il y a une mer à la place.

**Cinq éléments obligatoires :**

1. **Le bassin asséché est une masse, pas une étendue vide.** Il occupe le centre du cadre et doit être **la zone la plus claire de la planche**, peinte en `--paper-sunken` `#EAE5DA`, avec des crêtes de `--salt-glare` sur les hauteurs et des bassins d'évaporation plus sombres (`--rule`). Texture : polygones de sel craquelé, chevrons de dunes salines, aucun accident vert. Le bassin doit occuper environ **35 % de la surface** de la planche.
2. **Le Mur de Sel scelle le bassin à l'ouest.** *LE MUR DE SEL* : « un immense mur naturel qui a fini par sceller le bassin, coupé net de l'Atlantique », dressé « à l'ouest de Gibraltar, faille naturelle entre deux mondes : l'Atlantique d'un côté, le désert de l'autre ». Traitement : une **crête verticale blanche et dentelée** de 40 à 60 px de large, courant du nord au sud à l'ouest de la position de Gibraltar (`X ≈ 200-230`), séparant l'`--ink` de l'Atlantique du `--paper-sunken` du bassin. Elle doit être lisible à 20 % de zoom, soit ~12 px à l'écran. C'est le point de passage obligé du monde — il se voit.
3. **L'Atlantique est visible et sombre.** À l'ouest du Mur, une bande d'`--ink` franc, sans texture, occupant le bord gauche du cadre. L'opposition Mur blanc / océan noir est le contraste le plus fort de la planche, et c'est ce qui raconte le Mur sans légende.
4. **Le Rhône est le seul fil vivant.** *L'EAU VIENT TOUJOURS DU NORD* : « un unique cours d'eau encore vivant : les vestiges du Rhône, seul grand fleuve du bassin à n'avoir jamais tari », des Alpes au delta de Camargue. Traitement : un tracé en `--reactor` `#4A7C3F`, **large** (10 px à la source, 18 px au delta, en coordonnées 1200 ; soit 17 px et 31 px en 2048), avec un halo d'un vert plus clair sur ses berges immédiates. C'est la **seule** occurrence de `--reactor` sur la planche. Un seul fil vert sur une planche entière de sel et de rouille : c'est ce qui fait dire au joueur « l'eau vient de là ».
5. **Les dix cités sont sur son pourtour.** Le lore le dit au *LE SEL BLANC* : « pourquoi les dix Cités-États se sont toutes implantées sur son pourtour plutôt qu'ailleurs ». Vérifiable à l'œil sur la planche : aucune cité au centre du bassin. La seule qui y soit est sur l'ancienne île de Malte (Cité des Métaux), et c'est bien un point de passage, pas une cité du pourtour — le lore la désigne comme « le point de passage obligé de quiconque traverse le désert de sel d'une rive à l'autre » (`loreData.js`).

### 3.3 Les couches d'information

Six couches, de la plus basse à la plus haute, dans cet ordre d'empilement :

| # | Couche | Contenu | Réalisation |
|---|---|---|---|
| 0 | **Fond** | Bassin, Atlantique, sel, vitrifié, relief, Rhône | Dans l'image |
| 1 | **Graticule** | Parallèles et méridiens tous les 5°, trait `--ink-on-dark-muted` à 0,5 px, opacité 25 % | Interface |
| 2 | **Territoires de faction** | Aplats translucides, un par faction dominante, rayon **en pixels écran** (corrige le constat § 1.7) | Interface, canvas |
| 3 | **Traces de convoi** | Polylignes + chevrons d'avancement | Interface, canvas |
| 4 | **Sites de lore** | Sites dangereux, lieux-hameçons | Interface, canvas |
| 5 | **Brouillard de guerre** | Masque de révélation | Interface, canvas |
| 6 | **Marqueurs de cité + étiquettes** | Les dix cités | Interface, DOM (pas canvas) |

**Hiérarchie et lisibilité — quatre règles :**

1. **Les disques de territoire se calculent en pixels écran, jamais en unités monde, puis sont re-projetés.** Le constat § 1.7 décrit la panne : `territoryRadius` vaut 30 à 150 unités *monde* puis est multiplié par le zoom, tandis que les marqueurs gardent une taille écran constante. Dézoomer fait disparaître les territoires sous les marqueurs. Correction : un rayon exprimé en **kilomètres réels**, converti en pixels écran par le facteur dérivé de la projection (47,63 × 1,70667 = 81,29 px par degré de longitude en base 2048), avec un **plancher de 28 px écran** et un **plafond de 120 px écran**. Le territoire ne descend jamais sous le marqueur qu'il désigne.
2. **Ordre de grandeur des rayons à l'écran** : un territoire d'influence régionale (Genève, Rome) fait 60-90 px écran ; un territoire purement local (Malte) fait 28-40 px. Le rayon ne doit jamais être si grand qu'il masque le désert de sel, qui est le sujet.
3. **Les traces de convoi sont des pointillés animés, pas des traits pleins.** Un trait plein se confond avec le trait de côte. Style : `--rust-soft`, 2 px, tirets `6-4`, chevrons tous les 40 px, plus un liseré `--ink` de 3 px en-dessous pour détacher le trait du fond clair du bassin.
4. **Le brouillard de guerre est un voile de `--ink` à 88 % d'opacité, jamais un noir plein.** Un noir plein (constat § 1.5) ne laisse rien deviner, et c'est ce qui produit le « rectangle noir uni » actuel. À 88 %, les masses de relief restent perceptibles : le joueur sait qu'il y a quelque chose, sans savoir quoi. Le bord de révélation est adouci sur 24 px.

### 3.4 Le point du constat § 1.4 — arbitrage

Traité au § 3.1. **Résumé de la décision :** le lore et la projection GPS sont la vérité ; l'image s'y plie. La nouvelle planche est générée en 1 743 × 1 024 sur la projection officielle (cadrage § 3.1), et les neuf repères terrestres du constat § 1.4 servent de **contrôle de conformité**, pas de calage. La correspondance affine mesurée proposée par le constat § 3.3 devient inutile : recaler une image fausse sur des repères justes est une dette qu'on préfère ne pas contracter.

### 3.5 Le cas du « Nord » hors carte

Le lore fait descendre toute l'eau douce, tous les Enfants du Nord et toute la menace du « Nord », sans jamais le placer sur la carte (*LE NORD — CE QUI EST VRAI DERRIÈRE LE MENSONGE*). Le cadre s'arrête à `Y = 120` en base 1200, soit 46,2° N : **le Nord est hors planche**, et doit le rester. Le haut de la planche est une zone alpine stylisée, en `--rule-strong` froid, avec une lisière de brume `--ink-on-dark-muted` — une frontière, pas un sujet. Les dix cités sont la bande vivable, et le lore est explicite (*LES BANDES CLIMATIQUES*) : « la bande tempérée s'est déplacée bien plus au nord que les tropiques astronomiques d'avant-guerre — jusqu'au bassin méditerranéen ».

### 3.6 L'Île des Anciens — traitement de l'ambiguïté

C'est le point graphique le plus délicat, et il demande une décision explicite.

**Ce que dit le lore** (*L'ÎLE DES ANCIENS : LA LÉGENDE*) : « L'Île des Anciens n'est officiellement qu'un mythe fondateur ». Aucune cité ne peut prouver son existence. Les rumeurs évoquent « une côte que nul n'atteint jamais deux fois, ou un signal radio capté une seule nuit puis plus jamais retrouvé ». Et la note MJ tranche : « l'Île existe réellement — gardez cette certitude pour vous seul ».

**Le problème :** une carte qui montre l'Île clairement dit au joueur qu'elle existe — et ruine le seul secret que le lore demande de garder. Une carte qui ne la montre pas du tout frustre le MJ, qui a besoin de savoir où poser une expédition. Il faut donc **deux lectures du même point**.

**Proposition : le marqueur d'incertitude.**

À la position projetée (`X = 71`, `Y = 800`, soit 5,9 % × 66,7 %, en plein Atlantique), ne pas poser un marqueur de cité. Poser ceci :

- **Un cercle de doute** — trait `--arcane` `#6B4E8C`, 1,5 px, tirets `3-5`, rayon 34 px écran. Pas de remplissage. Un cercle en pointillés se lit immédiatement comme « localisation incertaine », la convention est universelle en cartographie et ne demande aucune légende.
- **Un second cercle concentrique**, plus grand (rayon 58 px écran), à 12 % d'opacité, `--arcane`. L'incertitude a une étendue, pas seulement un centre.
- **Pas d'aplat de territoire.** L'Île n'a pas de faction connue : lui donner un territoire serait un mensonge de la carte.
- **Une étiquette en `--arcane` et en italique**, `--font-data`, `--text-2xs` : « L'ÎLE DES ANCIENS — existence non confirmée ». Le mot « Île » avec son article, orthographe du lore.
- **Un glyphe de doute** : le point d'interrogation typographique en `--arcane`, 14 px, au centre du cercle. En `--font-data`.

**Deux états pour la même planche :** la planche de fond ne contient **rien** à cette position (l'Atlantique est vide, comme il doit l'être au niveau du bassin). Le cercle de doute est un **marqueur d'interface**, à deux états :

| État | Visible par | Rendu |
|---|---|---|
| `RUMOR` | Joueurs | Cercle pointillé `--arcane`, étiquette « on-dit », opacité 60 % |
| `KNOWN` | MJ seul | Cercle pointillé `--arcane` plein, étiquette « L'ÎLE DES ANCIENS — existence confirmée », glyphe d'ancrage |
| `REVEALED` | Les deux | Cercle plein, aplat `--arcane` 12 %, étiquette normale |

Et **une planche `ile_anciens.png` reste produite** (§ 6.11), mais elle n'est **jamais** liée à la carte du monde avant révélation : c'est la carte de ville de L'Île, ouverte par le MJ pour lui-même. Le lore la décrit comme un lieu réel : « un ancien bunker sous-marin pré-guerre remonté à la surface, accessible aujourd'hui uniquement par sous-marin ».

**Point à trancher (§ 9).** Le degré d'indiscrétion du cercle de doute. Trois options, par ordre de discrétion décroissante : (a) aucun cercle, l'Île n'apparaît que sur décision du MJ ; (b) cercle discret à 40 % d'opacité, visible seulement au zoom > 100 % ; (c) cercle permanent, tel que décrit. Ma recommandation : **(b)** — il entretient le mythe sans le confirmer, et ne le vend pas à la première ouverture de carte.

---

## 4. La carte de ville — spécification

### 4.1 Rôle de jeu

En séance, un MJ ouvre une carte de ville pour trois usages :

1. **Répondre à « c'est où ? »** — le joueur demande où se trouve la Citerne Centrale ; le MJ la montre.
2. **Peupler** — chaque lieu du catalogue a une description et des PNJ (`loreData.js`, § 2.7 du constat). La carte est le support qui rend ces PNJ situables : « le taudis est au nord du marché, la Fonderie à l'est ».
3. **Arbitrer un déplacement** — combien de temps d'un bout à l'autre, qu'est-ce qu'on traverse, qu'est-ce qu'on voit.

**Ce que le MJ n'y cherche pas :** de la géographie fine, des distances métriques, un plan d'architecte. La carte est un plan de jeu, pas un relevé cadastral.

### 4.2 Le gabarit unique

C'est ce qui garantit que les dix villes seront uniformes. Sans gabarit chiffré, on reproduit l'écart du constat § 2.8.

**Dimensions.** Planche carrée **1024 × 1024 px**, franchement carrée, sans marge. La carte de ville est carrée alors que la carte du monde ne l est pas (1 743 × 1 024) : elle n'a pas besoin de plus, elle ne fait pas de zoom lointain, et 1024 est la taille de travail des dix planches existantes, ce qui ne dépasse pas le budget de génération.

**Cadre.** Trois zones concentriques, identiques sur les dix planches :

| Zone | Étendue (px) | Contenu |
|---|---|---|
| **Bord perdu** | 0 → 48 | La planche **déborde** : le tissu urbain se poursuit au-delà du bord. Aucun vide, aucune vignette. C'est ce qui autorise le pan. |
| **Zone de sujet** | 48 → 976 | La cité, entièrement contenue. Le point d'ancrage au monde (le fleuve, le Mur, le bord de mer) est toujours **visible**, exactement à la même place. |
| **Zone de cartouche** | 976 → 1024 | Bande réservée, **peinte vide** : un aplat `--ink` uni, sans texture, 48 px de haut, en bas de la planche. C'est l'emplacement du cartouche d'interface (§ 4.6). |

**Résolution du sujet.** Le sujet (la cité) occupe au moins **85 % de la largeur** de la zone de sujet, soit ~790 px. En dessous, la planche paraît vide ; au-dessus, le bord perdu disparaît. Contrôle : la muraille ou le front bâti doit toucher les quatre bords de la zone de sujet.

**Orientation cardinale.** **Nord en haut, partout, sans exception.** Les dix planches existantes divergent sur ce point (comparer `cite_eau.png`, dont la rose des vents est en bas à gauche avec un « N » vers le haut, et `bunker_omega.png`, qui n'en a aucune). Le gabarit impose :

- Une **rose des vents unique**, recomposée par l'interface (pas dans l'image), ancrée à `(88, 90)` en coordonnées 1024.
- Un **repère de nord** supplémentaire, discret, en `--ink-on-dark-muted` : un petit chevron isolé dans la zone de cartouche, à `(976, 1000)`. Le MJ peut ainsi lire le nord même quand la rose est hors champ au pan.

**Échelle.** La carte de ville **ne porte pas d'échelle métrique**, et c'est un choix justifié : le lore ne donne pas de superficie aux cités, et une carte locale en perspective cavalière n'est pas homothétique (les objets lointains sont plus petits). Afficher « 1 carré = 100 m » serait un mensonge mesurable, et c'est exactement ce que fait `local_city_map.png` (« Grid 1sq = 100ft », en anglais, dans l'image). À la place : une **échelle de repère relative** en `--font-data`, exprimée en unités de jeu — « d'un bord du mur à l'autre : environ une demi-journée de marche ». Cohérent avec le lore, où les cités se mesurent en durée.

**Le point d'ancrage au monde.** Chaque planche doit rendre visible, au même endroit, l'élément géographique réel qui situe la cité. C'est ce qui relie les deux natures de carte (§ 2). Le placement est **fixe par famille**, pour que l'œil s'y retrouve d'une ville à l'autre :

| Position | Élément d'ancrage | Cités concernées |
|---|---|---|
| Bas de la zone de sujet, centré | Un cours d'eau vivant en `--reactor` | Cité de l'Eau & Alimentation, Nuke City (Rhône), Cité Industrielle (Dora Riparia) |
| Bord gauche de la zone de sujet | Le Mur de Sel, crête `--salt-glare` verticale | Cité de l'Armement & Défense |
| Toute la périphérie | Sel Blanc, masse `--paper-sunken` | Les dix cités |
| Haut de la zone de sujet, pleine largeur | Ruines de skyline pré-guerre en silhouette `--rust-deep` | Cité des Métaux, Cité du Divertissement, Nuke City |

**Cadrage de la caméra :** trois-quarts aérien à **35° d'inclinaison**, orienté nord. Pas de vue à plat (elle aplatit les volumes et rend les toits illisibles), pas de vue rasante (elle cache la moitié de la cité). Ce cadrage est le même sur les dix planches.

### 4.3 Les familles de lieux

Le constat § 2.6 est le défaut de conception à corriger : « un lieu secret du MJ est aujourd'hui aussi visible qu'une citerne ». Le catalogue de `loreData.js` range les lieux en familles qu'il faut rendre lisibles.

**Quatre familles publiques + une famille MJ :**

| Famille | Ce qu'elle contient | Exemples du catalogue |
|---|---|---|
| **A — Structurel** | Les lieux présents dans les dix cités, sans exception | Marché d'Échanges, Citerne Centrale, Générateur Principal, Mur d'Enceinte & Portes, Quartier Résidentiel / Taudis |
| **B — Fonctionnel** | Les équipements propres à la spécialité de la cité | Cœur du Réacteur Nucléaire (Nuke), Fonderie Colossale (Industrielle), Grande Raffinerie (Carburant), Serres Hydroponiques Blindées (Eau) |
| **C — Quartier** | Les quartiers de l'actionnaire fondateur et les zones d'habitat | `quartier des plaisirs de la chair`, `quartier des chem'artistes`, `quartier des sculpteurs`, `zone des figurants` |
| **D — Faction** | Les lieux tenus par une faction identifiée | `la garde`, `les barons du jeu`, `la bourse de la douleur`, `le sanctuaire de vulcain`, `les apaiseurs` |
| **E — Secret MJ** | Les lieux marqués `[mj — …]` ou `[lieu secret, réservé au mj]` | `les nostalgics`, `le sénat fantôme`, `la salle du trône — le passeur`, `la passerelle : le cyberespace de la source`, `la clinique du rite`, `le poste d'écoute atlantique` |

### 4.4 Système de marqueurs

Le marqueur est dessiné par l'interface, **en pixels écran**, taille constante à tout zoom (même correctif que la carte du monde, § 3.3).

| Famille | Forme | Teinte | Taille (px écran) | Étiquette |
|---|---|---|---|---|
| **A — Structurel** | Carré à coins coupés (octogone), 3 px de côté coupé | `--ink-on-dark` | 18 | `--ink-on-dark`, `--font-ui` 500, 12 px, sur pastille `--ink` 78 % à 4 px du marqueur |
| **B — Fonctionnel** | Carré plein, angles vifs (pas de rayon — DA § 05 : « le papier, la tôle et le métal ne sont pas des pastilles ») | `--rust-soft`, contour `--ink` 1 px | 16 | `--ink-on-dark`, `--font-ui` 400, 11 px |
| **C — Quartier** | **Pas de marqueur.** Un aplat de zone | `--rust` à 14 % + hachures diagonales `--rust` 25 % | Emprise du quartier | `--font-ui` 500, 12 px, **en capitales espacées** (0,08 em), centrée sur la zone |
| **D — Faction** | Losange (rotation 45°) | `--ember`, contour `--ink` 1 px | 15 | `--font-ui` 400, 11 px, italique |
| **E — Secret MJ** | Cercle à bord interrompu, point central | `--ember-red` | 20 | `--font-data` 11 px, `--ember-red`, préfixe `[MJ]` |

**Règles de lisibilité :**

1. **Trois tailles, pas plus** — 20 (secret), 18 (structurel), 16 (fonctionnel). Le losange de faction fait 15 mais se lit plus grand par sa rotation.
2. **Une seule famille domine par zone.** Là où un quartier (C) et un lieu structurel (A) se superposent, l'aplat de quartier passe **sous** le marqueur, et son opacité tombe à 14 % pour ne pas le noyer.
3. **L'étiquette ne couvre jamais un marqueur.** Décalage par défaut : à droite, +8 px, centré verticalement. Si un autre marqueur occupe cette position, bascule à gauche, puis en dessous.
4. **Contraste minimal.** Toute étiquette repose sur une pastille `--ink` à 78 % : `--ink-on-dark` sur `--ink` donne 13,6:1, très au-dessus du seuil de 4,5:1 de la DA (§ 10, critère 4), même par-dessus la zone claire du désert de sel.
5. **Les marqueurs ne sont jamais dans l'image.** Une planche sans interface doit rester une planche : un plan sombre de ville. C'est la convention du § 4.7.

### 4.5 Les lieux secrets du MJ — sous-section critique

**Le problème.** Constat § 2.6 : « Les personnes, les quartiers, les bâtiments et les lieux secrets du MJ sont tous peints comme la même pastille verte de 7 px ». Un secret de campagne se voit donc au même titre qu'une citerne, dès l'ouverture de la carte — y compris sur l'écran de table, projeté aux joueurs.

**Le principe.** Un lieu secret du MJ a **trois états**, et l'interface seule décide lequel s'affiche. La donnée porte l'état ; la planche n'en sait rien.

| État | Signification | Rendu |
|---|---|---|
| `HIDDEN` | État par défaut de tout lieu de famille E | **Rien.** Le marqueur n'est pas dessiné, pas de pastille fantôme, aucun halo. Un lieu non révélé n'existe pas à l'écran. |
| `GM_ONLY` | Le MJ a activé le calque « secrets » | Marqueur E : cercle `--ember-red`, `--font-data`, préfixe `[MJ]`. Visible **seulement** si la session est en mode MJ. |
| `REVEALED` | Le lieu a été découvert en jeu | Le marqueur E devient un marqueur B (fonctionnel, `--rust-soft`) et l'étiquette perd son préfixe. Le lieu est entré dans le monde partagé. |

**Trois garanties techniques, à implémenter dans le code :**

1. **L'état est un champ dédié, pas une convention de nom.** Le constat § 2.2 et § 2.3 établissent que le placement des marqueurs transite aujourd'hui par `notableFeatures`, un champ **narratif** — « particularités notables » dans le lore — et que le schéma Zod ne déclare aucun champ géométrique. Le placement et l'état de révélation doivent vivre dans un champ propre (`localMap` ou équivalent), déclaré dans `createLocationSchema` **et** `updateLocationSchema`. Sinon la donnée sera supprimée en silence, comme les trois fois précédentes (constat § 2.3).
2. **Le filtrage se fait côté serveur, pas côté client.** Un secret filtré dans le navigateur du joueur est déjà arrivé dans son navigateur. La route qui sert la carte locale à un joueur ne renvoie que les lieux `HIDDEN`→absents et `REVEALED`→présents. C'est le même motif que le défaut du constat § 1.5, où un 404 silencieux masquait une route absente : la correction passe par la route, pas par l'affichage.
3. **Le mode MJ est un état de session explicite.** Le constat § 1.5 note que le jeton d'écran de table ne renseigne pas toujours `userId`, et que c'est ce qui fait retomber `requireCampaignAccess` sur un refus. Le calque « secrets » ne doit donc pas dépendre d'un `userId` deviné : il dépend d'un drapeau `gmMode` posé à l'ouverture légitime de l'interface MJ.

**Inventaire des lieux concernés** (relevé dans `loreData.js`, pour que le code sache combien d'entrées traiter) :

| Cité | Lieu | Marqueur du lore |
|---|---|---|
| Cité du Divertissement | `les nostalgics` | `[mj — pied-à-terre de bunker oméga, secret de campagne]` |
| Cité du Divertissement | `quartier des nostalgics` | `[mj — pied-à-terre de bunker oméga]` |
| Cité du Divertissement | `le sénat fantôme` | `[lieu et faction secrets, réservés au mj]` |
| Cité Médicale | `la clinique du rite` | `[lieu secret, réservé au mj, à ~2h de route de la cité]` |
| Cité de l'Eau & Alimentation | `la salle du trône — le passeur` | `[lieu secret, réservé au mj, sous la citerne centrale]` |
| Cité de l'Eau & Alimentation | `la passerelle : le cyberespace de la source` | `[lieu secret, réservé au mj, accessible uniquement depuis la salle du trône]` |
| Cité de l'Armement & Défense | `le poste d'écoute atlantique` | `[lieu secondaire, réservé au mj]` |
| Cité de l'Armement & Défense | `le repaire des ombres` | `[lieu secondaire, accès restreint]` |

Huit entrées sur neuf cités, dont **deux hors-cité** : `la clinique du rite` est « à ~2h de route de la cité », `le poste d'écoute atlantique` est sur le Mur. Ces deux-là ne se dessinent **pas** dans la zone de sujet — elles n'ont pas de position urbaine. Traitement : une **flèche de renvoi** au bord de la zone de sujet, en `--ember-red` pointillé, avec l'étiquette « hors les murs — 2 h de route », et le lieu traité sur la carte du monde à sa position réelle. La donnée doit donc connaître une notion de *portée* : urbaine, périurbaine, régionale.

### 4.6 Le corps d'une ville

Ce qu'on doit voir du tissu urbain sur chaque planche, indépendamment de la cité :

| Élément | Traitement | Doit être lisible à 100 % de zoom |
|---|---|---|
| **Muraille** | Le sujet de la planche. Crête `--ink-on-dark` de 6-10 px sur un talus `--rust-deep`, avec tours épaisses tous les 60-100 px | Oui — c'est ce qui définit le contenant |
| **Portes** | Deux tours plus hautes encadrant une trouée `--ink`, avec cuirasse de porte (voir `cite_armement.png`, à reprendre) | Oui |
| **Marchés** | Tissu dense d'étals, toiles tendues, en `--rust-soft` chaud, plus clair que le bâti alentour | Oui — c'est le point de repère le plus fréquenté |
| **Quartiers d'habitat** | Tissu organique, toits imbriqués, `--rust-soft` désaturé. Plus le quartier est pauvre, plus le tissu est **irrégulier** (les Taudis sont un patchwork, le Quartier Résidentiel un damier) | Oui |
| **Zones industrielles** | Volumes verticaux : cheminées, tours de refroidissement, réservoirs cylindriques. Silhouette `--ink` sur fond `--rust` | Oui |
| **Zones interdites / irradiées** | Aplat `--ember-red` à 18 % + hachures `--ember-red` 35 % + cratères en `--rust-deep`. **Jamais de vert fluo** (voir § 6.8 : c'est le piège de la planche actuelle) | Oui |
| **Points d'eau** | Le seul `--reactor` de la planche, réservé au Rhône et aux canaux vivants. Les citernes sont des volumes `--artificial`, pas des surfaces vertes | Oui |
| **Sol vitrifié** | `--glass-crust` si l'extension est validée, sinon `--rule-strong` hachuré | Oui |
| **Ruines hors mur** | Silhouettes `--rust-deep` à 40-60 % — présentes, jamais détaillées. Elles disent « la cité est un îlot » | Oui |

**Densité de détail.** Le niveau de détail est **constant sur toute la planche** : une seule échelle de dessin, pas de zone plus détaillée qu'une autre. Un générateur d'images produit spontanément un centre sur-détaillé et des bords flous — c'est un défaut à corriger explicitement dans chaque prompt (§ 6, « éléments à éviter »).

### 4.7 La frontière planche / interface

**Règle unique, non négociable :** **la planche est une image de fond, l'interface y ajoute tout ce qui porte de l'information variable.**

| Dans l'image (la planche) | Dans l'interface (le DOM / canvas) |
|---|---|
| Le tissu urbain, la muraille, les ruines | Les marqueurs des 5 familles |
| La lumière, l'ambiance, le climat | Les étiquettes et leurs pastilles |
| Le point d'ancrage géographique | Le cartouche et les sept paramètres |
| Le sel, le fleuve, la silhouette de skyline | La rose des vents, le repère de nord |
| La zone de cartouche **vide** | Le graticule, l'échelle relative |
| **Aucun texte** | L'indice de fiabilité, la date de relevé |
| **Aucun marqueur** | Le calque des secrets MJ et son état |
| **Aucune flèche, aucun cercle** | Les flèches de renvoi hors-les-murs |

**Pourquoi cette frontière, et pas une autre.** C'est le point de départ du § 2.7 du constat inversé : les planches actuelles incrustent du texte (voir § 5.2), et ce texte est un piège pour quatre raisons distinctes, qu'il faut nommer parce qu'elle se retrouvent toutes déjà réalisées dans les fichiers du disque :

1. **Il n'est pas traduisible.** Les planches existantes sont en anglais : `nuke_city.png` porte « Zones 1-5 », « Main St. », « Shattered Tower », « Rad River », « Fallout Ave. » et une légende « Landmarks / Roads / Bunkers ». `local_city_map.png` va jusqu'au titre incrusté, « SCRAPBURG — A WASTELAND MAP », et à une échelle « Grid 1sq = 100ft ». Le projet est en français (langue du projet, `Cahier des charges/DA…`). Un texte incrusté est irrécupérable.
2. **Il n'est pas repositionnable.** Une étiquette peinte à 300 px du bord devient illisible quand le pan la sort du quart d'écran, et rien ne peut la ramener.
3. **Il ne suit pas le zoom.** Une étiquette incrustée grossit avec l'image ; or tout le reste de l'interface (DA, § 05) est en tailles fixes. À 300 % de zoom, « Main St. » devient énorme et laid.
4. **Il ne connaît pas l'état du jeu.** « Zones 1-5 » est vrai à un moment de la campagne et faux après une révélation, un effondrement, une contamination.

**Un seul cas où le texte incrusté pourrait se défendre :** un élément *purement graphique et invariant* — par exemple le « 06h12 » gravé de l'heure sacrée, s'il était décidé qu'il doit être peint dans la pierre de la cité comme dans le lore. Même dans ce cas, ma recommandation est de **ne pas l'incruster** : une gravure se dessine comme un glyphe (trois traits), et le glyphe se redessine à l'interface. **Recommandation : zéro texte incrusté sur les seize planches.** Point à trancher au § 9.

---

## 5. Le référentiel de rendu commun (le « kit »)

### 5.1 Les seize planches

| # | Fichier | Famille | Rôle |
|---|---|---|---|
| 1 | `map-lore-base.png` | Monde | Fond de la carte du monde |
| 2 | `cite_eau.png` | Cité | Cité de l'Eau & Alimentation |
| 3 | `nuke_city.png` | Cité | Nuke City |
| 4 | `bunker_omega.png` | Cité | Bunker Oméga |
| 5 | `cite_industrielle.png` | Cité | Cité Industrielle |
| 6 | `cite_armement.png` | Cité | Cité de l'Armement & Défense |
| 7 | `cite_carburant.png` | Cité | Cité du Carburant |
| 8 | `cite_metaux.png` | Cité | Cité des Métaux & Recyclage |
| 9 | `cite_medicale.png` | Cité | Cité Médicale |
| 10 | `cite_divertissement.png` | Cité | Cité du Divertissement |
| 11 | `ile_anciens.png` | Cité | L'Île des Anciens |
| 12 | `local_city_map.png` | Secours | Quartier urbain générique |
| 13 | `local_ruins.png` | Secours | Ruines / ville morte |
| 14 | `local_salt.png` | Secours | Désert de sel |
| 15 | `local_outpost.png` | Secours | Avant-poste / campement |
| 16 | `local_bunker.png` | Secours | Souterrain / bunker |

**Note sur le décompte.** Le constat § 3 parle de « seize planches (la carte du monde, les dix villes, et les cinq à produire) ». Vérification faite sur `client/public/assets/` : le dossier contient **treize PNG** — les dix planches de cité-monde (`map-lore-base`, `world_map`, `cite_eau`, `nuke_city`, `bunker_omega`, `cite_industrielle`, `cite_armement`, `cite_carburant`, `cite_metaux`, `cite_medicale`, `cite_divertissement`, `ile_anciens`), plus `local_city_map.png` et **`world_map.png`**, que le constat ne mentionne pas dans son inventaire du § 2.8. `world_map.png` est donc un **doublon de `map-lore-base.png`** (deux fonds de carte du monde coexistent). Il n'est pas dans les seize : c'est un fichier à retirer, ou à convertir en variante « carte administrative » sans relief (§ 9). Les cinq planches « génériques » du constat sont donc bien **à produire**, et `local_city_map.png` existe mais doit être **remplacée** (§ 5.2).

### 5.2 État des planches existantes — ce que j'ai vérifié

Le constat § 2.8 affirme que les dix planches « ont été produites sans cadre commun : styles, échelles, orientations cardinales et densités de détail diffèrent d'une planche à l'autre ». **J'ai regardé quatre des planches du disque, et le constat est en dessous de la réalité.**

| Planche | Ce que j'ai observé | Registre |
|---|---|---|
| `map-lore-base.png` | Carte topographique en vue de dessus, bordure ornementale à fioritures d'angle, dominante sépia/marron, **pas** de dominante sombre. Repères terrestres visibles mais étirés au nord. Aucun texte. | Carte peinte « ancienne », clair sur clair |
| `cite_eau.png` | Vue de dessus **quasi verticale** d'une oasis : rivière turquoise très saturée, serres en verre, palmiers verts. Rose des vents **en bas à gauche**, « W/N/S/E » peints à même la planche. Palette claire, bois et sable, pas de rapport avec « Sel et rouille ». Beaucoup de vert et de bleu. | Illustration colorée naturaliste |
| `nuke_city.png` | Vue **trois-quarts isométrique**, planche **très sombre** (c'est la plus proche de l'intention), cratères vert fluo saturés, ciels noirs. **Texte incrusté anglais** : « Zones 1-5 », « Main St. », « Shattered Tower », « Rad River », « Fallout Ave. », plus une **légende en bas à droite** et une **échelle en bas à gauche**. | Bande dessinée post-apo, palette fluo |
| `bunker_omega.png` | **Plan technique à plat, vue de dessus, style blueprint** : sections octogonales, gradations, codes « A », « B », « D », « E », « G ». Aucune extérieur, aucune ville, aucun tissu urbain — c'est un **plan de bâtiment**, pas une carte de cité. Très sombre, orange/cyan. | Plan d'architecte de science-fiction |
| `cite_armement.png` | Vue trois-quarts aérienne d'une forteresse médiévale : tours crénelées, tentes, herse. Registre **médiéval-fantastique**, pas post-apocalyptique. Vert olive, brun, gris. Aucun texte, **aucune rose des vents.** | Illustration fantasy |
| `cite_metaux.png` | Vue trois-quarts, **dominante orange feu et lave** : coulées de lave rutilantes, structures industrielles. Registre **volcanique/fantastique**. **Texte incrusté anglais** : « Great Forge Complex », « Recycling Plant & Salvage Yards », « The Rust Towers », « Mountains of Rusted Metal », « The Scavengers' Market », « The Main Gates », « The Crater ». | Illustration fantasy chaleureuse |
| `ile_anciens.png` | Vue **quasi verticale** d'une cité enceinte au bord de l'eau, verts luxuriants, réseau de circuits cyan lumineux, dôme, port. Registre **science-fiction propre et clinique**, à l'opposé du reste. Aucun texte. | Plan/SF propre |
| `local_city_map.png` | Vue de dessus texturée d'une ville en ruines. **Titre incrusté « SCRAPBURG — A WASTELAND MAP »**, dix étiquettes en anglais sur fanions, **rose des vents en bas à gauche**, **échelle « Grid 1sq = 100ft » en bas à gauche**. | Plan de jeu « wasteland » anglo-saxon |

**Six écarts structurels, tous décisifs pour le kit :**

1. **Trois cadrages incompatibles.** Vue de dessus verticale (`cite_eau`, `ile_anciens`), trois-quarts aérien (`cite_armement`, `cite_metaux`, `nuke_city`), plan à plat (`bunker_omega`). Un joueur qui passe de Nuke City à la Cité de l'Eau change de convention de lecture.
2. **Orientation non constant.** `cite_eau` et `local_city_map` ont une rose des vents ; `cite_armement`, `nuke_city`, `cite_metaux` n'en ont pas ; `bunker_omega` est un plan, donc sans nord. Sur `cite_eau`, la rose est en bas à gauche avec quatre lettres peintes à même la planche.
3. **Palettes sans rapport.** Vert turquoise saturé (`cite_eau`), vert fluo radioactif (`nuke_city`), orange lave (`cite_metaux`), sépia clair (`map-lore-base`), cyan clinique (`ile_anciens`), olive médiéval (`cite_armement`). **Aucune ne relève de « Sel et rouille ».**
4. **Densité de détail variable.** `bunker_omega` est au niveau du plan d'architecte ; `cite_eau` au niveau de l'aquarelle de détail. Le rapport de densité est de plusieurs ordres de grandeur.
5. **Le Sel Blanc, sujet central du lore, est absent ou illisible partout.** Aucune planche ne lit le bassin comme un désert de sel. `cite_eau` montre de l'eau courante turquoise abondante, ce que le lore interdit absolument : au bassin, « l'eau vient toujours du Nord », par le Rhône seul, et c'est précisément pourquoi le monopole des Gardiens vaut une guerre. La planche raconte l'inverse du monde.
6. **Le texte incrusté anglais est présent sur trois planches au moins** (`nuke_city`, `cite_metaux`, `local_city_map`), avec titre et échelle sur la dernière.

**Conclusion, en une phrase :** il ne s'agit pas d'harmoniser dix planches, il s'agit d'en **produire seize neuves**. Aucune des planches du disque ne peut servir de référence de style pour les autres.

### 5.3 Les dix cités — ce que chaque planche doit montrer

Pour chacune : ancrage réel (`loreData.js`, champ `geo`), vocabulaire visuel de référence, teinte dominante (dans la palette fermée du § 1.3), et éléments obligatoires tirés des **lieux réels** du catalogue.

| # | Fichier | Cité | Ancrage réel | Image de référence | Teinte dominante | 3 à 5 éléments obligatoires |
|---|---|---|---|---|---|---|
| 2 | `cite_eau.png` | Cité de l'Eau & Alimentation | Embouchure du Rhône, delta de Camargue | Delta agricole assiégé, oasis **industrielle** | `--reactor` (le Rhône) sur `--paper-sunken` | Le Rhône vivant au bas de la planche · Serres hydroponiques blindées · Station de filtration · Élevage de bétail mutant · Le mur d'enceinte refermé sur le delta |
| 3 | `nuke_city.png` | Nuke City | Ruines de Marseille, ancien site nucléaire expérimental | Centrale en ruine à ciel ouvert | `--ember-red` + `--reactor` en zones irradiées | Cœur du réacteur nucléaire · Zone de refroidissement irradiée · Centre de recherche sur l'énergie · Dépôt de déchets toxiques · Cratères de verre |
| 4 | `bunker_omega.png` | Bunker Oméga | Sous les ruines de Genève, massif alpin | Cité souterraine — **vue de coupe**, pas un plan | `--artificial` + `--ink` | Noyau de l'intelligence artificielle · Ateliers de drones autonomes · Centre de télécommunications globales · Laboratoire de biologie avancée · La roche alpine en coupe autour |
| 5 | `cite_industrielle.png` | Cité Industrielle | Vestiges de Turin | Cité-usine, feu à l'horizon | `--rust` + `--ember` | Fonderie colossale · Ligne d'assemblage de véhicules · Atelier des pièces détachées · Dépôt de ferraille · Cheminées en silhouette sur le ciel |
| 6 | `cite_armement.png` | Cité de l'Armement & Défense | Adossée au Mur de Sel, détroit de Gibraltar | Arsenal-forteresse **post-apocalyptique**, jamais médiéval | `--rust-deep` + `--paper-sunken` (le Mur) | Le Mur de Sel au bord gauche · Usine de fabrication d'armes · Laboratoire des explosifs · Caserne d'entraînement des milices · Le détroit comme unique passage terrestre |
| 7 | `cite_carburant.png` | Cité du Carburant | Ancienne Alger | Raffinerie-port sur un désert | `--ink` + `--ember` | Grande raffinerie (siège du clergé du Sang Noir) · Dépôt de carburant haute sécurité · Puits d'extraction principal · Garage des convois lourds · Le port sec asséché |
| 8 | `cite_metaux.png` | Cité des Métaux & Recyclage | Centre exact du bassin, ancienne Malte | Île de ferraille au milieu du sel | `--rust` + `--rule-strong` | Cimetière des gratte-ciels · Usine de recyclage (siège de la mairie) · Marché aux alliages rares · Mine profonde · **Le désert de sel à 360°** |
| 9 | `cite_medicale.png` | Cité Médicale | Ruines d'Alexandrie | Cité-phare clinique, blanche et inquiétante | `--ink-on-dark` + `--rule` (blanc clinique) | Laboratoire de virologie · Usine de synthèse de médicaments · Unité de quarantaine sévère · Le sanctuaire de Vulcain · La rade asséchée |
| 10 | `cite_divertissement.png` | Cité du Divertissement | Cœur de Rome, Colisée et forums | Cité-spectacle, propagande en lumière | `--arcane` + `--ember` | Grande arène de combat · Studios de radiodiffusion · Casino de la Ruine · Théâtre des illusions · Le Colisée en ruine réemployé |
| 11 | `ile_anciens.png` | L'Île des Anciens | Bunker sous-marin émergé, ouest de Gibraltar | Paradis **trop parfait** — la beauté doit inquiéter | `--arcane` + `--reactor` | Le marché d'échanges sur quais de pierre blanche · La sphère du générateur (lumière bleue) sans source · Les habitations « lisses et blanches, étrangement désertes » · Les champs de force côtiers · **L'océan Atlantique autour**, encore en eau |

Deux notes de production sur ce tableau :

- **`bunker_omega.png` est le cas difficile.** Le lore l'établit comme « cité souterraine » : il n'y a rien à voir du dessus. La planche actuelle a contourné le problème en produisant un plan technique — juridiquement juste, mais incompatible avec les neuf autres. La proposition est la **vue de coupe** : un quart de la planche montre le massif alpin en surface (roche `--rule-strong`, neige `--salt-glare`), le reste est l'intérieur éclairé en `--artificial`, avec le noyau d'IA au centre. On obtient ainsi une planche de **même nature** que les autres (une ville dessinée) tout en respectant le lore. Point à trancher (§ 9).
- **`cite_medicale.png` et `cite_metaux.png` et `cite_industrielle.png` portent une dominante claire ou neutre**, ce qui les distingue du reste sans sortir de la palette. C'est délibéré : la Cité Médicale est la seule à revendiquer le blanc, et cela la rend immédiatement reconnaissable — et immédiatement suspecte, ce que son lore demande (« les pharmaciens » et « le Don qui n'en était pas un »).

### 5.4 Les cinq planches génériques

Le constat § 2.4 relève que `local_city_map.png` existe mais « n'est référencée nulle part », et que `location.imageUrl` n'est renseigné que pour 10 lieux sur 109. Les 99 autres lieux — points d'intérêt, quartiers, bâtiments — s'ouvrent aujourd'hui sur un canvas vide.

**Le jeu de secours répond à trois besoins :** donner une image aux lieux non-cités-états (99 lieux), éviter le canvas vide, et fournir un fond générique quand un MJ crée un lieu qui n'existe pas encore dans `loreData.js`.

| # | Fichier | Sujet | Sert à |
|---|---|---|---|
| 12 | `local_city_map.png` | **Quartier urbain générique** — tissu dense, rues, marchés, aucun monument | Tout lieu urbain sans planche dédiée : un quartier résidentiel, un marché, une place. **Remplace le fichier actuel**, qui porte un titre et une échelle incrustés |
| 13 | `local_ruins.png` | **Ruines / ville morte** — immeubles éventrés, rue envahie de sable salin, aucune présence vivante | Zone vitrifiée non-irradiée, ville abandonnée, site exploré avant d'être peuplé. Couvre les lieux « ruines » du catalogue |
| 14 | `local_salt.png` | **Désert de sel** — plaine de sel craquelé, dunes salines, un repère isolé | Toute scène hors des murs : traversée de convoi, expédition, campement du désert. C'est la planche qui manque le plus, puisque c'est le décor de 90 % du monde |
| 15 | `local_outpost.png` | **Avant-poste / campement** — enceinte sommaire, tentes, mirador, feu, véhicules | Camp de pillards, halte de convoi, base avancée, lieu de rencontre. Répond aux lieux `[mj — pied-à-terre]` et aux lieux secondaires hors-cité |
| 16 | `local_bunker.png` | **Souterrain / bunker** — galeries, sas, coursives, éclairage artificiel, roche brute | Tous les lieux souterrains : la salle du trône sous la citerne, la passerelle de la Source, le réseau souterrain, les bunkers de campagne. Complète Bunker Oméga sans le dupliquer |

**Ce qui distingue une planche de secours d'une planche de cité, et ce qui l'en rapproche :**

- **Rapproche :** même gabarit 1024×1024, même bord perdu, même zone de cartouche vide, même cadrage à 35°, même palette fermée, même absence de texte. Un lieu de secours doit être indiscernable d'une cité à l'écran.
- **Distingue :** aucun élément d'ancrage géographique (pas de fleuve nommé, pas de Mur), aucune muraille de cité, aucune architecture signature. Une planche de secours est **interchangeable** : c'est ce qui lui permet de servir 99 lieux.

### 5.5 Matrice de cohérence

| # | Planche | Cadrage | Orientation | Palette dominante | Niveau de détail | Destination |
|---|---|---|---|---|---|---|
| 1 | `map-lore-base` | Vue de dessus, projection Mercator exacte, 1 743 × 1 024 | Nord haut, graticule | `--ink` / `--paper-sunken` / `--reactor` (Rhône) | Faible à moyen — lisible à 20 % de zoom | Carte du monde |
| 2 | `cite_eau` | 3/4 aérien 35°, 1024×1024 | Nord haut | `--reactor` sur `--paper-sunken` | Élevé | Carte locale |
| 3 | `nuke_city` | 3/4 aérien 35° | Nord haut | `--ember-red` + `--reactor` | Élevé | Carte locale |
| 4 | `bunker_omega` | 3/4 aérien 35° **en coupe** | Nord haut | `--artificial` + `--ink` | Élevé | Carte locale |
| 5 | `cite_industrielle` | 3/4 aérien 35° | Nord haut | `--rust` + `--ember` | Élevé | Carte locale |
| 6 | `cite_armement` | 3/4 aérien 35° | Nord haut | `--rust-deep` + `--paper-sunken` | Élevé | Carte locale |
| 7 | `cite_carburant` | 3/4 aérien 35° | Nord haut | `--ink` + `--ember` | Élevé | Carte locale |
| 8 | `cite_metaux` | 3/4 aérien 35° | Nord haut | `--rust` + `--rule-strong` | Élevé | Carte locale |
| 9 | `cite_medicale` | 3/4 aérien 35° | Nord haut | `--ink-on-dark` + `--rule` | Élevé | Carte locale |
| 10 | `cite_divertissement` | 3/4 aérien 35° | Nord haut | `--arcane` + `--ember` | Élevé | Carte locale |
| 11 | `ile_anciens` | 3/4 aérien 35° | Nord haut | `--arcane` + `--reactor` | Élevé | Carte locale (MJ seul) |
| 12 | `local_city_map` | 3/4 aérien 35° | Nord haut | `--rust` + `--rust-soft` | Moyen — générique | Secours |
| 13 | `local_ruins` | 3/4 aérien 35° | Nord haut | `--rust-deep` + `--rule-strong` | Moyen | Secours |
| 14 | `local_salt` | 3/4 aérien 35° | Nord haut | `--paper-sunken` + `--salt-glare` | Faible — étendue | Secours |
| 15 | `local_outpost` | 3/4 aérien 35° | Nord haut | `--rust` + `--ember` | Moyen | Secours |
| 16 | `local_bunker` | 3/4 aérien 35° **en coupe** | Nord haut | `--artificial` + `--ink` | Moyen | Secours |

**Lecture de la matrice :** trois colonnes sont **invariantes** sur les seize planches — l'orientation (nord haut), l'absence de texte, et la fermeture de palette. Le cadrage ne varie qu'entre deux valeurs (vue de dessus pour la carte du monde, coupe 3/4 pour les quinze autres). Le niveau de détail est la seule variable réellement libre, et il est gradué : faible pour les étendues de sel, moyen pour les planches de secours, élevé pour les neuf cités documentées.

---

## 6. Bloc de spécification par planche

**Convention de rédaction — à lire avant d'utiliser les blocs.**

Chaque bloc est **autonome** : il doit pouvoir être copié seul dans un générateur d'images, sans référence aux autres sections. Le vocabulaire descriptif est délibérément en français pictural plutôt qu'en jargon technique, parce qu'un générateur d'images répond mieux à une description de scène qu'à une consigne de rendu graphique.

**Contraintes techniques communes aux seize planches** — à répéter dans chaque prompt :

- **Format.** Carte du monde : **1 743 × 1 024** (rapport du bassin, voir § 3.1). Les quinze autres : **1 024 × 1 024**, carrées.
- **Cadrage identique.** Même distance de caméra, même angle (3/4 aérien à 35°, nord en haut) sur toutes les planches locales.
- **Aucun texte, aucun chiffre, aucune lettre.** Ni étiquette, ni titre, ni échelle, ni légende, ni signature, ni filigrane. La justification est au § 4.7 : le texte incrusté n'est ni traduisible, ni repositionnable, ni sensible au zoom, ni informé de l'état du jeu. Les étiquettes sont dessinées par l'interface par-dessus.
- **Aucun marqueur, aucun badge.** Pas de pastille, pas d'icône, pas de pin. Les marqueurs sont un élément d'interface (§ 4.4).
- **Bord perdu.** Le sujet se poursuit au-delà des quatre bords ; jamais de vignette, jamais de bordure ornementale, jamais de cadre peint.
- **Zone de cartouche vide.** Les 48 px du bas (sur 1024) sont un aplat sombre uni, sans texture.
- **Densité de détail constante** sur toute la surface. Ne pas sur-détailler le centre.
- **Rendu.** Illustration peinte, pas de photoréalisme, pas de rendu 3D. Un grain de poussière et de sel uniforme, une lumière dure d'après-guerre.

### 6.1 `map-lore-base.png` — Carte du monde

**Sujet.** Le bassin méditerranéen après l'assèchement. L'ancienne mer est devenue un immense désert de sel craquelé, entouré de dix cités-états sur son pourtour. À l'ouest, un mur naturel de sel cristallisé scelle le bassin et le sépare de l'Atlantique. Un seul fleuve encore vivant descend des Alpes vers le delta du Rhône.

**Cadrage et composition.** Vue de dessus verticale, projection régulière, **1 743 × 1 024** (cadrage § 3.1). Le bassin de sel occupe le centre et environ 35 % de la surface. L'Atlantique noir occupe le bord ouest. Les côtes de l'ancienne mer sont dessinées avec précision — elles doivent suivre la géographie réelle de la Méditerranée. Le bassin est vide de toute cité en son centre, sauf un point d'ancrage isolé au milieu exact (l'ancienne Malte). Aucune bordure ornementale.

**Palette.** Fond `--ink` `#1F1C18`. Sel `--paper-sunken` `#EAE5DA` avec crêtes `--salt-glare` `#F2EEE2`. Massifs montagneux `--rule-strong` `#B8B0A0`. Zones vitrifiées `--rust` `#A8501E` et `--glass-crust` `#6E8B8A`. Le Rhône et ses berges `--reactor` `#4A7C3F`, **seule couleur vivante de la planche**. Atlantique `--ink` pur, sans texture.

**Éléments obligatoires.**
- Le bassin de sel asséché, masse claire dominante au centre, texture de polygones de sel craquelé et de dunes salines.
- Le Mur de Sel : crête verticale blanche et dentelée à l'ouest, séparant l'Atlantique noir du désert clair. C'est le contraste le plus fort de la planche.
- Le Rhône : un unique fil vert lumineux, des Alpes au delta de Camargue, avec un halo plus clair sur ses berges.
- Les reliefs réels du pourtour : Alpes au nord, Apennins, Atlas au sud, déserts d'Égypte à l'est.
- Les sols vitrifiés : plaques gris-vert polies, miroitantes, dans le bassin central.

**Éléments à éviter.** Toute étendue d'eau turquoise ou bleue dans le bassin (il n'y a plus de mer). Toute végétation ailleurs que sur le Rhône. Toute ville ou marqueur. Tout texte, toute rose des vents, toute bordure ornementale ou fioriture d'angle. Toute dominante sépia chaude — la planche est nocturne et froide.

**Ambiance.** Nuit du bassin : l'air est sec et glacé, le ciel est d'un bleu presque noir. Les crêtes de sel renvoient une lumière lunaire dure ; l'horizon porte une fine brume chaude, d'un orange braise très sourd. Aucune source de lumière visible.

**Contraintes techniques.** Format 1 743 × 1 024. Aucun texte. Bord perdu sur les quatre côtés. Densité constante. Lisible à 20 % de zoom : les masses doivent tenir en silhouette.

### 6.2 `cite_eau.png` — Cité de l'Eau & Alimentation

**Sujet.** « Les Gardiens de la Source ». Une cité-forteresse refermée sur l'embouchure du seul grand fleuve encore vivant du monde. Des serres blindées et des bassins de filtration occupent le cœur de la cité ; tout autour, un désert de sel à perte de vue. C'est la cité la plus riche du bassin, et la seule dont on puisse mourir en franchissant le mur.

**Cadrage et composition.** Trois-quarts aérien à 35°, nord en haut. Le Rhône entre par le **bas** de la planche et traverse la cité de bas en haut, large et vert. La muraille referme la cité sur les deux rives, avec un pont fortifié au centre. Les serres forment un damier de verre incliné sur la rive ouest. Au nord, hors les murs, des champs irrigués en lanières, puis le sel. Le fleuve se poursuit au-delà des quatre bords.

**Palette.** `--reactor` `#4A7C3F` dominant sur le fleuve et les cultures. `--paper-sunken` `#EAE5DA` et `--salt-glare` `#F2EEE2` pour le sel. Muraille et bâti en `--rust-soft` `#C97A3E` et `--rust-deep` `#8A3D14`. Verre des serres : `--rule` `#D8D2C4` translucide.

**Éléments obligatoires.**
- Le Rhône vivant, large, vert profond, traversant la cité — le seul élément coloré de la planche.
- Les serres hydroponiques blindées : damier de structures de verre inclinées, à l'ouest.
- La station de filtration : volumes de béton et de tuyauterie, au bord du fleuve.
- L'élevage de bétail mutant : enclos clos de barbelés, au nord-est, avec des silhouettes trapues et indistinctes.
- Le mur d'enceinte refermé sur le delta, avec ses tours et ses portes au sud.

**Éléments à éviter.** **Aucune palmeraie, aucun palmier, aucune oasis.** Aucune eau turquoise ou bleue — l'eau est verte, opaque, chargée de vie. Aucun vert luxuriant de jungle. Aucune architecture méditerranéenne intacte et propre. Aucun texte, aucun marqueur.

**Ambiance.** Fin d'après-midi, lumière rasante et dure, poussière de sel en suspension. Le ciel est dégagé et sans couleur, l'horizon d'un orange braise sourd. L'eau est le seul élément frais de l'image.

**Contraintes techniques.** Carré 1024 × 1024. Cadrage 3/4 aérien 35°. Aucun texte. Bord perdu. Zone de cartouche vide en bas. Densité constante.

### 6.3 `nuke_city.png` — Nuke City

**Sujet.** « Le Réacteur à Ciel Ouvert ». La seule cité nucléaire de surface : un réacteur de recherche éventré, encore actif au milieu d'une ville en ruine, environné de zones de refroidissement contaminées et de dépôts de déchets. C'est la plus dark de toutes les planches du kit.

**Cadrage et composition.** Trois-quarts aérien à 35°, nord en haut. Le cœur du réacteur occupe le centre exact de la planche : un volume massif, brisé, d'où rayonnent des galeries. Autour, un anneau de bassins de refroidissement asséchés et fissurés, violemment colorés. Les ruines de la ville pré-guerre forment une silhouette haute sur le bord nord. La muraille électrifiée referme l'ensemble. Des cratères de verre ponctuent la périphérie sud.

**Palette.** `--ember-red` `#B3392E` et `--reactor` `#4A7C3F` en zones irradiées — **mélangés et voilés, jamais saturés**. Béton et acier `--ink` `#1F1C18` et `--rule-strong` `#B8B0A0`. Verre vitrifié `--glass-crust` `#6E8B8A`. Halo du réacteur `--reactor` très diffus.

**Éléments obligatoires.**
- Le cœur du réacteur nucléaire : structure massive brisée, au centre, d'où émane une lueur verte diffuse.
- La zone de refroidissement irradiée : bassins asséchés, fissurés, aux dépôts colorés et troubles.
- Le centre de recherche sur l'énergie : long bâtiment pré-guerre partiellement effondré, à l'est.
- Le dépôt de déchets toxiques : fûts alignés, empilés, corrodés, dans un enclos grillagé.
- Les ruines de la ville pré-guerre : silhouette de gratte-ciels éventrés sur l'horizon nord.

**Éléments à éviter.** **Aucun vert fluo saturé** — c'est le défaut de la planche actuelle. La couleur des zones irradiées doit être un vert-de-gris voilé par la poussière, pas un vert néon. Aucun texte, aucun panneau, aucune lettre (la planche actuelle porte « Zones 1-5 », « Main St. », une légende et une échelle). Aucun nuage de champignon, aucun éclair décoratif.

**Ambiance.** Crépuscule artificiel, ciel chargé de cendres industrielles. La Suspension monte à l'horizon. La lumière est diffuse, sans ombre nette, sauf la lueur propre du réacteur qui vient du sol.

**Contraintes techniques.** Carré 1024 × 1024. Cadrage 3/4 aérien 35°. Aucun texte. Bord perdu. Zone de cartouche vide. Densité constante.

### 6.4 `bunker_omega.png` — Bunker Oméga

**Sujet.** « Les Fantômes d'Acier ». Une cité entièrement souterraine, la plus avancée du monde, enfouie sous les ruines de Genève. Ce que l'on voit est une coupe : la roche alpine et la surface morte en haut, la cité d'acier et de circuits en dessous. C'est un lieu où l'on vit, pas un plan technique.

**Cadrage et composition.** Trois-quarts aérien à 35°, nord en haut, **en coupe** : la moitié supérieure de la planche montre la surface — neige, roche, ruines englouties par le glacier — et la moitié inférieure, l'intérieur éclairé, en gradins et galeries concentriques autour d'un noyau central. Le sas d'entrée vertical relie les deux. La roche brute cerne la coupe sur les quatre côtés.

**Palette.** `--artificial` `#3A5F8A` dominant — « la lumière d'un bleu artificiel ». Structures en `--rule-strong` `#B8B0A0` et `--ink` `#1F1C18`. Roche et neige en surface `--rule-strong` et `--salt-glare` `#F2EEE2`. Quelques accents `--ember` `#C4801A` sur les zones habitées.

**Éléments obligatoires.**
- Le noyau de l'intelligence artificielle : une structure géométrique lumineuse, au centre de la coupe, d'où partent des liaisons dans toutes les directions.
- Les ateliers de drones autonomes : alvéoles serrées, alignées, dans une galerie latérale.
- Le centre de télécommunications globales : grandes antennes internes, volume le plus haut de la coupe.
- Le laboratoire de biologie avancée : volume vitré, propre, éclairé froid, à l'écart.
- La coupe de la roche alpine et la surface gelée : la cité est **sous** quelque chose, et cela doit être visible.

**Éléments à éviter.** **Aucun plan technique, aucune cotation, aucune lettre de section** (la planche actuelle est un blueprint avec des codes « A », « B », « D », « E », « G »). Aucune vue de dessus. Aucune couleur chaude dominante. Aucun texte.

**Ambiance.** Pas de ciel, pas d'heure, pas de climat intérieur : la lumière est entièrement artificielle, bleue, sans source visible. En surface, la nuit polaire et le vent. Fort contraste entre les deux.

**Contraintes techniques.** Carré 1024 × 1024. Cadrage 3/4 aérien 35° en coupe. Aucun texte. Bord perdu. Zone de cartouche vide. Densité constante.

### 6.5 `cite_industrielle.png` — Cité Industrielle

**Sujet.** « Les Forgerons d'Acier ». Sur les vestiges de Turin, une cité-usine qui fabrique les machines du monde. La fonderie colossale est le cœur de la cité, et son feu éclaire toute la planche.

**Cadrage et composition.** Trois-quarts aérien à 35°, nord en haut. La fonderie occupe le centre, avec ses hauts-fourneaux et ses cheminées qui dominent la planche de toute leur hauteur. Autour, un tissu dense d'ateliers, de voies ferrées de fortune et de dépôts. Le mur d'enceinte referme l'ensemble, avec les portes au sud. La silhouette des Alpes se dessine au nord-ouest, très loin.

**Palette.** `--rust` `#A8501E` et `--ember` `#C4801A` dominants sur la fonderie et ses lueurs. `--rust-soft` `#C97A3E` pour le bâti et la ferraille. `--ink` `#1F1C18` pour les ombres et les âmes de cheminée. `--rule-strong` `#B8B0A0` pour les dépôts de pièces.

**Éléments obligatoires.**
- La fonderie colossale : hauts-fourneaux, coulée visible, cheminées multiples, au centre.
- La ligne d'assemblage de véhicules : longue halle ouverte, carcasses alignées, à l'est.
- L'atelier des pièces détachées : hangar bas, empilements ordonnés, au sud-ouest.
- Le dépôt de ferraille : montagnes de métal tordu, à ciel ouvert, au nord-est.
- Les cheminées en silhouette sur le ciel : au moins une dizaine, de hauteurs différentes, l'horizon doit être crénelé.

**Éléments à éviter.** **Aucune coulée de lave, aucun feu naturel, aucun volcan** (la planche actuelle montre de la lave en fusion rutilante, qui n'a rien à faire dans une fonderie). Aucun texte, aucune étiquette sur fanion. Aucun rouge saturé uniforme — l'orange doit rester celui de l'oxydation et de la braise, pas du feu de camp.

**Ambiance.** Aube industrielle. Le ciel est un couvercle bas de fumée et de poussière, teinté d'orange par l'horizon. La lumière vient d'en bas, des coulées, et rase les toits.

**Contraintes techniques.** Carré 1024 × 1024. Cadrage 3/4 aérien 35°. Aucun texte. Bord perdu. Zone de cartouche vide. Densité constante.

### 6.6 `cite_armement.png` — Cité de l'Armement & Défense

**Sujet.** « Les Arsenaux ». Adossée au Mur de Sel, à l'embouchure de l'ancien détroit de Gibraltar, la cité tient le seul point de passage terrestre entre l'Atlantique et le désert. C'est un arsenal-fortifié : puissant, sec, sans ornement.

**Cadrage et composition.** Trois-quarts aérien à 35°, nord en haut. **Le Mur de Sel occupe toute la bordure gauche de la planche** : une falaise blanche verticale, dentelée, qui barre l'horizon ouest. La cité s'y adosse et s'étend vers l'est. À droite, le désert de sel, vide, jusqu'au bord. Le détroit est un goulet étroit au nord, barré par une porte de fer. Le port de guerre est une rade complètement asséchée, au sud.

**Palette.** `--rust-deep` `#8A3D14` et `--ink` `#1F1C18` pour les fortifications. `--paper-sunken` `#EAE5DA` et `--salt-glare` `#F2EEE2` pour le Mur de Sel. `--rust-soft` `#C97A3E` pour les baraquements. `--artificial` `#3A5F8A` pour la rade asséchée.

**Éléments obligatoires.**
- Le Mur de Sel : falaise blanche et cristalline, verticale, occupant le bord gauche, avec une texture de sel en escalier.
- L'usine de fabrication d'armes : grand volume rectangulaire, sans fenêtre, toit bas, au centre.
- Le laboratoire des explosifs : bâtiment isolé, enterré, clôturé, écarté du reste.
- La caserne d'entraînement des milices : cour rectangulaire, rangs, miradors d'angle.
- Le détroit gardé : un goulet étroit barré par une double porte de fer, au nord.

**Éléments à éviter.** **Aucune architecture médiévale-fantastique** : pas de créneaux décoratifs, pas de tours de conte, pas de tentes de toile, pas de herse de château (la planche actuelle est une forteresse médiévale complète). Aucun vert de végétation. Aucun texte.

**Ambiance.** Midi écrasé. Soleil blanc au zénith, ombres courtes et dures, sel aveuglant. Le Vent Blanc souffle du nord et soulève un voile de poussière. Personne dehors sans protection.

**Contraintes techniques.** Carré 1024 × 1024. Cadrage 3/4 aérien 35°. Aucun texte. Bord perdu. Zone de cartouche vide. Densité constante.

### 6.7 `cite_carburant.png` — Cité du Carburant

**Sujet.** « Les Raffineurs ». Sur l'ancienne Alger, une cité-raffinerie organisée autour de son clergé du Sang Noir. Le carburant est la ressource la plus disputée du bassin, et la cité le sacralise : les raffineries sont des temples.

**Cadrage et composition.** Trois-quarts aérien à 35°, nord en haut. La grande raffinerie occupe le centre, avec ses tours, ses tuyauteries et ses torchères éteintes. Le port est une rade sèche, envahie par le sel, au nord. Les puits d'extraction ponctuent le sud. La muraille referme le tout, avec une porte monumentale au sud-est. Les dépôts de carburant sont des volumes enterrés, cerclés de barbelés.

**Palette.** `--ink` `#1F1C18` et `--ember` `#C4801A` dominants — le noir du pétrole et la braise des torchères. `--rust-soft` `#C97A3E` pour les structures. `--paper-sunken` `#EAE5DA` pour le sel qui envahit le port. Accents `--ember-red` `#B3392E` sur les zones à risque.

**Éléments obligatoires.**
- La grande raffinerie : tours de distillation, faisceaux de tuyauteries, réservoirs, au centre. C'est aussi le siège du clergé du Sang Noir — une architecture qui doit avoir quelque chose de sacré dans la verticalité.
- Le dépôt de carburant haute sécurité : cuves enterrées, cerclées, gardées, à l'écart.
- Le puits d'extraction principal : derrick et machinerie, au sud, dans le sel.
- Le garage des convois lourds : alignement de camions-citernes, atelier ouvert, à l'est.
- La rade asséchée au nord : bassins de sel craquelé, épaves de navires rouillés échouées à sec.

**Éléments à éviter.** **Aucune eau.** La rade est sèche, les épaves sont posées sur le sel. Aucun incendie actif, aucune flamme libre — les torchères sont éteintes, faute de débit. Aucun texte.

**Ambiance.** Nuit industrielle. Torchères éteintes, lueurs de veille, brume chaude de l'Haleine du Sud qui teinte l'horizon d'orange braise. La chaleur reste, même sans soleil.

**Contraintes techniques.** Carré 1024 × 1024. Cadrage 3/4 aérien 35°. Aucun texte. Bord perdu. Zone de cartouche vide. Densité constante.

### 6.8 `cite_metaux.png` — Cité des Métaux & Recyclage

**Sujet.** « Les Fossoyeurs ». Au centre exact du bassin asséché, sur l'ancienne île de Malte, une cité bâtie de récupération : ses murs sont faits de gratte-ciels couchés. C'est le point de passage obligé de quiconque traverse le désert de sel d'une rive à l'autre.

**Cadrage et composition.** Trois-quarts aérien à 35°, nord en haut. **Le désert de sel entoure la cité au loin, à 360°, jusqu'aux quatre bords.** La cité est dense, verticale, asymétrique : un cimetière de gratte-ciels effondrés forme ses remparts, avec des tours encore debout plantées dedans. Une mine à ciel ouvert creuse le flanc ouest. Le marché aux alliages est au centre, en plein air.

**Palette.** `--rust` `#A8501E` et `--rust-soft` `#C97A3E` dominants sur la ferraille. `--rule-strong` `#B8B0A0` pour les gravats et les alliages. `--paper-sunken` `#EAE5DA` et `--salt-glare` `#F2EEE2` pour le sel qui cerne la ville. `--ink` `#1F1C18` pour les ombres profondes.

**Éléments obligatoires.**
- Le cimetière des gratte-ciels : carcasses d'immeubles couchées, empilées, formant rempart, avec des tours encore dressées.
- L'usine de recyclage : long bâtiment industriel, convoyeurs, tas de métaux triés — c'est aussi le siège de la mairie.
- Le marché aux alliages rares : place en plein air, étals couverts, au centre.
- La mine profonde : excavation à ciel ouvert, gradins en spirale, engins, à l'ouest.
- **Le désert de sel visible à 360°**, jusqu'aux bords — la cité est une île dans le sel.

**Éléments à éviter.** **Aucune mer, aucun port, aucune eau autour de la cité** — l'île de Malte est au milieu d'un désert asséché. Aucune lave, aucun feu de forge débordant (la planche actuelle est un paysage volcanique). Aucun texte, aucune étiquette sur fanion.

**Ambiance.** Plein jour, lumière blanche et dure, ciel presque blanc, sans nuage. Le sel environnant renvoie la lumière et brûle tout. Aucune ombre douce.

**Contraintes techniques.** Carré 1024 × 1024. Cadrage 3/4 aérien 35°. Aucun texte. Bord perdu. Zone de cartouche vide. Densité constante.

### 6.9 `cite_medicale.png` — Cité Médicale

**Sujet.** « Les Blouses Blanches ». Sur les ruines d'Alexandrie, la cité du soin : médicaments, chirurgie, prothèses. C'est la seule cité du bassin à avoir choisi le blanc, et cette blancheur est inquiétante — c'est aussi celle qui cache une peste.

**Cadrage et composition.** Trois-quarts aérien à 35°, nord en haut. La cité est propre, ordonnée, presque trop régulière : un damier de bâtiments bas et nets, séparés par des cours. Le laboratoire de virologie est un volume isolé, cerclé, au nord-est. L'unité de quarantaine est un bloc sans fenêtre au sud. La rade asséchée d'Alexandrie borde toute la planche au nord. Le sanctuaire de Vulcain, le seul bâtiment ancien, est au centre-ouest.

**Palette.** `--ink-on-dark` `#E8E3D8` et `--rule` `#D8D2C4` dominants — **le blanc clinique**. `--ink` `#1F1C18` pour les ombres et les blocs fermés. `--artificial` `#3A5F8A` pour l'éclairage intérieur qui filtre. Accents `--ember-red` `#B3392E` très parcimonieux sur les zones de quarantaine.

**Éléments obligatoires.**
- Le laboratoire de virologie : volume isolé, blanc, clôturé, avec ses propres cheminées — écarté du reste.
- L'usine de synthèse de médicaments : long bâtiment technique, tuyauteries, cuves, à l'est.
- L'unité de quarantaine sévère : bloc massif sans ouverture, au sud, seul, gardé.
- Le sanctuaire de Vulcain : le seul bâtiment ancien et sculpté, à l'ouest — un contraste voulu avec le reste.
- La rade asséchée d'Alexandrie : bassins de sel, quais à sec, épaves, sur tout le bord nord.

**Éléments à éviter.** **Aucun bleu de mer, aucune eau** : la rade est un désert de sel. Aucun équipement médical contemporain visible (croix rouge, ambulance, brancard roulant) — le monde est rouillé, pas moderne. Aucun texte, aucun panneau.

**Ambiance.** Petit matin, brume de sel, lumière blanche et diffuse, sans ombre marquée. Le calme est total, presque anormal. Aucun mouvement visible.

**Contraintes techniques.** Carré 1024 × 1024. Cadrage 3/4 aérien 35°. Aucun texte. Bord perdu. Zone de cartouche vide. Densité constante.

### 6.10 `cite_divertissement.png` — Cité du Divertissement

**Sujet.** « Les Faiseurs de Rêves ». Sur le cœur de Rome, une cité-spectacle qui vend de l'illusion et de la propagande. Le Colisée, réemployé, est son centre ; des studios de radio et un casino l'entourent. C'est la cité la plus heureuse du bassin — et c'est une mise en scène.

**Cadrage et composition.** Trois-quarts aérien à 35°, nord en haut. La grande arène occupe le centre, éventrée mais utilisée, avec gradins de fortune. Autour, un tissu organique de théâtres, de studios et de baraques, plus dense et plus coloré que partout ailleurs. Les forums antiques servent de place publique au sud. Des projecteurs et des mâts de diffusion hérissent le pourtour. Les quartiers « de l'actionnaire fondateur » forment des enclaves closes.

**Palette.** `--arcane` `#6B4E8C` dominant — la teinte du spectacle et du mensonge. `--ember` `#C4801A` et `--rust-soft` `#C97A3E` pour les lumières et les façades. `--ink` `#1F1C18` pour les coulisses. `--rule-strong` `#B8B0A0` pour la pierre antique des forums.

**Éléments obligatoires.**
- La grande arène de combat : ellipse éventrée, gradins, sable, au centre.
- Les studios de radiodiffusion : mâts, antennes, câbles, toits hérissés, à l'est.
- Le casino de la Ruine : façade haute et décorée, éclairage, au nord-est.
- Le théâtre des illusions : bâtiment à scène ouverte, rideaux, toiles tendues, au sud-ouest.
- Le Colisée réemployé : la pierre antique, en partie effondrée, transformée en fonction de spectacle — les ruines romaines doivent être reconnaissables.

**Éléments à éviter.** Aucune foule en liesse, aucun feu d'artifice, aucun confetti. Aucun rose, aucun mauve saturé : `--arcane` est un violet **assombri et désaturé**. Aucune architecture romaine intacte et propre — elle est en ruine et rafistolée. Aucun texte, aucune affiche lisible.

**Ambiance.** Nuit de fête, artificielle. Lumière de projecteurs et d'enseignes, pas de soleil. Fumée, poussière en suspension qui diffuse les lueurs violettes et ambrées. L'horizon, au loin, reste noir.

**Contraintes techniques.** Carré 1024 × 1024. Cadrage 3/4 aérien 35°. Aucun texte. Bord perdu. Zone de cartouche vide. Densité constante.

### 6.11 `ile_anciens.png` — L'Île des Anciens

**Sujet.** « Le Paradis Perdu ». Un ancien bunker sous-marin pré-guerre remonté à la surface quand les mers ont reculé, à l'ouest du détroit de Gibraltar. Vue de loin, c'est un paradis intact : blancheur, jardins, technologie qui fonctionne. Vue de près, les habitations sont désertes et la perfection est glaçante.

**Cadrage et composition.** Trois-quarts aérien à 35°, nord en haut. **L'île est cernée d'océan, réellement en eau** — c'est le seul endroit du monde où il en reste, avec le Mur de Sel à l'est, très loin. Un mur d'enceinte polygonal ceint l'ensemble, avec un port en eau profonde au sud-ouest. Au centre, une sphère lumineuse bleue alimente l'île sans source apparente. Des jardins ordonnés et des bâtiments blancs lisses l'entourent, tous vides.

**Palette.** `--arcane` `#6B4E8C` et `--reactor` `#4A7C3F` dominants — un vert vivant, anormal. `--ink-on-dark` `#E8E3D8` pour les habitations blanches. `--artificial` `#3A5F8A` pour la sphère et les lueurs. Océan en `--ink` `#1F1C18` avec des crêtes `--ink-on-dark-muted`.

**Éléments obligatoires.**
- Le marché d'échanges : quais de **pierre blanche**, étrangement calmes et propres.
- La sphère du générateur : volume sphérique bourdonnant, lumière bleue douce, **sans aucune source d'énergie visible ni tuyauterie**.
- Les habitations « lisses et blanches, étrangement désertes » : rangées de maisons propres, sans un être, sans un débris, sans un véhicule.
- Les champs de force côtiers : lignes électromagnétiques discrètes, visibles seulement comme des distorsions au-dessus de l'eau.
- **L'océan Atlantique, en eau, tout autour** — la seule masse d'eau libre de tout le jeu.

**Éléments à éviter.** **Aucune rouille, aucun débris, aucune ruine, aucune poussière de sel** — c'est précisément ce qui rend le lieu faux. Aucun texte, aucun habitant visible, aucun drapeau, aucune arme. Aucun vert fluo ni violet néon : tout doit être **trop propre**, jamais criard.

**Ambiance.** Jour de beau temps, sans vent, sans tempête, sans nuage. C'est le seul lieu du monde sans climat hostile, et cela doit mettre mal à l'aise. Lumière douce, nette, sans poussière. Aucun halètement, aucun son suggéré.

**Contraintes techniques.** Carré 1024 × 1024. Cadrage 3/4 aérien 35°. Aucun texte. Bord perdu. Zone de cartouche vide. Densité constante.

### 6.12 `local_city_map.png` — Quartier urbain générique

**Sujet.** Un quartier de cité-état, sans identité propre : tissu dense, rues, petites places, ateliers, marché. Aucun monument, aucun élément signature — cette planche doit pouvoir représenter n'importe quel quartier de n'importe laquelle des dix cités.

**Cadrage et composition.** Trois-quarts aérien à 35°, nord en haut, cadrage identique aux planches de cité. Le tissu bâti remplit toute la surface, sans mur ni limite visible : le quartier se poursuit au-delà des quatre bords. Une rue principale traverse la planche du nord au sud, légèrement sinueuse. Aucune silhouette dominante.

**Palette.** `--rust` `#A8501E`, `--rust-soft` `#C97A3E` et `--ink` `#1F1C18`. Taches de `--paper-sunken` sur les toits poussiéreux.

**Éléments obligatoires.**
- Un tissu bâti dense et **irrégulier** : toits imbriqués, hauteurs variées, ruelles.
- Une rue principale traversante, avec étals, charrettes, cordes à linge.
- Une petite place avec un point d'eau public (bassin de béton, pas d'eau vive).
- Une structure verticale isolée : un réservoir, un château d'eau, une cheminée.

**Éléments à éviter.** Aucun monument reconnaissable (ni Colisée, ni gratte-ciel, ni dôme). Aucune eau courante vive. Aucune muraille. Aucun texte, aucun panneau, aucun fanion (la planche actuelle porte un titre et dix étiquettes en anglais).

**Ambiance.** Fin de matinée, ciel sans couleur, poussière fine. Activité humaine suggérée — silhouettes, fumées, linge — mais aucune foule détaillée.

**Contraintes techniques.** Carré 1024 × 1024. Cadrage 3/4 aérien 35°. Aucun texte. Bord perdu. Zone de cartouche vide.

### 6.13 `local_ruins.png` — Ruines / ville morte

**Sujet.** Une ville morte. Immeubles éventrés, rues envahies par le sable et le sel, véhicules calcinés. Aucune présence vivante, aucune lumière allumée. C'est le décor d'un lieu exploré avant d'être habité.

**Cadrage et composition.** Trois-quarts aérien à 35°, nord en haut. Des blocs d'immeubles effondrés, en quinconce, laissent voir des rues encombrées de débris. Le sable et le sel montent sur les façades, du sud vers le nord. Un axe routier se distingue à peine. Aucun point focal unique.

**Palette.** `--rust-deep` `#8A3D14`, `--rule-strong` `#B8B0A0`, `--ink` `#1F1C18`. `--paper-sunken` `#EAE5DA` pour les dunes qui recouvrent les rues.

**Éléments obligatoires.**
- Des immeubles éventrés : façades ouvertes, planchers effondrés visibles en coupe.
- Des rues envahies par le sable et le sel, à niveaux différents.
- Des carcasses de véhicules pré-guerre, calcinées, rouillées, en petit nombre.
- Une dune de sel qui recouvre une partie de la planche, du sud.

**Éléments à éviter.** **Aucune végétation** — les ruines sont mortes, pas reprises par la nature. Aucune silhouette humaine. Aucune lumière allumée. Aucun texte.

**Ambiance.** Ciel de poussière, lumière jaune-verte diffuse, sans ombre. Le vent soulève un voile de sel. Silence total.

**Contraintes techniques.** Carré 1024 × 1024. Cadrage 3/4 aérien 35°. Aucun texte. Bord perdu. Zone de cartouche vide. Niveau de détail moyen.

### 6.14 `local_salt.png` — Désert de sel

**Sujet.** Le désert de sel méditerranéen, loin de toute cité. Une plaine infinie de croûte saline craquelée, ponctuée de dunes salines basses. C'est le décor le plus fréquent du jeu : 90 % du monde est fait de cette planche.

**Cadrage et composition.** Trois-quarts aérien à 35°, nord en haut, mais **sujet étendu** : pas de point focal, un horizon lointain vers le haut de la planche, des premiers plans très texturés vers le bas. Un unique repère isolé — une épave, un pylône, une carcasse — occupe environ un huitième de la largeur, hors du centre. Des traces de passage (ornières, pas) traversent la planche en diagonale.

**Palette.** `--paper-sunken` `#EAE5DA` et `--salt-glare` `#F2EEE2` dominants. Ombres des crevasses en `--rule` `#D8D2C4`. Repère isolé en `--rust` `#A8501E`. Ciel `--rule-strong` `#B8B0A0`.

**Éléments obligatoires.**
- Une croûte de sel craquelée, en polygones, occupant la majorité de la surface.
- Des dunes salines basses, aux crêtes nettes, orientées par le vent.
- Un repère isolé et identifiable : épave de véhicule, pylône, carcasse.
- Des traces de passage : ornières, empreintes, une piste à peine marquée.

**Éléments à éviter.** Aucune végétation. Aucune eau visible. Aucune structure bâtie (la planche doit servir pour un campement, pas pour un lieu déjà peuplé). Aucun texte.

**Ambiance.** Plein jour, lumière blanche aveuglante, aucun nuage, ombres très courtes. Le sel au sol réverbère. Aucune brume.

**Contraintes techniques.** Carré 1024 × 1024. Cadrage 3/4 aérien 35°. Aucun texte. Bord perdu. Zone de cartouche vide. **Niveau de détail faible** : c'est une étendue, pas un sujet dense.

### 6.15 `local_outpost.png` — Avant-poste / campement

**Sujet.** Un campement de fortune : enceinte sommaire de tôles et de barbelés, tentes, mirador, feu allumé, quelques véhicules. Il sert de camp de pillards, de halte de convoi, de base avancée ou de pied-à-terre.

**Cadrage et composition.** Trois-quarts aérien à 35°, nord en haut. Le camp occupe le centre de la planche, en ovale irrégulier, avec une seule entrée au sud. Autour, le désert de sel vide, jusqu'aux bords. Le feu est au centre. Les véhicules sont garés en désordre à l'est. Le mirador domine au nord.

**Palette.** `--rust` `#A8501E` et `--ember` `#C4801A` sur les tôles et le feu. `--ink` `#1F1C18` pour les tentes et les ombres. `--paper-sunken` `#EAE5DA` pour le sel environnant.

**Éléments obligatoires.**
- Une enceinte sommaire : tôles, piquets, barbelés, planches — **pas de mur de pierre**.
- Des tentes et des abris de toile, groupés autour d'un feu allumé.
- Un mirador ou une tour de guet en bois et tôle, au nord, dominant le camp.
- Des véhicules de récupération, hétéroclites, garés à l'est.

**Éléments à éviter.** Aucune architecture permanente ni muraille de pierre. Aucune végétation. Aucune eau courante. Aucun texte.

**Ambiance.** Nuit tombée. Le camp est éclairé par son propre feu, seul point chaud de toute la planche ; le désert autour est noir. Brume chaude de l'Haleine du Sud à l'horizon.

**Contraintes techniques.** Carré 1024 × 1024. Cadrage 3/4 aérien 35°. Aucun texte. Bord perdu. Zone de cartouche vide. Niveau de détail moyen.

### 6.16 `local_bunker.png` — Souterrain / bunker

**Sujet.** Un réseau souterrain pré-guerre : galeries, sas, coursives, salles techniques, éclairage de secours qui fonctionne encore par endroits. C'est le décor de la salle du trône sous la citerne, de la passerelle de la Source, et de tout lieu enfoui.

**Cadrage et composition.** Trois-quarts aérien à 35°, nord en haut, **en coupe** — comme `bunker_omega.png`, dont cette planche est la version générique. La roche brute cerne la planche sur les quatre côtés. Les galeries s'organisent autour de deux ou trois salles, dont une plus grande au centre. Un sas vertical ouvre vers la surface, en haut.

**Palette.** `--ink` `#1F1C18` dominant, `--rule-strong` `#B8B0A0` pour la roche, `--artificial` `#3A5F8A` pour l'éclairage de secours, `--rust` `#A8501E` pour les portes et les structures métalliques.

**Éléments obligatoires.**
- Des galeries enterrées, à plusieurs niveaux, reliées par des coursives et des escaliers.
- Un sas d'entrée vertical, avec une double porte métallique, vers la surface.
- Une grande salle centrale, voûtée ou à piliers, la plus vaste du réseau.
- Un éclairage de secours partiel : certaines zones éclairées froid, d'autres totalement noires.
- La roche brute en coupe, tout autour : on doit comprendre qu'on est sous terre.

**Éléments à éviter.** Aucun équipement contemporain lisible (écrans modernes, mobilier de bureau actuel). Aucun plan technique, aucune cotation, aucune lettre. Aucune végétation. Aucun texte.

**Ambiance.** Pas de ciel, pas d'heure. Lumière artificielle froide, partielle, avec des zones d'obscurité totale. Poussière en suspension dans les faisceaux. Air immobile.

**Contraintes techniques.** Carré 1024 × 1024. Cadrage 3/4 aérien 35° en coupe. Aucun texte. Bord perdu. Zone de cartouche vide. Niveau de détail moyen.

---

## 7. Règles d'or et interdits

Contrôle qualité, planche par planche. Chaque règle est vérifiable à l'œil sur une planche finie.

**Sur le cadrage et l'orientation**

1. **Nord en haut, sur les seize planches, sans exception.** *Parce qu'un joueur qui change de carte ne doit pas avoir à se réorienter ; trois des planches actuelles n'ont même pas de repère de nord.*
2. **Cadrage identique d'une planche locale à l'autre : trois-quarts aérien à 35°, nord en haut.** *Parce que le constat § 2.8 montre trois cadrages incompatibles — vertical, trois-quarts, plan à plat — entre les planches existantes.*
3. **Bord perdu sur les quatre côtés.** *Parce que le pan et le zoom doivent pouvoir sortir du sujet sans découvrir du vide.*
4. **Zone de cartouche vide, 48 px en bas.** *Parce que le cartouche est un élément d'interface, et qu'un cartouche incrusté ne serait pas repositionnable.*

**Sur la couleur**

5. **Palette fermée : rien hors du § 1.3 et des deux extensions nommées.** *Parce que six planches actuelles emploient six palettes sans rapport entre elles.*
6. **`--reactor` réservé à la vie : le Rhône, les serres, L'Île des Anciens. 5 % de surface maximum.** *Parce que le bassin est un désert, et que la couleur vivante est le seul signal de survie du monde.*
7. **Les zones irradiées ne sont jamais vert fluo.** *Parce que le lore les décrit comme des sols vitrifiés et du sel contaminé, pas comme du néon (`nuke_city.png` actuel).*
8. **Tout fond sombre se construit sur `--ink`, jamais sur un noir pur.** *Parce que la DA (§ 05) établit qu'un noir pur sur du papier jauni donne un gris sale, et que la carte doit tenir dans la même identité.*
9. **Aucune teinte saturée : les accents sont désaturés et assombris.** *Parce que la DA (§ 03) le justifie déjà pour la rouille et l'ambre, et que le vert fluo de la planche Nuke City est l'exact contre-exemple.*

**Sur le texte et les marqueurs**

10. **Aucun texte, chiffre ou lettre incrusté dans l'image.** *Parce qu'un texte incrusté n'est ni traduisible, ni repositionnable, ni sensible au zoom, ni informé de l'état du jeu — et que trois planches existantes en portent, en anglais.*
11. **Aucun marqueur, pastille, pin ou icône dans l'image.** *Parce que les marqueurs portent de l'état (révélé, secret, détruit) que l'image ignore.*
12. **Aucune légende, aucune échelle, aucune rose des vents dans l'image.** *Parce que ces éléments sont identiques d'une planche à l'autre et que les redessiner seize fois est seize occasions de diverger.*

**Sur le monde**

13. **Aucune mer, aucun lac, aucun cours d'eau dans le bassin — sauf le Rhône.** *Parce que le bassin est asséché par le Mur de Sel, et que `cite_eau.png` montre aujourd'hui de l'eau turquoise abondante, ce que le lore interdit.*
14. **Aucune végétation hors du Rhône, des serres et de L'Île des Anciens.** *Parce que le bassin est un désert de sel, et que `cite_eau.png` montre une palmeraie.*
15. **Aucune architecture contemporaine intacte ni équipement moderne.** *Parce que le monde est fait de ruines rouillées et de récupération ; une croix rouge, une ambulance ou un écran plat sont des anachronismes.*
16. **Aucun anachronisme médiéval-fantastique.** *Parce que `cite_armement.png` est aujourd'hui une forteresse de château fort avec créneaux, tentes de toile et herse — un registre étranger à ce monde.*
17. **Aucune lave, aucun volcan, aucun feu naturel.** *Parce que `cite_metaux.png` montre des coulées de lave rutilantes, et qu'aucun document de lore n'en mentionne.*
18. **Le climat du bassin est celui du lore : chaleur écrasante, sel, vents alternés, tempêtes.** *Parce que l'ambiance doit rappeler que survivre dehors est un problème, et que l'heure du jour doit correspondre au Vent Blanc (jour) ou à l'Haleine du Sud (nuit).*
19. **L'Île des Anciens n'est jamais montrée comme confirmée sur la carte du monde.** *Parce que le lore en fait un mythe ironique, et que la révéler ruine le secret de campagne.*

**Sur l'exécution**

20. **Densité de détail constante sur toute la planche.** *Parce qu'un centre sur-détaillé et des bords flous est le défaut spontané d'un générateur d'images.*
21. **Le point d'ancrage géographique de chaque cité est visible, à sa position de gabarit.** *Parce que c'est ce qui relie la carte de ville à la carte du monde.*
22. **Une planche de secours est interchangeable ; une planche de cité est signée.** *Parce que les cinq planches génériques servent 99 lieux, et que les dix autres doivent être reconnaissables entre elles.*

---

## 8. Plan de production et critères d'acceptation

### 8.1 Ordre de production

L'ordre est dicté par le rapport entre le risque de divergence et le coût de reprise : on produit d'abord ce qui verrouille les conventions, on produit en dernier ce qui en dépend.

| Ordre | Planches | Pourquoi cet ordre | Effort |
|---|---|---|---|
| **1** | `local_salt.png`, `map-lore-base.png` | Les deux planches les plus **pauvres en détail**. Ce sont elles qui fixent la palette, la lumière et l'échelle de texture sans qu'une erreur d'architecture ne vienne polluer le jugement. Elles servent d'**étalon couleur**. | 1 passe |
| **2** | `local_city_map.png`, `local_ruins.png`, `local_outpost.png` | Le gabarit local s'éprouve ici, sans enjeu narratif. Si le cadrage 35°, le bord perdu ou la zone de cartouche ne tiennent pas, c'est sur ces trois planches qu'on le découvre, pas sur une cité. | 1 passe |
| **3** | `nuke_city.png`, `cite_armement.png` | Les **deux cas les plus dégradés** : Nuke City pour son vert fluo et son texte incrusté, l'Armement pour son registre médiéval. Si le kit ne rattrape pas ces deux-là, il ne rattrapera rien. Ce sont les planches de validation. | 2 passes |
| **4** | `cite_eau.png`, `cite_industrielle.png`, `cite_carburant.png`, `cite_metaux.png` | Les quatre cités à identité visuelle forte et non ambiguë : le vert du fleuve, l'orange de la fonderie, le noir du pétrole, la ferraille de Malte. Peu de risque une fois l'étape 3 passée. | 1 à 2 passes |
| **5** | `cite_medicale.png`, `cite_divertissement.png` | Les deux cités à identité chromatique **contre-intuitive** : le blanc clinique de la Cité Médicale et le violet du spectacle. À produire après, quand la palette fermée est bien en main — sinon elles dériveront vers le bleu et le rose. | 2 passes |
| **6** | `bunker_omega.png`, `local_bunker.png` | Les deux **vues en coupe**. Elles demandent un cadrage particulier et ne se jugent pas comme les autres. Les produire ensemble, à la fin, quand tout le reste est calé. | 2 passes |
| **7** | `ile_anciens.png` | La planche la plus particulière (océan en eau, aucune rouille, perfection inquiétante). En dernier, parce qu'elle ne doit **pas** servir de référence : c'est l'exception assumée du kit. | 2 passes |

**Effort total estimé :** 11 à 13 passes de génération pour les seize planches, soit environ une passe et demie par planche. Le budget le plus lourd est à l'étape 3 (validation du kit) et à l'étape 5 (contre-intuition chromatique).

### 8.2 Critères d'acceptation

Une planche est acceptée si et seulement si elle satisfait les huit critères suivants. Chaque critère a une méthode de vérification exécutable sans jugement artistique.

| # | Critère | Vérification | Reproche si échec |
|---|---|---|---|
| 1 | **Aucun texte dans l'image** | Recherche visuelle de tout glyphe, chiffre ou lettre ; zoom à 200 % sur les zones denses | Rejet, régénération |
| 2 | **Nord en haut et cadrage conforme** | Comparaison de la silhouette générale avec la planche étalon de l'étape 1 | Rejet, régénération |
| 3 | **Palette fermée** | Prélèvement de 12 points au hasard sur la planche ; aucune teinte hors § 1.3 (tolérance de 8 % sur la teinte, 15 % sur la saturation) | Correction colorimétrique possible si le reste est bon |
| 4 | **`--reactor` sous 5 % de surface** | Estimation visuelle de la part verte ; sur `nuke_city`, vérifier en plus qu'aucun vert n'est saturé | Correction, puis re-vérification |
| 5 | **Absence des interdits du § 7** | Contrôle de la liste : mer dans le bassin, végétation, lave, architecture médiévale, équipement moderne | Rejet, régénération |
| 6 | **Point d'ancrage visible à sa position de gabarit** | Pour les dix cités : l'élément d'ancrage du § 4.2 est-il présent, au bord attendu ? | Rejet ou recadrage |
| 7 | **Densité de détail constante** | Comparaison du niveau de détail entre le centre et les quatre coins de la planche | Acceptable si l'écart est faible ; sinon régénération |
| 8 | **3 à 5 éléments obligatoires présents et reconnaissables** | Lecture du § 6 pour la planche concernée, et pointage un par un | Rejet partiel : les éléments manquants seuls vont en régénération ciblée |

### 8.3 Ce qui n'est pas couvert par ce document

Pour éviter de refaire ce qui est fait, ou d'attendre de ce document ce qu'il ne porte pas :

- **La correction du code.** Ce document spécifie ce que les cartes doivent montrer ; il ne décrit pas les corrections d'implémentation. Le constat § 1.5 à § 1.8 et § 2.1 à § 2.5 les liste, et le § 3 de son annexe les classe en trois livrables. Le travail de code est le troisième.
- **Le sort de `world_map.png`.** Deux fonds de carte du monde coexistent sur le disque (`map-lore-base.png` et `world_map.png`), et le constat n'en mentionne qu'un. À trancher (§ 9).
- **La forme exacte de la donnée.** L'état des lieux secrets (`HIDDEN` / `GM_ONLY` / `REVEALED`) et la portée des lieux (urbaine / périurbaine / régionale) sont des exigences fonctionnelles ; leur schéma appartient au chantier de code.
- **L'écran de table.** Hors périmètre de la DA (§ 09). La carte y est projetée, mais son rendu nocturne n'est pas l'objet de ce document.

---

## 9. Points à trancher par Hadrien

Sept décisions relèvent de l'auteur du lore et non de la production.

| # | Question | Options | Recommandation |
|---|---|---|---|
| 1 | **Part de texte incrusté dans les planches** | (a) zéro, tout à l'interface — (b) quelques glyphes invariants (le « 06h12 » gravé) — (c) titres incrustés comme aujourd'hui | **(a) zéro.** Les quatre raisons du § 4.7 sont décisives : non traduisible, non repositionnable, insensible au zoom, ignorante de l'état du jeu. Mais c'est ton univers : si le « 06h12 » doit être peint dans la pierre, il faut le dire, et il faudra l'accepter en anglais-français figé. |
| 2 | **Traitement de L'Île des Anciens sur la carte du monde** | (a) invisible jusqu'à décision du MJ — (b) cercle de doute discret, visible au-delà de 100 % de zoom — (c) cercle permanent de doute | **(b).** Le lore en fait une *private joke* : un cercle permanent la vend trop cher, une absence totale prive le MJ d'un repère. Le zoom conditionnel entretient le mythe sans le confirmer. |
| 3 | **`bunker_omega.png` : plan technique ou vue en coupe** | (a) garder le registre du plan (illégal dans la matrice) — (b) vue en coupe rétablie en ville | **(b).** Le plan actuel est incompatible avec les neuf autres planches ; la coupe respecte le lore (« cité souterraine ») tout en produisant une *ville*. C'est le point le plus lourd du kit. |
| 4 | **Les deux extensions de palette** | (a) créer `--salt-glare` et `--glass-crust` — (b) se rabattre sur les jetons existants | **(a).** Sans réserve de blanc, le désert de sel — sujet central du monde — se lit comme du sable gris. Les deux valeurs sont proposées au § 1.4, à ajouter en couche 1 de `index.css`. |
| 5 | **`world_map.png` : doublon à retirer ou variante à définir** | (a) supprimer — (b) en faire une carte « administrative » sans relief, pour la lecture de faction — (c) en faire la carte du monde côté joueurs | **(b) ou (a).** Deux fonds pour une même carte est une dette de maintenance. Une variante sans relief aurait un vrai usage en séance (lire les territoires sans que le relief brouille), mais ce n'est pas nécessaire pour livrer. |
| 6 | **Origine et densité des lieux sur les cartes de ville** | (a) pré-remplir automatiquement les cartes depuis `loreData.js` — (b) laisser le MJ placer lui-même — (c) hybride : pré-remplissage des familles A et B, placement manuel des C, D, E | **(c).** Le constat § 2.1 montre que le placement aléatoire actuel est le premier défaut ; le catalogue § 2.7 existe déjà et n'est pas exploité. Pré-remplir le structurel et le fonctionnel rend les dix villes utilisables dès l'ouverture, sans retirer au MJ la main sur les quartiers et les secrets. |
| 7 | **Portée des lieux hors-cité** | La `clinique du rite` est « à ~2h de route », le `poste d'écoute atlantique` est sur le Mur. Comment les représenter ? | **Flèche de renvoi** au bord de la zone de sujet, en `--ember-red` pointillé, plus un report sur la carte du monde à leur position réelle. À valider : cela introduit une notion de portée (urbaine / périurbaine / régionale) dans la donnée. |

---

## Annexe A — Divergences relevées avec le constat

Trois points, dont deux à corriger dans le constat lui-même. Aucun ne remet en cause ses conclusions de fond.

**A.1 — Le rapport de projection ne vaut pas exactement 1 / cos(45,6°).**

Le constat § 1.1 écrit : « Le rapport des deux coefficients vaut 1,400. C'est exactement 1 / cos(45,6°) ». Vérification faite : 66,68 / 47,63 = **1,39996**, ce qui correspond à cos φ = 1/1,400, soit φ = **44,42°**. Or 1 / cos(45,6°) = **1,42926**, soit un rapport de 1,429 — trois pour cent d'écart. L'affirmation « exactement » est inexacte.

La conclusion du constat reste bonne, et l'erreur va même dans un sens favorable : le bassin s'étend de 31,2° N (Alexandrie) à 46,2° N (Genève), donc de part et d'autre de 44,4° N. Une Mercator calibrée sur 44,4° est **mieux centrée** sur la zone réellement couverte par la carte qu'une Mercator calibrée sur 45,6°, qui serait décentrée vers le nord. La valeur à employer est donc 1,400, et le commentaire du cahier des charges mérite correction — mais la projection n'est pas davantage remise en cause : j'ai revérifié les dix couples, et la transformation linéaire les reproduit tous à moins d'un pixel (seul Nuke City dévie d'une unité sur Y). Le constat § 1.1 est confirmé sur le fond.

**A.2 — Le dossier contient treize PNG, pas dix.**

Le constat § 2.8 énumère « les dix planches existantes (`cite_eau.png`, `nuke_city.png`, `bunker_omega.png`…) ». Le relevé réel de `client/public/assets/` donne **treize fichiers PNG** :

- Onze planches de la famille monde/cité : `map-lore-base.png`, `cite_eau.png`, `nuke_city.png`, `bunker_omega.png`, `cite_industrielle.png`, `cite_armement.png`, `cite_carburant.png`, `cite_metaux.png`, `cite_medicale.png`, `cite_divertissement.png`, `ile_anciens.png` ;
- Plus `world_map.png`, **seconde carte du monde**, absente de l'inventaire du constat et de son grief de doublon ;
- Plus `local_city_map.png`.

`world_map.png` est donc un doublon de fond de carte du monde, non signalé. Ajouté au § 9, point 5.

**A.3 — Le constat est en dessous de la réalité sur le § 2.8.**

Le constat § 2.8 écrit que les planches « ont été produites sans cadre commun : styles, échelles, orientations cardinales et densités de détail diffèrent d'une planche à l'autre ». Après examen direct de huit planches sur treize, l'écart est plus large que « diffèrent d'une planche à l'autre ». Il ne s'agit pas de variations autour d'un canon commun, mais de **trois ou quatre registres graphiques sans aucun rapport** : un plan d'architecte de science-fiction (`bunker_omega.png`), une forteresse médiévale-fantastique (`cite_armement.png`), une oasis turquoise (`cite_eau.png`), et un plan de jeu « wasteland » anglo-saxon avec titre, légende et échelle incrustés (`local_city_map.png`). Surtout, **aucune planche ne représente le désert de sel**, qui est le sujet central du monde : le constat parle d'incohérence de cadre, alors qu'il y a aussi une incohérence de sujet. La conclusion opérationnelle — produire seize planches neuves plutôt qu'harmoniser dix planches — en sort renforcée.

---

## Annexe B — Sources

| Source | Ce qui en est tiré |
|---|---|
| `Cahier des charges/Chantier_cartes_v1_Constat.md` | Tous les défauts mesurés (§ 1.1 à § 1.8, § 2.1 à § 2.8), les repères terrestres du § 1.4, l'argument du § 3. |
| `Cahier des charges/DA_Cahier_des_charges_v1.html` | Le parti pris « Sel et rouille », la métaphore du carnet de terrain (§ 02), la palette (§ 03), la typographie (§ 04), les critères d'acceptation (§ 10). |
| `client/src/index.css` | Les jetons bruts, le commentaire des îlots sombres (l. 29-35), les encres d'accent textuelles (l. 51-59), les teintes translucides (l. 75-99), l'échelle typographique (l. 114-121). |
| `Cahier des charges/architecture et fonctionnement.md` § 7 | La projection GPS → canvas et le tableau des dix cités, avec faction dominante, emplacement réel et coordonnées. |
| `Lore et univers/Universe_Lore_v9.txt` | *LE RECUL DES MERS*, *LE MUR DE SEL*, *LE SEL BLANC*, *LE CLIMAT DU BASSIN*, *LE RÉSEAU SOUTERRAIN*, *LES VENTS DU BASSIN*, *LES TEMPÊTES DU BASSIN*, *RADIATIONS ET DUNES*, *SITES DANGEREUX CONNUS*, *LE CIEL DU BASSIN*, *LES NUITS DU BASSIN*, *L'ÎLE DES ANCIENS : LA LÉGENDE*, *UNE HUMANITÉ QUI S'ÉTEINT : LES ENFANTS DU NORD*, *LE SECRET DU DÉBIT QUI FAIBLIT*. |
| `client/src/utils/loreData.js` | Les neuf cités documentées : `num`, `name`, `specialty`, `strength`, `weakness`, `particularity`, `geo`, `params` (sept paramètres), `buildings` (noms des lieux et marqueurs `[mj — …]`). Base des § 4.3, 4.5 et 5.3. |
| `client/public/assets/` | Inspection directe de huit planches sur treize : `map-lore-base`, `cite_eau`, `nuke_city`, `bunker_omega`, `cite_armement`, `cite_metaux`, `ile_anciens`, `local_city_map`. Base du § 5.2 et de l'annexe A. |
| `Cahier des charges/Backlog_priorise_v1.md` | État d'avancement : Vagues 1 et 2 terminées, Vague 3 non commencée, application non testée à une vraie table. Situe le chantier cartes comme travail hors-vague, avant toute production de masse. |
