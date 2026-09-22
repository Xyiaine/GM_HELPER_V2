import React from 'react';
import { useGmStore } from '../../store/gmStore';
import { Users } from 'lucide-react';

export default function FactionTracker({ factions = [], campaignId, questId }) {
  const { updateFaction } = useGmStore();

  const handleStateChange = async (factionId, newState) => {
    try {
      await updateFaction(campaignId, questId, factionId, { relationshipState: newState });
    } catch (err) {
      console.error(err);
    }
  };

  if (!factions || factions.length === 0) {
    return <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Aucune faction enregistrée.</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h4 style={{ margin: 0, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem' }}>
        <Users size={16} color="var(--color-primary-light)" />
        Relations de Factions
      </h4>

      {factions.map((f) => {
        const state = f.relationshipState || 'neutre';
        return (
          <div
            key={f.id}
            style={{
              backgroundColor: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              padding: '10px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--color-text)' }}>
                {f.factionName}
              </span>
              <span style={{
                fontSize: '0.75rem',
                padding: '2px 6px',
                borderRadius: '3px',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                backgroundColor: state === 'hostile' ? 'rgba(239, 68, 68, 0.2)' : state === 'allie' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                color: state === 'hostile' ? 'var(--danger-text)' : state === 'allie' ? 'var(--success-text)' : '#ccc'
              }}>
                {state}
              </span>
            </div>

            {f.notes && (
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: '1.2' }}>
                {f.notes}
              </p>
            )}

            {/* 3-State Toggle Selector */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', marginTop: '4px' }}>
              <button
                type="button"
                onClick={() => handleStateChange(f.id, 'hostile')}
                style={{
                  padding: '4px',
                  fontSize: '0.75rem',
                  borderRadius: '3px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: state === 'hostile' ? '#ef4444' : '#222',
                  color: state === 'hostile' ? '#fff' : '#aaa'
                }}
              >
                Hostile
              </button>
              <button
                type="button"
                onClick={() => handleStateChange(f.id, 'neutre')}
                style={{
                  padding: '4px',
                  fontSize: '0.75rem',
                  borderRadius: '3px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: state === 'neutre' ? '#6b7280' : '#222',
                  color: state === 'neutre' ? '#fff' : '#aaa'
                }}
              >
                Neutre
              </button>
              <button
                type="button"
                onClick={() => handleStateChange(f.id, 'allie')}
                style={{
                  padding: '4px',
                  fontSize: '0.75rem',
                  borderRadius: '3px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: state === 'allie' ? '#10b981' : '#222',
                  color: state === 'allie' ? '#fff' : '#aaa'
                }}
              >
                Allié
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
