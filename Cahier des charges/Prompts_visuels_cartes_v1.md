# Prompts visuels des cartes — v1

**Projet :** GM Helper / *La Course du Sel*
**Objet :** bibliothèque de seize prompts prêts à l'emploi
**Date :** 21 septembre 2026
**Référentiel associé :** `Cahier des charges/Referentiel_visuel_cartes_v1.md`

---

## Mode d'emploi

Chaque bloc ci-dessous est **autonome**. Il peut être copié seul, sans lire le
reste du document : le préambule de style y est répété à l'identique, et les
négatifs y figurent en fin de bloc.

**Ce que contient ce document :**

| Bloc | Planche | Section |
|---|---|---|
| Préambule | Le bloc invariant à coller partout | § 1 |
| Planche 1 | Carte du monde — le bassin asséché | § 2.1 |
| Planches 2 à 11 | Les dix cités-états | § 2.2 à § 2.11 |
| Planches 12 à 16 | Les cinq planches de secours | § 2.12 à § 2.16 |
| Annexes | Négatifs, paramètres, table GPS | § 3 |

**Rappels de production, valables pour les seize planches :**

- Toutes les valeurs hexadécimales proviennent de `client/src/index.css`. Les
  trois valeurs marquées **(extension)** — `#1B1916`, `#2E2A25`, `#F2EEE4` —
  sont proposées par le référentiel § 2.4, faute de teinte de sol dans la DA.
- **Aucune planche ne contient de texte.** Le cartouche de titre est une zone
  laissée vide, l'interface y pose le titre.
- **Aucun lieu secret n'est peint.** Les lieux marqués `[mj — …]` ou `[lieu
  secret]` dans `loreData.js` sont exclus des planches. Ils n'existent pas
  visuellement.
- Les listes de lieux sont tirées de `client/src/utils/loreData.js`. Ce sont les
  « vraies positions » demandées : chaque planche montre **les lieux réels de sa
  cité**, pas une ville générique.

---

## 1. Le préambule invariant

> À coller **à l'identique** en tête de chaque prompt. Le contenu entre chevrons
> est le seul qui change d'une planche à l'autre.

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
Format carré 1024 par 1024 pixels — SAUF indication contraire dans le bloc. La
planche 1 (carte du monde) fait exception : son format est **2 010 × 1 180**
(rapport 1,702 ; `1 743 × 1 024` en est la réduction à 86,7 %), et
il est rappelé dans son propre bloc CADRAGE, qui fait foi. Aucune planche de cité
n'est concernée : leur carré 1024 est le bon format.
```

---

## 2. Les seize prompts

### 2.1 — Planche 1 · Carte du monde : « le bassin asséché »

**Ce qu'elle montre.** Le bassin méditerranéen devenu désert de sel, vu du
dessus, avec les dix cités-états en leur position réelle. C'est la seule planche
qui donne l'échelle du monde.

**Note critique sur les positions réelles — à lire avant de générer.**

Le constat § 1.4 établit que l'image de fond actuelle (`map-lore-base.png`) est
**mal calée** par rapport à la projection officielle : Gibraltar tombe à 46 % de
la hauteur sur l'image dessinée, mais à 66 % selon la projection. Genève tombe à
26 % sur l'image, contre 10 % selon la projection. L'image étire le nord et
comprime le sud. **Les deux ne décrivent pas le même cadrage.**

**La vérité de référence est la projection officielle** — c'est elle qui est
juste (le constat § 1.1 démontre qu'elle reproduit les dix couples GPS à un
pixel près, et que son rapport d'échelle de 1,400 correspond à une Mercator
sphérique centrée sur la latitude 44,42° — `1/cos(44,42°) = 1,400`). La
correspondance image ↔ projection doit être **mesurée sur les repères terrestres
réels**, pas déduite d'un simple changement d'échelle.

Conséquence pratique pour la planche : le prompt ci-dessous demande une
géographie **fidèle au trait de côte réel**, avec les repères de calage du
constat § 1.4 — détroit de Gibraltar, delta du Rhône, côte ligure, Adriatique,
delta du Nil, golfe de Gabès. Si la carte générée place Gibraltar au tiers
inférieur du cadre plutôt qu'aux deux tiers, elle est fausse et doit être
redemandée.

```
[PRÉAMBULE INVARIANT — § 1]

SUJET : carte générale du bassin méditerranéen entièrement desséché, devenu un
immense désert de sel. Vue strictement du dessus, à plat, sans relief, comme une
carte murale ancienne. Aucune cité, aucun bâtiment, aucun être vivant — seule
la géographie.

CADRAGE : **format `2 010 × 1 180` pixels — un rectangle, PAS un carré** (voir
§ 3.3, qui rectifie les deux rédactions carrées antérieures : aucun carré ne peut
contenir l'emprise des dix cités, dont le rapport est de 1,83). Le bassin occupe
la totalité de la zone de dessin. Le détroit de Gibraltar se situe aux deux tiers
de la hauteur du cadre, sur le bord gauche. La côte nord du bassin — golfe du
Lion, côte ligure, Adriatique — court en diagonale depuis le tiers gauche vers le
quart supérieur droit. Le delta du Nil se situe au bord inférieur droit. Le trait
de côte est reconnaissable : il doit suivre la forme réelle de la Méditerranée.

QUATRE REPÈRES DE CONTRÔLE, en pourcentage du cadre — ils priment sur toute
impression d'ensemble, et se vérifient après génération :

- **Gibraltar** à **11,9 % de la largeur × 64,5 % de la hauteur**.
- **Genève** à **39,2 % × 7,6 %**.
- **Alexandrie** à **95,5 % × 92,4 %** — dans le cadre, au coin sud-est.
- **Malte** à **59,0 % × 65,8 %** — au centre du bassin.

Si Gibraltar tombe au tiers inférieur (~46 %), la planche est fausse.

PALETTE : le fond du bassin — l'ancien lit de la mer — est un aplat de sel blanc
#E8E3D8 à trame très fine, occupant le centre de l'image. Les terres émergées
périphériques sont un gris-brun pierreux #2E2A25, hachurées. Une traînée de
rouille #A8501E souligne la côte nord-ouest. L'océan Atlantique, à gauche du
détroit, est un bleu sourd #3A5F8A en aplat tramé, et lui seul.

LUMIÈRE : soleil rasant venant du sud-est, ombres portées de tout relief vers le
nord-ouest, très allongées. Le bassin lui-même est plat — c'est un désert, pas
une cuvette.

TRAIT ET TEXTURE : le trait de côte est le trait le plus épais de la planche, 5
pixels, à la plume. Les crêtes dunaires du lit asséché sont rendues par des
trames concentriques fines, jamais par des ombres. Les massifs montagneux
périphériques — Alpes au nord, Atlas au sud, Taurus à l'est — sont hachurés
densément.

ÉLÉMENTS OBLIGATOIRES, dans cet ordre de lisibilité :
  RANG 1 — le lit de la mer asséchée, occupant tout le centre du cadre, avec ses
    cristallisations de sel en grandes figures rayonnantes.
  RANG 2 — le Mur de Sel, faille cristalline dressée à l'ouest du détroit de
    Gibraltar, barrant le bassin de toute sa hauteur ; le détroit lui-même, seul
    point de passage ; le vestige du Rhône, unique trait d'eau vivante descendant
    du nord-ouest vers le delta ; le delta du Nil, au bord inférieur droit.
  RANG 3 — les grandes zones du bassin : désert de sel central, déserts de sable
    de la rive sud, zones vitrifiées au nord-est, croissant fertile résiduel au
    levant.

GRAIN ET DÉTAIL : le sol doit couvrir les trois quarts de la surface. Les
cristallisations de sel au centre sont le seul motif dense autorisé. Aucune
habitation, aucune ruine, aucune carcasse de navire sur cette planche — le
bassin est vide à cette échelle.

NÉGATIFS : [voir § 3.1]
```

---

### 2.2 — Planche 2 · Cité du Divertissement — « Les Faiseurs de Rêves »

**Lieu réel :** Rome (Italie) — *« utilisant le Colisée et les forums comme
décors grandioses de spectacles »* (`loreData.js`).
**Paramètres :** Bonheur 95 · Richesse 75 · Technologie 60 · Santé 55 ·
Carburant 50 · Nourriture 50 · **Armement 35**.
**Lecture :** le bonheur le plus haut du monde et l'armement le plus bas. La
cité ne se défend pas, elle achète et elle séduit. Aucune rouille dominante —
elle ne produit rien de ce qu'elle consomme.

