import json
import os

json_path = r"c:\Users\hp.INTEST\Documents\dev\GM_Helper\Campagne_v3_QuestData.json"

with open(json_path, "r", encoding="utf-8") as f:
    data = json.load(f)

# 1. Update importInstructions
data["importInstructions"] = (
    "Ce fichier contient l'intégralité de la quête d'ouverture 'La Course du Sel' sous une forme structurée, "
    "destinée à être importée telle quelle dans le Système de Quêtes de GM Helper (v2). Chaque objet correspond "
    "exactement à une table du schéma décrit dans Systeme_De_Quete_v2.md. Les champs 'id' sont des identifiants techniques "
    "internes à ce fichier, utilisés uniquement pour les références croisées (fromNodeId, nodeId, etc.) ; ils ne portent aucune "
    "signification narrative. Le champ 'displayCode' porte la numérotation narrative humaine (ex: '0.d', '2A.e') et doit être "
    "conservé tel quel pour l'affichage. Pour tout texte narratif complémentaire ou contexte de lecture, se référer au document "
    "séparé Campagne_v3_Lore (1).md, qui n'a pas besoin d'être importé dans le système de quêtes."
)

# 2. Update QuestObjective
for obj in data["QuestObjective"]:
    if obj["id"] == "obj_sauver_mira":
        obj["id"] = "obj_sauver_ines"
        obj["label"] = "Secourir la survivante retrouvée dans les décombres du Convoi 5 (Ines)"

# 3. Update QuestFactionProgress
for fp in data["QuestFactionProgress"]:
    if "Ashen Roka" in fp.get("notes", ""):
        fp["notes"] = fp["notes"].replace("Ashen Roka", "Doran Roka")
    if "Selia Sel-Blanc" in fp.get("notes", ""):
        fp["notes"] = fp["notes"].replace("Selia Sel-Blanc", "Meya Sel-Blanc")
    if "Vray Cendres" in fp.get("notes", ""):
        fp["notes"] = fp["notes"].replace("Vray Cendres", "Ashka Cendres")

# 4. Update QuestNPCLink
for link in data["QuestNPCLink"]:
    if link["npcId"] == "npc_mira":
        link["npcId"] = "npc_ines"
        link["role"] = "a secourir / alliee potentielle (ou menace future)"
    elif link["npcId"] == "npc_ashen_roka":
        link["npcId"] = "npc_doran_roka"
    elif link["npcId"] == "npc_selia_sel_blanc":
        link["npcId"] = "npc_meya_sel_blanc"
    elif link["npcId"] == "npc_vray_cendres":
        link["npcId"] = "npc_ashka_cendres"

# Add Sura Voix-des-Dunes link if not present
if not any(l["npcId"] == "npc_sura_voix_des_dunes" for l in data["QuestNPCLink"]):
    data["QuestNPCLink"].append({
        "npcId": "npc_sura_voix_des_dunes",
        "questId": "quest_course_du_sel",
        "role": "meneuse des Adorateurs du Chant des Dunes / sauveteuse lors de la Suspension",
        "nodeId": "node_15b"
    })

# 5. Update QuestNodeReward
for rw in data["QuestNodeReward"]:
    rw["rewardValue"] = rw["rewardValue"].replace("Mira", "Ines")
    rw["rewardValue"] = rw["rewardValue"].replace("Ashen Roka", "Doran Roka")
    rw["rewardValue"] = rw["rewardValue"].replace("Vray Cendres", "Ashka Cendres")

