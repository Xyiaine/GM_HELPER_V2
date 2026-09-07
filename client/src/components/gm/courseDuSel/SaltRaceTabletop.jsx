import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass, Flame, Users, ArrowRight, RotateCcw,
  CheckCircle, AlertCircle, Layers, Trophy, Swords, Zap, HelpCircle
} from 'lucide-react';
import QuestNodeCard from './QuestNodeCard';
import DesertHazardDeck from './DesertHazardDeck';
import LoreAtmosphereDeck from './LoreAtmosphereDeck';
import NpcCardModal from './NpcCardModal';
import TacticalCombatArena from './TacticalCombatArena';
import { INITIAL_CONVOYS, SALT_RACE_NPCS, NODE_NPC_MAP } from './saltRaceData';
import api from '../../../utils/api';
import { useGmStore } from '../../../store/gmStore';

const DIRECTOR_PHASES = [
  { id: 1, label: '1. Immersion Sensorielle', instruction: 'Lisez le triptyque (ce qu\'on voit, entend, sent) à vos joueurs pour poser le décor sans nommer leurs émotions.' },
  { id: 2, label: '2. Enjeu & Jet de Dé', instruction: 'Énoncez l\'enjeu concret AVANT le jet, puis faites lancer les dés selon le DD 5e suggéré.' },
  { id: 3, label: '3. PNJ & Roleplay', instruction: 'Faites réagir les PNJ présents dans la scène (cliquez sur leur carte miniature pour voir leur mimique et voix).' },
  { id: 4, label: '4. Branchement & Pioche', instruction: 'Les joueurs ont tranché : cliquez sur l\'un des choix disponibles pour piocher la prochaine carte du graphe.' }
];

