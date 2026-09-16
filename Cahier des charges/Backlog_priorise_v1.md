# Backlog priorisé — Plaisir de jeu GM Helper

**Version :** 1.0 — 16 septembre 2026
**Rapport détaillé :** `Cahier des charges/Analyse_et_propositions_plaisir_de_jeu.html`
**Objectif :** rendre le temps réel fonctionnel, fermer la boucle de gratification, puis transformer la maîtrise du jeu en jeu.

Chaque ticket est autonome : contexte, fichier à modifier, action, critère d'acceptation.
Légende effort : `S` = moins d'une demi-journée · `M` = 1 à 3 jours · `L` = plus d'une semaine.

---

## Vague 1 — Réparer la table

> Objectif de la vague : les événements diffusés par le MJ atteignent réellement les joueurs et l'écran de table.
> Sans cette vague, aucune autre amélioration n'est mesurable.

### V1-01 · Aligner les noms d'événements socket `S` — **bloquant**

**Contexte.** Le serveur n'écoute que `join_campaign` (`server/src/sockets.js:57`). Les clients émettent `join:campaign` (`client/src/components/player/LiveSession.jsx:41`, `client/src/components/player/PlayerMapView.jsx:35`) et `join:table_screen` (`client/src/components/table/TableScreenView.jsx:53`). Aucun écouteur serveur pour ces deux noms : les joueurs ne rejoignent jamais la room `campaign:{id}`.

**Action.**
- Choisir une convention unique, la documenter en tête de `server/src/sockets.js`, et l'appliquer partout.
- Recommandation : conserver `join_campaign` (déjà implémenté et utilisé par `ConvoyDashboard.jsx:71`) et `join_table_screen`.
- Corriger les trois appels clients.

**Acceptation.**
- Un joueur connecté en session live reçoit un `session:message` émis par le MJ.
- Un joueur reçoit un `spotlight_update`.
- Aucune occurrence de `join:campaign` ni de `join:table_screen` ne subsiste dans `client/src`.

---

### V1-02 · Réparer le handshake de l'écran de table `S` — **bloquant**

**Contexte.** Le client pose `socket.auth = { tableScreenToken: token }` (`TableScreenView.jsx:49`), le serveur lit `handshake.auth.token` et `handshake.auth.isTableScreen` (`sockets.js:8-9`). Le jeton est `undefined`, la connexion est refusée avec « Authentication error: Token missing ». L'écran de table ne fonctionne pas.

**Action.** Aligner le contrat d'authentification entre client et serveur, puis valider le jeton contre `Session.tableScreenToken` en base avant d'autoriser l'entrée dans la room `table_screen:{token}`.

**Acceptation.**
- `/table/:token` s'authentifie et reçoit `spotlight_update`, `quest_node_timer_started` et `encounter_state_changed_public`.
- Un jeton invalide ou dont la session n'est pas `live` est refusé.

---

### V1-03 · Corriger la fuite cross-campagne `S`

**Contexte.** `encounter_state_changed_public` est diffusé via `io.emit()` (`server/src/routes/gm/encounters.js:69`), donc vers **tous les sockets connectés, toutes campagnes confondues**.

**Action.** Remplacer par une émission ciblée sur `campaign:{campaignId}` et `table_screen:{token}`.

**Acceptation.** Deux campagnes actives simultanément ne reçoivent pas mutuellement leurs états de combat.

---

### V1-04 · Retirer le hook illégal de `LiveSession` `S` — **bloquant**

**Contexte.** `const [combatState, setCombatState] = useState(null)` est déclaré à l'intérieur d'un `useEffect` (`LiveSession.jsx:74`). Violation des règles des hooks : l'onglet Session Live plante au montage. Le code est de surcroît mort (`combatState` n'est jamais rendu).

**Action.** Remonter la déclaration au niveau du composant si l'affichage est souhaité, sinon supprimer le bloc et son écouteur.

