# Compendium des Arbres de Compétences
## Chroniques de l'Apocalypse — Système v2

> Document compilé, mis à jour au fil de la production. Le détail des décisions/débats reste dans `journal_modifications_techniques.md`.

---

## Suivi de production

| Arbre | Classe 5e | Type | Statut |
|---|---|---|---|
| Pisteur des Sables | Rôdeur | Commun | ✅ Fait |
| Ombres du Bassin | Roublard | Commun | ✅ Fait |
| Furie des Ruines | Barbare | Commun | ✅ Fait |
| Ordre du Moteur | Paladin (culte) | Commun | ✅ Fait — révisé (Clerc retiré) |
| Symbiose Sauvage | Druide | Commun | ✅ Fait |
| Bourse de la Douleur | — (associé à Barde) | Caché transversal | ✅ Fait |
| Moine | Moine | Commun | ✅ Fait |
| Le Serment | Paladin (profane) | Commun | ⚠️ Brouillon — non validé comme vraie classe |
| Combat Rapproché | Guerrier (mêlée) | Commun | ✅ Fait |
| Arsenal Vivant | Artificier (armement lourd) | Commun | ✅ Fait |
| Défense | Guerrier (tank) | Commun | ✅ Fait — révisé (Protection du Groupe retirée) |
| Médecine | Clerc (scientifique) | Commun | ✅ Fait — intègre le Clerc |
| Technologie | Magicien/Artificier (séculier) | Commun | ✅ Fait |
| Toile de Velours | Barde | Commun | ✅ Fait |
| 10 arbres de cité | — | Cachés | ⏳ À étoffer (5→8-12 nœuds chacun, monnaie Faveur) |
| Écho du Réseau | Occultiste | Secret de campagne | 🔒 Gelé, non traité |
| Classes magiques | Magicien/Ensorceleur | Gelé jalon technologique | 🔒 Gelé, non traité |

---

## Règles transversales (validées)

