# Cahier des charges
## Système de quêtes avec suivi & Session de jeu live

*Sections 1 à 12 : cahier des charges fonctionnel. Sections 13 à 14 : aspect technique et plan d'implémentation, harmonisés avec l'application existante (stack, modèle de données et architecture réels).*

---

## 1. Contexte et objectifs

L'application permet déjà à un MJ de construire un univers : carte, personnages, PNJ, lieux, histoire. Cette nouvelle brique ajoute deux fonctionnalités imbriquées :

1. **Un système de quêtes** : créer, organiser et suivre la progression des quêtes de la campagne.
2. **Une session de jeu live** : un mode de jeu où le MJ et les joueurs sont connectés simultanément, chacun avec un écran adapté à son rôle.

**Objectif central : la fluidité et l'immersion.** L'appli ne doit jamais devenir un obstacle entre le MJ et sa table. Le MJ raconte, décrit, incarne les PNJ à l'oral — l'écran ne fait que soutenir cette narration (carte, visuels, suivi des quêtes), il ne la remplace jamais. Côté joueur, l'écran doit être épuré pour ne pas détourner l'attention de la scène jouée en présentiel/visio.

### Principe directeur retenu
- Mode **live uniquement** : MJ et joueurs connectés en simultané.
- Écran joueur volontairement restreint : **fiche de personnage + carte**.
- Toute narration, description, dialogue de PNJ reste **orale**, portée par le MJ.
- L'appli sert de **support visuel piloté par le MJ**, pas de canal de texte narratif.


---

## 2. Périmètre de la fonctionnalité

**Inclus dans cette itération :**
- Modèle de quête et son cycle de vie
- Outils de suivi de quête pendant la préparation et pendant la session
- Ouverture/fermeture d'une session de jeu live
- Vue MJ (tableau de bord de pilotage)
- Vue joueur (fiche perso + carte)
- Diffusion contrôlée de visuels par le MJ vers les joueurs
- Écran de table partagé pour les sessions en présentiel
- Synchronisation temps réel entre tous les écrans connectés

**Explicitement hors périmètre** (voir section 11) : chat textuel, musique/ambiance sonore, mode asynchrone. *Les dés et le combat au tour par tour existent déjà dans l'application et ne sont pas reconstruits ici — voir la note d'harmonisation en section 11 et la section 13.*

---

## 3. Utilisateurs et rôles

| Rôle | Ce qu'il voit | Ce qu'il peut faire |
|---|---|---|
| **MJ** | Vue complète : carte entière, toutes les quêtes (secrètes ou non), PNJ, notes | Tout créer, modifier, révéler, pousser vers les joueurs |
| **Joueur** | Sa fiche de personnage + la carte dans son état révélé courant + zone de diffusion (spotlight) en session à distance uniquement | Consulter uniquement ; aucune modification des quêtes ou de la carte |

---

## 4. Fonctionnalité 1 — Système de quêtes

### 4.1 Modèle fonctionnel d'une quête

Chaque quête est composée de :

| Champ | Description |
|---|---|
| Titre | Nom court de la quête |
| Description | Texte détaillé, à usage du MJ (peut contenir des éléments secrets) |
| Résumé joueur *(optionnel)* | Version courte, visible des joueurs si la quête est révélée |
| Type | Principale / Secondaire / Annexe / Personnelle (liée à un personnage précis) |
| Statut | Non déclenchée · Active · En pause · Terminée (réussie) · Échouée · Abandonnée |
| Structure de résolution | Graphe de nœuds représentant les chemins de résolution possibles (voir 4.2) |
| Récompenses *(optionnel)* | Texte libre, ou liens vers objets/réputation existants dans l'univers |
| Liens | PNJ impliqués, lieux concernés, objets liés, quêtes prérequises ou déclenchées |
| Visibilité | Secrète (MJ uniquement) · Connue des joueurs · Partiellement révélée |
| Notes privées MJ | Bloc-notes libre, jamais visible des joueurs |
| Métadonnées | Date de création, dernière mise à jour, tags libres |

### 4.2 Structure de résolution : graphe de nœuds

Le cœur du suivi de quête n'est plus une simple liste linéaire d'objectifs, mais un **graphe de résolution** : un ensemble de nœuds reliés par des chemins, représentant toutes les manières dont la quête peut se dérouler. Cette structure est **strictement réservée au MJ** : ni le graphe, ni son contenu, ni son existence ne sont jamais visibles ou accessibles depuis l'écran joueur.

