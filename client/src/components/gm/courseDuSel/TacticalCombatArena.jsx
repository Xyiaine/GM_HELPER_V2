// TacticalCombatArena.jsx — Arène de Combat Tactique en format Cartes à Jouer (Theater Mode)
import React, { useState, useEffect, useMemo } from 'react';
import { useGmStore } from '../../../store/gmStore';
import CombatantCard from './CombatantCard';
import CombatVehicleCard from './CombatVehicleCard';
import CombatResolutionModal from './CombatResolutionModal';
import {
  Swords,
  FastForward,
  RotateCcw,
  Trophy,
  X,
  Zap,
  Dice5,
  Shield,
  Heart,
  Skull,
  Truck,
  Users,
  AlertTriangle
} from 'lucide-react';

export default function TacticalCombatArena({
  campaignId,
  encounterId,
  activeNode,
  allNodesMap = {},
  campaignNpcs = [],
  vehicles = [],
  onClose,
  onResolveVictory
}) {
  const {
    activeEncounter,
    fetchEncounterDetail,
    syncPcsInEncounter,
    startCombat,
    nextTurnInCombat,
    resetEncounter,
    endCombat,
    updateCombatantInCombat,
    bestiary = [],
    fetchBestiary
  } = useGmStore();

  const [isResolutionModalOpen, setIsResolutionModalOpen] = useState(false);
  const [vehiclesInCombat, setVehiclesInCombat] = useState([]);

  // Fetch encounter detail on mount
  useEffect(() => {
    if (campaignId && encounterId) {
      fetchEncounterDetail(campaignId, encounterId);
      syncPcsInEncounter(campaignId, encounterId);
      if (fetchBestiary) fetchBestiary(campaignId);
    }
  }, [campaignId, encounterId, fetchEncounterDetail, syncPcsInEncounter, fetchBestiary]);

  // Derive associated vehicles based on active node or encounter name
  useEffect(() => {
    if (!vehicles || vehicles.length === 0) return;
    const title = activeNode?.title?.toLowerCase() || '';
    const desc = activeNode?.mjDescription?.toLowerCase() || '';
    const isLoupEncounter = title.includes('loup') || desc.includes('doran') || desc.includes('molosse');

    const selectedVehicles = [];
    // Always include players' vehicle if present
    const playerVeh = vehicles.find(v => v.name.toLowerCase().includes('camion') || v.name.toLowerCase().includes('convoi 2')) || vehicles[0];
    if (playerVeh) selectedVehicles.push({ ...playerVeh, isPlayer: true });

    // Include Doran's vehicle if Loups encounter
    if (isLoupEncounter) {
      const rivalVeh = vehicles.find(v => v.name.toLowerCase().includes('molosse') || v.name.toLowerCase().includes('doran'));
      if (rivalVeh && !selectedVehicles.some(v => v.id === rivalVeh.id)) {
        selectedVehicles.push({ ...rivalVeh, isPlayer: false });
      }
    }
    setVehiclesInCombat(selectedVehicles);
  }, [vehicles, activeNode]);

  const combatants = activeEncounter?.combatants || [];
  const currentTurnIndex = activeEncounter?.currentTurnIndex || 0;
  const currentRound = activeEncounter?.currentRound || 1;
  const isCombatActive = activeEncounter?.phase === 'active' || activeEncounter?.status === 'active';

  // Sort combatants by initiative descending, then orderIndex
  const sortedCombatants = useMemo(() => {
    return [...combatants].filter(Boolean).sort((a, b) => {
      if ((b.initiative || 0) !== (a.initiative || 0)) {
        return (b.initiative || 0) - (a.initiative || 0);
      }
      return (a.orderIndex || 0) - (b.orderIndex || 0);
    });
  }, [combatants]);

  // Find entity details (stats, attacks) from bestiary, npcs or character
  const getEntityDetails = (combatant) => {
    if (combatant.type === 'npc' || combatant.sourceType === 'npc') {
      const npcMatch = campaignNpcs.find(n => n.id === combatant.sourceId || n.id === combatant.npcId || n.name === combatant.name);
      if (npcMatch) return npcMatch;
    }
    if (combatant.type === 'monster' || combatant.sourceType === 'bestiary') {
      const rawName = combatant.name.replace(/\s+#\d+$/, '').trim().toLowerCase();
      const monsterMatch = bestiary.find(b => b.id === combatant.sourceId || b.id === combatant.bestiaryId || b.name.toLowerCase() === rawName);
      if (monsterMatch) return monsterMatch;
    }
    return null;
  };

  // Fast Roll Express for all NPCs & Monsters (1d20 + DEX mod)
  const handleAutoRollNpcInitiatives = async () => {
    if (!activeEncounter) return;
    for (const c of combatants) {
      const isPc = c.type === 'character' || c.sourceType === 'character';
      if (!isPc) {
        const entity = getEntityDetails(c);
        let dexMod = 0;
        if (entity?.stats) {
          try {
            const parsed = typeof entity.stats === 'string' ? JSON.parse(entity.stats) : entity.stats;
            if (parsed.dex) dexMod = Math.floor((parsed.dex - 10) / 2);
          } catch (e) {}
        }
        const d20 = Math.floor(Math.random() * 20) + 1;
        const total = d20 + dexMod;
        await updateCombatantInCombat(campaignId, activeEncounter.id, c.id, { initiative: total });
      }
    }
  };

  // Manual initiative change (specifically for PC cards)
  const handleInitiativeChange = async (combatantId, val) => {
    if (!activeEncounter) return;
    await updateCombatantInCombat(campaignId, activeEncounter.id, combatantId, { initiative: val });
  };

  // HP delta adjustment
  const handleHpDelta = async (combatant, delta) => {
    if (!activeEncounter) return;
    const hpMax = combatant.hpMax || 10;
    const hpCurrent = combatant.hpCurrent !== null && combatant.hpCurrent !== undefined ? combatant.hpCurrent : hpMax;
    const newHp = Math.max(0, Math.min(hpMax, hpCurrent + delta));
    await updateCombatantInCombat(campaignId, activeEncounter.id, combatant.id, { hpCurrent: newHp });
  };

  // Condition toggle
  const handleToggleCondition = async (combatant, conditionName) => {
    if (!activeEncounter) return;
    let list = [];
    try {
      list = typeof combatant.conditions === 'string' ? JSON.parse(combatant.conditions || '[]') : (combatant.conditions || []);
    } catch (e) {
      list = [];
    }
    const idx = list.indexOf(conditionName);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push(conditionName);
    }
    await updateCombatantInCombat(campaignId, activeEncounter.id, combatant.id, { conditions: JSON.stringify(list) });
  };

  // Vehicle HP delta
  const handleVehicleHpDelta = (veh, delta) => {
    setVehiclesInCombat(prev => prev.map(v => {
      if (v.id === veh.id) {
        const max = v.hpMax || v.hpMaxBase || 100;
        const cur = v.hpCurrent !== undefined ? v.hpCurrent : max;
        return { ...v, hpCurrent: Math.max(0, Math.min(max, cur + delta)) };
      }
      return v;
    }));
  };

  // Start active combat
  const handleStartCombat = async () => {
    if (!activeEncounter) return;
    await startCombat(campaignId, activeEncounter.id);
  };

  // Next Turn
  const handleNextTurn = async () => {
    if (!activeEncounter) return;
    await nextTurnInCombat(campaignId, activeEncounter.id);
  };

  // Reset Combat
  const handleResetCombat = async () => {
    if (!confirm('Recommencer le combat au Round 1 ?')) return;
    if (activeEncounter) {
      await resetEncounter(campaignId, activeEncounter.id);
    }
  };

  // Finish and apply resolution
  const handleConfirmResolution = (resolutionData) => {
    setIsResolutionModalOpen(false);
    if (activeEncounter) {
      endCombat(campaignId, activeEncounter.id);
    }
    if (onResolveVictory) {
      onResolveVictory(resolutionData);
    }
  };

  const activeCombatant = sortedCombatants[currentTurnIndex] || sortedCombatants[0];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#07090e',
      backgroundImage: 'radial-gradient(ellipse at 50% 10%, rgba(30, 20, 50, 0.7) 0%, rgba(7, 9, 14, 0.98) 100%)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      color: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* 1. TOP CONTROL BAR */}
      <div style={{
        padding: '12px 24px',
        backgroundColor: 'rgba(10, 12, 20, 0.95)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Left: Encounter Title & Node Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            padding: '8px 12px',
            borderRadius: '10px',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 900,
            fontSize: '0.9rem'
          }}>
            <Swords size={18} /> ARÈNE TACTIQUE
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {activeEncounter?.name || `Combat — ${activeNode?.title || 'Étape'}`}
            </h2>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Étape {activeNode?.displayCode || activeNode?.id} • La Course du Sel
            </div>
          </div>
        </div>

        {/* Center: Round & Active Turn Banner */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          padding: '6px 18px',
          borderRadius: '30px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>ROUND</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#f59e0b', fontFamily: 'monospace' }}>
              #{currentRound}
            </span>
          </div>

          <div style={{ height: '16px', width: '1px', backgroundColor: 'rgba(255,255,255,0.15)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Tour de :</span>
            <strong style={{ fontSize: '0.95rem', color: '#60a5fa' }}>
              {activeCombatant?.name || 'En attente'}
            </strong>
          </div>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {!isCombatActive ? (
            <button
              onClick={handleStartCombat}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'var(--success)',
                color: '#fff',
                fontWeight: 900,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 12px rgba(16, 185, 129, 0.3)'
              }}
            >
              <Swords size={16} /> DÉBUTER LE COMBAT
            </button>
          ) : (
            <button
              onClick={handleNextTurn}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#6366f1',
                backgroundImage: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#fff',
                fontWeight: 900,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
              }}
            >
              Tour Suivant <FastForward size={16} />
            </button>
          )}

          <button
            onClick={() => setIsResolutionModalOpen(true)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(245, 158, 11, 0.5)',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              color: '#f59e0b',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Trophy size={15} /> Résoudre
          </button>

          <button
            onClick={handleResetCombat}
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              backgroundColor: 'transparent',
              color: '#94a3b8',
              cursor: 'pointer'
            }}
            title="Recommencer le combat au round 1"
          >
            <RotateCcw size={16} />
          </button>

          <button
            onClick={onClose}
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              backgroundColor: 'transparent',
              color: '#94a3b8',
              cursor: 'pointer'
            }}
            title="Fermer l'Arène et revenir à la table"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* 2. HORIZONTAL INITIATIVE RIBBON (Card Track Timeline) */}
      <div style={{
        padding: '10px 24px',
        backgroundColor: 'rgba(12, 15, 24, 0.8)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        overflowX: 'auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 'fit-content' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ORDRE DU TOUR :
          </span>
          <button
            onClick={handleAutoRollNpcInitiatives}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid rgba(234, 179, 8, 0.4)',
              backgroundColor: 'rgba(234, 179, 8, 0.1)',
              color: '#facc15',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="Lancer 1d20 + DEX pour tous les PNJ et Monstres instantanément"
          >
            <Dice5 size={13} /> Tirer PNJ (Auto)
          </button>
        </div>

        {/* Small Ribbon Badges for Each Combatant */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
          {sortedCombatants.map((c, idx) => {
            const isTurn = idx === currentTurnIndex;
            const isPc = c.type === 'character' || c.sourceType === 'character';
            const isDowned = (c.hpCurrent || 0) <= 0;

            return (
              <div
                key={c.id}
                style={{
                  padding: '5px 10px',
                  borderRadius: '8px',
                  backgroundColor: isTurn
                    ? 'rgba(99, 102, 241, 0.25)'
                    : isDowned
                    ? 'rgba(239, 68, 68, 0.15)'
                    : 'rgba(255, 255, 255, 0.04)',
                  border: isTurn
                    ? '1px solid #6366f1'
                    : isDowned
                    ? '1px solid rgba(239, 68, 68, 0.4)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: isDowned ? 0.5 : 1,
                  minWidth: 'fit-content'
                }}
              >
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  color: isTurn ? '#818cf8' : '#64748b'
                }}>
                  #{idx + 1}
                </span>
                <span style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: isDowned ? '#f87171' : '#f8fafc',
                  maxWidth: '110px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {c.name}
                </span>
                <span style={{
                  padding: '1px 5px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(234, 179, 8, 0.15)',
                  color: '#facc15',
                  fontSize: '0.7rem',
                  fontWeight: 800
                }}>
                  {c.initiative}
                </span>
                {isDowned && <Skull size={12} color="#ef4444" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. MAIN ARENA TABLE SURFACE */}
      <div style={{
        flex: 1,
        padding: '24px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Support Vehicles Section if active */}
        {vehiclesInCombat.length > 0 && (
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Truck size={15} color="#c084fc" /> Véhicules Engagés dans la Poursuite
            </div>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              {vehiclesInCombat.map(veh => (
                <CombatVehicleCard
                  key={veh.id}
                  vehicle={veh}
                  isPlayerVehicle={veh.isPlayer}
                  onHpDelta={handleVehicleHpDelta}
                />
              ))}
            </div>
          </div>
        )}

        {/* Combatants Playing Cards Grid */}
        <div>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={15} color="#60a5fa" /> Combattants & Créatures (Main du Tour)
          </div>

          {sortedCombatants.length === 0 ? (
            <div style={{
              padding: '48px 24px',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '16px',
              border: '1px dashed rgba(255, 255, 255, 0.12)',
              maxWidth: '520px',
              margin: '30px auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#818cf8',
                marginBottom: '4px'
              }}>
                <Users size={24} />
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#f8fafc' }}>
                Chargement des cartes de combat...
              </div>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, maxWidth: '400px' }}>
                Récupération de la rencontre #{encounterId?.slice(-6) || 'active'} et synchronisation des personnages joueurs avec la base de données.
              </div>
              <button
                onClick={() => {
                  if (campaignId && encounterId) {
                    syncPcsInEncounter(campaignId, encounterId);
                    fetchEncounterDetail(campaignId, encounterId);
                  }
                }}
                style={{
                  marginTop: '8px',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  border: '1px solid rgba(99, 102, 241, 0.4)',
                  backgroundColor: 'rgba(99, 102, 241, 0.15)',
                  color: '#818cf8',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                🔄 Forcer la synchronisation des PJ
              </button>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              gap: '18px',
              flexWrap: 'wrap',
              alignItems: 'flex-start'
            }}>
              {sortedCombatants.map((combatant, idx) => {
                const isTurn = idx === currentTurnIndex;
                const isPc = combatant.type === 'character' || combatant.sourceType === 'character';
                const entityDetails = getEntityDetails(combatant);

                return (
                  <CombatantCard
                    key={combatant.id}
                    combatant={combatant}
                    isActiveTurn={isTurn}
                    isPlayerCharacter={isPc}
                    entityDetails={entityDetails}
                    onHpDelta={handleHpDelta}
                    onInitiativeChange={handleInitiativeChange}
                    onToggleCondition={handleToggleCondition}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 4. RESOLUTION MODAL */}
      {isResolutionModalOpen && (
        <CombatResolutionModal
          encounterName={activeEncounter?.name || 'Combat'}
          activeNode={activeNode}
          allNodesMap={allNodesMap}
          onClose={() => setIsResolutionModalOpen(false)}
          onConfirm={handleConfirmResolution}
        />
      )}
    </div>
  );
}
