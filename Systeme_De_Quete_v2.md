# Système de Quêtes — GM Helper (v2)

Ce document reprend intégralement la v1 et y ajoute une section 5
(extensions proposées) et une section 6 (exemple de mapping concret
avec Campagne_v3, la quête d'ouverture "La Course du Sel"). Rien n'a
été retiré de la v1 ; les ajouts sont pensés pour rester rétrocompatibles
— une quête simple, linéaire, sans amnésie ni menace persistante,
continue de fonctionner exactement comme avant.

Le système de quêtes de GM Helper est un moteur hybride conçu pour offrir à la fois un suivi classique (type "journal de quêtes" pour les joueurs) et une gestion scénaristique granulaire sous forme de graphe dynamique (type "arbre de décisions/événements" pour le MJ).

## 1. Modèle de Données Global (`Quest`)
La table centrale contient les métadonnées globales de l'aventure :
- **Informations générales** : Nom, description, notes privées du MJ (`gmNotes`), résumé pour les joueurs (`playerSummary`), image.
- **Paramètres de gameplay** : Type (principale, secondaire, faction, personnelle), difficulté, niveau recommandé, durée estimée.
- **Récompenses** : XP, or, et objets (`itemRewards`).
- **Statut et Progression** : État actuel (`not_started`, `active`, `completed`, `failed`, `abandoned`) et jauge de progression (0-100%).
- **Visibilité** : Gère ce que les joueurs peuvent voir sur leur propre interface (`secret`, `known`, `partial`).

## 2. Le Graphe Narratif (`QuestNode` & `QuestNodeConnection`)
Au cœur de l'outil pour le MJ se trouve le **QuestGraphEditor**, qui permet de modéliser l'aventure de façon non linéaire.

### Les Noeuds (`QuestNode`)
Chaque noeud représente une scène, une étape ou un événement distinct.
- **Types de noeuds** : 
  - `start` (départ)
  - `intermediate` (étape classique)
  - `convergence` (point de ralliement de plusieurs embranchements)
  - `end` (fin de quête, qui force une issue : succès, échec, abandon).
- **Contenu Narratif** : 
  - `sensoryText` : Description de l'environnement (visuel, bruit, odeur) destinée à l'immersion.
  - `mjDescription` : Notes secrètes pour le MJ (mécaniques, comportement des PNJ, indices cachés, pièges, jets à demander).
- **Intégration au "Spotlight"** : Depuis le graphe, le MJ peut d'un clic diffuser le `sensoryText` sous forme de bannière, ou l'image d'un PNJ/Lieu directement sur les écrans partagés des joueurs (Live Session).
- **Mécanique de Temps (Timer)** : Un noeud peut avoir un chronomètre intégré. À l'expiration du temps, le système peut basculer automatiquement vers un "noeud de conséquence" (`timeoutNodeId`), forçant l'action (ex: un plafond qui s'effondre, une garde qui arrive).
- **Progression** : Le MJ peut marquer un noeud comme "atteint" (`reached`), ce qui le colore en vert pour suivre où se trouve le groupe en temps réel, même dans une toile d'embranchements complexes.

### Les Connexions (`QuestNodeConnection`)
Elles relient les noeuds de manière directionnelle pour créer les différents chemins possibles.
- **Label** : Permet d'indiquer la condition de transition sur la flèche (ex: "Choix furtif", "Embuscade déclenchée").
- **Timeout Connection** : Une connexion spéciale qui indique le chemin pris par défaut si les joueurs mettent trop de temps à agir.

## 3. Les Objectifs Linéaires (`QuestObjective`)
En complément du graphe (qui sert surtout la narration du MJ), une quête dispose d'une checklist d'objectifs classiques (ex: "Trouver la clé", "Tuer le chef bandit").
- Ordonnés logiquement.
- Peuvent être marqués comme cachés (`isHidden`) jusqu'à leur découverte par les joueurs, ou comme facultatifs (`isOptional`).
- Statut individuel (`pending`, `completed`, `failed`).

## 4. Écosystème et Conséquences (Les Liens)
Une quête de GM Helper est profondément connectée au reste de votre monde via des tables de liaison :
- **Entités Liées** : `QuestNPCLink` (PNJ donneur de quête, allié, cible), `QuestLocationLink` (lieu de la quête), `QuestItemLink` (artefact clé).
- **Système de Villes (`QuestCityImpact`)** : L'issue d'une quête peut avoir un impact chiffré direct sur les paramètres d'une cité-état. Ex : terminer la quête X modifie la jauge `Wealth` (Richesse) de la ville de +15 et la jauge `Health` (Santé) de -10.
- **Dépendances (`QuestDependency`)** : Permet d'automatiser des campagnes. Une quête peut nécessiter qu'une autre soit terminée (`prerequisite`) ou déclencher automatiquement l'apparition d'une nouvelle quête à sa conclusion (`trigger`).

---

## 5. Extensions Proposées (v2)

Ces dix ajouts naissent directement de la confrontation du modèle v1
avec une quête d'ouverture dense (amnésie, menace persistante,
embranchements parallèles, narration sensorielle systématique). Chaque
ajout est optionnel et rétrocompatible : une quête simple peut ignorer
tous ces champs sans que rien ne casse.

### 5.1 — `QuestNode.detectionMechanic` (mécanique indice/jet)
Un objet optionnel attaché à un noeud qui contient un danger détectable :
```
detectionMechanic: {
  indiceText: string,        // signal discret, décrit avant tout jet
  advantageGranted: string,  // ce que gagne un joueur qui réagit sans jet
  jetSkill: string,          // compétence sollicitée si l'indice est manqué
  jetDifficulty: number,     // ou string selon votre système de règles
  jetFailureConsequence: string
}
```
Ça rend la mécanique visible et éditable dans l'outil plutôt que noyée
dans `mjDescription` — et ça permet, en Live Session, d'afficher
l'indice en bannière AVANT de demander le jet, dans le bon ordre.

### 5.2 — `QuestNode.pathGroup`
Un simple tag texte (ex: `"Alternative A"`, `"Alternative B"`) qui
permet au `QuestGraphEditor` de colorer ou regrouper visuellement tous
les noeuds d'une même branche parallèle, sans changer la logique des
connexions elles-mêmes.

### 5.3 — `QuestNode.displayCode`
Un champ texte court, distinct de l'id technique, pour préserver une
numérotation narrative lisible (`"0.d"`, `"2A.e"`, `"1.5.c"`). Affiché
dans l'éditeur de graphe et dans les exports, jamais utilisé comme clé
de base de données.

### 5.4 — `QuestNode.isOptional` + `QuestNode.pacingTag`
`isOptional` (booléen) existe déjà sur `QuestObjective` ; l'ajouter
aussi sur `QuestNode` permet de marquer des scènes comme "à sauter si
le rythme de la table s'y prête mieux sans elles" (ex: 3.e, l'ultime
apparition optionnelle du ver). `pacingTag` (enum libre : `climax`,
`respiration`, `transition`, `filler`) aide le MJ à visualiser d'un
coup d'œil la courbe de tension de tout le graphe.

