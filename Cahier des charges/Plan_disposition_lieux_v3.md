# Plan de disposition des lieux par cite — v3

Genere par `server/proposer-plan-villes.js`, ecrit en base par
`server/ecrire-positions-lieux.js`. Ce document est lui-meme produit par script
depuis `server/plan-villes.json` : les coordonnees ci-dessous ne peuvent pas
diverger du generateur. Coordonnees en base 1000.

## Le modele

1. **Anneau du tronc commun** (rayon 0,22), angles ABSOLUS identiques dans les
   10 cites. Le Marche d'Echanges est toujours au nord : c'est le repere de
   lecture d'un plan a l'autre.
2. **Secteurs fonctionnels** fixes : eau (est), production (sud), defense
   (ouest), memoire (nord). Un lieu de meme fonction occupe toujours la meme
   region du plan, dans toutes les cites.
3. **Bien commun** (anneau intermediaire) : arene, theatre, casino, studios ne
   sont la propriete d'aucune faction. Les ranger dans un secteur les
   rattacherait a une fonction de la cite. Ils sont donc semes sur tout le
   tour : partout dans la ville, a personne.
4. **Centre unique** (rayon 0) : l'objet autour duquel la cite s'organise.
5. **Anneau des lieux hors les murs** : au-dela de tout le reste.

Les lieux sont classes d'apres leur **description**, pas leur nom : « Casino de
la Ruine » est une salle de jeu au centre-ville, pas une ruine isolee.

## Pourquoi l'anneau est decale de 6°

A 0°, le generateur (144°) et le mur (216°) sont symetriques par rapport a la
verticale : ils partagent exactement le meme `wy`, donc leurs etiquettes se
superposaient — et comme l'anneau est identique dans toutes les cites, la
collision se repetait dans les dix. Un decalage de 6° les ecarte (ecart vertical
0 → 14 px, seuil de lisibilite 13 px) tout en ne bougeant le Marche que de 11 px
vers l'est : il reste « au nord » a l'oeil, le repere de lecture est preserve.

## Deux lectures de lore corrigees

**Le Mur d'Enceinte de Nuke City existe.** Sa description dit « Il n'y a pas de
mur », mais la phrase parle du REACTEUR, a ciel ouvert faute d'enceinte de
confinement. L'enceinte de la VILLE est toujours debout. Un test de negation
sur le texte ecartait donc a tort un lieu qui existe. **Aucun lieu n'est
desormais deduit d'une phrase negative** : les 10 cites ont leur mur, et il
occupe son angle fixe.

**Le spectacle est un bien commun, pas une fonction.** Arene, studios, casino
et theatre n'appartiennent a aucune faction. Les ranger en « memoire » les
rattachait a une fonction de la cite et les entassait dans un quadrant.

## Controle

* 0 collision sur 90 lieux (seuil 44 px)
* distance minimale REELLE la plus faible : 71 px (CITÉ DES MÉTAUX & RECYCLAGE)
* 0 chevauchement d'etiquettes a l'ecran
* 10/10 cites ont leur Mur d'Enceinte sur son angle fixe
* repartition : commun 50 (56%), production 13 (14%), memoire 7 (8%), defense 6 (7%), loin 4 (4%), eau 4 (4%), bien-commun 4 (4%), coeur 2 (2%)


## BUNKER OMÉGA

| Secteur | Lieu | Plan (x, y) |
|---|---|---|
| **tronc commun** | Le Marché d'Échanges | 511, 391 |
| **tronc commun** | La Citerne Centrale | 608, 477 |
| **tronc commun** | Le Générateur Principal | 555, 595 |
| **tronc commun** | Le Mur d'Enceinte & Les Portes | 426, 582 |
| **tronc commun** | Le Quartier Résidentiel / Les Taudis | 400, 455 |
| centre | Noyau de l'Intelligence Artificielle | 500, 500 |
| memoire | Centre de Télécommunications Globales | 539, 324 |
| production | Ateliers de Drones Autonomes | 523, 678 |
| hors les murs | Laboratoire de Biologie Avancée | 694, 732 |


## CITÉ DE L'ARMEMENT & DÉFENSE

| Secteur | Lieu | Plan (x, y) |
|---|---|---|
| **tronc commun** | Le Marché d'Échanges | 511, 391 |
| **tronc commun** | La Citerne Centrale | 608, 477 |
| **tronc commun** | Le Générateur Principal | 555, 595 |
| **tronc commun** | Le Mur d'Enceinte & Les Portes | 426, 582 |
| **tronc commun** | Le Quartier Résidentiel / Les Taudis | 400, 455 |
| production | Usine de Fabrication d'Armes | 523, 678 |
| defense | Caserne d'Entraînement des Milices | 327, 550 |
| defense | Dépôt d'Armes Lourdes | 286, 417 |
| hors les murs | Laboratoire des Explosifs | 694, 732 |


## CITÉ DE L'EAU & ALIMENTATION

| Secteur | Lieu | Plan (x, y) |
|---|---|---|
| **tronc commun** | Le Marché d'Échanges | 511, 391 |
| **tronc commun** | La Citerne Centrale | 608, 477 |
| **tronc commun** | Le Générateur Principal | 555, 595 |
| **tronc commun** | Le Mur d'Enceinte & Les Portes | 426, 582 |
| **tronc commun** | Le Quartier Résidentiel / Les Taudis | 400, 455 |
| eau | Serres Hydroponiques Blindées | 614, 360 |
| eau | Station de Filtration | 712, 412 |
| eau | Élevage de Bétail Mutant | 769, 527 |
| hors les murs | Réserve de Semences Pré-Apocalypse | 694, 732 |


