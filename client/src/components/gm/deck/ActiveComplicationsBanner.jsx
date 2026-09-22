import React from 'react';
import { useGmStore } from '../../../store/gmStore';
import { AlertTriangle, X, CheckCircle, Zap } from 'lucide-react';

export default function ActiveComplicationsBanner() {
  const { activeComplications, dismissActiveComplication } = useGmStore();

  if (!activeComplications || activeComplications.length === 0) {
    return null;
  }

  return (
    <div style={{
      backgroundColor: 'var(--danger-tint)',
      borderBottom: '1px solid rgba(239, 68, 68, 0.3)',
      padding: '8px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      flexWrap: 'wrap',
      zIndex: 50
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--danger-text)',
          fontWeight: 700,
          fontSize: '0.82rem',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          <AlertTriangle size={16} /> Complications Actives ({activeComplications.length}) :
        </div>

        {activeComplications.map((comp) => (
          <div
            key={comp.uid}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '0.78rem',
              color: 'var(--color-text)',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)'
            }}
            title={comp.effect}
          >
            <Zap size={12} color="#ef4444" />
            <strong style={{ color: 'var(--danger-text)' }}>{comp.title}</strong>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.72rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              - {comp.effect}
            </span>
            <button
              onClick={() => dismissActiveComplication(comp.uid)}
              style={{
                border: 'none',
                background: 'transparent',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
                borderRadius: '4px'
              }}
              title="Résoudre / Retirer cette complication"
            >
              <X size={13} />
            </button>
          </div>
        ))}
      </div>

      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
        Cliquez sur ✕ pour clore une complication résolue
      </div>
    </div>
  );
}
