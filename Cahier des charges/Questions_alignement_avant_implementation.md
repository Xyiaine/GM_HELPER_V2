# Questions d'alignement avant implémentation

**Version :** 1.0 — 16 septembre 2026  
**Contexte nouveau :** les joueurs n'auront peut-être **aucun support numérique**, seulement leur fiche de personnage papier.

Répondez directement sous chaque question. Les questions marquées **◆** sont décisives : leur réponse conditionne l'architecture, les autres se rattrapent en cours de route.

---


## 0. Ce que la contrainte « papier seul » change dans les propositions

À lire avant de répondre : cette contrainte déplace le centre de gravité du projet.

| Proposition initiale                      | Devient                                                                                                                                                            |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Interface joueur mobile (10 propositions) | **Optionnelle.** Six d'entre elles tombent ou changent de cible. On ne peut plus compter sur un téléphone pour lancer un dé, voter, ou afficher une récompense.    |
| Écran de table `/table/:token`            | **Passe de « important » à « critique ».** C'est désormais le seul support numérique partagé par la table. Ses deux bugs bloquants deviennent la priorité absolue. |
| Lanceur de dés                            | **Change de camp.** Ce n'est plus un outil joueur, c'est un outil de saisie pour le MJ : il enregistre le résultat d'un dé physique pour que l'app l'exploite.     |
| Distribution des récompenses              | **Doit produire du papier à remettre**, pas une notification. Carte d'objet, bon de progression, note de faveur.                                                   |
| Vote d'Éclats en fin de séance            | **Ne peut plus être numérique.** Vote oral à main levée, bulletin papier, ou arbitrage du MJ.                                                                      |
| Impression                                | **Devient une fonctionnalité de premier plan.** Elle n'existe nulle part dans le code aujourd'hui : aucun style d'impression, aucune génération de PDF.            |
| Suivi des PJ (PV, inventaire, or, XP)     | **Retombe entièrement sur le MJ.** C'est le risque principal : transformer l'app en corvée de saisie, exactement l'inverse de l'objectif.                          |

**Le risque à surveiller.** Si le MJ doit saisir l'état de quatre à six personnages papier à chaque scène, l'application devient une charge et non un soulagement. La réponse à la question **B1** détermine si le projet va dans le mur ou non.

---

## A. Format de table — le fork qui décide de tout

**A1 ◆** Tous les joueurs sont-ils sans support numérique, ou est-ce variable selon les tables et les joueurs ?  
`[ ]` Tout le monde en papier, toujours   
`[ ]` Hybride : certains ont un téléphone, d'autres non  
`[ ]` Variable selon la tablée

> Réponse : Pour l'instant partons sur tout les joueurs ont un support papier

**A2 ◆** Y a-t-il un écran de table en séance (TV, moniteur, vidéoprojecteur) ?  
`[ ]` Oui, systématiquement  
`[ ]` Parfois, selon le lieu  
`[ ]` Jamais

> Réponse : Oui, systématiquement

**A3** Sur quoi le MJ joue-t-il pendant la séance ?  
`[ ]` Ordinateur portable  
`[ ]` Ordinateur fixe  
`[ ]` Tablette  
`[ ]` Autre :

> Réponse : Ordinateur portable

**A4** Les séances sont-elles toujours en présentiel, ou parfois à distance ?  
`[ ]` Présentiel uniquement  
`[ ]` Parfois à distance  
`[ ]` Souvent à distance

> Réponse : Présentiel uniquement

---


## B. Source de vérité — la question la plus importante

**B1 ◆** Qui tient l'état des personnages (PV, inventaire, or, XP) ?  
`[ ]` Le MJ, dans l'application, pour tout le monde  
`[ ]` Chaque joueur sur sa fiche papier, l'app ne suit que ce dont le MJ a besoin  
`[ ]` Les deux, avec une règle claire sur qui fait foi  
`[ ]` Personne dans l'app : le papier est la seule référence

> Réponse : Chaque joueur sur sa fiche papier, l'app ne suit que ce dont le MJ a besoin

**B2 ◆** L'application doit-elle être la référence de vérité, ou un aide-mémoire du MJ ?  
`[ ]` Référence : ce qui est dans l'app est vrai  
`[ ]` Aide-mémoire : le papier prime, l'app suit  
`[ ]` Les deux selon les données (préciser) :

> Réponse : Aide-mémoire : le papier prime, l'app suit

