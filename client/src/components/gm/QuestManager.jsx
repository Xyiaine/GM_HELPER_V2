import React, { useEffect, useState } from 'react';
import { useGmStore } from '../../store/gmStore';
import api from '../../utils/api';
import { Link } from 'react-router-dom';
import { Target, MapPin, Users, PlusCircle, CheckCircle, Copy, Trash2, GitFork, Calendar, Clock, ArrowUpDown } from 'lucide-react';

export default function QuestManager() {
  const { activeCampaignId, quests, fetchQuests, createQuest, resolveQuest, duplicateQuest, deleteQuest, items, fetchItems } = useGmStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sortBy, setSortBy] = useState('updated_desc'); // 'updated_desc' | 'created_desc' | 'created_asc' | 'name_asc' | 'nodes_desc'
  const [newQuest, setNewQuest] = useState({ name: '', description: '', type: 'main', visibility: 'secret', difficulty: '', level: 1, duration: '', xpReward: 0, goldReward: 0, playerSummary: '', gmNotes: '', selectedItemIds: [], selectedPrerequisiteIds: [] });
  const [resolvingId, setResolvingId] = useState(null);

  useEffect(() => {
    if (activeCampaignId) {
      fetchQuests(activeCampaignId);
      if (!items || items.length === 0) fetchItems(activeCampaignId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCampaignId, fetchQuests, fetchItems]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Date inconnue';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  const sortedQuests = [...(quests || [])].sort((a, b) => {
    if (sortBy === 'updated_desc') {
      return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
    }
    if (sortBy === 'created_desc') {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
    if (sortBy === 'created_asc') {
      return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    }
    if (sortBy === 'name_asc') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'nodes_desc') {
      const countA = a._count?.nodes ?? a.nodes?.length ?? 0;
      const countB = b._count?.nodes ?? b.nodes?.length ?? 0;
      return countB - countA;
    }
    return 0;
  });

  const handleCreateQuest = async () => {
    if (!newQuest.name) return;
    const { selectedItemIds, selectedPrerequisiteIds, ...questData } = newQuest;
    
    try {
      const createdData = await createQuest(activeCampaignId, {
        ...questData,
        status: 'active',
        progress: 0,
      });
      
      const qId = createdData.quest ? createdData.quest.id : createdData.id;
      
      if (selectedItemIds && selectedItemIds.length > 0) {
        await Promise.all(selectedItemIds.map(itemId => 
          api.post(`/api/v1/gm/campaigns/${activeCampaignId}/quests/${qId}/items`, { itemId })
        ));
      }
      if (selectedPrerequisiteIds && selectedPrerequisiteIds.length > 0) {
        await Promise.all(selectedPrerequisiteIds.map(prereqId => 
          api.post(`/api/v1/gm/campaigns/${activeCampaignId}/quests/${qId}/dependencies`, { dependsOnQuestId: prereqId, type: 'prerequisite' })
        ));
      }
    } catch(err) {
      console.error("Error creating quest links", err);
    }
    
    setShowCreateModal(false);
    setNewQuest({ name: '', description: '', type: 'main', visibility: 'secret', difficulty: '', level: 1, duration: '', xpReward: 0, goldReward: 0, playerSummary: '', gmNotes: '', selectedItemIds: [], selectedPrerequisiteIds: [] });
  };

  const handleResolve = async (questId, outcome) => {
    await resolveQuest(activeCampaignId, questId, { outcome, status: 'completed' });
    setResolvingId(null);
  };

  const handleDuplicate = async (questId) => {
    if (window.confirm('Voulez-vous dupliquer cette quête ? (Graphe inclus)')) {
      await duplicateQuest(activeCampaignId, questId);
    }
  };

  const handleDeleteQuest = async (quest) => {
    const nodeCount = quest._count?.nodes ?? quest.nodes?.length ?? 0;
    
    let confirmed = false;
    if (nodeCount >= 10) {
      confirmed = window.confirm(
        `⚠️ ATTENTION : La quête "${quest.name}" contient ${nodeCount} nœuds (10 nœuds ou plus).\n\nCette suppression est DÉFINITIVE et effacera la quête ainsi que la totalité de ses nœuds, objectifs, horloges de menace et connexions de la base de données.\n\nConfirmez-vous la suppression de cette quête ?`
      );
    } else {
      confirmed = window.confirm(
        `Voulez-vous vraiment supprimer définitivement la quête "${quest.name}" (${nodeCount} nœud(s)) de la base de données ?`
      );
    }

    if (confirmed) {
      try {
        await deleteQuest(activeCampaignId, quest.id);
      } catch (err) {
        alert('Erreur lors de la suppression de la quête.');
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: 'var(--color-primary)', margin: 0 }}>Quest Manager</h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Design quests and their impacts on City-States parameters.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreateModal(true)} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <PlusCircle size={18} />
          New Quest
        </button>
      </header>

      {/* Quest Sorting Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'var(--color-surface)',
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid var(--color-border)'
      }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>
          📋 {sortedQuests.length} Quête(s) répertoriée(s)
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowUpDown size={14} color="var(--color-primary-light)" /> Trier par :
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              backgroundColor: 'var(--color-background)',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <option value="updated_desc">🕒 Dernière modification (Récent → Ancien)</option>
            <option value="created_desc">📅 Date de création (Récent → Ancien)</option>
            <option value="created_asc">📅 Date de création (Ancien → Récent)</option>
            <option value="name_asc">🔤 Nom (A → Z)</option>
            <option value="nodes_desc">🚩 Nombre de nœuds (Plus élevé)</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {sortedQuests && sortedQuests.length > 0 ? (
          sortedQuests.map(quest => {
            const nodeCount = quest._count?.nodes ?? quest.nodes?.length ?? 0;
            return (
              <div key={quest.id} style={{ 
                backgroundColor: 'var(--color-surface)', 
                padding: '20px', 
                borderRadius: '8px', 
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Link to={`/gm/campaigns/${activeCampaignId}/quests/${quest.id}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, color: 'var(--color-primary-light)', cursor: 'pointer' }}>
                      <Target color="var(--warning, #f59e0b)" size={20} />
                      {quest.name}
                    </h3>
                  </Link>
                  <span style={{ 
                    padding: '4px 8px', 
                    backgroundColor: 'var(--color-background)', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    color: quest.status === 'completed' ? 'var(--success, #10b981)' : 'var(--color-text-muted)'
                  }}>
                    {quest.status}
                  </span>
                </div>
                <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>{quest.description || 'No description.'}</p>
                
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '8px', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <GitFork size={15} color="#a78bfa" /> Nœuds: {nodeCount}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }} title="Date de création de la quête">
                    <Calendar size={15} color="#38bdf8" /> Créée le : {formatDate(quest.createdAt)}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }} title="Dernière modification de la quête">
                    <Clock size={15} color="#f59e0b" /> Modifiée le : {formatDate(quest.updatedAt)}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={15} /> Lieux: {quest.locationLinks?.length || 0}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={15} /> PNJ: {quest.npcLinks?.length || 0}
                  </span>
                </div>

                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end', gap: '8px', flexWrap: 'wrap' }}>
                  {resolvingId === quest.id ? (
                    <>
                      <button className="btn-secondary" onClick={() => handleResolve(quest.id, 'failure')}>Fail</button>
                      <button className="btn-primary" onClick={() => handleResolve(quest.id, 'success')}>Success</button>
                      <button className="btn-secondary" onClick={() => setResolvingId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <Link to={`/gm/campaigns/${activeCampaignId}/quests/${quest.id}`} className="btn-secondary" style={{ display: 'flex', gap: '4px', alignItems: 'center', textDecoration: 'none' }}>
                        Éditer le Graphe
                      </Link>
                      <button 
                        className="btn-secondary" 
                        onClick={async () => {
                          if (window.confirm(`Instancier une nouvelle partie vierge pour "${quest.name}" ?`)) {
                            await useGmStore.getState().instantiateQuest(activeCampaignId, quest.id);
                            fetchQuests(activeCampaignId);
                          }
                        }} 
                        style={{ display: 'flex', gap: '4px', alignItems: 'center', backgroundColor: 'var(--success-tint)', color: '#10b981', border: '1px solid #10b981' }}
                        title="BE-1: Crée une instance vierge de jeu à partir de ce modèle"
                      >
                        🚀 Instancier (Nouvelle Table)
                      </button>
                      <button 
                        className="btn-secondary" 
                        onClick={async () => {
                          if (window.confirm(`Réinitialiser l'état courant de "${quest.name}" à zéro ? (Horloges, nœuds et relations réinitialisés)`)) {
                            await useGmStore.getState().resetQuestInstance(activeCampaignId, quest.id);
                            fetchQuests(activeCampaignId);
                          }
                        }} 
                        style={{ display: 'flex', gap: '4px', alignItems: 'center' }}
                        title="BE-1: Remet les compteurs et nœuds à zéro"
                      >
                        🔄 Remettre à zéro
                      </button>
                      <button className="btn-secondary" onClick={() => handleDuplicate(quest.id)} style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <Copy size={16} /> Dupliquer
                      </button>
                      {quest.status !== 'completed' && (
                        <button className="btn-secondary" onClick={() => setResolvingId(quest.id)} style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                          <CheckCircle size={16} /> Résoudre
                        </button>
                      )}
                      <button 
                        className="btn-secondary" 
                        onClick={() => handleDeleteQuest(quest)} 
                        style={{ display: 'flex', gap: '4px', alignItems: 'center', color: '#ef4444', borderColor: '#ef4444', backgroundColor: 'var(--danger-tint)' }}
                        title={`Supprimer définitivement la quête de la DB (${nodeCount} nœud(s))`}
                      >
                        <Trash2 size={16} /> Supprimer
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'var(--color-surface)', borderRadius: '8px' }}>
            <Target size={48} color="var(--color-text-muted)" style={{ opacity: 0.5, marginBottom: '16px' }} />
            <p style={{ color: 'var(--color-text-muted)' }}>No quests created yet.</p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'var(--scrim)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{ 
            backgroundColor: 'var(--color-background)', padding: '24px', borderRadius: '8px',
            width: '600px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <h2 style={{ color: 'var(--color-text)' }}>Create New Quest</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
              <input 
                placeholder="Quest Name" 
                value={newQuest.name}
                onChange={e => setNewQuest({ ...newQuest, name: e.target.value })}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
              />
              <textarea 
                placeholder="Description" 
                rows={4} 
                value={newQuest.description}
                onChange={e => setNewQuest({ ...newQuest, description: e.target.value })}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <select 
                  value={newQuest.type}
                  onChange={e => setNewQuest({ ...newQuest, type: e.target.value })}
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
                >
                  <option value="main">Principale</option>
                  <option value="secondary">Secondaire</option>
                  <option value="faction">Annexe</option>
                  <option value="personal">Personnelle</option>
                </select>
                
                <select 
                  value={newQuest.visibility}
                  onChange={e => setNewQuest({ ...newQuest, visibility: e.target.value })}
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
                >
                  <option value="secret">Secrète (MJ uniquement)</option>
                  <option value="known">Connue (Visible joueurs)</option>
                  <option value="partial">Partiellement révélée</option>
                </select>
              </div>

              <textarea 
                placeholder="Résumé Joueur (visible si la quête est connue)" 
                rows={2} 
                value={newQuest.playerSummary}
                onChange={e => setNewQuest({ ...newQuest, playerSummary: e.target.value })}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
              />

              <textarea 
                placeholder="Notes MJ (privées)" 
                rows={3} 
                value={newQuest.gmNotes}
                onChange={e => setNewQuest({ ...newQuest, gmNotes: e.target.value })}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <input 
                  type="number"
                  placeholder="XP Reward" 
                  value={newQuest.xpReward || ''}
                  onChange={e => setNewQuest({ ...newQuest, xpReward: parseInt(e.target.value) || 0 })}
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
                />
                <input 
                  type="number"
                  placeholder="Gold Reward" 
                  value={newQuest.goldReward || ''}
                  onChange={e => setNewQuest({ ...newQuest, goldReward: parseInt(e.target.value) || 0 })}
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '8px' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Quêtes Prérequises</span>
                  <select 
                    multiple
                    value={newQuest.selectedPrerequisiteIds}
                    onChange={e => setNewQuest({ ...newQuest, selectedPrerequisiteIds: Array.from(e.target.selectedOptions, option => option.value) })}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', minHeight: '80px' }}
                  >
                    {quests && quests.map(q => <option key={q.id} value={q.id}>{q.name}</option>)}
                  </select>
                </label>

                <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Objets (Récompenses/Liés)</span>
                  <select 
                    multiple
                    value={newQuest.selectedItemIds}
                    onChange={e => setNewQuest({ ...newQuest, selectedItemIds: Array.from(e.target.selectedOptions, option => option.value) })}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', minHeight: '80px' }}
                  >
                    {items && items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                  </select>
                </label>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button className="btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleCreateQuest}>Save Quest</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