#### 4.2.1 Nœuds et connexions
- Un nœud représente une étape, un lieu, une rencontre ou une situation clé de la quête.
- Un nœud peut avoir **plusieurs connexions sortantes** vers d'autres nœuds : chaque connexion représente un chemin/choix possible pour les joueurs. Le nombre de branches par nœud est libre.
- **Nœuds de convergence** : un nœud peut avoir plusieurs connexions entrantes (plusieurs chemins différents y mènent). Cela permet d'offrir une vraie sensation de liberté et de multiplicité des choix, tout en gardant un nombre maîtrisé d'issues finales pour le MJ.
- Types de nœuds : **Départ** (point d'entrée de la quête), **Intermédiaire**, **Convergence**, **Fin** (une issue possible de la quête).
- Chaque nœud de type « Fin » peut être relié à un statut global de la quête (Terminée réussie / Échouée / Abandonnée), pour que l'atteinte de ce nœud puisse mettre à jour automatiquement le statut de la quête (voir 4.1).
- Chaque nœud peut être associé à des PNJ, lieux ou objets déjà existants dans l'univers, comme la quête elle-même.
- Une connexion peut porter une condition libre en texte (ex. « si les joueurs ont obtenu la confiance du forgeron ») à titre de rappel pour le MJ ; ce n'est pas une logique automatisée, le MJ reste seul juge de l'orientation prise par ses joueurs — à l'exception de la connexion de timeout des nœuds timés (voir 4.2.3), qui se déclenche automatiquement.

#### 4.2.2 Paragraphe narratif sensoriel
- Chaque nœud peut contenir un **texte narratif sensoriel** : odeurs, sons, ambiance visuelle, sensations physiques — de quoi nourrir immédiatement la description orale du MJ.
- Dès que le MJ marque un nœud comme **atteint** pendant la session, ce paragraphe s'affiche automatiquement sur sa vue, au moment précis où les joueurs arrivent dans la scène.
- Ce texte reste un outil de préparation pour le MJ : il n'est jamais transmis tel quel aux joueurs, il sert de support à l'improvisation orale.
- Champ recommandé mais non obligatoire pour chaque nœud.

#### 4.2.3 Nœuds timés (pression temporelle)
- Chaque nœud peut être marqué comme **timé ou non**, au choix du MJ, nœud par nœud. Si timé, le MJ définit librement sa durée.
- L'arrivée sur ce nœud (nœud marqué **atteint** en session) déclenche automatiquement le démarrage de son minuteur, visible sur la vue MJ.
- Pour chaque nœud timé, le MJ désigne à l'avance un **nœud de conséquence** (nœud de timeout) : si le délai expire avant que les joueurs n'empruntent un autre chemin, la quête bascule automatiquement sur ce nœud de conséquence.
  - *Exemple : les joueurs tentent de désamorcer un mécanisme pour s'échapper à temps. S'ils n'y parviennent pas avant l'expiration du minuteur, la quête bascule automatiquement sur le nœud « Rattrapés par la garde », qui possède son propre paragraphe narratif sensoriel décrivant l'irruption des gardes, et peut enchaîner sur un déclenchement de combat.*
- Un nœud de conséquence est un nœud comme un autre : il a son propre paragraphe sensoriel, ses propres connexions sortantes, et peut lui-même mener à d'autres nœuds (y compris d'autres nœuds timés).
- Si les joueurs empruntent un chemin normal avant l'expiration du délai, le minuteur du nœud est automatiquement arrêté et n'a plus d'effet.
- Le MJ choisit, pour chaque nœud timé, si ce compte à rebours reste un outil interne, ou s'il souhaite le rendre visible des joueurs via la diffusion contrôlée (voir 5.4), pour intensifier la pression ressentie à la table.

#### 4.2.4 Visualisation du graphe (vue MJ)
- Le MJ dispose d'une représentation visuelle du graphe (schéma de nœuds et connexions), consultable en préparation et pendant la session.
- Sur cette vue, chaque nœud affiche clairement son statut (non atteint / atteint), son type, et un indicateur si un minuteur est en cours.
- Les connexions de timeout (menant à un nœud de conséquence) sont visuellement distinguées des chemins normaux, pour que le MJ identifie immédiatement les conséquences d'une expiration.
- Cette vue doit rester lisible même pour des quêtes à embranchements complexes (zoom, repli des branches déjà résolues, etc.).

### 4.3 Création et édition (en préparation, hors session)
- Le MJ crée et enrichit ses quêtes en amont, dans son espace de préparation d'univers (au même titre que les PNJ ou les lieux), y compris la construction du graphe de résolution.
- Une quête peut être créée « en brouillon » sans être encore déclenchée dans l'histoire.
- Possibilité de dupliquer/adapter une quête existante (y compris son graphe) pour créer une variante.