- **Budget de points** : ~28 points sur toute la campagne (niveau 14, 2 pts/niveau). Chaque arbre commun à 2 branches doit désormais coûter **28 points maximum** à vider entièrement (8 nœuds/branche : 1-2-2-2-1 par tier, coût 1/1/2/2/3) — un mono-classe dédié doit pouvoir finir un arbre d'ici la fin de la campagne. Les arbres à 3 branches (type Symbiose Sauvage, 27 pts) restent tels quels : la diversité de gabarit est voulue.
- **Cooldowns** : *court* = 2 tours de combat · *long* = 4 tours de combat.
- **Contreparties** : courbe unifiée sur tous les arbres concernés — **Tier 2** porte une contrepartie légère et **chiffrée** (malus de stat, ex. -1 Charisme), assumée définitivement (jamais réversible en jeu) ; **Tier 5 (capstone actif)** porte une contrepartie sévère sous forme de **niveaux d'Exténuation** (échelle D&D 5e, cf. ci-dessous). Les capstones purement passifs n'ont pas besoin d'Exténuation. Tiers 1/3/4 restent sans contrepartie sauf exception déjà justifiée.
- **Exténuation (échelle D&D 5e)** : 6 niveaux cumulatifs (1 : désavantage aux tests de caractéristique · 2 : vitesse réduite de moitié · 3 : désavantage aux attaques et jets de sauvegarde · 4 : PV max réduits de moitié · 5 : vitesse à 0 · 6 : mort). Un niveau disparaît généralement après un repos long complet.
- **Monnaie des arbres cachés** : les arbres de cité et transversaux (Bourse de la Douleur, futurs arbres de cité) ne puisent **plus** dans le budget de points de compétence — ils sont financés par une ressource narrative séparée, la **Faveur** (mesure de l'aide apportée par le PJ à sa cité/faction), distribuée par le MJ selon les actions en jeu.
- **Bestiaire commun** : la faune citée dans les arbres (Pisteur des Sables, et potentiellement Symbiose Sauvage ou d'autres futurs arbres) doit être puisée dans la section "FAUNE DU BASSIN" du lore (Universe_Lore_v7) plutôt que réinventée à chaque fois. Exception assumée : le prédateur du delta de Camargue est explicitement laissé sans nom dans le lore ("à nommer et détailler") — Anguille-Tonnerre est une proposition légitime à ce titre-là, pas un écart au canon.

---

## 1. Pisteur des Sables — Analogue Rôdeur

**Type** : Commun · **Attribut** : Dextérité / Sagesse · **Branches** : Tir de Précision · Compagnon de Chasse · **Nœuds** : 16 (8 par branche, 28 points pour tout vider)

### Branche 1 — Tir de Précision

| Tier | Nœud | Type | Coût | Prérequis | Effet |
|---|---|---|---|---|---|
| 1 | Souffle Retenu | Passif | 1 | — | Avantage au tir à distance si le personnage n'a pas bougé pendant son tour. |
| 2 | Cartouches Choisies | Passif | 1 | Souffle Retenu | +1 dégât avec les armes à un coup non-automatiques. |
| 2 | Visée Stabilisée | Actif *(court)* | 1 | Souffle Retenu | Annule le désavantage dû au mouvement ou à une cible partiellement cachée. *Contrepartie légère : -1 à la Discrétion pendant la préparation du tir (immobilité totale requise).* |
| 3 | Œil de Tireur d'Élite | Actif *(court)* | 2 | Cartouches Choisies ou Visée Stabilisée | Contre une cible immobile : touche automatiquement une zone vitale (dégâts maximisés). |
| 3 | Pas du Fouisseur | Passif | 2 | Cartouches Choisies ou Visée Stabilisée | Aucune pénalité de discrétion en s'immobilisant pour tirer en zone de dunes/sable ; la première attaque depuis une position ainsi dissimulée bénéficie d'un avantage. |
| 4 | Sang-Froid du Bassin | Passif | 2 | Œil de Tireur d'Élite ou Pas du Fouisseur | Aucune pénalité de précision après un déplacement, même en terrain difficile. |
| 4 | Cadence du Chasseur | Actif *(long)* | 2 | Œil de Tireur d'Élite ou Pas du Fouisseur | Une fois par repos long : deux tirs de précision sur la même cible au lieu d'un. |
| 5 | **Le Jugement du Bassin** (capstone) | Actif *(long)* | 3 | Sang-Froid du Bassin et Cadence du Chasseur | Tir unique à très longue portée contre une cible qui ignore la menace : dégâts quasi-létaux garantis, ignore une partie de l'armure. *Contrepartie sévère : inflige 2 niveaux d'Exténuation au tireur (concentration extrême).* |

### Branche 2 — Compagnon de Chasse

| Tier | Nœud | Type | Coût | Prérequis | Effet |
|---|---|---|---|---|---|
| 1 | Lien du Bassin | Passif | 1 | — | Débloque le compagnon Palier 1 (au choix, cf. bestiaire). Le compagnon agit toujours juste après le Pisteur, sans initiative séparée. |
| 2 | Commandement de Base | Actif *(court)* | 1 | Lien du Bassin | Ordonne au compagnon une action simple (attaquer, distraire, rapporter). |
| 2 | Flair du Bassin | Passif | 1 | Lien du Bassin | Le compagnon repère embuscades/pièges/proies à l'odorat ; avantage aux tests de pistage. *Contrepartie légère : -1 à son prochain jet d'initiative s'il est exposé à une odeur forte/toxique (distraction sensorielle).* |
| 3 | Compagnon Aguerri | Passif | 2 | Commandement de Base ou Flair du Bassin | Débloque l'accès au Palier 2, en remplacement du Palier 1. |
| 3 | Tactique de Meute | Actif *(court)* | 2 | Commandement de Base ou Flair du Bassin | Si le compagnon et le Pisteur attaquent la même cible dans le même tour, la seconde attaque a un avantage. |
| 4 | Endurance du Bassin | Passif | 2 | Compagnon Aguerri ou Tactique de Meute | Le compagnon gagne une résistance aux dégâts de poison et de radiation. |
| 4 | Rappel d'Urgence | Actif *(long)* | 2 | Compagnon Aguerri ou Tactique de Meute | Si le compagnon est mis hors combat, il peut être stabilisé/rappelé une fois par repos long. |
| 5 | **Symbiose du Bassin** (capstone) | Actif *(long)* | 3 | Endurance du Bassin et Rappel d'Urgence | Débloque le Palier 3. Une fois par repos long, fusion d'actions avec le compagnon en assaut coordonné. *Contrepartie sévère : inflige 1 niveau d'Exténuation au Pisteur.* |

**Bestiaire des Compagnons** *(stats fixes, pas de progression ; max 2 compétences choisies par bête, cf. FAUNE DU BASSIN du lore)*

- **Palier 1** — *Chacal-Cendré* (PV 12, Déf 12, Atq +3/1d6, Vitesse rapide, Discipline de Meute) · *Chien-Perdu* (PV 14, Déf 10, Atq +4/1d8, Instinct Sauvage aléatoire) · *Vestige Radiotrophe* (PV 6, Déf 8, Atq +1/1d4, profil survie/détection radique)
- **Palier 2** — *Scorpion de Verre* (PV 18, Déf 15, Atq +4/1d8, venin cristallisant — risque de perte de mobilité du membre touché si non traité, Camouflage de Verre) · *Fouisseur de Sel* (PV 16, Déf 13, Atq +4/1d6, Embuscade Souterraine)
- **Palier 3** — *Jeune Caprimyces Titanicus* (PV 30, Déf 16, Atq +6/2d8, Symbiose Sporale) · *Rejeton du Ver de Vitre* (PV 26, Déf 14, Atq +7/2d6 brûlure, radiation passive à gérer) · *Anguille-Tonnerre* (PV 24, Déf 13, Atq +6/2d6 décharge, apex du delta — nom proposé, le lore laisse ce prédateur volontairement sans nom)

Acquérir un compagnon de Palier 3 reste un accroche-quête, jamais un simple achat.

---

## 2. Ombres du Bassin — Analogue Roublard

**Type** : Commun · **Attribut** : Dextérité / Intelligence · **Branches** : Ombre et Silence · Lame Sournoise · **Nœuds** : 16 (8 par branche, 28 points pour tout vider)
**Extension de prestige** : l'arbre caché Voile d'Acier (Bunker Oméga) reste accessible à qui remplit la condition narrative, indépendamment de sa cité d'origine.

### Branche 1 — Ombre et Silence

| Tier | Nœud | Type | Coût | Prérequis | Effet |
|---|---|---|---|---|---|
| 1 | Pas de Loup | Passif | 1 | — | Avantage aux tests de discrétion en mouvement lent. *(Le crochetage/vol à la tire de base est supposé acquis par tout Roublard — plus besoin d'un nœud dédié.)* |
| 2 | Fondu dans la Foule | Passif | 1 | Pas de Loup | En zone urbaine, quasi indétectable sans action suspecte. *Contrepartie légère : -1 à la Perception passive en se fondant dans la foule (on baisse sa garde).* |
| 2 | Évasion Rapide | Actif *(court)* | 1 | Pas de Loup | Se dégage d'une immobilisation sans subir d'attaque d'opportunité. |
| 3 | Sens du Danger | Passif | 2 | Fondu dans la Foule ou Évasion Rapide | Ne peut jamais être totalement pris au dépourvu. |
| 3 | Ombre Vivante | Actif *(court)* | 2 | Fondu dans la Foule ou Évasion Rapide | Devient indétectable un court instant, même en plein combat. |
| 4 | Fantôme des Ruelles | Passif | 2 | Sens du Danger ou Ombre Vivante | Aucune pénalité de vitesse en discrétion. |
| 4 | Double Jeu | Actif *(long)* | 2 | Sens du Danger ou Ombre Vivante | Feint la mort/l'incapacité pendant un tour. |
| 5 | **Le Point de Non-Retour** (capstone) | Actif *(long)* | 3 | Fantôme des Ruelles et Double Jeu | Disparaît de la perception ennemie un instant, ressort avec un avantage garanti. *Contrepartie sévère : inflige 2 niveaux d'Exténuation (tension nerveuse extrême).* |

### Branche 2 — Lame Sournoise

| Tier | Nœud | Type | Coût | Prérequis | Effet |
|---|---|---|---|---|---|
| 1 | Frappe Opportuniste | Passif | 1 | — | Dégâts bonus contre une cible n'ayant pas agi ou prise au dépourvu. |
| 2 | Coup Bas | Actif *(court)* | 1 | Frappe Opportuniste | Inflige un désavantage temporaire sur la prochaine action de la cible. |
| 2 | Poche Habile | Passif | 1 | Frappe Opportuniste | Une attaque de mêlée réussie permet de dérober un objet discrètement. *Contrepartie légère : si le vol est repéré, -1 à tous les jets sociaux avec ce PNJ/cette faction par la suite (réputation locale entachée).* |
| 3 | Frappe Précise | Actif *(court)* | 2 | Coup Bas ou Poche Habile | Ignore une partie de l'armure en visant un point faible. |
| 3 | Réflexes de Rue | Passif | 2 | Coup Bas ou Poche Habile | Bonus de défense contre attaques d'opportunité et ripostes ; permet en plus un dégagement sans provoquer d'attaque, une fois par combat. |
| 4 | Trahison Programmée | Passif | 2 | Frappe Précise ou Réflexes de Rue | Dégâts bonus si la cible est piégée/empoisonnée/distraite. |
| 4 | Second Souffle Sournois | Actif *(long)* | 2 | Frappe Précise ou Réflexes de Rue | Toucher une cible surprise octroie une action bonus. |
| 5 | **Le Coup de Grâce** (capstone) | Actif *(long)* | 3 | Trahison Programmée et Second Souffle Sournois | Contre une cible très affaiblie/surprise : tentative d'exécution instantanée. *Contrepartie sévère : inflige 1 niveau d'Exténuation (décharge nerveuse post-exécution).* |

**Note** : contreparties limitées et légères pour rester cohérent avec l'identité "sûre" de cet arbre — tous les bonus de dégâts restent conditionnés à la surprise/l'observation, jamais à l'encaissement, ce qui différencie clairement cet arbre de Combat Rapproché et Furie des Ruines.

---

## 3. Furie des Ruines — Analogue Barbare

**Type** : Commun · **Attribut** : Force / Constitution · **Branches** : Rage et Encaissement · Augmentations Discrètes · **Nœuds** : 16 (8 par branche, 28 points pour tout vider)

### Branche 1 — Rage et Encaissement

| Tier | Nœud | Type | Coût | Prérequis | Effet |
|---|---|---|---|---|---|
| 1 | Sang Bouillant | Actif *(court)* | 1 | — | Entre en rage : bonus de dégâts en mêlée, malus de défense ce tour. |
| 2 | Cuir Tanné | Passif | 1 | Sang Bouillant | Résistance mineure aux dégâts tranchants/perforants. *Contrepartie légère : -1 Charisme en interactions formelles (callosités visibles).* |
| 2 | Fureur Contagieuse | Actif *(court)* | 1 | Sang Bouillant | Un allié proche gagne un bonus d'attaque temporaire en voyant la rage. |
| 3 | Tolérance Radique | Passif | 2 | Cuir Tanné ou Fureur Contagieuse | Réduit les effets des radiations légères à moyennes. |
| 3 | Increvable | Passif | 2 | Cuir Tanné ou Fureur Contagieuse | Ne tombe pas inconscient immédiatement à 0 PV — un round de sursis. |
| 4 | Deuxième Souffle Sauvage | Actif *(long)* | 2 | Tolérance Radique ou Increvable | Récupère des PV en plein combat en rugissant. |
| 4 | Peau de Fer | Passif | 2 | Tolérance Radique ou Increvable | Callosité renforcée par l'exposition combinée drogues/radiations : réduction de dégâts supplémentaire. |
| 5 | **Rage Increvable** (capstone) | Actif *(long)* | 3 | Deuxième Souffle Sauvage et Peau de Fer | Pendant plusieurs tours : résistance à tous les types de dégâts, quasi impossible à mettre hors combat sauf dégâts massifs. *Contrepartie sévère : inflige 2 niveaux d'Exténuation une fois l'effet terminé.* |

### Branche 2 — Augmentations Discrètes

| Tier | Nœud | Type | Coût | Prérequis | Effet |
|---|---|---|---|---|---|
| 1 | Greffe Sous-Cutanée | Passif | 1 | — | Bonus mineur de dégâts en mêlée, invisible à l'œil nu. |
| 2 | Réflexes Amplifiés | Passif | 1 | Greffe Sous-Cutanée | Bonus discret d'esquive/initiative, sans trace visible. |
| 2 | Adrénaline Programmée | Actif *(court)* | 1 | Greffe Sous-Cutanée | Poussée d'adrénaline artificielle : action bonus ce tour. *Contrepartie légère : -1 à tous les jets pendant le tour suivant (contrecoup de la greffe).* |
| 3 | Ossature Renforcée | Passif | 2 | Réflexes Amplifiés ou Adrénaline Programmée | Réduction des dégâts de chute/impact ; avantage aux jets pour résister à être renversé ou agrippé. |
| 3 | Filtrage Toxique | Passif | 2 | Réflexes Amplifiés ou Adrénaline Programmée | Résistance aux poisons/toxines. |
| 4 | Surcharge Musculaire | Actif *(long)* | 2 | Ossature Renforcée ou Filtrage Toxique | Bonus de Force massif temporaire, une fois par repos long. |
| 4 | Camouflage Biologique | Passif | 2 | Ossature Renforcée ou Filtrage Toxique | Les scanners/détecteurs ne repèrent aucune anomalie — les greffes restent totalement indétectables. |
| 5 | **Le Corps Parfait** (capstone) | Passif | 3 | Surcharge Musculaire et Camouflage Biologique | Bonus cumulé permanent de Force/Constitution, entièrement invisible et indétectable. *(Capstone passif : pas de contrepartie d'Exténuation, il n'y a pas d'usage ponctuel à épuiser.)* |

---

## 4. Ordre du Moteur — Analogue Paladin (culte)

> Le Clerc se sépare de cet arbre (cf. décision du MJ) : Ordre du Moteur redevient un Paladin pur, sans branche de soin. Le rôle de guérisseur passe à Médecine, désormais positionnée comme l'équivalent Clerc — en version scientifique plutôt que rituelle.

**Type** : Commun · **Attribut** : Charisme / Constitution · **Branches** : Ingénierie du Culte · Jugement du Moteur · **Nœuds** : 16 (8 par branche, 28 points pour tout vider)
**Ressource propre** : *Ferveur*, accessible dès le premier nœud investi dans cet arbre (peu importe la branche) ; se régénère au repos court et long via des gestes de dévotion. Distincte des compétences de Technologie (matériel/hacking séculier) et Médecine (soins scientifiques).

### Branche 1 — Ingénierie du Culte

| Tier | Nœud | Type | Coût | Prérequis | Effet |
|---|---|---|---|---|---|
| 1 | Bénédiction de l'Outil | Passif | 1 | — | Les armes/outils bénis reçoivent un bonus mineur de fiabilité (jamais d'enrayement) ou de dégâts. |
| 2 | Exorcisme Mécanique | Actif *(court)* | 1 | Bénédiction de l'Outil | Purifie/répare rituellement un dysfonctionnement mineur d'une machine corrompue. *Contrepartie légère : -1 à l'Intelligence effective pour tout diagnostic technique "profane" pendant la même scène.* |
| 2 | Bénédiction du Convoi | Actif *(long)* | 1 | Bénédiction de l'Outil | Bénit un véhicule/machine : résistance temporaire à la panne/aux dégâts critiques. |
| 3 | Rite d'Entretien | Passif | 2 | Exorcisme Mécanique ou Bénédiction du Convoi | Les machines/véhicules bénis par le porteur tombent deux fois moins souvent en panne sur la durée. |
| 3 | Main Sacrée | Actif *(court)* | 2 | Exorcisme Mécanique ou Bénédiction du Convoi | Répare en urgence, en pleine action, un équipement endommagé d'un allié (arme enrayée, armure brisée). |
| 4 | In Nomine Motoris | Passif | 2 | Rite d'Entretien ou Main Sacrée | La Ferveur se régénère plus vite près d'un Adepte du Dieu-Moteur ou lors d'un rite collectif. |
| 4 | Consécration de l'Arsenal | Actif *(long, coûte Ferveur)* | 2 | Rite d'Entretien ou Main Sacrée | Bénit toutes les armes du groupe avant un affrontement annoncé : bonus de dégâts partagé pour ce combat. |
| 5 | **Le Souffle Consacré** (capstone) | Actif *(long)* | 3 | In Nomine Motoris et Consécration de l'Arsenal | Libère toute sa Ferveur : dégâts de zone majeurs, immunité temporaire aux pannes pour les alliés proches. *Contrepartie sévère : inflige 2 niveaux d'Exténuation.* |

### Branche 2 — Jugement du Moteur

| Tier | Nœud | Type | Coût | Prérequis | Effet |
|---|---|---|---|---|---|
| 1 | Œil du Profanateur | Passif | 1 | — | Identifie instantanément qui a endommagé, insulté ou trahi une machine/le culte. |
| 2 | Jugement du Moteur | Actif *(court, coûte Ferveur)* | 1 | Œil du Profanateur | Dégâts supplémentaires contre une cible jugée profanatrice du culte. |
| 2 | Aura de Ferveur | Passif | 1 | Œil du Profanateur | Les alliés proches gagnent un bonus de moral/défense tant que le porteur reste visible. |
| 3 | Colère Consacrée | Passif | 2 | Jugement du Moteur ou Aura de Ferveur | Bonus d'attaque après avoir vu une machine/un allié détruit sous ses yeux. |
| 3 | Marque du Profanateur | Actif *(court)* | 2 | Jugement du Moteur ou Aura de Ferveur | Désigne une cible : les alliés gagnent un avantage à l'attaquer tant qu'elle reste marquée. |
| 4 | Marteau du Jugement | Actif *(court, coûte Ferveur)* | 2 | Colère Consacrée ou Marque du Profanateur | Frappe consacrée : dégâts majorés contre machines corrompues ou ennemis du culte. |
| 4 | Zèle Inébranlable | Passif | 2 | Colère Consacrée ou Marque du Profanateur | Résistance à la peur et au contrôle mental tant que la Ferveur n'est pas épuisée. |
| 5 | **Le Jugement Ultime** (capstone) | Actif *(long, coûte Ferveur)* | 3 | Marteau du Jugement et Zèle Inébranlable | Frappe consacrée dévastatrice contre le pire profanateur présent, ignorant l'essentiel de son armure. *Contrepartie sévère : inflige 2 niveaux d'Exténuation.* |

---

## 5. Symbiose Sauvage — Analogue Druide

**Type** : Commun · **Attribut** : Sagesse / Constitution · **Branches** : Drogues de Combat · Augmentations Bestiales Visibles · Mutation Corporelle · **Nœuds** : 15 (5 par branche — arbre à 3 branches, une par tier)

### Branche 1 — Drogues de Combat

| Tier | Nœud | Type | Coût | Effet |
|---|---|---|---|---|
| 1 | Stimulant de Combat | Actif *(court)* | 1 | Injecte un stimulant : bonus temporaire de dégâts ou de vitesse ce tour. |
| 2 | Tolérance Chimique | Passif | 1 | Résistance aux effets secondaires négatifs des drogues de combat. |
| 3 | Cocktail Berserk | Actif *(court)* | 2 | Stimulant puissant : bonus majeur d'attaque, désavantage en défense ce tour. |
| 4 | Overdrive Contrôlé | Passif | 2 | Peut cumuler un second stimulant sans effet secondaire supplémentaire, une fois par combat. |
| 5 | **Transe Chimique Totale** (capstone) | Actif *(long)* | 3 | État combatif extrême, bonus cumulés sur plusieurs tours. *Contrepartie sévère : inflige 2 niveaux d'Exténuation une fois l'effet terminé.* |

### Branche 2 — Augmentations Bestiales Visibles

| Tier | Nœud | Type | Coût | Effet |
|---|---|---|---|---|
| 1 | Griffes de Combat | Passif | 1 | Greffe visible : dégâts de mêlée naturels améliorés (griffes/lames rétractables). |
| 2 | Marque de la Bête | Passif | 1 | Apparence clairement non-humaine : bonus d'intimidation. *Contrepartie : -1 Charisme dans les interactions formelles/cités méfiantes.* |
| 3 | Réflexes Prédateurs | Passif | 2 | Bonus d'initiative/esquive grâce aux greffes sensorielles bestiales. |
| 4 | Mâchoires Augmentées | Passif | 2 | Attaque secondaire de morsure en plus des griffes. |
| 5 | **Forme Prédatrice Totale** (capstone) | Actif *(long)* | 3 | Transformation temporaire quasi-bestiale : bonus majeurs offensifs/défensifs. *Contrepartie : l'apparence devient irréversiblement plus inhumaine à chaque usage prolongé — à gérer avec le MJ.* |

### Branche 3 — Mutation Corporelle

| Tier | Nœud | Type | Coût | Effet |
|---|---|---|---|---|
| 1 | Peau Résiliente | Passif | 1 | Résistance légère aux radiations, mutation cutanée superficielle et visible (teinte de peau changée). |
| 2 | Métabolisme Radique | Passif | 1 | Peut se nourrir partiellement de sources faiblement radioactives en cas de disette. *Contrepartie : dépendance mineure — sans dose de `dose_stabilisante` périodique, effets de sevrage.* |
| 3 | Excroissance Utile | Passif | 2 | Développe un membre/organe mutant mineur (vision nocturne, membre préhensile, etc. — au choix du joueur avec validation MJ). |
| 4 | Adaptation Extrême | Passif | 2 | Résistance significative aux radiations et poisons. *Contrepartie : malus social cumulatif mineur, mutation de plus en plus visible.* |
| 5 | **Symbiose Totale avec le Sel** (capstone) | Hybride | 3 | Quasi-immunité aux radiations. *Contrepartie : apparence définitivement et fortement altérée — sommet assumé de la spécialisation mutation.* |

---

## 6. Bourse de la Douleur — Les Collecteurs *(arbre caché transversal)*

**Type** : Caché transversal *(accessible sans lien à une cité d'origine — condition : affiliation/dette/réputation avec la Bourse)* · **Classe associée** : complément de Beau Parleur (Barde) · **Attribut** : Charisme / Constitution · **Branches** : Traque de la Dette · Application de la Sentence · **Nœuds** : 10
**Monnaie** : cet arbre ne coûte plus de points de compétence — il se débloque avec de la **Faveur** (mesure de l'aide apportée par le PJ à la Bourse/sa cité), sur la même échelle numérique (1/1/2/2/3) mais distribuée par le MJ selon les actions en jeu plutôt que par montée de niveau.

### Branche 1 — Traque de la Dette

| Tier | Nœud | Type | Coût (Faveur) | Effet |
|---|---|---|---|---|
| 1 | Registre en Tête | Passif | 1 | Accès facilité aux informations du Registre sur les dettes d'une cible. |
| 2 | Œil du Collecteur | Passif | 1 | Repère instantanément les signes de richesse ou d'actifs dissimulés d'une cible. |
| 3 | Menace Calculée | Actif *(court)* | 2 | Intimidation ciblée basée sur la dette réelle de la cible — effet renforcé si la dette est énorme. |
| 4 | Réseau d'Indics | Passif | 2 | Accès à des informateurs locaux dans n'importe quelle cité pour localiser un débiteur en fuite. |
| 5 | **Sentence Inscrite** (capstone) | Actif | 3 | Marque une cible comme "débiteur prioritaire" au Registre : bonus permanent contre elle, visible par tout autre Collecteur. |

### Branche 2 — Application de la Sentence

| Tier | Nœud | Type | Coût (Faveur) | Effet |
|---|---|---|---|---|
| 1 | Saisie Rapide | Actif *(court)* | 1 | Confisque un objet/arme à une cible désarmée ou vaincue, sans résistance. |
| 2 | Poigne du Contrat | Passif | 1 | Bonus aux tests de contrainte physique (immobiliser, entraver un débiteur). |
| 3 | Garantie Corporelle | Passif | 2 | Quand un débiteur ne peut payer, une contrepartie physique (travail forcé, gage) peut être exigée immédiatement. |
| 4 | Escorte de la Bourse | Actif *(long)* | 2 | Appelle un renfort mineur (autre Collecteur) dans une cité où la Bourse est influente. |
| 5 | **Dette de Sang** (capstone) | Actif | 3 | En dernier recours, convertit une dette impayée en obligation de service direct envers le porteur — effet narratif fort, à manier avec prudence par le MJ. |

---

## 7. Discipline du Souffle — Analogue Moine

**Type** : Commun · **Attribut** : Dextérité / Constitution · **Branches** : Corps Inébranlable · Souffle Maîtrisé · **Nœuds** : 16 (8 par branche, 28 points pour tout vider)
**Particularité** : le seul arbre du roster qui ne dépend d'aucune ressource externe (ni drogue, ni greffe, ni foi, ni mutation) — uniquement l'entraînement du corps et de l'esprit.

### Branche 1 — Corps Inébranlable

| Tier | Nœud | Type | Coût | Prérequis | Effet |
|---|---|---|---|---|---|
| 1 | Poings Disciplinés | Passif | 1 | — | Les frappes à mains nues sont fiables et comptent comme une arme naturelle correcte, sans besoin d'arme. |
| 2 | Esquive Instinctive | Passif | 1 | Poings Disciplinés | Bonus d'esquive tant qu'aucune armure lourde n'est portée. |
| 2 | Frappe Enchaînée | Actif *(court)* | 1 | Poings Disciplinés | Après avoir touché, effectue immédiatement une seconde frappe à mains nues (dégâts réduits). *Contrepartie légère : -1 à la Défense pendant le tour où elle est utilisée (on s'expose en enchaînant).* |
| 3 | Percée Fluide | Actif *(court)* | 2 | Esquive Instinctive ou Frappe Enchaînée | Se déplace à travers/autour des ennemis sans provoquer d'attaque d'opportunité pour atteindre une cible. |
| 3 | Callosités d'Acier | Passif | 2 | Esquive Instinctive ou Frappe Enchaînée | Résistance mineure aux dégâts contondants/tranchants (mains et corps endurcis par l'entraînement). |
| 4 | Riposte Foudroyante | Passif | 2 | Percée Fluide ou Callosités d'Acier | Une fois par tour, riposte automatiquement contre un ennemi qui rate une attaque de mêlée contre le Moine. |
| 4 | Concentration de Combat | Actif *(long)* | 2 | Percée Fluide ou Callosités d'Acier | Pendant plusieurs tours, chaque frappe à mains nues bénéficie d'un léger avantage (focus absolu). |
| 5 | **Le Point de Rupture** (capstone) | Actif *(long)* | 3 | Riposte Foudroyante et Concentration de Combat | Une série de frappes ciblées désactive temporairement un membre ou désarme la cible. *Contrepartie sévère : inflige 2 niveaux d'Exténuation (concentration extrême).* |

### Branche 2 — Souffle Maîtrisé

| Tier | Nœud | Type | Coût | Prérequis | Effet |
|---|---|---|---|---|---|
| 1 | Apnée Contrôlée | Passif | 1 | — | Peut retenir sa respiration bien plus longtemps que la normale (zones toxiques, irradiées, immersion). |
| 2 | Calme Intérieur | Passif | 1 | Apnée Contrôlée | Résistance à la peur, à la panique et aux effets mentaux mineurs. |
| 2 | Souffle Purifiant | Actif *(court)* | 1 | Apnée Contrôlée | Filtre une partie d'un poison ou d'un gaz inhalé juste après exposition, réduisant l'effet. *Contrepartie légère : exige le silence total et une pleine action — inutilisable discrètement en plein assaut (-1 à l'initiative du tour suivant, le temps de retrouver son rythme).* |
| 3 | Méditation de Combat | Passif | 2 | Calme Intérieur ou Souffle Purifiant | Récupère un peu d'endurance entre deux échanges, une fois par combat, hors action. |
| 3 | Voix Posée | Passif | 2 | Calme Intérieur ou Souffle Purifiant | Résiste à l'intimidation et aux effets de terreur ; difficile à déstabiliser verbalement. |
| 4 | Résistance Radique par le Souffle | Passif | 2 | Méditation de Combat ou Voix Posée | Réduction significative des effets de radiation, par un contrôle respiratoire extrême — alternative non-technologique, non-chimique aux résistances des autres arbres. |
| 4 | Sérénité Absolue | Actif *(long)* | 2 | Méditation de Combat ou Voix Posée | Immunité temporaire à la peur et au contrôle mental, pour soi et un allié proche. |
| 5 | **Le Souffle Éternel** (capstone) | Actif *(long)* | 3 | Résistance Radique par le Souffle et Sérénité Absolue | Suspend quasiment tous ses besoins vitaux pendant plusieurs tours : résistance presque totale aux poisons/gaz/radiations, insensibilité à la douleur. *Contrepartie sévère : inflige 2 niveaux d'Exténuation une fois l'effet terminé — le corps paie le prix de cette suspension.* |

---

## 8. Le Serment — Analogue Paladin (profane)

> ⚠️ **Statut : brouillon non validé.** Cet arbre n'est pas encore confirmé comme faisant officiellement partie du roster — à traiter comme une proposition tant que le MJ ne l'a pas validée.

**Type** : Commun (provisoire) · **Attribut** : Force / Charisme · **Branches** : Protection Jurée · Jugement Personnel · **Nœuds** : 16 (8 par branche, 28 points pour tout vider)
**Ressource propre** : *Détermination*, se régénère en agissant conformément au Serment (protéger la personne/cause à laquelle le personnage est lié) ; peut s'affaiblir ou se bloquer si le MJ juge que le Serment est trahi ou compromis — un vrai levier de jeu de rôle, distinct de la Ferveur d'Ordre du Moteur qui repose sur la foi collective plutôt que sur un vœu personnel.

### Branche 1 — Protection Jurée

| Tier | Nœud | Type | Coût | Prérequis | Effet |
|---|---|---|---|---|---|
| 1 | Vœu Gravé | Passif | 1 | — | Établit le Serment (à qui/quoi il est lié) ; débloque l'accès à la Détermination. |
| 2 | Rempart du Serment | Actif *(court, coûte Détermination)* | 1 | Vœu Gravé | S'interpose et absorbe une partie des dégâts destinés à la personne/cause protégée. |
| 2 | Endurance de la Promesse | Passif | 1 | Vœu Gravé | Résistance mineure aux dégâts tant que l'objet du Serment est à portée de vue. *Contrepartie légère : -1 à tous les jets sociaux envers quiconque menace ouvertement l'objet du Serment (animosité difficile à cacher).* |
| 3 | Aura du Serment | Passif | 2 | Rempart du Serment ou Endurance de la Promesse | Les alliés proches de l'objet du Serment gagnent un bonus de défense mineur. |
| 3 | Aucun Pas en Arrière | Passif | 2 | Rempart du Serment ou Endurance de la Promesse | Avantage aux jets de résistance contre le fait d'être repoussé ou contraint de reculer/fuir. |
| 4 | Aigle Gardien | Actif *(long, coûte Détermination)* | 2 | Aura du Serment ou Aucun Pas en Arrière | Intercepte, une fois par repos long, une attaque destinée à quiconque est sous la protection du Serment, même à distance modérée. |
| 4 | Conviction Inébranlable | Passif | 2 | Aura du Serment ou Aucun Pas en Arrière | Résistance à la peur et au contrôle mental tant que le Serment n'est pas compromis. |
| 5 | **Le Dernier Rempart** (capstone) | Actif *(long)* | 3 | Aigle Gardien et Conviction Inébranlable | Pendant plusieurs tours, devient la cible prioritaire de tous les ennemis proches et gagne une résistance majeure aux dégâts, protégeant totalement l'objet du Serment. *Contrepartie sévère : inflige 2 niveaux d'Exténuation.* |

### Branche 2 — Jugement Personnel

| Tier | Nœud | Type | Coût | Prérequis | Effet |
|---|---|---|---|---|---|
| 1 | Œil du Jugement | Passif | 1 | — | Identifie instantanément qui représente une menace directe pour l'objet du Serment. |
| 2 | Frappe du Serment | Actif *(court, coûte Détermination)* | 1 | Œil du Jugement | Dégâts bonus contre une cible ayant menacé ou attaqué l'objet du Serment. |
| 2 | Colère Contenue | Passif | 1 | Œil du Jugement | Bonus d'attaque après avoir vu l'objet du Serment blessé. *Contrepartie légère : -1 à la Sagesse effective pendant ce combat contre la cible responsable — la colère brouille le discernement.* |
| 3 | Marque du Parjure | Actif *(court)* | 2 | Frappe du Serment ou Colère Contenue | Désigne un ennemi comme "parjure" : les alliés gagnent un avantage à l'attaquer. |
| 3 | Poursuite Implacable | Passif | 2 | Frappe du Serment ou Colère Contenue | Aucune pénalité de mouvement en poursuivant une cible marquée. |
| 4 | Jugement Amplifié | Actif *(court, coûte Détermination)* | 2 | Marque du Parjure ou Poursuite Implacable | Une frappe consacrée par la Détermination inflige des dégâts majorés à une cible marquée. |
| 4 | Détermination Renouvelée | Passif | 2 | Marque du Parjure ou Poursuite Implacable | Régénère plus vite la Détermination après avoir protégé activement l'objet du Serment en combat. |
| 5 | **Le Jugement Final** (capstone) | Actif *(long)* | 3 | Jugement Amplifié et Détermination Renouvelée | Libère toute sa Détermination en un assaut dévastateur contre celui qui a le plus menacé son Serment. *Contrepartie sévère : inflige 2 niveaux d'Exténuation.* |

---

## 9. Combat Rapproché — Analogue Guerrier (mêlée)

**Type** : Commun · **Attribut** : Force / Constitution · **Branches** : Mêlée Brutale · Close-Quarters · **Nœuds** : 16 (8 par branche, 28 points pour tout vider)
**Différenciation** : pur maître d'arme — dégâts bruts et exécutions, sans rage (Furie des Ruines), sans mitigation (Défense), sans foi (Ordre du Moteur).

### Branche 1 — Mêlée Brutale

| Tier | Nœud | Type | Coût | Prérequis | Effet |
|---|---|---|---|---|---|
| 1 | Frappe Assurée | Passif | 1 | — | +1 dégât fiable avec les armes de mêlée. |
| 2 | Enchaînement | Actif *(court)* | 1 | Frappe Assurée | Après un coup réussi, chance d'attaque bonus immédiate. *Contrepartie légère : -1 à la Défense pendant le tour (on se découvre en enchaînant).* |
| 2 | Poigne Ferme | Passif | 1 | Frappe Assurée | Avantage pour ne pas se faire désarmer. |
| 3 | Coup Puissant | Actif *(court)* | 2 | Enchaînement ou Poigne Ferme | Sacrifice de précision pour un gros bonus de dégâts sur une attaque. |
| 3 | Sens du Combat | Passif | 2 | Enchaînement ou Poigne Ferme | Avantage à repérer le point faible d'un adversaire après l'avoir touché une première fois. |
| 4 | Frappe Décisive | Passif | 2 | Coup Puissant ou Sens du Combat | Chance de coup critique augmentée avec les armes de mêlée. |
| 4 | Acharnement | Actif *(long)* | 2 | Coup Puissant ou Sens du Combat | Enchaîne deux grosses attaques d'affilée sur la même cible. |
| 5 | **Le Coup qui Tue** (capstone) | Actif *(long)* | 3 | Frappe Décisive et Acharnement | Attaque unique visant à achever une cible déjà affaiblie : dégâts maximisés, quasi-garantis. *Contrepartie sévère : inflige 2 niveaux d'Exténuation.* |

### Branche 2 — Close-Quarters

| Tier | Nœud | Type | Coût | Prérequis | Effet |
|---|---|---|---|---|---|
| 1 | Garde Rapprochée | Passif | 1 | — | Bonus de défense contre les attaques au contact rapproché. |
| 2 | Percée | Actif *(court)* | 1 | Garde Rapprochée | Traverse la ligne ennemie pour atteindre une cible derrière, sans provoquer d'attaque d'opportunité. *Contrepartie légère : -1 à la Défense au tour suivant (on s'expose en traversant les lignes).* |
| 2 | Déséquilibre | Passif | 1 | Garde Rapprochée | Une attaque réussie a une chance de faire trébucher la cible. |
| 3 | Corps à Corps Étouffant | Passif | 2 | Percée ou Déséquilibre | Avantage contre les cibles adjacentes multiples en mêlée serrée. |
| 3 | Réaction Vive | Passif | 2 | Percée ou Déséquilibre | Attaque d'opportunité automatique si un ennemi tente de fuir le contact rapproché. |
| 4 | Maîtrise du Terrain | Passif | 2 | Corps à Corps Étouffant ou Réaction Vive | Aucune pénalité en terrain encombré/exigu. |
| 4 | Tourbillon | Actif *(long)* | 2 | Corps à Corps Étouffant ou Réaction Vive | Attaque tous les ennemis adjacents en un seul mouvement. |
| 5 | **Le Cœur de la Mêlée** (capstone) | Actif *(long)* | 3 | Maîtrise du Terrain et Tourbillon | Devient temporairement quasi increvable au contact direct, enchaînant les attaques contre tous les adversaires proches. *Contrepartie sévère : inflige 2 niveaux d'Exténuation.* |

---

## 10. Arsenal Vivant — Analogue Artificier (armement lourd)

> Nouvel archétype 5e introduit dans le roster : l'Artificier, jusque-là absent. Remplace l'ancien Combat à Distance — la branche Précision est partie chez Pisteur des Sables.

**Type** : Commun · **Attribut** : Force / Dextérité · **Branches** : Frappe Lourde (armes à un coup) · Rafale Continue (armes automatiques) · **Nœuds** : 16 (8 par branche, 28 points pour tout vider)

### Branche 1 — Frappe Lourde *(rail-gun, bazooka, lance-roquettes)*

| Tier | Nœud | Type | Coût | Prérequis | Effet |
|---|---|---|---|---|---|
| 1 | Calibrage Précis | Passif | 1 | — | Dégâts fiables accrus avec les armes à un coup lourdes. |
| 2 | Chargeur Rapide | Passif | 1 | Calibrage Précis | Réduit le temps de rechargement d'une arme lourde. |
| 2 | Tir Perforant | Actif *(court)* | 1 | Calibrage Précis | Ignore une part significative de l'armure/couverture de la cible. *Contrepartie légère : -1 à l'Initiative au tour suivant (recul et bruit assourdissant désorientent brièvement).* |
| 3 | Visée Assistée | Passif | 2 | Chargeur Rapide ou Tir Perforant | Avantage contre les cibles immobiles ou de grande taille (véhicules, machines). |
| 3 | Détonation Contrôlée | Actif *(court)* | 2 | Chargeur Rapide ou Tir Perforant | Un tir crée une zone d'effet réduite (éclats/onde de choc). |
| 4 | Refroidissement d'Urgence | Passif | 2 | Visée Assistée ou Détonation Contrôlée | Évite la surchauffe/l'enrayement même après plusieurs tirs lourds consécutifs. |
| 4 | Tir de Rupture | Actif *(long)* | 2 | Visée Assistée ou Détonation Contrôlée | Un tir massif inflige des dégâts bonus et renverse/déstabilise la cible. |
| 5 | **Le Poids du Jugement** (capstone) | Actif *(long)* | 3 | Refroidissement d'Urgence et Tir de Rupture | Un tir dévastateur capable de démembrer une structure ou un véhicule léger. *Contrepartie sévère : inflige 2 niveaux d'Exténuation.* |

### Branche 2 — Rafale Continue *(mitrailleuses, SMG)*

| Tier | Nœud | Type | Coût | Prérequis | Effet |
|---|---|---|---|---|---|
| 1 | Doigt sur la Gâchette | Passif | 1 | — | Dégâts fiables accrus avec les armes automatiques légères. |
| 2 | Arrosage Contrôlé | Actif *(court)* | 1 | Doigt sur la Gâchette | Tire en rafale sur une zone, touchant plusieurs cibles proches à dégâts réduits. *Contrepartie légère : -1 à la Discrétion pendant et après l'utilisation (bruit et lumière du tir en rafale).* |
| 2 | Munitions Optimisées | Passif | 1 | Doigt sur la Gâchette | Consomme moins de munitions par rafale. |
| 3 | Suppression Continue | Actif *(court)* | 2 | Arrosage Contrôlé ou Munitions Optimisées | Une cible sous le feu continu subit un désavantage à ses actions offensives le tour suivant. |
| 3 | Refroidissement Amélioré | Passif | 2 | Arrosage Contrôlé ou Munitions Optimisées | Réduit fortement les risques d'enrayement/surchauffe en tir prolongé. |
| 4 | Barrage Mobile | Actif *(long)* | 2 | Suppression Continue ou Refroidissement Amélioré | Se déplace tout en maintenant un tir de suppression sur une zone. |
| 4 | Cadence Explosive | Passif | 2 | Suppression Continue ou Refroidissement Amélioré | Chance de dégâts critiques accrue avec les armes automatiques. |
| 5 | **Rideau de Feu** (capstone) | Actif *(long)* | 3 | Barrage Mobile et Cadence Explosive | Déluge de tir automatique sur une large zone, touchant tous les ennemis proches à dégâts significatifs. *Contrepartie sévère : inflige 2 niveaux d'Exténuation.* |

---

## 11. Défense — Analogue Guerrier (tank)

> La branche Protection du Groupe est retirée de cet arbre : son concept rejoint Le Serment (Paladin profane), qui protège une personne/cause désignée. Défense reste focalisée sur la survie personnelle pure.

**Type** : Commun · **Attribut** : Constitution / Force · **Branches** : Résilience · Blindage · **Nœuds** : 16 (8 par branche, 28 points pour tout vider)

### Branche 1 — Résilience

| Tier | Nœud | Type | Coût | Prérequis | Effet |
|---|---|---|---|---|---|
| 1 | Cuir Épais | Passif | 1 | — | Réduction mineure de tous les dégâts physiques subis. |
| 2 | Encaissement | Passif | 1 | Cuir Épais | Moins affecté par les effets de déséquilibre/étourdissement. |
| 2 | Second Souffle | Actif *(court)* | 1 | Cuir Épais | Récupère un peu de PV en pleine garde défensive. *Contrepartie légère : -1 à l'Initiative au tour suivant (on reprend son souffle, plus lent à réagir).* |
| 3 | Inébranlable | Passif | 2 | Encaissement ou Second Souffle | Avantage aux jets pour résister à être renversé, repoussé ou étourdi. |
| 3 | Ignorer la Douleur | Passif | 2 | Encaissement ou Second Souffle | Aucune pénalité de dégâts sous la moitié des PV maximum. |
| 4 | Mur de Chair | Passif | 2 | Inébranlable ou Ignorer la Douleur | Résistance significative contre une seule cible désignée en combat. |
| 4 | Régénération de Combat | Actif *(long)* | 2 | Inébranlable ou Ignorer la Douleur | Récupère des PV significatifs en pleine bataille. |
| 5 | **Rempart Inébranlable** (capstone) | Actif *(long)* | 3 | Mur de Chair et Régénération de Combat | Pendant plusieurs tours, quasi insensible aux dégâts d'une seule source, ne peut être mis à terre par un seul adversaire. *Contrepartie sévère : inflige 2 niveaux d'Exténuation.* |

### Branche 2 — Blindage

| Tier | Nœud | Type | Coût | Prérequis | Effet |
|---|---|---|---|---|---|
| 1 | Port d'Armure Optimisé | Passif | 1 | — | Aucune pénalité de mobilité liée aux armures lourdes. |
| 2 | Bouclier Réactif | Passif | 1 | Port d'Armure Optimisé | Bonus de défense contre la première attaque de chaque combat. |
| 2 | Parade Ferme | Actif *(court)* | 1 | Port d'Armure Optimisé | Bloque totalement une attaque. *Contrepartie légère : légère ouverture au tour suivant (-1 à la Défense).* |
| 3 | Renforcement Tactique | Passif | 2 | Bouclier Réactif ou Parade Ferme | Bonus de défense supplémentaire tant que le porteur reste immobile/en formation. |
| 3 | Contre-Attaque Blindée | Actif *(court)* | 2 | Bouclier Réactif ou Parade Ferme | Après avoir bloqué une attaque, riposte immédiatement. |
| 4 | Armure Vivante | Passif | 2 | Renforcement Tactique ou Contre-Attaque Blindée | L'armure encaisse une partie des dégâts sans jamais se dégrader. |
| 4 | Position Imprenable | Actif *(long)* | 2 | Renforcement Tactique ou Contre-Attaque Blindée | Devient impossible à déplacer ou contourner pendant plusieurs tours. |
| 5 | **L'Inamovible** (capstone) | Actif *(long)* | 3 | Armure Vivante et Position Imprenable | Devient quasiment impossible à tuer ou déplacer pendant plusieurs tours, absorbant l'essentiel des dégâts d'une source unique. *Contrepartie sévère : inflige 2 niveaux d'Exténuation.* |

---

## 12. Médecine — Analogue Clerc (scientifique)

> Le Clerc rejoint cet arbre : Médecine devient l'équivalent officiel du Clerc, en version scientifique plutôt que rituelle (qui reste chez Ordre du Moteur en tant que Paladin pur). La résurrection de Médecine est une prouesse chirurgicale et matérielle — jamais un rite.

**Type** : Commun · **Attribut** : Intelligence / Sagesse · **Branches** : Soins de Terrain · Chirurgie & Pharmacologie · **Nœuds** : 16 (8 par branche, 28 points pour tout vider)

### Branche 1 — Soins de Terrain

| Tier | Nœud | Type | Coût | Prérequis | Effet |
|---|---|---|---|---|---|
| 1 | Premiers Secours | Passif | 1 | — | Stabilise automatiquement un allié à l'agonie à proximité, une fois par combat. |
| 2 | Triage Rapide | Actif *(court)* | 1 | Premiers Secours | Soigne rapidement un allié légèrement blessé, sans matériel lourd. *Contrepartie légère : -1 à la Discrétion pendant le soin (concentration visible, vulnérable).* |
| 2 | Diagnostic Rapide | Passif | 1 | Premiers Secours | Identifie instantanément la nature d'une blessure, maladie ou intoxication. |
| 3 | Sang-Froid Clinique | Passif | 2 | Triage Rapide ou Diagnostic Rapide | Aucun désavantage à soigner sous le feu ennemi. |
| 3 | Antidote Express | Actif *(court)* | 2 | Triage Rapide ou Diagnostic Rapide | Neutralise un poison ou une toxine en cours d'effet chez un allié. |
| 4 | Chirurgie de Fortune | Actif *(long)* | 2 | Sang-Froid Clinique ou Antidote Express | Stabilise et soigne significativement un allié gravement blessé en plein combat. |
| 4 | Endurance Clinique | Passif | 2 | Sang-Froid Clinique ou Antidote Express | Les soins prodigués sont plus efficaces si le porteur est resté indemne durant le combat. |
| 5 | **Miracle Clinique** (capstone) | Actif *(long)* | 3 | Chirurgie de Fortune et Endurance Clinique | Ramène un allié inconscient à un état stable et fonctionnel presque instantanément, même en situation critique. *Contrepartie sévère : inflige 2 niveaux d'Exténuation.* |

### Branche 2 — Chirurgie & Pharmacologie

| Tier | Nœud | Type | Coût | Prérequis | Effet |
|---|---|---|---|---|---|
| 1 | Pharmacopée de Base | Passif | 1 | — | Fabrique/prépare des remèdes de base efficaces avec des ressources limitées. |
| 2 | Main Stable | Passif | 1 | Pharmacopée de Base | Bonus aux interventions chirurgicales complexes. |
| 2 | Cocktail Thérapeutique | Actif *(court)* | 1 | Pharmacopée de Base | Injecte un mélange qui soigne et stabilise sur la durée. *Contrepartie légère : -1 à la Constitution effective pendant quelques heures après usage (le corps encaisse le mélange).* |
| 3 | Anesthésie Contrôlée | Actif *(court)* | 2 | Main Stable ou Cocktail Thérapeutique | Insensibilise une cible à la douleur, réduisant certains effets de choc. |
| 3 | Savoir-Faire des Blouses Blanches | Passif | 2 | Main Stable ou Cocktail Thérapeutique | Bonus significatif à toute opération nécessitant un équipement médical avancé (greffes, implants). |
| 4 | Greffe d'Urgence | Actif *(long)* | 2 | Anesthésie Contrôlée ou Savoir-Faire des Blouses Blanches | Répare un membre/organe gravement endommagé en pleine intervention. |
| 4 | Stock Personnel | Passif | 2 | Anesthésie Contrôlée ou Savoir-Faire des Blouses Blanches | Conserve toujours une réserve de fournitures médicales de base, même après une longue expédition. |
| 5 | **Résurrection de Fortune** (capstone) | Actif *(usage limité par un noyau REBOOT)* | 3 | Greffe d'Urgence et Stock Personnel | Ramène un allié récemment décédé à la vie. Nécessite un **noyau REBOOT** — organe symbiote extrêmement coûteux, fabriqué et vendu uniquement par la Cité Médicale - Les Blouses Blanches — implanté chirurgicalement dans un corps encore frais, puis activé par l'injection d'une substance spécifique. Fonctionne **une seule fois** : le noyau est détruit après usage, réussi ou non. *Contrepartie sévère : l'opération inflige 2 niveaux d'Exténuation au chirurgien, sans compter le coût et la rareté du noyau lui-même. Distinct du Serment/Ordre du Moteur : ici, intervention chirurgicale solitaire et matérielle — jamais un rite collectif.* |

---

## 13. Technologie — Analogue Magicien/Artificier (séculier)

**Type** : Commun · **Attribut** : Intelligence / Dextérité · **Branches** : Mécanique & Fabrication · Électronique & IA · **Nœuds** : 16 (8 par branche, 28 points pour tout vider)
**Différenciation** : ingénierie utilitaire séculière — hacking, réparation, fabrication — distincte de l'Arsenal Vivant (spécialiste de combat) et d'Ordre du Moteur (ingénierie rituelle liée à la foi).

### Branche 1 — Mécanique & Fabrication

| Tier | Nœud | Type | Coût | Prérequis | Effet |
|---|---|---|---|---|---|
| 1 | Bricolage Efficace | Passif | 1 | — | Répare rapidement un équipement/véhicule endommagé avec des moyens limités. |
| 2 | Pièces de Récup | Passif | 1 | Bricolage Efficace | Fabrique des pièces de remplacement fonctionnelles à partir de matériaux de récupération. |
| 2 | Réparation en Urgence | Actif *(court)* | 1 | Bricolage Efficace | Répare en plein combat un équipement/véhicule allié endommagé. *Contrepartie légère : -1 à la Discrétion pendant la réparation (bruit d'outils, étincelles visibles).* |
| 3 | Ingénierie Robuste | Passif | 2 | Pièces de Récup ou Réparation en Urgence | Les équipements/véhicules réparés par le porteur tombent moins souvent en panne par la suite. |
| 3 | Modification Improvisée | Actif *(long)* | 2 | Pièces de Récup ou Réparation en Urgence | Bricole une amélioration temporaire significative sur une arme ou un véhicule. |
| 4 | Maître Mécanicien | Passif | 2 | Ingénierie Robuste ou Modification Improvisée | Répare des dégâts bien plus importants en une seule intervention. |
| 4 | Fabrication Express | Actif *(long)* | 2 | Ingénierie Robuste ou Modification Improvisée | Fabrique un objet/outil utile à partir de presque rien en quelques minutes. |
| 5 | **Le Grand Redémarrage** (capstone) | Actif *(long)* | 3 | Maître Mécanicien et Fabrication Express | Relance et répare intégralement une machine ou un véhicule complexe donné pour mort. *Contrepartie sévère : inflige 2 niveaux d'Exténuation.* |

### Branche 2 — Électronique & IA

| Tier | Nœud | Type | Coût | Prérequis | Effet |
|---|---|---|---|---|---|
| 1 | Lecture de Systèmes | Passif | 1 | — | Comprend rapidement le fonctionnement d'un système électronique inconnu. |
| 2 | Piratage Basique | Actif *(court)* | 1 | Lecture de Systèmes | Contourne une sécurité électronique simple (serrure, terminal). *Contrepartie légère : -1 à la Discrétion pendant l'opération (risque de log d'une tentative suspecte).* |
| 2 | Diagnostic Réseau | Passif | 1 | Lecture de Systèmes | Repère les failles/vulnérabilités d'un système connecté. |
| 3 | Contrôle à Distance | Actif *(court)* | 2 | Piratage Basique ou Diagnostic Réseau | Prend temporairement le contrôle d'une machine/drone simple. |
| 3 | Pare-Feu Personnel | Passif | 2 | Piratage Basique ou Diagnostic Réseau | Résistance aux tentatives de piratage/sabotage électronique visant le porteur ou son équipement. |
| 4 | Maître du Réseau | Passif | 2 | Contrôle à Distance ou Pare-Feu Personnel | Accès facilité aux systèmes du Registre et aux réseaux de cité. |
| 4 | Sabotage Silencieux | Actif *(long)* | 2 | Contrôle à Distance ou Pare-Feu Personnel | Désactive discrètement un système électronique complexe sans déclencher d'alerte. |
| 5 | **L'Esprit dans la Machine** (capstone) | Actif *(long)* | 3 | Maître du Réseau et Sabotage Silencieux | Prend le contrôle total d'un système complexe (véhicule, installation, réseau de sécurité) pendant plusieurs tours. *Contrepartie sévère : inflige 2 niveaux d'Exténuation.* |

---

## 14. Toile de Velours — Analogue Barde

> Nouveau nom pour l'ancien Beau Parleur, pour bien marquer que sa dimension n'est jamais martiale : manipulation, intrigue, séduction, négociation.

**Type** : Commun · **Attribut** : Charisme / Sagesse · **Branches** : Manipulation & Séduction · Négociation & Intrigue · **Nœuds** : 16 (8 par branche, 28 points pour tout vider)

### Branche 1 — Manipulation & Séduction

| Tier | Nœud | Type | Coût | Prérequis | Effet |
|---|---|---|---|---|---|
| 1 | Charme Naturel | Passif | 1 | — | Bonus aux premières impressions et à la séduction. |
| 2 | Mensonge Convaincant | Passif | 1 | Charme Naturel | Bonus pour mentir de façon crédible sous pression. *Contrepartie légère : si le mensonge est un jour découvert, -1 à tous les jets sociaux futurs avec cette personne (réputation durablement entachée).* |
| 2 | Suggestion Habile | Actif *(court)* | 1 | Charme Naturel | Pousse subtilement une cible à reconsidérer une décision immédiate. |
| 3 | Lecture des Désirs | Passif | 2 | Mensonge Convaincant ou Suggestion Habile | Identifie ce qu'une cible désire ou craint le plus après une conversation. |
| 3 | Faux-Semblant | Actif *(court)* | 2 | Mensonge Convaincant ou Suggestion Habile | Se fait passer pour quelqu'un d'autre de façon crédible sur une courte durée. |
| 4 | Emprise Sociale | Passif | 2 | Lecture des Désirs ou Faux-Semblant | Bonus significatif sur toute cible déjà charmée/manipulée avec succès précédemment. |
| 4 | Marionnettiste | Actif *(long)* | 2 | Lecture des Désirs ou Faux-Semblant | Pousse une cible à accomplir une action mineure en sa faveur, sans qu'elle réalise avoir été manipulée. |
| 5 | **Le Cœur dans la Main** (capstone) | Actif *(long)* | 3 | Emprise Sociale et Marionnettiste | Une cible devient temporairement convaincue que le porteur est son plus proche allié, quelles que soient les preuves du contraire. *Contrepartie sévère : inflige 2 niveaux d'Exténuation (manipulation mentalement épuisante).* |

### Branche 2 — Négociation & Intrigue

| Tier | Nœud | Type | Coût | Prérequis | Effet |
|---|---|---|---|---|---|
| 1 | Sens du Marché | Passif | 1 | — | Obtient systématiquement de meilleures conditions dans les échanges et négociations. |
| 2 | Menace Voilée | Actif *(court)* | 1 | Sens du Marché | Intimide sans jamais formuler une menace explicite, difficile à retourner contre soi. *Contrepartie légère : ceux qui comprennent la menace s'en souviennent et se méfient durablement (-1 aux interactions futures avec eux).* |
| 2 | Oreille Fine | Passif | 1 | Sens du Marché | Capte les rumeurs et informations utiles bien plus vite dans une cité. |
| 3 | Réseau d'Alliés | Passif | 2 | Menace Voilée ou Oreille Fine | Dispose toujours d'un contact utile dans n'importe quelle cité visitée au moins une fois. |
| 3 | Double Discours | Actif *(court)* | 2 | Menace Voilée ou Oreille Fine | Tient deux discours contradictoires à deux interlocuteurs différents sans se faire prendre, le temps d'une scène. |
| 4 | Maître du Jeu | Passif | 2 | Réseau d'Alliés ou Double Discours | Avantage dans toute négociation à plusieurs parties. |
| 4 | Coup Monté | Actif *(long)* | 2 | Réseau d'Alliés ou Double Discours | Orchestre un évènement social qui retourne discrètement une situation en sa faveur. |
| 5 | **L'Ombre derrière le Trône** (capstone) | Actif *(long)* | 3 | Maître du Jeu et Coup Monté | Influence durablement une décision politique/économique majeure d'une cité, sans jamais y être directement associé. *Contrepartie sévère : inflige 2 niveaux d'Exténuation.* |

---

## Reste à produire

- **10 arbres de cité** : passer de 5 à 8-12 nœuds, ajouter une 2e branche où pertinent, et basculer sur la monnaie Faveur (plus de coût en points de compétence). Vérification des recoupements thématiques avec les arbres communs au fil de la rédaction, pas en bloc à la fin.
- **Écho du Réseau** et **classes magiques** : restent gelés, non traités tant que le MJ ne le demande pas explicitement.
- **Attributs** : passe de rééquilibrage globale à faire une fois les arbres de cité chiffrés (cf. journal §8) — 14 arbres communs sont maintenant posés, largement de quoi faire un vrai tally.

---

## Corrections appliquées suite à tes réponses

- **Budget** : les 4 arbres à 2 branches (Pisteur des Sables, Ombres du Bassin, Furie des Ruines, Ordre du Moteur) sont passés de 9 à 8 nœuds par branche (30→28 points) — un nœud Tier 1 retiré par branche, sa fonction absorbée ailleurs ou déclarée acquise par défaut. Symbiose Sauvage garde son gabarit à 3 branches (diversité voulue).
- **Contreparties** : courbe unifiée appliquée — légère et chiffrée en Tier 2, sévère (Exténuation D&D 5e) sur les capstones actifs. Tous les arbres communs en ont désormais au moins une, sauf Le Corps Parfait (capstone passif, pas d'usage ponctuel à épuiser).
- **Cooldowns** : court = 2 tours, long = 4 tours (voir Règles transversales en tête de document).
- **Compagnons** : pools réduits à "2 compétences choisies sur 4" partout ; bestiaire explicitement rattaché à la FAUNE DU BASSIN du lore.
- **Bourse de la Douleur** : ne coûte plus de points de compétence — financée en Faveur (aide apportée à la cité/faction), même échelle numérique.
- **Ordre du Moteur** : la Ferveur est maintenant une ressource de base de l'arbre (accessible dès le premier nœud, peu importe la branche) plutôt qu'un nœud dédié à débloquer — ça a aussi permis d'absorber le nœud Tier 1 en trop dans les deux branches.
- **Synergies inter-arbres et Paliers de Maîtrise** : confirmés pour une passe globale à la fin, une fois les 16+ arbres rédigés — pas d'action avant ça.
- **Relecture Tier 3/4** : quelques nœuds musclés au passage (Pas du Fouisseur et Réflexes de Rue donnent maintenant un vrai bénéfice de combat, pas seulement un jet de compétence ; Ossature Renforcée couvre aussi le renversement/agrippement).

## Moine et Paladin profane — ce que j'avais en tête

**Moine** : "Discipline du Souffle" — le seul archétype martial qui n'utilise ni drogues, ni greffes, ni foi, ni mutation : juste un corps entraîné et un contrôle mental extrême (respiration, méditation), ancré dans la culture des arènes/gladiateurs (Cité du Divertissement). Deux branches possibles : *Corps Inébranlable* (combat à mains nues, encaissement par le contrôle plutôt que la résistance brute) et *Souffle Maîtrisé* (retenir son souffle en zone toxique/irradiée, résister à la peur/contrôle mental, une forme de soin méditatif sans aide extérieure). Son intérêt : c'est le seul arbre qui n'a besoin d'aucune ressource externe pour fonctionner — un contraste net avec tout le reste du roster.

**Paladin profane** : un guerrier lié par un serment personnel (à sa ville, à sa "famille" de convoi, à une vengeance) plutôt qu'au culte du Moteur — mécaniquement proche de la branche Ingénierie du Culte d'Ordre du Moteur (aura, frappe consacrée) mais sans Ferveur, alimenté par une "Détermination" qui faiblit si le serment est trahi ou compromis (un vrai levier de jeu de rôle pour le MJ). Se recoupe pas mal avec ce que Défense pourrait déjà couvrir dans sa branche Protection du Groupe — d'où l'option de le fondre là plutôt que d'en faire un arbre à part entière.

Dis-moi si tu veux qu'on en fasse deux arbres complets, qu'on les intègre comme branches dans des arbres existants (Moine reste seul, Paladin profane rejoint Défense), ou qu'on les range définitivement au clou.

## Point resté sans réponse

Question 28 n'a pas été tranchée : la "classe 5e de référence" affichée sur chaque arbre (ex. "Roublard" pour Ombres du Bassin) doit-elle être visible aux joueurs comme repère, ou rester interne pour ne pas donner l'impression de jouer du D&D reskin ?
