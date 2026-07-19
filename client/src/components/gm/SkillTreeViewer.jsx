import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import { Lock, Unlock, Zap, ChevronLeft, ChevronRight, X, Plus, Minus } from 'lucide-react';

const TIER_COLORS = {
  1: '#9ca3af', // gray-400
  2: '#34d399', // emerald-400
  3: '#60a5fa', // blue-400
  4: '#c084fc', // purple-400
  5: '#f59e0b', // amber-400
};

export default function SkillTreeViewer({ campaignId, character, onUpdateCharacter, onClose, isGm }) {
  const [trees, setTrees] = useState([]);
  const [selectedTreeId, setSelectedTreeId] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  
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
  const availablePoints = (character?.level || 1) - spentPoints;

  const currentTree = trees.find(t => t.id === selectedTreeId);
  const nodes = currentTree ? currentTree.branches.flatMap(b => b.noeuds) : [];

  // Flatten nodes for easy lookup
  const nodeMap = new Map();
  nodes.forEach(n => nodeMap.set(n.id, n));

  const isUnlocked = (nodeId) => unlockedSkills.includes(nodeId);
  const canUnlock = (node) => {
    if (isUnlocked(node.id)) return false;
    if (availablePoints < node.cout_points) return false;
    if (!node.prerequis || node.prerequis.length === 0) return true; // root node
    // Needs at least ONE prerequisite unlocked
    return node.prerequis.some(reqId => isUnlocked(reqId));
  };

  const handleUnlock = async () => {
    if (!selectedNode || !canUnlock(selectedNode)) return;
    
    const newUnlocked = [...unlockedSkills, selectedNode.id];
    const newSpent = spentPoints + selectedNode.cout_points;

    try {
      await onUpdateCharacter({
        unlockedSkills: JSON.stringify(newUnlocked),
        skillPoints: newSpent,
      });
      // The parent will re-render and update `character` props
    } catch (err) {
      console.error("Failed to unlock skill", err);
    }
  };

  // --- Pan & Zoom Handlers ---
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomSensitivity = 0.001;
    setZoom(z => Math.max(0.2, Math.min(3, z - e.deltaY * zoomSensitivity)));
  };

  const handleMouseDown = (e) => {
    if (e.target.tagName !== 'svg') return; // Only drag on background
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
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
      display: 'flex', zIndex: 9999, color: 'white', fontFamily: 'sans-serif'
    }}>
      {/* Sidebar - Tree Selection */}
      <div style={{
        width: 250, background: '#111827', borderRight: '1px solid #374151',
        display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ padding: 16, borderBottom: '1px solid #374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>Arbres de Compétences</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        
        <div style={{ padding: 16, borderBottom: '1px solid #374151', background: '#1f2937' }}>
          <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: 4 }}>Personnage</div>
          <div style={{ fontWeight: 'bold', color: '#60a5fa' }}>{character?.name}</div>
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, color: '#f59e0b', fontWeight: 'bold' }}>
            <Zap size={16} /> Points disponibles : {availablePoints}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1 }}>Communs</div>
          {trees.filter(t => t.type === 'commun').map(t => (
            <div key={t.id}
              onClick={() => setSelectedTreeId(t.id)}
              style={{
                padding: '10px 16px', cursor: 'pointer',
                background: selectedTreeId === t.id ? '#374151' : 'transparent',
                borderLeft: selectedTreeId === t.id ? '3px solid #60a5fa' : '3px solid transparent',
              }}
            >
              {t.nom}
            </div>
          ))}

          <div style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginTop: 12 }}>Spécialisation</div>
          {trees.filter(t => t.type === 'cache').map(t => (
            <div key={t.id}
              onClick={() => setSelectedTreeId(t.id)}
              style={{
                padding: '10px 16px', cursor: 'pointer',
                background: selectedTreeId === t.id ? '#374151' : 'transparent',
                borderLeft: selectedTreeId === t.id ? '3px solid #f59e0b' : '3px solid transparent',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Lock size={12} color="#9ca3af" />
                <span>{t.nom}</span>
              </div>
            </div>
          ))}
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

            <g transform={`translate(${pan.x + window.innerWidth / 2 - 125}, ${pan.y + window.innerHeight / 2}) scale(${zoom})`}>
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
                const SPACING = 2.0;
                const nx = (node.position?.x || 0) * SPACING;
                const ny = (node.position?.y || 0) * -SPACING;
                const unlocked = isUnlocked(node.id);
                const available = canUnlock(node);
                const selected = selectedNode?.id === node.id;
                
                const tierColor = TIER_COLORS[node.tier] || '#fff';
                
                return (
                  <g key={node.id} transform={`translate(${nx}, ${ny})`} onClick={() => setSelectedNode(node)} style={{ cursor: 'pointer' }}>
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
                    <text y={45} textAnchor="middle" fill={unlocked ? '#fff' : '#9ca3af'} fontSize="14" fontWeight={unlocked ? 'bold' : 'normal'} style={{ pointerEvents: 'none', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
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

        {/* Floating Title */}
        {currentTree && (
          <div style={{ position: 'absolute', top: 24, left: 24, pointerEvents: 'none' }}>
            <h1 style={{ margin: 0, fontSize: '2rem', color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{currentTree.nom}</h1>
            <p style={{ margin: '8px 0 0 0', color: '#9ca3af', maxWidth: 400, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>{currentTree.description}</p>
          </div>
        )}

        {/* Node Details Panel */}
        {selectedNode && (
          <div style={{
            position: 'absolute', right: 24, top: 24, width: 320,
            background: 'rgba(17, 24, 39, 0.95)', border: '1px solid #374151',
            borderRadius: 12, padding: 20, backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: TIER_COLORS[selectedNode.tier] || '#9ca3af', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: 1 }}>
                  Tier {selectedNode.tier} • {selectedNode.type}
                </div>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '1.2rem', color: '#fff' }}>{selectedNode.nom}</h3>
              </div>
              <button onClick={() => setSelectedNode(null)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}><X size={16} /></button>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#d1d5db', lineHeight: 1.5, margin: '0 0 16px 0' }}>
              {selectedNode.description}
            </p>

            <div style={{ background: '#1f2937', padding: 12, borderRadius: 8, marginBottom: 16 }}>
              <strong style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: 4 }}>EFFET</strong>
              <div style={{ fontSize: '0.9rem', color: '#34d399' }}>{selectedNode.effet?.resume}</div>
              
              {selectedNode.effet?.cout_ressource && (
                <div style={{ marginTop: 8, fontSize: '0.8rem', color: '#f87171' }}>
                  Coût : {selectedNode.effet.cout_ressource.quantite} {selectedNode.effet.cout_ressource.type}
                </div>
              )}
              {selectedNode.effet?.cooldown_tours > 0 && (
                <div style={{ marginTop: 4, fontSize: '0.8rem', color: '#60a5fa' }}>
                  Recharge : {selectedNode.effet.cooldown_tours} tours
                </div>
              )}
            </div>

            {/* Prerequisites */}
            {selectedNode.prerequis?.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <strong style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: 4 }}>PRÉREQUIS</strong>
                <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.85rem', color: '#d1d5db' }}>
                  {selectedNode.prerequis.map(reqId => {
                    const req = nodeMap.get(reqId);
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
                  <Zap size={16} /> Débloquer ({selectedNode.cout_points} PC)
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
