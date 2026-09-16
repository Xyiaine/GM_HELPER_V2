import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../../utils/api';
import { Lock, Unlock, Zap, X, AlertTriangle, Skull } from 'lucide-react';

const TIER_COLORS = {
  1: '#9ca3af', // gray-400
  2: '#34d399', // emerald-400
  3: '#60a5fa', // blue-400
  4: '#c084fc', // purple-400
  5: '#f59e0b', // amber-400
};

const SPACING = 2.0;

export default function SkillTreeViewer({ campaignId, character, onUpdateCharacter, onClose, isGm, embedded = false }) {
  const [trees, setTrees] = useState([]);
  const [selectedTreeId, setSelectedTreeId] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [unlockError, setUnlockError] = useState(null);
  
  // Pan and zoom state
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const svgRef = useRef(null);

  useEffect(() => {
    // Fetch trees
    api.get(`/api/v1/gm/campaigns/${campaignId}/skill-trees`)
      .then(data => {
        setTrees(data.trees || []);
        if (data.trees && data.trees.length > 0) {
          setSelectedTreeId(data.trees[0].id);
        }
      })
      .catch(err => console.error("Failed to load skill trees", err));
  }, [campaignId]);

  let unlockedSkills = [];
  try {
    unlockedSkills = character?.unlockedSkills ? JSON.parse(character.unlockedSkills) : [];
    if (!Array.isArray(unlockedSkills)) unlockedSkills = [];
  } catch(e) {
    console.error("Error parsing unlockedSkills", e);
  }
  const spentPoints = character?.skillPoints || 0;
  // 2 points per level per compendium rules
  const rawAvailablePoints = ((character?.level || 1) * 2) - spentPoints;
  const availablePoints = Math.max(0, rawAvailablePoints);

  const currentTree = trees.find(t => t.id === selectedTreeId);
  const nodes = currentTree ? currentTree.branches.flatMap(b => b.noeuds) : [];

  // Global node map across ALL trees to support cross-tree prerequisite lookups (M4)
  const allNodeMap = new Map();
  trees.forEach(t => {
    t.branches?.forEach(b => {
      b.noeuds?.forEach(n => allNodeMap.set(n.id, n));
    });
  });

  const nodeMap = new Map();
  nodes.forEach(n => nodeMap.set(n.id, n));

  const isUnlocked = (nodeId) => unlockedSkills.includes(nodeId);
  const canUnlock = (node) => {
    if (isUnlocked(node.id)) return false;
    if (rawAvailablePoints < node.cout_points) return false;
    if (!node.prerequis || node.prerequis.length === 0) return true; // root node
    
    // Support "ET" (all prerequisites required) vs "OU" (at least one required)
    if (node.prerequis_logique === 'et') {
      return node.prerequis.every(reqId => isUnlocked(reqId));
    }
    return node.prerequis.some(reqId => isUnlocked(reqId));
  };

  const handleUnlock = async () => {
    if (!selectedNode || !canUnlock(selectedNode)) return;
    setUnlockError(null);

    try {
      if (character?.id && campaignId) {
        const res = await api.post(`/api/v1/gm/campaigns/${campaignId}/skill-trees/characters/${character.id}/unlock`, {
          treeId: selectedTreeId,
          nodeId: selectedNode.id
        });
        if (res.character && onUpdateCharacter) {
          await onUpdateCharacter(res.character);
        }
      } else {
        const newUnlocked = [...unlockedSkills, selectedNode.id];
        const newSpent = spentPoints + selectedNode.cout_points;
        await onUpdateCharacter({
          unlockedSkills: JSON.stringify(newUnlocked),
          skillPoints: newSpent,
        });
      }
    } catch (err) {
      console.error("Failed to unlock skill", err);
      setUnlockError(err?.message || "Échec du déblocage de la compétence");
    }
  };

  // --- Pan & Zoom Handlers ---
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const zoomSensitivity = 0.001;
    setZoom(z => Math.max(0.2, Math.min(3, z - e.deltaY * zoomSensitivity)));
  }, []);

  const handleMouseDown = (e) => {
    // Only drag if clicking canvas background, not on interactive node (M2)
    if (e.target.closest('.skill-node-group')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const svgEl = svgRef.current;
    if (svgEl) {
      svgEl.addEventListener('wheel', handleWheel, { passive: false });
      return () => svgEl.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  return (
    <div style={{
      position: embedded ? 'relative' : 'fixed',
      inset: embedded ? undefined : 0,
      height: embedded ? '650px' : '100%',
      width: '100%',
      background: 'rgba(10, 15, 25, 0.95)',
      borderRadius: embedded ? '12px' : 0,
      border: embedded ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
      overflow: 'hidden',
      display: 'flex',
      zIndex: embedded ? 1 : 9999,
      color: 'white',
      fontFamily: 'sans-serif'
    }}>
      {/* Sidebar - Tree Selection */}
      <div style={{
        width: 270, background: '#111827', borderRight: '1px solid #374151',
        display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ padding: 16, borderBottom: '1px solid #374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>Arbres de Talents</h2>
          {onClose && (
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}><X size={20} /></button>
          )}
        </div>
        
        <div style={{ padding: 16, borderBottom: '1px solid #374151', background: 'var(--paper-sunken)' }}>
          <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: 4 }}>Personnage (Niveau {character?.level || 1})</div>
          <div style={{ fontWeight: 'bold', color: '#60a5fa', fontSize: '1.1rem' }}>{character?.name}</div>
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, color: '#f59e0b', fontWeight: 'bold' }}>
            <Zap size={16} /> Points disponibles : {availablePoints}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 4 }}>
            Budget : 2 points / niveau (~28 max)
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '12px 16px 6px 16px', fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1 }}>Communs ({trees.filter(t => t.type === 'commun').length})</div>
          {trees.filter(t => t.type === 'commun').map(t => (
            <div key={t.id}
              onClick={() => setSelectedTreeId(t.id)}
              style={{
                padding: '10px 16px', cursor: 'pointer',
                background: selectedTreeId === t.id ? '#374151' : 'transparent',
                borderLeft: selectedTreeId === t.id ? '3px solid #60a5fa' : '3px solid transparent',
                fontSize: '0.9rem'
              }}
            >
              {t.nom}
            </div>
          ))}

          <div style={{ padding: '12px 16px 6px 16px', fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginTop: 12 }}>Spécialisation & Cités</div>
          {trees.filter(t => t.type === 'cache').map(t => (
            <div key={t.id}
              onClick={() => setSelectedTreeId(t.id)}
              style={{
                padding: '10px 16px', cursor: 'pointer',
                background: selectedTreeId === t.id ? '#374151' : 'transparent',
                borderLeft: selectedTreeId === t.id ? '3px solid #f59e0b' : '3px solid transparent',
                fontSize: '0.9rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Lock size={12} color="#f59e0b" />
                <span>{t.nom}</span>
              </div>
            </div>
          ))}

          {trees.some(t => t.type === 'brouillon') && (
            <>
              <div style={{ padding: '12px 16px 6px 16px', fontSize: '0.75rem', color: '#ef4444', textTransform: 'uppercase', letterSpacing: 1, marginTop: 12 }}>⚠️ Brouillons</div>
              {trees.filter(t => t.type === 'brouillon').map(t => (
                <div key={t.id}
                  onClick={() => setSelectedTreeId(t.id)}
                  style={{
                    padding: '10px 16px', cursor: 'pointer',
                    background: selectedTreeId === t.id ? '#374151' : 'transparent',
                    borderLeft: selectedTreeId === t.id ? '3px solid #ef4444' : '3px solid transparent',
                    opacity: 0.8, fontSize: '0.9rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertTriangle size={12} color="#ef4444" />
                    <span>{t.nom}</span>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Bestiaire Sidepanel (if companion tree) */}
          {currentTree?.bestiaire && (
            <div style={{ margin: 16, padding: 12, background: 'var(--success-tint-strong)', borderRadius: 8, border: '1px solid rgba(34, 197, 94, 0.3)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#4ade80', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                🐾 Bestiaire des Compagnons
              </div>
              {['palier_1', 'palier_2', 'palier_3'].map((pal, idx) => (
                <div key={pal} style={{ marginTop: 6 }}>
                  <div style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase' }}>Palier {idx + 1}</div>
                  {(currentTree.bestiaire[pal] || []).map(b => (
                    <div key={b.nom} style={{ fontSize: '0.75rem', color: '#e5e7eb', marginTop: 2 }}>
                      • <strong>{b.nom}</strong> ({b.pv} PV, {b.atq})
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Canvas */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#030712' }}>
        {currentTree ? (
          <svg
            ref={svgRef}
            style={{ width: '100%', height: '100%', cursor: isDragging ? 'grabbing' : 'grab' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <defs>
              <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="node-unlocked" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
              </radialGradient>
              <marker id="arrow-active" viewBox="0 0 10 10" refX="32" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#34d399" />
              </marker>
              <marker id="arrow-available" viewBox="0 0 10 10" refX="32" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa" />
              </marker>
              <marker id="arrow-locked" viewBox="0 0 10 10" refX="32" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#374151" />
              </marker>
            </defs>

            <g transform={`translate(${pan.x + window.innerWidth / 2 - 135}, ${pan.y + window.innerHeight / 2 - 50}) scale(${zoom})`}>
              {/* Draw Lines (Edges) */}
              {nodes.map(node => {
                return (node.prerequis || []).map(reqId => {
                  const reqNode = nodeMap.get(reqId);
                  if (!reqNode) return null;
                  
                  const isLineActive = isUnlocked(node.id) && isUnlocked(reqNode.id);
                  const isLineAvailable = canUnlock(node) && isUnlocked(reqNode.id);

                  const SPACING = 2.0;
                  return (
                    <line
                      key={`${reqId}-${node.id}`}
                      x1={(reqNode.position?.x || 0) * SPACING}
                      y1={(reqNode.position?.y || 0) * -SPACING} // Invert Y so positive is up
                      x2={(node.position?.x || 0) * SPACING}
                      y2={(node.position?.y || 0) * -SPACING}
                      stroke={isLineActive ? '#34d399' : isLineAvailable ? '#60a5fa' : '#374151'}
                      strokeWidth={isLineActive ? 4 : 2}
                      strokeDasharray={(!isLineActive && !isLineAvailable) ? "5,5" : "none"}
                      markerEnd={isLineActive ? "url(#arrow-active)" : isLineAvailable ? "url(#arrow-available)" : "url(#arrow-locked)"}
                    />
                  );
                });
              })}

              {/* Draw Nodes */}
              {nodes.map(node => {
                const nx = (node.position?.x || 0) * SPACING;
                const ny = (node.position?.y || 0) * -SPACING;
                const unlocked = isUnlocked(node.id);
                const available = canUnlock(node);
                const selected = selectedNode?.id === node.id;
                
                const tierColor = TIER_COLORS[node.tier] || '#fff';
                
                return (
                  <g key={node.id} className="skill-node-group" transform={`translate(${nx}, ${ny})`} onClick={() => { setSelectedNode(node); setUnlockError(null); }} style={{ cursor: 'pointer' }}>
                    {/* Glow for available/unlocked */}
                    {(available || unlocked) && (
                      <circle r={45} fill={`url(#${unlocked ? 'node-unlocked' : 'node-glow'})`} />
                    )}
                    
                    {/* Diamond for Active, Circle for Passive */}
                    {node.type === 'actif' ? (
                      <polygon 
                        points="0,-24 24,0 0,24 -24,0" 
                        fill={unlocked ? tierColor : '#1f2937'} 
                        stroke={selected ? '#fff' : unlocked ? '#fff' : available ? tierColor : '#4b5563'}
                        strokeWidth={selected ? 4 : 2}
                      />
                    ) : (
                      <circle 
                        r={22} 
                        fill={unlocked ? tierColor : '#1f2937'} 
                        stroke={selected ? '#fff' : unlocked ? '#fff' : available ? tierColor : '#4b5563'}
                        strokeWidth={selected ? 4 : 2}
                      />
                    )}
                    
                    {/* Node Label */}
                    <text y={45} textAnchor="middle" fill={unlocked ? '#fff' : '#9ca3af'} fontSize="13" fontWeight={unlocked ? 'bold' : 'normal'} style={{ pointerEvents: 'none', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                      {node.nom}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6b7280' }}>
            Sélectionnez un arbre de compétences
          </div>
        )}

        {/* Floating Title & Badges */}
        {currentTree && (
          <div style={{ position: 'absolute', top: 24, left: 24, pointerEvents: 'none' }}>
            <h1 style={{ margin: 0, fontSize: '2rem', color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{currentTree.nom}</h1>
            <p style={{ margin: '6px 0 0 0', color: '#9ca3af', maxWidth: 450, textShadow: '0 2px 4px rgba(0,0,0,0.8)', fontSize: '0.9rem' }}>{currentTree.description}</p>
            
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              {currentTree.attributs?.map(attr => (
                <span key={attr} style={{ padding: '2px 8px', borderRadius: 4, background: 'var(--primary-tint-strong)', color: '#a5b4fc', fontSize: '0.75rem', border: '1px solid rgba(99,102,241,0.4)', fontWeight: 'bold' }}>
                  🧠 {attr}
                </span>
              ))}
              {currentTree.classe_5e_ref && (
                <span style={{ padding: '2px 8px', borderRadius: 4, background: 'var(--warning-tint-strong)', color: '#fbbf24', fontSize: '0.75rem', border: '1px solid rgba(245,158,11,0.4)', fontWeight: 'bold' }}>
                  📖 5e: {currentTree.classe_5e_ref}
                </span>
              )}
              {currentTree.monnaie === 'faveur' && (
                <span style={{ padding: '2px 8px', borderRadius: 4, background: 'var(--arcane-tint-strong)', color: '#c084fc', fontSize: '0.75rem', border: '1px solid rgba(168,85,247,0.4)', fontWeight: 'bold' }}>
                  💎 Monnaie: Faveur
                </span>
              )}
            </div>

            {currentTree.ressource_propre && (
              <div style={{ marginTop: 8, padding: '4px 10px', borderRadius: 6, background: 'var(--arcane-tint-strong)', color: '#e9d5ff', fontSize: '0.8rem', border: '1px solid rgba(168,85,247,0.3)', maxWidth: 450 }}>
                ✨ <strong>{currentTree.ressource_propre.nom}</strong> — {currentTree.ressource_propre.description}
              </div>
            )}
          </div>
        )}

        {/* Node Details Panel */}
        {selectedNode && (
          <div style={{
            position: 'absolute', right: 24, top: 24, width: 340,
            background: 'rgba(17, 24, 39, 0.95)', border: '1px solid #374151',
            borderRadius: 12, padding: 20, backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
            maxHeight: 'calc(100vh - 48px)', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: TIER_COLORS[selectedNode.tier] || '#9ca3af', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: 1 }}>
                  Tier {selectedNode.tier} • {selectedNode.type}
                </div>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '1.2rem', color: '#fff' }}>{selectedNode.nom}</h3>
              </div>
              <button onClick={() => { setSelectedNode(null); setUnlockError(null); }} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}><X size={16} /></button>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#d1d5db', lineHeight: 1.5, margin: '0 0 16px 0' }}>
              {selectedNode.description}
            </p>

            <div style={{ background: 'var(--paper-sunken)', padding: 12, borderRadius: 8, marginBottom: 16 }}>
              <strong style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: 4, textTransform: 'uppercase' }}>EFFET</strong>
              <div style={{ fontSize: '0.9rem', color: '#34d399' }}>{selectedNode.effet?.resume}</div>
              
              {selectedNode.effet?.cout_ressource && (
                <div style={{ marginTop: 8, fontSize: '0.8rem', color: '#f87171', fontWeight: 'bold' }}>
                  Coût : {selectedNode.effet.cout_ressource.quantite} {selectedNode.effet.cout_ressource.type}
                </div>
              )}
              {selectedNode.effet?.cooldown_tours > 0 && (
                <div style={{ marginTop: 4, fontSize: '0.8rem', color: '#60a5fa' }}>
                  Recharge : {selectedNode.effet.cooldown_tours} tours
                </div>
              )}
            </div>

            {/* Contrepartie Section */}
            {selectedNode.contrepartie && (
              <div style={{
                background: selectedNode.contrepartie_type === 'severe' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                padding: 12, borderRadius: 8, marginBottom: 16,
                border: `1px solid ${selectedNode.contrepartie_type === 'severe' ? '#ef4444' : '#f59e0b'}`
              }}>
                <strong style={{ display: 'block', fontSize: '0.75rem', color: selectedNode.contrepartie_type === 'severe' ? '#fca5a5' : '#fde68a', marginBottom: 4, textTransform: 'uppercase' }}>
                  {selectedNode.contrepartie_type === 'severe' ? '⚠️ Contrepartie Sévère (Exténuation)' : '⚡ Contrepartie Légère'}
                </strong>
                <div style={{ fontSize: '0.85rem', color: '#fef3c7', lineHeight: 1.4 }}>{selectedNode.contrepartie}</div>
                {selectedNode.extenuation_niveaux > 0 && (
                  <div style={{ marginTop: 6, fontSize: '0.8rem', color: '#f87171', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Skull size={14} /> +{selectedNode.extenuation_niveaux} niveau(x) d'Exténuation D&D 5e
                  </div>
                )}
              </div>
            )}

            {/* Prerequisites */}
            {selectedNode.prerequis?.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <strong style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: 4, textTransform: 'uppercase' }}>
                  PRÉREQUIS ({selectedNode.prerequis_logique === 'et' ? 'TOUS REQUIS' : 'AU MOINS UN'})
                </strong>
                <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.85rem', color: '#d1d5db' }}>
                  {selectedNode.prerequis.map(reqId => {
                    const req = allNodeMap.get(reqId) || nodeMap.get(reqId);
                    const isReqUnlocked = isUnlocked(reqId);
                    return (
                      <li key={reqId} style={{ color: isReqUnlocked ? '#34d399' : '#ef4444' }}>
                        {req ? req.nom : reqId} {isReqUnlocked ? '✓' : '✗'}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Unlock Error Toast */}
            {unlockError && (
              <div style={{ background: 'var(--danger-tint-strong)', border: '1px solid #ef4444', color: '#fca5a5', padding: '8px 12px', borderRadius: 6, fontSize: '0.8rem', marginBottom: 12 }}>
                ⚠️ {unlockError}
              </div>
            )}

            {/* Unlock Button */}
            <div style={{ borderTop: '1px solid #374151', paddingTop: 16, marginTop: 16 }}>
              {isUnlocked(selectedNode.id) ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#34d399', fontWeight: 'bold', justifyContent: 'center' }}>
                  <Unlock size={18} /> Compétence Acquise
                </div>
              ) : (
                <button
                  onClick={handleUnlock}
                  disabled={!canUnlock(selectedNode)}
                  style={{
                    width: '100%', padding: '10px', borderRadius: 8, border: 'none',
                    background: canUnlock(selectedNode) ? '#60a5fa' : '#374151',
                    color: canUnlock(selectedNode) ? '#fff' : '#9ca3af',
                    fontWeight: 'bold', cursor: canUnlock(selectedNode) ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'background 0.2s'
                  }}
                >
                  <Zap size={16} /> Débloquer ({selectedNode.cout_points} {currentTree?.monnaie === 'faveur' ? 'Faveur' : 'PC'})
                </button>
              )}
              
              {!isUnlocked(selectedNode.id) && availablePoints < selectedNode.cout_points && (
                <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#ef4444', marginTop: 8 }}>
                  Points insuffisants
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