### 4.4 Suivi et mise à jour en session
- Pendant la session, le MJ doit pouvoir, **en un minimum d'actions** :
  - Faire passer une quête de « non déclenchée » à « active »
  - Marquer un nœud comme atteint (ce qui déclenche l'affichage du paragraphe sensoriel et, le cas échéant, démarre son minuteur)
  - Changer le statut global d'une quête
  - Ajouter une note rapide sans quitter la vue de session
- Aucune de ces actions ne doit demander plus de 2 clics/taps.

### 4.5 Visibilité côté joueur et prise de notes
- Le suivi détaillé des quêtes (et le graphe dans son intégralité) reste un **outil MJ**. Les joueurs ne consultent pas un journal de quêtes structuré pendant la partie — cela romprait l'immersion orale recherchée.
- En remplacement d'un journal de quêtes automatique, la **fiche de personnage** intègre un **espace de prise de notes libre**, propre à chaque joueur : c'est à eux de noter ce qu'ils retiennent de la narration orale (indices, déductions, noms, pistes), comme ils le feraient sur une feuille de personnage physique.
- Cet espace de notes appartient entièrement au joueur : lui seul peut l'écrire et le modifier, à tout moment, y compris pendant la session (voir aussi 5.3). Le MJ ne le voit pas et n'y a pas accès.
- Le MJ garde par ailleurs la main pour, **s'il le souhaite**, pousser une notification discrète (ex. bandeau « Nouvel objectif découvert ») via la diffusion contrôlée (voir 5.4). Cette fonction est optionnelle, activable/désactivable par campagne.

### 4.6 Règles de gestion
- Une quête ne peut passer « Terminée » ou « Échouée » que si elle était « Active » ou « En pause ».
- Un nœud marqué « atteint » peut être « dé-marqué » par le MJ (erreur de manipulation, retour en arrière narratif) ; son minuteur associé, s'il existe, est alors réinitialisé.
- Une quête secrète, ainsi que l'intégralité de son graphe de résolution, ne peut jamais apparaître sur l'écran joueur, y compris indirectement (ex. via un lieu lié affiché sur la carte).
- Un nœud de convergence est considéré comme atteint dès que l'un de ses chemins entrants a été emprunté ; les autres chemins menant au même nœud restent disponibles pour une autre partie/campagne mais ne redéclenchent pas le paragraphe sensoriel une seconde fois dans la même session.
- Un nœud marqué comme timé doit obligatoirement se voir désigner un nœud de conséquence avant de pouvoir être utilisé en session ; l'appli doit empêcher/alerter le MJ s'il tente de lancer une session avec un nœud timé incomplet.
- Si un nœud timé est « dé-marqué » (retour en arrière, voir ci-dessus), son minuteur en cours est annulé et la transition automatique vers son nœud de conséquence, si elle a déjà eu lieu, doit être revue manuellement par le MJ.

---

## 5. Fonctionnalité 2 — Session de jeu live

### 5.1 Cycle de vie d'une session

1. **Préparation** (hors live) : le MJ sélectionne l'univers, vérifie les quêtes actives, prépare les zones de carte prêtes à être révélées.
2. **Ouverture de session** : le MJ lance une session, indique si elle se joue **en présentiel** ou **à distance**, génère un lien/code de connexion, les joueurs rejoignent et sélectionnent leur personnage. Ce choix de mode détermine la destination de la diffusion (voir 5.4).
3. **Déroulement** : MJ et joueurs restent connectés ; le MJ pilote tout depuis son tableau de bord.
4. **Clôture** : le MJ termine la session ; l'état de la carte, des quêtes et des notes est automatiquement sauvegardé dans l'univers, sans action manuelle supplémentaire.

### 5.2 Vue MJ (tableau de bord de session)
Vue d'ensemble en un coup d'œil, pensée pour être consultée à la volée pendant que le MJ parle :
- Quêtes actives avec leurs objectifs, actions rapides pour les faire évoluer
- Carte complète avec outils de révélation
- PNJ et lieux disponibles, accessibles sans navigation profonde
- Zone de diffusion : sélection du visuel à pousser aux joueurs
- Liste des joueurs connectés

### 5.3 Vue joueur
- **Fiche de personnage** : ses informations de jeu (PV, statistiques, compétences, inventaire) restent éditables selon la permission déjà existante dans l'application (case « modifiable par le joueur », activable par le MJ) — notamment pour ajuster les PV en direct pendant un combat. *Point d'harmonisation : contrairement à ce qui était envisagé plus haut, la fiche n'est pas figée en lecture seule pendant la session ; ce comportement d'édition live existe déjà et doit être conservé tel quel.*
- **Espace de prise de notes** : distinct du champ de notes déjà existant sur la fiche (qui reste, lui, soumis à la permission MJ et visible du MJ). Ce nouvel espace est **toujours** éditable par le joueur, quelle que soit la permission d'édition de la fiche, et **n'est jamais accessible au MJ** — c'est une exception volontaire au principe général « le MJ voit tout de la fiche », posée pour préserver un espace vraiment personnel. Voir section 13 pour son implémentation (nouveau champ dédié, exclu des routes MJ).
- **Carte** : uniquement les zones révélées par le MJ, mise à jour en temps réel.
- **Zone de diffusion** *(sessions à distance uniquement)* : espace réservé qui affiche ce que le MJ choisit de pousser (image, portrait, bannière) ; vide/neutre le reste du temps. En session présentielle, cette zone reste inactive : toute diffusion part vers l'écran de table (voir 5.7).
- Aucun autre élément d'interface : pas de menu, pas de texte de narration.

### 5.4 Diffusion contrôlée (« spotlight »)
Fonction centrale pour l'immersion : le MJ peut, en un clic, envoyer du contenu visuel à la table. La destination est **automatique, selon le mode de la session** défini à l'ouverture (voir 5.1) :
- **Session à distance** : le contenu part vers la zone de diffusion de l'écran individuel de chaque joueur.
- **Session en présentiel** : le contenu part exclusivement vers l'écran de table (voir 5.7) ; les écrans individuels des joueurs ne reçoivent alors aucun contenu de diffusion.

Le MJ n'a jamais à choisir la destination lui-même : elle découle du mode de session, pour rester simple et rapide à l'usage. Types de contenus diffusables :
- Une image (portrait de PNJ, illustration de lieu, objet)
- Une zone de carte mise en avant
- Une bannière courte (ex. mise à jour de quête, si activé — uniquement en session à distance ; l'écran de table, lui, reste toujours sans texte)

Le contenu diffusé remplace le précédent sans rechargement, et peut être retiré (retour à un écran neutre) en un clic. Cette fonction permet au MJ de renforcer sa narration orale par un appui visuel ponctuel, sans jamais surcharger l'écran.

### 5.5 Carte en session (révélation progressive)
- Le MJ dispose d'un mode « brouillard de guerre » : la carte est masquée par défaut, il révèle les zones au fil de l'exploration (clic/tracé de zone).
- Les joueurs ne voient que les zones déjà révélées, mise à jour instantanée.
- Les pins liés à des lieux/PNJ/quêtes n'apparaissent que si la zone est révélée **et** l'élément associé n'est pas marqué secret.

### 5.6 Synchronisation temps réel
- Toute action du MJ (révélation de carte, changement de statut de quête, diffusion) doit être répercutée sur tous les écrans joueurs connectés en **moins d'une seconde**, sans rechargement de page.

### 5.7 Écran de table (mode présentiel)
Pour les sessions jouées en présentiel, un **onglet dédié** ouvre une interface distincte, pensée pour être affichée sur un second écran physique (téléviseur, moniteur, projecteur) positionné de manière à être visible simultanément par le MJ et l'ensemble des joueurs autour de la table.

- **Contenu strictement visuel** : aucun texte n'apparaît jamais sur cet écran, à aucun moment — uniquement des images et des cartes.
- **Types de visuels** : illustrations liées à la quête en cours (portraits de PNJ, lieux, objets), zone de la carte d'univers révélée, et cartes de combat (plans de terrain, battle maps) pour les affrontements.
- **Cartes de combat** : le MJ peut y afficher une carte de combat comme simple support visuel partagé, en complément du tracker de combat/initiative déjà existant dans l'application (qui continue de gérer la mécanique : PV, CA, tour par tour). Un nœud du graphe de résolution peut être relié à ce tracker existant, sans le dupliquer (voir 13.6).
- **Pilotage** : le MJ alimente cet écran via le même mécanisme de diffusion contrôlée que pour les écrans individuels (voir 5.4). En session présentielle, ce routage est automatique : toute diffusion part exclusivement vers l'écran de table, sans jamais passer par les écrans individuels des joueurs.
- **Défilement en galerie** : à la différence de la zone de diffusion individuelle qui n'affiche qu'un seul visuel à la fois, l'écran de table conserve les derniers visuels envoyés durant la session sous forme de galerie qui défile, pour que la table puisse retrouver un visuel déjà montré sans que le MJ ait à le repousser.
- **Complémentaire, pas substitut** : chaque joueur garde son propre écran individuel (fiche de personnage, carte personnelle, espace de notes) ; l'écran de table s'ajoute comme point focal visuel commun, il ne remplace aucun des écrans individuels.

---

## 6. Interaction entre les deux fonctionnalités
- Une mise à jour de quête pendant la session peut déclencher automatiquement une diffusion discrète (paramétrable par le MJ, voir 4.5).
- Un lieu lié à une quête active n'apparaît sur la carte joueur que si la zone est révélée — les deux systèmes de visibilité (carte et quête) se combinent toujours en faveur du secret par défaut.
- Marquer un nœud comme atteint peut servir de déclencheur cohérent pour d'autres actions MJ dans la foulée : révéler la zone de carte correspondante, ou pousser en diffusion le PNJ/lieu associé au nœud — le tout reste des actions manuelles du MJ, pensées pour s'enchaîner naturellement plutôt que d'être automatisées.

---

## 7. Parcours utilisateurs clés

- *En tant que MJ*, je prépare mes quêtes avant la session pour ne pas avoir à les créer dans le feu de l'action.
- *En tant que MJ*, j'ouvre une session, mes joueurs rejoignent en quelques secondes avec un lien.
- *En tant que joueur*, une fois connecté, je vois ma fiche de personnage et une carte encore largement voilée.
- *En tant que joueur*, j'écris dans l'espace de prise de notes de ma fiche de personnage pour garder trace d'un indice donné à l'oral, sans que personne d'autre n'y ait accès.
- *En tant que MJ*, pendant que je décris une scène à l'oral, je révèle la zone correspondante sur la carte d'un geste, sans interrompre mon récit.
- *En tant que MJ*, je construis en amont une arborescence de résolution avec plusieurs chemins et des nœuds de convergence, pour offrir de vrais choix à mes joueurs sans me retrouver avec un nombre ingérable d'issues.
- *En tant que MJ*, un joueur trouve un indice : je marque le nœud correspondant comme atteint, en position pour continuer à parler.
- *En tant que MJ*, mes joueurs arrivent dans une nouvelle scène : le paragraphe sensoriel du nœud s'affiche immédiatement sous mes yeux pour nourrir ma description à l'oral.
- *En tant que MJ*, un nœud est timé : je vois le compte à rebours se lancer, et je décide si je le partage avec mes joueurs pour faire monter la tension à la table.
- *En tant que MJ*, je veux marquer visuellement un moment fort : je pousse le portrait du PNJ que les joueurs rencontrent à l'instant.
- *En tant que MJ jouant en présentiel*, j'affiche une carte de combat sur l'écran de table pour que tous mes joueurs la voient en même temps, sans que personne n'ait à regarder son téléphone.
- *En tant que MJ*, je clôture la session en fin de soirée ; tout est sauvegardé automatiquement, je n'ai rien à ranger manuellement.

---

## 8. Exigences d'expérience — fluidité & immersion

- **Zéro friction pour le MJ** : toute action de pilotage (révéler, cocher, pousser) accessible en 1 à 2 clics maximum, sans changer de page.
- **Vue d'ensemble sans scroll excessif** côté MJ : les informations critiques (quêtes actives, carte, joueurs connectés) visibles simultanément.
- **Écran joueur minimaliste et esthétique**, cohérent avec l'univers (ambiance visuelle, pas d'éléments d'interface génériques qui cassent l'immersion).
- **Aucune coupure technique perceptible** : pas de rechargement de page, transitions douces lors des mises à jour.
- **Le texte reste secondaire côté joueur** : l'écran illustre, il ne raconte pas à la place du MJ.
- **Feedback visuel discret** (légère animation) plutôt que des popups intrusifs lors des mises à jour en temps réel.

---

## 9. Règles de gestion transverses

- Seul le MJ peut modifier une quête, révéler la carte ou déclencher une diffusion.
- Un joueur ne peut jamais voir un élément marqué secret, même indirectement.
- La déconnexion/reconnexion d'un joueur en cours de session ne doit rien faire perdre : il retrouve l'état courant exact (carte révélée, diffusion en cours) en se reconnectant.
- Toute progression (quêtes, carte) est sauvegardée en continu, pas uniquement à la fermeture de session.
- L'écran de table (voir 5.7) n'affiche jamais de texte, sous quelque forme que ce soit : uniquement des images et des cartes.

---

## 10. Critères d'acceptation

- Le MJ crée une quête complète (titre, objectifs, liens) en moins de 2 minutes.
- Un changement de statut de quête en session est visible par les joueurs concernés en moins d'1 seconde.
- Un joueur qui rejoint une session ne voit que sa fiche de personnage et la carte dans son état révélé courant — rien d'autre par défaut.
- Une zone de carte révélée par le MJ apparaît instantanément et simultanément chez tous les joueurs connectés.
- Le MJ peut pousser un visuel en diffusion et le retirer en 1 clic chacun.
- À la clôture d'une session, aucune action manuelle de sauvegarde n'est nécessaire : tout est déjà à jour.
- Un joueur qui se déconnecte puis se reconnecte retrouve exactement l'état courant de la session.
- Le MJ peut créer un nœud de convergence relié à plusieurs nœuds parents distincts.
- Le graphe de résolution d'une quête (nœuds, connexions, textes sensoriels) n'est, à aucun moment, visible ou accessible depuis l'écran joueur.
- Dès qu'un nœud est marqué atteint, son paragraphe narratif sensoriel s'affiche automatiquement sur la vue MJ, sans action supplémentaire.
- Un nœud timé, une fois son délai expiré, fait automatiquement basculer la quête sur son nœud de conséquence désigné, sans action manuelle du MJ.
- L'application empêche ou signale le lancement d'une session contenant un nœud timé sans nœud de conséquence désigné.
- Chaque joueur peut écrire et modifier librement son espace de notes personnel sur sa fiche de personnage, y compris pendant la session, sans que cela soit visible du MJ ou des autres joueurs.
- Le MJ peut afficher un visuel sur l'écran de table en le ciblant explicitement, sans qu'aucun texte n'y apparaisse jamais.
- L'écran de table conserve un historique consultable des derniers visuels envoyés durant la session, sous forme de galerie qui défile.
- En session présentielle, un contenu diffusé par le MJ apparaît exclusivement sur l'écran de table ; aucun écran individuel de joueur ne l'affiche. En session à distance, c'est l'inverse : le contenu apparaît sur les écrans individuels, l'écran de table n'étant pas utilisé.

---

## 11. Hors périmètre (V1) — pistes futures

- *Jets de dés* et *gestion de combat / tour par tour* : retirés de cette liste lors de l'harmonisation — ces deux briques existent déjà dans l'application (lanceur de dés avec calcul serveur, tracker d'initiative/combat) et n'ont pas à être reconstruites. Cette fonctionnalité s'y raccroche plutôt qu'elle ne les remplace (voir 13.6).
- Chat textuel entre joueurs ou avec le MJ
- Ambiance sonore ou musique synchronisée
- Historique rejouable d'une session (replay)
- Mode asynchrone (suivi de quêtes hors session, consultable librement) — écarté pour cette itération au profit du mode live uniquement, mais réutilisable plus tard si besoin

---

## 12. Glossaire

- **MJ** : Maître du Jeu, pilote la session et le contenu de l'univers.
- **PNJ** : Personnage Non Joueur, incarné par le MJ.
- **Session live** : mode de jeu où MJ et joueurs sont connectés simultanément sur l'application.
- **Diffusion / spotlight** : action du MJ consistant à pousser un contenu visuel sur les écrans des joueurs.
- **Brouillard de guerre** : mécanisme de révélation progressive de la carte.
- **Quête secrète** : quête ou information non visible des joueurs tant que le MJ ne l'a pas révélée.
- **Graphe de résolution** : ensemble des nœuds et connexions représentant les chemins possibles pour résoudre une quête, visible uniquement par le MJ.
- **Nœud** : étape, lieu, rencontre ou situation clé au sein du graphe de résolution d'une quête.
- **Nœud de convergence** : nœud atteignable par plusieurs chemins différents, utilisé pour limiter le nombre d'issues finales d'une quête.
- **Nœud timé** : nœud associé à un délai, créant une pression temporelle une fois atteint en session.
- **Nœud de conséquence (timeout)** : nœud désigné à l'avance vers lequel la quête bascule automatiquement si le délai d'un nœud timé expire.
- **Écran de table** : second écran physique, visible par toute la table en session présentielle, affichant uniquement des visuels (images, cartes) pilotés par le MJ.

---

## 13. Aspect technique

*Cette section complète le cahier des charges fonctionnel en le confrontant à l'application réelle déjà existante (stack, modèle de données, architecture) afin de cadrer une implémentation cohérente avec l'existant plutôt qu'une reconstruction.*

### 13.1 Stack technique existante (rappel)
- **Frontend** : React 18 + Vite 5, Zustand (gestion d'état), React Router 6 (code-splitting MJ/joueur), socket.io-client, CSS vanilla avec design tokens (thème sombre) — cohérent avec l'exigence d'esthétique immersive de la section 8, à réutiliser telle quelle.
- **Backend** : Node.js + Express 4, Prisma 6.9 + SQLite, JWT (access + refresh token), Zod (validation), Socket.IO 4.8, Multer (upload).
- Aucune nouvelle technologie n'est nécessaire pour cette fonctionnalité, à une exception potentielle : le rendu du graphe de résolution (nœuds/connexions) bénéficierait d'une librairie de graphe front dédiée (ex. React Flow) plutôt que d'un composant entièrement sur-mesure — à confirmer en phase de cadrage (voir 14, Phase 0) selon la complexité réelle des arborescences envisagées.

### 13.2 Extensions du modèle de données (Prisma)

**a) Graphe de résolution des quêtes** (vient compléter le modèle Quest existant, sans supprimer QuestObjective pour ne pas casser les quêtes déjà créées) :
- `QuestNode` : id, questId, title, mjDescription, sensoryText, nodeType (start / intermediate / convergence / end), endOutcome (success / failure / abandoned, uniquement si nodeType = end), isTimed (bool), timerDurationSeconds, timeoutNodeId (auto-référence vers le nœud de conséquence), linkedNpcId, linkedLocationId, **linkedEncounterId** (référence vers le modèle Encounter déjà existant), positionX/positionY (pour la visualisation), status (not_reached / reached), reachedAt.
- `QuestNodeConnection` : id, fromNodeId, toNodeId, label (condition libre), isTimeoutConnection (bool, pour la distinction visuelle prévue en 4.2.4).
- Règle de validation applicative : un nœud `isTimed = true` doit obligatoirement avoir un `timeoutNodeId` renseigné (cf. règle de gestion 4.6) — à vérifier côté serveur avant tout passage de session en « live ».

**b) Prise de notes privée du joueur** :
- Nouveau modèle dédié `CharacterPrivateNote` (characterId unique, content, updatedAt), plutôt qu'un champ ajouté sur `Character`. Ce choix isole délibérément la donnée : le modèle `Character` est déjà retourné intégralement par les routes GM existantes, alors qu'une table séparée, non incluse dans ces requêtes, empêche toute fuite accidentelle vers le MJ.
- Distinct du champ `Character.notes` déjà existant (qui reste visible/éditable par le MJ selon la permission `canBeEditedByPlayer`) : les deux coexistent, l'un ne remplace pas l'autre.

**c) Session live étendue** :
- Extension du modèle `Session` existant : `mode` (remote / in_person), `tableScreenToken` (généré à l'ouverture si mode = in_person, sur le même principe que le refreshToken existant : `crypto.randomBytes`).
- Nouveau modèle `SpotlightBroadcast` : id, sessionId, contentType (image / map_zone / battle_map / banner), imageUrl ou mapAssetId, text (nullable, jamais utilisé si mode = in_person), isActive, createdAt — sert à la fois de contenu courant et d'historique pour la galerie qui défile sur l'écran de table (5.7).

**d) Brouillard de guerre** :
- Nouveau modèle `MapRevealedZone` (mapAssetId ou worldMapId, zoneData en JSON, revealedAt), persistant au niveau de la carte (et non de la session) pour que la progression reste acquise d'une séance à l'autre.
- Alternative plus légère à trancher en Phase 0 (voir 14) : stocker un masque de révélation directement dans `WorldMap.canvasState`, déjà en JSON, plutôt qu'une table dédiée à géométrie — dépend de la complexité de zones souhaitée (rectangles simples vs polygones libres).