### 5.5 — `QuestNodeReward` (nouvelle table de liaison)
```
QuestNodeReward: {
  nodeId: FK QuestNode,
  rewardType: enum (item, gold, xp, npcFavor, information),
  rewardValue: string/number,
  conditional: string  // ex: "si fouille réussie", "si négociation choisie"
}
```
Permet de distribuer du butin et des gains concrets à chaque étape,
plutôt qu'au seul palier de fin de quête sur `Quest.itemRewards`.

### 5.6 — `QuestThreatTracker` (nouvelle entité de premier niveau)
```
QuestThreatTracker: {
  id,
  questId: FK Quest,
  name: string,               // ex: "Le Ver des Sables"
  currentLevel: number,       // ex: 0 à 4, façon "horloge" narrative
  maxLevel: number,
  stateLabel: string,         // "dormant", "en approche", "en chasse", "attaque"
  description: string
}

QuestNodeThreatEffect: {
  nodeId: FK QuestNode,
  threatId: FK QuestThreatTracker,
  effect: enum (increment, decrement, trigger_attack, neutralize),
  effectValue: number
}
```
Modélise une menace qui traverse plusieurs noeuds et embranchements
indépendamment du chemin emprunté — le ver des sables peut être
référencé depuis 0.d, 2A.e, 2B.e et 3.e sans dupliquer sa logique dans
chaque `mjDescription`. Le niveau de menace peut s'afficher comme une
jauge visible du MJ seul, à la façon d'une horloge de tension.

