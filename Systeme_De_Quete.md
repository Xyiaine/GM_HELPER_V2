# Système de Quêtes — GM Helper

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