```
[PRÉAMBULE INVARIANT — § 1]

SUJET : cité-état du spectacle, bâtie dans le cratère et les gradins effondrés
d'un amphithéâtre antique géant, dont l'enceinte extérieure fait office de muraille
de ville. Autour, un tissu urbain dense et ordonné de théâtres, de studios, de
tours de projection et de gradins de bois.

CADRAGE : plan large en vue plongeante à 45 degrés, nord en haut. L'amphithéâtre
occupe le centre exact du cadre et environ un tiers de la zone de dessin. La
cité s'étend en auréoles concentriques régulières autour de lui. Le désert de sel
comble les quatre angles.

PALETTE : dominante pourpre sombre #6B4E8C, employée en aplats tramés sur les
velums, les bannières et les gradins couverts. Secondaire or braise #C4801A sur
les arêtes éclairées, les ors des décors et la poussière. Le sol de la cité est
un brun chaud #2E2A25 plus clair que le désert alentour. Aucune rouille, aucun fer
apparent.

LUMIÈRE : soleil de fin d'après-midi venant du sud-est, ombres longues vers le
nord-ouest. Les gradins créent des ombres concentriques régulières, hachurées,
jamais lisses. La poussière en suspension accroche la lumière en braise #C4801A.

TRAIT ET TEXTURE : trait de plume, épaisseur variable. Les gradins sont rendus en
lignes concentriques fines, à la règle mais tracées à la main. Les velums des
théâtres sont des tentes tendues, hachurées.

ÉLÉMENTS OBLIGATOIRES :
  RANG 1 — la grande arène de combat : l'amphithéâtre colossal, reconnaissable en
    vignette à sa forme ovale et à ses gradins concentriques.
  RANG 2 — le casino de la ruine ; les studios de radiodiffusion, hautes tours à
    mâts rayonnants ; le théâtre des illusions, à façade de colonnade déchue ; le
    forum des paris, vaste esplanade ouverte ; la fosse aux bêtes, excavation
    rectangulaire aux parois hérissées de piques.
  RANG 3 — les quartiers, chacun reconnaissable à sa texture propre : le quartier
    des plaisirs (tentes et rideaux), le quartier des chem'artistes (ateliers aux
    verrières), le quartier des sculpteurs (cour à blocs de pierre), le quartier
    des producteurs (entrepôts), la zone des figurants (baraquements serrés), les
    catacombes de la mémoire (galeries ouvertes en coupe).
  STRUCTURE — le mur d'enceinte, partiellement formé par l'aqueduc antique ; la
    citerne centrale, bassin à ciel ouvert ; le générateur principal ; le marché
    d'échanges, sous de grandes toiles tendues.

GRAIN ET DÉTAIL : le sol couvre environ deux tiers de la surface, entre l'arène,
les esplanades et le désert. Entre 30 et 40 éléments lisibles, hors grain. Cible
de luminance : 34 sur 100.

NÉGATIFS : [voir § 3.1]
```

---

### 2.3 — Planche 3 · Cité Médicale — « Les Blouses Blanches »

**Lieu réel :** Alexandrie (Égypte) — *« renouant avec son passé de centre du
savoir »* (`loreData.js`).
**Paramètres :** **Santé 95** · Technologie 80 · Richesse 65 · Armement 50 ·
Bonheur 50 · Nourriture 35 · **Carburant 25**.
**Lecture :** la cité du blanc clinique et de la dépendance totale en énergie et
en vivres. C'est la seule planche du jeu dont la dominante est une **valeur**
et non une teinte.

```
[PRÉAMBULE INVARIANT — § 1]

SUJET : cité-état hospitalière blanche, bâtie sur le plan en damier d'une ville
antique, où les bâtiments sont des hospitalisations, des laboratoires, des unités
de soin et des serres stériles. Architecture de pierre claire, de chaux et de
verre, tendue de linge séchant entre les bâtiments.

CADRAGE : vue plongeante à 45 degrés, nord en haut. La cité occupe tout le cadre
en damier régulier coupé d'une avenue centrale. Le désert de sel n'apparaît qu'en
une bande étroite sur les quatre bords.

PALETTE : dominante blanc de sel #E8E3D8, employée en larges aplats de chaux et
de linge — c'est la planche la plus claire du corpus, plafonnée à 42 de luminance
moyenne. Secondaire bleu artifice #3A5F8A sur les toits, les ombres et les
instruments. Les ombres portées sont hachurées en #3A5F8A, jamais en gris.
Aucune rouille, aucun vert.

LUMIÈRE : soleil au zénith décalé, sud-est, ombres courtes et bleutées vers le
nord-ouest, très contrastées sur les murs blancs. L'air est sec et limpide.

TRAIT ET TEXTURE : trait de plume fin, 1,5 pixel sur les détails, 3 pixels sur
les contours de bâtiments. Les surfaces blanches sont tenues par des trames de
points très espacées, jamais par un aplat pur — sans quoi la planche serait
blanche.

ÉLÉMENTS OBLIGATOIRES :
  RANG 1 — le laboratoire de virologie : un bâtiment bas et massif, isolé au
    centre d'un large vide stérile, entouré d'un double mur.
  RANG 2 — l'usine de synthèse de médicaments, longue et basse, à rangées de
    cheminées fines ; l'unité de quarantaine sévère, anneau de baraquements clos
    sans porte ; le sanctuaire de Vulcain, seul bâtiment ancien à colonnade, plus
    sombre que le reste ; les greffiers du temps, orphelinat à cour centrale ; les
    apaiseurs, pavillon isolé à fenêtres barrées.
  RANG 3 — l'avenue centrale bordée de portiques ; les quartiers de soins ; les
    serres stériles ; le quartier résidentiel du personnel.
  STRUCTURE — le mur d'enceinte à contreforts ; la citerne centrale, grande
    citerne découverte ; le générateur principal ; le marché d'échanges, sous une
    halle à colonnes, décentré vers un angle.

GRAIN ET DÉTAIL : le sol couvre deux tiers de la surface, entre les esplanades,
les cours et le désert. Entre 26 et 32 éléments lisibles — la planche doit être
plus aérée que ses voisines, c'est sa marque. Cible de luminance : 40 sur 100.

NÉGATIFS : [voir § 3.1]
```

---

### 2.4 — Planche 4 · Nuke City — « Le Réacteur à Ciel Ouvert »

**Lieu réel :** Marseille (France) — *« exploitant un ancien site nucléaire
expérimental méditerranéen »* (`loreData.js`).
**Paramètres :** **Carburant 100** · **Technologie 95** · **Armement 95** ·
Richesse 50 · Nourriture 50 · **Bonheur 35** · **Santé 25**.
**Lecture :** la seule cité nucléaire de surface. *« Ville lumineuse dans le
désert, crainte de tous. »* C'est **la seule planche autorisée à être nocturne**
et la seule où un vert saturé est légitime — mais il reste borné à 12 % de la
surface.

