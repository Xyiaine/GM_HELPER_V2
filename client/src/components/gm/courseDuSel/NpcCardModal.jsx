import React, { useState } from 'react';
import {
  X, MessageSquare, Activity, ShieldAlert, Key, Eye, EyeOff,
  Swords, Shield, Heart, Plus, Minus, Zap, Footprints
} from 'lucide-react';

const ATTITUDES = [
  { val: -2, label: 'Hostile', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.2)' },
  { val: -1, label: 'Méfiant', color: '#f97316', bg: 'rgba(249, 115, 22, 0.2)' },
  { val: 0, label: 'Neutre', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.2)' },
  { val: 1, label: 'Favorable', color: '#10b981', bg: 'rgba(16, 185, 129, 0.2)' },
  { val: 2, label: 'Allié', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.2)' }
];

export default function NpcCardModal({ npc, onClose, onAttitudeChange, onHpChange }) {
  const [isSecretRevealed, setIsSecretRevealed] = useState(false);
  const [currentAttitude, setCurrentAttitude] = useState(npc?.attitude ?? 0);

  // Extract unified combat stats from DB properties or statblock fallback
  const armorClass = npc?.armorClass ?? npc?.statblock?.ca ?? 10;
  const hpMax = npc?.hpMax ?? npc?.statblock?.pv ?? 15;
  const [currentHp, setCurrentHp] = useState(() => {
    if (npc?.hpCurrent !== undefined && npc?.hpCurrent !== null) return npc.hpCurrent;
    return hpMax;
  });

  if (!npc) return null;

  // Handle attitude changes
  const handleSetAttitude = (val) => {
    setCurrentAttitude(val);
    if (onAttitudeChange) onAttitudeChange(npc.id, val);
  };

  // Handle live HP adjustment with instant sync
  const handleAdjustHp = (delta) => {
    const newHp = Math.max(0, Math.min(hpMax, currentHp + delta));
    setCurrentHp(newHp);
    if (onHpChange) onHpChange(npc.id, newHp);
  };

  // Parse stats object if JSON string
  let parsedStats = null;
  if (npc.stats) {
    try {
      parsedStats = typeof npc.stats === 'string' ? JSON.parse(npc.stats) : npc.stats;
    } catch (e) {}
  }

  const attObj = ATTITUDES.find(a => a.val === currentAttitude) || ATTITUDES[2];
  const hpPercent = Math.round((currentHp / Math.max(1, hpMax)) * 100);
  const hpColor = hpPercent > 50 ? '#10b981' : hpPercent > 20 ? '#f59e0b' : '#ef4444';
  const weaponDesc = npc.gmNotes || npc.statblock?.arme || '';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: 'var(--color-surface, #1e1e1e)',
        border: `2px solid ${attObj.color}`,
        borderRadius: '16px',
        width: '560px',
        maxWidth: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: `0 12px 40px ${attObj.color}35`,
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        padding: '22px',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-text, #f8fafc)' }}>
                {npc.name}
              </h2>
              <span style={{
                fontSize: '0.72rem',
                padding: '2px 8px',
                borderRadius: '12px',
                backgroundColor: attObj.bg,
                color: attObj.color,
                border: `1px solid ${attObj.color}50`,
                fontWeight: 800,
                textTransform: 'uppercase'
              }}>
                {attObj.label}
              </span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-primary-light, #818cf8)', marginTop: '3px' }}>
              {npc.role} {npc.city ? `— ${npc.city}` : ''}
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px'
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Attitude Selector Bar */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '6px' }}>
            Disposition envers les PJ (sauvegarde automatique en base) :
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
            {ATTITUDES.map((a) => {
              const isActive = currentAttitude === a.val;
              return (
                <button
                  key={a.val}
                  onClick={() => handleSetAttitude(a.val)}
                  style={{
                    padding: '6px 4px',
                    borderRadius: '6px',
                    border: isActive ? `2px solid ${a.color}` : '1px solid var(--color-border)',
                    backgroundColor: isActive ? a.color : 'rgba(255, 255, 255, 0.03)',
                    color: isActive ? '#fff' : 'var(--color-text-muted)',
                    fontSize: '0.75rem',
                    fontWeight: isActive ? 800 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {a.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Combat Stats & Unified Health Bar */}
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.35)',
          border: '1px solid var(--color-border)',
          borderRadius: '10px',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              📊 Fiche de Combat Unifiée (Sync Base de Données)
            </span>
            {npc.speed && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                <Footprints size={13} /> {npc.speed}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            {/* Armor Class */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(96, 165, 250, 0.15)',
              border: '1px solid rgba(96, 165, 250, 0.3)',
              borderRadius: '8px',
              padding: '6px 12px',
              color: '#60a5fa',
              fontWeight: 800,
              fontSize: '0.9rem'
            }}>
              <Shield size={16} />
              <span>CA {armorClass}</span>
            </div>

            {/* HP Live Controller */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Heart size={18} color={hpColor} />
                <span style={{ fontSize: '1rem', fontWeight: 800, color: hpColor, minWidth: '70px', textAlign: 'center' }}>
                  {currentHp} / {hpMax} PV
                </span>
              </div>

              {/* Adjust HP buttons */}
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={() => handleAdjustHp(-5)}
                  style={{ padding: '3px 7px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', cursor: 'pointer', fontWeight: 700, fontSize: '0.72rem' }}
                  title="Infliger 5 dégâts"
                >
                  -5
                </button>
                <button
                  onClick={() => handleAdjustHp(-1)}
                  style={{ padding: '3px 7px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', cursor: 'pointer', fontWeight: 700, fontSize: '0.72rem' }}
                  title="Infliger 1 dégât"
                >
                  -1
                </button>
                <button
                  onClick={() => handleAdjustHp(+1)}
                  style={{ padding: '3px 7px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', cursor: 'pointer', fontWeight: 700, fontSize: '0.72rem' }}
                  title="Soigner 1 PV"
                >
                  +1
                </button>
                <button
                  onClick={() => handleAdjustHp(+5)}
                  style={{ padding: '3px 7px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', cursor: 'pointer', fontWeight: 700, fontSize: '0.72rem' }}
                  title="Soigner 5 PV"
                >
                  +5
                </button>
              </div>
            </div>
          </div>

          {/* Health Gauge */}
          <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              width: `${hpPercent}%`,
              height: '100%',
              backgroundColor: hpColor,
              transition: 'width 0.25s ease'
            }} />
          </div>

          {/* D&D 5e Attributes Table */}
          {parsedStats && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '4px',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '6px',
              padding: '6px 4px',
              fontSize: '0.78rem'
            }}>
              <div><div style={{ color: 'var(--color-text-muted)', fontSize: '0.68rem' }}>FOR</div><strong>{parsedStats.str ?? 10}</strong></div>
              <div><div style={{ color: 'var(--color-text-muted)', fontSize: '0.68rem' }}>DEX</div><strong>{parsedStats.dex ?? 10}</strong></div>
              <div><div style={{ color: 'var(--color-text-muted)', fontSize: '0.68rem' }}>CON</div><strong>{parsedStats.con ?? 10}</strong></div>
              <div><div style={{ color: 'var(--color-text-muted)', fontSize: '0.68rem' }}>INT</div><strong>{parsedStats.int ?? 10}</strong></div>
              <div><div style={{ color: 'var(--color-text-muted)', fontSize: '0.68rem' }}>SAG</div><strong>{parsedStats.wis ?? 10}</strong></div>
              <div><div style={{ color: 'var(--color-text-muted)', fontSize: '0.68rem' }}>CHA</div><strong>{parsedStats.cha ?? 10}</strong></div>
            </div>
          )}

          {/* Weapon / Action Attack */}
          {weaponDesc && (
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '6px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '6px' }}>
              <Swords size={14} color="#f87171" />
              <span><strong>Arme / Attaque :</strong> {weaponDesc}</span>
            </div>
          )}
        </div>

        {/* Voice & Roleplay Guide */}
        {npc.voiceProfile && (
          <div style={{
            backgroundColor: 'var(--color-background, #121212)',
            borderRadius: '10px',
            padding: '12px 14px',
            border: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: '0.82rem'
          }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <MessageSquare size={15} color="#60a5fa" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#60a5fa' }}>Façon de parler :</strong> {npc.voiceProfile.speechPattern}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <Activity size={15} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#f59e0b' }}>Tic physique :</strong> {npc.voiceProfile.physicalTic}
              </div>
            </div>

            {npc.voiceProfile.signatureBehavior && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <ShieldAlert size={15} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#ef4444' }}>Comportement signature :</strong> {npc.voiceProfile.signatureBehavior}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Secret MJ */}
        {npc.secret && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px dashed rgba(239, 68, 68, 0.35)',
            borderRadius: '10px',
            padding: '12px',
            fontSize: '0.82rem'
          }}>
            <div
              onClick={() => setIsSecretRevealed(!isSecretRevealed)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                color: '#ef4444',
                fontWeight: 700
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Key size={14} /> Secret Inavouable (Réservé au MJ)
              </span>
              {isSecretRevealed ? <EyeOff size={15} /> : <Eye size={15} />}
            </div>
            {isSecretRevealed && (
              <p style={{ margin: '8px 0 0 0', color: 'var(--color-text)', lineHeight: 1.45 }}>
                {npc.secret}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
