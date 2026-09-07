import React from 'react';
import { Flame, Plus, Minus, RotateCcw, AlertOctagon, Zap } from 'lucide-react';
import { useGmStore } from '../../../store/gmStore';

export default function DoomPoolWidget() {
  const { doomPool, incrementDoomPool, setDoomPool } = useGmStore();

  const getIntensityColor = (val) => {
    if (val >= 8) return '#ef4444'; // Red
    if (val >= 5) return '#f97316'; // Orange
    if (val >= 3) return '#f59e0b'; // Amber
    return '#10b981'; // Emerald
  };

  const currentColor = getIntensityColor(doomPool);

  return (
    <div style={{
      backgroundColor: 'rgba(23, 23, 23, 0.95)',
      border: `1px solid ${currentColor}40`,
      borderRadius: '12px',
      padding: '16px',
      boxShadow: `0 8px 24px ${currentColor}15`,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: `${currentColor}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${currentColor}60`
          }}>
            <Flame size={20} color={currentColor} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)' }}>
              Réserve de Menace
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Points de Chaos pour interventions MJ
            </span>
          </div>
        </div>

        {/* Counter Big Display */}
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '4px',
          padding: '6px 14px',
          borderRadius: '10px',
          backgroundColor: 'var(--color-surface)',
          border: `1px solid ${currentColor}50`,
          boxShadow: `0 0 12px ${currentColor}20`
        }}>
          <span style={{
            fontSize: '1.8rem',
            fontWeight: 800,
            color: currentColor,
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1
          }}>
            {doomPool}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
            pts
          </span>
        </div>
      </div>

      {/* Visual Intensity Bar (Orbs/Segments) */}
      <div style={{ display: 'flex', gap: '4px', height: '8px', width: '100%' }}>
        {Array.from({ length: 12 }, (_, i) => i + 1).map((step) => {
          const isFilled = step <= doomPool;
          const stepColor = getIntensityColor(step);
          return (
            <div
              key={step}
              style={{
                flex: 1,
                borderRadius: '3px',
                backgroundColor: isFilled ? stepColor : 'rgba(255, 255, 255, 0.08)',
                boxShadow: isFilled ? `0 0 6px ${stepColor}80` : 'none',
                transition: 'all 0.2s ease'
              }}
            />
          );
        })}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => incrementDoomPool(-1)}
          disabled={doomPool <= 0}
          style={{
            flex: 1,
            padding: '8px 10px',
            borderRadius: '6px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            color: doomPool <= 0 ? 'var(--color-text-muted)' : 'var(--color-text)',
            cursor: doomPool <= 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            fontSize: '0.85rem',
            fontWeight: 600,
            transition: 'background-color 0.15s'
          }}
          title="Diminuer de 1"
        >
          <Minus size={15} /> 1
        </button>

        <button
          onClick={() => incrementDoomPool(1)}
          style={{
            flex: 1,
            padding: '8px 10px',
            borderRadius: '6px',
            border: '1px solid #f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.12)',
            color: '#f59e0b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            fontSize: '0.85rem',
            fontWeight: 600
          }}
          title="Échec PJ, bruit ou hésitation"
        >
          <Plus size={15} /> 1
        </button>

        <button
          onClick={() => incrementDoomPool(2)}
          style={{
            flex: 1,
            padding: '8px 10px',
            borderRadius: '6px',
            border: '1px solid #f97316',
            backgroundColor: 'rgba(249, 115, 22, 0.12)',
            color: '#f97316',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            fontSize: '0.85rem',
            fontWeight: 600
          }}
          title="Échec critique ou repos imprudent"
        >
          <Plus size={15} /> 2
        </button>

        <button
          onClick={() => incrementDoomPool(5)}
          style={{
            flex: 1,
            padding: '8px 10px',
            borderRadius: '6px',
            border: '1px solid #ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            color: '#ef4444',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            fontSize: '0.85rem',
            fontWeight: 700
          }}
          title="Déclenchement d'alarme majeure ou catastrophe"
        >
          <Zap size={15} /> 5
        </button>

        <button
          onClick={() => setDoomPool(0)}
          style={{
            padding: '8px 10px',
            borderRadius: '6px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'transparent',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Réinitialiser à 0"
        >
          <RotateCcw size={15} />
        </button>
      </div>

      {/* Tactical Prompt Bar */}
      <div style={{
        fontSize: '0.75rem',
        color: 'var(--color-text-muted)',
        borderTop: '1px solid var(--color-border)',
        paddingTop: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <AlertOctagon size={13} color={currentColor} style={{ flexShrink: 0 }} />
        <span>
          {doomPool >= 8
            ? "Tension maximale ! Lancez une embuscade majeure ou une tempête corrosive."
            : doomPool >= 4
            ? "Réserve prête pour des pannes de convoi, renforts ou enrayements."
            : "Accumulez de la Menace lors des échecs de dés et imprudences des PJ."}
        </span>
      </div>
    </div>
  );
}