**Acceptation.** L'onglet Session Live s'affiche sans erreur console et sans écran blanc.

---

### V1-05 · Corriger les notes privées joueurs `S` — **bloquant + sécurité**

**Contexte.** `server/src/routes/player/privateNotes.js` utilise `req.user.userId` (lignes 14, 35, 62, 86) alors que le middleware d'authentification ne pose que `req.user.id` (`middleware/auth.js:27-31`). Prisma ignore un filtre `undefined` : le GET renvoie la **première fiche de la campagne** (fuite entre joueurs) et le PUT/DELETE échoue toujours en 403.

**Action.** Remplacer `req.user.userId` par `req.user.id`. Vérifier au passage qu'aucune autre route ne fait la même erreur (`grep -rn "user.userId" server/src`).

**Acceptation.** Chaque joueur ne lit et ne modifie que ses propres notes.

---

### V1-06 · Réparer le lanceur de dés joueur `M` — **bloquant**

**Contexte.** `DiceRoller.jsx` envoie `type: 'skill_check'` avec `statName`/`baseDice` (lignes 16-24), or le schéma Zod attend `skill`/`expression` (`validators/schemas.js:526-534`) et le service lève « Valid skill required for skill check » (`services/dice.js:163-166`). Le type `custom` n'existe pas dans l'énum du schéma : rejet 400. Le toggle « Secret » n'est pas dans le schéma et le serveur force `visibleToAll: true` (`services/dice.js:53`).

**Action.**
- Aligner le payload client sur le schéma serveur.
- Implémenter réellement le mode secret (jet privé, visible du MJ seul).
- Émettre et **écouter** `dice:rolled` côté client : aucun composant ne l'écoute aujourd'hui. Un flux de jets partagé est nécessaire pour que l'écran de table et les autres joueurs voient le résultat.
- Détecter le 20 naturel et le 1 critique et les marquer dans le résultat.

**Acceptation.**
- Un jet de caractéristique depuis le téléphone renvoie un résultat calculé par le serveur.
- Le jet apparaît dans le journal de la table.
- Un 20 naturel est visuellement distingué.

---

### V1-07 · Restreindre le déblocage de compétence `S` — **sécurité**

**Contexte.** La route `POST /skill-trees/characters/:id/unlock` (`server/src/routes/gm/skillTrees.js:9`) n'a que `requireCampaignAccess`, ni `requireGM`, ni contrôle de propriété du personnage. Un joueur peut dépenser les points d'un autre personnage.

**Action.** Autoriser soit un MJ de la campagne, soit le propriétaire du personnage. Recalculer `level` et `proficiencyBonus` dans la même transaction (voir V2-03).

**Acceptation.** Un joueur ne peut pas modifier le personnage d'un autre joueur ; le MJ le peut.

---

### V1-08 · Encadrer les copies de quête par une transaction `M`

**Contexte.** L'instanciation et la duplication d'une quête enchaînent des dizaines de créations non transactionnelles (`gm/quests.js:857-906` et `1348-1519`). Une interruption laisse un graphe à moitié copié. Seule `executeQuestResolution` utilise `prisma.$transaction` (`services/questTimers.js:93`).

**Action.** Envelopper les deux opérations dans un `$transaction`.

**Acceptation.** Une instanciation interrompue ne laisse aucun nœud orphelin en base.

---

### V1-09 · Nettoyages rapides `S`