# Problems mapping per node
problems_map = {
    "node_0a": [
        {
            "description": "Le volant vibre violemment entre tes mains, la direction hésite à chaque cahot du terrain.",
            "skillCheck": "Jet de Réflexes ou Pilotage",
            "failureConsequence": "Échec : le véhicule fait une embardée, dégât mineur au convoi."
        },
        {
            "description": "Une douleur sourde parcourt ton corps quelque part, sans que tu saches si elle est grave.",
            "skillCheck": "Jet de Vigueur ou Médecine",
            "failureConsequence": "Échec : une blessure passe inaperçue et s'aggrave, désavantage sur un jet physique plus tard dans la journée."
        }
    ],
    "node_0b": [
        {
            "description": "Ton doigt reste crispé sur la détente, comme si la volonté n'y était pour rien.",
            "skillCheck": "Jet de Sang-Froid",
            "failureConsequence": "Échec : une balle perdue supplémentaire part, gaspillant une munition ou frôlant un allié."
        },
        {
            "description": "Les regards des autres pèsent sur toi, chargés d'une question que personne n'ose poser à voix haute.",
            "skillCheck": "Jet de Charisme",
            "failureConsequence": "Échec : la méfiance s'installe d'un cran de plus entre les PJ."
        }
    ],
    "node_0c": [
        {
            "description": "La fumée au loin brouille tes yeux en un halo indistinct.",
            "skillCheck": "Jet de Perception",
            "failureConsequence": "Échec : un détail important de l'épave (silhouette, mouvement) passe inaperçu."
        },
        {
            "description": "Le véhicule tire légèrement vers l'épave, comme si une partie de toi voulait déjà y retourner.",
            "skillCheck": "Jet de Pilotage",
            "failureConsequence": "Échec : le convoi dévie involontairement, perdant un peu de temps."
        }
    ],
    "node_0d": [
        {
            "description": "Le moteur peine à répondre sous ton pied, comme si le sable ralentissait chaque rouage.",
            "skillCheck": "Jet de Pilotage",
            "failureConsequence": "Échec : quelques secondes précieuses perdues, la menace gagne du terrain."
        },
        {
            "description": "Ta voix se perd dans le vent, le reste du convoi semble ne pas t'avoir entendu.",
            "skillCheck": "Jet de Vigueur (crier fort)",
            "failureConsequence": "Échec : un véhicule du convoi ne reçoit pas l'alerte à temps."
        }
    ],
    "node_0e": [
        {
            "description": "Les décombres encore chauds craquent sous chaque pas, du métal tordu prêt à entailler la peau.",
            "skillCheck": "Jet de Réflexes",
            "failureConsequence": "Échec : coupure ou blessure mineure en fouillant."
        },
        {
            "description": "Le temps presse, mais impossible de dire précisément combien il en reste avant que quelque chose n'arrive.",
            "skillCheck": "Jet de Sang-Froid",
            "failureConsequence": "Échec : le temps est sous-estimé, la menace du ver progresse d'un cran de plus que prévu."
        }
    ],
    "node_1a": [
        {
            "description": "Une plaque de tôle rouillée cède sous ton poids dans un grincement sinistre.",
            "skillCheck": "Jet de Réflexes",
            "failureConsequence": "Échec : chute, blessure mineure, ou bruit qui attire l'attention."
        },
        {
            "description": "Le raccourci qui semblait évident se perd entre deux carcasses presque identiques.",
            "skillCheck": "Jet de Perception ou Survie",
            "failureConsequence": "Échec : détour, un peu de temps perdu."
        }
    ],
    "node_1b": [
        {
            "description": "Ta gorge se serre, la chaleur brouille ta vue par vagues.",
            "skillCheck": "Jet de Vigueur",
            "failureConsequence": "Échec : un coup de chaleur ralentit le PJ pour la suite de l'étape."
        },
        {
            "description": "L'ombre repérée au loin est plus éloignée qu'elle ne semblait, et le convoi n'attendra pas indéfiniment.",
            "skillCheck": "Jet de Perception ou Survie",
            "failureConsequence": "Échec : la pause est écourtée, aucun vrai répit gagné."
        }
    ],
    "node_1c": [
        {
            "description": "Le masque se coince, les sangles s'emmêlent alors que l'air se charge déjà de poussière.",
            "skillCheck": "Jet de Dextérité",
            "failureConsequence": "Échec : quelques secondes d'exposition supplémentaires à la contamination."
        },
        {
            "description": "La bâche glisse entre tes doigts, le vent manquant de te l'arracher avant qu'elle ne couvre la caisse.",
            "skillCheck": "Jet de Force ou Réflexes",
            "failureConsequence": "Échec : la caisse scellée reste partiellement exposée à la poussière."
        }
    ],
    "node_1d": [
        {
            "description": "Le moteur crache une vapeur âcre à chaque tentative de redémarrage.",
            "skillCheck": "Jet de Mécanique ou Force",
            "failureConsequence": "Échec : la réparation prend plus de temps que prévu."
        },
        {
            "description": "Sous le capot, un mince filet d'eau s'échappe déjà de la citerne — une fuite qu'il faut colmater avant qu'elle ne s'aggrave.",
            "skillCheck": "Jet de Mécanique ou Bricolage",
            "failureConsequence": "Échec : la citerne perd une part significative de son eau (Cactus de Sel nécessaire)."
        }
    ],
    "node_1e": [
        {
            "description": "Le convoi rival grossit à vue d'œil, et le temps de décider s'amenuise.",
            "skillCheck": "Jet de Perception ou Sang-Froid",
            "failureConsequence": "Échec : le convoi rival remarque les PJ en premier, prenant l'initiative de la rencontre."
        },
        {
            "description": "Ta voix porte plus loin que prévu dans le silence du désert — impossible de la rappeler une fois lancée.",
            "skillCheck": "Jet de Charisme",
            "failureConsequence": "Échec : le message est mal interprété par le convoi rival, qui réagit avec méfiance ou hostilité."
        }
    ],
    "node_1f": [
        {
            "description": "Le feu crépite, mais le bois rare menace de s'éteindre avant la fin de la nuit.",
            "skillCheck": "Jet de Survie",
            "failureConsequence": "Échec : le feu s'éteint, une nuit plus froide et plus vulnérable."
        },
        {
            "description": "L'objet personnel semble familier, sans qu'aucun souvenir précis ne remonte.",
            "skillCheck": "Jet de Volonté ou Empathie (introspection)",
            "failureConsequence": "Échec : aucun fragment de mémoire n'affleure cette fois — sans conséquence mécanique grave."
        }
    ],
    "node_15a": [
        {
            "description": "La corde glisse entre des mains moites, difficile à nouer fermement dans la panique montante.",
            "skillCheck": "Jet de Dextérité",
            "failureConsequence": "Échec : le lien entre deux PJ n'est pas assez solide, risque de rupture plus tard dans le blanc."
        },
        {
            "description": "Le moteur, une fois coupé, refuse de repartir aussi facilement qu'il s'est arrêté.",
            "skillCheck": "Jet de Mécanique",
            "failureConsequence": "Échec : redémarrage retardé, temps perdu sur le chronomètre de la Suspension."
        }
    ],
    "node_15b": [
        {
            "description": "Le chant semble venir de partout à la fois, brouillé par l'écho de la blancheur.",
            "skillCheck": "Jet de Perception ou Survie",
            "failureConsequence": "Échec : mauvaise direction prise, du temps perdu sur le chronomètre."
        },
        {
            "description": "Ta voix, en criant, se perd presque aussitôt, absorbée par le silence ouaté de la Suspension.",
            "skillCheck": "Jet de Vigueur",
            "failureConsequence": "Échec : le signal n'est pas entendu, aucune réponse ne vient."
        }
    ],
    "node_15c": [
        {
            "description": "Chaque geste pour retirer une arme ou un objet métallique semble une éternité sous les éclairs qui crépitent.",
            "skillCheck": "Jet de Dextérité",
            "failureConsequence": "Échec : un arc frappe l'objet encore porté, dégât ou étourdissement bref."
        },
        {
            "description": "Le PJ figé par le flashback ne réagit à aucun appel, un poids mort en pleine tempête.",
            "skillCheck": "Jet de Force",
            "failureConsequence": "Échec : impossible de le déplacer à temps, il subit un choc supplémentaire du prochain éclair."
        }
    ],
    "node_2Aa": [
        {
            "description": "Le chant, ténu, se confond avec le sifflement du vent — difficile de discerner une vraie direction.",
            "skillCheck": "Jet de Perception",
            "failureConsequence": "Échec : direction erronée prise dans les dunes, détour."
        },
        {
            "description": "Le mécanisme de l'arme résiste, enrayé par le sable fin qui s'est infiltré partout.",
            "skillCheck": "Jet de Mécanique ou Dextérité",
            "failureConsequence": "Échec : l'arme reste partiellement enrayée pour la suite de l'étape."
        }
    ],
    "node_2Ab": [
        {
            "description": "Les paroles du chant semblent presque former des mots, juste hors de portée de la compréhension.",
            "skillCheck": "Jet d'Intelligence ou Perception",
            "failureConsequence": "Échec : rien ne se laisse saisir, occasion manquée."
        },
        {
            "description": "Le souffle se fait court, la fatigue accumulée depuis le réveil commence à peser.",
            "skillCheck": "Jet de Vigueur",
            "failureConsequence": "Échec : un point de fatigue s'accumule, désavantage à la prochaine action physique."
        }
    ],
    "node_2Ac": [
        {
            "description": "Le convoi ennemi s'approche plus vite que le temps qu'il faudrait pour se mettre pleinement à couvert.",
            "skillCheck": "Jet de Discrétion ou Réflexes",
            "failureConsequence": "Échec : repéré avant d'être prêt, perte de l'avantage de surprise."
        },
        {
            "description": "L'éclaireur envoyé en avant-poste peine à revenir sans se faire remarquer.",
            "skillCheck": "Jet de Discrétion",
            "failureConsequence": "Échec : l'éclaireur est repéré, ou revient avec une information incomplète."
        }
    ],
    "node_2Ad": [
        {
            "description": "Les mots de négociation se bousculent, et Doran Roka n'est pas homme à attendre longtemps une réponse.",
            "skillCheck": "Jet de Charisme",
            "failureConsequence": "Échec : la négociation échoue, le combat devient inévitable."
        },
        {
            "description": "Le véhicule cale au pire moment, en travers de la route qu'il devait bloquer.",
            "skillCheck": "Jet de Pilotage",
            "failureConsequence": "Échec : la manœuvre de blocage échoue, les Loups de Sel contournent facilement."
        }
    ],
    "node_2Ae": [
        {
            "description": "Le silence soudain écrase les tympans, et crier une alerte cohérente demande un effort que la panique ne facilite pas.",
            "skillCheck": "Jet de Sang-Froid",
            "failureConsequence": "Échec : l'alerte, confuse, ne prévient pas tout le monde à temps."
        },
        {
            "description": "Convaincre les Loups de Sel de cesser le feu en une poignée de secondes tient de l'exploit.",
            "skillCheck": "Jet de Charisme",
            "failureConsequence": "Échec : la trêve échoue, le combat continue malgré la menace commune."
        }
    ],
    "node_2Af": [
        {
            "description": "Le présent choisi semble dérisoire face à ce que Sura et les siens ont offert.",
            "skillCheck": "Jet de Charisme ou Empathie",
            "failureConsequence": "Échec : le geste tombe à plat, sans offenser mais sans vraiment toucher non plus."
        },
        {
            "description": "La question posée touche visiblement à quelque chose que les Enfants du Sel préfèrent taire.",
            "skillCheck": "Jet de Charisme (Diplomatie)",
            "failureConsequence": "Échec : Sura élude poliment, aucune information supplémentaire n'est obtenue."
        }
    ],
    "node_2Ba": [
        {
            "description": "Le tissu de fortune censé protéger des radiations laisse passer un peu trop d'air pour être vraiment fiable.",
            "skillCheck": "Jet de Bricolage",
            "failureConsequence": "Échec : protection imparfaite, légère exposition."
        },
        {
            "description": "Le sol semble stable sous le premier pas, mais craque étrangement sous le second.",
            "skillCheck": "Jet de Perception ou Survie",
            "failureConsequence": "Échec : un point faible du sol n'est pas repéré, risque pour plus tard."
        }
    ],
    "node_2Bb": [
        {
            "description": "Le compteur crépite de façon erratique, difficile à interpréter sans une lecture attentive.",
            "skillCheck": "Jet de Science",
            "failureConsequence": "Échec : une poche de radiation proche passe inaperçue jusqu'à la prochaine sous-étape."
        },
        {
            "description": "La trajectoire tracée dans le silence semble sûre, mais un détail du terrain a peut-être échappé à l'œil.",
            "skillCheck": "Jet de Perception",
            "failureConsequence": "Échec : un détour coûteux en temps s'impose plus tard."
        }
    ],
    "node_2Bc": [
        {
            "description": "Chaque mètre de déviation improvisée use un peu plus de carburant déjà compté.",
            "skillCheck": "Jet de Pilotage",
            "failureConsequence": "Échec : consommation excessive de carburant, ressource à surveiller plus tard."
        },
        {
            "description": "L'éclaireur envoyé à pied doit revenir vite, sans laisser une trace de son passage qui trahirait le convoi.",
            "skillCheck": "Jet de Discrétion",
            "failureConsequence": "Échec : l'éclaireur laisse une trace repérable, un risque pour plus tard."
        }
    ],
    "node_2Bd": [
        {
            "description": "Ashka Cendres jauge chaque mot avant de répondre, et une maladresse pourrait fermer la conversation net.",
            "skillCheck": "Jet de Charisme",
            "failureConsequence": "Échec : Ashka se referme, aucune information n'est partagée."
        },
        {
            "description": "L'aide matérielle offerte pourrait sembler suspecte plutôt que généreuse, selon la manière dont elle est présentée.",
            "skillCheck": "Jet de Charisme ou Empathie",
            "failureConsequence": "Échec : le geste est perçu avec méfiance, aucune faveur en retour n'est gagnée."
        }
    ],
    "node_2Be": [
        {
            "description": "Rester parfaitement immobile alors que le grondement approche demande un sang-froid que la panique menace de rompre.",
            "skillCheck": "Jet de Sang-Froid",
            "failureConsequence": "Échec : un geste ou un bruit trahit la présence du convoi, le grondement se rapproche un instant."
        },
        {
            "description": "Tracer une sortie sûre du verre noir, sans donnée fiable, tient plus du pari que du calcul.",
            "skillCheck": "Jet de Survie ou Perception",
            "failureConsequence": "Échec : la sortie choisie est plus longue ou plus risquée que prévu."
        }
    ],
    "node_3a": [
        {
            "description": "Les épaves se ressemblent toutes, et chercher un indice précis parmi elles prend un temps que le sprint final ne pardonnera pas.",
            "skillCheck": "Jet de Perception",
            "failureConsequence": "Échec : aucun indice trouvé, du temps précieux perdu."
        },
        {
            "description": "Une pièce d'équipement, secouée par des jours de trajet, montre des signes d'usure qu'il faudrait vérifier avant de foncer.",
            "skillCheck": "Jet de Mécanique",
            "failureConsequence": "Échec : un problème d'équipement non détecté ressurgit plus tard, au pire moment."
        }
    ],
    "node_3b": [
        {
            "description": "Coopérer ou saboter, la décision doit se prendre en une fraction de seconde, sans temps pour peser le pour et le contre.",
            "skillCheck": "Jet de Sang-Froid",
            "failureConsequence": "Échec : l'occasion est manquée, ni coopération ni sabotage n'aboutissent."
        },
        {
            "description": "Le dernier mot échangé avec le convoi adverse pourrait envenimer les choses autant que les apaiser.",
            "skillCheck": "Jet de Charisme",
            "failureConsequence": "Échec : la relation avec ce convoi rival se détériore pour la suite de la campagne."
        }
    ],
    "node_3c": [
        {
            "description": "Désamorcer à la main demande une précision que des mains tremblantes de fatigue ne garantissent plus.",
            "skillCheck": "Jet de Dextérité",
            "failureConsequence": "Échec : l'obstacle inflige des dégâts au véhicule ou à un PJ."
        },
        {
            "description": "Sécuriser un passage plus sûr pour tous prend du temps — du temps que les convois rivaux, eux, ne perdent pas.",
            "skillCheck": "Jet de Pilotage ou Ingénierie",
            "failureConsequence": "Échec : le convoi perd une position précieuse dans la course."
        }
    ],
    "node_3d": [
        {
            "description": "Le moteur hurle à un régime qu'il n'était pas censé tenir, une vibration inquiétante montant du châssis.",
            "skillCheck": "Jet de Pilotage",
            "failureConsequence": "Échec : dommage au véhicule, ralentissement."
        },
        {
            "description": "Gêner un rival exige de se rapprocher dangereusement de son véhicule, au risque d'une collision.",
            "skillCheck": "Jet de Pilotage ou Réflexes",
            "failureConsequence": "Échec : collision mineure, dégâts pour les deux véhicules."
        }
    ],
    "node_3e": [
        {
            "description": "Larguer une part de la cargaison au bon moment, sans se faire repérer par la charge elle-même qui roule dans l'habitacle.",
            "skillCheck": "Jet de Réflexes",
            "failureConsequence": "Échec : la cargaison est larguée trop tôt ou trop tard, sans effet sur le ver."
        },
        {
            "description": "Protéger un PJ blessé en pleine charge finale ralentit inévitablement le véhicule — la question est de combien.",
            "skillCheck": "Jet de Force",
            "failureConsequence": "Échec : le ralentissement est plus important que prévu, risque accru pour tout le convoi."
        }
    ]
}

# 6. Process QuestNode list
for node in data["QuestNode"]:
    nid = node["id"]
    # Replace names in strings
    for field in ["mjDescription", "actionsNarrativeHook"]:
        if node.get(field):
            node[field] = node[field].replace("Mira", "Ines")
            node[field] = node[field].replace("Ashen Roka", "Doran Roka")
            node[field] = node[field].replace("Selia Sel-Blanc", "Meya Sel-Blanc")
            node[field] = node[field].replace("Vray Cendres", "Ashka Cendres")
    
    # Attach problems if defined
    if nid in problems_map:
        node["problems"] = problems_map[nid]

# Save updated JSON
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Campagne_v3_QuestData.json updated successfully!")