## CITÉ DES MÉTAUX & RECYCLAGE

| Secteur | Lieu | Plan (x, y) |
|---|---|---|
| **tronc commun** | Le Marché d'Échanges | 511, 391 |
| **tronc commun** | La Citerne Centrale | 608, 477 |
| **tronc commun** | Le Générateur Principal | 555, 595 |
| **tronc commun** | Le Mur d'Enceinte & Les Portes | 426, 582 |
| **tronc commun** | Le Quartier Résidentiel / Les Taudis | 400, 455 |
| memoire | Marché aux Alliages Rares | 539, 324 |
| production | Mine Profonde | 587, 658 |
| production | Usine de Recyclage | 445, 723 |
| hors les murs | Cimetière des Gratte-Ciels | 694, 732 |


## CITÉ DU CARBURANT

| Secteur | Lieu | Plan (x, y) |
|---|---|---|
| **tronc commun** | Le Marché d'Échanges | 511, 391 |
| **tronc commun** | La Citerne Centrale | 608, 477 |
| **tronc commun** | Le Générateur Principal | 555, 595 |
| **tronc commun** | Le Mur d'Enceinte & Les Portes | 426, 582 |
| **tronc commun** | Le Quartier Résidentiel / Les Taudis | 400, 455 |
| centre | Grande Raffinerie | 500, 500 |
| production | Puits d'Extraction Principal | 587, 658 |
| production | Garage des Convois Lourds | 445, 723 |
| defense | Dépôt de Carburant Haute Sécurité | 320, 492 |


## CITÉ DU DIVERTISSEMENT

| Secteur | Lieu | Plan (x, y) |
|---|---|---|
| **tronc commun** | Le Marché d'Échanges | 511, 391 |
| **tronc commun** | La Citerne Centrale | 608, 477 |
| **tronc commun** | Le Générateur Principal | 555, 595 |
| **tronc commun** | Le Mur d'Enceinte & Les Portes | 426, 582 |
| **tronc commun** | Le Quartier Résidentiel / Les Taudis | 400, 455 |
| bien commun | Grande Arène de Combat | 673, 379 |
| bien commun | Studios de Radiodiffusion | 621, 673 |
| bien commun | Casino de la Ruine | 327, 621 |
| bien commun | Théâtre des Illusions | 379, 327 |


## CITÉ INDUSTRIELLE

| Secteur | Lieu | Plan (x, y) |
|---|---|---|
| **tronc commun** | Le Marché d'Échanges | 511, 391 |
| **tronc commun** | La Citerne Centrale | 608, 477 |
| **tronc commun** | Le Générateur Principal | 555, 595 |
| **tronc commun** | Le Mur d'Enceinte & Les Portes | 426, 582 |
| **tronc commun** | Le Quartier Résidentiel / Les Taudis | 400, 455 |
| production | Fonderie Colossale | 605, 646 |
| production | Ligne d'Assemblage de Véhicules | 530, 728 |
| production | Atelier des Pièces Détachées | 404, 752 |
| defense | Dépôt de Ferraille | 320, 492 |


## CITÉ MÉDICALE

| Secteur | Lieu | Plan (x, y) |
|---|---|---|
| **tronc commun** | Le Marché d'Échanges | 511, 391 |
| **tronc commun** | La Citerne Centrale | 608, 477 |
| **tronc commun** | Le Générateur Principal | 555, 595 |
| **tronc commun** | Le Mur d'Enceinte & Les Portes | 426, 582 |
| **tronc commun** | Le Quartier Résidentiel / Les Taudis | 400, 455 |
| memoire | Laboratoire de Virologie | 451, 327 |
| memoire | Clinique d'Amélioration Cybernétique | 550, 275 |
| memoire | Unité de Quarantaine Sévère | 677, 296 |
| production | Usine de Synthèse de Médicaments | 523, 678 |


## L'ILE DES ANCIENS

| Secteur | Lieu | Plan (x, y) |
|---|---|---|
| **tronc commun** | Le Marché d'Échanges | 511, 391 |
| **tronc commun** | La Citerne Centrale | 608, 477 |
| **tronc commun** | Le Générateur Principal | 555, 595 |
| **tronc commun** | Le Mur d'Enceinte & Les Portes | 426, 582 |
| **tronc commun** | Le Quartier Résidentiel / Les Taudis | 400, 455 |
| eau | Complexe Agricole Automatisé | 666, 431 |
| memoire | Hôpital Miraculeux | 473, 322 |
| memoire | Centre de Commandement Tactique | 628, 309 |
| defense | Centre de Données Pré-Guerre | 320, 492 |


## NUKE CITY

| Secteur | Lieu | Plan (x, y) |
|---|---|---|
| **tronc commun** | Le Marché d'Échanges | 511, 391 |
| **tronc commun** | La Citerne Centrale | 608, 477 |
| **tronc commun** | Le Générateur Principal | 555, 595 |
| **tronc commun** | Le Mur d'Enceinte & Les Portes | 426, 582 |
| **tronc commun** | Le Quartier Résidentiel / Les Taudis | 400, 455 |
| production | Cœur du Réacteur Nucléaire | 605, 646 |
| production | Zone de Refroidissement Irradiée | 530, 728 |
| production | Centre de Recherche sur l'Énergie | 404, 752 |
| defense | Dépôt de Déchets Toxiques | 320, 492 |