**B3 ◆** Que doit produire l'application quand un joueur gagne un objet, de l'or ou de l'XP ?  
`[ ]` Une modification en base, rien de physique  
`[ ]` Un papier à lui remettre (carte, bon)  
`[ ]` Les deux  
`[ ]` Rien : le MJ annonce à l'oral, le joueur note

> Réponse : Rien : le MJ annonce à l'oral, le joueur note

**B4** Faut-il pouvoir imprimer les fiches de personnage depuis l'application ?  
`[ ]` Oui, c'est un besoin  
`[ ]` Non, la fiche papier existante suffit  
`[ ]` Plus tard

> Réponse : Oui, c'est un besoin mais elles doivent avoir une forme de carte à jouer 

**B5** La fiche de personnage papier actuelle est-elle figée, ou peut-on la faire évoluer pour l'aligner sur l'application ?

> Réponse : on peux la faire évoluer mais le moins possible

**B6** Combien de saisie manuelle le MJ est-il prêt à faire pendant une séance ?  
`[ ]` Le minimum absolu, quitte à perdre des fonctions  
`[ ]` Un peu, si ça évite de tenir des notes à côté  
`[ ]` Peu importe, tant que l'app calcule à ma place

> Réponse : Un peu, si ça évite de tenir des notes à côté, mais il faut essayer de minimiser les saisies PC pour ne pas impacter la fluidité du jeu 

---

## C. L'interface joueur

**C1 ◆** Que fait-on de l'interface joueur existante (`/player/...`) ?  
`[ ]` On la répare, elle sert de secours quand un joueur a un téléphone  
`[ ]` On la gèle en l'état, hors périmètre  
`[ ]` On la retire du projet

> Réponse : On la répare, elle sert de secours quand un joueur a un téléphone

**C2** Ses trois briques cassées (lanceur de dés, notes privées, recalcul de niveau) doivent-elles être corrigées quand même ?  
`[ ]` Oui, au cas où  
`[ ]` Non, inutile si personne ne l'utilise  
`[ ]` Seulement les notes privées (le MJ pourrait les lire)

> Réponse : Oui, au cas où

---

## D. L'écran de table (si A2 est « oui »)

**D1 ◆** Que doit-il montrer en priorité ? Classer par ordre d'importance (1 = prioritaire).  
`[ ]` Ordre d'initiative et PV en direct  
`[ ]` Le spotlight (images, illustrations, bannières)  
`[ ]` Les horloges de menace et les minuteurs  
`[ ]` La carte du monde et la position des convois  
`[ ]` La Réserve de Menace  
`[ ]` Les récompenses au moment où elles tombent  
`[ ]` L'état des cités-états  
`[ ]` Un récapitulatif « précédemment » en ouverture

> Réponse : Des belles images en rapport avec les scènes actives de l'histoire. En combat, la carte de l'encounter ainsi que l'ordre de l'initiative mais pas les PV 

**D2** Est-il lu de loin (téléviseur au bout de la table) ou de près ?

> Réponse : Téléviseur en bout de table

**D3** Doit-il être passif, ou interactif au toucher ?

> Réponse : Passif, il est sur une page web de l'application et se met à jour au fur et à mesure de la quete

**D4** L'écran de table est-il le même sur toutes les campagnes, ou adaptable par le MJ ?

> Réponse : Il est théoriquement le même

---

## E. Les dés

**E1 ◆** Les jets se font-ils uniquement avec des dés physiques ?  
`[ ]` Oui, exclusivement  
`[ ]` Non, l'app sert aussi à lancer  
`[ ]` Les deux, au choix

> Réponse : Pour les joueurs oui, pour le MJ, physique ou numérique

**E2 ◆** Le MJ veut-il saisir le résultat d'un dé physique pour que l'application l'exploite (seuils, conséquences, journal, statistiques) ?  
`[ ]` Oui, c'est utile  
`[ ]` Non, trop de saisie  
`[ ]` Seulement pour les jets importants

> Réponse : Oui, c'est utile

**E3** Qui lance les dés des PNJ et des monstres : le MJ à la main, ou l'application ?

> Réponse : l'application

**E4** Le bouton « Résoudre la scène » (jet → difficulté → conséquence → avancement du nœud) t'intéresse-t-il, ou préfères-tu arbitrer entièrement toi-même ?

> Réponse : j'aime bien mais je veux la possibiliter d'arbitrer personellement

**E5** Y a-t-il des jets cachés (Perception passive, tests secrets) que l'application devrait gérer à ta place ?

> Réponse : Oui, automatise



---


## F. La gamification — le cœur de la demande initiale

