# ARCHITECTURE ET FONCTIONNEMENT GLOBAL — GM HELPER V2
**DOCUMENTATION TECHNIQUE ET FONCTIONNELLE EXHAUSTIVE**
*Référence complète d'architecture, back-end, front-end, base de données, modules et APIs*
*Dernière mise à jour : 31 Juillet 2026*

---

## TABLE DES MATIÈRES

1. [VISION GLOBALE ET ARCHITECTURE DE L'APPLICATION](#1-vision-globale-et-architecture-de-lapplication)
   - 1.1 Objectif Général
   - 1.2 Les 3 Interfaces (MJ, Joueur Mobile, Écran Table TV)
   - 1.3 Stack Technique Détaillée
   - 1.4 Structure Complète du Projet

2. [MODÈLE DE DONNÉES ET SCHÉMA PRISMA (DB) IN-DEPTH](#2-modèle-de-données-et-schéma-prisma-db-in-depth)
   - 2.1 Campagnes et Accès (`Campaign`, `CampaignMembership`)
   - 2.2 Système Spatio-Temporel : Cités et Lieux (`City`, `Location`, `CityParameterHistory`)
   - 2.3 Système de Quêtes et Graphe Narratif (`Quest`, `QuestNode`, `QuestObjective`, `QuestThreatTracker`, `QuestFactionProgress`, `QuestNPCProfile`)
   - 2.4 PNJ et Univers (`NPC`, `QuestNPCLink`, `QuestLocationLink`)
   - 2.5 Fiches PJ, Compétences et Objets (`Character`, `SkillTree`, `SkillNode`, `Item`)
   - 2.6 Convois et Véhicules (`Convoy`, `Vehicle`, `VehiclePart`)
   - 2.7 Combat et Rencontres (`Encounter`, `EncounterCombatant`)

3. [LE BACKEND EN PROFONDEUR (EXPRESS API & ENGINES)](#3-le-backend-en-profondeur-express-api--engines)
   - 3.1 Architecture et Middleware (`auth.js`, `validate.js`)
   - 3.2 Spécification Détaillée des Routes API REST (`/api/v1/gm/...`)
     - 3.2.1 Quêtes et Graphes (`quests.js`)
     - 3.2.2 PNJ et Filtrages (`npcs.js`)
     - 3.2.3 Cités et Paramètres (`cities.js`)
     - 3.2.4 Carte du Monde (`worldMap.js`)
     - 3.2.5 Combats (`encounters.js`)
     - 3.2.6 Convois et Véhicules (`convoys.js`, `vehicles.js`)
   - 3.3 Les Moteurs et Utilitaires Backend
     - 3.3.1 Moteur d'Évaluation Booléenne (`conditionEvaluator.js`)
     - 3.3.2 Auditeur d'Intégrité du Graphe (`integrityVerifier.js`)
     - 3.3.3 Convertisseur de Règles D&D 5e / Générique (`ruleConverter.js`)
     - 3.3.4 Générateur Procédural de Convois (`convoyGenerator.js`)
     - 3.3.5 Script de Placement GPS des Cités (`update_city_gps.js`)

4. [LE FRONTEND EN PROFONDEUR (REACT & ZUSTAND)](#4-le-frontend-en-profondeur-react--zustand)
   - 4.1 Architecture du Store d'État Global (`gmStore.js`)
   - 4.2 Client HTTP et Intercepteurs JWT (`api.js`)
   - 4.3 Composants et Onglets MJ en Détail
     - 4.3.1 Quest Manager (`QuestManager.jsx`)
     - 4.3.2 Éditeur de Graphe Narratif (`QuestGraphEditor.jsx` & `QuestDetail.jsx`)
     - 4.3.3 Tableau de Bord de Session (`SessionDashboard.jsx`)
     - 4.3.4 Carte du Monde Interactive et Moteur Canvas (`MapManager.jsx`)
     - 4.3.5 Base de Données PNJ et Filtrages (`NpcsList.jsx`)
     - 4.3.6 Gestionnaire des Cités-États (`CitiesManager.jsx`)
     - 4.3.7 Tracker de Combat et d'Initiative (`EncounterTracker.jsx`)
     - 4.3.8 Convois et Véhicules (`ConvoysManager.jsx`, `VehiclesManager.jsx`)
     - 4.3.9 Arbres de Compétences et Fiches PJ (`CharacterSheet.jsx`)

5. [INTERFACES JOUEUR MOBILE ET ÉCRAN DE TABLE (TV)](#5-interfaces-joueur-mobile-et-écran-de-table-tv)
   - 5.1 Interface Joueur Mobile (`PlayerApp.js`)
   - 5.2 Lanceur de Dés Serveur et Journal des Jets
   - 5.3 Vue Écran de Table Public (`TableScreenView.jsx`)

6. [TEMPS RÉEL ET SYNCHRONISATION WEBSOCKET (SOCKET.IO)](#6-temps-réel-et-synchronisation-websocket-socketio)
   - 6.1 Architecture du Serveur WebSocket
   - 6.2 Répertoire Complet des Événements et Payloads

7. [CARTOGRAPHIE GPS ET LORE NARRATIVE DES 10 CITÉS-ÉTATS](#7-cartographie-gps-et-lore-narrative-des-10-cités-états)
   - 7.1 Formule de Projection GPS vers Canvas
   - 7.2 Le Compendia des 10 Cités-États

8. [GUIDE DE MAINTENANCE, BUILDS ET TESTS](#8-guide-de-maintenance-builds-et-tests)

---

## 1. VISION GLOBALE ET ARCHITECTURE DE L'APPLICATION

### 1.1 Objectif Général
**GM Helper V2** est une application web fullstack d'assistance pour Maître du Jeu (MJ) et Joueurs, dédiée à la conduite de campagnes de Jeu de Rôle (JDR) sur table dans l'univers post-apocalyptique *Chroniques de l'Apocalypse / La Course du Sel*.

L'application permet d'administrer en temps réel :
1. **La Narration Non-Linéaire** via des arbres de quêtes orientés (graphes de nœuds), avec embranchements conditionnels, minuteurs automatiques, réserve de scènes et vérification d'intégrité.
2. **La Géopolitique et l'Économie des Cités-États** via un suivi dynamique des 7 paramètres (Santé, Richesse, Technologie, Nourriture, Bonheur, Armement, Carburant).
3. **La Géographie Réelle Post-Apocalyptique** via une carte interactive Canvas HTML5 positionnant les 10 Cités-États méditerranéennes selon leurs coordonnées GPS exactes du lore (Genève, Turin, Rome, Marseille, Camargue, Alger, Gibraltar, Malte, Alexandrie, Atlantique Ouest). *(Corrigé le 21 septembre 2026 : le texte citait « Athènes » ; la Cité des Métaux & Recyclage est à Malte, voir le tableau du § 7.)*
4. **La Vie du Monde (PNJ & Factions)** via une base de données filtrable par ville et par faction, avec profils vocaux, tics physiques et cartes d'inspection.
5. **Les Voyages et Traversées de Désert** via un générateur procédural de convois simulant des trajets sur 100+ biomes, avec gestion de véhicules modulaires et fatigue d'équipage.
6. **Les Combats et Épreuves** via un tracker d'initiative temps réel synchronisé et un lanceur de dés validé côté serveur.

---

### 1.2 Les 3 Interfaces Distinctes

```
                               ┌──────────────────────────────────────────┐
                               │       MAÎTRE DU JEU (GM DESKTOP)         │
                               │  /gm/campaigns/:id/quests, map, npcs...  │
                               └────────────────────┬─────────────────────┘
                                                    │
                                                    │ API REST (HTTP) + Socket.IO
                                                    ▼
┌───────────────────────────────────────────────────┴───────────────────────────────────────────────────┐
│                                   SERVEUR BACKEND NODE.JS / PRISMA DB                                 │
└──────────────────┬─────────────────────────────────────────────────────────────────┬──────────────────┘
                   │                                                                 │
                   ▼                                                                 ▼
┌──────────────────────────────────────────┐                       ┌───────────────────────────────────┐
│         INTERFACE JOUEUR (MOBILE)        │                       │       VUE ÉCRAN TABLE / TV        │
│       /player/campaigns/:id/sheet        │                       │           /table/:token           │
└──────────────────────────────────────────┘                       └───────────────────────────────────┘
```

1. **INTERFACE MJ (`/gm/...`)** :
   - Optimisée pour ordinateur de bureau ou tablette.
   - Donne un accès complet à la création, la modification et le contrôle direct de toutes les entités de la campagne.
   - Contient l'éditeur de graphe ReactFlow, le tableau de bord de session, la carte du monde, le gestionnaire de PNJ, les cités, les convois et les combats.
2. **INTERFACE JOUEUR MOBILE (`/player/...`)** :
   - Interface web responsive spécialement taillée pour les smartphones.
   - Permet au joueur de consulter et modifier (si autorisé) sa fiche de personnage, dépenser ses points dans les 16 arbres de compétences, lancer ses dés (avec calcul automatique des modificateurs par le serveur) et suivre le tour d'initiative pendant les combats.
3. **VUE ÉCRAN TABLE / TV (`/table/:token`)** :
   - Accessible via une URL publique sécurisée par un token unique de session.
   - Conçue pour être projetée sur un téléviseur ou un moniteur central posé sur la table de jeu.
   - Projette en temps réel les bannières narratifs **Spotlight**, les illustrations de lieux, les fiches de PNJ révélés, les horloges de menace et le tracker d'initiative en direct, **sans jamais divulguer les notes secrètes (`gmSecrets`) du MJ**.

---

### 1.3 Stack Technique Détaillée

* **Frontend** :
  - **Framework** : React 18 avec Vite comme bundler rapide.
  - **Routing** : React Router v6 pour la navigation SPA.
  - **Gestion d'État** : Zustand (`client/src/store/gmStore.js`), offrant un store réactif global sans boilerplate Redux.
  - **Graphes Narratifs** : ReactFlow (`@xyflow/react`) pour le rendu et le drag-and-drop des nœuds de quête.
  - **Rendu Cartographique** : HTML5 Canvas réactif avec gestion mathématique des transformations (pan, zoom, conversion coordonnées monde ↔ canvas).
  - **UI & Icônes** : Lucide React, CSS Vanilla avec variables CSS globales (`var(--color-primary)`, etc.).
  - **WebSocket Client** : `socket.io-client`.

* **Backend** :
  - **Runtime** : Node.js (v18+).
  - **Framework Web** : Express.js.
  - **ORM & Base de données** : Prisma ORM 6.9 couplé à SQLite (`server/prisma/dev.db`).
  - **Validation de schémas** : Zod pour la validation stricte des corps de requêtes HTTP.
  - **Sécurité** : JWT (JSON Web Tokens) et Bcrypt pour l'authentification et l'autorisation par rôle.
  - **WebSocket Serveur** : `socket.io` intégré au serveur HTTP Express.

---

### 1.4 Structure Complète du Projet

```
GM_Helper/
├── client/                          # Application React (Vite)
│   ├── public/                      # Assets statiques (cartes, images)
│   ├── src/
│   │   ├── components/
│   │   │   ├── gm/                  # Composants réservés au MJ
│   │   │   │   ├── QuestManager.jsx      # Liste des quêtes, tri, dates, suppression >= 10 nœuds
│   │   │   │   ├── QuestGraphEditor.jsx # Canvas ReactFlow pour le graphe de quête
│   │   │   │   ├── QuestDetail.jsx      # Vue détaillée et tiroir SessionDashboard
│   │   │   │   ├── SessionDashboard.jsx # Tiroir de contrôle de session live
│   │   │   │   ├── MapManager.jsx       # Carte du Monde Canvas HTML5 & projection GPS
│   │   │   │   ├── NpcsList.jsx         # Base PNJ avec filtres Ville & Faction
│   │   │   │   ├── CitiesManager.jsx    # Suivi des 7 paramètres des Cités-États
│   │   │   │   ├── EncounterTracker.jsx # Combat et initiative temps réel
│   │   │   │   ├── ConvoysManager.jsx   # Générateur et suivi des convois
│   │   │   │   ├── VehiclesManager.jsx  # Véhicules modulaires et équipages
│   │   │   │   ├── ThreatClockWidget.jsx# Horloges circulaires de menace
│   │   │   │   ├── NpcVoiceProfileCard.jsx # Cartes vocales PNJ
│   │   │   │   └── FactionTracker.jsx   # Jauges de réputation des factions
│   │   │   ├── player/              # Composants Interface Joueur Smartphone
│   │   │   │   ├── PlayerApp.jsx        # Conteneur principal joueur
│   │   │   │   ├── CharacterSheet.jsx   # Fiche de personnage interactive
│   │   │   │   └── SkillTrees.jsx       # 16 Arbres de compétences hybrides
│   │   │   ├── table/               # Composants Vue Écran Table / TV
│   │   │   │   └── TableScreenView.jsx  # Écran public d'affichage table
│   │   │   └── ui/                  # Composants UI génériques (Modal, Tabs)
│   │   ├── store/
│   │   │   └── gmStore.js           # Store global Zustand
│   │   ├── utils/
│   │   │   ├── api.js               # Client HTTP Axios avec JWT
│   │   │   └── formatters.js        # Utilitaires de formatage de données
│   │   ├── App.jsx                  # Configuration des routes React Router
│   │   └── main.jsx                 # Point d'entrée React Vite
├── server/                          # Serveur API Node.js / Express
│   ├── prisma/
│   │   ├── schema.prisma            # Schéma global de la base de données SQLite
│   │   ├── seed.js                  # Seed de base Prisma
│   │   └── dev.db                   # Fichier SQLite
│   ├── src/
│   │   ├── middleware/              # Middlewares d'authentification et validation
│   │   │   ├── auth.js              # Token JWT & vérification des accès campagne
│   │   │   └── validate.js          # Middleware de validation Zod
│   │   ├── routes/gm/               # Endpoints REST du Maître du Jeu
│   │   │   ├── quests.js            # Quêtes, instanciation, audit, convertisseur
│   │   │   ├── cities.js            # Cités, paramètres, historiques
│   │   │   ├── npcs.js              # PNJ & jointures hiérarchiques de lieux
│   │   │   ├── worldMap.js          # Carte du Monde & marqueurs
│   │   │   ├── encounters.js        # Combats & initiative
│   │   │   ├── convoys.js           # Convois & biomes
│   │   │   ├── vehicles.js          # Véhicules modulaires
│   │   │   └── characters.js        # Personnages PJ
│   │   ├── services/                # Logique métier lourde
│   │   │   └── convoyGenerator.js   # Moteur de génération de voyage
│   │   ├── utils/                   # Moteurs utilitaires
│   │   │   ├── conditionEvaluator.js# Évaluateur d'expressions conditionnelles
│   │   │   ├── integrityVerifier.js # Auditeur d'intégrité de graphe
│   │   │   └── ruleConverter.js     # Convertisseur de règles D&D 5e
│   │   ├── validators/              # Schémas Zod
│   │   │   └── schemas.js
│   │   └── index.js                 # Serveur HTTP Express & Socket.IO
│   ├── update_city_gps.js           # Script de positionnement GPS exact des cités
│   ├── update_main_quest.js         # Script de création du graphe de quête principal
│   └── seed_npcs.js                 # Script de génération des 270 PNJ du lore
└── architecture et fonctionnement.md # Ce document de référence
```

---

## 2. MODÈLE DE DONNÉES ET SCHÉMA PRISMA (DB) IN-DEPTH

Le schéma SQLite (`server/prisma/schema.prisma`) définit la structure de la base de données. Voici la description détaillée des entités principales :

### 2.1 Campagnes et Accès
* **`Campaign`** :
  - `id` (String CUID), `name` (String), `description` (String?), `createdAt`, `updatedAt`.
  - Relations : `memberships`, `locations`, `npcs`, `quests`, `characters`, `encounters`, `convoys`, `vehicles`, `factions`.
* **`CampaignMembership`** :
  - `id`, `campaignId`, `userId`, `role` (`"GM"` | `"PLAYER"`).
  - Permet à un même utilisateur d'être MJ sur une campagne et Joueur sur une autre.

---

### 2.2 Système Spatio-Temporel : Cités et Lieux
* **`Location`** :
  - `id`, `campaignId`, `parentLocationId` (String?), `name` (String), `type` (`"continent"` | `"region"` | `"city"` | `"district"` | `"building"` | `"room"`), `description`.
  - Relation récursive : `parentLocation` / `childLocations` permettant la modélisation à 5 niveaux de profondeur.
* **`City`** :
  - `id`, `locationId` (String unique, liée à `Location`).
  - **7 Paramètres Dynamiques (échelle 0 à 100)** : `health`, `wealth`, `technology`, `food`, `happiness`, `armament`, `fuel` (valeurs par défaut : 50).
  - **Paramètres Personnalisés** : `customParameters` (JSON String).
  - **Positionnement Carte** : `mapX` (Float?), `mapY` (Float?) pour les coordonnées sur le canvas.
  - **Territoire & Faction** : `factionColor` (Hex String), `territoryData` (JSON Vertices).
* **`CityParameterHistory`** :
  - `id`, `cityId`, `parameter` (String), `oldValue` (Int), `newValue` (Int), `cause` (String), `createdAt`.
  - Conserve l'historique complet des variations de paramètres des cités lors des événements de campagne.

---

### 2.3 Système de Quêtes et Graphe Narratif
* **`Quest`** :
  - `id`, `campaignId`, `name`, `description`, `type` (`"main"` | `"side"`), `status` (`"active"` | `"completed"` | `"failed"`), `progress` (Int), `visibility` (`"secret"` | `"public"`), `createdAt`, `updatedAt`.
  - `mechanicNotes` (JSON String) : Stocke la réserve de scènes (`scenePool`), le calibrage de table, les questions de débriefing.
  - Relations : `nodes`, `objectives`, `threatTrackers`, `factionProgress`, `npcProfiles`, `locationLinks`, `npcLinks`, `cityImpacts`.
* **`QuestNode`** :
  - `id`, `questId`, `nodeId` (String unique dans le graphe), `title`, `type` (`"narrative"` | `"challenge"` | `"choice"` | `"combat"` | `"outcome"`).
  - `status` (`"not_reached"` | `"active"` | `"completed"` | `"failed"`).
  - `gmSecrets` (Text) : Contenu strictly réservé au MJ (coulisses, révélations).
  - `tableSummary` (Text) : Résumé public projeté aux joueurs.
  - `sensoryDescription` (Text) : Description atmosphérique (vue, ouïe, odorat).
  - `positionX` (Float), `positionY` (Float) : Position dans l'éditeur ReactFlow.
  - `connections` (JSON String) : Tableau des arêtes sortantes avec conditions de déclenchement.
* **`QuestThreatTracker`** :
  - `id`, `questId`, `name`, `currentValue` (Int), `maxValue` (Int), `thresholds` (JSON String), `impactOnThreshold` (String).
  - Horloges circulaires de menace avancées par le MJ pendant la session.
* **`QuestFactionProgress`** :
  - `id`, `questId`, `factionName`, `reputation` (Int -100 à +100), `status` (`"hostile"` | `"unfriendly"` | `"neutral"` | `"friendly"` | `"allied"`).
* **`QuestNPCProfile`** :
  - `id`, `questId`, `npcId`, `voiceCard` (String), `physicalTics` (String), `behaviorUnderPressure` (String).
  - Fournit au MJ la fiche d'incarnation rapide du PNJ lors des scènes de dialogue.

---

### 2.4 PNJ et Univers
* **`NPC`** :
  - `id`, `campaignId`, `locationId` (String?), `name`, `race`, `role`, `personality`, `description`, `isFavorite` (Boolean), `isActive` (Boolean).
  - Relation `location` : Jointure vers la table `Location` (permettant d'accéder au bâtiment et à la cité parent).

---

### 2.5 Fiches PJ, Compétences et Objets
* **`Character`** :
  - `id`, `campaignId`, `userId` (String?), `name`, `classData` (JSON String), `level` (Int), `hpCurrent`, `hpMax`, `stats` (JSON String: STR, DEX, CON, INT, WIS, CHA), `notes`.
* **`SkillTree` & `SkillNode`** :
  - 16 Arbres de compétences modulaires avec déblocage conditionnel de nœuds de talents.
* **`Item`** :
  - `id`, `campaignId`, `name`, `type` (`"weapon"` | `"armor"` | `"consumable"` | `"tool"` | `"valuable"`), `rarity`, `weight`, `value`, `properties` (JSON).

---

### 2.6 Convois et Véhicules
* **`Convoy`** :
  - `id`, `campaignId`, `originCityId`, `destinationCityId`, `status` (`"preparing"` | `"en_route"` | `"arrived"` | `"ambushed"`), `progressPercent` (Float), `currentBiome` (String).
* **`Vehicle` & `VehiclePart`** :
  - `Vehicle` : `id`, `campaignId`, `name`, `type` (`"buggy"` | `"truck"` | `"rig"` | `"scout"`), `hullHp`, `hullHpMax`, `fuelCurrent`, `fuelMax`.
  - `VehiclePart` : Pièces modulaires (Moteur, Blindage, Armes, Réservoirs) influençant la vitesse, la consommation et le combat.

---

### 2.7 Combat et Rencontres
* **`Encounter` & `EncounterCombatant`** :
  - `Encounter` : `id`, `campaignId`, `locationId` (String?), `name`, `status` (`"planned"` | `"active"` | `"completed"`), `currentRound` (Int), `activeCombatantIndex` (Int).
  - `EncounterCombatant` : `id`, `encounterId`, `name`, `type` (`"character"` | `"npc"` | `"monster"`), `initiative` (Int), `hpCurrent`, `hpMax`, `conditions` (JSON String).

---

## 3. LE BACKEND EN PROFONDEUR (EXPRESS API & ENGINES)

### 3.1 Architecture et Middleware

Les requêtes REST envoyées au serveur passent par une chaîne de middlewares de sécurité et de validation :

1. **`verifyToken`** (`server/src/middleware/auth.js`) :
   Vérifie la validité du JWT transmis dans l'en-tête `Authorization: Bearer <token>`.
2. **`requireCampaignAccess`** (`server/src/middleware/auth.js`) :
   S'assure que l'utilisateur connecté possède un enregistrement `CampaignMembership` pour la campagne demandée.
3. **`requireGM`** (`server/src/middleware/auth.js`) :
   Restreint l'accès des routes administratives d'écriture/modification aux utilisateurs disposant du rôle `"GM"`.
4. **`validate(schema)`** (`server/src/middleware/validate.js`) :
   Valide le corps de la requête HTTP (`req.body`) contre un schéma Zod avant d'exécuter le contrôleur.

---

### 3.2 Spécification Détaillée des Routes API REST (`/api/v1/gm/...`)

#### 3.2.1 Quêtes et Graphes (`server/src/routes/gm/quests.js`)

* **`GET /api/v1/gm/campaigns/:campaignId/quests`** :
  - *Description* : Retourne la liste des quêtes de la campagne.
  - *Payload de Réponse* :
    ```json
    {
      "quests": [
        {
          "id": "cm123...",
          "name": "La Course du Sel",
          "description": "Traversée du désert...",
          "status": "active",
          "progress": 45,
          "createdAt": "2026-07-31T17:39:00.000Z",
          "updatedAt": "2026-07-31T17:42:00.000Z",
          "locationLinks": [...],
          "npcLinks": [...],
          "_count": { "nodes": 43 }
        }
      ]
    }
    ```
* **`POST /:id/instantiate`** (BE-1) :
  - *Description* : Clone une quête modèle pour créer une instance vierge dédiée à une nouvelle table de jeu.
  - *Effets* : Duplique l'ensemble des nœuds en remettant `status = "not_reached"`, les horloges de menace à `0` et les objectifs à `"pending"`.
* **`POST /:id/reset-instance`** (BE-1) :
  - *Description* : Réinitialise l'instance courante de la quête active sans effacer la structure du graphe.
* **`POST /:id/evaluate-conditions`** (BE-4) :
  - *Description* : Évalue si les conditions de transition vers un nœud cible sont remplies.
* **`POST /:id/scene-pool/draw`** (BE-5) :
  - *Description* : Effectue un tirage aléatoire dans la réserve de scènes (`scenePool`).
* **`GET /:id/audit-integrity`** (BE-7) :
  - *Description* : Lance le vérificateur d'intégrité référentielle `integrityVerifier.js`.
* **`POST /:id/convert-rules`** (BE-10) :
  - *Description* : Convertit les tags de défis post-apocalyptiques en tests D&D 5e à l'aide de `ruleConverter.js`.
* **`DELETE /:id`** :
  - *Description* : Supprime définitivement la quête.
  - *Comportement Backend* : Annule les minuteurs automatiques en mémoire (`cancelNodeTimer(nodeId)`) et exécute la suppression en cascade Prisma sur les tables `QuestNode`, `QuestObjective`, `QuestThreatTracker`, `QuestFactionProgress`, `QuestNPCProfile`, `QuestNPCLink`, `QuestLocationLink`.

#### 3.2.2 PNJ et Filtrages (`server/src/routes/gm/npcs.js`)

* **`GET /api/v1/gm/campaigns/:campaignId/npcs`** :
  - *Description* : Retourne tous les PNJ de la campagne.
  - *Requête Prisma* : Inclut la jointure `location` avec sa propre sous-jointure `parentLocation` :
    ```javascript
    location: {
      select: {
        id: true,
        name: true,
        type: true,
        parentLocationId: true,
        parentLocation: { select: { id: true, name: true, type: true } }
      }
    }
    ```
    Cette structure permet au frontend d'identifier immédiatement à quelle **Cité-État** appartient le PNJ, même si son `locationId` pointe vers un bâtiment spécifique.

#### 3.2.3 Cités et Paramètres (`server/src/routes/gm/cities.js`)

* **`GET /api/v1/gm/campaigns/:campaignId/cities`** :
  - *Description* : Liste les Cités-États de la campagne et leurs 7 paramètres.
* **`POST /:id/adjust`** :
  - *Description* : Ajuste un paramètre d'une cité (ex: Nourriture +15) suite à une action de jeu et enregistre l'événement dans `CityParameterHistory`.

---

### 3.3 Les Moteurs et Utilitaires Backend

#### 3.3.1 Moteur d'Évaluation Booléenne (`server/src/utils/conditionEvaluator.js`)
Évalue des chaînes de conditions dynamiques du graphe de quête :
* Supporte les opérateurs logiques `&&`, `||`, `!`.
* Supporte les comparaisons `==`, `!=`, `>=`, `<=`, `>`, `<`, `contains`.
* Variables contextuelles supportées :
  - `threat.<threatId>` : Valeur courante d'une horloge de menace.
  - `relationship.<factionName>` : Niveau de réputation auprès d'une faction.
  - `route` : Identifiant du chemin emprunté par les joueurs.

#### 3.3.2 Auditeur d'Intégrité du Graphe (`server/src/utils/integrityVerifier.js`)
Parcourt la structure d'une quête et génère un rapport d'audit détaillé :
* **Nœuds orphelins** : Nœuds sans aucune connexion entrante (hors nœud de départ).
* **Impasses narratives** : Nœuds de non-fin sans connexion sortante.
* **Références rompues** : Liens pointant vers des `nodeId`, `npcId` ou `locationId` inexistants.

#### 3.3.3 Convertisseur de Règles D&D 5e / Générique (`server/src/utils/ruleConverter.js`)
Traduit automatiquement les énoncés de problèmes narratives en jets de compétences normalisés D&D 5e :
* `[OBSTACLE PHYSIQUE]` ➔ Jet de Force (Athlétisme) DD 14.
* `[DISCRÉTION / INFILTRATION]` ➔ Jet de Dextérité (Discrétion) DD 15.
* `[ANALYSE TECHNIQUE]` ➔ Jet d'Intelligence (Histoire / Arcanes) DD 13.

#### 3.3.4 Générateur Procédural de Convois (`server/src/services/convoyGenerator.js`)
Calcule et simule les traversées de désert :
* Génère des étapes d'itinéraire sur 100+ biomes (Désert de Sel, Ruines Cristallisées, Pipes de Pétrole, Canyons d'Acier).
* Tire des tables d'événements aléatoires (Pilleurs, Tempête de Sable, Panne Moteur, Découverte de Bunker).

#### 3.3.5 Script de Placement GPS des Cités (`server/update_city_gps.js`)
Convertit les coordonnées GPS réelles du lore méditerranéen en coordonnées pixel sur le canvas $2000 \times 1200$ :
$$\text{mapX} = \text{round}\left( \frac{\text{lon} - (-10.0)}{32.0 - (-10.0)} \times 2000 \right)$$
$$\text{mapY} = \text{round}\left( \frac{48.0 - \text{lat}}{48.0 - 30.0} \times 1200 \right)$$

---

## 4. LE FRONTEND EN PROFONDEUR (REACT & ZUSTAND)

### 4.1 Architecture du Store d'État Global (`client/src/store/gmStore.js`)
Le store Zustand centralise l'état réactif et l'ensemble des méthodes API du frontend :
- **Quêtes** : `quests`, `fetchQuests()`, `deleteQuest()`, `instantiateQuest()`, `resetQuestInstance()`, `auditQuestIntegrity()`, `convertRules()`.
- **PNJ** : `npcs`, `fetchNpcs()`, `createNpc()`.
- **Cités & Lieux** : `cities`, `fetchCities()`, `locations`, `fetchLocations()`.
- **Session & Live** : `spotlight`, `drawRandomEvent()`, `drawScenePool()`.

---

### 4.2 Composants et Onglets MJ en Détail

#### 4.3.1 Quest Manager (`client/src/components/gm/QuestManager.jsx`)
Composant d'administration et de sélection des quêtes de la campagne.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ QUEST MANAGER                                                  [ + New Quest ]         │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 📋 5 Quête(s) répertoriée(s)           [ 🔀 Trier par : 🕒 Dernière modification ▼ ]  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 🎯 LA COURSE DU SEL                                               [ ACTIVE ]           │
│ Une traversée mortelle à travers le désert méditerranéen.                              │
│ 🚩 Nœuds: 43  │ 📅 Créée le: 31/07/2026 à 17:39  │ 🕒 Modifiée le: 31/07/2026 à 17:42 │
│                                                                                        │
│ [ Éditer le Graphe ] [ 🚀 Instancier (Nouvelle Table) ] [ 🔄 Remettre à zéro ]        │
│ [ 📋 Dupliquer ]     [ ✔ Résoudre ]                     [ 🗑 Supprimer ]                │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

##### Fonctionnalités clés :
1. **Système de Tri Dynamique** :
   Sélecteur permettant d'ordonner la liste des quêtes en temps réel :
   - `updated_desc` : 🕒 *Dernière modification (Récent → Ancien)* [Par défaut]
   - `created_desc` : 📅 *Date de création (Récent → Ancien)*
   - `created_asc` : 📅 *Date de création (Ancien → Récent)*
   - `name_asc` : 🔤 *Nom (A → Z)*
   - `nodes_desc` : 🚩 *Nombre de nœuds (Plus élevé → Moins élevé)*
2. **Horodatage Complet** :
   Affiche la date et l'heure exactes de création (`createdAt`) et de modification (`updatedAt`) sous forme lisible (`DD/MM/YYYY à HH:mm`).
3. **Supprimer avec Seuil de Confirmation de 10 Nœuds** :
   - Calcule le nombre exact de nœuds (`quest._count?.nodes ?? quest.nodes?.length ?? 0`).
   - Si la quête contient **moins de 10 nœuds** : Affiche une boîte de dialogue de confirmation standard.
   - Si la quête contient **10 nœuds ou plus** : Déclenche un avertissement de sécurité renforcé :
     ```javascript
     window.confirm(
       `⚠️ ATTENTION : La quête "${quest.name}" contient ${nodeCount} nœuds (10 nœuds ou plus).\n\n` +
       `Cette suppression est DÉFINITIVE et effacera la quête ainsi que la totalité de ses nœuds, ` +
       `objectifs, horloges de menace et connexions de la base de données.\n\n` +
       `Confirmez-vous la suppression de cette quête ?`
     );
     ```
4. **Instancier (Nouvelle Table)** :
   Crée une instance de partie vierge clonée à partir du modèle de quête sans altérer la trame d'origine.

---

#### 4.3.2 Éditeur de Graphe Narratif (`QuestGraphEditor.jsx` & `QuestDetail.jsx`)
* Rendu ReactFlow du graphe orienté de nœuds (`narrative`, `challenge`, `choice`, `combat`, `outcome`).
* **Commutateur Mode MJ / Mode Joueurs** :
  - **Mode MJ** : Affiche les `gmSecrets`, les minuteurs secrets et les seuils de menace.
  - **Mode Joueurs** : Purge les secrets pour permettre la projection directe sur la table de jeu.

---

#### 4.3.3 Tableau de Bord de Session (`SessionDashboard.jsx`)
Tiroir de contrôle rétractable disponible pendant les sessions live :
* **Dés d'événement aléatoire (d8)** : Génère un événement d'ambiance et le diffuse sur la table via Socket.IO.
* **Reserve de scènes (`Scene Pool Drawer`)** : Tirage de péripéties secondaires.
* **Runner d'audit d'intégrité** : Détection des erreurs de graphe.
* **Convertisseur de règles (FE-11)** : Switch D&D 5e / Générique.
* **Spotlight Checklist (FE-12)** : Diffusion instantanée d'indices sur l'écran table.

---

#### 4.3.4 Carte du Monde Interactive (`MapManager.jsx`)
* Canvas HTML5 interactif avec transformations matricielles pour le Pan et Zoom.
* **Projection GPS Réelle** : Placement des 10 Cités-États sur la carte méditerranéenne d'après leurs coordonnées GPS du lore.
* **Inspecteur de Cité & Badge GPS** :
  Lors de la sélection d'une cité sur la carte, le panneau latéral affiche ses coordonnées GPS exactes (ex: `📍 Position GPS : 46.2044° N, 6.1432° E (Genève)`).

---

#### 4.3.5 Base de Données PNJ (`NpcsList.jsx`)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 👥 BASE DE DONNÉES PNJ                                           [ + Créer un PNJ ]   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ [ 🔍 Rechercher PNJ... ] [ 🏙️ Toutes les Villes ▼ ] [ 🛡️ Toutes les Factions ▼ ]     │
│ [ 🔀 Trier par : Nom (A→Z) ▼ ] [ ★ Favoris ]                     [ ✕ Effacer filtres ] │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────┐  ┌──────────────────────────────────────┐ │
│ │ Kaelen Vorn                      ★ │  │ Silas Cendre                      ★ │ │
│ │ Humain • Chef des Raffineurs         │  │ Humain • Médecin-Chef                │ │
│ │ [ 🏙️ Cité du Carburant ]             │  │ [ 🏙️ Cité Médicale ]                 │ │
│ │ [ 🛡️ Les Raffineurs ]                │  │ [ 🛡️ Les Blouses Blanches ]          │ │
│ │ [ 📍 Bâtiment: Générateur Central ]  │  │ [ 📍 Bâtiment: Citerne Principale ]  │ │
│ └──────────────────────────────────────┘  └──────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

##### Fonctionnalités clés :
1. **Filtre par Ville (Cités-États)** : Filtrage par cité d'appartenance.
2. **Filtre par Faction de la ville** : Liste dynamique des factions associées à la cité sélectionnée.
3. **Badges d'appartenance** : Affichage visuel des badges 🏙️ **Cité**, 🛡️ **Faction** et 📍 **Bâtiment**.
4. **Attribution hiérarchique** : Formulaire de création permettant de lier directement le PNJ à un lieu de la campagne.

---

## 5. INTERFACES JOUEUR MOBILE ET ÉCRAN DE TABLE (TV)

### 5.1 Interface Joueur Mobile (`PlayerApp.js` & `CharacterSheet.jsx`)
* Interface responsive pour smartphone.
* Consultation des PV, caractéristiques, emplacements d'inventaire et progression dans les 16 arbres de compétences.

### 5.2 Lanceur de Dés Serveur
Les jets de dés initiés par les joueurs (compétences, sauvegardes, attaques, dégâts) sont transmis au backend qui calcule les modificateurs et consigne le résultat dans le journal de session commun.

### 5.3 Vue Écran de Table Public (`TableScreenView.jsx`)
* Accessible via l'URL `/table/:token`.
* Affiche les illustrations de lieux, fiches de PNJ révélés, bannières **Spotlight** et l'initiative du combat sans exposer les coulisses du MJ.

---

## 6. TEMPS RÉEL ET SYNCHRONISATION WEBSOCKET (SOCKET.IO)

Tableau des événements temps réel diffusés par le serveur Socket.IO :

| Événement | Émetteur | Destinataires | Effet UI |
| :--- | :--- | :--- | :--- |
| `spotlight_update` | MJ | Table & Joueurs | Affiche une bannière, une image ou un indice sur l'écran public. |
| `threat_threshold_reached` | Backend / MJ | Tous | Affiche une alerte d'urgence lors du franchissement d'un palier d'horloge. |
| `random_event_drawn` | MJ | Tous | Notifie le tirage d'un événement d8. |
| `encounter_state_changed` | MJ | Table & Joueurs | Met à jour le tour d'initiative et les barres de PV en direct. |
| `dice_rolled` | Joueur / MJ | Tous | Inscrit le jet de dé au journal de session commun. |

---

## 7. CARTOGRAPHIE GPS ET LORE NARRATIVE DES 10 CITÉS-ÉTATS

Les 10 Cités-États de *La Course du Sel* sont positionnées sur la Carte du Monde en s'appuyant sur leurs coordonnées GPS réelles du lore :

| Cité-État | Faction Dominante | Emplacement Réel | Coordonnées GPS | Canvas `(X, Y)` |
| :--- | :--- | :--- | :--- | :--- |
| **BUNKER OMÉGA** | Les Fantômes d'Acier | Genève (Suisse) | `46.2044° N, 6.1432° E` | `(769, 120)` |
| **CITÉ INDUSTRIELLE** | Les Forgerons d'Acier | Turin (Italie) | `45.0703° N, 7.6869° E` | `(842, 195)` |
| **CITÉ DU DIVERTISSEMENT** | Les Faiseurs de Rêves | Rome (Italie) | `41.9028° N, 12.4964° E` | `(1071, 406)` |
| **NUKE CITY** | Le Réacteur à Ciel Ouvert | Marseille (France) | `43.2965° N, 5.3698° E` | `(732, 314)` |
| **CITÉ DE L'EAU & ALIMENTATION** | Les Gardiens de la Source | Camargue / Rhône (France) | `43.5000° N, 4.6000° E` | `(695, 300)` |
| **CITÉ DU CARBURANT** | Les Raffineurs | Alger (Algérie) | `36.7538° N, 3.0588° E` | `(622, 750)` |
| **CITÉ DE L'ARMEMENT & DÉFENSE** | Les Arsenaux | Gibraltar | `36.1408° N, 5.3536° O` | `(221, 791)` |
| **L'ILE DES ANCIENS** | Le Paradis Perdu | Atlantique (Ouest Gibraltar) | `36.0000° N, 8.5000° O` | `(71, 800)` |
| **CITÉ DES MÉTAUX & RECYCLAGE** | Les Fossoyeurs | ~~Athènes (Grèce)~~ **Malte** | ~~`37.9838° N, 23.7275° E`~~ `35.8989° N, 14.5146° E` | ~~`(1606, 668)`~~ **`(1167, 807)`** |
| **CITÉ MÉDICALE** | Les Blouses Blanches | Alexandrie (Égypte) | `31.2001° N, 29.9187° E` | `(1901, 1120)` |

> **⚠️ Erreur corrigée le 21 septembre 2026 — Cité des Métaux : Malte, pas Athènes.**
>
> Ce tableau attribuait à la Cité des Métaux & Recyclage les coordonnées
> d'**Athènes** (`37.9838 N / 23.7275 E` → `(1606, 668)`). Le calcul confirme
> que cette valeur est Athènes **au pixel près** (distance 0 px).
>
> Or le lore de cette cité (`client/src/utils/loreData.js`) écrit : « *Au centre
> exact du bassin méditerranéen desséché, **sur l'ancienne île de Malte** — le
> point de passage obligé de quiconque traverse le désert de sel d'une rive à
> l'autre.* » Le lore nomme Malte ; ce tableau nommait Athènes. **Le tableau se
> contredisait lui-même, et c'est lui qui a contaminé la base** (la ligne
> `CITÉ DES MÉTAUX & RECYCLAGE` portait bien `(1606, 668)`).
>
> Contrôle géométrique : Malte est à **1 259 px** de distance moyenne des neuf
> autres cités, Athènes à **1 684 px**. Malte est bien le point le plus central
> du bassin, conformément à la description du lore.
>
> **Correction retenue : `(1167, 807)` en base 1200.** Le tableau § 7 est mis à
> jour en conséquence. Détail complet dans
> `Cahier des charges/Corrections_positions_v2.md`.

> **⚠️ Second point, corrigé le 21 septembre 2026 — la planche du monde n'est pas carrée.**
>
> Ce tableau donne les dix couples en base **1200 × 1200**. Ce référentiel est
> bon : la projection est une application linéaire, elle se calcule en base 1200
> et la conversion vers la taille de la planche doit vivre à un seul endroit du
> code.
>
> **Mais la planche de rendu ne peut pas être carrée.** L'emprise réelle des dix
> cités va de la longitude −8,5° (L'Île des Anciens) à +29,9° (Cité Médicale),
> et de la latitude 31,2° à 46,2° — soit **38,4° × 15,0°**. La projection
> étirant les latitudes de 40 % (rapport 1,400), cela fait
> `47,63 × 38,4 = 1 830 px` de large pour `66,68 × 15,0 = 1 000 px` de haut :
> **un rapport de 1,83**. Un carré de 2048 est trop étroit — la Cité Médicale
> tombe à 158 % de la largeur.
>
> **Format de rendu retenu : `1 743 × 1 024`** (double résolution
> `3 486 × 2 048`). Cadrage sur l'emprise ci-dessus, origin au coin nord-ouest
> `(latitude 46,2044 / longitude −8,5000)`, marge de 90 px en base 1200.
>
> Les valeurs `mapX` / `mapY` écrites en base restent celles du tableau
> ci-dessus, **en base 1200** : elles ne dépendent pas du format de la planche.
> La conversion appartient au composant qui dessine.

---

## 8. GUIDE DE MAINTENANCE, BUILDS ET TESTS

### 8.1 Lancement de l'Environnement de Développement
1. **Démarrer le Serveur Backend API (Port 3000)** :
   ```bash
   npm --prefix server run start
   ```
2. **Démarrer le Serveur Frontend Vite (Port 5173)** :
   ```bash
   npm --prefix client run dev
   ```

### 8.2 Validation et Compilation
* **Test de compilation Production Frontend (Vite)** :
  ```bash
  npm --prefix client run build
  ```
* **Validation de syntaxe Backend (Node.js)** :
  ```bash
  node -c server/src/index.js
  ```

### 8.3 Scripts d'Administration et Base de Données
* **Regénérer le graphe de quête principal** :
  ```bash
  node server/update_main_quest.js
  ```
* **Recalculer et appliquer le placement GPS des cités** :
  ```bash
  node server/update_city_gps.js
  ```
* **Générer les 270 PNJ du lore** :
  ```bash
  node server/seed_npcs.js
  ```