### 13.3 Nouveaux endpoints API

**Côté GM** (`/api/v1/gm/campaigns/:campaignId/...`) :
- `quests/:questId/nodes` (GET/POST), `.../nodes/:nodeId` (PUT/DELETE), `.../nodes/:nodeId/connections` (POST/DELETE)
- `quests/:questId/nodes/:nodeId/reach` (POST) : marque le nœud atteint, déclenche l'affichage du `sensoryText`, démarre le timer si `isTimed`, émet l'événement temps réel correspondant
- `sessions/:sessionId/spotlight` (POST déclenche / DELETE retire) — la destination n'est jamais un paramètre : elle est déduite de `session.mode` (cf. 5.4)
- `sessions/:sessionId/table-screen-token` (GET) : génère/retourne le lien d'affichage de l'écran de table
- `maps/:mapAssetId/reveal` (POST) et `.../revealed-zones` (GET)

**Côté joueur** (`/api/v1/player/campaigns/:campaignId/...`) :
- `character/private-notes` (GET/PUT)

**Écran de table** (nouvelle surface, ni MJ ni joueur classique) :
- `GET /api/v1/table-screen/:tableScreenToken` : endpoint protégé uniquement par la possession du token (voir 13.5), pas de compte utilisateur requis — cohérent avec le fait que l'écran de table est un appareil physique partagé, pas une identité individuelle.

