# Système de Quêtes — GM Helper (v3.0 — 22 juillet 2026)

Ce document met à jour le système de quêtes de **GM Helper** pour refléter l'implémentation exacte du moteur en juillet 2026. Tout le cœur narratif initial et l'ensemble des extensions (v2/v3) sont désormais intégrés dans la base de données Prisma et dans l'éditeur de graphe interactif (`QuestGraphEditor.jsx`).

Le système de quêtes de GM Helper est un moteur hybride offrant à la fois un suivi synthétique pour les joueurs (journal de quêtes) et une gestion scénaristique granulaire sous forme de graphe dynamique pour le Maître du Jeu (MJ).

---

## 1. Modèle de Données Global (`Quest`)
La table centrale `Quest` contient les métadonnées globales de l'aventure :
- **Informations générales** : Nom, description, notes privées du MJ (`gmNotes`), résumé pour les joueurs (`playerSummary`), image (`imageUrl`).
- **Paramètres de gameplay** : Type (`main`, `secondary`, `faction`, `personal`), difficulté, niveau recommandé (`level`), durée estimée (`duration`).
- **Récompenses** : XP (`xpReward`), or (`goldReward`), et liste d'objets (`itemRewards`).
- **Statut et Progression** : État actuel (`not_started`, `active`, `completed`, `failed`, `abandoned`) et jauge de progression (0-100%).
- **Visibilité** : Gère ce que les joueurs peuvent voir sur leur propre interface (`secret`, `known`, `partial`).

---

## 2. Le Graphe Narratif (`QuestNode` & `QuestNodeConnection`)
Au cœur de l'outil pour le MJ se trouve le **QuestGraphEditor**, basé sur un composant visuel de graphe interactif ReactFlow.

### Les Nœuds (`QuestNode`)
Chaque nœud représente une scène, une étape ou un événement distinct.
- **Types de nœuds** : 
  - `start` (départ)
  - `intermediate` (étape classique)
  - `convergence` (point de ralliement de plusieurs embranchements)
  - `end` (fin de quête, avec issue : `success`, `failure`, `abandoned`).
- **Description Sensorielle Unifiée (`sensoryText`)** :
  - Champ de texte principal agrandi et centralisé : *"Description Sensorielle (Ce que voient les joueurs)"*.
  - Regroupe au même endroit tous les éléments d'immersion (visuels, sonores, odeurs, ambiance).
  - Évite la duplication d'information (les anciens sous-champs individuels sont consolidés dans ce champ unique).
- **Notes Scénaristiques (`mjDescription`)** : Notes secrètes pour le MJ (mécaniques, comportement des PNJ, indices cachés, pièges, jets).
- **Intégration au "Spotlight"** : Depuis l'éditeur de graphe, le MJ peut d'un clic diffuser le `sensoryText` sous forme de bannière, ou l'image d'un PNJ/Lieu directement sur les écrans partagés des joueurs et le Table Screen (`/table/:token`).
- **Mécanique de Temps (Timer)** : Un nœud peut être chronométré (`isTimed`, `timerDurationSeconds`, `timerVisibleToPlayers`). À l'expiration du décompte, le système bascule automatiquement vers le nœud de conséquence (`timeoutNodeId`), forçant l'action.
- **Progression** : Le MJ peut marquer un nœud comme atteint (`status: "reached"`), ce qui le colore en vert sur le graphe pour suivre l'avancée du groupe en temps réel.

### Les Connexions (`QuestNodeConnection`)
Relient les nœuds de manière directionnelle pour créer les différents chemins possibles.
- **Label** : Indique la condition de transition sur la flèche (ex: *"Choix furtif"*, *"Embuscade déclenchée"*).
- **Timeout Connection** : Connexion spéciale indiquant le chemin pris par défaut si les joueurs tardent trop à réagir.

---

## 3. Les Objectifs Linéaires (`QuestObjective`)
En complément du graphe (servant la narration du MJ), une quête dispose d'une checklist d'objectifs classiques :
- Ordonnés logiquement (`orderIndex`).
- Masquables (`isHidden`) jusqu'à leur découverte, ou optionnels (`isOptional`).
- Statut individuel (`pending`, `completed`, `failed`).

---