**F1 ◆** Confirmes-tu vouloir un véritable système de jeu pour le MJ, avec score et progression ?  
`[ ]` Oui, à fond  
`[ ]` Oui, mais discret : un habillage léger, pas un jeu dans le jeu  
`[ ]` Non, finalement je préfère des outils, pas un jeu  
`[ ]` Je ne sais pas encore, montre-moi une version minimale

> Réponse : Oui, à fond

**F2 ◆** Sans téléphone pour les joueurs, qui attribue les Éclats en fin de séance ?  
`[ ]` Vote oral à main levée, le MJ saisit le total  
`[ ]` Bulletin papier anonyme que le MJ relève  
`[ ]` Le MJ s'auto-évalue honnêtement  
`[ ]` Personne : on remplace le vote par des déclencheurs objectifs mesurés par l'app

> Réponse : Vote oral à main levée, le MJ saisit le total

**F3 ◆** La Réserve de Menace doit-elle être visible des joueurs ?  
`[ ]` Oui, sur l'écran de table  
`[ ]` Oui, avec des jetons physiques à poser sur la table  
`[ ]` Non, elle reste secrète côté MJ  
`[ ]` Seulement quand elle franchit un seuil

> Réponse : Non, elle reste secrète côté MJ

**F4 ◆** Les decks de cartes (Dangers, Intrigues, PNJ) : numériques ou physiques ?  
`[ ]` Numériques, à l'écran du MJ  
`[ ]` Imprimés, tirés à la main parmi de vraies cartes  
`[ ]` Les deux : tirés à l'écran, mais imprimés pour être montrés

> Réponse : Numériques, à l'écran du MJ

**F5** Les défis de séance (contrainte volontaire qui double le gain) t'intéressent-ils ?  
Lesquels te parlent : « Sel pur » (aucun dé), « Sans mémoire » (ne pas relire les secrets), « Le Ver veille » (horloge qui monte au temps réel), « Impitoyable » (complications non retirables), « Foi aveugle » (PV masqués) ?

> Réponse : ils peuvent être interessant pour augmenter la difficulté du gameplay

**F6** Les succès du MJ : amusement réel ou charge inutile ?

> Réponse : il faut que ce soit non punitif et bienveillant

**F7** Le contrat de table (carte X, signal de pause) est-il dans le périmètre ?

> Réponse : Non

**F8** Le système de score doit-il être **global** (toutes campagnes confondues) ou **par campagne** ?

> Réponse : par campagne

**F9** Y a-t-il des mécaniques de la table que tu tiens déjà à la main et que l'application ne doit **pas** tenter de remplacer ?

> Réponse : non

---

## G. Impression et matériel

**G1 ◆** L'impression est-elle un besoin réel ?  
`[ ]` Oui : fiches, cartes, aides de jeu, récapitulatifs  
`[ ]` Seulement les récapitulatifs de séance  
`[ ]` Non

> Réponse : Oui : fiches, cartes, aides de jeu, récapitulatifs

**G2** Si oui, sous quelle forme ?  
`[ ]` Impression navigateur (Ctrl+P), feuille A4  
`[ ]` Export PDF  
`[ ]` Fichiers prêts à envoyer en imprimerie (cartes format standard)

> Réponse : Export PDF