### 5.7 — `QuestFactionProgress` (nouvelle table)
```
QuestFactionProgress: {
  questId: FK Quest,
  factionName: string,        // ex: "Les Loups de Sel"
  progressValue: number,      // 0-100, position relative dans la course
  lastUpdatedNodeId: FK QuestNode
}
```
Permet de suivre la progression de convois/factions rivales qui
courent en parallèle des PJ, pour que "et si les PJ perdent ?" soit
calculable plutôt que purement improvisé.

### 5.8 — `QuestCharacterState` (nouvelle table, granularité par PJ)
```
QuestCharacterState: {
  questId: FK Quest,
  characterId: FK Character,
  stateKey: string,           // ex: "memory_own_name", "memory_secret_mission"
  stateValue: boolean/string,
  updatedAt: timestamp
}
```
Indispensable pour toute quête à mémoire fragmentée ou à information
asymétrique : chaque PJ peut avoir son propre état de progression sur
des éléments qui ne sont pas partagés par toute la table. Peut aussi
servir de base à une visibilité de noeud personnalisée par personnage
(un PJ voit une bannière que les autres ne voient pas encore).

### 5.9 — `QuestNode.requiredSkillCategory`
Un tag simple (`Perception`, `Force`, `Charisme`, `Bricolage`,
`Pilotage`, `Survie`, etc.) sur chaque noeud ou `detectionMechanic` qui
sollicite un jet. Permet à l'outil de générer un rapide audit
statistique du graphe ("cette quête sollicite la Perception huit fois
et le Charisme une seule fois") pour repérer les déséquilibres avant de
jouer plutôt qu'en le découvrant à table.

### 5.10 — `QuestNode.sensoryVisual` / `sensorySound` / `sensorySmell`
Trois champs optionnels qui viennent en complément (pas en
remplacement) de `sensoryText` :
```
sensoryVisual: string,
sensorySound: string,
sensorySmell: string
```
Quand ils sont renseignés, l'interface de Spotlight peut les diffuser
comme trois bannières successives plutôt qu'un bloc de texte unique —
et ça force, à l'écriture, la discipline des trois registres sensoriels
systématiques.

### 5.11 — Suivi de disposition PNJ inter-quêtes (hors périmètre strict du système de quêtes)
Un PNJ comme Mira (secourue dans une quête, potentiellement alliée ou
menace dans une quête ultérieure selon les choix des joueurs) a besoin
d'un état qui survit à la clôture de la quête où il apparaît. Ce n'est
pas vraiment un objet "quête" — je recommande une table séparée,
probablement au niveau de votre fiche PNJ globale plutôt que dans ce
système :
```
NPCDisposition: {
  npcId: FK NPC,
  dispositionValue: number,   // ex: -100 (hostile) à +100 (allié dévoué)
  lastChangedByQuestId: FK Quest,
  notes: string
}
```
`QuestNPCLink` continue de dire "Mira apparaît dans cette quête, en
tant que PNJ à secourir" ; `NPCDisposition` retient ce qu'il en est
sorti, pour que la quête suivante puisse la lire.

---

## 6. Exemple de Mapping — Campagne_v3, Étape 0 ("La Fuite")

Voici comment les quatre premiers noeuds de la quête d'ouverture
s'intègrent dans le modèle v2. Ceci illustre l'usage réel des
extensions ci-dessus sur du contenu déjà écrit.

```
Quest {
  name: "La Course du Sel",
  type: "principale",
  visibility: "partial",   // les joueurs voient qu'ils sont dans une course,
                           // pas ce qui s'est réellement passé
  playerSummary: "Un convoi de recrues fonce vers la Cité du
    Divertissement pour intégrer la Garde. Rien ne s'est
    passé comme prévu.",
  gmNotes: "Les PJ ont eux-mêmes déclenché l'explosion du Convoi 5
    (les Nostalgics) en ouvrant le feu sans raison connue. Amnésie
    rétrograde par vapeurs neurochimiques. Voir QuestThreatTracker
    'Ver des Sables' pour la menace qui les prend en chasse."
}

QuestThreatTracker {
  name: "Le Ver des Sables (bébé)",
  currentLevel: 0,
  maxLevel: 4,
  stateLabel: "dormant",
  description: "Enfant du Ver de Vitre de Nuke City. Ne creuse pas
    la roche ni le verre vitrifié. Réserver 2-3 apparitions
    directes maximum sur toute la quête."
}

QuestNode {
  displayCode: "0.a",
  type: "start",
  pacingTag: "climax",
  sensoryVisual: "Tableau de bord fêlé qui vibre, sable qui gicle
    sous les pneus, horizon qui tangue.",
  sensorySound: "Moteur hurlant, vent qui claque, sifflement aigu
    dans les oreilles.",
  sensorySmell: "Poudre brûlée, relent chimique sucré résiduel.",
  mjDescription: "Aucun PJ ne sait qui il est. Ne pas révéler
    qu'ils ont tiré les premiers.",
  reached: false
}

QuestNode {
  displayCode: "0.b",
  type: "intermediate",
  requiredSkillCategory: null,  // scène purement narrative, pas de jet
  mjDescription: "Le PJ à la tourelle tire encore, doigt crispé,
    sans savoir pourquoi. Premier dialogue à faire vivre."
}

QuestNode {
  displayCode: "0.d",
  type: "intermediate",
  detectionMechanic: {
    indiceText: "Crépitement de sable sur le plancher, choc sourd
      et rythmique remontant par les sièges.",
    advantageGranted: "Le PJ repère la menace avant le jet ;
      avantage sur la fuite qui suit.",
    jetSkill: "Perception",
    jetDifficulty: 12,
    jetFailureConsequence: "Le convoi est surpris, perd du temps,
      le Ver des Sables gagne un niveau sur son tracker."
  }
}

QuestNodeThreatEffect {
  nodeId: "0.d",
  threatId: "Ver des Sables (bébé)",
  effect: "increment",
  effectValue: 1
}

QuestNodeConnection {
  from: "0.a", to: "0.b", label: null
}
QuestNodeConnection {
  from: "0.c", to: "0.d", label: null
}
QuestNodeConnection {
  from: "0.d", to: "1.a", label: "Fuite immédiate"
}
QuestNodeConnection {
  from: "0.d", to: "0.e_fouille_epave", label: "Les PJ s'arrêtent
    pour fouiller l'épave (risqué)"
}

QuestNode {
  displayCode: "0.e_fouille_epave",
  type: "intermediate",
  isOptional: true,
  pacingTag: "respiration",
  mjDescription: "Fouille du Convoi 5. Fait apparaître Mira
    (voir QuestNPCLink) et déclenche PISTES D'ENQUÊTE ACTIVES."
}

QuestNodeReward {
  nodeId: "0.e_fouille_epave",
  rewardType: "item",
  rewardValue: "Flacon intact de précurseur neurochimique",
  conditional: "si fouille effectuée"
}
QuestNodeReward {
  nodeId: "0.e_fouille_epave",
  rewardType: "npcFavor",
  rewardValue: "Mira sauvée — alliée potentielle",
  conditional: "si fouille effectuée avant l'arrivée du ver"
}

QuestNodeThreatEffect {
  nodeId: "0.e_fouille_epave",
  threatId: "Ver des Sables (bébé)",
  effect: "increment",
  effectValue: 1,
  // chaque round passé sur place rapproche le ver — voir Campagne_v3
}

QuestNPCLink {
  npcId: "Mira",
  questId: "La Course du Sel",
  role: "à secourir / alliée potentielle",
  nodeId: "0.e_fouille_epave"
}

QuestCharacterState {
  characterId: "<chaque PJ>",
  stateKey: "memory_own_identity",
  stateValue: false,
  // mis à jour indépendamment pour chaque PJ au fil des jets de mémoire
}
```

Ce même schéma se répète pour les Étapes 1, 1.5, 2A/2B (avec
`pathGroup: "Alternative A"` / `"Alternative B"` sur leurs noeuds
respectifs, reconvergeant sur un noeud `type: "convergence"` avant
l'Étape 3), et 3. Une fois les dix ajouts de la section 5 en place
dans votre outil, l'intégralité de Campagne_v3 peut être saisie sans
perdre aucune des mécaniques qu'on a construites ensemble — l'indice
avant le jet, la menace persistante, les branches parallèles, la
mémoire asymétrique, et les récompenses par étape.
