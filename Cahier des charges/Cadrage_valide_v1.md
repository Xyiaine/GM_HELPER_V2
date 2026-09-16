# Cadrage validé — v1

**Date :** 16 septembre 2026
**Source :** réponses au questionnaire `Questions_alignement_avant_implementation.md`
**Statut :** décisions verrouillées, sauf les trois arbitrages listés en section 3.

---

## 1. Le modèle de table retenu

> **La table est papier. L'écran de table est le seul support numérique partagé. L'application est le cockpit du MJ.**

Trois couches, trois responsabilités séparées. C'est la clarification la plus importante de ce cadrage.

| Couche | Support | Qui fait foi | Conséquence de conception |
|---|---|---|---|
| **État des personnages** — PV, inventaire, or, XP | Fiche papier du joueur | **Le papier.** | L'application ne suit pas les fiches. Elle ne doit **jamais** demander au MJ de ressaisir un personnage. |
| **État du monde** — cités, factions, horloges, graphe de quête, convois | Application | **L'application.** | C'est là qu'elle est autoritaire : elle calcule, historise et projette. |
| **État de séance** — Menace, complications, tours, timers | Application, écran du MJ | **L'application**, visible du MJ seul. | La gamification est une affaire privée du MJ. |

**La règle qui protège le projet :** l'application suit le monde, pas les personnages. C'était le risque principal identifié dans le rapport — si le MJ devait saisir quatre à huit fiches papier à chaque scène, l'outil deviendrait une corvée. Votre réponse B1 écarte ce risque.

**Un corollaire important :** avec 4 à 8 joueurs pour des séances de 3 h toutes les deux semaines, chaque joueur dispose d'environ 20 à 25 minutes de temps de parole par séance. L'écran de table n'est pas un gadget : c'est le seul canal qui parle à tout le monde en même temps. Il devient la pièce centrale du dispositif.

---

## 2. Décisions verrouillées

