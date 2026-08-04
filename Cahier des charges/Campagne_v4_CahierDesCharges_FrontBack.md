# Cahier des charges — Front-end / Back-end
## Support natif de la quête "La Course du Sel" dans le Système de Quêtes v2

### 1. Contexte

`Campagne_v3_QuestData.json` a été étendu sur 6 révisions successives
au-delà du schéma d'origine du Système de Quêtes v2 (voir les notes
v4/v5/v6 dans `importInstructions`). Ces extensions ont, jusqu'ici,
été conçues pour être **ignorées sans casser l'import** — un filet de
sécurité, pas une solution. Ce document liste ce qu'il faudrait
construire côté back-end et front-end pour que ces mécaniques soient
réellement gérées par l'outil plutôt que simplement tolérées dans le
JSON, et lues à la main par le MJ pendant la partie.

Ce n'est pas une critique du contenu de la quête : c'est une demande
d'alignement de l'outil sur ce que la conception de quêtes réclame
déjà aujourd'hui, et réclamera probablement encore pour la suite de la
campagne.

### 2. Constat structurel prioritaire — séparer Template et Instance

**Le problème.** Le fichier mélange, dans les mêmes objets, du
contenu de conception statique (texte des scènes, PNJ, mécaniques) et
de l'état dynamique d'une partie en cours (`reached`, `currentLevel`,
`status`, `relationshipState`). Résultat concret : `currentLevel: 0`
sur `threat_ver_des_sables` n'a de sens qu'après le début d'une
partie précise, mais vit dans le même fichier que la description de
la quête elle-même. Si la campagne est rejouée à une autre table (ou
que la même table reprend après une pause), il n'existe aucun moyen
propre de repartir d'un état vierge sans dupliquer tout le fichier.

**Recommandation.** Scinder en deux couches :
- **QuestTemplate** (statique, versionné, réutilisable) : tout ce qui
  décrit la quête elle-même — `QuestNode`, `QuestNodeConnection`,
  `QuestNPCProfile`, `QuestMechanicNotes`, les champs `condition` et
  `thresholds`.
- **QuestInstance / QuestPlaythrough** (dynamique, une par table) :
  `reached` par nœud, `currentLevel` du threat tracker,
  `relationshipState` par faction, `status` des objectifs, le
  `captainSelection` réellement choisi, et le contenu rempli après
  coup (`secretMissionTemplate`, la route réellement empruntée).

Cette séparation conditionne une bonne partie des besoins listés
ci-dessous — elle est notée **BE-1** et devrait être traitée en
premier.

### 3. Besoins back-end

| ID | Besoin | Description | Champ(s) JSON concerné(s) | Priorité |
|---|---|---|---|---|
| BE-1 | Séparer Template / Instance | Voir section 2. | Tout le fichier | **P0** |
| BE-2 | Primitive "clock" générique | `QuestThreatTracker` réinvente une horloge à seuils (`currentLevel`/`maxLevel`/`thresholds`) à la main. En faire un type de donnée réutilisable pour d'autres quêtes plutôt qu'une structure ad hoc à celle-ci. | `QuestThreatTracker`, `QuestNodeThreatEffect` | P1 |
| BE-3 | Relation NPC formalisée | `QuestNPCProfile` (fiche de voix, par `npcId`) et `QuestNPCLink` (rôle par nœud) doivent être jointes manuellement aujourd'hui. Modéliser une vraie clé étrangère `npcId` avec jointure native. | `QuestNPCProfile`, `QuestNPCLink` | P1 |
| BE-4 | Champ `condition` structuré | Actuellement du texte libre ("route_longue", "si l'affrontement a lieu"). Sans grammaire structurée, aucun moteur ne peut évaluer ces conditions automatiquement. Définir une syntaxe minimale (`route == "longue"`, `relationship.loups_de_sel == "hostile"`). | `QuestNodeThreatEffect.condition`, labels de `QuestNodeConnection` | P1 |
| BE-5 | Pool de scènes comme primitive | Le pool de l'Étape 1 est encodé via des connexions "par défaut" + du texte explicatif (`poolNotes`) plutôt qu'une vraie structure de tirage. Créer un type `QuestScenePool` (liste de nœuds, effectif à tirer selon condition, nœud de clôture obligatoire). | `QuestNode.poolNotes`, `QuestMechanicNotes.scenePoolFramework` | P1 |
| BE-6 | Table de tirage aléatoire | `floatingEventDrawTable` est un dé d8 décrit en prose dans `QuestMechanicNotes`. En faire un type `QuestRandomTable` (face → nœud cible) que le back-end peut tirer lui-même et enregistrer dans l'Instance. | `QuestMechanicNotes.floatingEventDrawTable` | P2 |
| BE-7 | Cross-références typées | `payoffNodeId`, `branchNodeId`, `linkedNodeId` sont des identifiants texte non validés. Les typer comme de vraies relations (avec vérification d'intégrité référentielle à l'import, comme déjà fait manuellement lors de nos validations). | `QuestNodeReward.payoffNodeId`, `QuestNode.generativeFailure.branchNodeId` | P1 |
| BE-8 | Séparation contenu joueur / MJ | `Quest.gmNotes` mélange changelog technique et secrets de scénario ("SECRET CENTRAL..."). Un champ texte unique ne permet aucun contrôle d'accès. Séparer `gmSecrets` (jamais exposé à un écran partagé) de `gmChangelog` (technique, sans risque). | `Quest.gmNotes` | **P0** |
| BE-9 | Métadonnées de calibrage en tête de quête | `tableCalibration` (nb de séances, nb de joueurs, système de règles) vit dans `QuestMechanicNotes` au même niveau que tout le reste. Le remonter en propriétés de premier niveau sur `Quest` (`targetSessionCount`, `targetPlayerCount`, `ruleSystem`) pour qu'un outil de recherche/filtrage de quêtes puisse s'en servir. | `QuestMechanicNotes.tableCalibration` | P2 |
| BE-10 | Couche de conversion de système de règles | `ruleSystemConversion` mappe des compétences génériques vers DD 5e en dur dans le JSON. À terme, ce devrait être un module de conversion séparé (système générique → système cible), réutilisable pour Pathfinder, un système maison, etc. sans dupliquer tout le texte de la quête. | `QuestMechanicNotes.ruleSystemConversion` | P2 |