### 13.4 Temps réel (Socket.IO)

En continuité du système de rooms déjà en place (`campaign:{id}`, `campaign:{id}:gm`, `campaign:{id}:player`, `user:{id}`) :
- `quest_node_reached` : diffusé uniquement dans `campaign:{id}:gm` (le graphe reste strictement MJ)
- `spotlight_update` : diffusé dans `campaign:{id}:player` en session à distance, ou dans une nouvelle room `table_screen:{tableScreenToken}` en session présentielle
- `map_zone_revealed` : diffusé dans `campaign:{id}` (filtrage d'affichage côté client selon le rôle, comme le reste de l'existant)
- Nouvelle room `table_screen:{tableScreenToken}` : l'écran de table la rejoint via son token plutôt que via l'authentification JWT habituelle — écart volontaire au pattern standard, à documenter clairement dans le code (voir 13.5).

### 13.5 Sécurité et contrôle d'accès

- Le graphe de résolution (`QuestNode`, `QuestNodeConnection`, `sensoryText`) n'est **jamais** retourné par une route `/player/` : à couvrir par un test d'autorisation dédié, dans la continuité de la priorité « tests d'autorisation » déjà identifiée comme axe d'amélioration sur l'application existante.
- `CharacterPrivateNote` : accessible uniquement par le joueur propriétaire authentifié (`userId` du token = `ownerUserId` du personnage), **y compris pour le MJ de la campagne**. C'est une exception explicite au modèle d'autorisation standard de l'application (`requireGM` / `requirePlayer` / `requireCampaignAccess`) : elle nécessite un middleware dédié, par exemple `requireIsOwner`, distinct des middlewares existants.
- Écran de table : n'étant pas un compte utilisateur, il ne passe pas par le `verifyToken` classique. Le `tableScreenToken` doit être généré aléatoirement, à usage unique par session, invalidé à la clôture de celle-ci, et ne donner accès **qu'en lecture** au flux `SpotlightBroadcast` — jamais à une donnée sensible, par construction de l'endpoint dédié.

