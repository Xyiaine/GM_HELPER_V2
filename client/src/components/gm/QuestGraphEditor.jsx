import React, { useState, useCallback, useEffect } from 'react';
import { useGmStore } from '../../store/gmStore';
import api from '../../utils/api';
import socket from '../../utils/socket';
import ReactFlow, { 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Radio, Eye, Flag, Clock, X } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import NpcVoiceProfileCard from './NpcVoiceProfileCard';
import CaptainNominationPanel from './CaptainNominationPanel';

export default function QuestGraphEditor({ quest, campaignId, viewMode = 'gm' }) {
  const navigate = useNavigate();
  const { 
    createQuestNode, updateQuestNode, deleteQuestNode, 
    createQuestNodeConnection, deleteQuestNodeConnection, 
    updateQuestNodeConnection, reachQuestNode, unreachQuestNode, startNodeTimer,
    spawnEncounterFromNode,
    npcs, locations, encounters,
    fetchNpcs, fetchLocations, fetchEncounters
  } = useGmStore();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [edgeLabelInput, setEdgeLabelInput] = useState('');
  const [hideResolved, setHideResolved] = useState(false);
  const [timers, setTimers] = useState([]);

  useEffect(() => {
    if (selectedEdge) {
      setEdgeLabelInput(selectedEdge.label || '');
    }
  }, [selectedEdge]);

  useEffect(() => {
    const handleTimerStart = (data) => {
      setTimers(prev => [...prev.filter(t => t.nodeId !== data.nodeId), { ...data, remaining: data.duration }]);
    };
    const handleTimerClear = (data) => {
      setTimers(prev => prev.filter(t => t.nodeId !== data.nodeId));
    };
    socket.on('quest_node_timer_started', handleTimerStart);
    socket.on('quest_node_timer_cleared', handleTimerClear);
    return () => {
      socket.off('quest_node_timer_started', handleTimerStart);
      socket.off('quest_node_timer_cleared', handleTimerClear);
    };
  }, []);

  useEffect(() => {
    if (timers.length === 0) return;
    const interval = setInterval(() => {
      setTimers(current => 
        current.map(t => {
          const remaining = Math.max(0, Math.floor((new Date(t.expiresAt).getTime() - Date.now()) / 1000));
          return { ...t, remaining };
        }).filter(t => t.remaining > 0)
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [timers.length]);

  useEffect(() => {
    if (campaignId) {
      if (!npcs || npcs.length === 0) fetchNpcs(campaignId);
      if (!locations || locations.length === 0) fetchLocations(campaignId);
      if (!encounters || encounters.length === 0) fetchEncounters(campaignId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId, fetchNpcs, fetchLocations, fetchEncounters]);

  const updateLocalNode = useCallback((updatedNode) => {
    setNodes(nds => nds.map(n => {
      if (n.id === updatedNode.id) {
        return {
          ...n,
          data: { 
            ...n.data, 
            status: updatedNode.status, 
            node: updatedNode,
            label: (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexDirection: 'column' }}>
                <div style={{ fontSize: '0.8rem', opacity: 0.8, color: '#ccc' }}>
                  {updatedNode.nodeType === 'start' && '🚩 Départ'}
                  {updatedNode.nodeType === 'end' && '🏁 Fin'}
                  {updatedNode.nodeType === 'convergence' && '🔗 Conv.'}
                  {updatedNode.nodeType === 'intermediate' && '➡️ Intérm.'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {updatedNode.isTimed && <Clock size={14} color="#ef4444" />}
                  {updatedNode.title}
                </div>
              </div>
            )
          },
          style: { ...n.style, background: updatedNode.status === 'reached' ? '#10b981' : '#1e1e1e' }
        };
      }
      return n;
    }));
    setSelectedNode(updatedNode);
  }, [setNodes]);

  useEffect(() => {
    if (quest && quest.nodes) {
      const initialNodes = quest.nodes.map(n => ({
        id: n.id,
        position: { x: n.positionX || 0, y: n.positionY || 0 },
        hidden: hideResolved && n.status === 'reached',
        data: { 
          label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexDirection: 'column' }}>
              <div style={{ fontSize: '0.8rem', opacity: 0.8, color: '#ccc' }}>
                {n.nodeType === 'start' && '🚩 Départ'}
                {n.nodeType === 'end' && '🏁 Fin'}
                {n.nodeType === 'convergence' && '🔗 Conv.'}
                {n.nodeType === 'intermediate' && '➡️ Intérm.'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {n.isTimed && <Clock size={14} color="#ef4444" />}
                {n.title}
              </div>
              {timers.find(t => t.nodeId === n.id) && (
                <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '0.9rem', marginTop: '4px', animation: timers.find(t => t.nodeId === n.id).remaining < 30 ? 'pulse 1s infinite' : 'none' }}>
                  ⏳ {Math.floor(timers.find(t => t.nodeId === n.id).remaining / 60)}:{(timers.find(t => t.nodeId === n.id).remaining % 60).toString().padStart(2, '0')}
                </div>
              )}
            </div>
          ),
          type: n.nodeType,
          status: n.status,
          node: n,
        },
        style: {
          background: n.status === 'reached' ? '#10b981' : '#1e1e1e',
          color: '#fff',
          border: '1px solid #333',
          borderRadius: '5px',
          padding: '10px',
        }
      }));

      const initialEdges = [];
      quest.nodes.forEach(n => {
        n.connectionsFrom.forEach(c => {
          initialEdges.push({
            id: c.id,
            source: c.fromNodeId,
            target: c.toNodeId,
            label: c.label,
            animated: c.isTimeoutConnection,
            data: { connection: c },
            style: { stroke: c.isTimeoutConnection ? '#ef4444' : '#fff' },
            markerEnd: { type: MarkerType.ArrowClosed, color: c.isTimeoutConnection ? '#ef4444' : '#fff' },
          });
        });
      });

      setNodes(initialNodes);
      setEdges(initialEdges);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quest?.id, hideResolved]); // Removed timers and quest from deps to avoid overwriting new nodes

  // Separate effect to update timer displays without overwriting the entire node object
  useEffect(() => {
    if (timers.length === 0) return;
    setNodes(nds => nds.map(n => {
      const timer = timers.find(t => t.nodeId === n.id);
      if (!timer) return n;
      
      return {
        ...n,
        data: {
          ...n.data,
          label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexDirection: 'column' }}>
              <div style={{ fontSize: '0.8rem', opacity: 0.8, color: '#ccc' }}>
                {n.data.node?.nodeType === 'start' && '🚩 Départ'}
                {n.data.node?.nodeType === 'end' && '🏁 Fin'}
                {n.data.node?.nodeType === 'convergence' && '🔗 Conv.'}
                {n.data.node?.nodeType === 'intermediate' && '➡️ Intérm.'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {n.data.node?.isTimed && <Clock size={14} color="#ef4444" />}
                {n.data.node?.displayCode && <span style={{ padding: '2px 4px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', fontSize: '0.7rem' }}>{n.data.node.displayCode}</span>}
                {n.data.node?.isOptional && <span style={{ padding: '2px 4px', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', borderRadius: '3px', fontSize: '0.7rem' }}>Optionnel</span>}
                {n.data.node?.title || n.data.label}
              </div>
              {n.data.node?.pathGroup && (
                <div style={{ fontSize: '0.7rem', color: '#a78bfa', marginTop: '2px' }}>
                  {n.data.node.pathGroup}
                </div>
              )}
              <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '0.9rem', marginTop: '4px', animation: timer.remaining < 30 ? 'pulse 1s infinite' : 'none' }}>
                ⏳ {Math.floor(timer.remaining / 60)}:{(timer.remaining % 60).toString().padStart(2, '0')}
              </div>
            </div>
          )
        }
      };
    }));
  }, [timers, setNodes]);

  const onConnect = useCallback(async (params) => {
    try {
      const conn = await createQuestNodeConnection(campaignId, quest.id, params.source, {
        fromNodeId: params.source,
        toNodeId: params.target,
        label: ''
      });
      setEdges((eds) => addEdge({
        id: conn.id,
        source: conn.fromNodeId,
        target: conn.toNodeId,
        label: conn.label,
        data: { connection: conn },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#fff' }
      }, eds));
    } catch (err) {
      console.error(err);
    }
  }, [campaignId, quest.id, createQuestNodeConnection, setEdges]);

  const onNodeDragStop = useCallback(async (event, node) => {
    try {
      await updateQuestNode(campaignId, quest.id, node.id, {
        positionX: node.position.x,
        positionY: node.position.y
      });
    } catch (err) {
      console.error(err);
    }
  }, [campaignId, quest.id, updateQuestNode]);

  const handleAddNode = async () => {
    try {
      const node = await createQuestNode(campaignId, quest.id, {
        title: 'New Node',
        nodeType: 'intermediate',
        positionX: 100,
        positionY: 100,
        isOptional: false,
      });
      setNodes(nds => [...nds, {
        id: node.id,
        position: { x: node.positionX, y: node.positionY },
        data: { label: node.title, type: node.nodeType, status: node.status, node },
        style: { background: '#1e1e1e', color: '#fff', border: '1px solid #333', borderRadius: '5px', padding: '10px' }
      }]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDragStop={onNodeDragStop}
          onNodeClick={(e, node) => { setSelectedNode(node.data.node); setSelectedEdge(null); }}
          onEdgeClick={(e, edge) => { setSelectedEdge(edge.data.connection); setSelectedNode(null); }}
          fitView
          theme="dark"
        >
          <Controls />
          <MiniMap nodeStrokeWidth={3} />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
        <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 4, display: 'flex', gap: '8px' }}>
          <button 
            onClick={handleAddNode}
            className="btn-primary" 
          >
            + Add Node
          </button>
          <button 
            onClick={() => setHideResolved(!hideResolved)}
            className="btn-secondary" 
            style={{ display: 'flex', gap: '4px', alignItems: 'center' }}
          >
            <Eye size={16} /> {hideResolved ? 'Afficher' : 'Masquer'} Nœuds Résolus
          </button>
        </div>
      </div>

      {selectedEdge && !selectedNode && (
        <div style={{ flex: '2', backgroundColor: 'var(--color-surface)', borderLeft: '1px solid var(--color-border)', padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 10, boxShadow: '-4px 0 15px rgba(0,0,0,0.5)' }}>
          <header style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ marginTop: 0, marginBottom: '8px', color: 'var(--color-text)' }}>Éditer Connexion</h3>
            </div>
            <button onClick={() => setSelectedEdge(null)} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </header>
          <div className="form-group">
            <label>Label</label>
            <input 
              type="text" 
              className="form-control"
              value={edgeLabelInput} 
              onChange={(e) => setEdgeLabelInput(e.target.value)}
              onBlur={async () => {
                if (!selectedEdge || edgeLabelInput === selectedEdge.label) return;
                const newLabel = edgeLabelInput;
                setSelectedEdge(prev => prev ? { ...prev, label: newLabel } : null);
                try {
                  await updateQuestNodeConnection(campaignId, quest.id, selectedEdge.fromNodeId, selectedEdge.id, { label: newLabel });
                  setEdges(eds => eds.map(edge => {
                    if (edge.id === selectedEdge.id) {
                      return { ...edge, label: newLabel, data: { ...edge.data, connection: { ...edge.data.connection, label: newLabel } } };
                    }
                    return edge;
                  }));
                } catch (err) {
                  console.error(err);
                }
              }}
              placeholder="Label de la connexion..."
            />
          </div>
          <button onClick={async () => {
            if (window.confirm('Supprimer cette connexion ?')) {
              try {
                await deleteQuestNodeConnection(campaignId, quest.id, selectedEdge.fromNodeId, selectedEdge.id);
                setEdges(eds => eds.filter(e => e.id !== selectedEdge.id));
                setSelectedEdge(null);
              } catch (err) {
                console.error(err);
              }
            }
          }} className="btn-secondary" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
            Supprimer la connexion
          </button>
        </div>
      )}

      {selectedNode && (
        <div key={selectedNode.id} style={{ flex: '2', backgroundColor: 'var(--color-surface)', borderLeft: '1px solid var(--color-border)', padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 10, boxShadow: '-4px 0 15px rgba(0,0,0,0.5)' }}>
          <header style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ marginTop: 0, marginBottom: '8px', color: 'var(--color-text)' }}>Étape : {selectedNode.title}</h3>
              <span style={{ fontSize: '0.85rem', color: selectedNode.status === 'reached' ? '#10b981' : 'var(--color-text-muted)' }}>
                Statut : {selectedNode.status === 'reached' ? 'Atteint' : 'Non atteint'}
              </span>
            </div>
            <button onClick={() => setSelectedNode(null)} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </header>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--color-primary-light)' }}>Titre du Nœud</span>
              <input 
                type="text" 
                defaultValue={selectedNode.title} 
                onBlur={e => updateQuestNode(campaignId, quest.id, selectedNode.id, { title: e.target.value })}
                className="editable-input"
                style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', color: '#fff', padding: '8px', borderRadius: '4px' }}
              />
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: 'bold' }}>Code d'affichage</span>
                <input type="text" defaultValue={selectedNode.displayCode || ''} onBlur={e => updateQuestNode(campaignId, quest.id, selectedNode.id, { displayCode: e.target.value })} style={{ padding: '8px', background: 'rgba(0,0,0,0.2)', color: '#fff', border: '1px solid var(--color-border)', borderRadius: '4px' }} placeholder="Ex: 0.a, 2A.e" />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: 'bold' }}>Groupe de chemin</span>
                <input type="text" defaultValue={selectedNode.pathGroup || ''} onBlur={e => updateQuestNode(campaignId, quest.id, selectedNode.id, { pathGroup: e.target.value })} style={{ padding: '8px', background: 'rgba(0,0,0,0.2)', color: '#fff', border: '1px solid var(--color-border)', borderRadius: '4px' }} placeholder="Ex: Alternative A" />
              </label>
              <label style={{ display: 'flex', gap: '8px', alignItems: 'center', height: '100%', paddingTop: '20px' }}>
                <input type="checkbox" defaultChecked={selectedNode.isOptional} onChange={e => updateQuestNode(campaignId, quest.id, selectedNode.id, { isOptional: e.target.checked })} />
                Optionnel ?
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: 'bold' }}>Rythme (Pacing)</span>
                <select defaultValue={selectedNode.pacingTag || ''} onChange={e => updateQuestNode(campaignId, quest.id, selectedNode.id, { pacingTag: e.target.value })} style={{ padding: '8px', background: 'rgba(0,0,0,0.2)', color: '#fff', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                  <option value="">Aucun</option>
                  <option value="climax">Climax</option>
                  <option value="respiration">Respiration</option>
                  <option value="transition">Transition</option>
                  <option value="filler">Filler</option>
                </select>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: 'bold' }}>Compétence (Skill)</span>
                <input type="text" defaultValue={selectedNode.requiredSkillCategory || ''} onBlur={e => updateQuestNode(campaignId, quest.id, selectedNode.id, { requiredSkillCategory: e.target.value })} style={{ padding: '8px', background: 'rgba(0,0,0,0.2)', color: '#fff', border: '1px solid var(--color-border)', borderRadius: '4px' }} placeholder="Ex: Perception" />
              </label>
            </div>

            {/* Illustration projetée sur l'écran de table */}
            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontWeight: 'bold' }}>Illustration de scène</span>
              <input
                type="text"
                defaultValue={selectedNode.imageUrl || ''}
                onBlur={e => updateQuestNode(campaignId, quest.id, selectedNode.id, { imageUrl: e.target.value || null })}
                style={{ padding: '8px', background: 'rgba(0,0,0,0.2)', color: '#fff', border: '1px solid var(--color-border)', borderRadius: '4px' }}
                placeholder="URL de l'image projetée sur l'écran de table"
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                Affichée sur la télévision dès que ce nœud devient la scène courante. À défaut, l'image de la quête sert de repli.
              </span>
            </label>

            {/* MJ Description — GM Mode Only (FE-1) */}
            {viewMode === 'gm' ? (
              <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontWeight: 'bold', color: 'var(--warning, #f59e0b)' }}>Éléments Scénaristiques (Notes MJ)</span>
                <textarea 
                  defaultValue={selectedNode.mjDescription || ''} 
                  onBlur={e => updateQuestNode(campaignId, quest.id, selectedNode.id, { mjDescription: e.target.value })}
                  placeholder="Décrivez ce qui se passe ici pour le MJ (PNJ présents, dialogues, indices...)"
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', color: '#fff', border: '1px solid var(--warning, #f59e0b)', borderRadius: '4px', fontSize: '1rem', lineHeight: '1.4' }}
                  rows={6}
                />
              </label>
            ) : (
              <div style={{ padding: '10px', backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--warning)', borderRadius: '4px', fontSize: '0.85rem', color: '#fcd34d' }}>
                🔒 <strong>Notes MJ :</strong> Masquées en mode écran joueurs
              </div>
            )}

            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontWeight: 'bold', color: '#10b981' }}>Description Sensorielle (Ce que voient les joueurs)</span>
              <textarea 
                defaultValue={selectedNode.sensoryText || ''} 
                onBlur={e => updateQuestNode(campaignId, quest.id, selectedNode.id, { sensoryText: e.target.value })}
                placeholder="Décrivez les éléments visuels, sonores, odeurs..."
                style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', color: '#fff', border: '1px solid #10b981', borderRadius: '4px', fontSize: '1rem', lineHeight: '1.4' }}
                rows={8}
                readOnly={viewMode === 'player'}
              />

              <button 
                className="btn-secondary"
                style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderColor: '#10b981', color: '#10b981' }}
                onClick={async () => {
                  try {
                    await api.post(`/api/v1/gm/campaigns/${campaignId}/spotlight`, {
                      contentType: 'banner',
                      text: selectedNode.sensoryText
                    });
                  } catch(e) {
                    console.error("Failed to broadcast spotlight", e);
                  }
                }}
              >
                <Radio size={16} /> Diffuser au Spotlight
              </button>
            </label>

            {/* Detection Mechanic — GM Mode Only (FE-1) */}
            {viewMode === 'gm' && (
              <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontWeight: 'bold', color: '#8b5cf6' }}>Mécanique d'Indice (Detection Mechanic - JSON)</span>
                <textarea 
                  defaultValue={selectedNode.detectionMechanic || ''} 
                  onBlur={e => updateQuestNode(campaignId, quest.id, selectedNode.id, { detectionMechanic: e.target.value })}
                  placeholder='{"indiceText": "...", "jetSkill": "Perception", ...}'
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', color: '#fff', border: '1px solid #8b5cf6', borderRadius: '4px', fontSize: '0.9rem', fontFamily: 'monospace' }}
                  rows={3}
                />
              </label>
            )}

            {/* FE-8: Captain Nomination Interactive Panel */}
            {selectedNode.captainSelection && (
              <CaptainNominationPanel captainData={selectedNode.captainSelection} />
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: 'bold' }}>Type</span>
                <select 
                  defaultValue={selectedNode.nodeType}
                  onChange={e => updateQuestNode(campaignId, quest.id, selectedNode.id, { nodeType: e.target.value })}
                  style={{ padding: '8px', background: 'rgba(0,0,0,0.2)', color: '#fff', border: '1px solid var(--color-border)', borderRadius: '4px' }}
                >
                  <option value="start">Départ</option>
                  <option value="intermediate">Intermédiaire</option>
                  <option value="convergence">Convergence</option>
                  <option value="end">Fin</option>
                </select>
              </label>

              <label style={{ display: 'flex', gap: '8px', alignItems: 'center', height: '100%', paddingTop: '20px' }}>
                <input 
                  type="checkbox" 
                  defaultChecked={selectedNode.isTimed}
                  onChange={e => updateQuestNode(campaignId, quest.id, selectedNode.id, { isTimed: e.target.checked })}
                />
                Minuté ?
              </label>
            </div>
            {selectedNode.isTimed && (
              <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: 'bold' }}>Durée (secondes)</span>
                <input 
                  type="number" 
                  defaultValue={selectedNode.timerDurationSeconds || 0}
                  onBlur={e => updateQuestNode(campaignId, quest.id, selectedNode.id, { timerDurationSeconds: parseInt(e.target.value) })}
                  style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.2)', color: '#fff', border: '1px solid var(--color-border)', borderRadius: '4px' }}
                />
              </label>
            )}

            {selectedNode.isTimed && (
              <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: 'bold' }}>Nœud de conséquence (Timeout)</span>
                <select 
                  defaultValue={selectedNode.timeoutNodeId || ''}
                  onChange={e => updateQuestNode(campaignId, quest.id, selectedNode.id, { timeoutNodeId: e.target.value || null })}
                  style={{ padding: '8px', background: 'rgba(0,0,0,0.2)', color: '#fff', border: '1px solid var(--color-border)', borderRadius: '4px' }}
                >
                  <option value="">-- Sélectionner un nœud --</option>
                  {nodes.filter(n => n.id !== selectedNode.id).map(n => (
                    <option key={n.id} value={n.id}>{n.data.node?.title || n.data.label?.props?.children?.[1]?.props?.children?.[1] || n.id}</option>
                  ))}
                </select>
              </label>
            )}

            {selectedNode.isTimed && (
              <div style={{ marginTop: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    defaultChecked={selectedNode.timerVisibleToPlayers}
                    onChange={e => updateQuestNode(campaignId, quest.id, selectedNode.id, { timerVisibleToPlayers: e.target.checked })}
                  />
                  Timer visible par les joueurs ?
                </label>
              </div>
            )}

            {selectedNode.nodeType === 'end' && (
              <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: 'bold' }}>Issue de la quête (Si atteint)</span>
                <select 
                  defaultValue={selectedNode.endOutcome || ''}
                  onChange={e => updateQuestNode(campaignId, quest.id, selectedNode.id, { endOutcome: e.target.value || null })}
                  style={{ padding: '8px', background: 'rgba(0,0,0,0.2)', color: '#fff', border: '1px solid var(--color-border)', borderRadius: '4px' }}
                >
                  <option value="">-- Ne rien changer --</option>
                  <option value="success">Succès</option>
                  <option value="failure">Échec</option>
                  <option value="abandoned">Abandon</option>
                </select>
              </label>
            )}

            <hr style={{ borderColor: 'var(--color-border)', margin: '8px 0' }} />

            <h4 style={{ margin: '0', color: 'var(--color-primary-light)' }}>Liens</h4>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>PNJ Lié</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select 
                  defaultValue={selectedNode.linkedNpcId || ''}
                  onChange={e => updateQuestNode(campaignId, quest.id, selectedNode.id, { linkedNpcId: e.target.value || null })}
                  style={{ flex: 1, padding: '8px', background: 'rgba(0,0,0,0.2)', color: '#fff', border: '1px solid var(--color-border)', borderRadius: '4px' }}
                >
                  <option value="">-- Aucun PNJ --</option>
                  {npcs && npcs.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                </select>
                {selectedNode.linkedNpcId && (
                  <button 
                    className="btn-secondary"
                    title="Diffuser le portrait du PNJ au Spotlight"
                    onClick={async () => {
                      const npc = npcs.find(n => n.id === selectedNode.linkedNpcId);
                      if (npc && npc.imageUrl) {
                        try {
                          await api.post(`/api/v1/gm/campaigns/${campaignId}/spotlight`, {
                            contentType: 'image',
                            url: npc.imageUrl,
                            caption: npc.name
                          });
                        } catch(e) { console.error("Spotlight error", e); }
                      } else {
                        alert("Ce PNJ n'a pas d'image à diffuser.");
                      }
                    }}
                  >
                    <Radio size={16} />
                  </button>
                )}
              </div>
              {/* FE-4: Automatic Voice Sheet Popover/Card */}
              {selectedNode.linkedNpcId && quest.npcProfiles && (
                (() => {
                  const prof = quest.npcProfiles.find(p => p.npcId === selectedNode.linkedNpcId || p.id === selectedNode.linkedNpcId);
                  return prof ? <div style={{ marginTop: '8px' }}><NpcVoiceProfileCard profile={prof} /></div> : null;
                })()
              )}
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Lieu Lié</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select 
                  defaultValue={selectedNode.linkedLocationId || ''}
                  onChange={e => updateQuestNode(campaignId, quest.id, selectedNode.id, { linkedLocationId: e.target.value || null })}
                  style={{ flex: 1, padding: '8px', background: 'rgba(0,0,0,0.2)', color: '#fff', border: '1px solid var(--color-border)', borderRadius: '4px' }}
                >
                  <option value="">-- Aucun Lieu --</option>
                  {locations && locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
                {selectedNode.linkedLocationId && (
                  <button 
                    className="btn-secondary"
                    title="Diffuser l'illustration du lieu au Spotlight"
                    onClick={async () => {
                      const loc = locations.find(l => l.id === selectedNode.linkedLocationId);
                      if (loc && loc.imageUrl) {
                        try {
                          await api.post(`/api/v1/gm/campaigns/${campaignId}/spotlight`, {
                            contentType: 'image',
                            url: loc.imageUrl,
                            caption: loc.name
                          });
                        } catch(e) { console.error("Spotlight error", e); }
                      } else {
                        alert("Ce lieu n'a pas d'illustration à diffuser.");
                      }
                    }}
                  >
                    <Radio size={16} />
                  </button>
                )}
              </div>
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Rencontre / Combat Lié</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select 
                  defaultValue={selectedNode.linkedEncounterId || ''}
                  onChange={e => updateQuestNode(campaignId, quest.id, selectedNode.id, { linkedEncounterId: e.target.value || null })}
                  style={{ flex: 1, padding: '8px', background: 'rgba(0,0,0,0.2)', color: '#fff', border: '1px solid var(--color-border)', borderRadius: '4px' }}
                >
                  <option value="">-- Aucune Rencontre --</option>
                  {encounters && encounters.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
                <button
                  className="btn-primary"
                  title="Déclencher et ouvrir le combat dans l'onglet Combat"
                  style={{ padding: '8px 12px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                  onClick={async () => {
                    try {
                      // 1. Auto-generated encounter from combatTemplate
                      let encounterId = encounters?.find(e => e.questNodeId === selectedNode.id)?.id;
                      // 2. Manually linked encounter fallback
                      if (!encounterId) encounterId = selectedNode.linkedEncounterId;
                      // 3. Dynamic spawn fallback
                      if (!encounterId) {
                        const res = await spawnEncounterFromNode(campaignId, quest.id, selectedNode.id);
                        encounterId = res?.encounterId;
                      }
                      if (encounterId) {
                        navigate(`/gm/campaigns/${campaignId}/encounters?encounterId=${encounterId}`);
                      } else {
                        navigate(`/gm/campaigns/${campaignId}/encounters`);
                      }
                    } catch (err) {
                      alert('Erreur lors du déclenchement du combat');
                    }
                  }}
                >
                  ⚔️ Aller au combat
                </button>
              </div>
            </label>

            <hr style={{ borderColor: 'var(--color-border)', margin: '8px 0' }} />

            <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
              {selectedNode.status !== 'reached' ? (
                <button 
                  className="btn-primary" 
                  style={{ display: 'flex', justifyContent: 'center', gap: '8px', background: '#10b981', color: 'black', padding: '12px', fontSize: '1.1rem' }}
                  onClick={() => reachQuestNode(campaignId, quest.id, selectedNode.id).then(node => updateLocalNode(node))}
                >
                  <Flag size={20} /> Marquer comme Atteint
                </button>
              ) : (
                <button 
                  className="btn-secondary" 
                  style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '12px', fontSize: '1.1rem' }}
                  onClick={() => unreachQuestNode(campaignId, quest.id, selectedNode.id).then(node => updateLocalNode(node))}
                >
                  Annuler (Non atteint)
                </button>
              )}
              
              <button 
                className="btn-secondary" 
                style={{ color: 'var(--error, #ef4444)', borderColor: 'var(--error, #ef4444)', marginTop: '16px' }}
                onClick={() => {
                  deleteQuestNode(campaignId, quest.id, selectedNode.id).then(() => {
                    setSelectedNode(null);
                    setNodes(nds => nds.filter(n => n.id !== selectedNode.id));
                  });
                }}
              >
                Supprimer le nœud
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