> **Exception documentée au § 2 de la convention de lumière** (azimut inversé à
> l'ouest, ombres vers le sud-est) **et à la règle du sol à 60-75 %.** La cible
> de luminance passe de 28-42 à **24-30** : Nuke City est légitimement plus
> sombre que les autres. Aucune autre planche n'a droit à cette exception.

```
[PRÉAMBULE INVARIANT — § 1, avec la variante de lumière ci-dessous]

VARIANTE DE LUMIÈRE : scène nocturne. Aucune source solaire. Le réacteur est la
seule source lumineuse du cadre, et il l'est depuis le sol — pas depuis le ciel.
Direction de lumière inverse de la convention : depuis le centre vers l'extérieur,
ombres projetées du centre vers les bords. Air chargé de poussière de sel
phosphorescente.

SUJET : cité-état bâtie autour du cœur d'un réacteur nucléaire à ciel ouvert,
cratère incandescent au centre d'une agglomération en ruines. Bâtiments de béton
et de bâches, défenses électrifiées, tours de refroidissement évidées.

CADRAGE : vue plongeante à 55 degrés, nord en haut. Le cœur du réacteur occupe le
centre exact du cadre et environ un quart de la zone de dessin. La cité s'étend
en couronnes irrégulières jusqu'aux bords.

PALETTE : dominante vert réacteur #4A7C3F, employée **uniquement** sur le cœur du
réacteur, les bassins de refroidissement et de rares canalisations — soit au plus
12 pour cent de la surface. Secondaire rouge irradié #B3392E sur les zones
contaminées, en aplat tramé. Tout le reste de la planche est noir chaud #1B1916
et gris-brun #2E2A25 — c'est le noir qui domine, pas le vert. Le sel de surface
est blanc de sel #E8E3D8.

LUMIÈRE : nuit sans lune. Le réacteur émet une lueur verte sourde. Deux faisceaux
de projecteurs balaient les bords du cadre du sud vers le nord. Aucun halo, aucun
bloom, aucune diffusion — la lumière tombe en taches nettes, hachurées. Ombres
radiales depuis le centre.

TRAIT ET TEXTURE : trait de plume, contours nets malgré l'obscurité. Les surfaces
bétonnées sont tachées de zébrures d'usure. Aucune brume de profondeur, aucun
flou — la nuit est rendue par contraste, pas par atmosphère.

ÉLÉMENTS OBLIGATOIRES :
  RANG 1 — le cœur du réacteur nucléaire : cratère circulaire incandescent vert,
    à anneaux concentriques, au centre exact du cadre.
  RANG 2 — la zone de refroidissement irradiée, bassin octogonal à canaux
    rayonnants ; le centre de recherche sur l'énergie, bloc cubique à fenêtres
    hautes ; le dépôt de déchets toxiques, champ de fûts empilés en pyramides ;
    les tours de refroidissement évidées, cheminées tronquées ; le périmètre
    électrifié, double rangée de pylônes.
  RANG 3 — le quartier résidentiel / taudis, baraquements serrés avec toiles ; la
    zone marchande ; la zone de contrôle isolée.
  STRUCTURE — le mur d'enceinte hérissé de miradors ; la citerne centrale, à
    réservoirs multiples ; le générateur principal ; le marché d'échanges.

GRAIN ET DÉTAIL : le sol et le bâti couvrent trois quarts de la surface, le vert
satellite n'en occupe qu'un dixième. Entre 30 et 36 éléments lisibles. Cible de
luminance : 26 sur 100 (exception).

NÉGATIFS : [voir § 3.1] — renforcer : « haleine lumineuse », « glow vert diffus »,
« irradiation visible dans l'air ».
```

---

### 2.5 — Planche 5 · Cité de l'Eau & Alimentation — « Les Gardiens de la Source »

**Lieu réel :** embouchure du Rhône, ancien delta de Camargue (France) —
*« là où l'eau de fonte venue du Nord achève sa course »* (`loreData.js`).
**Paramètres :** **Nourriture 95** · **Armement 85** · **Santé 80** · Bonheur 75
· Richesse 65 · Technologie 50 · Carburant 50.
**Lecture :** le monopole de l'eau et de la vie. C'est **la seule cité du jeu où
un cours d'eau bleu est légitime** — le Rhône y finit sa course. Sans cette
exception, la planche serait fautive comme l'est aujourd'hui `cite_eau.png`.

```
[PRÉAMBULE INVARIANT — § 1]

SUJET : cité-état agricole et hydraulique, bâtie à l'embouchure d'un unique
fleuve vivant, entourée de serres blindées, de bassins de rétention et de
réservoirs souterrains affleurants. Le fleuve est le seul trait d'eau de tout le
bassin.

CADRAGE : vue plongeante à 45 degrés, nord en haut. Le fleuve entre par le bord
supérieur gauche et se jette dans un vaste delta de bassins au centre-droit. Les
serres occupent le quart inférieur droit. La cité fortifiée entoure les
réservoirs, au centre.

PALETTE : dominante vert réacteur #4A7C3F, disséminée en trames clairsemées sur
les serres, les cultures en terrasse et les berges — teinte réfléchie par la
végétation, jamais émise. Secondaire bleu artifice #3A5F8A pour le cours d'eau et
l'eau des bassins, seul usage d'eau bleue de la série. Sel blanc #E8E3D8 sur les
zones salines du delta. Sol de la cité #2E2A25, désert périphérique plus sombre
#1B1916.

LUMIÈRE : soleil matinal venant du sud-est, ombres longues vers le nord-ouest,
air limpide après une tempête de sel. Les serres renvoient une lumière froide
#3A5F8A. Contraste élevé, pas de brume.

TRAIT ET TEXTURE : trait de plume, 3 pixels sur les contours, 1,5 sur les
détails. Les serres sont des voûtes translucides, rendues par des trames de
lignes courbes parallèles. L'eau est rendue par des hachures horizontales fines,
jamais par un aplat bleu uni.

ÉLÉMENTS OBLIGATOIRES :
  RANG 1 — les serres hydroponiques blindées : innombrables voûtes translucides
    alignées en rangées régulières, occupant tout un quart du cadre — le motif le
    plus reconnaissable de la planche.
  RANG 2 — la station de filtration, grand bâtiment rectangulaire aux bassins
    étagés ; le complexe agricole automatisé, à portiques et rails ; l'élevage de
    bétail mutant, vastes enclos à ombrières ; la réserve de semences
    pré-apocalypse, bunker de béton bas et clos ; le centre de données pré-guerre,
    bloc cubique à ailettes ; l'hôpital miraculeux ; le centre de commandement
    tactique, bâtiment à mâts et antennes.
  RANG 3 — les villages de bergers sur les berges ; les bassins de rétention en
    terrasses ; la digue de retenue amont.
  STRUCTURE — le mur d'enceinte à tours rapprochées ; la citerne centrale,
    réservoirs souterrains affleurants en vasques ; le générateur principal ; le
    marché d'échanges, halle ouverte au bord du fleuve.

GRAIN ET DÉTAIL : le sol et les cultures couvrent deux tiers de la surface.
Attention : le vert des serres reste une trame clairsemée, jamais un aplat plein.
Entre 32 et 38 éléments lisibles. Cible de luminance : 36 sur 100.

NÉGATIFS : [voir § 3.1] — **ne pas** inclure la négation de l'eau bleue, qui est
ici légitime, mais maintenir les négations de mer, vague et océan.

```

---

### 2.6 — Planche 6 · Bunker Oméga — « Les Fantômes d'Acier »

**Lieu réel :** sous les ruines de Genève (Suisse) — *« protégé par le massif
alpin »* (`loreData.js`).
**Paramètres :** **Technologie 100** · **Armement 100** · Santé 95 ·
Carburant 100 · Bonheur 55 · Richesse 50 · Nourriture 50.
**Lecture :** la cité souterraine. Le lore nomme littéralement *« la lumière d'un
bleu artificiel »* — c'est de là que vient la dominante. C'est **une coupe
technique**, pas une vue aérienne : la seule planche du corpus dans ce cas.

> **Exception documentée :** planche nocturne souterraine. Cible de luminance
> **22-28**. La convention de lumière s'applique à l'envers — la seule source est
> l'éclairage artificiel bleu, disposé en lignes de plafond.

```
[PRÉAMBULE INVARIANT — § 1, avec la variante ci-dessous]

VARIANTE DE CADRAGE ET DE LUMIÈRE : vue en coupe technique, strictement de
dessus, à la verticale, d'une installation souterraine. Aucune perspective, aucun
relief, aucune ombre portée solaire. La seule lumière est un éclairage artificiel
bleu disposé en lignes continues le long des galeries. Toutes les valeurs sont
rendues par la trame, jamais par l'ombre.

SUJET : cité-état souterraine ultra-technologique, taillée dans la roche alpine,
organisée en salles circulaires reliées par des galeries orthogonales. Aucune
architecture extérieure — c'est un plan de coupe.

CADRAGE : format carré, nord en haut. L'installation occupe tout le cadre, la
roche encaissante comblant les angles. Le noyau central au milieu exact.

PALETTE : dominante bleu artifice #3A5F8A, employée sur les lignes d'éclairage,
les écrans et les bassins — soit environ 15 pour cent de la surface. Secondaire
acier nu #E8E3D8 sur les arêtes de structure et les cloisons. La roche encaissante
est un noir chaud #1B1916, dominant. Aucun vert, aucun orange — le bleu est le
seul accent saturé autorisé.

LUMIÈRE : éclairage artificiel bleu, en lignes continues au plafond de chaque
galerie. Aucune ombre, seulement des trames plus ou moins denses selon la
profondeur de la salle. Léger dégradé trame du centre vers les bords.

TRAIT ET TEXTURE : trait géométrique **exclusivement** — lignes droites, angles
francs, cercles parfaits. C'est la seule planche du corpus dans ce cas : le
référentiel interdit le trait mécanique partout ailleurs, et l'autorise ici seul,
parce que c'est un document technique et non une vue de terrain. Pas de hachures,
seulement des trames orthogonales.

ÉLÉMENTS OBLIGATOIRES :
  RANG 1 — le noyau de l'intelligence artificielle : grande salle circulaire
    concentrique, au centre exact du cadre, avec un cœur géométrique apparent.
  RANG 2 — les ateliers de drones autonomes, salles à baies régulières et rails
    de lancement ; le laboratoire de biologie avancée, salle à cuves circulaires ;
    le centre de télécommunications globales, salle à antenne de plafond ; les
    bassins de refroidissement ; les sas de surface, quatre puits aux quatre
    angles.
  RANG 3 — les galeries de liaison orthogonales ; les quartiers d'habitation en
    alcôves régulières ; les salles de stockage ; le poste de commandement.
  STRUCTURE — la citerne centrale, réservoirs en cercle ; le générateur
    principal, salle à machine circulaire ; le marché d'échanges, vaste halle
    carrée ; le mur d'enceinte est ici le **périmètre de roche taillée**.

GRAIN ET DÉTAIL : aucune surface de sol — c'est un plan. Entre 26 et 32 éléments
lisibles, tous géométriques. Cible de luminance : 25 sur 100.

NÉGATIFS : [voir § 3.1] — **retirer** « perspective isométrique parfaite » et
« lignes droites mécaniques », qui sont ici le sujet. Ajouter : « terrain
extérieur », « végétation », « paysage de surface », « ciel ».
```

---

### 2.7 — Planche 7 · Cité de l'Armement & Défense — « Les Arsenaux »

**Lieu réel :** embouchure de l'ancien détroit de Gibraltar — *« adossée au Mur
de Sel, contrôlant d'une main de fer le seul point de passage terrestre entre
l'Atlantique et le désert »* (`loreData.js`).
**Paramètres :** **Armement 100** · Technologie 85 · Santé 60 · Carburant 55 ·
Richesse 50 · Nourriture 50 · Bonheur 50.
**Lecture :** un ouvrage fortifié compact, de pierre sèche, où la rouille n'est
que l'usure du fer. **Pas de dispersion** — c'est une seule masse continue.
C'est le contraste qui la sépare de la Cité des Métaux (§ 3.1 du référentiel).

```
[PRÉAMBULE INVARIANT — § 1]

SUJET : cité-état militaire compacte, adossée à une falaise de sel cristallin qui
lui sert de rempart naturel à l'ouest. Un seul ensemble fortifié continu, à
murailles concentriques, hérissé de tours, adossé à la falaise. Bastions
d'artillerie, casernes, dépôts d'armes.

CADRAGE : vue plongeante à 50 degrés, nord en haut. La falaise de sel occupe tout
le bord gauche du cadre, verticale et rayée. L'ouvrage fortifié s'étend du centre
vers la droite. Le désert comble l'angle inférieur droit. Aucun étalement diffus —
la cité est une masse unique et dense.

PALETTE : dominante pierre sèche #B8B0A0, employée en aplats hachurés sur les
murailles, les bastions et les esplanades. Secondaire acier corrodé #A8501E sur
les toits de tôle, les portes blindées, les rails et les pièces d'artillerie —
usure du fer, pas matériau dominant. Le sel de la falaise est #E8E3D8. Le désert
périphérique #2E2A25.

LUMIÈRE : soleil rasant venant du sud-est, ombres très longues portées vers le
nord-ouest par les murailles — les remparts projettent des bandes d'ombre
parallèles régulières sur les esplanades, hachurées. Puissance du contraste
vertical : les niveaux supérieurs des remparts sont en pleine lumière, les fossés
en noir.

TRAIT ET TEXTURE : trait de plume épais, 5 pixels sur les remparts, 3 sur les
bâtiments. Hachures très serrées sur les faces ombrées des murailles. Aucune
courbe — sauf les tours d'angle, rondes. Le sel de la falaise est strié de raies
verticales fines.

ÉLÉMENTS OBLIGATOIRES :
  RANG 1 — le Mur de Sel adossé : falaise cristalline verticale barrant tout le
    bord gauche du cadre, rayée, éclatante — la forme la plus massive de la
    planche.
  RANG 2 — l'usine de fabrication d'armes, long bâtiment bas cuirassé ; le
    laboratoire des explosifs, bunkers épars à toits de terre ; la caserne
    d'entraînement des milices, grand quadrilatère à cour ; le dépôt d'armes
    lourdes, hangars à rails ; le poste d'écoute atlantique, tour à paraboles au
    bord de la falaise. (Note : ce dernier est marqué `[lieu secondaire, réservé
    au mj]` dans `loreData.js`. Il peut être peint comme **structure anonyme non
    identifiable** — tour à mâts — sans que son identité soit révélée.)
  RANG 3 — les esplanades d'artillerie ; les fossés ; les bastions d'angle ; le
    quartier résidentiel des milices.
  STRUCTURE — le mur d'enceinte à tours rapprochées et portes blindées, en trois
    enceintes concentriques ; la citerne centrale, bassin cuirassé ; le générateur
    principal ; le marché d'échanges, en contrebas des remparts.

GRAIN ET DÉTAIL : le sol couvre deux tiers de la surface, entre les esplanades,
les cours et le désert. Le bâti est **groupé**, jamais diffus. Entre 28 et 34
éléments lisibles. Cible de luminance : 34 sur 100.

NÉGATIFS : [voir § 3.1]
```

---

### 2.8 — Planche 8 · Cité Industrielle — « Les Forgerons d'Acier »

**Lieu réel :** vestiges de Turin (Italie) — *« ancien joyau industriel de la
Méditerranée »* (`loreData.js`).
**Paramètres :** **Technologie 95** · Armement 75 · Richesse 70 · Carburant 50 ·
Nourriture 50 · Bonheur 45 · **Santé 35**.
**Lecture :** *« usines colossales, villes entières noyées dans la fumée »*. C'est
la cité la plus rouille du bassin au sens propre, et la plus **verticale** — le
critère qui la sépare des Métaux (§ 3.1 du référentiel).

```
[PRÉAMBULE INVARIANT — § 1, avec la variante de fumée ci-dessous]

VARIANTE DE LUMIÈRE : la fumée industrielle est un **sujet**, pas une atmosphère.
Elle est rendue par des hachures horizontales denses au-dessus des cheminées, en
#1B1916 opaque, jamais par un voile diffus. Le contraste reste net partout.

SUJET : cité-état industrielle, immense complexe de fonderies, hauts-fourneaux,
cheminées et lignes d'assemblage, entouré d'un désert de sel où s'empilent des
montagnes de ferraille.

CADRAGE : vue plongeante à 45 degrés, nord en haut. Les hauts-fourneaux, tours
cylindriques groupées, occupent le centre du cadre. Les nappes de cheminées
s'étendent vers l'est et le sud. Le désert de sel occupe les bords.

PALETTE : dominante rouille profonde #8A3D14, employée sur les toits de tôle, les
charpentes, les carcasses de wagons et les tas de ferraille — matériau dominant,
confondu avec le sol. Secondaire braise #C4801A sur les gueules de hauts-fourneaux
et la poussière en suspension. Le sol de la cité #2E2A25, le désert #1B1916.
Note : la rouille et le sol sont proches en valeur ; la séparation se fait par la
trame et la teinte, jamais par un écart de luminosité.

LUMIÈRE : soleil masqué haut venant du sud-est, ombres nettes portées vers le
nord-ouest. Les hauts-fourneaux projettent des ombres longues et parallèles. La
braise au sol est un éclat local, jamais un halo.

TRAIT ET TEXTURE : trait de plume épais, 5 pixels sur les contours d'usines. Les
toits de tôle sont striés de lignes parallèles fines. Les tas de ferraille sont un
grain chaotique, rendu par de petites hachures croisées irrégulières.

ÉLÉMENTS OBLIGATOIRES :
  RANG 1 — la fonderie colossale : le groupe de hauts-fourneaux, tours
    cylindriques accolées à passerelles, au centre exact du cadre, dominant la
    planche de toute leur hauteur.
  RANG 2 — la ligne d'assemblage de véhicules, longue nef à toit en dent de scie ;
    l'atelier des pièces détachées, cour à étagères ; le dépôt de ferraille,
    montagnes de métal concassé ; les nappes de cheminées, forêt de tubes fins ;
    les refroidisseurs à bassins.
  RANG 3 — les quartiers ouvriers en rangs serrés ; les voies ferrées ; les
    terrils ; les ateliers satellites.
  STRUCTURE — le mur d'enceinte de tôle et de béton ; la citerne centrale,
    réservoirs à ciel ouvert ; le générateur principal ; le marché d'échanges, sous
    une charpente métallique dénudée.

GRAIN ET DÉTAIL : le sol couvre deux tiers de la surface. La planche est **dense
en hauteur** mais doit rester lisible à 25 % de zoom : les cheminées doivent se
distinguer du bâti. Entre 26 et 32 éléments lisibles. Cible de luminance : 30 sur
100.

NÉGATIFS : [voir § 3.1]
```

---

### 2.9 — Planche 9 · Cité des Métaux & Recyclage — « Les Fossoyeurs »

**Lieu réel :** ancienne île de Malte — *« au centre exact du bassin
méditerranéen desséché, hérissée de gratte-ciels effondrés et cernée à perte de
vue par les carcasses de milliers de navires échoués quand la mer s'est
asséchée »* (`loreData.js`).
**Paramètres :** **Richesse 90** · Technologie 65 · Armement 55 · Bonheur 50 ·
Carburant 50 · Nourriture 45 · **Santé 30**.
**Lecture :** horizontale, éclatée, dispersée — c'est le critère qui la sépare de
la Cité Industrielle. Sa rouille est **claire** : le métal est oxydé en surface et
brillant là où il est cassé.

```
[PRÉAMBULE INVARIANT — § 1]

SUJET : cité-état de récupération, bâtie sur une île de sel au milieu du bassin
asséché, entourée à perte de vue d'un champ de carcasses de navires échoués et
dominée par des gratte-ciels effondrés, penchés, encastrés les uns dans les autres.

CADRAGE : vue plongeante à 45 degrés, nord en haut. Les gratte-ciels couchés
forment un amas horizontal au centre. Le champ de navires échoués occupe tout le
pourtour du cadre, jusqu'aux bords. C'est la seule planche du corpus dont le sol
est un **désert d'épaves** et non un désert de sel.

PALETTE : dominante ferraille claire #C97A3E, employée sur les coques, les
superstructures et les gratte-ciels — matière dominante, et non simple accent.
Secondaire alliages #B8B0A0 sur les arêtes vives, les tôles cassées et les
chargements de métal — le contraste rouille/alliance est le sujet chromatique.
Le sel blanc #E8E3D8 comble les interstices entre les épaves. Le sol #2E2A25.

LUMIÈRE : soleil rasant venant du sud-est, ombres très longues portées vers le
nord-ouest par les coques et les tours — la planche est structurée par ses ombres
plus que par ses masses. Arêtes métalliques en pleine lumière, éclat ponctuel
#E8E3D8.

TRAIT ET TEXTURE : trait de plume moyen, 3 pixels. Les coques de navires sont
rendues par des lignes de bordé parallèles, fines et courbes. Les gratte-ciels
sont des blocs rectangulaires à baies régulières en trame serrée.

ÉLÉMENTS OBLIGATOIRES :
  RANG 1 — le cimetière des gratte-ciels : amas de tours effondrées, penchées et
    encastrées, occupant le centre du cadre — silhouette horizontale et
    reconnaissable en vignette.
  RANG 2 — le marché aux alliages rares, halle ouverte au milieu des épaves ; la
    mine profonde, puits à terrils rayonnants ; l'usine de recyclage, grande nef à
    bras mécaniques ; l'atelier des rafistoleurs, cour encombrée de pièces ;
    l'enceinte de tri, champ de tas calibrés.
  RANG 3 — les trois arrondissements en quartiers différenciés par leur texture ;
    les pontons d'épaves ; les chantiers de démolition.
  STRUCTURE — le mur d'enceinte, formé de coques de navires renversées mises bout
    à bout ; la citerne centrale ; le générateur principal ; le marché d'échanges.

GRAIN ET DÉTAIL : le sol couvre deux tiers de la surface, mais le sol est ici un
champ d'épaves, ce qui compte comme matière et non comme vide. Entre 32 et 40
éléments lisibles — la planche la plus dense du corpus, c'est sa marque. Cible de
luminance : 38 sur 100.

NÉGATIFS : [voir § 3.1] — maintenir les négations de mer, vague et océan : les
navires sont **échoués sur du sel**, aucune eau ne les entoure.
```

---

### 2.10 — Planche 10 · Cité du Carburant — « Les Raffineurs »

**Lieu réel :** ancienne capitale d'Alger (Algérie) — *« exploitant les richesses
pétrolières du sud »* (`loreData.js`).
**Paramètres :** **Carburant 95** · Technologie 75 · Armement 70 · Richesse 50 ·
Bonheur 50 · Santé 45 · Nourriture 40.
**Lecture :** le pétrole sacralisé en « Sang Noir » par un culte omniprésent.
C'est la planche la plus sombre du jeu avec Bunker Oméga, mais pour une raison
opposée : Oméga est bleu-acier, Alger est **suie**.

```
[PRÉAMBULE INVARIANT — § 1]

SUJET : cité-état pétrolière, étendue sur les collines d'une ville ancienne
effondrée, hérissée de tours de distillation, de torchères et de réservoirs
cylindriques, enveloppée d'une brume de suie dense.

CADRAGE : vue plongeante à 45 degrés, nord en haut. La grande raffinerie, vaste
complexe de tours et de réservoirs, occupe le centre. Les puits d'extraction
rayonnent vers le sud. Les collines de la ville effondrée occupent le nord-est.

PALETTE : dominante noir de suie #1F1C18 — la cité est bâtie de suie, de
bitume et de réservoirs noircis. Secondaire braise #C4801A, employé **uniquement**
sur les flammes des torchères et leur reflet au sol, soit moins de 5 pour cent de
la surface : c'est peu, et c'est le sujet. Le sel blanc #E8E3D8 apparaît aux
interstices et sur les toits clairs. Aucune rouille dominante — le noir prime.

LUMIÈRE : heure dorée basse, soleil au sud-est très bas, ombres très longues vers
le nord-ouest. Les torchères sont des points braise éclatants, rendus en petits
éclats d'aplat, jamais en halo. La suie assombrit le ciel en haut du cadre par un
hachage horizontal dense, non par un dégradé.

TRAIT ET TEXTURE : trait de plume, contours nets. Les réservoirs cylindriques sont
rendus par des cercles et des trames verticales fines. Le sol des collines est
hachuré serré et irrégulier — ville ancienne effondrée, pas désert.

ÉLÉMENTS OBLIGATOIRES :
  RANG 1 — la grande raffinerie : grappe de tours de distillation et de
    réservoirs cylindriques au centre du cadre, avec torchères à flammes braise —
    silhouette reconnaissable en vignette.
  RANG 2 — le dépôt de carburant haute sécurité, cuves ceintes de doubles murs ;
    le puits d'extraction principal, derrick à quatre pieds et câbles ; le garage
    des convois lourds, long bâtiment à portes alignées ; les bassins de
    décantation ; les conduites forcées à chevalets.
  RANG 3 — les collines de la ville ancienne effondrée, terrasses superposées ; les
    quartiers ouvriers ; les aires de stockage de fûts.
  STRUCTURE — le mur d'enceinte ; la citerne centrale ; le générateur principal ;
    le marché d'échanges.

GRAIN ET DÉTAIL : le sol couvre deux tiers de la surface, entre les terrasses, les
aires et le désert. Entre 26 et 34 éléments lisibles. Cible de luminance : 29 sur
100.

NÉGATIFS : [voir § 3.1] — ajouter : « flamme photoréaliste », « feu détaillé »,
« lueur de feu diffuse ».
```

---

### 2.11 — Planche 11 · Île des Anciens — « Le Paradis Perdu »

**Lieu réel :** Atlantique, à l'ouest de Gibraltar — *« a émergé »* du recul des
mers (`Universe_Lore_v9.txt` l. 202-203). Coordonnées officielles : `36,0000° N,
8,5000° O`.
**Fiche :** absente de `loreData.js` — c'est la dixième cité du tableau GPS, sans
fiche détaillée. Les éléments ci-dessous sont déduits de la seule mention du
lore, et sont à valider (§ 6, point 2 du référentiel).

**Ce qui la distingue :** c'est la **seule terre non asséchée** du jeu. La seule
où la mer existe encore, en houle fracassante contre la falaise. C'est la seule
planche dont le bleu est un bleu d'océan, pas un bleu de fleuve.

```
[PRÉAMBULE INVARIANT — § 1, avec la variante ci-dessous]

VARIANTE : cette planche est la seule du corpus où une étendue d'eau salée est
visible, sur tout un bord du cadre. La végétation y est réelle, non mutante :
vert végétal dense, jamais néon. C'est une exception unique et elle doit rester
strictement bornée à cette planche.

SUJET : île isolée surgie des eaux, à la végétation dense et intacte, ceinte de
falaises battues par une houle océanique. Vestiges d'architecture ancienne à demi
envahis par la végétation. Mystérieuse, inhabitée en apparence.

CADRAGE : vue plongeante à 45 degrés, nord en haut. La masse de l'île occupe le
centre et les trois quarts du cadre. L'océan comble la bande gauche et inférieure.
Aucune autre terre à l'horizon.

PALETTE : dominante bleu artifice #3A5F8A, employée en aplats de hachures
horizontales concentriques sur l'océan — seul usage d'océan de la série.
Secondaire vert réacteur #4A7C3F sur la végétation dense, teinte **réfléchie** et
non néon, occupant environ un quart de la surface. Le sel blanc #E8E3D8 sur les
embruns et la crête des vagues. Falaises en #2E2A25. Aucune rouille, aucun
orange.

LUMIÈRE : soleil venant du sud-est, ombres longues portées vers le nord-ouest par
les arbres et les ruines. Écume lumineuse blanche au pied des falaises. Aucun
halo, aucun flou.

TRAIT ET TEXTURE : trait de plume. La houle est rendue par des lignes courbes
parallèles de plus en plus serrées vers la falaise, hachurées vers le large. Les
ruines sont des blocs à arêtes vives, rongés, envahis de lianes.

ÉLÉMENTS OBLIGATOIRES :
  RANG 1 — la falaise et son écume : front de falaise battu par la houle, avec
    éclatement d'embruns blancs — le motif signature de la planche.
  RANG 2 — les vestiges d'architecture ancienne envahis de végétation, blocs et
    colonnades à demi enterrés ; la végétation dense en masse compacte ; la plage
    de galets ; les grottes marines.
  RANG 3 — les sentiers ; les éboulis ; les hauteurs boisées ; les criques.
  AUCUNE STRUCTURE URBAINE — ni enceinte, ni citerne, ni générateur, ni marché.
    Cette planche est la seule du corpus dans ce cas : c'est une terre, pas une
    cité.

GRAIN ET DÉTAIL : entre 22 et 28 éléments lisibles — la planche la plus aérée du
corpus. Cible de luminance : 34 sur 100.

NÉGATIFS : [voir § 3.1] — **retirer** « eau bleue turquoise », « mer », « vague »,
« océan plein », « verdure luxuriante », « forêt tempérée », qui sont ici le
sujet. Maintenir toutes les négations de texte, de rendu 3D et de science-fiction.
```

---

## 2.12 à 2.16 — Les cinq planches de secours

### Pourquoi cinq planches de secours

Le constat § 2.4 établit que `location.imageUrl` n'est renseigné que pour **10
lieux sur 109** — les dix cités. Les 99 autres lieux n'ont aucune image, et leur
carte locale s'ouvre sur un canvas vide. Une planche existe déjà sur le disque,
`local_city_map.png`, mais **elle n'est référencée nulle part** dans le code
(constat § 2.4 et § 2.8). C'est un fichier orphelin : il a coûté une génération
et ne sert à rien.

Les cinq planches ci-dessous remplacent ce gaspillage par un jeu de secours
utilisable, chacune répondant à un besoin identifié du constat. La première est
indispensable ; les quatre suivantes sont un pari sur l'usage.

| # | Planche | Répond à | Statut |
|---|---|---|---|
| 12 | **Planche générique universelle** | § 2.4 — 99 lieux sans image | Indispensable |
| 13 | **Camargue / le Rhône** | § 2.6 — le fleuve vivant est cité partout, montré nulle part | Recommandée |
| 14 | **Le Grand Bassin, vue du sel** | § 1.4 — la planche qui remplace le fond mal calé | Recommandée |
| 15 | **Convoi dans le désert de sel** | Le seul plan de *situation*, pas de lieu | Optionnelle |
| 16 | **Le Mur de Sel** | § 6, point 3 du référentiel — à trancher | Optionnelle |

---

### 2.12 — Planche 12 · Planche générique universelle

**Ce à quoi elle sert.** Toute carte locale dont le lieu n'a pas d'image dédiée —
soit 99 lieux sur 109 aujourd'hui. Elle doit fonctionner pour un quartier comme
pour un bâtiment, pour une cité industrielle comme pour une cité agricole :
**elle doit donc être neutre**. C'est une planche de sel, de terrain vague et de
vestiges, sans aucune signature chromatique de cité.

**Ce qu'elle remplace.** La planche orpheline `local_city_map.png`. Celle-ci
peut être supprimée du disque — elle est référencée nulle part.

```
[PRÉAMBULE INVARIANT — § 1]

SUJET : terrain vague du bassin asséché, vu du dessus. Aucune cité, aucun
bâtiment debout. Un sol de sel craquelé, quelques fondations affleurantes, une
route de terre, des débris épars, un puits comblé. C'est un **emplacement** — la
planche neutre sur laquelle l'interface posera ses propres étiquettes.

CADRAGE : vue plongeante à 45 degrés, nord en haut. Aucun élément dominant :
toutes les masses font moins d'un dixième du cadre. La zone de dessin est
occupée à parts égales par du sel craquelé, du gravier et des vestiges bas.

PALETTE : dominante sel blanc #E8E3D8 à trame très fine sur les plaques de sel,
soit environ un tiers de la surface. Secondaire rouille #A8501E sur les débris
métalliques, les ferrailles et les piquets — moins de 8 pour cent de la surface.
Le sol nu est #2E2A25. Aucun accent saturé dominant : c'est une planche sans
identité chromatique, c'est sa fonction.

LUMIÈRE : convention standard — soleil bas au sud-est, ombres longues vers le
nord-ouest. Contraste modéré, aucune source d'appoint.

TRAIT ET TEXTURE : trait de plume moyen. Le sel craquelé est un réseau de
polygones irréguliers à fines nervures. Le gravier est un grain pointillé
régulier. Les fondations sont des rectangles à arêtes rongées.

ÉLÉMENTS OBLIGATOIRES :
  RANG 1 — les grandes plaques de sel craquelé : réseau de polygones à nervures,
    occupant un tiers de la surface — le seul motif structurant de la planche.
  RANG 2 — une route de terre traversant le cadre en diagonale, à ornières ; le
    puits comblé, cercle de pierres à margelle brisée ; les fondations
    affleurantes d'un bâti disparu, rectangles au sol ; un bouquet de piquets et
    de ferrailles tordues.
  RANG 3 — les débris épars ; les pierres ; les rares touffes de végétation
    mutante #4A7C3F, moins de cinq dans tout le cadre.

GRAIN ET DÉTAIL : le sol couvre plus des trois quarts de la surface — la planche
doit rester **vide**, c'est sa fonction. Entre 22 et 28 éléments lisibles.
Cible de luminance : 34 sur 100.

NÉGATIFS : [voir § 3.1]
```

---

### 2.13 — Planche 13 · La Camargue et le Rhône

**Ce à quoi elle sert.** Le Rhône est le seul cours d'eau vivant du bassin, cité
dans presque toutes les fiches de cité du lore (`Universe_Lore_v9.txt` l. 243-251
et la fiche de la Cité de l'Eau). C'est aussi le seul lien physique entre le nord
glacé et le bassin sec. La planche montrerait le delta **vu d'en haut, à
l'échelle régionale**, et non la cité qui le garde — ce que la planche 5 ne fait
pas.

**Usage :** illustration d'ouverture pour une expédition vers le nord, écran de
table lors d'une navigation fluviale, ou fond de la vue joueur en amont du delta.

```
[PRÉAMBULE INVARIANT — § 1]

SUJET : delta fluvial vu du dessus, à l'échelle régionale — un unique fleuve
vivant descendant des hauteurs du nord et se divisant en plusieurs bras au milieu
d'un désert de sel. Aucune cité : la planche montre le **territoire**, pas
l'agglomération.

CADRAGE : vue strictement du dessus, à plat, sans relief. Le fleuve entre par le
bord supérieur gauche et se divise en trois bras vers le bord inférieur droit.
Le delta occupe tout le cadre, du lit mineur aux lagunes. Échelle régionale : les
routes sont des traits fins, le fleuve est la seule masse.

PALETTE : dominante bleu artifice #3A5F8A, sur le lit du fleuve et les lagunes du
delta, seul cours d'eau du monde connu. Secondaire vert réacteur #4A7C3F sur la
végétation riveraine, en trames clairsemées le long des berges — oasis de
ripisylve, pas forêt. Sel blanc #E8E3D8 sur les salines du delta, en grands
polygones tramés. Le désert #2E2A25 domine les bords.

LUMIÈRE : soleil bas au sud-est, ombres longues vers le nord-ouest. Le fleuve est
rendu par sa seule couleur, sans reflet ni scintillement.

TRAIT ET TEXTURE : trait de plume. Le fleuve est bordé d'un trait épais continu,
souligné d'une trame d'hachures parallèles au courant. Les salines sont des
réseaux de polygones fins. La végétation riveraine est un grain moucheté.

ÉLÉMENTS OBLIGATOIRES :
  RANG 1 — le fleuve et son delta : cours d'eau sinueux se divisant en trois bras
    au centre du cadre — la structure qui organise toute la planche.
  RANG 2 — les salines du delta, grands polygones tramés ; les lagunes côtières ;
    la ripisylve riveraine en bande étroite ; le barrage-vanne pré-guerre, seuil
    rectiligne barrant le fleuve en amont (mentionné au lore, l. 263-267) ;
    le cordon littoral à l'embouchure.
  RANG 3 — les routes de terre ; les rares fermes ; les gués ; les méandres
    abandonnés.

GRAIN ET DÉTAIL : aucune cité, aucun rempart, aucun bâtiment de plus de deux
masses. Entre 20 et 26 éléments lisibles. Cible de luminance : 36 sur 100.

NÉGATIFS : [voir § 3.1] — retirer la négation de l'eau bleue, maintenir mer,
vague et océan.
```

---

### 2.14 — Planche 14 · Le Grand Bassin, vue du sel

**Ce à quoi elle sert.** C'est la planche à vue basse, frontale, qui donne
l'**échelle** du désert de sel — là où la carte du monde (§ 2.1) est vue du
dessus. Utile en écran de table pour poser une ambiance de traversée, et pour
tout plan de situation en pleine étendue.

**Note.** C'est la seule planche du corpus qui montre un **horizon**. Le
référentiel interdit l'horizon partout ailleurs ; cette planche existe
précisément pour ça, et reste minoritaire (1 planche sur 16).

```
[PRÉAMBULE INVARIANT — § 1, avec la variante ci-dessus]

VARIANTE : cette planche est la seule du corpus à montrer un horizon et un ciel.
Le ciel occupe la bande supérieure du cadre, sur un quart de la hauteur au plus,
et il est rendu par un hachage horizontal dense, jamais par un dégradé lisse.
Aucun nuage photoréaliste.

SUJET : étendue du désert de sel vue à hauteur d'homme, sans aucun élément
urbain. Une plaine de sel craquelé s'étendant jusqu'à un horizon lointain, où se
devine une fine ligne d'ocre. Au premier plan, deux carcasses métalliques et une
piste de convoi.

CADRAGE : vue frontale, horizon à un quart de la hauteur depuis le haut. Le sol
occupe les trois quarts inférieurs du cadre. Aucune vue plongeante.

PALETTE : dominante sel blanc #E8E3D8 sur toute la plaine, déclinée en cinq
paliers de trame du premier plan à l'horizon. L'horizon est une fine bande braise
#C4801A. Le ciel, au-dessus, est un gris plombé de hachures denses #2E2A25.
Les deux carcasses sont en rouille #A8501E. Aucune autre couleur saturée.

LUMIÈRE : soleil bas au sud-est, ombres très longues portées vers le nord-ouest
par les carcasses. La lumière écrasante du sel est rendue par un contraste élevé
et des trames claires, jamais par un halo. Aucun éblouissement diffus.

TRAIT ET TEXTURE : trait de plume. Le sel est un réseau de polygones irréguliers
dont la maille se resserre avec la distance. La piste de convoi est une double
ornière sinueuse. Les carcasses sont des masses tordues à arêtes vives.

ÉLÉMENTS OBLIGATOIRES :
  RANG 1 — la plaine de sel et son horizon : l'étendue et sa ligne d'ocre au
    lointain — c'est le sujet unique de la planche.
  RANG 2 — deux carcasses métalliques tordues au premier plan, rouille #A8501E ;
    la piste de convoi à ornières traversant le cadre en diagonale ; un squelette
    de navire échoué au bord droit ; les traînées de vent en stries parallèles sur
    le sel.
  RANG 3 — les cailloux ; les fissures ; les débris épars ; les balises de route
    en piquets tordus.

GRAIN ET DÉTAIL : le sol couvre les trois quarts de la surface. Entre 14 et 20
éléments lisibles — c'est volontairement la planche la plus dépouillée du corpus.
Cible de luminance : 40 sur 100.

NÉGATIFS : [voir § 3.1] — retirer « dégradé de ciel lisse » et « nuages
photoréalistes » ? **Non, les maintenir** : le ciel est hachuré, pas lissé.
Maintenir également « plage de sable jaune » et « ciel bleu d'été ».
```

---

### 2.15 — Planche 15 · Convoi dans le désert de sel

**Ce à quoi elle sert.** Le service `convoyGenerator.js` calcule des traversées
entre cités, et le projet dispose d'un `ConvoyManager.jsx` — mais aucune
illustration de ce à quoi ressemble un convoi. C'est la seule planche qui montre
du **mouvement** et des **personnages**, à contre-emploi du reste du corpus.

**Usage :** bandeau d'écran de table pendant une traversée, illustration d'un
événement de route, ou visuel de l'onglet convois.

```
[PRÉAMBULE INVARIANT — § 1, avec la variante ci-dessous]

VARIANTE : cette planche contient des silhouettes humaines et animales — c'est la
seule du corpus. Elles sont traitées comme des **masses**, pas comme des figures
détaillées : aucune anatomie lisible, aucun visage, aucun détail de vêtement. La
silhouette noire contre le sel est le seul rendu autorisé.

SUJET : un convoi de trois véhicules et de porteurs traversant une étendue de sel
craquelé, vu de trois quarts depuis une hauteur modérée. Aucun bâtiment, aucune
cité : le convoi et le désert, rien d'autre.

CADRAGE : vue en plongée légère, trois quarts, nord en haut. Le convoi occupe le
tiers inférieur gauche du cadre, en diagonale vers le haut droit. Le sel occupe
tout le reste.

PALETTE : dominante sel blanc #E8E3D8 sur tout le sol, en réseaux de polygones
tramés. Secondaire rouille #A8501E sur les trois véhicules et les ballots. Les
silhouettes humaines sont des masses pleines #1F1C18, sans détail. Traces de
braise #C4801A dans la poussière soulevée. Aucune autre couleur saturée.

LUMIÈRE : soleil bas au sud-est, ombres très longues portées vers le nord-ouest
par le convoi, s'allongeant sur le sel. Les silhouettes sont à contre-jour.

TRAIT ET TEXTURE : trait de plume. Les véhicules sont des masses anguleuses à
roues hautes et bâches tendues, rouille #A8501E. Les porteurs sont des blocs
noirs verticaux, sans tête distincte, marchant en file. Le sel craquelé est un
réseau de polygones dont la maille se resserre avec la distance.

ÉLÉMENTS OBLIGATOIRES :
  RANG 1 — le convoi : trois véhicules et une file de porteurs en diagonale,
    silhouettes nettes sur le sel — c'est le seul motif animé du corpus.
  RANG 2 — les traces de roues et de pas en double ornière sinueuse ; la
    poussière soulevée hachurée, teintée braise ; un panache de fumée noire en
    hachures horizontales au-dessus du véhicule de tête ; un squelette de navire
    échoué au bord supérieur droit.
  RANG 3 — les ballots ; les piquets de balise ; les fissures du sel ; les
    cailloux.

GRAIN ET DÉTAIL : le sol couvre les trois quarts de la surface. Entre 16 et 22
éléments lisibles. Cible de luminance : 38 sur 100.

NÉGATIFS : [voir § 3.1] — **retirer** « personne au premier plan », « visage »,
« foule », qui sont ici le sujet. Maintenir « anatomie détaillée » comme négatif
supplémentaire : les silhouettes doivent rester des masses.
```

---

### 2.16 — Planche 16 · Le Mur de Sel

**Ce à quoi elle sert.** Le lore en fait l'élément structurant du monde : *« un
gisement de Sel Blanc quasiment pur et pratiquement inépuisable — quiconque en
contrôlerait l'exploitation tiendrait une ressource capable de faire basculer
l'équilibre entre les dix Cités »* (`Universe_Lore_v9.txt` l. 206-220).

**Statut : à trancher** (référentiel § 6, point 3). Si le Mur doit rester
caché aux joueurs, cette planche n'a pas lieu d'être produite — ou elle reste
réservée au MJ et n'entre jamais dans la vue joueur.

```
[PRÉAMBULE INVARIANT — § 1]

SUJET : le Mur de Sel, immense falaise cristalline naturelle dressée en travers
d'un détroit, barrant le bassin de bout en bout. Face à lui, une muraille
verticale de sel éclatant ; derrière le détroit, la mer océanique, à peine
visible. Un ouvrage militaire minuscule est adossé à sa base.

CADRAGE : vue frontale oblique, le Mur occupant toute la hauteur du cadre et le
tiers droit. Le premier plan est une étendue de sel. Le détroit s'ouvre en bas à
gauche, vers un plan d'eau océanique à peine entr'aperçu.

PALETTE : dominante sel blanc #E8E3D8, poussée jusqu'à #F2EEE4 sur les crêtes en
pleine lumière — c'est la seule planche autorisée à dépasser la limite de blanc,
et sur moins de 4 pour cent de la surface. Secondaire bleu artifice #3A5F8A sur
l'eau océanique, cantonnée à un angle. L'ouvrage militaire est en #B8B0A0 et
#A8501E. Aucune autre couleur saturée.

LUMIÈRE : soleil bas au sud-est, frappant la face du Mur de plein fouet. La
falaise est presque entièrement éclairée ; ses fissures seules sont hachurées.
Ombres longues au sol, vers le nord-ouest.

TRAIT ET TEXTURE : trait de plume. Le Mur est un empilement de prismes
cristallins, rendu par des arêtes rectilignes longues et des faces tramées à
densités différentes — jamais par une texture lisse. Striures verticales fines.

ÉLÉMENTS OBLIGATOIRES :
  RANG 1 — le Mur de Sel : falaise cristalline verticale barrant le cadre sur
    toute sa hauteur — l'élément le plus massif de tout le corpus.
  RANG 2 — la faille centrale, lézarde verticale descendant jusqu'au sol ; le
    détroit de sel au pied du Mur ; l'ouvrage militaire adossé, forteresse
    minuscule à tours ; les cônes d'éboulis au pied de la falaise ; les cristaux
    éclatés en éventail à la base.
  RANG 3 — les pistes de sel ; les blocs éboulés ; les stries de vent ; les
    miroitements de sel.

GRAIN ET DÉTAIL : le sol de sel couvre environ un tiers de la surface, le Mur les
deux tiers restants. Entre 20 et 26 éléments lisibles. Cible de luminance : 41 sur
100 — la planche la plus claire du corpus avec la Cité Médicale.

NÉGATIFS : [voir § 3.1] — ajouter : « texture lisse », « surface polie »,
« glacier », « iceberg », « banquise ».
```

---

## 3. Annexes

### 3.1 Les négatifs, liste canonique

> À coller **à l'identique** en fin de chaque prompt. Les blocs qui disent
> `[voir § 3.1]` renvoient ici. Les ajustements par planche sont indiqués dans
> le corps du prompt, en clair.

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

### 3.2 Paramètres de contrôle par planche

Cibles à vérifier après génération (méthode : référentiel § 5.1).

| # | Planche | Luminance cible | Éléments | Sol | Exception |
|---|---|---:|---:|---|---|
| 1 | Carte du monde | 34 | — | 75 % salin | — |
| 2 | Divertissement | 34 | 30–40 | 2/3 | — |
| 3 | Médicale | 40 | 26–32 | 2/3 | planche la plus aérée |
| 4 | Nuke City | **26** | 30–36 | 3/4 (nocturne) | azimut inversé, nocturne |
| 5 | Eau & Alimentation | 36 | 32–38 | 2/3 | eau bleue autorisée |
| 6 | Bunker Oméga | **25** | 26–32 | — (plan) | coupe technique, bleu seul |
| 7 | Armement & Défense | 34 | 28–34 | 2/3 | bâti groupé |
| 8 | Industrielle | 30 | 26–32 | 2/3 | fumée hachurée |
| 9 | Métaux & Recyclage | 38 | 32–40 | 2/3 | planche la plus dense |
| 10 | Carburant | 29 | 26–34 | 2/3 | braise < 5 % |
| 11 | Île des Anciens | 34 | 22–28 | 3/4 | océan autorisé |
| 12 | Générique | 34 | 22–28 | 3/4+ | sans identité chromatique |
| 13 | Camargue / Rhône | 36 | 20–26 | — | eau bleue autorisée |
| 14 | Grand Bassin | 40 | 14–20 | 3/4 | horizon autorisé |
| 15 | Convoi | 38 | 16–22 | 3/4 | silhouettes autorisées |
| 16 | Mur de Sel | 41 | 20–26 | 1/3 | blanc au-delà de la limite |

**Rappel :** les cibles de luminance sont mesurées sur l'image réduite en
128 × 128, en TSL, échelle 0–100. Une planche hors de sa cible de plus de
4 points est rejetée sans autre examen.

### 3.3 Table GPS officielle — positions à respecter

Source : `Cahier des charges/architecture et fonctionnement.md` § 7. Ces
coordonnées reproduisent une **Mercator sphérique** centrée sur le bassin
(constat § 1.1) :

```
X = 47,63 × longitude + 476,04
Y = −66,68 × latitude + 3200,45        (base 1200 × 1200 px)
```

| Cité | Emplacement réel | Latitude | Longitude | Base 1200 px | Planche 2010 × 1180 px |
|---|---|---|---:|---:|---:|---:|
| Bunker Oméga | Genève (Suisse) | 46,2044° N | 6,1432° E | 769, 120 | 787, 90 |
| Cité Industrielle | Turin (Italie) | 45,0703° N | 7,6869° E | 842, 195 | 861, 166 |
| Cité du Divertissement | Rome (Italie) | 41,9028° N | 12,4964° E | 1071, 406 | 1090, 377 |
| Nuke City | Marseille (France) | 43,2965° N | 5,3698° E | 732, 313 | 751, 284 |
| Cité de l'Eau & Alimentation | Camargue / Rhône (France) | 43,5000° N | 4,6000° E | 695, 300 | 714, 270 |
| Cité du Carburant | Alger (Algérie) | 36,7538° N | 3,0588° E | 622, 750 | 641, 720 |
| Cité de l'Armement & Défense | Gibraltar | 36,1408° N | 5,3536° O | 221, 791 | 240, 761 |
| L'Île des Anciens | Atlantique (ouest Gibraltar) | 36,0000° N | 8,5000° O | 71, 800 | 90, 770 |
| Cité des Métaux & Recyclage | **Malte** (au centre du bassin) | 35,8989° N | 14,5146° E | 1167, 807 | 1186, 777 |
| Cité Médicale | Alexandrie (Égypte) | 31,2001° N | 29,9187° E | 1901, 1120 | 1920, 1090 |

**Comment lire ces deux colonnes.** La colonne « Base 1200 px » est celle du
modèle : c'est là que vivent les coordonnées dans le code (`REFERENTIEL_BASE`
de `MapManager.jsx`) et dans l'API. La colonne « Planche 2010 × 1180 px » est la
même position exprimée dans le repère de l'image livrée, après recadrage sur la
zone réellement occupée par les dix cités et ajout d'une marge de 90 px. Le
passage de l'une à l'autre est donc une simple translation, pas une mise à
l'échelle : `planche ≈ base − (minX, minY) + 90`, avec `minX = 71` et
`minY = 120` (L'Île des Anciens et Bunker Oméga). À un pixel près, l'écart venant
de l'arrondi appliqué une seule fois côté générateur.

**Contrôle de cohérence :** l'emprise des dix cités plus les deux marges donne
`(1901 − 71) + 180 = 2 010` de large et `(1120 − 120) + 180 = 1 180` de haut —
exactement le format annoncé.

> **Correction du 21 septembre 2026 — Cité des Métaux : Malte, pas Athènes.**
> Le tableau du cahier des charges (§ 7) donne à cette cité le couple
> `(1606, 668)`, qui est **Athènes au pixel près** (vérifié : distance 0 px).
> Mais le lore de la cité (`loreData.js`) écrit : « *Au centre exact du bassin
> méditerranéen desséché, **sur l'ancienne île de Malte** — le point de passage
> obligé de quiconque traverse le désert de sel d'une rive à l'autre.* »
> Le cahier des charges contredit donc son propre lore. **Le lore fait foi** :
> la valeur retenue est `(1167, 807)` en base 1200, soit `(1186, 777)` sur la
> planche 2 010 × 1 180.
> Contrôle géométrique : Malte est à 1 259 px de distance moyenne des neuf autres
> cités, Athènes à 1 684 px — Malte est bien le point le plus central du bassin.
> Corollaire : la valeur `(1606, 668)` doit **disparaître** de la base, et le
> tableau § 7 du cahier des charges doit être corrigé, sans quoi la contradiction
> réapparaîtra à la prochaine saisie.

**Le cadrage retenu : 2 010 × 1 180 — pas un carré.** Trois rédactions
successives de ce document se sont trompées, il faut le dire : d abord
1200 x 1200, puis 2048 x 2048. **Aucun carré ne fonctionne**, quelle que soit sa
taille, parce que l emprise canonique des dix cités est un rectangle de rapport
**1,83**. Contrôle refait, avec la position corrigée de la Cité des Métaux :

```
grille 1024 : hors cadre — Divertissement, Médicale, Métaux
grille 1200 : hors cadre — Médicale
grille 2048 : hors cadre — Médicale seule (X = 3244, soit 158 %)
```

> **Rectification du 21 septembre 2026 — le carré est la mauvaise forme.**
> Les deux versions précédentes de ce bloc annonçaient d'abord « grille 1200 :
> hors cadre », puis « grille 2048 : les dix cités tiennent ». **La seconde est
> fausse aussi.** Le contrôle réel, candidats de l'est compris :
>
> ```
> grille 1024 : hors cadre — Divertissement, Médicale, Métaux
> grille 2048 : hors cadre — Médicale seule (X = 3244, soit 158 %)
> grille 3328 : LES DIX TIENNENT — mais 60 % de la planche est vide
> ```
>
> **Le fond du problème n'est pas la taille, c'est la FORME.** L'emprise
> canonique des dix cités fait **38,4° de longitude sur 15,0° de latitude**,
> soit `47,63 × 38,4 = 1 830 px` sur `66,68 × 15,0 = 1 000 px` : un rapport de
> **1,83**. Un carré ne peut pas contenir ce rectangle — soit il est trop étroit
> et Alexandrie sort, soit il est assez large et 40 % de sa surface est du désert
> et de l'océan inutiles.
>
> **Format retenu : `2 010 × 1 180`** (ou `1 743 × 1 024`, sa réduction à 86,7 % ;
> soit `3 486 × 2 048` en double résolution de la version réduite). Cadrage sur
> l'emprise canonique avec 90 px de marge en base 1200,
> origin `(latitude 46,2044 / longitude −8,5000)`. Les dix cités tombent juste
> sur la géographie réelle. Démonstration complète dans
> `Corrections_positions_v2.md` § 4.

**La planche 1 (carte du monde) est donc produite en 2 010 × 1 180** (ou en
`1 743 × 1 024`, sa réduction à 86,7 % — même cadrage), et les coordonnées
ci-dessus sont celles de la projection, exprimée en **base 1200** — un
référentiel mathématique, pas une taille de fichier. La projection reste en
base 1200 dans le code, et la conversion vers la taille de la planche doit vivre
à un seul endroit.

> **Clarification du 21 septembre 2026 — `1 743 × 1 024` est un rendu à 86,7 %,
> pas la taille nominale.** Le fait a été vérifié : l'emprise des dix cités plus
> la marge de 90 px fait **2 010 × 1 180 unités** en base 1200. `1 743 × 1 024`
> en est la réduction exacte (facteur 0,867 sur les deux axes), et **c'est à cette
> échelle réduite que les quatre repères ci-dessous ont été calculés**.
>
> Les deux formats décrivent donc le **même cadrage** — leur rapport est 1,702
> dans les deux cas, identique au 1,7026 attendu par `MapManager.jsx` — et les
> repères, exprimés en pourcentage, sont **valables pour l'un comme pour l'autre**.
> Contrôle refait à l'échelle 1,0 : Gibraltar 11,9 % / 64,5 %, Genève 39,2 % /
> 7,6 %, Malte 59,0 % / 65,9 %, Alexandrie 95,5 % / 92,4 % — les mêmes valeurs.
>
> **Conséquence pratique : produire en 2 010 × 1 180** (échelle 1,0, aucune perte)
> et non en 1 743 × 1 024, qui est une réduction. Un contrôle utile pour la suite :
> toute planche de rapport ≈ 1,702 convient ; **un carré, non.**

**Le format de la planche 1 n'est pas carré.** Voir le tableau de ce paragraphe :
l'emprise canonique fait un rapport de **1,83**, un carré ne peut pas la
contenir. Format retenu : **`2 010 × 1 180`** (voir la clarification ci-dessus ;
`1 743 × 1 024` en est la réduction à 86,7 %). Origin du cadrage :
`(latitude 46,2044 / longitude −8,5000)`, marge de 90 px en base 1200.

Pour la planche 1, la consigne reste de **reproduire la géographie réelle** et
non une grille. Trois repères de contrôle suffisent, exprimés en pourcentage —
donc indépendants de la résolution choisie (valeurs valables pour `2 010 × 1 180`
comme pour `1 743 × 1 024`) :

- **Gibraltar** doit tomber à **11,9 % de la largeur × 64,5 % de la hauteur**.
- **Genève** doit tomber à **39,2 % × 7,6 %**.
- **Alexandrie** doit tomber à **95,5 % × 92,4 %** — dans le cadre, au coin
  sud-est. Si elle déborde, le cadrage est faux.
- **Malte** doit tomber à **59,0 % × 65,8 %** — au centre du bassin.

Si la planche générée place Gibraltar au tiers inférieur (46 %) — ce que fait
l'image actuelle — elle est fausse. La vérité de référence est la projection,
pas le dessin existant.

### 3.4 Reproductibilité

Deux règles de production, à appliquer sans exception :

1. **Une planche, un prompt, une graine.** Noter la graine (seed) de chaque
   génération retenue et la conserver. Sans elle, une planche ne peut pas être
   regénérée à l'identique pour corriger un détail — et le référentiel exige que
   le jeu des seize planches soit reproductible.
2. **Générer les seize, puis juger l'ensemble.** Ne jamais valider une planche
   isolément. C'est la planche de contact (§ 5.3 du référentiel) qui décide.