## 4. Écosystème et Conséquences (Les Liens)
Une quête est interconnectée avec le reste du monde via des tables de liaison :
- **Entités Liées** : `QuestNPCLink` (PNJ donneur de quête, allié, ennemi, neutre), `QuestLocationLink` (lieux clés), `QuestItemLink` (artefacts).
- **Système de Cités (`QuestCityImpact`)** : L'issue d'une quête applique automatiquement des modificateurs chiffrés sur les 7 paramètres d'une Cité-État (Santé, Richesse, Technologie, Nourriture, Bonheur, Armement, Carburant) et historise les changements dans `CityParameterHistory`.
- **Dépendances (`QuestDependency`)** : Gère les prérequis (`prerequisite`) et les déclenchements automatiques de nouvelles quêtes (`trigger`).

---

## 5. Extensions Implémentées (v3)

Les dix extensions de seconde génération sont désormais pleinement intégrées au schéma Prisma et à l'interface graphique :

### 5.1 — `QuestNode.detectionMechanic` (mécanique d'indice / jet)
Champs JSON structurés pour les dangers détectables (signal discret `indiceText`, avantage `advantageGranted`, compétence requise `jetSkill`, difficulté `jetDifficulty`, conséquence en cas d'échec `jetFailureConsequence`).

### 5.2 — `QuestNode.pathGroup`
Tag texte (`"Alternative A"`, `"Alternative B"`) permettant de colorer ou de regrouper visuellement les embranchements parallèles dans le graphe.

### 5.3 — `QuestNode.displayCode`
Code d'affichage court et lisible (`"0.a"`, `"2A.e"`, `"1.5.c"`) affiché sur le graphe pour le MJ.

### 5.4 — `QuestNode.isOptional` + `QuestNode.pacingTag`
- `isOptional` : Marque les scènes facultatives.
- `pacingTag` : Tag de rythme (`climax`, `respiration`, `transition`, `filler`) pour visualiser la courbe de tension.

### 5.5 — `QuestNodeReward`
Table de liaison permettant de distribuer du butin à des étapes spécifiques du graphe (`item`, `gold`, `xp`, `npcFavor`, `information`) avec condition éventuelle (`conditional`).

### 5.6 — `QuestThreatTracker` & `QuestNodeThreatEffect`
Modélise les menaces persistantes (ex: *"Le Ver des Sables"*). L'horloge de menace (`currentLevel` / `maxLevel`) progresse ou diminue selon les nœuds atteints via `QuestNodeThreatEffect`.

### 5.7 — `QuestFactionProgress`
Suivi de la progression (0-100%) des factions ou convois rivaux qui évoluent en parallèle des PJ.

### 5.8 — `QuestCharacterState`
Suivi d'état individuel par personnage (`stateKey`, `stateValue`), essentiel pour les quêtes à mémoire fragmentée, amnésie ou informations asymétriques.

### 5.9 — `QuestNode.requiredSkillCategory`
Indique la compétence principale sollicitée par la scène (ex: `Perception`, `Survie`, `Pilotage`).

### 5.10 — Consolidation de la Description Sensorielle
Dans l'interface `QuestGraphEditor.jsx`, la description sensorielle est présentée dans une zone de texte unique, spacieuse et ergonomique (`rows={8}`), évitant toute redondance visuelle tout en conservant la possibilité de diffuser au Spotlight en un clic.

---

## 6. Exemple Concret — Quête "La Course du Sel"

```json
{
  "quest": {
    "name": "La Course du Sel",
    "type": "main",
    "visibility": "partial",
    "playerSummary": "Un convoi de recrues fonce vers la Cité du Divertissement. La traversée du désert tourne au cauchemar."
  },
  "threatTracker": {
    "name": "Le Ver des Sables",
    "currentLevel": 0,
    "maxLevel": 4,
    "stateLabel": "dormant"
  },
  "nodes": [
    {
      "displayCode": "0.a",
      "nodeType": "start",
      "pacingTag": "climax",
      "sensoryText": "VISUEL : Tableau de bord fêlé qui vibre, sable giclant sous les pneus...\n\nBRUIT : Moteur hurlant, vent claquant...\n\nODEUR : Poudre brûlée, relent chimique sucré.",
      "mjDescription": "Les PJ émergent d'une amnésie suite aux vapeurs neurochimiques."
    },
    {
      "displayCode": "0.d",
      "nodeType": "intermediate",
      "detectionMechanic": "{\"indiceText\": \"Crépitement de sable...\", \"jetSkill\": \"Perception\", \"jetDifficulty\": 12}"
    }
  ]
}
```
