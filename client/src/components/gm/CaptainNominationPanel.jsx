import React from 'react';
import { Award, ShieldAlert, CheckCircle2, RefreshCw } from 'lucide-react';

export default function CaptainNominationPanel({ captainData }) {
  if (!captainData) return null;

  let captainInfo = {};
  try {
    captainInfo = typeof captainData === 'string' ? JSON.parse(captainData) : captainData;
  } catch (e) {
    return null;
  }

  return (
    <div style={{
      backgroundColor: 'var(--success-tint)',
      border: '1px solid #10b981',
      borderRadius: '8px',
      padding: '14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      marginTop: '12px'
    }}>
      <h4 style={{ margin: 0, color: 'var(--success-text)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem' }}>
        <Award size={18} />
        Aide Interactive : Nomination du Capitaine
      </h4>

      {captainInfo.trigger && (
        <div style={{ fontSize: '0.8rem', color: '#ecfdf5' }}>
          <strong>⚡ Déclencheur :</strong> {captainInfo.trigger}
        </div>
      )}

      {captainInfo.resolutionMethod && (
        <div style={{ fontSize: '0.8rem', color: '#ecfdf5', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
          <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Méthode de Résolution :</strong> {captainInfo.resolutionMethod}
          </div>
        </div>
      )}

      {captainInfo.deadlockFallback && (
        <div style={{ fontSize: '0.8rem', color: 'var(--ember-text)', display: 'flex', alignItems: 'flex-start', gap: '6px', backgroundColor: 'var(--warning-tint)', padding: '8px', borderRadius: '4px' }}>
          <RefreshCw size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Filet de Secours (Blocage) :</strong> {captainInfo.deadlockFallback}
          </div>
        </div>
      )}

      {captainInfo.conflictManagementLevers && captainInfo.conflictManagementLevers.length > 0 && (
        <div style={{ fontSize: '0.8rem', color: '#fee2e2', backgroundColor: 'var(--danger-tint)', padding: '8px', borderRadius: '4px' }}>
          <strong style={{ color: 'var(--danger-text)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldAlert size={14} /> Leviers Anti-Conflit :
          </strong>
          <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
            {captainInfo.conflictManagementLevers.map((lever, idx) => (
              <li key={idx} style={{ marginBottom: '2px' }}>{lever}</li>
            ))}
          </ul>
        </div>
      )}

      {captainInfo.payoff && (
        <div style={{ fontSize: '0.8rem', color: 'var(--arcane-text)', fontStyle: 'italic' }}>
          🎁 <strong>Payoff Acte 2 :</strong> {captainInfo.payoff}
        </div>
      )}
    </div>
  );
}
