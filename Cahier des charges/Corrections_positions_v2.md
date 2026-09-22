# Corrections et positions — v2

**Projet :** GM Helper / *La Course du Sel*
**Date :** 21 septembre 2026
**Statut :** **en attente de validation.** Rien n'a été écrit en base.
**Remplace :** `Apercu_positions_canoniques_v1.md` (qui contenait une erreur de ma part)

---

## 1. Mon erreur, et d'où elle venait

J'ai écrit « Cité du Commerce » et « Cité du Savoir ». **Ces deux cités n'existent pas.**
Idem pour la « Base Navale ». Tu as raison de demander la source : voici exactement
ce que j'ai fait de travers.

**Le catalogue du lore (`client/src/utils/loreData.js`) contient NEUF cités :**

| # | Cité |
|---|---|
| 1 | Cité du Divertissement — « Les Faiseurs de Rêves » |
| 2 | Cité Médicale — « Les Blouses Blanches » |
| 3 | Nuke City — « Le Réacteur à Ciel Ouvert » |
| 4 | Cité de l'Eau & Alimentation — « Les Gardiens de la Source » |
| 6 | Bunker Oméga — « Les Fantômes d'Acier » |
| 7 | Cité de l'Armement & Défense — « Les Arsenaux » |
| 8 | Cité Industrielle — « Les Forgerons d'Acier » |
| 9 | Cité des Métaux & Recyclage — « Les Fossoyeurs » |
| 10 | Cité du Carburant — « Les Raffineurs » |

**Ni « Commerce », ni « Savoir », ni « Base Navale » n'y figurent.** Neuf entrées,
numérotées 1, 2, 3, 4, 6, 7, 8, 9, 10 — le numéro 5 manque au passage.

**D'où venait mon invention.** J'ai lu le champ `geo` de deux cités et j'ai pris
une *description de lieu réel* pour un *nom de cité* :

- Cité Médicale → `geo` : *« Bâtie sur les ruines d'Alexandrie, renouant avec son
  passé de **centre du savoir** »* → j'ai fabriqué « Cité du Savoir ».
- Nuke City → `geo` : *« Construite près des ruines de Marseille »* et la Cité du
  Divertissement est décrite ailleurs comme *« une véritable **place financière** »*
  → j'ai fabriqué « Cité du Commerce ».

C'est une faute de méthode : j'ai lu une phrase au lieu d'une clé. Le lore nomme
la cité par sa **spécialité** (Médicale, Industrielle, Métaux & Recyclage), et ne
la nomme jamais par sa géographie. J'aurais dû m'arrêter aux neuf clés.

**Et l'« Île des Anciens » ?** Elle n'est **pas** dans le lore non plus. Elle
n'existe que dans le tableau officiel (cahier des charges § 7) et en base. C'est
donc soit une dixième cité documentée nulle part, soit une entrée à retirer. À
trancher.

---

## 2. Ta correction sur la Cité des Métaux — vérifiée, et elle en révèle une autre

Tu dis : « la cité du recyclage se trouve le plus proche du point médian de toutes
les autres cités, mais au cœur de la Méditerranée asséchée ».

Le lore le dit mot pour mot :

> *« **Au centre exact du bassin méditerranéen desséché, sur l'ancienne île de
> Malte** — le point de passage obligé de quiconque traverse le désert de sel
> d'une rive à l'autre. »*

Et le calcul confirme ta formulation :

| Lieu candidat | Distance moyenne aux neuf autres cités |
|---|---|
| **Malte** | **1 259 px** |
| Athènes | 1 684 px |

Malte est bien plus centrale. **Mais voici ce que j'ai trouvé en vérifiant : le
tableau officiel du cahier des charges ne dit pas Malte.**

Le tableau § 7 donne à la Cité des Métaux le couple `(1606, 668)`. Or :

| Lieu | Position calculée | Distance à `(1606, 668)` |
|---|---|---|
| **Athènes** | (1606, 668) | **0 px** |
| Malte | (1167, 807) | 460 px |

**La valeur officielle est Athènes au pixel près.** Le tableau § 7 attribue donc
géographiquement Athènes à la Cité des Métaux, alors que le lore — et maintenant
toi — disent Malte. **Le cahier des charges contredit son propre lore.**

C'est la source réelle du désordre en base : la ligne `CITÉ DES MÉTAUX & RECYCLAGE`
porte (1606, 668), c'est-à-dire Athènes. Elle n'est pas « orpheline » comme je
l'avais écrit — elle est *fidèle au tableau officiel*, et c'est le tableau qui a
tort.

