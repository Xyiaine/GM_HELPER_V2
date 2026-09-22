import React, { useState, useEffect } from 'react';
import { useGmStore } from '../../store/gmStore';
import socket from '../../utils/socket';
import { AlertTriangle, Plus, Minus } from 'lucide-react';

export default function ThreatClockWidget({ threat, campaignId, questId }) {
  const { advanceThreat } = useGmStore();
  const [currentLevel, setCurrentLevel] = useState(threat.currentLevel || 0);
  const [activeAlert, setActiveAlert] = useState(null);

  let thresholds = [];
  try {
    thresholds = typeof threat.thresholds === 'string' ? JSON.parse(threat.thresholds) : (threat.thresholds || []);
  } catch (e) {
    thresholds = [];
  }

  useEffect(() => {
    setCurrentLevel(threat.currentLevel || 0);
  }, [threat.currentLevel]);

  useEffect(() => {
    const handleThreshold = (data) => {
      if (data.threatId === threat.id) {
        setCurrentLevel(data.level);
        setActiveAlert(data.effect);
      }
    };
    socket.on('threat_threshold_reached', handleThreshold);
    return () => socket.off('threat_threshold_reached', handleThreshold);
  }, [threat.id]);

  const handleAdvance = async (direction) => {
    try {
      const res = await advanceThreat(campaignId, questId, threat.id, direction);
      if (res.threat) {
        setCurrentLevel(res.threat.currentLevel);
      }
      if (res.triggeredThreshold) {
        setActiveAlert(res.triggeredThreshold.effect);
      } else {
        setActiveAlert(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const segments = Array.from({ length: threat.maxLevel || 6 }, (_, i) => i + 1);

  return (
    <div style={{
      backgroundColor: 'var(--color-background)',
      border: '1px solid var(--color-border)',
      borderRadius: '8px',
      padding: '14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem' }}>
          <AlertTriangle size={16} color="#ef4444" />
          {threat.name}
        </h4>
        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: currentLevel >= (threat.maxLevel || 6) ? 'var(--danger-text)' : 'var(--ember-text)' }}>
          {currentLevel} / {threat.maxLevel || 6} ({threat.stateLabel || 'actif'})
        </span>
      </div>

      {threat.description && (
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: '1.3' }}>
          {threat.description}
        </p>
      )}

      {/* Visual dial segments */}
      <div style={{ display: 'flex', gap: '4px', height: '12px', width: '100%' }}>
        {segments.map((segIndex) => {
          const isFilled = segIndex <= currentLevel;
          const isMax = segIndex === (threat.maxLevel || 6);
          const segColor = isFilled ? (isMax ? '#ef4444' : segIndex >= 4 ? '#f59e0b' : '#10b981') : '#333';
          return (
            <div
              key={segIndex}
              style={{
                flex: 1,
                backgroundColor: segColor,
                borderRadius: '3px',
                transition: 'background-color 0.2s ease',
                border: thresholds.some(t => t.level === segIndex) ? '1px solid #fff' : 'none'
              }}
              title={`Niveau ${segIndex}${thresholds.find(t => t.level === segIndex) ? ' (Seuil de déclenchement)' : ''}`}
            />
          );
        })}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
        <button
          className="btn-secondary"
          onClick={() => handleAdvance('decrement')}
          disabled={currentLevel <= 0}
          style={{ padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
        >
          <Minus size={14} /> -1
        </button>
        <button
          className="btn-primary"
          onClick={() => handleAdvance('increment')}
          disabled={currentLevel >= (threat.maxLevel || 6)}
          style={{ padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', background: 'var(--danger)', color: '#fff', border: 'none' }}
        >
          <Plus size={14} /> +1 Horloge
        </button>
      </div>

      {/* Active Threshold Alert */}
      {activeAlert && (
        <div style={{
          backgroundColor: 'var(--danger-tint)',
          border: '1px solid #ef4444',
          borderRadius: '4px',
          padding: '8px 12px',
          fontSize: '0.8rem',
          color: 'var(--danger-text)',
          marginTop: '4px'
        }}>
          <strong>🚨 SEUIL ATTEINT ({currentLevel}/{threat.maxLevel}) :</strong> {activeAlert}
        </div>
      )}
    </div>
  );
}