| # | Décision | Conséquence directe |
|---|---|---|
| A1 | Tous les joueurs en papier | L'app joueur est un secours, pas la cible. |
| A2 | Écran de table systématique | La réparation de `/table/:token` passe en priorité absolue. |
| A3-A4 | MJ sur portable, présentiel uniquement | Pas de contrainte de session distante. Le temps réel sert la table, pas le réseau. |
| B1 | Chaque joueur tient sa fiche papier | L'app ne suit pas les personnages. |
| B2 | L'app est un aide-mémoire, le papier prime | Aucune fonction ne doit dépendre d'une donnée de personnage pour fonctionner. |
| B3 | Le MJ annonce à l'oral, le joueur note | Aucune écriture automatique sur les fiches. |
| B4 | Fiches imprimables **en forme de carte à jouer** | Nouveau chantier : gabarit de carte + export. |
| B5 | Fiche papier à faire évoluer le moins possible | L'export doit s'adapter à la fiche existante, pas l'inverse. |
| B6 | Saisie PC minimale, sans casser la fluidité | Toute saisie doit être optionnelle et remplaçable par un à-un-clic. |
| C1-C2 | Interface joueur réparée, gardée en secours | Les trois bugs sont corrigés, mais elle ne porte aucune proposition nouvelle. |
| D1 | Écran de table : belles images de scène, et en combat la carte + l'initiative **sans les PV** | Le filtre public ne doit plus transmettre `hpCurrent`/`hpMax`/`armorClass`. |
| D2-D3 | TV en bout de table, passif, mise à jour automatique | Typographie et contrastes à revoir pour la lecture à distance. |
| D4 | Écran identique sur toutes les campagnes | Un seul gabarit à soigner plutôt qu'un système configurable. |
| E1 | Dés physiques pour les joueurs, physiques ou numériques pour le MJ | Le lanceur devient un outil MJ. |
| E2 | Le MJ veut saisir les résultats des dés physiques | Saisie rapide, jamais obligatoire. |
| E3 | L'application lance les dés des PNJ | Le lanceur numérique sert au MJ, pas aux joueurs. |
| E4 | « Résoudre la scène » apprécié, mais arbitrage manuel conservé | Le bouton propose, le MJ dispose. Toujours un chemin manuel. |
| E5 | Jets cachés automatisés (Perception passive, tests secrets) | Nouvelle fonction à construire côté MJ. |
| F1 | Gamification « à fond » | Le système de jeu est dans le périmètre principal. |
| F2 | Éclats attribués par vote oral à main levée, saisis par le MJ | Pas de vote numérique. |
| F3 | La Menace reste **secrète**, côté MJ | Rien de la gamification ne part sur l'écran de table. |
| F4 | Decks numériques, à l'écran du MJ | Pas d'impression de cartes de Danger. |
| F5 | Défis de séance retenus, pour augmenter la difficulté | Ils modifient réellement le jeu, donc visibles en fiction. |
| F6 | Succès **non punitifs et bienveillants** | Aucun succès ne sanctionne une absence ou un échec. Aucun score négatif. |
| F7 | Contrat de table **hors périmètre** | Retiré du backlog. |
| F8 | Score **par campagne** | Pas de classement global. |
| F9 | Rien tenu à la main à préserver | Aucune mécanique existante à contourner. |
| G1-G2 | Impression réelle, en export PDF | Nouveau chantier : chaîne d'export. |
| G3 | Matériel physique pour objets rares, épiques et légendaires, et cartes de personnage | Nouveau chantier : gabarits de cartes. |
| G4 | Format tarot agrandi ×1,5 en largeur et en hauteur, soit **105 × 180 mm** | Contrainte de gabarit précise. |
| H1 | Lot livrable de bout en bout | Pas de livraison partielle invisible. |
| H2 | **Quelques soirées** | Contrainte forte — voir arbitrage 1. |
| H3 | Correction directe sur le dépôt | Travail en commits réguliers. |
| H4 | Schéma Prisma et migrations libres | Persistance de l'état de séance possible. |
| H5 | Dépendances additionnelles autorisées | Bibliothèque d'export PDF envisageable. |
| H6 | Thème sombre **subi** : veut une UI minimaliste avec des effets, univers de survie | Nouveau chantier : direction artistique. |
| H7 | Tout implémenter | Voir arbitrage 1. |
| H8 | Pas d'environnement cible définitif | Rester portable, bonnes pratiques. |
| H9 | Sauvegarde Git demandée, commits commentés | Point de sauvegarde fait (voir section 6). |
| I1 | 4 à 8 joueurs | L'outil doit tenir une table nombreuse. |
| I2 | Toutes les deux semaines, 3 h | Environ 12 séances par an : chaque séance compte. |
| I3 | *La Course du Sel* = quête d'ouverture | L'outil doit servir une campagne longue, pas une one-shot. |
| I4 | Aucune séance encore menée | On conçoit à l'aveugle — voir section 5. |
| I5 | Pas de co-MJ | Le MJ est seul à la manœuvre : la charge doit être minimale. |
| I6 | Arbres et bestiaire à refondre plus tard | On ne les touche pas maintenant. |
| I7 | Système maison dérivé de D&D 5e | Les calculs doivent être paramétrables, pas figés sur la 5e stricte. |
| I8 | Les 10 cités et leurs 7 paramètres sont réellement suivis | L'état du monde est bien dans le périmètre. |
| I9 | Objectif : rendre le joueur heureux, lui donner un sentiment de progression, l'intéresser aux intrigues et au lore | C'est le critère de succès final. Toute fonction qui n'y contribue pas est secondaire. |

---

## 3. Trois points à arbitrer

### Arbitrage 1 — « Quelques soirées » et « tout implémenter » ne tiennent pas ensemble

C'est le seul vrai conflit du questionnaire. H2 dit quelques soirées, H7 dit tout. Le backlog complet représente plusieurs semaines à temps plein.

**Ce qui est faisable en quelques soirées** (et que je peux livrer) :
- La fondation temps réel (fait ce soir, section 6).
- L'écran de table : réparation, direction artistique, images de scène, initiative sans PV.
- La persistance de l'état de séance en base.
- La chaîne d'export PDF avec le gabarit de carte 105 × 180 mm.

**Ce qui demande plusieurs semaines :** le cockpit de session plein écran, la palette de commandes, le système d'Éclat complet avec succès et titres, la bande son, la refonte mobile des arbres.

**Trois options :**

| Option | Contenu | Ce qu'on obtient |
|---|---|---|
| **A — Table d'abord** *(ma recommandation)* | Temps réel + écran de table + persistance + export PDF | Une table réellement utilisable, où l'écran sert à quelque chose. Le jeu du MJ vient ensuite. |
| **B — Jeu d'abord** | Temps réel + système d'Éclat + succès et défis | La gamification promise, mais l'écran de table reste pauvre. |
| **C — Les deux en parallèle, version réduite** | Temps réel + écran minimal + noyau d'Éclat sans succès ni titres | Un peu des deux, mais rien de complet. |

**Recommandation : option A.** Raison : l'écran de table est la seule chose que vos joueurs verront. La gamification, vous êtes le seul à en profiter. Et l'Éclat a besoin de données de séance que la persistance fournira — la construire avant, c'est la construire deux fois.

