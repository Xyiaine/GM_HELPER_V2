import React from 'react';
import { UserCheck, MessageSquare, Activity, ShieldAlert } from 'lucide-react';

export default function NpcVoiceProfileCard({ profile }) {
  if (!profile) return null;

  return (
    <div style={{
      backgroundColor: 'var(--color-background)',
      border: '1px solid var(--color-border)',
      borderRadius: '6px',
      padding: '12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <h5 style={{ margin: 0, color: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
        <UserCheck size={16} />
        Fiche de Voix : {profile.name}
      </h5>

      {profile.speechPattern && (
        <div style={{ fontSize: '0.8rem', color: 'var(--color-text)', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
          <MessageSquare size={14} color="#60a5fa" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: 'var(--info-text)' }}>Façon de parler :</strong> {profile.speechPattern}
          </div>
        </div>
      )}

      {profile.physicalTic && (
        <div style={{ fontSize: '0.8rem', color: 'var(--color-text)', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
          <Activity size={14} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: 'var(--ember-text)' }}>Tic physique :</strong> {profile.physicalTic}
          </div>
        </div>
      )}

      {profile.signatureBehavior && (
        <div style={{ fontSize: '0.8rem', color: 'var(--color-text)', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
          <ShieldAlert size={14} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: 'var(--danger-text)' }}>Comportement signature :</strong> {profile.signatureBehavior}
          </div>
        </div>
      )}
    </div>
  );
}