### 13.6 Points d'harmonisation avec l'existant

- Le tracker de combat (`Encounter` / `EncounterCombatant`) et le lanceur de dés déjà existants **ne sont pas modifiés** par cette fonctionnalité : un `QuestNode` peut simplement référencer un `Encounter` existant (`linkedEncounterId`) pour enchaîner naturellement de « nœud atteint » à « combat démarré », sans dupliquer la mécanique de jeu.
- Le champ `Character.notes` existant est conservé tel quel ; le nouvel espace de prise de notes privé (`CharacterPrivateNote`) est un ajout, pas un remplacement.
- Le modèle `Session` existant (planned/live/ended) est étendu, pas remplacé.
- La séparation stricte des interfaces déjà en place dans l'application est respectée et étendue : l'écran de table constitue une troisième surface d'accès, avec son propre modèle par token — à documenter clairement dans le code pour ne jamais être confondu avec un oubli de sécurité.

---

## 14. Plan d'implémentation

*Phasage proposé, organisé par dépendances techniques plutôt que par échéances calendaires (à caler selon les disponibilités réelles). Taille relative indiquée à titre d'ordre de grandeur : S = quelques heures, M = un à quelques jours, L = plus d'une semaine.*

**Phase 0 — Cadrage technique** *(S)*
- Trancher : table dédiée vs JSON pour le brouillard de guerre (13.2d) ; librairie de graphe front vs composant sur-mesure (13.1)
- Maquettes rapides des nouveaux écrans : éditeur de graphe MJ, écran de table, onglet notes privées joueur