### Arbitrage 2 — Les récompenses : annoncées à l'oral, mais il faut du papier

Vos réponses se complètent plus qu'elles ne se contredisent, à condition de reformuler la fonction :

- **B3** : le MJ annonce à l'oral, le joueur note sur sa fiche. → L'app n'écrit pas sur les fiches.
- **G3** : les objets rares, épiques et légendaires sont mieux en physique. → Il faut **produire une carte**.
- **G1/G2** : export PDF. → Cette carte doit être imprimable.
- **B4** : les fiches elles-mêmes en forme de carte.

**Proposition :** le bouton « Distribuer les récompenses » devient **« Éditer la carte à remettre »**. Le MJ choisit la récompense, l'app génère le PDF au format 105 × 180 mm, le MJ l'imprime ou l'a pré-imprimé, et l'app en garde une trace pour le récapitulatif de séance. Aucune écriture sur une fiche.

**À confirmer.** Si vous préférez, on peut aussi ne rien tracer du tout et se contenter du générateur de cartes.

### Arbitrage 3 — La gamification devient un jeu entièrement privé

En combinant F1 (gamification à fond), F3 (Menace secrète) et F2 (vote oral saisi par le MJ), le résultat est net : **rien de votre jeu de MJ ne sera visible par les joueurs.** Ni la Menace, ni les Éclats, ni les succès, ni les titres.

C'est cohérent et parfaitement défendable — c'est un peu le principe d'un carnet de bord de MJ. Mais il faut en assumer la conséquence : **l'écran de table ne portera aucun élément de gamification.** Il montrera des images de scène, la carte de combat, l'ordre d'initiative et les timers. Rien d'autre.

Deux questions en découlent :

1. Est-ce bien ce que vous voulez, ou souhaitez-vous que la table voie **les effets** de votre jeu — par exemple qu'un défi de séance soit annoncé à voix haute, ou qu'un palier franchi se traduise par un événement narratif visible ?
2. Les **défis de séance** modifient réellement la partie (F5). Les annoncez-vous aux joueurs, ou les gardez-vous secrets aussi ?

### Point d'attention — vous n'avez encore mené aucune séance

I4 et I9 le confirment : l'application n'a jamais tourné à une vraie table. Cela veut dire que nous concevons à l'aveugle, et que la première séance réelle révélera des besoins que ni vous ni moi n'anticipons.

**Conséquence pratique :** privilégier les fonctions **désactivables** plutôt que les automatismes imposés. Un bouton qu'on n'utilise pas ne coûte rien ; un automatisme qui se déclenche au mauvais moment casse une scène. Et prévoir une première séance « à blanc » avant d'investir dans les fonctions lourdes.

---

## 4. Ce que le cadrage change dans le backlog

| Ticket initial | Devient |
|---|---|
| V2-02 — Distribuer les récompenses | **« Éditer la carte à remettre »** (PDF 105 × 180 mm), sans écriture sur les fiches. Voir arbitrage 2. |
| V3-07 — Agence et visibilité joueur | **Dépriorisé.** L'app joueur est un secours ; on répare ses bugs et on n'y investit pas plus. |
| V3-05 — Système d'Éclat | **Conservé**, mais doit dépendre de la persistance de séance. Aucun affichage côté joueurs. |
| Contrat de table | **Retiré** (F7). |
| Succès | **Reformulés** pour être strictement non punitifs (F6) : aucun succès lié à une absence, à un retard, ou à un échec de séance. |
| Score | **Par campagne** (F8), pas de cumul global. |
| **Nouveau chantier — Chaîne d'impression** | Gabarits de cartes au format 105 × 180 mm, export PDF : fiches de personnage, objets rares et plus, aides de jeu, récapitulatifs de séance. N'existe pas du tout aujourd'hui. |
| **Nouveau chantier — Écran de table** | Recentré sur les images de scène et, en combat, la carte et l'initiative **sans PV**. Lecture à distance : typographie et contrastes à revoir. |
| **Nouveau chantier — Direction artistique** | H6 : le thème sombre est subi. Objectif : une interface minimaliste mais habitée, avec des effets, dans un univers de survie, de sable et de radioactivité. À traiter comme un vrai travail de direction artistique, pas comme un changement de palette. |
| **Nouveau chantier — Jets cachés** | E5 : automatiser Perception passive et tests secrets côté MJ. |

---

## 5. Premier lot livré ce soir — fondation temps réel

Le temps réel était **intégralement mort**, et pas seulement à moitié comme annoncé dans le rapport initial. La correction complète est en place.

### Ce qui était cassé

