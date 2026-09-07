import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGmStore } from '../../store/gmStore';
import { ArrowLeft, Lock, Eye, LayoutDashboard, Layers, Network } from 'lucide-react';
import QuestGraphEditor from './QuestGraphEditor';
import SessionDashboard from './SessionDashboard';
import SaltRaceTabletop from './courseDuSel/SaltRaceTabletop';

export default function QuestDetail() {
  const { campaignId, questId } = useParams();
  const { fetchQuestDetail } = useGmStore();
  const [quest, setQuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('gm'); // 'gm' | 'player' (FE-1)
  const [activeTab, setActiveTab] = useState('cards'); // 'cards' | 'graph' | 'dashboard'

  const loadData = async () => {
    try {
      const data = await fetchQuestDetail(campaignId, questId);
      setQuest(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [campaignId, questId, fetchQuestDetail]);

  if (loading) return <div style={{ padding: '24px', color: 'var(--color-text-muted)' }}>Chargement de la quête...</div>;
  if (!quest) return <div style={{ padding: '24px', color: 'var(--color-text-muted)' }}>Quête introuvable.</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', position: 'relative' }}>
      <header style={{
        padding: '12px 24px',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to={`/gm/campaigns/${campaignId}/quests`} style={{ color: 'var(--color-text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 style={{ margin: 0, color: 'var(--color-text)', fontSize: '1.2rem' }}>{quest.name}</h2>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              {activeTab === 'cards' ? 'Plateau de Table Virtuel (Gamifié MJ)' : activeTab === 'graph' ? 'Graphe de Résolution' : 'Tableau de Bord de Session'}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Main View Mode Selector */}
          <div style={{ display: 'flex', backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '3px', gap: '3px' }}>
            <button
              onClick={() => setActiveTab('cards')}
              style={{
                padding: '6px 12px',
                fontSize: '0.82rem',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: activeTab === 'cards' ? 'var(--color-primary)' : 'transparent',
                color: activeTab === 'cards' ? '#fff' : 'var(--color-text-muted)',
                fontWeight: activeTab === 'cards' ? 700 : 500,
                transition: 'all 0.15s ease'
              }}
              title="Table de jeu avec les 3 Decks et le Co-Pilote MJ"
            >
              <Layers size={14} /> 🃏 Table de Cartes MJ
            </button>

            <button
              onClick={() => setActiveTab('graph')}
              style={{
                padding: '6px 12px',
                fontSize: '0.82rem',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: activeTab === 'graph' ? 'var(--color-primary)' : 'transparent',
                color: activeTab === 'graph' ? '#fff' : 'var(--color-text-muted)',
                fontWeight: activeTab === 'graph' ? 700 : 500,
                transition: 'all 0.15s ease'
              }}
              title="Vue Graphe de réseau ReactFlow"
            >
              <Network size={14} /> Graphe Réseau
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              style={{
                padding: '6px 12px',
                fontSize: '0.82rem',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: activeTab === 'dashboard' ? 'var(--color-primary)' : 'transparent',
                color: activeTab === 'dashboard' ? '#fff' : 'var(--color-text-muted)',
                fontWeight: activeTab === 'dashboard' ? 700 : 500,
                transition: 'all 0.15s ease'
              }}
              title="Tableau de bord de suivi de session"
            >
              <LayoutDashboard size={14} /> Dashboard Session
            </button>
          </div>

          {/* Mode MJ / Joueur toggle for graph view */}
          {activeTab === 'graph' && (
            <div style={{ display: 'flex', backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '2px' }}>
              <button
                onClick={() => setViewMode('gm')}
                style={{
                  padding: '5px 10px',
                  fontSize: '0.78rem',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  backgroundColor: viewMode === 'gm' ? 'var(--color-primary)' : 'transparent',
                  color: viewMode === 'gm' ? '#fff' : 'var(--color-text-muted)',
                  fontWeight: viewMode === 'gm' ? 'bold' : 'normal'
                }}
              >
                <Lock size={13} /> MJ
              </button>
              <button
                onClick={() => setViewMode('player')}
                style={{
                  padding: '5px 10px',
                  fontSize: '0.78rem',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  backgroundColor: viewMode === 'player' ? '#10b981' : 'transparent',
                  color: viewMode === 'player' ? '#fff' : 'var(--color-text-muted)',
                  fontWeight: viewMode === 'player' ? 'bold' : 'normal'
                }}
              >
                <Eye size={13} /> Joueurs
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content View */}
      <div style={{ flex: 1, position: 'relative', overflowY: 'auto' }}>
        {activeTab === 'cards' && (
          <SaltRaceTabletop quest={quest} campaignId={campaignId} />
        )}

        {activeTab === 'graph' && (
          <QuestGraphEditor quest={quest} campaignId={campaignId} viewMode={viewMode} />
        )}

        {activeTab === 'dashboard' && (
          <SessionDashboard
            quest={quest}
            campaignId={campaignId}
            onClose={() => setActiveTab('cards')}
          />
        )}
      </div>
    </div>
  );
}
