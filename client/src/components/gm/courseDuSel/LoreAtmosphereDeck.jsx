import React, { useState } from 'react';
import { Scroll, Sparkles, Dices, X, Users, BookOpen, AlertCircle } from 'lucide-react';
import { FLOATING_EVENTS_D8, SALT_RACE_NPCS } from './saltRaceData';

export default function LoreAtmosphereDeck({ onOpenNpcModal }) {
  const [activeEvent, setActiveEvent] = useState(null);
  const [selectedNpcKey, setSelectedNpcKey] = useState(null);

  const handleRollD8 = () => {
    const roll = Math.floor(Math.random() * 8) + 1; // 1 to 8
    const event = FLOATING_EVENTS_D8.find(e => e.d8 === roll) || FLOATING_EVENTS_D8[7];
    setActiveEvent({
      ...event,
      rolledNumber: roll
    });
  };

  return (
    <div style={{
      backgroundColor: 'var(--color-surface, #1e1e1e)',
      border: '1px solid rgba(99, 102, 241, 0.3)',
      borderRadius: '12px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      boxShadow: '0 4px 16px rgba(99, 102, 241, 0.1)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Scroll size={18} color="var(--color-primary-light)" />
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--ink-on-dark)' }}>
            Deck 3 : Ambiance & Lore
          </h3>
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--ink-on-dark-muted)' }}>
          Événements d8 & Mémoire
        </span>
      </div>

      {/* D8 Roll Button */}
      <button
        onClick={handleRollD8}
        style={{
          padding: '10px',
          borderRadius: '8px',
          border: '1px dashed var(--color-primary)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          color: 'var(--color-primary-light)',
          fontWeight: 700,
          fontSize: '0.85rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          boxShadow: '0 2px 8px rgba(99, 102, 241, 0.15)'
        }}
      >
        <Dices size={16} /> 🎲 Tirer un Événement Flottant (d8)
      </button>

      {/* Drawn Event Card */}
      {activeEvent && (
        <div style={{
          backgroundColor: 'var(--color-background)',
          border: '1px solid var(--color-primary)',
          borderRadius: '8px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--color-primary)',
                  color: '#fff',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}>
                  d8 : {activeEvent.rolledNumber}
                </span>
                <h4 style={{ margin: 0, fontSize: '0.88rem', color: 'var(--ink-on-dark)', fontWeight: 800 }}>
                  {activeEvent.title}
                </h4>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-primary-light)' }}>
                {activeEvent.tag}
              </span>
            </div>

            <button
              onClick={() => setActiveEvent(null)}
              style={{ border: 'none', background: 'transparent', color: 'var(--ink-on-dark-muted)', cursor: 'pointer' }}
            >
              <X size={15} />
            </button>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--ink-on-dark)', fontStyle: 'italic', lineHeight: 1.35 }}>
            {activeEvent.pitch}
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--ink-on-dark-muted)', backgroundColor: 'var(--color-surface)', padding: '6px 8px', borderRadius: '4px', lineHeight: 1.35 }}>
            {activeEvent.description}
          </div>

          <div style={{ fontSize: '0.78rem', color: '#f59e0b', borderTop: '1px solid var(--color-border)', paddingTop: '6px' }}>
            <strong>Dilemme / Effet :</strong> {activeEvent.dilemma}
          </div>
        </div>
      )}

      {/* Rival Convoys Directory */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid var(--color-border)', paddingTop: '10px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ink-on-dark-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Users size={13} /> PNJ & Rivaux de la Course :
        </span>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
          {Object.values(SALT_RACE_NPCS).slice(0, 4).map((npc) => (
            <button
              key={npc.id}
              onClick={() => onOpenNpcModal(npc)}
              style={{
                padding: '6px 8px',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-background)',
                color: 'var(--ink-on-dark)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textAlign: 'left',
                cursor: 'pointer',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
              title="Ouvrir la fiche de roleplay"
            >
              👤 {npc.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