**Phase 1 — Modèle de données & migrations** *(M)*
Fichiers concernés : `server/prisma/schema.prisma`, `server/prisma/migrations/`
- Ajout de `QuestNode`, `QuestNodeConnection`, `CharacterPrivateNote`, `SpotlightBroadcast`, `MapRevealedZone`
- Extension de `Session` (mode, tableScreenToken)
- Migration testée sur une copie de `dev.db` avant application

**Phase 2 — Backend : quêtes et graphe** *(L)*
Fichiers concernés : `server/src/routes/gm/quests.js`, `server/src/validators/schemas.js`
- Endpoints CRUD nœuds/connexions, endpoint « reach »
- Mécanisme de timeout serveur : timer déclenché à l'atteinte d'un nœud ; pour survivre à un redémarrage serveur, recalculer les échéances actives au démarrage à partir de `reachedAt + timerDurationSeconds` plutôt que de dépendre uniquement d'un `setTimeout` en mémoire
- Validation Zod bloquant le lancement d'une session si un nœud timé n'a pas de nœud de conséquence

**Phase 3 — Backend : session, diffusion, écran de table** *(M)*
Fichiers concernés : `server/src/routes/gm/sessions.js`, nouveau `server/src/routes/tableScreen.js`, `server/src/sockets.js`
- Choix du mode à l'ouverture de session, génération du token
- Endpoints spotlight (POST/DELETE) et route table-screen par token
- Nouveaux événements et room Socket.IO