- Retirer le doublon `deleteQuest` (`gmStore.js:454` et `:547` — le second masque le premier).
- Corriger la propriété CSS `justify:` en `justifyContent:` : `CombatTracker.jsx:426,736,842,898,957`, `BestiaryManager.jsx:165,424,481`, `QuestManager.jsx:140`, `SessionDashboard.jsx:110`.
- Unifier la liste des conditions : `CombatTracker.jsx:26-41` en compte 14, `CombatantCard.jsx:17-29` en compte 11 (manquent Charmé, Assourdi, Incapable d'agir). Extraire dans un module partagé.
- Supprimer le texte narratif codé en dur du nœud 0.a dans `QuestNodeCard.jsx:553`, qui s'affiche dans toutes les épreuves progressives.

---

## Vague 2 — Fermer la boucle

> Objectif de la vague : l'état de partie devient fiable et partagé, et les joueurs reçoivent enfin quelque chose.

### V2-01 · Persister l'état de séance en base `M` — **fondation de tout le reste**

**Contexte.** `doomPool`, `activeComplications` et `customHazardCards` vivent dans le `localStorage` (`gmStore.js:795-870`). La progression de la Course du Sel également (`SaltRaceTabletop.jsx:41-149`). Les messages diffusés ne sont pas stockés (`routes/gm/sessions.js:146`).

**Action.** Ajouter un modèle Prisma `SessionState` (ou étendre `Session`, dont le champ `summary` existe déjà et n'est jamais écrit) :

```prisma
model SessionState {
  id            String   @id @default(cuid())
  sessionId     String   @unique
  session       Session  @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  doomPool      Int      @default(3)
  complications Json     @default("[]")
  customCards   Json     @default("[]")
  wormClock     Int      @default(0)
  convoyState   Json     @default("{}")
  updatedAt     DateTime @updatedAt
}

model SessionLog {
  id        String   @id @default(cuid())
  sessionId String
  session   Session  @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  kind      String   // message | spotlight | complication | reward | dice | node
  payload   Json
  createdAt DateTime @default(now())
}
```

Puis rediriger les actions du store vers l'API et diffuser les changements sur la room de campagne.

**Acceptation.**
- Un rafraîchissement du navigateur du MJ conserve la Menace et les complications.
- Un second appareil connecté au même compte voit le même état.
- Les joueurs voient la Menace courante.

---

### V2-02 · Bouton « Distribuer les récompenses » `M` — **plus fort gain de plaisir**

**Contexte.** `QuestNodeReward` définit cinq types (`item`, `gold`, `xp`, `npcFavor`, `information`) et une seule route de création existe (`gm/quests.js:1009`). Aucune distribution n'a jamais lieu. `Quest.xpReward`, `goldReward` et `itemRewards` ne sont jamais appliqués.

**Action.**
- Nouvelle route `POST /gm/campaigns/:id/quests/:questId/nodes/:nodeId/distribute` acceptant `{ characterIds[], rewards[] }`.
- Appliquer réellement : entrée dans `CharacterInventoryItem`, mise à jour de `Character.currency`, incrément d'XP, entrée de faveur dans `QuestFactionProgress`, écriture d'une note d'information.
- Émettre un événement vers le joueur concerné + une entrée `SessionLog`.
- Interface : un bouton sur le nœud atteint, une modale pré-remplie depuis les récompenses prévues, un retour visuel côté joueur.

**Acceptation.** Distribuer une récompense modifie effectivement la fiche du joueur, le notifie, et laisse une trace dans le journal de séance.

---

### V2-03 · Recalculer la progression au déblocage `S`

**Contexte.** `gm/skillTrees.js:42-48` met à jour `unlockedSkills` et `skillPoints` sans recalculer `level` ni `proficiencyBonus`. Le joueur dépense ses points et son niveau affiché ne bouge pas. `utils/hybridProgression.js` contient la logique mais n'est pas appelée ici.

**Action.** Appeler `hybridProgression` dans la même transaction que le déblocage.

**Acceptation.** Débloquer un nœud met à jour le niveau et le bonus de maîtrise affichés.

---

### V2-04 · Synchroniser les PV de combat vers la fiche `S`

**Contexte.** Les PV d'un PJ modifiés pendant un combat ne sont pas écrits dans `Character` (`encounters.js:430-439`) : seul un événement socket est émis. Les dégâts ne vivent que sur `EncounterCombatant`. Seul le PNJ est resynchronisé.

**Action.** Écrire les PV du PJ en base à la clôture du combat (et à la fin de chaque round si le coût est acceptable).

**Acceptation.** Après un combat, la fiche du joueur affiche les PV réellement perdus.

---

### V2-05 · « Précédemment » automatique `M` — **meilleur ratio de la vague**

**Contexte.** `Session.summary` existe dans le schéma et n'est jamais écrit. Aucun écran ne propose de récapitulatif. Le résumé de fin de combat est écrit en base (`encounters.js:629-643`) et jamais relu.

**Action.** Bouton « Clore la séance » qui compose un récapitulatif à partir des faits **déjà en base** — aucune génération de texte nécessaire :
- nœuds atteints et nœuds échoués de la séance,
- jets notables (20 naturels, 1 critiques) depuis l'historique de dés,
- combats terminés et pertes, depuis `Encounter.summary`,
- récompenses distribuées,
- horloges de menace ayant franchi un seuil,
- paramètres de cités modifiés via `CityParameterHistory`.

Rendu éditable par le MJ, puis diffusé aux joueurs et affiché en ouverture de la séance suivante.

**Acceptation.** Clore une séance produit un récapitulatif fidèle, modifiable, et consultable par les joueurs.

---

### V2-06 · Notifications et annulation `S`

**Contexte.** `alert()` et `window.confirm()` sont utilisés dans 27 composants. Les erreurs sont avalées en `console.error` (par exemple `gmStore.js` dans presque toutes ses méthodes). Aucun système de notification.

**Action.** Introduire un conteneur de notifications avec états `success` / `error` / `warning`, et une action d'annulation pour les opérations destructrices. Remplacer progressivement les `alert`/`confirm` en commençant par les suppressions de quête et de campagne.

**Acceptation.** Supprimer une quête de 43 nœuds propose une annulation, et aucune boîte de dialogue native ne subsiste dans les parcours principaux.

---

### V2-07 · Spotlight depuis la bibliothèque `S/M`

**Contexte.** `SpotlightController.jsx` exige une URL d'image saisie à la main, alors que le projet contient déjà les illustrations des PNJ, des lieux, des cités et du bestiaire.

**Action.** Remplacer le champ URL par un sélecteur sur les ressources existantes, avec option de révélation progressive (masque sur une illustration pour un indice).

**Acceptation.** Diffuser l'illustration d'un PNJ se fait en deux clics sans connaître d'URL.

---

## Vague 3 — Le jeu

> Objectif de la vague : la maîtrise du jeu devient un jeu, dont le score est décerné par les joueurs.

### V3-01 · Cockpit de session plein écran `L`

**Contexte.** 14 entrées dans le sidebar (`routes/GmApp.jsx:90-114`), toutes au même niveau. Aucune vue « je suis en séance ». Le MJ navigue au lieu de mener.

**Action.** Nouvelle route `/gm/campaigns/:id/run`, sans sidebar, avec panneaux dockables : nœud courant en grand, lanceur de dés, Menace, horloges, initiative, PNJ de la scène, complications actives, spotlight, chronomètre de séance, bouton « Clore la séance ».

**Acceptation.** Une séance complète peut être menée sans quitter cette route.

---

### V3-02 · Palette de commandes universelle `M`

**Contexte.** `GlobalSearch.jsx` existe mais ne fait que chercher. La touche `M` ouvre le tiroir de decks (`GmApp.jsx:46-61`).

**Action.** Étendre en palette d'actions avec verbes : ouvrir un nœud, ajuster la Menace, jouer une carte, révéler un PNJ, tirer un événement, lancer un jet pour une entité, pousser un spotlight.

**Acceptation.** Les actions les plus fréquentes de séance sont accessibles en moins de deux secondes sans souris.

---

### V3-03 · Règle des trois secondes `L`

**Contexte.**
- Créer une rencontre : 4 clics, plus trois sélections par combattant, puis saisie manuelle de chaque initiative (`CombatTracker.jsx:592-931`).
- Le tirage automatique d'initiative n'existe que dans l'Arène et seulement pour les PNJ (`TacticalCombatArena.jsx:110-128`).
- Ajouter un combattant en cours de combat est impossible (formulaire disponible uniquement en phase `planned`).
- Lancer un dé oblige à quitter la vue (`GMDicePanel.jsx` est un composant séparé).

**Action.**
- Généraliser le tirage automatique d'initiative à tous les combattants.
- Permettre l'ajout de renforts à tout moment, y compris en combat actif.
- Ajouter une barre de dés contextuelle toujours visible, pré-calculée depuis le nœud courant — les champs `jetSkill` et `jetDifficulty` sont déjà en base.

**Acceptation.** Créer et démarrer une rencontre prête à jouer prend moins de 30 secondes.

---

### V3-04 · Bouton « Résoudre la scène » `M`

**Action.** Un geste qui enchaîne : jet de dé, comparaison au DD, narration du résultat, application des effets (PV, menace, faction, récompense), puis avancée du nœud dans le graphe.

**Acceptation.** Une scène d'épreuve se résout en un clic et le graphe avance.

---

### V3-05 · Le système d'Éclat `L`

Voir le rapport, section 5. Découpage recommandé :

| Sous-tâche | Détail | Effort |
|---|---|---|
| Modèle de données | `SessionScore` (éclats par axe, par séance), `GmAchievement`, `SessionChallenge` | `S` |
| Boucle des cinq temps | Rappel, tour, escalade, récompense, débrief | `M` |
| Combo du co-pilote | Scorer les 4 phases de `DIRECTOR_PHASES` (`SaltRaceTabletop.jsx:15-20`) | `S` |
| Courbe de tension | Exploiter `QuestNode.pacingTag` comme objectif mesuré | `M` |
| Débrief voté | Les joueurs répondent sur leur téléphone et décernent un Éclat par axe | `M` |
| Succès | Les 9 succès du rapport, déclenchés sur des faits déjà observables | `M` |
| Défis de séance | Purement déclaratifs, doublent le gain d'Éclat | `S` |
| Titres et paliers | Débloquent des outils, jamais du contenu indispensable | `S` |
| Carte « Non » | Une annulation de complication par séance, coûte 2 Éclats au MJ | `S` |
| Contrat de table | Carte X et signal de pause, configurables et visibles par tous | `S` |

**Acceptation.** À la fin d'une séance, le MJ connaît son score, les axes qui ont le mieux fonctionné et l'axe à travailler — sans avoir rien saisi manuellement.

---

### V3-06 · Écran de table enrichi et ambiance `M`

**Contexte.** Aucun lecteur audio dans le projet (aucune occurrence de `audio`, `howler` ou `.mp3`). L'écran de table n'affiche qu'une image.

**Action.**
- Bande son d'ambiance pilotée depuis le cockpit (nappe du désert, bourrasque, moteur, cri du Ver).
- Carte du monde vivante, horloge du Ver en grand, position des convois rivaux.
- Affichage des récompenses au moment de leur distribution.

**Acceptation.** L'écran de table est regardable même quand aucune image n'est diffusée.

---

### V3-07 · Joueur : agence et visibilité `M`

- Bouton « C'est mon tour » : l'événement `encounter:your-turn` est déjà émis vers le bon joueur (`encounters.js:604`) et écouté par personne.
- Boutons avantage / désavantage : gérés par le serveur (`services/dice.js:204-210`), absents de l'interface.
- Inspiration héroïque : le booléen et le bouton existent (`CharacterSheet.jsx:182-185, 340-360`) mais n'ont **aucun effet mécanique**. Lui donner un pouvoir réel et le rendre dépensable.
- Pool de destin de groupe, jets de groupe, entraide entre joueurs : absents.
- Onglet « ce que vous savez » : objectifs de quête (aucune route joueur `quests`), rumeurs, indices révélés, PNJ connus.
- Carnet de bord auto-rempli.

**Acceptation.** Un joueur peut agir sur la table depuis son téléphone et sait toujours où il en est.

---

### V3-08 · Mobile-first réel `M`

**Contexte.** `SkillTreeViewer.jsx` utilise un panneau latéral fixe de 270 px, une hauteur figée à 650 px, un centrage sur `window.innerWidth/innerHeight` (ligne 284) et des gestionnaires de souris uniquement. Inutilisable au doigt.

**Action.** Rendre la visionneuse responsive, ajouter le support tactile (pointer events), supprimer la hauteur figée en mode embarqué.

**Acceptation.** Les arbres de compétences sont utilisables sur un téléphone en séance.

---

## Chantiers transverses

### T-01 · Fiabilité `M`

- Migrations : 2 migrations pour environ 50 modèles, le reste ayant été appliqué par `db push`. Historique incomplet et dérive probable.
- Aucun test : ni `server/tests`, ni script `test` dans `package.json`.
- Erreurs : la plupart des routes renvoient un 500 générique sans journalisation (`sessions.js:21`, `notes.js:27`, `gm/dice.js:53`).
- Dette : environ 28 scripts jetables à la racine de `server/`.

### T-02 · Sécurité `M`

- Le jeton d'accès JWT est stocké dans le `localStorage` (`authStore.js:5`), exposé au XSS.
- Le jeton d'écran de table est stocké en clair (`schema.prisma:792`), exposé par `GET /:id/table-screen-token` (`sessions.js:246`) et dans l'URL. Aucune expiration, aucune rotation.
- Le rate limiting existe (`index.js:87-105`) mais ne couvre que l'authentification.

### T-03 · Thème clair / sombre `M`

Toute la palette est sombre (`index.css:2-3`, `--bg-primary: #1a1a1a`) et de nombreux composants codent des fonds sombres en dur : `#222`, `#1e1e1e`, `#07090e`, `rgba(23,23,23,.95)`, `#0f1118`, `#0a0d14`, `#0d111a`, `#111`. Aucun `ThemeProvider`, aucune bascule.

**Action.** Introduire un jeu de variables par thème et purger les couleurs codées en dur. Note : `--color-primary-light` est utilisé (`LiveSession.jsx:197`) mais n'est pas défini dans `index.css`.

### T-04 · Cohérence linguistique `S`

Libellés anglais épars dans une interface française : `DiceRoller` (« Quick Rolls », « Custom Roll », « Recent Rolls »), `LiveSession` (« No Active Session », « GM Broadcasts », « Combat Active »), `SkillTreeViewer` (« Tier », « EFFET »).

---

## Ordre d'exécution conseillé

```
V1-01 ─┐
V1-02 ─┤
V1-03 ─┼──► V2-01 ──► V2-02 ──► V3-05 ──► V3-01
V1-04 ─┤      │          │                    │
V1-05 ─┤      │          └──► V2-05           └──► V3-03
V1-06 ─┤      └──► V3-01
V1-07 ─┘
```

Les tickets `V1-01` à `V1-07` se traitent en parallèle : ils touchent des fichiers distincts et débloquent collectivement toute la suite.

---

## Ce qu'il ne faut pas faire

- **Ne pas récompenser la défaite des joueurs.** Un score qui valorise la victoire du MJ contre la table détruit la table.
- **Ne pas scorer le volume.** Compter les jets, les combats ou les dés pousse au remplissage et punit les meilleures séances, celles d'introspection lente.
- **Ne pas créer un écran de score séparé.** Le score vit dans le cockpit, jamais à côté.
- **Ne pas placer de contenu indispensable derrière un palier.** Les titres débloquent du confort et de l'autorité narrative, jamais le cœur du jeu.
- **Ne pas gamifier au détriment de l'humain.** Le contrat de table (carte X, signal de pause) n'est pas optionnel sur un univers post-apocalyptique.
