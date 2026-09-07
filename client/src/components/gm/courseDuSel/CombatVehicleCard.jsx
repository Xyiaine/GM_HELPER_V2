// CombatVehicleCard.jsx — Carte de Véhicule Tactique (Support / Plateforme)
import React from 'react';
import { Truck, Shield, Gauge, Zap, Users, AlertOctagon } from 'lucide-react';

export default function CombatVehicleCard({
  vehicle,
  onHpDelta,
  isPlayerVehicle = false
}) {
  const hpMax = vehicle.hpMax || vehicle.hpMaxBase || 100;
  const hpCurrent = Math.max(0, vehicle.hpCurrent ?? hpMax);
  const hpPct = Math.min(100, Math.max(0, Math.round((hpCurrent / hpMax) * 100)));
  const isDestroyed = hpCurrent <= 0 || vehicle.isDestroyed;

  const maneuvers = [
    { name: '💥 Éperonnage', desc: '+5 touch, 3d10 dégâts d\'impact' },
    { name: '⚡ Boost Turbo', desc: '+10m vitesse, DD 13 Pilotage' },
    { name: '💨 Nuage de Sel', desc: 'Désavantage aux tirs (1 rd)' },
    { name: '🛡️ Flanc Renforcé', desc: '+2 CA jusqu\'au prochain tour' }
  ];

  return (
    <div
      style={{
        position: 'relative',
        minWidth: '280px',
        maxWidth: '340px',
        borderRadius: '14px',
        backgroundColor: '#0c0e14',
        border: isPlayerVehicle
          ? '1px solid rgba(59, 130, 246, 0.4)'
          : '1px solid rgba(168, 85, 247, 0.4)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6)',
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        userSelect: 'none',
        opacity: isDestroyed ? 0.5 : 1
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            padding: '6px',
            borderRadius: '8px',
            backgroundColor: isPlayerVehicle ? 'rgba(59, 130, 246, 0.15)' : 'rgba(168, 85, 247, 0.15)',
            color: isPlayerVehicle ? '#60a5fa' : '#c084fc'
          }}>
            <Truck size={16} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#f8fafc' }}>
              {vehicle.name}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
              {isPlayerVehicle ? 'Convoi des PJ' : 'Véhicule Rival'}
            </div>
          </div>
        </div>

        {/* Speed & AC */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <span style={{
            padding: '2px 6px',
            borderRadius: '4px',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            color: '#60a5fa',
            fontSize: '0.7rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '3px'
          }}>
            <Shield size={11} /> CA {vehicle.acBase || 15}
          </span>
          <span style={{
            padding: '2px 6px',
            borderRadius: '4px',
            backgroundColor: 'rgba(234, 179, 8, 0.1)',
            color: '#facc15',
            fontSize: '0.7rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '3px'
          }}>
            <Gauge size={11} /> {vehicle.speedBase || 12}m
          </span>
        </div>
      </div>

      {/* Hull Armor / Carrosserie HP */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '3px' }}>
          <span style={{ color: '#94a3b8', fontWeight: 700 }}>Blindage / Carrosserie</span>
          <span style={{ fontWeight: 900, color: hpPct < 30 ? '#ef4444' : '#f8fafc' }}>
            {hpCurrent} / {hpMax} PV
          </span>
        </div>
        <div style={{
          height: '6px',
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '3px',
          overflow: 'hidden',
          marginBottom: '6px'
        }}>
          <div style={{
            height: '100%',
            width: `${hpPct}%`,
            backgroundColor: hpPct > 50 ? '#3b82f6' : hpPct > 25 ? '#f59e0b' : '#ef4444',
            transition: 'width 0.25s ease'
          }} />
        </div>

        {/* Hull Damage Buttons */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => onHpDelta && onHpDelta(vehicle, -10)}
            style={{ flex: 1, padding: '3px 0', borderRadius: '4px', border: '1px solid rgba(239, 68, 68, 0.3)', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer' }}
          >
            -10
          </button>
          <button
            onClick={() => onHpDelta && onHpDelta(vehicle, -5)}
            style={{ flex: 1, padding: '3px 0', borderRadius: '4px', border: '1px solid rgba(239, 68, 68, 0.3)', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer' }}
          >
            -5
          </button>
          <button
            onClick={() => onHpDelta && onHpDelta(vehicle, 5)}
            style={{ flex: 1, padding: '3px 0', borderRadius: '4px', border: '1px solid rgba(59, 130, 246, 0.3)', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer' }}
          >
            +5
          </button>
          <button
            onClick={() => onHpDelta && onHpDelta(vehicle, 10)}
            style={{ flex: 1, padding: '3px 0', borderRadius: '4px', border: '1px solid rgba(59, 130, 246, 0.3)', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer' }}
          >
            +10
          </button>
        </div>
      </div>

      {/* Tactical Vehicle Maneuvers */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '2px' }}>
        {maneuvers.map(m => (
          <div
            key={m.name}
            style={{
              padding: '3px 6px',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '0.65rem'
            }}
            title={m.desc}
          >
            <span style={{ fontWeight: 800, color: '#e2e8f0' }}>{m.name}</span> : <span style={{ color: '#94a3b8' }}>{m.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
