# CAHIER DES CHARGES — MODULE DE COMBAT D&D5e
**GM HELPER V2 — EXTENSION DE LA CATÉGORIE "COMBAT ET RENCONTRES"**
*Document fonctionnel et technique de spécification*
*Rédigé le : 31 Juillet 2026*

---

## TABLE DES MATIÈRES

1. [Contexte, Objectifs et Périmètre](#1-contexte-objectifs-et-périmètre)
2. [Vue d'Ensemble du Flux de Combat (Machine à États)](#2-vue-densemble-du-flux-de-combat-machine-à-états)
3. [Extension du Modèle de Données (Prisma)](#3-extension-du-modèle-de-données-prisma)
4. [Backend — Nouvelles Routes API](#4-backend--nouvelles-routes-api)
5. [Frontend — Composants et Store](#5-frontend--composants-et-store)
6. [Temps Réel et Confidentialité (Socket.IO)](#6-temps-réel-et-confidentialité-socketio)
7. [Règles D&D5e Couvertes en Détail](#7-règles-dd5e-couvertes-en-détail)
8. [Hors-Scope V1 / Pistes d'Évolution (V2+)](#8-hors-scope-v1--pistes-dévolution-v2)
9. [Critères d'Acceptation](#9-critères-dacceptation)
10. [Plan de Mise en Œuvre Suggéré](#10-plan-de-mise-en-œuvre-suggéré)
11. [État Actuel du Module de Combat (Réalisé & Opérationnel)](#11-état-actuel-du-module-de-combat-réalisé--opérationnel)

---

## 1. CONTEXTE, OBJECTIFS ET PÉRIMÈTRE

### 1.1 Rappel de l'Existant

La catégorie **"Combat et Rencontres"** dispose déjà d'une fondation partielle dans GM Helper V2 :

* **Modèle de données** : `Encounter` (`id`, `campaignId`, `locationId`, `name`, `status`, `currentRound`, `activeCombatantIndex`) et `EncounterCombatant` (`id`, `encounterId`, `name`, `type`, `initiative`, `hpCurrent`, `hpMax`, `conditions`).
* **Backend** : `server/src/routes/gm/encounters.js`.
* **Frontend** : `EncounterTracker.jsx` (onglet MJ) et une consommation partielle côté `TableScreenView.jsx` et `PlayerApp.js` via l'événement `encounter_state_changed`.
* **Moteur annexe** : `ruleConverter.js` traduit déjà des tags narratifs génériques en jets de compétence D&D5e (ex. `[OBSTACLE PHYSIQUE]` → Force (Athlétisme) DD 14), mais ne couvre pas le combat structuré.
* `QuestNode` possède un type `"combat"` qui n'est aujourd'hui relié à aucune mécanique réelle.

Cette base est fonctionnelle mais **minimale** : pas de Classe d'Armure, pas de phases distinctes (préparation / surprise / initiative / combat / résolution), pas de bibliothèque de monstres réutilisable, pas de sélection structurée des participants, et aucune règle de confidentialité MJ/joueurs sur les données de combat.

### 1.2 Objectif de la Fonctionnalité

Étendre l'existant (et non le remplacer) pour fournir au MJ un **tracker de combat D&D5e complet côté suivi d'état**, sachant que :
* Tous les jets de dés (attaque, dégâts, sauvegardes, initiative) sont effectués physiquement sur table par les joueurs et le MJ — l'application **ne lance aucun dé** pour le combat et **ne calcule aucun résultat de jet**.
* Le rôle de l'application se limite à : sélectionner les participants, structurer les phases, ordonner et suivre les tours, centraliser les PV et conditions, et afficher la CA de chaque cible pour que le MJ compare mentalement au jet obtenu sur table.
* Le suivi est synchronisé en temps réel entre l'interface MJ, l'écran de table (TV) et l'application joueur, dans le respect strict de la confidentialité des informations de monstres/PNJ hostiles.

### 1.3 Principes Directeurs (Décisions de Cadrage)

| Décision | Choix retenu |
| :--- | :--- |
| Calcul touché/raté | **Non automatisé.** L'appli affiche la CA de la cible ; le MJ compare lui-même au jet physique. |
| Bibliothèque de monstres | **Bestiaire réutilisable** (nouveau modèle `Bestiary`) avec stat blocks complets. |
| Granularité du suivi de tour | **Base uniquement en V1** : ordre du tour, PV, conditions simples. L'économie d'actions (Action/Bonus/Réaction/Mouvement), les sauvegardes contre la mort, etc. sont documentées en section 8 comme options d'évolution, **non développées maintenant**. |
| Visibilité des monstres/PNJ hostiles | **Totalement masquée** aux joueurs et à l'écran TV (ni PV exacts, ni état qualitatif). Seuls l'ordre du tour et les informations des PJ sont publics. |
| Stats de combat des PNJ | Priorité à la fiche PNJ si elle porte ses propres stats de combat ; sinon, repli sur une entrée de Bestiaire liée. |
| Intégration narrative | Un `QuestNode` de type `"combat"` **crée et lie automatiquement** un `Encounter` pré-rempli avec les participants prévus par le MJ en amont. |

---

## 2. VUE D'ENSEMBLE DU FLUX DE COMBAT (MACHINE À ÉTATS)

Le champ `status` actuel de `Encounter` (`"planned"` | `"active"` | `"completed"`) est affiné en un champ `phase` plus granulaire, qui pilote l'écran affiché dans `EncounterTracker.jsx` :

```
┌─────────────────┐     ┌──────────────────┐     ┌───────────────────┐
│   1. PRÉPARATION │────▶│    2. SURPRISE   │────▶│   3. INITIATIVE   │
│  (planned)       │     │  (surprise_check) │     │ (initiative_entry) │
│  Sélection des   │     │  Qui est surpris ?│     │ Saisie manuelle   │
│  participants    │     │  (checklist MJ)   │     │ des valeurs       │
└─────────────────┘     └──────────────────┘     └─────────┬──────────┘
                                                            │
                                                            ▼
┌─────────────────┐     ┌──────────────────────────────────────────┐
│  5. RÉSOLUTION   │◀────│           4. COMBAT ACTIF (active)       │
│  (completed)     │     │  Boucle de rounds : tour par tour,       │
│  Bilan, PV finaux│     │  PV +/-, conditions, CA visible MJ,      │
│  fermeture       │     │  bouton "Tour suivant" / "Round suivant" │
└─────────────────┘     └──────────────────────────────────────────┘
```

* **Phase 1 — Préparation** : le combat existe (`status: "planned"`) mais aucun tour n'est engagé. Le MJ construit la liste des combattants.
* **Phase 2 — Surprise** *(optionnelle, activable/désactivable par combat)* : le MJ coche, pour chaque combattant, s'il est surpris (résultat déterminé sur table via Discrétion vs Perception). Les combattants surpris n'agissent pas au round 1 mais restent dans l'ordre d'initiative pour les rounds suivants.
* **Phase 3 — Initiative** : le MJ saisit manuellement la valeur d'initiative obtenue par chaque combattant (jet de table). L'application trie automatiquement par ordre décroissant et gère les égalités (réordonnancement manuel par glisser-déposer).
* **Phase 4 — Combat actif** : boucle de rounds. Le combattant actif est mis en surbrillance ; le MJ ajuste les PV, ajoute/retire des conditions, consulte la CA de chaque cible, puis passe au combattant suivant (`activeCombatantIndex++`) ou au round suivant (`currentRound++`).
* **Phase 5 — Résolution** : le combat est clos (`status: "completed"`), un résumé (durée, PV finaux, combattants tombés à 0 PV) est figé et consultable dans l'historique de la campagne.

---

## 3. EXTENSION DU MODÈLE DE DONNÉES (PRISMA)

### 3.1 Nouveau Modèle `Bestiary`

Bibliothèque de stat blocks réutilisables à l'échelle de la campagne, indépendante des rencontres :

* `id` (String CUID), `campaignId`, `name` (String), `category` (`"humanoid"` | `"beast"` | `"undead"` | `"construct"` | `"aberration"` | `"other"`), `challengeRating` (Float, optionnel).
* **Stats de Combat** : `armorClass` (Int), `hpMax` (Int), `hpFormula` (String, ex. `"8d8+16"`, informatif), `speed` (String, ex. `"9m, vol 18m"`).
* **Caractéristiques** : `stats` (JSON String : STR, DEX, CON, INT, WIS, CHA).
* **Attaques et Capacités** : `attacks` (JSON String — liste d'attaques avec nom, bonus au toucher indicatif, dégâts indicatifs), `traits` (JSON String — capacités spéciales, résistances, immunités), `savingThrows` (JSON String, optionnel).
* `description` (Text), `isFavorite` (Boolean), `createdAt`, `updatedAt`.
* Relation : `campaign`, `encounterCombatants` (utilisations dans des rencontres passées/actuelles).

### 3.2 Extension du Modèle `Character` (PJ)

* Ajout de `armorClass` (Int) — actuellement absent alors que `hpCurrent`/`hpMax` existent déjà.

### 3.3 Extension du Modèle `NPC`

* Ajout de champs de combat **optionnels** (nullable, remplis uniquement si le PNJ peut participer à un combat) : `armorClass` (Int?), `hpMax` (Int?), `hpCurrent` (Int?), `speed` (String?).
* Ajout de `bestiaryId` (String?, relation vers `Bestiary`) : lien de repli utilisé **uniquement si le PNJ n'a pas ses propres stats renseignées**. Règle de résolution appliquée côté backend au moment de l'ajout en combat :
  ```
  statsEffectives = NPC.armorClass != null
                     ? statsPropresAuPNJ
                     : (NPC.bestiaryId != null ? statsDuBestiaire : null)
  ```

### 3.4 Extension du Modèle `Encounter`

* `phase` (String, nouveau) : `"planned"` | `"surprise_check"` | `"initiative_entry"` | `"active"` | `"completed"`. Remplace l'usage isolé de `status` pour piloter l'écran affiché (le champ `status` existant est conservé pour compatibilité et simplifié en dérivé de `phase`).
* `surpriseEnabled` (Boolean, défaut `false`) : active ou non l'étape 2 pour ce combat précis.
* `questNodeId` (String?, relation vers `QuestNode`) : lien vers le nœud de quête à l'origine de la rencontre, le cas échéant.
* `summary` (JSON String?, rempli à la clôture) : bilan (durée en rounds, combattants tombés à 0 PV, notes du MJ).

### 3.5 Extension du Modèle `EncounterCombatant`

* `armorClass` (Int?) : valeur figée au moment de l'ajout au combat (copiée depuis `Character`, `NPC` ou `Bestiary` selon la règle de résolution 3.3), visible **uniquement côté MJ**.
* `sourceType` (String) : `"character"` | `"npc"` | `"bestiary"` | `"manual"` — traçabilité de l'origine du combattant.
* `sourceId` (String?) : identifiant de l'entité source (`characterId`, `npcId` ou `bestiaryId`), permettant de retrouver la fiche d'origine.
* `isSurprised` (Boolean, défaut `false`) : renseigné en phase 2, consommé au round 1 (le combattant est visible dans l'ordre mais son tour est marqué "passé — surpris").
* `isVisibleToPlayers` (Boolean, défaut : `true` si `type === "character"`, sinon `false`) : contrôle l'exposition des données de ce combattant côté TV/joueurs (voir section 6).
* `notes` (Text?) : notes libres du MJ sur ce combattant pour la durée du combat.

---

## 4. BACKEND — NOUVELLES ROUTES API

### 4.1 Gestion du Bestiaire (`server/src/routes/gm/bestiary.js`, nouveau fichier)

* `GET /api/v1/gm/campaigns/:campaignId/bestiary` — liste des monstres, filtrable par `category` et recherche par nom.
* `POST /api/v1/gm/campaigns/:campaignId/bestiary` — création d'un stat block.
* `PATCH /:id` — édition d'un stat block existant.
* `DELETE /:id` — suppression (bloquée si utilisé dans un combat `"active"`, autorisée sinon avec avertissement si utilisé dans l'historique).

### 4.2 Sélection des Participants (extension d'`encounters.js`)

* `POST /:id/combatants` — ajoute un ou plusieurs combattants à un `Encounter` en phase `"planned"`. Corps de requête :
  ```json
  {
    "combatants": [
      { "sourceType": "character", "sourceId": "char_123" },
      { "sourceType": "npc", "sourceId": "npc_456" },
      { "sourceType": "bestiary", "sourceId": "beast_789", "count": 3 },
      { "sourceType": "manual", "name": "Renfort improvisé", "armorClass": 13, "hpMax": 10 }
    ]
  }
  ```
  Le backend résout automatiquement `armorClass`/`hpMax`/`isVisibleToPlayers` selon les règles des sections 3.3 et 3.5. Le paramètre `count` duplique une entrée de bestiaire en plusieurs combattants nommés (ex. "Pillard 1", "Pillard 2", "Pillard 3").
* `DELETE /:id/combatants/:combatantId` — retire un combattant avant le début du combat.

### 4.3 Transitions de Phase

* `POST /:id/start-surprise-check` — passe `phase` à `"surprise_check"` (uniquement si `surpriseEnabled: true`).
* `PATCH /:id/combatants/:combatantId/surprise` — bascule `isSurprised` pour un combattant.
* `POST /:id/start-initiative-entry` — passe `phase` à `"initiative_entry"`.
* `PATCH /:id/combatants/:combatantId/initiative` — enregistre la valeur d'initiative saisie par le MJ.
* `POST /:id/start-combat` — trie les combattants par initiative décroissante, initialise `currentRound = 1`, `activeCombatantIndex = 0`, passe `phase` à `"active"`.
* `POST /:id/next-turn` — avance `activeCombatantIndex` ; si fin de liste, incrémente `currentRound` et revient au premier combattant (les combattants `isSurprised` ne sont sautés qu'au round 1).
* `POST /:id/end-combat` — calcule et enregistre `summary`, passe `phase`/`status` à `"completed"`.

### 4.4 Mise à Jour Combattant (en cours de combat)

* `PATCH /:id/combatants/:combatantId` — met à jour `hpCurrent` (delta `+`/`-` ou valeur absolue), `conditions` (ajout/retrait d'un tag), `notes`.

### 4.5 Intégration Quêtes (extension de `quests.js`)

* Ajout d'un champ `combatTemplate` (JSON String, nullable) sur `QuestNode`, rempli par le MJ lors de la conception du nœud `"combat"` dans `QuestGraphEditor.jsx` : liste des participants prévus (mêmes références `sourceType`/`sourceId`/`count` qu'en 4.2).
* `POST /api/v1/gm/quests/nodes/:nodeId/spawn-encounter` — appelé automatiquement lorsque le nœud devient `"active"` (ou déclenché manuellement par le MJ depuis `QuestDetail.jsx`) :
  - Crée un `Encounter` (`status: "planned"`, `phase: "planned"`, `questNodeId` renseigné, `locationId` hérité du lieu du nœud si disponible).
  - Ajoute automatiquement les combattants définis dans `combatTemplate`.
  - Retourne l'`id` de l'`Encounter` créé pour redirection immédiate du MJ vers `EncounterTracker.jsx`.

---

## 5. FRONTEND — COMPOSANTS ET STORE

### 5.1 Extension du Store Zustand (`gmStore.js`)

Nouvelles entrées de state et actions :
- **Bestiaire** : `bestiary`, `fetchBestiary()`, `createBestiaryEntry()`, `updateBestiaryEntry()`, `deleteBestiaryEntry()`.
- **Combat** : `activeEncounter`, `fetchEncounter(id)`, `addCombatants()`, `removeCombatant()`, `toggleSurprise()`, `setInitiative()`, `startCombat()`, `nextTurn()`, `updateCombatantHp()`, `updateCombatantConditions()`, `endCombat()`.
- **Intégration Quête** : `spawnEncounterFromNode(nodeId)`.

### 5.2 Nouveau Composant `BestiaryManager.jsx` (`client/src/components/gm/`)

Onglet MJ dédié, sur le modèle de `NpcsList.jsx` :
```
┌────────────────────────────────────────────────────────────────────────────────┐
│ 🐺 BESTIAIRE                                              [ + Créer un Monstre ]│
├────────────────────────────────────────────────────────────────────────────────┤
│ [ 🔍 Rechercher... ] [ Catégorie ▼ ] [ ★ Favoris ]          [ ✕ Effacer filtres]│
├────────────────────────────────────────────────────────────────────────────────┤
│ ┌────────────────────────────┐  ┌────────────────────────────┐               │
│ │ Pillard des Sables      ★ │  │ Automate Gardien             │               │
│ │ Humanoïde • FP 1/2          │  │ Construct • FP 3              │               │
│ │ 🛡️ CA 12   ❤️ 11 PV        │  │ 🛡️ CA 17   ❤️ 45 PV          │               │
│ └────────────────────────────┘  └────────────────────────────┘               │
└────────────────────────────────────────────────────────────────────────────────┘
```

### 5.3 Refonte de `EncounterTracker.jsx`

Le composant devient une séquence d'écrans pilotés par `encounter.phase` :

1. **Écran de Sélection des Participants** *(phase `planned`)* : trois onglets de recherche (Personnages / PNJ / Bestiaire) + bouton "Ajout manuel rapide" (nom, CA, PV libres, sans fiche associée). Liste des combattants déjà ajoutés, retirables avant lancement.
2. **Écran de Surprise** *(phase `surprise_check`, uniquement si activée)* : checklist par combattant ("Surpris ?" oui/non), bouton "Valider et passer à l'initiative".
3. **Écran de Saisie d'Initiative** *(phase `initiative_entry`)* : un champ numérique par combattant (valeur obtenue sur table). Tri live par ordre décroissant à mesure de la saisie. Bouton "Démarrer le combat".
4. **Écran de Combat Actif** *(phase `active`)* :
   ```
   ┌──────────────────────────────────────────────────────────────────┐
   │ ⚔️ COMBAT — Round 2                          [ Terminer le combat]│
   ├──────────────────────────────────────────────────────────────────┤
   │ ▶ 1. Kael (PJ)        Init 18   🛡️ CA 15   ❤️ 24/30  [Sonné]     │
   │   2. Pillard 1 (Bestiaire) Init 14  🛡️ CA 12  ❤️ 6/11 [Surpris]  │
   │   3. Silas (PNJ allié) Init 9   🛡️ CA 13   ❤️ 18/18              │
   ├──────────────────────────────────────────────────────────────────┤
   │           [ ◀ Combattant précédent ]  [ Combattant suivant ▶ ]   │
   └──────────────────────────────────────────────────────────────────┘
   ```
   - Modification rapide des PV par `+`/`-` ou saisie directe.
   - Ajout/retrait de conditions via liste déroulante (les 14 conditions standard D&D5e + champ libre).
   - CA visible uniquement dans cette vue MJ, jamais transmise à la vue publique.
5. **Écran de Résolution** *(phase `completed`)* : tableau récapitulatif (PV finaux, combattants à 0 PV, durée en rounds), bouton "Archiver" (conserve l'historique, accessible depuis le journal de session).

### 5.4 Vue Écran de Table (`TableScreenView.jsx`)

Affiche uniquement : l'ordre du tour (noms), le round courant, et — pour les combattants avec `isVisibleToPlayers: true` (les PJ) — leurs PV/CA. Aucune donnée d'un combattant `isVisibleToPlayers: false` n'est envoyée par le serveur à cette vue (filtrage côté backend, pas seulement côté affichage — voir section 6).

### 5.5 Vue Joueur (`PlayerApp.js`)

Bandeau "Combat en cours" affichant la position du joueur dans l'ordre du tour et un indicateur "C'est ton tour" lorsque `activeCombatantIndex` correspond à son personnage.

---

## 6. TEMPS RÉEL ET CONFIDENTIALITÉ (SOCKET.IO)

L'événement existant `encounter_state_changed` est conservé mais son payload est **désormais construit différemment selon le destinataire** :

| Destinataire | Contenu du payload |
| :--- | :--- |
| **MJ** (`/gm/...`) | Objet `Encounter` complet : tous les combattants avec `armorClass`, `hpCurrent/hpMax` réels, `conditions`, `isSurprised`. |
| **Table / Joueurs** (`/table/:token`, `/player/...`) | Objet filtré : `phase`, `currentRound`, `activeCombatantIndex`, et uniquement les combattants où `isVisibleToPlayers === true`, sans jamais inclure `armorClass` des monstres/PNJ hostiles ni leur `hpCurrent`. |

Ce filtrage est effectué **côté serveur** (dans le handler Socket.IO, avant émission), à l'image du traitement déjà appliqué aux `gmSecrets` des `QuestNode` — aucune donnée sensible ne doit transiter côté client puis être masquée uniquement par le rendu (ce qui serait contournable via les DevTools du navigateur).

---

## 7. RÈGLES D&D5e COUVERTES EN DÉTAIL

1. **Sélection des participants** : PJ (fiches `Character` existantes), PNJ (base `NPC` existante, avec ou sans stats de combat propres), monstres (Bestiaire), et ajout manuel libre pour les cas exceptionnels (renforts improvisés, invocations).
2. **Surprise** : activable par combat. Un combattant surpris apparaît dans l'ordre d'initiative mais son tour au round 1 est automatiquement marqué comme passé par l'interface (pas d'action possible tant que le round 1 n'est pas terminé pour lui). Dès le round 2, il agit normalement.
3. **Initiative** : saisie manuelle des valeurs obtenues sur table (aucun calcul de modificateur par l'application). Tri automatique décroissant ; en cas d'égalité, réordonnancement manuel par glisser-déposer dans la liste.
4. **Déroulement des rounds et tours** : navigation séquentielle combattant par combattant (`activeCombatantIndex`), avec incrémentation automatique de `currentRound` au retour au premier combattant.
5. **Classe d'Armure** : affichée à côté de chaque combattant dans la vue MJ uniquement, pour comparaison manuelle et immédiate avec le jet d'attaque physique annoncé par le joueur.
6. **Points de vie** : ajustement rapide (`+`/`-` ou saisie absolue), avec plancher visuel à 0 (le combattant n'est pas retiré de la liste, mais visuellement identifié comme "à terre").
7. **Conditions** : liste standard des 14 conditions D&D5e (Aveuglé, Charmé, Assourdi, Effrayé, Agrippé, Incapable d'agir, Invisible, Paralysé, Pétrifié, Empoisonné, À terre, Entravé, Étourdi, Inconscient) applicables/retirables par combattant, sans gestion automatique de durée en V1 (le MJ retire la condition manuellement quand elle expire).
8. **Fin de combat** : bilan archivé (round final, PV de chacun, combattants tombés), consultable ultérieurement.

---

## 8. HORS-SCOPE V1 / PISTES D'ÉVOLUTION (V2+)

Ces éléments ont été explicitement écartés du périmètre actuel pour garder une V1 simple et livrable rapidement, mais sont documentés ici pour une itération future :

* **Calcul automatique touché/raté** : saisie du résultat du d20 par le MJ (ou le joueur) avec comparaison automatique à la CA affichée et retour visuel immédiat (✅ Touché / ❌ Raté).
* **Économie d'actions complète** : suivi par tour de l'Action, de l'Action Bonus, de la Réaction et du Mouvement consommés par chaque combattant, avec remise à zéro automatique en début de tour.
* **Sauvegardes contre la mort** : compteur dédié (succès/échecs) pour les PJ tombés à 0 PV, avec bascule automatique en "Stable" ou "Mort" selon les règles standard.
* **Durée des conditions** : compteur de rounds restants par condition, avec retrait automatique à expiration et alerte visuelle au MJ.
* **État "ensanglanté" public** : affichage d'un indicateur qualitatif (Intact / Blessé / Critique / Inconscient) pour les monstres sur l'écran TV, sans jamais révéler les PV exacts.
* **Calcul automatique de la surprise** : comparaison directe des jets de Discrétion vs Perception saisis, plutôt qu'une simple checklist manuelle du MJ.
* **Actions légendaires / actions de repaire** pour les monstres de haut niveau de menace (boss).
* **Bibliothèque de sorts et capacités** liée aux fiches PJ, pour affichage rapide des options disponibles pendant un tour.

---

## 9. CRITÈRES D'ACCEPTATION

- [ ] Un MJ peut créer un `Encounter`, y ajouter des PJ, PNJ et monstres du Bestiaire (y compris en quantité), et retirer un participant avant le début du combat.
- [ ] La résolution des stats d'un PNJ (propres vs Bestiaire lié) fonctionne selon la règle de priorité définie en 3.3.
- [ ] Le MJ peut activer/désactiver la phase de surprise par combat, et marquer individuellement chaque combattant comme surpris.
- [ ] Le MJ peut saisir manuellement les valeurs d'initiative et obtenir un tri automatique, avec possibilité de réordonner manuellement en cas d'égalité.
- [ ] Le combat actif affiche l'ordre des tours, le round courant, le combattant actif en surbrillance, les PV et la CA (MJ uniquement) de chaque combattant.
- [ ] Le MJ peut ajuster les PV et les conditions de chaque combattant en cours de combat.
- [ ] L'écran TV et l'application joueur n'affichent **jamais** la CA ou les PV des monstres/PNJ hostiles, uniquement l'ordre du tour et les informations des PJ.
- [ ] Un nœud de quête de type `"combat"` déclenche la création automatique d'un `Encounter` pré-rempli selon son `combatTemplate`.
- [ ] La fin de combat archive un bilan consultable ultérieurement dans l'historique de la campagne.

---

## 10. PLAN DE MISE EN ŒUVRE SUGGÉRÉ

1. **Migration Prisma** : ajout du modèle `Bestiary`, extension de `Character`, `NPC`, `Encounter`, `EncounterCombatant`, `QuestNode` (section 3).
2. **Backend — Bestiaire** : CRUD complet (`bestiary.js`) et intégration au store.
3. **Backend — Cycle de vie du combat** : routes de sélection des participants et de transition de phase (section 4.2 à 4.4).
4. **Backend — Filtrage temps réel** : adaptation du handler Socket.IO pour le payload différencié MJ / joueurs (section 6) — **prioritaire du point de vue sécurité/confidentialité**, à valider avant tout test avec de vrais joueurs.
5. **Backend — Intégration quêtes** : champ `combatTemplate` sur `QuestNode` et route `spawn-encounter` (section 4.5).
6. **Frontend — Bestiaire** : composant `BestiaryManager.jsx`.
7. **Frontend — Refonte `EncounterTracker.jsx`** : les cinq écrans de phase (section 5.3), en commençant par Sélection → Initiative → Combat actif (la phase Surprise et l'écran de Résolution peuvent suivre en second temps).
8. **Frontend — Vues publiques** : adaptation de `TableScreenView.jsx` et `PlayerApp.js` au payload filtré.
9. **Tests manuels de bout en bout** : un combat complet simulé (2 PJ + 1 PNJ allié + 3 monstres de Bestiaire), en vérifiant explicitement qu'aucune donnée monstre ne fuite côté joueur (inspection réseau/WebSocket).

---

## 11. ÉTAT ACTUEL DU MODULE DE COMBAT (RÉALISÉ & OPÉRATIONNEL)

> [!NOTE]
> **Statut de l'Implémentation : 100% Finalisé & Intégré.**
> L'ensemble du module de combat D&D 5e, la gestion du Bestiaire, l'intégration des véhicules/convois, le déclenchement depuis le graphe de quêtes et le filtrage de confidentialité Socket.IO sont entièrement développés, vérifiés et validés.

### 11.1 Résumé Synthétique de ce qui est Réalisé

Le module de combat de GM Helper V2 a été transformé d'un simple tracker minimaliste en un **moteur de gestion de combat D&D 5e complet et réactif**. Il assiste le MJ dans l'animation des rencontres sur table sans imposer de calculs de dés virtuels, tout en maintenant une synchronisation temps réel sécurisée avec l'écran TV et les interfaces des joueurs.

| Fonctionnalité | Description & Comportement Réalisé |
| :--- | :--- |
| **Machine à 5 Phases** | Fluidité complète entre : 1. Préparation ➔ 2. Surprise ➔ 3. Saisie d'Initiative ➔ 4. Combat Actif (Tour par tour) ➔ 5. Résolution & Bilan. |
| **Création de Zéro** | Possibilité d'instancier directement un combat vierge depuis l'état vide via le bouton `⚔️ Créer un Combat de Zéro`. |
| **Bestiaire Indépendant** | Onglet dédié `🐺 Bestiaire` dans la sidebar (`/gm/campaigns/:id/bestiary`) avec gestion des stat blocks (CA, PV, FP, Vitesse, Attaques, Capacités, Favoris, Filtres). |
| **Intégration Véhicules & Équipages** | L'ajout d'un véhicule (`sourceType: "vehicle"`) injecte automatiquement le véhicule ET les membres de son équipage (`VehicleCrewSlot` ➔ `Character`) comme combattants distincts. |
| **Intégration Quêtes (`QuestNode`)** | Les nœuds de quête de type `"combat"` contiennent un `combatTemplate`. Le bouton `⚔️ Lancer Combat` génère automatiquement l'encontre et redirige le MJ vers le tracker. |
| **Priorité des Stats PNJ** | Résolution automatique : Fiche du PNJ (CA/PV) ➔ repli sur le Bestiaire lié (`bestiaryId`) ➔ repli sur valeurs manuelles. |
| **Confidentialité Temps Réel** | Émission Socket.IO dédoublée côté serveur : le MJ voit toutes les CA/PV, tandis que la TV et les Joueurs reçoivent un payload filtré sans CA ni PV pour les monstres hostiles (`isVisibleToPlayers === false`). |

---

### 11.2 Architecture et Fonctionnement Détaillé

```mermaid
graph TD
    subgraph Frontend [Client React / Zustand]
        CT[CombatTracker.jsx]
        BM[BestiaryManager.jsx]
        QGE[QuestGraphEditor.jsx]
        TSV[TableScreenView.jsx]
        LS[LiveSession.jsx (Joueurs)]
        Store[gmStore.js]
    end

    subgraph Backend [Express API & Socket.IO]
        RouteEnc[encounters.js API]
        RouteBest[bestiary.js API]
        RouteQuest[quests.js API]
        SocketHandler[sockets.js / IO Rooms]
    end

    subgraph Database [Prisma SQLite]
        DB_Enc[(Encounter & Combatant)]
        DB_Best[(Bestiary)]
        DB_NPC[(NPC & Character)]
        DB_Veh[(Vehicle & Crew)]
        DB_Node[(QuestNode combatTemplate)]
    end

    CT <--> Store
    BM <--> Store
    QGE -->|spawnEncounterFromNode| Store

    Store <--> RouteEnc
    Store <--> RouteBest
    Store <--> RouteQuest

    RouteEnc <--> DB_Enc
    RouteEnc <--> DB_NPC
    RouteEnc <--> DB_Veh
    RouteBest <--> DB_Best
    RouteQuest <--> DB_Node

    RouteEnc -->|encounter_state_changed| SocketHandler
    SocketHandler -->|Full Payload| CT
    SocketHandler -->|Filtered Payload| TSV
    SocketHandler -->|Filtered Payload| LS
```

#### 1. Le Moteur de Phase (`CombatTracker.jsx` & `encounters.js`)
- **Phase 1 — Préparation (`planned`)** : Le MJ ajoute des participants depuis 4 sources (PJ, PNJ, Bestiaire avec quantité `count`, Véhicules avec équipage automatique, ou Saisie Manuelle). Une valeur de repli défensive `(enc.phase || enc.status || 'planned')` garantit la rétrocompatibilité avec les anciens enregistrements de la base de données.
- **Phase 2 — Check de Surprise (`surprise_check`)** : Si `surpriseEnabled` est coché, le MJ définit individuellement quels combattants sont surpris (`isSurprised`). Au Round 1 du combat actif, le tour d'un combattant surpris est automatiquement indiqué comme passé.
- **Phase 3 — Saisie d'Initiative (`initiative_entry`)** : Champs numériques pré-remplis avec tri automatique décroissant au fur et à mesure de la saisie. En cas d'égalité, le MJ réordonne si besoin.
- **Phase 4 — Combat Actif (`active`)** :
  - Surbrillance visuelle du combattant actif (`activeCombatantIndex`).
  - Boutons de modification rapide de PV (`+1`, `-1`, `+5`, `-5` ou valeur directe).
  - Gestion des 14 conditions standard D&D 5e (Aveuglé, Charmé, À terre, Incapable d'agir, etc.).
  - Affichage de la Classe d'Armure (CA) à côté de chaque combattant (visible uniquement par le MJ).
  - Contrôle du masquage/démasquage individuel (`isVisibleToPlayers`).
- **Phase 5 — Résolution (`completed`)** : Génération d'un résumé de combat (durée en rounds, combattants tombés à 0 PV, bilan final) et archivage.

#### 2. Gestionnaire du Bestiaire (`BestiaryManager.jsx` & `bestiary.js`)
- Situé dans la barre latérale du MJ sous l'onglet `🐺 Bestiaire`.
- Modèle `Bestiary` Prisma avec : `name`, `category` (`humanoid`, `beast`, `undead`, `construct`, `aberration`, `other`), `challengeRating`, `armorClass`, `hpMax`, `hpFormula`, `speed`, `stats` (STR, DEX, CON, INT, WIS, CHA), `attacks` (Array JSON), `traits`, `savingThrows`, `isFavorite`.
- Protégé contre les suppressions d'entrées actuellement engagées dans un combat actif (`phase: "active"`).

#### 3. Importation Automatique des Équipages de Véhicules
- Lors de l'appel à `POST /encounters/:id/combatants/bulk` avec un combattant de type `sourceType: "vehicle"`, le backend interroge Prisma pour récupérer le véhicule et ses `crewSlots` liés à des `Character`.
- Le backend crée automatiquement un enregistrement `EncounterCombatant` pour le véhicule lui-même, puis crée un enregistrement pour chaque membre d'équipage présent à bord avec son rôle (ex. *"Conducteur : Kael"*), configuré automatiquement en `isVisibleToPlayers: true`.

#### 4. Intégration dans le Graphe de Quêtes (`QuestGraphEditor.jsx` & `quests.js`)
- Les nœuds de quête de type `"combat"` enregistrent leur configuration dans `combatTemplate` (JSON).
- Le bouton `⚔️ Lancer Combat` disponible sur le nœud appelle la route `POST /api/v1/gm/quests/nodes/:nodeId/spawn-encounter`.
- L'encontre est instanciée avec tous ses combattants pré-configurés et le MJ est instantanément redirigé vers l'onglet **Combat**.

#### 5. Filtrage Temps Réel et Sécurité (Socket.IO)
- Lorsque le combat évolue, le backend exécute `filterEncounterForPublic(encounter)`.
- **Salon MJ (`campaign:${campaignId}:gm`)** ➔ Reçoit l'objet `Encounter` complet (CA, PV exacts, conditions, notes privées).
- **Salons Joueur et Écran TV (`campaign:${campaignId}:player` & `table_screen:*`)** ➔ Reçoivent l'objet filtré : la Classe d'Armure (`armorClass`), `hpCurrent` et `hpMax` de tous les combattants ayant `isVisibleToPlayers === false` sont **supprimés du payload réseau**. Il est techniquement impossible pour un joueur d'inspecter les PV/CA d'un monstre via la console du navigateur.

---

### 11.3 Fichiers Déployés & Modifiés

- **Base de données & Modèles** : `server/prisma/schema.prisma`
- **Validation Zod** : `server/src/validators/schemas.js`
- **Routes API Backend** :
  - `server/src/routes/gm/bestiary.js` *(nouveau)*
  - `server/src/routes/gm/encounters.js` *(refondu)*
  - `server/src/routes/gm/quests.js` *(étendu avec `spawn-encounter`)*
  - `server/src/index.js` *(enregistrement de `gmBestiaryRoutes`)*
- **Store Frontend** : `client/src/store/gmStore.js` *(étendu avec actions Bestiaire, Combat & Véhicules)*
- **Composants Interfaces MJ** :
  - `client/src/components/gm/BestiaryManager.jsx` *(nouveau)*
  - `client/src/components/gm/CombatTracker.jsx` *(refondu 5 phases + fallback défensif)*
  - `client/src/components/gm/QuestGraphEditor.jsx` *(bouton de lancement de combat)*
  - `client/src/routes/GmApp.jsx` *(enregistrement de la route `/bestiary`)*
- **Composants Interfaces Publiques** :
  - `client/src/components/table/TableScreenView.jsx` *(bandeau d'initiative filtré)*
  - `client/src/components/player/LiveSession.jsx` *(notifications de tour de jeu joueur)*

