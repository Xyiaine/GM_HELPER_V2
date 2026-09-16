import React, { useState, useEffect } from 'react';
import {
  Eye, Ear, Wind, AlertCircle, ArrowRight, RotateCcw,
  Users, Sparkles, Swords, HelpCircle, Shield, ChevronDown, ChevronUp, Lock,
  Quote, Copy, Check, Plus, Activity, Stethoscope, Zap, CheckCircle2, XCircle,
  Megaphone, Flame, Compass, Target
} from 'lucide-react';
import {
  NODE_NPC_MAP, SALT_RACE_NPCS, getSpecialChallenges,
  getNarrativeElements, categorizeAction
} from './saltRaceData';

export default function QuestNodeCard({
  node,
  allNodesMap,
  campaignNpcs,
  onSelectNextNode,
  onOpenNpcModal,
  onGoBack,
  hasHistory,
  onLaunchCombat
}) {
  const [showSensory, setShowSensory] = useState(true);
  const [showMjSecret, setShowMjSecret] = useState(false);

  // Parse combat template if present
  const parsedCombatTemplate = React.useMemo(() => {
    if (!node?.combatTemplate) return [];
    try {
      const parsed = typeof node.combatTemplate === 'string'
        ? JSON.parse(node.combatTemplate)
        : node.combatTemplate;
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }, [node?.combatTemplate]);

  // Narrative Hook & Actions interactive state
  const [hookRead, setHookRead] = useState(false);
  const [hookCopied, setHookCopied] = useState(false);
  const [selectedActionIndexes, setSelectedActionIndexes] = useState(new Set());
  const [customActions, setCustomActions] = useState([]);
  const [newActionInput, setNewActionInput] = useState('');

  // Forced checks / Special challenges state
  const [progressiveTurn, setProgressiveTurn] = useState(1);
  const [challengeOutcomes, setChallengeOutcomes] = useState({});
  const [revealedSecrets, setRevealedSecrets] = useState({});
  const [copiedSecretId, setCopiedSecretId] = useState(null);

  // Reset node-specific states whenever node changes
  useEffect(() => {
    setHookRead(false);
    setHookCopied(false);
    setSelectedActionIndexes(new Set());
    setCustomActions([]);
    setNewActionInput('');
    setProgressiveTurn(1);
    setChallengeOutcomes({});
    setRevealedSecrets({});
    setCopiedSecretId(null);
  }, [node?.id, node?.displayCode]);

  if (!node) return null;

  // Retrieve outgoing connections (choices)
  const outgoingConnections = node.connectionsFrom || [];

  // Determine present NPCs for this node (supports both node.id and node.displayCode)
  const linkedNpcKeys = [
    ...(NODE_NPC_MAP[node.id] || []),
    ...(NODE_NPC_MAP[node.displayCode] || [])
  ];
  if (node.linkedNpcId && !linkedNpcKeys.includes(node.linkedNpcId)) {
    linkedNpcKeys.push(node.linkedNpcId);
  }
  const uniqueNpcKeys = Array.from(new Set(linkedNpcKeys));

  // Find NPC data (from saltRaceData or campaignNpcs)
  const presentNpcs = uniqueNpcKeys.map(k => {
    const predefined = SALT_RACE_NPCS[k];
    if (predefined) return predefined;
    const fromDb = campaignNpcs?.find(n => n.id === k || n.name.toLowerCase().includes(k.replace('npc_', '').replace('_', ' ')));
    if (fromDb) {
      return {
        id: fromDb.id,
        name: fromDb.name,
        role: fromDb.role || 'PNJ clé',
        city: fromDb.location?.name || '',
        voiceProfile: { speechPattern: fromDb.personality || 'Parle calmement.' },
        attitude: 0
      };
    }
    return { id: k, name: k.replace('npc_', '').replace('_', ' '), role: 'Intervenant', attitude: 0 };
  });

  // Extract narrative elements (hook, actions, clean description)
  const { hook, actions: parsedActions, cleanDesc } = getNarrativeElements(node);
  const allSuggestedActions = [...parsedActions, ...customActions];

  // Retrieve forced skill checks
  const specialChallenges = getSpecialChallenges(node);

  const pacingColor = node.pacingTag === 'climax'
    ? '#ef4444'
    : node.pacingTag === 'setup'
    ? '#3b82f6'
    : node.pacingTag === 'payoff'
    ? '#10b981'
    : node.pacingTag === 'respiration'
    ? '#06b6d4'
    : 'var(--color-primary)';

  // Handle copying the narrative hook
  const handleCopyHook = () => {
    if (!hook) return;
    navigator.clipboard.writeText(hook).then(() => {
      setHookCopied(true);
      setTimeout(() => setHookCopied(false), 2200);
    }).catch(err => console.error('Copy failed:', err));
  };

  // Handle toggling an action selection
  const handleToggleAction = (index) => {
    setSelectedActionIndexes(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  // Handle adding an improvised player action
  const handleAddCustomAction = (e) => {
    e.preventDefault();
    if (!newActionInput.trim()) return;
    const cat = categorizeAction(newActionInput.trim());
    setCustomActions(prev => [...prev, { text: newActionInput.trim(), ...cat }]);
    setNewActionInput('');
  };

  // Handle copying a revealed secret
  const handleCopySecret = (secretId, text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedSecretId(secretId);
      setTimeout(() => setCopiedSecretId(null), 2200);
    });
  };

  return (
    <div style={{
      backgroundColor: 'var(--color-surface, #18181b)',
      border: '2px solid rgba(99, 102, 241, 0.4)',
      borderRadius: '16px',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Top Banner */}
      <div style={{
        padding: '14px 20px',
        backgroundColor: 'rgba(12, 12, 16, 0.95)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontSize: '1rem',
            fontWeight: 800,
            padding: '3px 12px',
            borderRadius: '8px',
            backgroundColor: 'var(--color-primary, #6366f1)',
            color: '#fff',
            fontFamily: 'monospace',
            letterSpacing: '0.5px'
          }}>
            {node.displayCode || node.id}
          </span>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text, #f8fafc)' }}>
            {node.title || `Étape ${node.displayCode}`}
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {node.pacingTag && (
            <span style={{
              fontSize: '0.72rem',
              padding: '3px 10px',
              borderRadius: '12px',
              backgroundColor: `${pacingColor}25`,
              color: pacingColor,
              border: `1px solid ${pacingColor}60`,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {node.pacingTag}
            </span>
          )}
          {node.nodeType && (
            <span style={{
              fontSize: '0.72rem',
              padding: '3px 10px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: 'var(--color-text-muted, #94a3b8)',
              border: '1px solid var(--color-border)'
            }}>
              {node.nodeType}
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

        {/* 1. AMORCE NARRATIVE / ACCROCHE ORALE (High Impact Visual Prompt) */}
        {hook && (
          <div style={{
            background: hookRead
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.6) 100%)'
              : 'linear-gradient(135deg, rgba(168, 85, 247, 0.14) 0%, rgba(30, 27, 75, 0.4) 100%)',
            border: hookRead
              ? '1px solid rgba(16, 185, 129, 0.4)'
              : '1px solid rgba(168, 85, 247, 0.55)',
            borderRadius: '14px',
            padding: '16px 18px',
            position: 'relative',
            boxShadow: hookRead
              ? '0 4px 16px rgba(16, 185, 129, 0.1)'
              : '0 6px 24px rgba(168, 85, 247, 0.2)',
            transition: 'all 0.25s ease'
          }}>
            {/* Header bar of narrative hook */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  backgroundColor: hookRead ? 'rgba(16, 185, 129, 0.2)' : 'rgba(168, 85, 247, 0.25)',
                  color: hookRead ? '#10b981' : '#c084fc',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}>
                  <Megaphone size={14} />
                  <span>Amorce Narrative (Accroche Orale)</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted, #94a3b8)', fontStyle: 'italic' }}>
                  À clamer à voix haute aux joueurs dès l'entrée dans la scène
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleCopyHook}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    color: hookCopied ? '#10b981' : 'var(--color-text, #f1f5f9)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.15s ease'
                  }}
                  title="Copier le texte de l'amorce"
                >
                  {hookCopied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                  <span>{hookCopied ? 'Copié !' : 'Copier'}</span>
                </button>

                <button
                  onClick={() => setHookRead(!hookRead)}
                  style={{
                    backgroundColor: hookRead ? 'rgba(16, 185, 129, 0.2)' : 'rgba(168, 85, 247, 0.25)',
                    border: hookRead ? '1px solid #10b981' : '1px solid #c084fc',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    color: hookRead ? '#10b981' : '#e9d5ff',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.15s ease'
                  }}
                  title="Marquer cette amorce comme dite aux joueurs"
                >
                  {hookRead ? <CheckCircle2 size={13} /> : <Sparkles size={13} />}
                  <span>{hookRead ? 'Déclamée à la table' : 'Marquer comme dite'}</span>
                </button>
              </div>
            </div>

            {/* Stylized Quote */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <Quote size={28} color={hookRead ? '#10b981' : '#c084fc'} style={{ flexShrink: 0, opacity: 0.8, marginTop: '2px' }} />
              <blockquote style={{
                margin: 0,
                fontSize: '1.03rem',
                lineHeight: 1.55,
                color: hookRead ? 'var(--color-text-muted, #cbd5e1)' : '#f8fafc',
                fontStyle: 'italic',
                fontWeight: 500,
                letterSpacing: '0.2px'
              }}>
                "{hook}"
              </blockquote>
            </div>
          </div>
        )}

        {/* 2. ÉPREUVES IMPOSÉES & JETS FORCÉS (Evolving DCs & Reveals) */}
        {specialChallenges.length > 0 && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontWeight: 800, fontSize: '0.92rem' }}>
                <Zap size={18} />
                <span>Épreuves Imposées & Jets Forcés</span>
              </div>
              <span style={{
                fontSize: '0.72rem',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#fca5a5',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '8px',
                padding: '2px 8px',
                fontWeight: 700
              }}>
                Jets à faire lancer aux joueurs
              </span>
            </div>

            {/* Render each special challenge */}
            {specialChallenges.map((challenge) => {
              // Case A: PROGRESSIVE EVOLVING CHECK (e.g. Node 0.a Constitution dissipation)
              if (challenge.type === 'progressive') {
                const currentTurnData = challenge.turns.find(t => t.turn === progressiveTurn) || challenge.turns[0];
                const outcomeKey = `${challenge.id}_t${progressiveTurn}`;
                const currentOutcome = challengeOutcomes[outcomeKey];

                // This note used to be hardcoded and therefore displayed on every
                // progressive challenge, including nodes it had nothing to do with.
                // It is now driven by the challenge data, with the original node 0.a
                // wording kept as a fallback so nothing is lost.
                const narrativeNote = challenge.narrativeNote || (
                  (node.displayCode === '0.a' || node.id === 'node_0a')
                    ? "Même en cas de réussite totale, les souvenirs de leur passé et du tir sur le Convoi 5 restent effacés. C'est l'acuité visuelle et la motricité qui sont rétablies."
                    : null
                );

                return (
                  <div
                    key={challenge.id}
                    style={{
                      backgroundColor: 'rgba(15, 15, 20, 0.75)',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      borderRadius: '10px',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.2rem' }}>{challenge.icon || '🧪'}</span>
                        <div>
                          <strong style={{ fontSize: '0.95rem', color: '#f59e0b' }}>
                            {challenge.title}
                          </strong>
                          <span style={{ marginLeft: '8px', fontSize: '0.78rem', color: 'var(--ink-on-dark-muted)' }}>
                            (Caractéristique : <strong>{challenge.stat}</strong>)
                          </span>
                        </div>
                      </div>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--warning)',
                        color: '#000'
                      }}>
                        DD Évolutif (Facilité Croissante)
                      </span>
                    </div>

                    <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--ink-on-dark-muted)', lineHeight: 1.45 }}>
                      {challenge.description}
                    </p>

                    {/* Turn Stepper Selector */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ink-on-dark-muted)', textTransform: 'uppercase' }}>
                        Sélectionnez le tour en cours (Difficulté dégressive) :
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
                        {challenge.turns.map((t) => {
                          const isSelected = progressiveTurn === t.turn;
                          const tOutcome = challengeOutcomes[`${challenge.id}_t${t.turn}`];

                          return (
                            <button
                              key={t.turn}
                              onClick={() => setProgressiveTurn(t.turn)}
                              style={{
                                padding: '8px 10px',
                                borderRadius: '8px',
                                border: isSelected ? '2px solid #f59e0b' : '1px solid var(--color-border)',
                                backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                                color: isSelected ? '#fbbf24' : 'var(--ink-on-dark-muted)',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '3px',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 800 }}>
                                <span>Tour {t.turn}</span>
                                <span style={{
                                  backgroundColor: isSelected ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)',
                                  color: isSelected ? '#000' : 'var(--ink-on-dark)',
                                  padding: '1px 6px',
                                  borderRadius: '6px',
                                  fontSize: '0.74rem'
                                }}>
                                  DD {t.dc}
                                </span>
                              </div>
                              <span style={{ fontSize: '0.7rem', opacity: 0.85 }}>
                                {t.turn === 1 ? '100% Toxine' : t.turn === 2 ? '50% Dissipée' : 'Esprits Clairs'}
                              </span>
                              {tOutcome && (
                                <span style={{
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  color: tOutcome === 'success' ? '#10b981' : '#ef4444'
                                }}>
                                  {tOutcome === 'success' ? '✓ Réussi' : '✗ Échoué'}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Active Turn Outcome Card */}
                    <div style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.35)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                      borderRadius: '8px',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fbbf24' }}>
                          Résolution du {currentTurnData.label} — Exigez un jet de Constitution DD {currentTurnData.dc}
                        </span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => setChallengeOutcomes(prev => ({ ...prev, [outcomeKey]: 'failure' }))}
                            style={{
                              backgroundColor: currentOutcome === 'failure' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                              border: currentOutcome === 'failure' ? '1px solid #ef4444' : '1px solid var(--color-border)',
                              color: currentOutcome === 'failure' ? '#fca5a5' : 'var(--ink-on-dark-muted)',
                              borderRadius: '6px',
                              padding: '3px 8px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            ❌ Noter Échec
                          </button>
                          <button
                            onClick={() => setChallengeOutcomes(prev => ({ ...prev, [outcomeKey]: 'success' }))}
                            style={{
                              backgroundColor: currentOutcome === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                              border: currentOutcome === 'success' ? '1px solid #10b981' : '1px solid var(--color-border)',
                              color: currentOutcome === 'success' ? '#6ee7b7' : 'var(--ink-on-dark-muted)',
                              borderRadius: '6px',
                              padding: '3px 8px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            ✅ Noter Réussite
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        {/* Failure Text */}
                        <div style={{
                          backgroundColor: 'rgba(239, 68, 68, 0.08)',
                          borderLeft: '3px solid #ef4444',
                          padding: '8px 10px',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          color: '#fecaca',
                          lineHeight: 1.4
                        }}>
                          <strong style={{ color: '#ef4444' }}>❌ En cas d'Échec :</strong> {currentTurnData.consequenceFailure}
                        </div>

                        {/* Success Text */}
                        <div style={{
                          backgroundColor: 'rgba(16, 185, 129, 0.08)',
                          borderLeft: '3px solid #10b981',
                          padding: '8px 10px',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          color: '#d1fae5',
                          lineHeight: 1.4
                        }}>
                          <strong style={{ color: '#10b981' }}>✅ En cas de Réussite :</strong> {currentTurnData.consequenceSuccess}
                        </div>
                      </div>

                      {narrativeNote && (
                        <div style={{ fontSize: '0.74rem', color: 'var(--ink-on-dark-muted)', fontStyle: 'italic' }}>
                          💡 <strong>Note narrative :</strong> {narrativeNote}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              // Case B: MEDICAL / SPECIAL DIAGNOSIS CHECK (e.g. Node 0.a Medicine DC 15)
              if (challenge.id === 'challenge_0a_med') {
                const isRevealed = revealedSecrets[challenge.id];
                const outcome = challengeOutcomes[challenge.id];

                return (
                  <div
                    key={challenge.id}
                    style={{
                      backgroundColor: 'rgba(13, 148, 136, 0.08)',
                      border: '1px solid rgba(20, 184, 166, 0.4)',
                      borderRadius: '10px',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Stethoscope size={18} color="#2dd4bf" />
                        <div>
                          <strong style={{ fontSize: '0.92rem', color: '#2dd4bf' }}>
                            {challenge.title}
                          </strong>
                          <span style={{ marginLeft: '8px', fontSize: '0.78rem', color: 'var(--ink-on-dark-muted)' }}>
                            (Jet : <strong>{challenge.stat}</strong>)
                          </span>
                        </div>
                      </div>
                      <span style={{
                        backgroundColor: '#0d9488',
                        color: '#fff',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '6px'
                      }}>
                        DD {challenge.dc} (Difficile)
                      </span>
                    </div>

                    <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--ink-on-dark)', lineHeight: 1.4 }}>
                      {challenge.description}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <button
                        onClick={() => setRevealedSecrets(prev => ({ ...prev, [challenge.id]: !prev[challenge.id] }))}
                        style={{
                          backgroundColor: isRevealed ? '#0d9488' : 'rgba(20, 184, 166, 0.2)',
                          border: '1px solid #14b8a6',
                          color: isRevealed ? '#fff' : '#2dd4bf',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Sparkles size={14} />
                        <span>{isRevealed ? 'Masquer la conclusion' : '👁️ Révéler la conclusion médicale au PJ'}</span>
                      </button>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => setChallengeOutcomes(prev => ({ ...prev, [challenge.id]: 'failure' }))}
                          style={{
                            backgroundColor: outcome === 'failure' ? 'rgba(239, 68, 68, 0.3)' : 'transparent',
                            border: outcome === 'failure' ? '1px solid #ef4444' : '1px solid var(--color-border)',
                            color: outcome === 'failure' ? '#fca5a5' : 'var(--ink-on-dark-muted)',
                            borderRadius: '6px',
                            padding: '3px 8px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          ❌ Échec
                        </button>
                        <button
                          onClick={() => setChallengeOutcomes(prev => ({ ...prev, [challenge.id]: 'success' }))}
                          style={{
                            backgroundColor: outcome === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'transparent',
                            border: outcome === 'success' ? '1px solid #10b981' : '1px solid var(--color-border)',
                            color: outcome === 'success' ? '#6ee7b7' : 'var(--ink-on-dark-muted)',
                            borderRadius: '6px',
                            padding: '3px 8px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          ✅ Réussite
                        </button>
                      </div>
                    </div>

                    {/* Revealed Secret Box */}
                    {isRevealed && (
                      <div style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.45)',
                        border: '1px solid #14b8a6',
                        borderRadius: '8px',
                        padding: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#2dd4bf', textTransform: 'uppercase' }}>
                            {challenge.readAloudPrompt || 'Diagnostic à énoncer au PJ :'}
                          </span>
                          <button
                            onClick={() => handleCopySecret(challenge.id, challenge.successSecret)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: copiedSecretId === challenge.id ? '#10b981' : '#94a3b8',
                              fontSize: '0.72rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            {copiedSecretId === challenge.id ? <Check size={12} /> : <Copy size={12} />}
                            <span>{copiedSecretId === challenge.id ? 'Copié !' : 'Copier'}</span>
                          </button>
                        </div>
                        <blockquote style={{
                          margin: 0,
                          fontSize: '0.88rem',
                          color: '#ccfbf1',
                          fontStyle: 'italic',
                          lineHeight: 1.5,
                          borderLeft: '3px solid #14b8a6',
                          paddingLeft: '10px'
                        }}>
                          {challenge.successSecret}
                        </blockquote>
                      </div>
                    )}
                  </div>
                );
              }

              // Case C: STANDARD FORCED SINGLE CHECK
              const outcome = challengeOutcomes[challenge.id];

              return (
                <div
                  key={challenge.id}
                  style={{
                    backgroundColor: 'rgba(15, 15, 20, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.1rem' }}>{challenge.icon || '⚔️'}</span>
                      <div>
                        <strong style={{ fontSize: '0.9rem', color: 'var(--ink-on-dark)' }}>
                          {challenge.title}
                        </strong>
                        <span style={{ marginLeft: '8px', fontSize: '0.78rem', color: 'var(--ink-on-dark-muted)' }}>
                          (Stat : <strong>{challenge.stat}</strong>)
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {challenge.generative && (
                        <span style={{
                          fontSize: '0.7rem',
                          backgroundColor: 'rgba(236, 72, 153, 0.2)',
                          color: '#f472b6',
                          border: '1px solid #ec4899',
                          padding: '1px 6px',
                          borderRadius: '6px',
                          fontWeight: 700
                        }}>
                          ⭐ Échec Génératif
                        </span>
                      )}
                      <span style={{
                        backgroundColor: 'var(--danger)',
                        color: '#fff',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '6px'
                      }}>
                        DD {challenge.dc}
                      </span>
                    </div>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--ink-on-dark)', lineHeight: 1.4 }}>
                    {challenge.description}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.08)',
                      borderLeft: '3px solid #ef4444',
                      padding: '6px 8px',
                      borderRadius: '4px',
                      fontSize: '0.78rem',
                      color: '#fecaca',
                      lineHeight: 1.35
                    }}>
                      <strong style={{ color: '#ef4444' }}>Échec :</strong> {challenge.consequenceFailure}
                    </div>

                    <div style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.08)',
                      borderLeft: '3px solid #10b981',
                      padding: '6px 8px',
                      borderRadius: '4px',
                      fontSize: '0.78rem',
                      color: '#d1fae5',
                      lineHeight: 1.35
                    }}>
                      <strong style={{ color: '#10b981' }}>Réussite :</strong> {challenge.consequenceSuccess}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                    <button
                      onClick={() => setChallengeOutcomes(prev => ({ ...prev, [challenge.id]: 'failure' }))}
                      style={{
                        backgroundColor: outcome === 'failure' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                        border: outcome === 'failure' ? '1px solid #ef4444' : '1px solid var(--color-border)',
                        color: outcome === 'failure' ? '#fca5a5' : 'var(--ink-on-dark-muted)',
                        borderRadius: '6px',
                        padding: '3px 8px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      ❌ Noter Échec
                    </button>
                    <button
                      onClick={() => setChallengeOutcomes(prev => ({ ...prev, [challenge.id]: 'success' }))}
                      style={{
                        backgroundColor: outcome === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                        border: outcome === 'success' ? '1px solid #10b981' : '1px solid var(--color-border)',
                        color: outcome === 'success' ? '#6ee7b7' : 'var(--ink-on-dark-muted)',
                        borderRadius: '6px',
                        padding: '3px 8px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      ✅ Noter Réussite
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 3. ACTIONS SUGGÉRÉES AUX JOUEURS (Interactive Visual Chips) */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa', fontWeight: 800, fontSize: '0.9rem' }}>
              <Target size={17} />
              <span>Actions Suggérées aux Joueurs</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--ink-on-dark-muted)' }}>
              Cliquez sur une action pour la marquer comme retenue
            </span>
          </div>

          {/* Grid of Action Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '10px'
          }}>
            {allSuggestedActions.map((action, idx) => {
              const isSelected = selectedActionIndexes.has(idx);

              return (
                <div
                  key={idx}
                  onClick={() => handleToggleAction(idx)}
                  style={{
                    backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected ? '2px solid #10b981' : '1px solid var(--color-border)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 4px 16px rgba(16, 185, 129, 0.2)' : 'none',
                    transition: 'all 0.18s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.borderColor = 'var(--color-primary)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.borderColor = 'var(--color-border)';
                  }}
                >
                  <span style={{ fontSize: '1.25rem', lineHeight: 1, marginTop: '2px' }}>
                    {action.icon || '⚡'}
                  </span>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: isSelected ? '#10b981' : (action.color || 'var(--ink-on-dark-muted)'),
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {action.category || 'Action'}
                      </span>
                      {isSelected && (
                        <span style={{
                          backgroundColor: 'var(--success)',
                          color: '#000',
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          padding: '1px 6px',
                          borderRadius: '6px'
                        }}>
                          ✓ Retenue
                        </span>
                      )}
                    </div>
                    <span style={{
                      fontSize: '0.86rem',
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? '#f8fafc' : 'var(--ink-on-dark)',
                      lineHeight: 1.35
                    }}>
                      {action.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add custom action input */}
          <form onSubmit={handleAddCustomAction} style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            <input
              type="text"
              placeholder="+ Noter une action improvisée par les joueurs..."
              value={newActionInput}
              onChange={(e) => setNewActionInput(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                color: 'var(--ink-on-dark)',
                fontSize: '0.82rem'
              }}
            />
            <button
              type="submit"
              disabled={!newActionInput.trim()}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: newActionInput.trim() ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: newActionInput.trim() ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Plus size={14} />
              <span>Ajouter</span>
            </button>
          </form>
        </div>

        {/* 4. Triptyque Sensoriel (Vue, Ouïe, Odorat) */}
        {(node.sensoryVisual || node.sensorySound || node.sensorySmell) && (
          <div style={{
            backgroundColor: 'rgba(99, 102, 241, 0.05)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: '10px',
            padding: '12px 14px'
          }}>
            <div
              onClick={() => setShowSensory(!showSensory)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                color: 'var(--color-primary-light, #818cf8)',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} /> 🎙️ Ambiance Sensorielle (Détails immersifs)
              </span>
              {showSensory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>

            {showSensory && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px', fontSize: '0.85rem', lineHeight: 1.4 }}>
                {node.sensoryVisual && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <Eye size={15} color="#60a5fa" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div><strong style={{ color: '#60a5fa' }}>Ce qu'on voit :</strong> {node.sensoryVisual}</div>
                  </div>
                )}
                {node.sensorySound && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <Ear size={15} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div><strong style={{ color: '#f59e0b' }}>Ce qu'on entend :</strong> {node.sensorySound}</div>
                  </div>
                )}
                {node.sensorySmell && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <Wind size={15} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div><strong style={{ color: '#10b981' }}>Ce qu'on sent :</strong> {node.sensorySmell}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 5. Main de Cartes PNJ (Interactable NPCs) */}
        {presentNpcs.length > 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-primary-light, #818cf8)' }}>
              <Users size={15} />
              <span>Main de PNJ présents ({presentNpcs.length}) — Cliquez pour interagir :</span>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {presentNpcs.map((npc) => (
                <div
                  key={npc.id}
                  onClick={() => onOpenNpcModal(npc)}
                  style={{
                    backgroundColor: 'var(--color-surface, #1e1e1e)',
                    border: '1px solid var(--color-primary, #6366f1)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  title="Ouvrir la fiche de roleplay"
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    color: 'var(--color-primary-light, #818cf8)',
                    fontSize: '0.85rem'
                  }}>
                    {npc.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink-on-dark)' }}>
                      {npc.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--ink-on-dark-muted)' }}>
                      {npc.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Coulisses & Secrets MJ */}
        {cleanDesc && (
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px dashed var(--color-border)',
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '0.8rem'
          }}>
            <div
              onClick={() => setShowMjSecret(!showMjSecret)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                color: 'var(--ink-on-dark-muted)',
                fontWeight: 600
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={13} /> Coulisses & Secrets MJ
              </span>
              {showMjSecret ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
            {showMjSecret && (
              <p style={{ margin: '8px 0 0 0', color: 'var(--ink-on-dark)', lineHeight: 1.45, whiteSpace: 'pre-line' }}>
                {cleanDesc}
              </p>
            )}
          </div>
        )}

        {/* 6.5. RENCONTRE DE COMBAT TACTIQUE (Radiant Call-to-Action) */}
        {(node.linkedEncounterId || parsedCombatTemplate.length > 0) && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.16) 0%, rgba(35, 12, 22, 0.65) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.55)',
            borderRadius: '14px',
            padding: '16px 20px',
            boxShadow: '0 4px 20px rgba(239, 68, 68, 0.18)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(239, 68, 68, 0.25)',
                  color: '#f87171',
                  boxShadow: '0 2px 10px rgba(239, 68, 68, 0.3)'
                }}>
                  <Swords size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: '1.05rem', color: '#fecaca', letterSpacing: '0.5px' }}>
                    ⚔️ AFFRONTEMENT TACTIQUE DÉCLENCHÉ
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#fca5a5', marginTop: '2px' }}>
                    Une rencontre armée ou une embuscade éclate à cette étape !
                  </div>
                </div>
              </div>

              <button
                onClick={() => onLaunchCombat && onLaunchCombat(node.linkedEncounterId, node)}
                style={{
                  padding: '10px 22px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'var(--danger)',
                  backgroundImage: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 18px rgba(239, 68, 68, 0.45)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
              >
                <Swords size={18} /> DÉPLOYER L'ARÈNE DE COMBAT
              </button>
            </div>

            {/* Combat Preview Chips if template has enemies */}
            {parsedCombatTemplate.length > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
                paddingTop: '10px',
                borderTop: '1px solid rgba(239, 68, 68, 0.2)'
              }}>
                <span style={{ fontSize: '0.72rem', color: '#fca5a5', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Forces ennemies :
                </span>
                {parsedCombatTemplate.map((item, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(239, 68, 68, 0.22)',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      color: '#fee2e2',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>{item.count ? `${item.count}x` : '1x'}</span>
                    <span>{item.name || 'Ennemi'}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 7. Branchements & Choix de la Prochaine Étape (Strict Graph Connections) */}
        <div style={{
          borderTop: '1px solid var(--color-border)',
          paddingTop: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink-on-dark-muted)' }}>
            Embranchements disponibles selon le graphe :
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {outgoingConnections.length > 0 ? (
              outgoingConnections.map((conn) => {
                const targetNode = allNodesMap?.[conn.toNodeId] || conn.toNode;
                const targetCode = targetNode?.displayCode || targetNode?.id || conn.toNodeId;
                const targetTitle = targetNode?.title || conn.label || `Étape ${targetCode}`;

                return (
                  <button
                    key={conn.id || conn.toNodeId}
                    onClick={() => onSelectNextNode(conn.toNodeId)}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-primary, #6366f1)',
                      backgroundColor: 'rgba(99, 102, 241, 0.12)',
                      color: 'var(--ink-on-dark)',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-primary, #6366f1)';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.12)';
                      e.currentTarget.style.color = 'var(--ink-on-dark)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        fontSize: '0.78rem',
                        fontFamily: 'monospace'
                      }}>
                        {targetCode}
                      </span>
                      <span>{conn.label ? `${conn.label} (${targetTitle})` : targetTitle}</span>
                    </div>
                    <ArrowRight size={16} />
                  </button>
                );
              })
            ) : (
              <div style={{
                padding: '12px',
                textAlign: 'center',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid #10b981',
                borderRadius: '8px',
                color: '#10b981',
                fontWeight: 700
              }}>
                🏁 Fin de la Quête d'Ouverture ! Le convoi a franchi la ligne d'arrivée.
              </div>
            )}
          </div>

          {/* Back button */}
          {hasHistory && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '4px' }}>
              <button
                onClick={onGoBack}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)',
                  background: 'transparent',
                  color: 'var(--ink-on-dark-muted)',
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                <RotateCcw size={14} /> Revenir à l'étape précédente
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
