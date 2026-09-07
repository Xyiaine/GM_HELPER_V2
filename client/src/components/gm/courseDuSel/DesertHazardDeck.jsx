import React, { useState } from 'react';
import { Flame, Plus, Minus, AlertTriangle, ShieldAlert, Zap, Sparkles, X, Check } from 'lucide-react';
import { INITIAL_HAZARD_CARDS } from '../deck/deckData';
import { WORM_THRESHOLDS } from './saltRaceData';

export default function DesertHazardDeck({ wormClock, onWormClockChange }) {
  const [activeHazard, setActiveHazard] = useState(null);
  const [discardPile, setDiscardPile] = useState([]);

  const handleDrawHazard = () => {
    const pool = INITIAL_HAZARD_CARDS;
    const card = pool[Math.floor(Math.random() * pool.length)];
    setActiveHazard({
      ...card,
      drawnAt: Date.now()
    });
  };

  const handleDismissHazard = () => {
    if (activeHazard) {
      setDiscardPile(prev => [activeHazard, ...prev]);
      setActiveHazard(null);
    }
  };

  const thresholdData = WORM_THRESHOLDS[wormClock];

  return (
    <div style={{
      backgroundColor: 'var(--color-surface, #1e1e1e)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '12px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      boxShadow: '0 4px 16px rgba(239, 68, 68, 0.1)'
    }}>
      {/* Deck Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Flame size={18} color="#ef4444" />
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text)' }}>
            Deck 2 : Dangers & Menaces
          </h3>
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
          Complications du Sel
        </span>
      </div>

      {/* Worm Clock 6 segments widget */}
      <div style={{
        backgroundColor: 'var(--color-background)',
        border: '1px solid var(--color-border)',
        borderRadius: '8px',
        padding: '10px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <AlertTriangle size={14} /> Horloge du Ver des Sables
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: wormClock >= 5 ? '#ef4444' : '#f59e0b' }}>
            {wormClock} / 6
          </span>
        </div>

        {/* Visual Dots */}
        <div style={{ display: 'flex', gap: '4px', height: '10px' }}>
          {Array.from({ length: 6 }, (_, i) => i + 1).map((step) => {
            const isFilled = step <= wormClock;
            const dotColor = step >= 5 ? '#ef4444' : step >= 3 ? '#f97316' : '#10b981';
            return (
              <div
                key={step}
                style={{
                  flex: 1,
                  borderRadius: '3px',
                  backgroundColor: isFilled ? dotColor : 'rgba(255, 255, 255, 0.08)',
                  boxShadow: isFilled ? `0 0 8px ${dotColor}80` : 'none',
                  transition: 'all 0.2s ease'
                }}
              />
            );
          })}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
          <button
            onClick={() => onWormClockChange(Math.max(0, wormClock - 1))}
            disabled={wormClock <= 0}
            style={{
              flex: 1,
              padding: '4px',
              borderRadius: '4px',
              border: '1px solid var(--color-border)',
              background: 'transparent',
              color: 'var(--color-text-muted)',
              cursor: wormClock <= 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Minus size={13} />
          </button>
          <button
            onClick={() => onWormClockChange(Math.min(6, wormClock + 1))}
            disabled={wormClock >= 6}
            style={{
              flex: 2,
              padding: '4px',
              borderRadius: '4px',
              border: '1px solid #ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              cursor: wormClock >= 6 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              fontSize: '0.75rem',
              fontWeight: 700
            }}
          >
            <Plus size={13} /> +1 Ver (Bruit / Délai)
          </button>
        </div>

        {/* Threshold Alert if applicable */}
        {thresholdData && (
          <div style={{
            fontSize: '0.75rem',
            color: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '6px',
            padding: '6px 8px',
            lineHeight: 1.35
          }}>
            <strong>{thresholdData.title} :</strong> {thresholdData.text}
          </div>
        )}
      </div>

      {/* Draw Button */}
      <button
        onClick={handleDrawHazard}
        style={{
          padding: '10px',
          borderRadius: '8px',
          border: '1px dashed #ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          fontWeight: 700,
          fontSize: '0.85rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          boxShadow: '0 2px 8px rgba(239, 68, 68, 0.15)'
        }}
      >
        <Zap size={16} /> 🃏 Piocher un Danger du Désert
      </button>

      {/* Active Hazard Card Display */}
      {activeHazard && (
        <div style={{
          backgroundColor: 'var(--color-background)',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#ef4444', fontWeight: 800 }}>
              {activeHazard.title}
            </h4>
            <button
              onClick={handleDismissHazard}
              style={{ border: 'none', background: 'transparent', color: 'var(--color-text-muted)', cursor: 'pointer' }}
              title="Résoudre le danger"
            >
              <X size={15} />
            </button>
          </div>

          {activeHazard.flavor && (
            <p style={{ margin: 0, fontSize: '0.78rem', fontStyle: 'italic', color: 'var(--color-text-muted)' }}>
              « {activeHazard.flavor} »
            </p>
          )}

          <div style={{ fontSize: '0.8rem', color: 'var(--color-text)', backgroundColor: 'var(--color-surface)', padding: '6px', borderRadius: '4px' }}>
            {activeHazard.effect}
          </div>

          <button
            onClick={handleDismissHazard}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#10b981',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <Check size={13} /> Danger Résolu / Clôturé
          </button>
        </div>
      )}
    </div>
  );
}