**Phase 4 — Backend : brouillard de guerre & notes privées** *(M)*, en parallèle possible de la Phase 3
Fichiers concernés : `server/src/routes/gm/maps.js`, `server/src/routes/gm/worldMap.js`, nouveau `server/src/routes/player/privateNotes.js`
- Endpoints reveal / revealed-zones
- Endpoints private-notes avec middleware `requireIsOwner` dédié

**Phase 5 — Frontend MJ** *(L)*
Fichiers concernés : nouveau `client/src/components/gm/QuestGraphEditor.jsx`, extension de `QuestManager.jsx`, extension de `MapManager.jsx` / `LocalMapManager.jsx` (outils de révélation), extension de `SessionManager.jsx` (mode de session, déclenchement spotlight)
- Éditeur visuel du graphe, avec distinction visuelle des connexions de timeout (4.2.4)
- Intégration au tableau de bord de session en respectant la contrainte « 2 clics maximum » (section 8)

**Phase 6 — Frontend joueur & écran de table** *(M)*
Fichiers concernés : extension de `CharacterSheet.jsx` (nouvel onglet « Notes privées », distinct de l'onglet Notes existant), extension de `LiveSession.jsx` (zone de diffusion), nouveau `client/src/routes/TableScreenApp.jsx` (accessible par URL + token, hors authentification standard)
- Écran de table : layout plein écran sans navigation, galerie qui défile, zéro texte à l'affichage

**Phase 7 — Tests & QA** *(M)*
- Tests d'autorisation prioritaires : un joueur ne peut jamais lire le graphe d'une quête ni les notes privées d'un autre personnage ; le token d'écran de table ne donne accès à rien d'autre qu'au flux de diffusion
- Test fonctionnel du déclenchement automatique du nœud de conséquence à l'expiration d'un timer, y compris après redémarrage serveur
- Test de synchronisation temps réel avec plusieurs joueurs + écran de table sur une même session

**Phase 8 — Déploiement progressif** *(S)*
- Test en conditions réelles sur une campagne pilote avant généralisation
- Aucune migration destructive : `QuestObjective` reste disponible, aucune quête existante n'est cassée par l'introduction du graphe

**Dépendances** : la Phase 1 bloque toutes les suivantes. Les Phases 2 et 3 peuvent avancer en parallèle. La Phase 4 est indépendante et peut être menée en parallèle de 2/3. Les Phases 5 et 6 dépendent de leurs pendants backend respectifs.