export default function SaltRaceTabletop({ quest, campaignId }) {
  const nodes = quest?.nodes || [];

  // Map of all nodes by ID for fast lookup
  const allNodesMap = useMemo(() => {
    const map = {};
    nodes.forEach(n => { map[n.id] = n; });
    return map;
  }, [nodes]);

  // Initial active node: find node_0a or first node
  const initialNodeId = useMemo(() => {
    const node0a = nodes.find(n => n.id === 'node_0a' || n.displayCode === '0.a');
    return node0a ? node0a.id : (nodes[0]?.id || null);
  }, [nodes]);

  // Saved state from localStorage
  const storageKey = `salt_race_${campaignId}_${quest?.id}`;

  const [activeNodeId, setActiveNodeId] = useState(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}_node`);
      return saved && allNodesMap[saved] ? saved : initialNodeId;
    } catch (e) {
      return initialNodeId;
    }
  });

  const [historyNodeIds, setHistoryNodeIds] = useState(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}_history`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [wormClock, setWormClock] = useState(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}_worm`);
      return saved !== null ? parseInt(saved, 10) : 0;
    } catch (e) {
      return 0;
    }
  });

  const [convoys, setConvoys] = useState(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}_convoys`);
      return saved ? JSON.parse(saved) : INITIAL_CONVOYS;
    } catch (e) {
      return INITIAL_CONVOYS;
    }
  });

  const [directorPhase, setDirectorPhase] = useState(1);
  const [selectedNpcForModal, setSelectedNpcForModal] = useState(null);
  const [campaignNpcs, setCampaignNpcs] = useState([]);

  // Combat Arena State
  const [isCombatArenaOpen, setIsCombatArenaOpen] = useState(false);
  const [activeCombatEncounterId, setActiveCombatEncounterId] = useState(null);
  const [combatActiveNode, setCombatActiveNode] = useState(null);

  const {
    encounters = [],
    vehicles = [],
    fetchEncounters,
    fetchVehicles,
    createEncounter
  } = useGmStore();

  // Fetch campaign NPCs, encounters & vehicles to connect with DB
  useEffect(() => {
    if (!campaignId) return;
    api.get(`/api/v1/gm/campaigns/${campaignId}/npcs`)
      .then(res => setCampaignNpcs(res.npcs || []))
      .catch(err => console.error('Fetch NPCs error:', err));

    if (fetchEncounters) fetchEncounters(campaignId);
    if (fetchVehicles) fetchVehicles(campaignId);
  }, [campaignId, fetchEncounters, fetchVehicles]);

  // Hydrate convoys and wormClock from DB quest props if localStorage is unset
  useEffect(() => {
    if (!quest) return;
    try {
      const hasLocalConvoys = localStorage.getItem(`${storageKey}_convoys`);
      if (!hasLocalConvoys && quest.factionProgress && quest.factionProgress.length > 0) {
        setConvoys(prev => prev.map(c => {
          const matching = quest.factionProgress.find(f => {
            if (c.id === 'convoi_1' && f.factionName.includes('Loups')) return true;
            if (c.id === 'convoi_2' && f.factionName.includes('PJ')) return true;
            if (c.id === 'convoi_3' && f.factionName.includes('Sel Blanc')) return true;
            if (c.id === 'convoi_4' && f.factionName.includes('Cendres')) return true;
            if (c.id === 'convoi_5' && f.factionName.includes('Nostalgics')) return true;
            return false;
          });
          if (matching && matching.progressValue !== undefined) {
            return { ...c, progress: Math.round(matching.progressValue / 15) };
          }
          return c;
        }));
      }

      const hasLocalWorm = localStorage.getItem(`${storageKey}_worm`);
      if (!hasLocalWorm && quest.threats && quest.threats.length > 0) {
        const wormThreat = quest.threats.find(t => t.name?.toLowerCase().includes('ver')) || quest.threats[0];
        if (wormThreat && wormThreat.currentLevel !== undefined) {
          setWormClock(wormThreat.currentLevel);
        }
      }
    } catch (e) {
      console.warn('Hydration warning:', e);
    }
  }, [quest, storageKey]);

  // Sync state to localStorage
  useEffect(() => {
    if (activeNodeId) {
      try {
        localStorage.setItem(`${storageKey}_node`, activeNodeId);
        localStorage.setItem(`${storageKey}_history`, JSON.stringify(historyNodeIds));
        localStorage.setItem(`${storageKey}_worm`, String(wormClock));
        localStorage.setItem(`${storageKey}_convoys`, JSON.stringify(convoys));
      } catch (e) {}
    }
  }, [activeNodeId, historyNodeIds, wormClock, convoys, storageKey]);

  // Active Node Object
  const activeNode = allNodesMap[activeNodeId] || nodes[0];

  // Handle branching to next node (Drawing from Adventure Deck)
  const handleSelectNextNode = (targetNodeId) => {
    if (!allNodesMap[targetNodeId]) return;
    setHistoryNodeIds(prev => [activeNodeId, ...prev]);
    setActiveNodeId(targetNodeId);
    setDirectorPhase(1); // Reset director to phase 1
  };

  // Back button handler
  const handleGoBack = () => {
    if (historyNodeIds.length === 0) return;
    const prevNodeId = historyNodeIds[0];
    setHistoryNodeIds(prev => prev.slice(1));
    setActiveNodeId(prevNodeId);
    setDirectorPhase(1);
  };

  // Reset entire quest run
  const handleResetQuestRun = () => {
    if (!confirm('Réinitialiser la course depuis le début (nœud 0.a) ?')) return;
    setActiveNodeId(initialNodeId);
    setHistoryNodeIds([]);
    setWormClock(0);
    setConvoys(INITIAL_CONVOYS);
    setDirectorPhase(1);
  };

  // Helper to resolve and merge NPC with live database stats
  const resolveNpc = (npcKeyOrObj) => {
    if (!npcKeyOrObj) return null;
    const key = typeof npcKeyOrObj === 'string' ? npcKeyOrObj : (npcKeyOrObj.id || npcKeyOrObj.name);
    const predefined = SALT_RACE_NPCS[key] || Object.values(SALT_RACE_NPCS).find(n => n.name === key);
    const fromDb = campaignNpcs?.find(n => n.id === key || n.name.toLowerCase().includes(key.replace('npc_', '').replace(/_/g, ' ')));

    if (predefined && fromDb) {
      return {
        ...predefined,
        id: fromDb.id,
        armorClass: fromDb.armorClass || predefined.statblock?.ca || 10,
        hpMax: fromDb.hpMax || predefined.statblock?.pv || 15,
        hpCurrent: fromDb.hpCurrent !== null && fromDb.hpCurrent !== undefined ? fromDb.hpCurrent : (fromDb.hpMax || predefined.statblock?.pv || 15),
        speed: fromDb.speed || predefined.statblock?.speed || '9m',
        stats: fromDb.stats,
        gmNotes: fromDb.gmNotes || predefined.statblock?.arme,
        role: fromDb.role || predefined.role
      };
    }
    if (fromDb) {
      return {
        id: fromDb.id,
        name: fromDb.name,
        role: fromDb.role || 'PNJ clé',
        city: fromDb.location?.name || '',
        armorClass: fromDb.armorClass || 10,
        hpMax: fromDb.hpMax || 15,
        hpCurrent: fromDb.hpCurrent !== null && fromDb.hpCurrent !== undefined ? fromDb.hpCurrent : (fromDb.hpMax || 15),
        speed: fromDb.speed || '9m',
        stats: fromDb.stats,
        gmNotes: fromDb.gmNotes,
        voiceProfile: { speechPattern: fromDb.personality || 'Parle calmement.' },
        attitude: 0
      };
    }
    return predefined || npcKeyOrObj;
  };

  const handleOpenNpcModal = (npc) => {
    setSelectedNpcForModal(resolveNpc(npc));
  };

  // Live HP adjustment synced to database
  const handleNpcHpChange = async (npcId, newHp) => {
    setSelectedNpcForModal(prev => prev ? { ...prev, hpCurrent: newHp } : null);
    setCampaignNpcs(prev => prev.map(n => n.id === npcId ? { ...n, hpCurrent: newHp } : n));
    if (campaignId && npcId && !npcId.startsWith('npc_')) {
      try {
        await api.put(`/api/v1/gm/campaigns/${campaignId}/npcs/${npcId}`, { hpCurrent: newHp });
      } catch (err) {
        console.error('Error syncing NPC HP to DB:', err);
      }
    }
  };

  // Attitude update synced to database and rival factions
  const handleNpcAttitudeChange = async (npcId, newAttitude) => {
    setSelectedNpcForModal(prev => prev ? { ...prev, attitude: newAttitude } : null);

    const ATTITUDE_LABEL_MAP = {
      '-2': 'hostile',
      '-1': 'hostile',
      '0': 'neutre',
      '1': 'allie',
      '2': 'allie'
    };
    const relState = ATTITUDE_LABEL_MAP[String(newAttitude)] || 'neutre';
    const npcName = selectedNpcForModal?.name || '';
    const matchingFaction = quest?.factionProgress?.find(f => {
      if (npcName.includes('Doran') && f.factionName.includes('Loups')) return true;
      if (npcName.includes('Meya') && f.factionName.includes('Sel Blanc')) return true;
      if (npcName.includes('Ashka') && f.factionName.includes('Cendres')) return true;
      return false;
    });

    if (matchingFaction && campaignId && quest?.id) {
      try {
        await api.patch(`/api/v1/gm/campaigns/${campaignId}/quests/${quest.id}/factions/${matchingFaction.id}`, {
          relationshipState: relState
        });
      } catch (e) {
        console.error('Error updating faction relationship in DB:', e);
      }
    }
  };

  // Adjust convoy progress and sync with DB QuestFactionProgress
  const handleAdjustConvoy = async (id, delta) => {
    const updatedConvoys = convoys.map(c => {
      if (c.id === id) {
        return { ...c, progress: Math.max(0, c.progress + delta) };
      }
      return c;
    });
    setConvoys(updatedConvoys);

    // Sync to DB QuestFactionProgress if available
    if (campaignId && quest?.id && quest?.factionProgress) {
      const targetConvoy = updatedConvoys.find(c => c.id === id);
      if (targetConvoy) {
        const matchingFaction = quest.factionProgress.find(f => {
          if (id === 'convoi_1' && f.factionName.includes('Loups')) return true;
          if (id === 'convoi_2' && f.factionName.includes('PJ')) return true;
          if (id === 'convoi_3' && f.factionName.includes('Sel Blanc')) return true;
          if (id === 'convoi_4' && f.factionName.includes('Cendres')) return true;
          if (id === 'convoi_5' && f.factionName.includes('Nostalgics')) return true;
          return false;
        });

        if (matchingFaction) {
          try {
            await api.patch(`/api/v1/gm/campaigns/${campaignId}/quests/${quest.id}/factions/${matchingFaction.id}`, {
              progressValue: targetConvoy.progress * 15
            });
          } catch (err) {
            console.error('Error updating faction progress in DB:', err);
          }
        }
      }
    }
  };

  // Adjust Worm Clock and sync with DB QuestThreatTracker
  const handleWormClockChange = async (newVal) => {
    const delta = newVal - wormClock;
    setWormClock(newVal);

    if (campaignId && quest?.id && quest?.threats && quest.threats.length > 0 && delta !== 0) {
      const wormThreat = quest.threats.find(t => t.name.toLowerCase().includes('ver')) || quest.threats[0];
      if (wormThreat) {
        try {
          await api.post(`/api/v1/gm/campaigns/${campaignId}/quests/${quest.id}/threats/${wormThreat.id}/advance`, {
            direction: delta > 0 ? 'increment' : 'decrement'
          });
        } catch (err) {
          console.error('Error advancing threat in DB:', err);
        }
      }
    }
  };

  // Launch Tactical Combat Arena
  const handleLaunchCombat = async (linkedEncounterId, node) => {
    const targetNode = node || activeNode;
    setCombatActiveNode(targetNode);

    let encId = linkedEncounterId || targetNode?.linkedEncounterId;

    // Check if an encounter for this node already exists in encounters list
    if (!encId && encounters && encounters.length > 0) {
      const matched = encounters.find(e => e.questNodeId === targetNode?.id || (targetNode?.displayCode && e.name?.includes(targetNode.displayCode)));
      if (matched) {
        encId = matched.id;
      }
    }

    // Fallback: If still no encounter, create an impromptu one
    if (!encId && campaignId) {
      try {
        const created = await createEncounter(campaignId, {
          name: `[${quest?.name || 'Course du Sel'}] Combat Imprévu — ${targetNode?.title || 'Désert'}`,
          questNodeId: targetNode?.id || null,
          phase: 'planned',
          status: 'planned'
        });
        if (created?.encounter?.id) {
          encId = created.encounter.id;
        }
      } catch (err) {
        console.error('Error creating impromptu encounter:', err);
      }
    }

    setActiveCombatEncounterId(encId);
    setIsCombatArenaOpen(true);
  };

  // Resolve Combat Victory and update quest state
  const handleResolveCombatVictory = (resolutionData) => {
    const { outcome, nextNodeId, convoyPenalty, wormIncrement } = resolutionData;

    // 1. Advance to next node if specified
    if (nextNodeId && allNodesMap[nextNodeId]) {
      handleSelectNextNode(nextNodeId);
    }

    // 2. Penalize rival convoys if chosen
    if (convoyPenalty) {
      handleAdjustConvoy('convoi_1', -1);
    }

    // 3. Increment worm threat clock if chosen
    if (wormIncrement) {
      handleWormClockChange(wormClock + 1);
    }

    setIsCombatArenaOpen(false);
  };

  const currentPhaseObj = DIRECTOR_PHASES.find(p => p.id === directorPhase) || DIRECTOR_PHASES[0];

  // Check if present NPCs exist at current node
  const linkedNpcsAtCurrentNode = [
    ...(NODE_NPC_MAP[activeNode?.id] || []),
    ...(NODE_NPC_MAP[activeNode?.displayCode] || [])
  ];
  const hasPresentNpcs = linkedNpcsAtCurrentNode.length > 0;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '16px',
      backgroundColor: 'var(--color-background, #121212)',
      minHeight: '100%',
      color: 'var(--color-text)'
    }}>
      {/* 1. TOP DIRECTOR GUIDANCE BAR (Co-Pilote MJ Pas-à-Pas) */}
      <div style={{
        backgroundColor: 'rgba(23, 23, 23, 0.95)',
        border: '1px solid var(--color-primary)',
        borderRadius: '12px',
        padding: '14px 18px',
        boxShadow: '0 4px 20px rgba(99, 102, 241, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={20} color="var(--color-primary-light)" />
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-primary-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              🧭 Co-Pilote de Session MJ : {currentPhaseObj.label}
            </h3>
          </div>

          {/* Phase Steps Indicator */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {DIRECTOR_PHASES.map((phase) => {
              const isCurrent = directorPhase === phase.id;
              const isDone = directorPhase > phase.id;
              return (
                <button
                  key={phase.id}
                  onClick={() => setDirectorPhase(phase.id)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: isCurrent ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: isCurrent ? 'var(--color-primary)' : isDone ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                    color: isCurrent ? '#fff' : isDone ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Phase {phase.id}
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Instruction text */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--color-surface)',
          borderLeft: '4px solid var(--color-primary)',
          borderRadius: '0 8px 8px 0',
          padding: '10px 14px',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <div style={{ fontSize: '0.88rem', color: 'var(--color-text)', lineHeight: 1.4 }}>
            👉 {currentPhaseObj.instruction}
            {directorPhase === 3 && !hasPresentNpcs && (
              <span style={{ fontStyle: 'italic', color: 'var(--color-text-muted)', marginLeft: '6px' }}>
                (Aucun PNJ direct n'est lié à cette étape, passez directement au choix !)
              </span>
            )}
          </div>

          <button
            onClick={() => setDirectorPhase(prev => (prev < 4 ? prev + 1 : 1))}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'var(--color-primary)',
              color: '#fff',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexShrink: 0
            }}
          >
            {directorPhase < 4 ? 'Étape Suivante ➔' : 'Recommencer le cycle ↺'}
          </button>
        </div>
      </div>

      {/* 2. SUB-HEADER WIDGETS (Course Leaderboard & Quick Controls) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '12px',
        alignItems: 'stretch'
      }}>
        {/* Convoys Leaderboard */}
        <div style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '10px',
          padding: '10px 16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Trophy size={14} /> Leaderboard de la Course du Sel
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
              1er convoi arrivé au complet intègre la Garde
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[...convoys].sort((a, b) => b.progress - a.progress).map((c, idx) => (
              <div
                key={c.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: c.isPlayer ? 'rgba(99, 102, 241, 0.2)' : 'var(--color-background)',
                  border: c.isPlayer ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '0.78rem'
                }}
              >
                <span style={{ fontWeight: 800, color: idx === 0 ? '#f59e0b' : 'var(--color-text-muted)' }}>
                  #{idx + 1}
                </span>
                <span>{c.icon} <strong>{c.name}</strong></span>
                <span style={{
                  padding: '1px 5px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  fontSize: '0.72rem',
                  fontWeight: 700
                }}>
                  {c.progress}
                </span>
                {!c.isDestroyed && (
                  <div style={{ display: 'flex', gap: '2px', marginLeft: '4px' }}>
                    <button
                      onClick={() => handleAdjustConvoy(c.id, -1)}
                      style={{ border: 'none', background: 'transparent', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '0 2px' }}
                      title="Reculer"
                    >-</button>
                    <button
                      onClick={() => handleAdjustConvoy(c.id, 1)}
                      style={{ border: 'none', background: 'transparent', color: 'var(--color-primary-light)', cursor: 'pointer', padding: '0 2px', fontWeight: 700 }}
                      title="Avancer"
                    >+</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Global Action & Reset */}
        <div style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '10px',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)' }}>
              Historique de Parcours
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              {historyNodeIds.length} étape(s) franchie(s)
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => handleLaunchCombat(null, activeNode)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(239, 68, 68, 0.45)',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#f87171',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.2)',
                transition: 'all 0.15s ease'
              }}
              title="Lancer l'Arène de Combat Tactique en format cartes (embuscade ou combat libre)"
            >
              <Swords size={13} /> Combat Imprévu
            </button>

            <button
              onClick={handleResetQuestRun}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                color: '#ef4444',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RotateCcw size={12} /> Reset Course
            </button>
          </div>
        </div>
      </div>

      {/* 3. MAIN TABLETOP 3-DECK LAYOUT */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr 300px',
        gap: '16px',
        alignItems: 'start'
      }}>
        {/* LEFT COLUMN: Deck 1 (Adventure / Nœuds du Graphe) & Discard Pile */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Adventure Deck Stack Graphic */}
          <div style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-primary)',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="var(--color-primary-light)" />
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-text)' }}>
                Deck 1 : Aventure
              </h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Nœuds officiels du Graphe (43 scènes)
            </span>

            {/* Visual Deck Card Stack */}
            <div style={{
              height: '100px',
              borderRadius: '8px',
              backgroundColor: 'rgba(99, 102, 241, 0.15)',
              border: '2px dashed var(--color-primary)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-primary-light)' }}>
                {Math.max(0, 43 - historyNodeIds.length - 1)}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                cartes en réserve
              </span>
            </div>

            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', lineHeight: 1.3 }}>
              🔒 Les cartes se débloquent automatiquement selon les choix de transition du convoi.
            </div>
          </div>

          {/* Discard / History Nodes Pile */}
          <div style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            maxHeight: '350px',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)' }}>
                Défausse / Historique ({historyNodeIds.length})
              </span>
              {historyNodeIds.length > 0 && (
                <button
                  onClick={handleGoBack}
                  style={{ border: 'none', background: 'transparent', color: 'var(--color-primary-light)', fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                >
                  <RotateCcw size={12} /> Retour
                </button>
              )}
            </div>

            {historyNodeIds.length === 0 ? (
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontStyle: 'italic', padding: '10px 0' }}>
                Aucune étape défaussée pour le moment.
              </div>
            ) : (
              historyNodeIds.map((id, index) => {
                const pastNode = allNodesMap[id];
                return (
                  <div
                    key={`${id}_${index}`}
                    onClick={() => {
                      // Click to jump back to this node
                      if (confirm(`Revenir à l'étape ${pastNode?.displayCode || id} ?`)) {
                        setActiveNodeId(id);
                        setHistoryNodeIds(historyNodeIds.slice(index + 1));
                      }
                    }}
                    style={{
                      padding: '6px 8px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--color-background)',
                      border: '1px solid var(--color-border)',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s'
                    }}
                    title="Cliquer pour revenir à cette étape"
                  >
                    <span>
                      <strong>{pastNode?.displayCode || id}</strong> : {pastNode?.title || 'Étape résolue'}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: '#10b981' }}>✓</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* CENTER COLUMN: ACTIVE NODE CARD (La Scène Active du Graphe) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <QuestNodeCard
            node={activeNode}
            allNodesMap={allNodesMap}
            campaignNpcs={campaignNpcs}
            onSelectNextNode={handleSelectNextNode}
            onOpenNpcModal={handleOpenNpcModal}
            onGoBack={handleGoBack}
            hasHistory={historyNodeIds.length > 0}
            onLaunchCombat={handleLaunchCombat}
          />
        </div>

        {/* RIGHT COLUMN: Decks Complémentaires (Deck 2 Dangers & Deck 3 Lore) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Deck 2: Dangers & Menaces (Ver des Sables) */}
          <DesertHazardDeck
            wormClock={wormClock}
            onWormClockChange={handleWormClockChange}
          />

          {/* Deck 3: Ambiance & Lore (Événements d8, Mémoire, Rivaux) */}
          <LoreAtmosphereDeck
            onOpenNpcModal={handleOpenNpcModal}
          />
        </div>
      </div>

      {/* NPC DETAILED MODAL */}
      {selectedNpcForModal && (
        <NpcCardModal
          npc={selectedNpcForModal}
          onClose={() => setSelectedNpcForModal(null)}
          onAttitudeChange={handleNpcAttitudeChange}
          onHpChange={handleNpcHpChange}
        />
      )}

      {/* TACTICAL COMBAT ARENA THEATER OVERLAY */}
      {isCombatArenaOpen && (
        <TacticalCombatArena
          campaignId={campaignId}
          encounterId={activeCombatEncounterId}
          activeNode={combatActiveNode || activeNode}
          allNodesMap={allNodesMap}
          campaignNpcs={campaignNpcs}
          vehicles={vehicles}
          onClose={() => setIsCombatArenaOpen(false)}
          onResolveVictory={handleResolveCombatVictory}
        />
      )}
    </div>
  );
}