### 4. Besoins front-end

| ID | Besoin | Description | Priorité |
|---|---|---|---|
| FE-1 | Bascule vue Joueurs / vue MJ | Conséquence directe de BE-8 : un mode d'affichage qui masque tout secret si l'écran est projeté ou partagé. Sans ça, `gmNotes` reste un champ que le MJ doit éviter d'afficher lui-même, à la main. | **P0** |
| FE-2 | Widget horloge de menace | Un cadran visuel (0 à `maxLevel`) avec incrémentation en un clic depuis les nœuds concernés, et une alerte automatique au franchissement d'un seuil (ex. "seuil 5/6 atteint : signe rapproché — voir `QuestThreatTracker.thresholds`"). | P1 |
| FE-3 | Tracker de relations de factions | Un sélecteur à 3 états (hostile / neutre / allié) par faction, visible en permanence, qui filtre ou surligne automatiquement le contenu conditionnel des nœuds de paiement (`node_3b`, `node_3c`). | P1 |
| FE-4 | Fiche PNJ au survol/clic | Quand un nœud lié à un PNJ (`QuestNPCLink`) est ouvert, afficher automatiquement sa fiche de voix (`QuestNPCProfile`) en aparté — le MJ ne doit pas avoir à chercher dans un autre tableau. | P1 |
| FE-5 | Bouton de tirage aléatoire | Pour `floatingEventDrawTable` : un bouton "tirer un événement" qui lance le d8 virtuellement, affiche le résultat, et marque le nœud correspondant comme proposé (sans forcer son déclenchement). | P2 |
| FE-6 | Tableau de bord de session | Vue condensée reprenant l'aide-mémoire déjà écrit à la main dans le document de lore (route choisie, pool joué, échecs génératifs déclenchés, relations, horloge, budget d'apparitions, événements joués, capitaine désigné) — consultable en un clic pendant la partie plutôt que dans le texte. | **P0** |
| FE-7 | Affichage conditionnel des connexions | Griser ou masquer les branches du graphe qui ne s'appliquent pas à l'état courant de l'Instance (ex. connexions "si route_longue" quand route_rapide a été choisie), une fois BE-4 en place. | P1 |
| FE-8 | Aide interactive nomination du capitaine | À `node_end_success`, afficher `captainSelection` comme un panneau dédié (déclencheur, méthode de résolution, filet de secours, leviers anti-conflit en accès rapide) plutôt que du texte brut noyé dans le nœud. | P1 |
| FE-9 | Écran de debrief post-session | Un écran dédié affiché automatiquement à l'atteinte d'un nœud de fin (`node_end_success`/`node_end_alt`), reprenant `postSessionDebrief.questions` en mode "un à la fois" pour un vrai tour de table. | P2 |
| FE-10 | Éditeur de missions secrètes post-création | Formulaire structuré basé sur `secretMissionTemplate.fields`, à remplir une fois les personnages créés — actuellement un simple texte à trous dans le document. | P2 |
| FE-11 | Panneau de conversion de règles | Bascule "afficher les jets en DD 5e" qui traduit à la volée les `[PROBLÈME]` génériques via `ruleSystemConversion.skillMapping`, sans dupliquer le texte source. | P2 |
| FE-12 | Checklist des pistes d'enquête | Sous `obj_decouvrir_incident`, afficher `investigationLeads` comme une checklist cochable, avec le contenu révélé qui apparaît seulement une fois la piste déclenchée en jeu. | P2 |

### 5. Priorisation globale

- **P0 (bloquant, à traiter avant toute nouvelle quête de ce type)** :
  BE-1, BE-8, FE-1, FE-6. Sans ces quatre éléments, le MJ continue de
  gérer les secrets et le suivi d'état à la main malgré l'outil.
- **P1 (fort impact sur l'usage réel à table)** : BE-2 à BE-5, BE-7,
  FE-2 à FE-4, FE-7, FE-8.
- **P2 (confort, ou utile seulement si l'outil sert à plusieurs
  quêtes similaires)** : BE-6, BE-9, BE-10, FE-5, FE-9 à FE-12.

### 6. Dette technique si non traité

Sans BE-1/BE-8, chaque nouvelle table qui rejoue une quête de ce type
oblige à dupliquer le fichier entier ou à réinitialiser l'état à la
main, avec un risque réel de secrets MJ affichés par erreur sur un
écran partagé. Sans FE-6, tout l'aide-mémoire déjà écrit dans le
document de lore reste un pense-bête papier que l'outil n'exploite
pas — le travail de conception (horloge, relations, pool, budget
d'apparitions) existe dans les données mais reste invisible pendant la
partie elle-même, là où il compte le plus.