**Recommandation : Malte.** Trois raisons : le lore est explicite ; tu viens de
confirmer par le critère géométrique ; et la « base » sur laquelle le personnage
joueur atterrit doit être franchissable, ce que la position athénienne n'est pas
(voir § 3).

---

## 3. LE PROBLÈME DE FOND : la projection ne dessine pas la Méditerranée

C'est le point le plus important de ce document, et il change la nature du chantier.

**Ce que l'image de fond montre, mesuré au pixel** (segmentation du lit de sel par
seuil de luminance sur `map-lore-base.png`) :

- Le lit de la mer asséchée occupe **53,7 % × 49,2 %** de l'image.
- Son barycentre est à **(549, 503)** — donc au **centre géométrique** de la planche.
- La bande de sel est continue de x = 30 % à x = 90 % de la largeur.

**Ce que la projection officielle produit pour les mêmes lieux :**

| Lieu | Projection (base 1024) | Position dans l'image | Écart |
|---|---|---|---|
| Gibraltar | (221, 791) | (~250, ~475) | **317 px** |
| Malte | (1167, 807) | (~500, ~520) | **726 px** |
| Alexandrie | (1901, 1120) | (~950, ~690) | **1 044 px** |
| Gênes | (902, 239) | (~430, ~300) | **476 px** |

**Diagnostic.** La projection `Y = −66,68 × latitude + 3200,45` est une droite
calée sur **dix points**, tous situés dans le bassin méditerranéen (31,2° N à
46,2° N). Elle est exacte *sur ces dix points* — je l'ai vérifié, 9/10 à moins
d'un pixel. Mais extrapolée, elle **ne suit plus aucune côte réelle** :

