import React, { useState, useEffect } from 'react';
import {
  Shield,
  Heart,
  Skull,
  Zap,
  Swords,
  ChevronDown,
  ChevronUp,
  User,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Crosshair
} from 'lucide-react';

import { CONDITIONS_DND5E } from '../../../utils/conditions';

export default function CombatantCard({
  combatant,
  isActiveTurn = false,
  isPlayerCharacter = false,
  onHpDelta,
  onInitiativeChange,
  onToggleCondition,
  onToggleSurprise,
  entityDetails = null
}) {
  if (!combatant) return null;

  const [isExpanded, setIsExpanded] = useState(false);
  const [customDamageInput, setCustomDamageInput] = useState('');

  // Local state for initiative input to prevent focus loss and formatting bugs
  const [localInitiative, setLocalInitiative] = useState(
    combatant.initiative !== null && combatant.initiative !== undefined ? String(combatant.initiative) : ''
  );

  useEffect(() => {
    setLocalInitiative(
      combatant.initiative !== null && combatant.initiative !== undefined ? String(combatant.initiative) : ''
    );
  }, [combatant.initiative]);

  const handleCommitInitiative = (val) => {
    const parsed = parseInt(val, 10);
    const finalVal = !isNaN(parsed) ? parsed : 0;
    if (onInitiativeChange) {
      onInitiativeChange(combatant.id, finalVal);
    }
  };

  const isDowned = (combatant.hpCurrent || 0) <= 0;
  let parsedConditions = [];
  try {
    parsedConditions = typeof combatant.conditions === 'string'
      ? JSON.parse(combatant.conditions || '[]')
      : (combatant.conditions || []);
  } catch (e) {
    parsedConditions = [];
  }
  if (!Array.isArray(parsedConditions)) parsedConditions = [];

  // Parse weapon/attacks from entityDetails or combatant notes
  let attacksList = [];
  if (entityDetails?.attacks) {
    try {
      attacksList = typeof entityDetails.attacks === 'string'
        ? JSON.parse(entityDetails.attacks)
        : entityDetails.attacks;
    } catch (e) {}
  }
  if (!Array.isArray(attacksList)) attacksList = [];
  if (attacksList.length === 0 && combatant.gmNotes) {
    attacksList = [{ name: 'Attaque principale', description: combatant.gmNotes }];
  }
  if (attacksList.length === 0 && entityDetails?.gmNotes) {
    attacksList = [{ name: 'Attaque', description: entityDetails.gmNotes }];
  }

  // D&D 5e Stats
  let rawStats = {};
  if (entityDetails?.stats) {
    try {
      rawStats = typeof entityDetails.stats === 'string'
        ? JSON.parse(entityDetails.stats)
        : entityDetails.stats;
    } catch (e) {}
  }
  if (!rawStats || typeof rawStats !== 'object' || Array.isArray(rawStats)) rawStats = {};
  const statsObj = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10, ...rawStats };

  // Color theme by faction / combatant type
  const getCampTheme = () => {
    if (isPlayerCharacter) {
      return {
        badge: 'PJ',
        color: '#3b82f6', // Sapphire blue
        glow: 'rgba(59, 130, 246, 0.4)',
        bgBorder: 'rgba(59, 130, 246, 0.5)',
        label: 'Personnage Joueur'
      };
    }
    if (combatant.type === 'npc' || combatant.sourceType === 'npc') {
      return {
        badge: 'RIVAL',
        color: '#f59e0b', // Amber / Gold
        glow: 'rgba(245, 158, 11, 0.4)',
        bgBorder: 'rgba(245, 158, 11, 0.5)',
        label: 'PNJ Rival'
      };
    }
    return {
      badge: 'MONSTRE',
      color: '#ef4444', // Crimson red
      glow: 'rgba(239, 68, 68, 0.4)',
      bgBorder: 'rgba(239, 68, 68, 0.5)',
      label: 'Danger du Désert'
    };
  };

  const camp = getCampTheme();

  const handleApplyDamage = (e) => {
    e.preventDefault();
    const val = parseInt(customDamageInput, 10);
    if (!isNaN(val) && val !== 0 && onHpDelta) {
      onHpDelta(combatant, -val);
      setCustomDamageInput('');
    }
  };

  // HP percentage
  const hpMax = Math.max(1, combatant.hpMax || 10);
  const hpCurrent = Math.max(0, combatant.hpCurrent ?? hpMax);
  const hpPct = Math.min(100, Math.max(0, Math.round((hpCurrent / hpMax) * 100)));

  return (
    <div
      style={{
        position: 'relative',
        width: '240px',
        minHeight: '340px',
        borderRadius: '16px',
        backgroundColor: '#0f1118',
        backgroundImage: 'radial-gradient(ellipse at top, rgba(30, 35, 55, 0.6) 0%, rgba(10, 12, 18, 0.95) 100%)',
        border: isActiveTurn
          ? `2px solid ${camp.color}`
          : isDowned
          ? '2px solid rgba(239, 68, 68, 0.3)'
          : `1px solid ${camp.bgBorder}`,
        boxShadow: isActiveTurn
          ? `0 0 24px ${camp.glow}, 0 10px 25px rgba(0,0,0,0.8)`
          : '0 4px 16px rgba(0, 0, 0, 0.5)',
        transform: isActiveTurn
          ? 'translateY(-8px) scale(1.03)'
          : isDowned
          ? 'scale(0.95) rotate(-2deg)'
          : 'none',
        opacity: isDowned ? 0.6 : 1,
        transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      {/* Active Turn Radiant Banner */}
      {isActiveTurn && (
        <div style={{
          backgroundColor: camp.color,
          color: '#fff',
          padding: '4px 10px',
          textAlign: 'center',
          fontSize: '0.75rem',
          fontWeight: 900,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          boxShadow: `0 2px 10px ${camp.glow}`
        }}>
          <Zap size={14} /> Tour en Cours
        </div>
      )}

      {/* Downed Overlay */}
      {isDowned && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 17, 24, 0.75)',
          zIndex: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          pointerEvents: 'none'
        }}>
          <div style={{
            padding: '6px 14px',
            borderRadius: '20px',
            backgroundColor: 'rgba(239, 68, 68, 0.9)',
            color: '#fff',
            fontWeight: 900,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            letterSpacing: '1px'
          }}>
            <Skull size={16} /> HORS DE COMBAT
          </div>
        </div>
      )}

      {/* Card Header : Camp Badge, Name, Initiative & AC */}
      <div style={{
        padding: '12px 14px 8px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '8px'
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 900,
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: `${camp.color}25`,
              color: camp.color,
              border: `1px solid ${camp.color}60`,
              letterSpacing: '0.5px'
            }}>
              {camp.badge}
            </span>
            {combatant.isSurprised && (
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 800,
                padding: '2px 5px',
                borderRadius: '4px',
                backgroundColor: 'rgba(239, 68, 68, 0.25)',
                color: '#f87171',
                border: '1px solid #ef4444'
              }}>
                SURPRIS
              </span>
            )}
          </div>
          <div style={{
            fontWeight: 800,
            fontSize: '0.95rem',
            color: '#f8fafc',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }} title={combatant.name}>
            {combatant.name}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
            {combatant.role || camp.label}
          </div>
        </div>

        {/* Stats Badges : Initiative & CA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
          {/* Initiative Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 8px',
            borderRadius: '6px',
            backgroundColor: 'rgba(234, 179, 8, 0.18)',
            border: '1.5px solid rgba(234, 179, 8, 0.6)',
            color: '#facc15',
            fontWeight: 900,
            fontSize: '0.85rem',
            boxShadow: '0 0 10px rgba(234, 179, 8, 0.15)'
          }}>
            <Zap size={13} color="#facc15" />
            <span>Init {combatant.initiative ?? 0}</span>
          </div>

          {/* Armor Class */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            padding: '2px 7px',
            borderRadius: '6px',
            backgroundColor: 'rgba(59, 130, 246, 0.12)',
            border: '1px solid rgba(59, 130, 246, 0.35)',
            color: '#60a5fa',
            fontWeight: 800,
            fontSize: '0.75rem'
          }}>
            <Shield size={11} /> CA {combatant.armorClass || 10}
          </div>
        </div>
      </div>

      {/* Health Gauge & Tactile Buttons */}
      <div style={{ padding: '10px 14px', backgroundColor: 'rgba(0,0,0,0.25)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Heart size={12} color={hpPct < 30 ? '#ef4444' : '#10b981'} /> Points de Vie
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: 900, color: hpPct < 30 ? '#ef4444' : '#f8fafc' }}>
            {hpCurrent} <span style={{ fontSize: '0.75rem', color: '#64748b' }}>/ {hpMax}</span>
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{
          height: '6px',
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '3px',
          overflow: 'hidden',
          marginBottom: '8px'
        }}>
          <div style={{
            height: '100%',
            width: `${hpPct}%`,
            backgroundColor: hpPct > 50 ? '#10b981' : hpPct > 25 ? '#f59e0b' : '#ef4444',
            transition: 'width 0.3s ease'
          }} />
        </div>

        {/* HP Delta Controls */}
        <div style={{ display: 'flex', gap: '4px', justifyContent: 'space-between' }}>
          <button
            onClick={() => onHpDelta && onHpDelta(combatant, -5)}
            style={{ flex: 1, padding: '4px 0', borderRadius: '4px', border: '1px solid rgba(239, 68, 68, 0.3)', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
            title="Infliger 5 dégâts"
          >
            -5
          </button>
          <button
            onClick={() => onHpDelta && onHpDelta(combatant, -1)}
            style={{ flex: 1, padding: '4px 0', borderRadius: '4px', border: '1px solid rgba(239, 68, 68, 0.3)', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
            title="Infliger 1 dégât"
          >
            -1
          </button>
          <button
            onClick={() => onHpDelta && onHpDelta(combatant, 1)}
            style={{ flex: 1, padding: '4px 0', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#34d399', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
            title="Soigner 1 PV"
          >
            +1
          </button>
          <button
            onClick={() => onHpDelta && onHpDelta(combatant, 5)}
            style={{ flex: 1, padding: '4px 0', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#34d399', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
            title="Soigner 5 PV"
          >
            +5
          </button>
        </div>

        {/* Numeric Damage Input */}
        <form onSubmit={handleApplyDamage} style={{ marginTop: '6px', display: 'flex', gap: '4px' }}>
          <input
            type="number"
            placeholder="Dégâts..."
            value={customDamageInput}
            onChange={(e) => setCustomDamageInput(e.target.value)}
            style={{
              flex: 1,
              padding: '3px 6px',
              fontSize: '0.75rem',
              borderRadius: '4px',
              border: '1px solid rgba(255,255,255,0.1)',
              backgroundColor: 'rgba(0,0,0,0.4)',
              color: '#fff',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '3px 8px',
              fontSize: '0.72rem',
              fontWeight: 800,
              borderRadius: '4px',
              border: 'none',
              backgroundColor: 'var(--danger)',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            Appliquer
          </button>
        </form>
      </div>

      {/* Non-Player Weapons / Actions Cartouche */}
      {!isPlayerCharacter ? (
        <div style={{ padding: '10px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Attaques & Actions
          </span>
          {attacksList.slice(0, 2).map((atk, idx) => (
            <div
              key={idx}
              style={{
                padding: '6px 8px',
                borderRadius: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                fontSize: '0.75rem'
              }}
            >
              <div style={{ fontWeight: 800, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Swords size={12} color={camp.color} /> {atk.name}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                {atk.description || atk.damage || 'Attaque standard'}
              </div>
            </div>
          ))}

          {/* D&D 5e Ability Modifiers Quick Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '2px',
            marginTop: 'auto',
            paddingTop: '6px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            textAlign: 'center'
          }}>
            {[
              { label: 'FOR', val: statsObj.str },
              { label: 'DEX', val: statsObj.dex },
              { label: 'CON', val: statsObj.con },
              { label: 'INT', val: statsObj.int },
              { label: 'SAG', val: statsObj.wis },
              { label: 'CHA', val: statsObj.cha }
            ].map(attr => {
              const num = typeof attr.val === 'number' ? attr.val : (parseInt(attr.val, 10) || 10);
              const mod = Math.floor((num - 10) / 2);
              return (
                <div key={attr.label} style={{ fontSize: '0.62rem', color: '#64748b' }}>
                  <span style={{ display: 'block', fontWeight: 700 }}>{attr.label}</span>
                  <span style={{ color: '#cbd5e1', fontWeight: 800 }}>{mod >= 0 ? `+${mod}` : mod}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Player Character Specific Info (Passive help for GM) */
        <div style={{ padding: '10px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Prominent Physical Initiative Box for GM */}
          <div style={{
            padding: '10px 12px',
            borderRadius: '12px',
            backgroundColor: 'rgba(234, 179, 8, 0.1)',
            border: '1.5px solid rgba(234, 179, 8, 0.55)',
            boxShadow: '0 0 16px rgba(234, 179, 8, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                padding: '6px',
                borderRadius: '8px',
                backgroundColor: 'rgba(234, 179, 8, 0.25)',
                color: '#facc15'
              }}>
                <Zap size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 900, fontSize: '0.82rem', color: '#fef08a', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  Jet d'Initiative
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                  Lancé à la table
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={localInitiative}
                placeholder="0"
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^0-9]/g, '');
                  setLocalInitiative(cleaned);
                  handleCommitInitiative(cleaned);
                }}
                onBlur={(e) => handleCommitInitiative(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.currentTarget.blur();
                  }
                }}
                style={{
                  width: '56px',
                  height: '38px',
                  padding: '2px 8px',
                  borderRadius: '8px',
                  backgroundColor: '#0a0d14',
                  border: '2px solid #facc15',
                  color: '#facc15',
                  fontWeight: 900,
                  fontSize: '1.25rem',
                  textAlign: 'center',
                  outline: 'none',
                  boxShadow: '0 0 12px rgba(234, 179, 8, 0.35)',
                  fontFamily: 'monospace'
                }}
                title="Tapez le score d'initiative du joueur (ex: 18) et appuyez sur Entrée"
              />
            </div>
          </div>

          <div style={{
            padding: '6px 10px',
            borderRadius: '8px',
            backgroundColor: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            fontSize: '0.72rem',
            color: '#93c5fd'
          }}>
            <div style={{ fontWeight: 800, marginBottom: '2px' }}>📝 Fiche Papier Joueur</div>
            <div style={{ fontSize: '0.68rem', color: '#bfdbfe' }}>
              Le joueur annonce ses actions et ses jets physiques à la table.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
            <span>Perception passive :</span>
            <strong style={{ color: '#f8fafc' }}>
              {10 + Math.floor((((typeof statsObj.wis === 'number' ? statsObj.wis : parseInt(statsObj.wis, 10)) || 10) - 10) / 2)}
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
            <span>Sauvegarde DEX :</span>
            {(() => {
              const dexVal = (typeof statsObj.dex === 'number' ? statsObj.dex : parseInt(statsObj.dex, 10)) || 10;
              const dexMod = Math.floor((dexVal - 10) / 2);
              return (
                <strong style={{ color: '#f8fafc' }}>
                  {dexMod >= 0 ? `+${dexMod}` : dexMod}
                </strong>
              );
            })()}
          </div>
        </div>
      )}

      {/* Conditions Quick-Toggle Bar */}
      <div style={{
        padding: '6px 10px',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px',
        alignItems: 'center'
      }}>
        <span style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 800, marginRight: '2px' }}>
          ÉTATS :
        </span>
        {CONDITIONS_DND5E.map(cond => {
          const has = parsedConditions.includes(cond);
          return (
            <button
              key={cond}
              onClick={() => onToggleCondition && onToggleCondition(combatant, cond)}
              style={{
                padding: '2px 5px',
                borderRadius: '8px',
                fontSize: '0.62rem',
                fontWeight: 700,
                border: has ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
                backgroundColor: has ? 'rgba(245, 158, 11, 0.25)' : 'transparent',
                color: has ? '#f59e0b' : '#64748b',
                cursor: 'pointer'
              }}
            >
              {cond}
            </button>
          );
        })}
      </div>
    </div>
  );
}
