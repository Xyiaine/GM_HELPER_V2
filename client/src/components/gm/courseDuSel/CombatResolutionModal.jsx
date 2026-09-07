// CombatResolutionModal.jsx — Modalité de résolution et conséquences narratives du combat
import React, { useState } from 'react';
import { Trophy, Wind, Handshake, CheckCircle2, ArrowRight, AlertTriangle, ShieldAlert, Sparkles, X } from 'lucide-react';

export default function CombatResolutionModal({
  encounterName = 'Combat',
  activeNode = null,
  allNodesMap = {},
  onClose,
  onConfirm
}) {
  // Find next connected nodes from the active node
  const connections = activeNode?.connectionsFrom || [];
  const defaultNextNodeId = connections[0]?.toNodeId || null;

  const [selectedOutcome, setSelectedOutcome] = useState('victory'); // 'victory' | 'flee' | 'negotiate'
  const [targetNextNodeId, setTargetNextNodeId] = useState(defaultNextNodeId);
  const [applyConvoyPenalty, setApplyConvoyPenalty] = useState(true);
  const [applyWormIncrement, setApplyWormIncrement] = useState(false);

  const outcomes = [
    {
      id: 'victory',
      label: 'Victoire Écrasante',
      icon: <Trophy size={18} color="#f59e0b" />,
      color: '#f59e0b',
      desc: 'Les ennemis sont mis hors d\'état de nuire ou fuient en déroute.',
      defaultConvoyPenalty: true,
      defaultWormIncrement: false,
      benefits: 'Débloque le nœud suivant, affaiblit le convoi rival (-15% de progression), butin de ferraille.'
    },
    {
      id: 'flee',
      label: 'Fuite sous Pression',
      icon: <Wind size={18} color="#3b82f6" />,
      color: '#3b82f6',
      desc: 'Les PJ échappent au piège en fonçant à pleine vitesse dans les dunes.',
      defaultConvoyPenalty: false,
      defaultWormIncrement: true,
      benefits: 'Débloque la route d\'évitement, mais le bruit des moteurs attire le Ver (+1 palier de menace).'
    },
    {
      id: 'negotiate',
      label: 'Négociation / Rançon',
      icon: <Handshake size={18} color="#10b981" />,
      color: '#10b981',
      desc: 'Trêve tendue conclue par intimidation, troc de sel ou accord d\'escorte.',
      defaultConvoyPenalty: false,
      defaultWormIncrement: false,
      benefits: 'Maintient la neutralité diplomatique, économise les munitions, passage sécurisé.'
    }
  ];

  const handleSelectOutcome = (item) => {
    setSelectedOutcome(item.id);
    setApplyConvoyPenalty(item.defaultConvoyPenalty);
    setApplyWormIncrement(item.defaultWormIncrement);
  };

  const handleApply = () => {
    if (onConfirm) {
      onConfirm({
        outcome: selectedOutcome,
        nextNodeId: targetNextNodeId,
        convoyPenalty: applyConvoyPenalty,
        wormIncrement: applyWormIncrement
      });
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 7, 12, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 1100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '560px',
        backgroundColor: '#0d111a',
        border: '1px solid rgba(245, 158, 11, 0.4)',
        borderRadius: '20px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(245, 158, 11, 0.15)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 22px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(245, 158, 11, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              padding: '8px',
              borderRadius: '10px',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              color: '#f59e0b'
            }}>
              <Trophy size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                Dénouement du Combat
              </h3>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                {encounterName}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Outcome Choice Cards */}
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '10px' }}>
              1. Issue de l'affrontement
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {outcomes.map(item => {
                const isSelected = selectedOutcome === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectOutcome(item)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      backgroundColor: isSelected ? `${item.color}15` : 'rgba(255, 255, 255, 0.03)',
                      border: isSelected ? `2px solid ${item.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{
                      padding: '8px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? `${item.color}25` : 'rgba(255, 255, 255, 0.05)',
                      color: item.color
                    }}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: isSelected ? '#fff' : '#cbd5e1' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                        {item.desc}
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 size={18} color={item.color} />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next Node Selection */}
          {connections.length > 0 && (
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
                2. Progression vers l'étape suivante du graphe
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {connections.map(conn => {
                  const targetNode = allNodesMap[conn.toNodeId];
                  const isChosen = targetNextNodeId === conn.toNodeId;
                  return (
                    <div
                      key={conn.toNodeId}
                      onClick={() => setTargetNextNodeId(conn.toNodeId)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        backgroundColor: isChosen ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        border: isChosen ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.06)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.82rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 900, color: '#818cf8', fontFamily: 'monospace' }}>
                          {targetNode?.displayCode || targetNode?.id}
                        </span>
                        <span style={{ color: '#f8fafc', fontWeight: 700 }}>
                          {targetNode?.title || 'Étape suivante'}
                        </span>
                        {conn.label && (
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontStyle: 'italic' }}>
                            ({conn.label})
                          </span>
                        )}
                      </div>
                      <ArrowRight size={14} color={isChosen ? '#818cf8' : '#64748b'} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mechanical Levers Checklist */}
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
              3. Répercussions en direct sur la session
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                color: '#cbd5e1'
              }}>
                <input
                  type="checkbox"
                  checked={applyConvoyPenalty}
                  onChange={(e) => setApplyConvoyPenalty(e.target.checked)}
                />
                <span>Ralentir le convoi rival de <strong>15%</strong> (dégâts mécaniques et déroute)</span>
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                color: '#cbd5e1'
              }}>
                <input
                  type="checkbox"
                  checked={applyWormIncrement}
                  onChange={(e) => setApplyWormIncrement(e.target.checked)}
                />
                <span>Avancer l'horloge du Ver de <strong>+1 cran</strong> (bruits de tir et résonance)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 22px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backgroundColor: 'transparent',
              color: '#94a3b8',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Annuler
          </button>
          <button
            onClick={handleApply}
            style={{
              padding: '10px 22px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#f59e0b',
              backgroundImage: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#fff',
              fontSize: '0.9rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
            }}
          >
            🏁 Valider & Reprendre la Course <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