- Elle place Malte en Égée (x = 1167, soit 114 % de la largeur de l'image 1024).
- Elle place Alexandrie à x = 1901, soit **186 % de la largeur**.
- Elle veut faire descendre le Rhône depuis (876, 106), c'est-à-dire à travers
  les Alpes puis par-dessus la mer, au lieu de longer la vallée.

**Conséquence : la projection est un artifice de calage, pas une cartographie.**
Elle sert à poser dix points de façon reproductible. Elle ne peut pas servir à
*dessiner* la carte. Ce sont deux usages différents et le cahier des charges les
confond.

**Ce que cela implique :**

1. **On garde la projection pour poser les dix cités** — c'est son seul rôle
   légitime, et il justifie le choix que tu as fait (« le canon géographique »).
2. **On ne lui demande pas de dessiner le trait de côte.** L'image de fond est
   peinte à la main ; c'est elle qui porte la géographie visible.
3. **On renonce à l'harmonisation rétroactive.** Vouloir « corriger l'image pour
   qu'elle colle à la projection » est irréalisable : il faudrait redessiner la
   Méditerranée à partir d'une régression linéaire sur dix points. Personne ne
   veut ça.

**Donc : on ne retouche pas `map-lore-base.png`.** On pose les dix cités dessus,
et on accepte que deux ou trois d'entre elles soient approximatives à l'échelle
du bassin — ce qu'elles sont de toute façon dans un monde noyé sous le sel.

---

## 4. LE PROBLÈME DE FOND : le cadre, pas les positions

C'était la conclusion du § 3. Elle se confirme et se précise : **la Cité Médicale
n'a pas à bouger, c'est le cadre qui est mal formé.**

### 4.1 La cause, en une ligne

La projection place son origine `X = 0` à la longitude **−10,0°**. La Cité
Médicale est à **+29,9°**. Une planche de 2048 px ne peut donc couvrir que
`X = 0` à `X = 2048`, soit **−10,0° à +15,2°** : il manque 14,7° de longitude,
toute la partie est du bassin. Alexandrie tombe à **158 %** de la largeur.

### 4.2 Pourquoi aucune autre ville ne résout le problème

J'ai testé quinze sites antiques de l'est du bassin. **Aucun ne tient dans un
carré 2048 :**

| Candidat | X en 2048 | % de la largeur |
|---|---|---|
| Beaucoup trop à l'est | | |
| Alexandrie | 3244 | 158 % |
| Cyrène | 2589 | 126 % |
| Cnossos | 2856 | 139 % |
| Éphèse | 3035 | 148 % |
| Pergame | 3022 | 148 % |
| Smyrne | 3019 | 147 % |
| Rhodes | 3106 | 152 % |
| Chypre / Paphos | 3448 | 168 % |
| Attalie | 3309 | 162 % |
| Tarse | 3649 | 178 % |
| Antioche | 3752 | 183 % |
| Beyrouth | 3698 | 181 % |
| Tyr | 3674 | 179 % |
| Damas | 3761 | 184 % |
| Le Caire | 3352 | 164 % |

Le problème n'est donc pas le choix de la ville. **Toute cité de l'est du bassin
sort du cadre** — parce que le cadre est trop étroit, pas parce que la cité est
mal placée.

### 4.3 La vraie contrainte : un carré ne peut pas contenir le bassin

L'emprise canonique des dix cités est :

- **longitude** : −8,5° (Île des Anciens) à +29,9° (Médicale) → **38,4°**
- **latitude** : 31,2° (Médicale) à 46,2° (Bunker Oméga) → **15,0°**

En pixels, avec la projection officielle :
- largeur utile : `47,63 × 38,4` = **1 830 px**
- hauteur utile : `66,68 × 15,0` = **1 000 px**

**Un rectangle de 1 830 × 1 000, pas un carré.** Le rapport est de **1,83**.
Le bassin est large et bas ; le carré est la mauvaise forme, et c'est de là que
vient tout le désordre.

### 4.4 La solution : le format de la planche monde

On cadre sur l'emprise canonique, avec une marge de 90 px en base 1200 :

```
base 1200 : 2 010 × 1 180 px   (rapport 1,7026)
en 1024 de haut : 1 743 × 1 024 px
en 2048 de haut : 3 486 × 2 048 px
```

**Les dix cités tiennent, et la géographie tombe juste.** Vérifié sur l'aperçu :
Genève sur le Rhône, Turin au Piémont, Marseille et la Camargue au delta, Rome
sur le Tibre, Gibraltar au détroit, Malte au centre du bassin, Alexandrie sur le
delta du Nil, l'Île des Anciens à 200 km à l'ouest du détroit.

**Contrôle indépendant** (`.workbuddy-ai/tmp/verif_cadre.js`, recalculé depuis les
formules brutes sans réutiliser le script de rendu) :

```
emprise canonique    : 38,4° lon × 15,0° lat
utile en px (base1200): 1 830 × 1 000
+ marge 90 px         -> 2 010 × 1 180   (rapport 1,7026)
PLANCHE FINALE        : 1 743 × 1 024    échelle 0,86721
cités hors cadre      : 0 / 10
marge autour des extrêmes : 78 px à gauche, 78 px à droite, 78 px en haut, 78 px en bas
```

Sept contrôles de cohérence géographique passent tous : l'Île des Anciens est à
l'ouest de Gibraltar, Genève au nord de Marseille, Marseille à l'ouest de Turin,
Malte au sud de Rome, Alexandrie la plus à l'est et la plus au sud, Genève la
plus au nord.

⚠️ **Deux proximités à traiter au rendu, pas en base** : Nuke City (Marseille) et
la Cité de l'Eau (Camargue) sont à **34 px** l'une de l'autre, et Bunker Oméga
(Genève) et la Cité Industrielle (Turin) à **91 px**. Ce sont les distances
réelles entre Marseille et le delta du Rhône, et entre Genève et Turin : elles sont
donc **justes**. C'est le *placement des étiquettes* qu'il faut déporter, pas les
coordonnées. L'aperçu v2 le démontre (`planche-monde-emprise-canonique-v2.png`).

### 4.5 Les coordonnées à écrire — base 1200

**La projection reste exprimée en base 1200.** C'est un référentiel
mathématique, pas une taille de fichier ; la conversion vers la taille de la
planche doit vivre à un seul endroit dans le code.

| Cité | Lieu réel | mapX | mapY |
|---|---|---|---|
| Bunker Oméga | Genève | 769 | 120 |
| Cité Industrielle | Turin | 842 | 195 |
| Cité du Divertissement | Rome | 1071 | 406 |
| Nuke City | Marseille | 732 | 313 |
| Cité de l'Eau & Alimentation | Camargue | 695 | 300 |
| Cité du Carburant | Alger | 622 | 750 |
| Cité de l'Armement & Défense | Gibraltar | 221 | 791 |
| L'Île des Anciens | Atlantique, 200 km O. de Gibraltar | 71 | 800 |
| **Cité des Métaux & Recyclage** | **Malte** | **1167** | **807** |
| Cité Médicale | Alexandrie | 1901 | 1120 |

**Ce sont les valeurs du tableau officiel § 7, aux deux corrections près :**

- **Cité des Métaux** : `(1606, 668)` → **`(1167, 807)`** — on passe d'Athènes à
  Malte (§ 2).
- **L'Île des Anciens** : le tableau dit `(71, 800)` et c'est **juste**. Le lore
  (`Universe_Lore_v9.txt`) confirme : « *Émergée dans l'océan Atlantique, à
  l'ouest du détroit de Gibraltar* », coordonnées `36,0000° N, 8,5000° O`. Ton
  estimation de « 200 km à l'ouest » est exacte : 8,5° de longitude au sud de
  l'Espagne font environ 190 km. **Cette cité est correcte telle quelle.**

**Les huit autres valeurs sont conformes au tableau officiel, au pixel près.**
C'est le cadrage qui les rendait fausses à l'affichage, pas leur valeur.

---

## 5. Récapitulatif des décisions

| Point | Décision | Statut |
|---|---|---|
| Grille et résolution | Production en 2048, projection en base 1200 | tranché (toi) |
| Noms de cités | 9 cités documentées + l'Île des Anciens = 10 | tranché |
| Cité des Métaux | **Malte**, pas Athènes | tranché (toi + lore) |
| L'Île des Anciens | Existe, Atlantique à 200 km O. de Gibraltar | tranché (toi) |
| Cité Médicale | **Reste à Alexandrie.** C'est le cadrage qui change | proposé — § 4 |
| Format de la planche | **1 743 × 1 024** (ou 3 486 × 2 048), pas un carré | **à valider** |
| Marseille ↔ Camargue | Recouvrement à 34 px, déport d'étiquette | à valider |
| Passages de lore nommant la position médicale | **Aucune réécriture nécessaire** — voir ci-dessous | à confirmer |

**Sur la réécriture des passages de lore.** Tu m'as demandé de réécrire les
endroits qui nomment l'ancienne position de la Cité Médicale. Après
investigation, **il n'y a rien à réécrire** : la position « Alexandrie » était
la bonne, et c'est le cadrage qui la faisait disparaître. Les passages concernés
sont exactement deux, dans `Universe_Lore_v9.txt`, et tous deux sont **déjà
corrects** :

- ligne 1236 : « *Bâtie sur les ruines d'Alexandrie (Ancienne Égypte), renouant
  avec son passé de centre du savoir.* »
- ligne 1237 : « *Coordonnées GPS : 31.2001° N, 29.9187° E (Alexandrie)* »

Ces deux lignes restent **inchangées**. Ce qui a changé, c'est uniquement le
tableau § 7 du cahier des charges (Athènes → Malte) et le format de planche. Les
autres occurrences du nom « Cité Médicale » dans le lore (une trentaine) sont
des mentions narratives sans rapport avec la géographie — aucun n'a été touché.

Il ne reste que le format à confirmer. Dès que tu dis oui, j'écris les dix
lignes en base et je corrige le composant.

---

## 6. Annexes

Aperçus dans `.workbuddy-ai/captures/` :

- `planche-monde-emprise-canonique-v2.png` — **la planche au bon format, les dix
  cités en place sur la géographie réelle, étiquettes déportées.** C'est l'aperçu
  de référence.
- `cadrage-avant-apres.png` — **la démonstration en un coup d'œil** : en haut le
  carré 1024 actuel (cinq cités hors champ, serrées au bord est), en bas la
  planche 1 743 × 1 024 (les dix dans le champ, réparties sur le bassin réel).
  Les deux panneaux sont à la même échelle verticale.
- `recadrage-avant.png` / `recadrage-apres.png` — la démonstration du décalage
  d'origine (avant/après, à échelle identique).
- `apercu-corrige-2048.png` — l'essai en carré 2048, qui montre l'échec.

Scripts rejouables dans `.workbuddy-ai/tmp/` :

| Script | Ce qu'il démontre |
|---|---|
| `proj.js` | la projection et le contrôle du tableau officiel |
| `contradiction.js` | Malte vs Athènes (0 px vs 460 px) |
| `mesure_cote.py` | le lit de sel mesuré au pixel (53,7 % × 49,2 %) |
| `medicale.js` | les quinze candidats de l'est, tous hors cadre |
| `emprise.js` | l'emprise couverte par chaque taille de planche |
| `options.js` | les trois options de format comparées |
| `planche_finale.py` | la planche 1743 × 1024 (v1) |
| `planche_finale_v2.py` | la même, étiquettes déportées, proximités annotées |
| `avant_apres.py` | le comparatif de cadrage ci-dessus |
| `verif_cadre.js` | le contrôle indépendant de § 4.4 |
| `statedb.js` | la photographie de l'état de la base, en lecture seule |
