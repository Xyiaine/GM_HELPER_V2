import React, { useEffect, useState } from 'react';
import { useGmStore } from '../../store/gmStore';
import { Swords, Shield, Heart, Play, Square, FastForward } from 'lucide-react';

export default function CombatTracker() {
  const { activeCampaignId, encounters, fetchEncounters, createEncounter, updateEncounter } = useGmStore();
  const [activeEncounter, setActiveEncounter] = useState(null);

  useEffect(() => {
    if (activeCampaignId) {
      fetchEncounters(activeCampaignId);
    }
  }, [activeCampaignId, fetchEncounters]);

  useEffect(() => {
    const active = encounters.find(e => e.status === 'active');
    setActiveEncounter(active || null);
  }, [encounters]);

  const handleStartEncounter = async () => {
    // Check if there are prepared encounters
    const prepared = encounters.find(e => e.status === 'prepared');
    if (prepared) {
      await updateEncounter(activeCampaignId, prepared.id, { status: 'active', currentRound: 1, currentTurnIndex: 0 });
    } else {
      // Create a new empty encounter
      await createEncounter(activeCampaignId, { name: 'New Encounter', status: 'active', currentRound: 1, currentTurnIndex: 0 });
    }
  };

  const handleEndCombat = async () => {
    if (activeEncounter) {
      await updateEncounter(activeCampaignId, activeEncounter.id, { status: 'completed' });
    }
  };

  const handleNextTurn = async () => {
    if (!activeEncounter) return;
    const combatantsCount = activeEncounter.combatants?.length || 1;
    let nextIndex = activeEncounter.currentTurnIndex + 1;
    let nextRound = activeEncounter.currentRound;

    if (nextIndex >= combatantsCount) {
      nextIndex = 0;
      nextRound += 1;
    }

    await updateEncounter(activeCampaignId, activeEncounter.id, {
      currentTurnIndex: nextIndex,
      currentRound: nextRound
    });
  };

  if (!activeEncounter) {
    return (
      <div style={{ padding: '24px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ color: 'var(--color-primary)', margin: 0 }}>Combat Tracker</h1>
            <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Manage initiative and encounters.</p>
          </div>
          <button className="btn-primary" onClick={handleStartEncounter} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Play size={18} /> Start Encounter
          </button>
        </header>

        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'var(--color-surface)', borderRadius: '8px' }}>
          <Swords size={48} color="var(--color-text-muted)" style={{ opacity: 0.5, marginBottom: '16px' }} />
          <p style={{ color: 'var(--color-text-muted)' }}>No active encounters. Start an encounter to see the tracker.</p>
        </div>
      </div>
    );
  }

  const combatants = [...(activeEncounter.combatants || [])].sort((a, b) => a.orderIndex - b.orderIndex);
  const currentCombatant = combatants[activeEncounter.currentTurnIndex % Math.max(1, combatants.length)];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: 'var(--color-text)', margin: 0 }}>{activeEncounter.name}</h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Round {activeEncounter.currentRound} • {combatants.length} Combatants</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" onClick={handleEndCombat} style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--danger, #ef4444)' }}>
            <Square size={18} /> End Combat
          </button>
          <button className="btn-primary" onClick={handleNextTurn} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <FastForward size={18} /> Next Turn
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {combatants.length === 0 && (
           <div style={{ textAlign: 'center', padding: '20px', backgroundColor: 'var(--color-surface)', borderRadius: '8px', color: 'var(--color-text-muted)' }}>
             No combatants added yet.
           </div>
        )}
        {combatants.map((combatant, index) => {
          const isCurrentTurn = currentCombatant?.id === combatant.id;
          
          return (
            <div key={combatant.id} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px',
              backgroundColor: isCurrentTurn ? 'rgba(99, 102, 241, 0.1)' : 'var(--color-surface)',
              border: `1px solid ${isCurrentTurn ? 'var(--color-primary)' : 'var(--color-border)'}`,
              borderRadius: '8px',
              gap: '16px',
              transition: 'all 0.2s'
            }}>
              <div style={{ width: '40px', fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'center', color: 'var(--color-text)' }}>
                {combatant.initiative}
              </div>
              
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, color: isCurrentTurn ? 'var(--color-primary)' : 'var(--color-text)' }}>
                  {combatant.name}
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                  {combatant.type}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={16} color="var(--color-text-muted)" />
                  <span style={{ fontWeight: 'bold', color: 'var(--color-text)' }}>{combatant.armorClass}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Heart size={16} color="var(--danger, #ef4444)" />
                  <input 
                    type="number" 
                    defaultValue={combatant.hpCurrent} 
                    style={{ width: '60px', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }} 
                  />
                  <span style={{ color: 'var(--color-text-muted)' }}>/ {combatant.hpMax}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