1. **Aucun client ne rejoignait la room de campagne.** Le serveur n'écoutait que `join_campaign`. `LiveSession` et `PlayerMapView` émettaient `join:campaign` avec deux-points — aucun écouteur. Et `ConvoyDashboard` émettait `join_campaign` avec une **chaîne nue** au lieu de `{ campaignId }`, donc le serveur recevait `undefined` et sortait immédiatement. Les quatre appels étaient cassés.
2. **L'application MJ ne se connectait jamais du tout.** `SessionManager`, `ThreatClockWidget` et `QuestGraphEditor` posaient des écouteurs sur un socket qui n'était jamais connecté. Aucun `socket.connect()` n'existait côté MJ. Les alertes de seuil de menace, les arrivées de joueurs et les timers n'ont jamais fonctionné.
3. **L'écran de table ne pouvait pas s'authentifier.** Le client envoyait le jeton dans `tableScreenToken`, le serveur ne lisait que `token`.
4. **Fuite entre campagnes.** `encounter_state_changed_public` était diffusé par `io.emit()`, donc vers tous les sockets de toutes les campagnes.
5. **Le socket partagé était détruit par ses propres consommateurs.** Un seul socket pour toute l'application, mais chaque composant appelait `socket.disconnect()` dans son nettoyage. Changer d'onglet coupait la connexion des autres composants montés.

### Ce qui a été corrigé

| Fichier | Correction |
|---|---|
| `server/src/sockets.js` | Handshake acceptant `token` et `tableScreenToken`. Les deux orthographes `join_campaign` / `join:campaign` et les deux formes de charge utile sont acceptées. L'écran de table rejoint aussi `campaign:{id}:table_screen`. |
| `server/src/routes/gm/encounters.js` | `io.emit` remplacé par une émission ciblée sur la room de campagne. `hpCurrent`, `hpMax` et `armorClass` retirés du payload public (votre réponse D1). |
| `client/src/utils/socket.js` | Connexion partagée à comptage de références, avec délai de grâce de 300 ms, et re-jonction automatique de la room après reconnexion. |
| `client/src/routes/GmApp.jsx` | L'application MJ ouvre enfin la connexion et rejoint la room de campagne. |
| `client/src/components/player/LiveSession.jsx` | `useState` retiré du `useEffect` (plantage de l'onglet). Connexion partagée. |
| `client/src/components/player/PlayerMapView.jsx` | Connexion partagée, bonne charge utile de jonction. |
| `client/src/components/player/ConvoyDashboard.jsx` | Ne crée plus une seconde connexion avec une URL codée en dur. Charge utile corrigée. |
| `client/src/components/table/TableScreenView.jsx` | Handshake corrigé. Connexion partagée. |
| `server/src/routes/player/privateNotes.js` | `req.user.userId` corrigé en `req.user.id` sur les quatre occurrences (fuite entre joueurs et 403 systématique). |

Le build client passe, les fichiers serveur sont syntaxiquement valides. **Ce lot n'a pas encore été testé à une vraie table** — voir section 7.

---

## 6. Sauvegarde Git

Point de sauvegarde effectué : commit `5b5eac9`, intitulé *« docs: audit complet de l'application et cadrage avant refonte majeure »*. Il contient le rapport, le backlog et le questionnaire, et marque l'état du dépôt avant la refonte.

`.workbuddy-ai/` a été ajouté au `.gitignore` : ce dossier contient la mémoire de travail de l'agent, pas du code du projet. Facile à changer si vous préférez le versionner.

**Le `git push` a échoué** : aucune authentification GitHub n'est disponible sur ce poste (pas de CLI `gh`, pas de gestionnaire d'identifiants, pas de clé SSH déclarée côté GitHub). Le commit est bien présent en local, il ne manque que l'envoi. Voir section 7.

---

## 7. Ce qu'il me faut pour continuer

1. **L'authentification GitHub** — le plus simple : ouvrir un terminal à la racine du projet et lancer `git push origin main`, une invite demandera vos identifiants. Sinon, un jeton d'accès personnel, ou `gh auth login` si vous installez le CLI.
2. **L'arbitrage 1** : option A, B ou C. C'est ce qui détermine tout l'ordre de travail.
3. **L'arbitrage 2** : confirmation du modèle « carte à remettre ».
4. **L'arbitrage 3** : la gamification doit-elle rester entièrement invisible des joueurs, et les défis de séance sont-ils annoncés ou secrets ?
5. **Un test à blanc** : avant d'investir dans les fonctions lourdes, une séance ou une demi-séance avec la fondation temps réel en place. C'est le seul moyen fiable de savoir si l'écran de table remplit son rôle et si la fluidité tient.