**G3** Veux-tu du matériel physique pour les joueurs (cartes d'objet, cartes de capacité, jetons de Menace ou de destin) ?

> Réponse : Oui, je pense que leurs objets rares, epic, legendaires, leur cartes de personnage etc sont mieux en physique

**G4** Le format des cartes à imprimer doit-il correspondre à un standard (poker 63×88 mm, tarot) ?

> Réponse : form factor tarot mais en agrandi 1.5xL et 1.5xl

---


## H. Périmètre, rythme et méthode

**H1 ◆** Par quoi commence-t-on ?  
`[ ]` La Vague 1 seule (les correctifs bloquants), on verra ensuite  
`[ ]` Un lot livrable de bout en bout : correctifs + écran de table + récompenses  
`[ ]` Directement la gamification, les bugs attendront

> Réponse : Un lot livrable de bout en bout : correctifs + écran de table + récompenses  
>

**H2 ◆** Combien de temps peux-tu consacrer à ce chantier ?  
`[ ]` Quelques soirées  
`[ ]` Quelques semaines  
`[ ]` Pas de limite, on prend le temps

> Réponse : Quelques soirées

**H3** Comment veux-tu que je travaille ?  
`[ ]` Je corrige directement sur le dépôt  
`[ ]` Je propose des patches que tu relis avant application  
`[ ]` Je documente, tu implémentes toi-même

> Réponse : Je corrige directement sur le dépôt

**H4** Peut-on modifier le schéma Prisma et ajouter des migrations ?  
`[ ]` Oui, sans contrainte  
`[ ]` Oui, mais la base contient des données à conserver  
`[ ]` Non, on travaille avec le schéma actuel

> Réponse : Oui, sans contrainte

**H5** Peut-on ajouter des dépendances, ou rester strictement sur la pile actuelle (React, Zustand, Express, Prisma, Socket.IO) ?

> Réponse : on peux en ajouter

**H6** Le thème sombre est-il un choix assumé (ambiance de table, écran de TV) ou subi ?  
`[ ]` Assumé, on garde le sombre  
`[ ]` Subi, je veux un thème clair  
`[ ]` Les deux, avec une bascule

> Réponse : Il est subit, je veux une UI interactive minimaliste mais avec des effets, quelques chose qui donne envie de jouer, par contre, on reste dans un univers de survie avec du sable, de la radioactivité, un monde sans espoir

**H7 ◆** Priorité absolue si le temps manque : la fiabilité (le temps réel fonctionne enfin) ou les nouveautés (le jeu du MJ) ?

> Réponse : Tout implémenter

**H8** Le déploiement actuel (VPS + PM2 + Nginx) est-il l'environnement cible définitif ?

> Réponse : Il n'y a pas d'environnement définitif défini, l'objectif est que l'application tourne dans un navigateur, utilise les bonnes pratiques 

**H9** Y a-t-il des parties du code que je ne dois pas toucher, ou qui sont en cours de refonte ?

> Réponse : non, backup bien tout ça sur le git <https://github.com/Xyiaine/GM_HELPER_V2> en disant que c'est une modification majeur puis commence à travailler en faisant des commit réguliers commentés

---

## I. La table réelle et l'univers

**I1** Combien de joueurs par séance ?

> Réponse : 4 à 8

**I2** Durée et fréquence d'une séance ?

> Réponse : toutes les deux semaines, 3h

**I3** La campagne en cours est-elle « La Course du Sel », ou une autre ?

> Réponse : c'est bien la course du sel mais la course du sel n'est que la quête d'ouverture de la campagne

**I4 ◆** As-tu déjà mené des séances avec l'application ? Qu'est-ce qui t'a le plus agacé sur le moment ?

> Réponse : je n'ai pas encore commencé

**I5** Y a-t-il un co-MJ, ou un joueur qui pourrait tenir un rôle (scribe, chronométreur, cartographe) ?

> Réponse : non pas pour le moment

**I6** Les 24 arbres de compétences et le bestiaire sont-ils utilisés tels quels, ou en cours de refonte ?

> Réponse : il faudra en faire des refontes mais gardons les comme ça pour le moment

**I7** Le système de règles est-il D\&D 5e strict, ou un système maison ? Le code parle de « progression hybride », je veux comprendre la règle réelle.

> Réponse : c'est un système maison basé sur dnd5e mais adapté à mes besoins

**I8** Les 10 cités-états et leurs 7 paramètres sont-ils réellement suivis en jeu, ou c'est du lore dormant ?

> Réponse : ils doivent réellement etre suivi dans le jeu

**I9** Qu'est-ce qui, dans une séance réussie, te procure le plus de plaisir à toi ? Et aux joueurs, d'après ce que tu observes ?

> Réponse : je n'ai pas encore fait de séances avec mes joueurs, aligne ça sur comment rendre un joueur heureux, lui donner un sentiment de progression, le pousser à résoudre les intrigues du scénario et le passionner par le lore du jeu et la narration

---

## Les six questions qui débloquent tout le reste

Si vous ne répondez qu'à six questions, ce sont celles-là :

| #      | Question                                        | Pourquoi elle est décisive                                            |
| ------ | ----------------------------------------------- | --------------------------------------------------------------------- |
| **B1** | Qui tient l'état des personnages ?              | Détermine si l'app est un outil ou une corvée de saisie.              |
| **A2** | Y a-t-il un écran de table ?                    | Détermine s'il existe un support partagé, ou si tout passe par le MJ. |
| **F1** | Veux-tu vraiment un système de jeu pour le MJ ? | Détermine la moitié du chantier.                                      |
| **F2** | Qui attribue les Éclats sans téléphone ?        | Détermine si le score est crédible ou auto-complaisant.               |
| **H7** | Fiabilité ou nouveautés en premier ?            | Détermine l'ordre de tout le backlog.                                 |
| **I4** | Qu'est-ce qui t'a agacé en séance ?             | La réponse la plus fiable sur les vraies priorités.                   |
