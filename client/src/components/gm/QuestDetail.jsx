import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGmStore } from '../../store/gmStore';
import { ArrowLeft, Lock, Eye, LayoutDashboard } from 'lucide-react';
import QuestGraphEditor from './QuestGraphEditor';
import SessionDashboard from './SessionDashboard';

export default function QuestDetail() {
  const { campaignId, questId } = useParams();
  const { fetchQuestDetail } = useGmStore();
  const [quest, setQuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('gm'); // 'gm' | 'player' (FE-1)
  const [showDashboard, setShowDashboard] = useState(false); // (FE-6)

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
        justify: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to={`/gm/campaigns/${campaignId}/quests`} style={{ color: 'var(--color-text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 style={{ margin: 0, color: 'var(--color-text)', fontSize: '1.2rem' }}>{quest.name}</h2>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Graphe de Résolution</div>
          </div>
        </div>

        {/* Action Controls: FE-1 (View Mode Toggle) & FE-6 (Session Dashboard Toggle) */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ display: 'flex', backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '2px' }}>
            <button
              onClick={() => setViewMode('gm')}
              style={{
                padding: '6px 12px',
                fontSize: '0.8rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: viewMode === 'gm' ? 'var(--color-primary)' : 'transparent',
                color: viewMode === 'gm' ? '#fff' : 'var(--color-text-muted)',
                fontWeight: viewMode === 'gm' ? 'bold' : 'normal'
              }}
              title="Mode MJ : Affiche tous les secrets et détails techniques"
            >
              <Lock size={14} /> Mode MJ
            </button>
            <button
              onClick={() => setViewMode('player')}
              style={{
                padding: '6px 12px',
                fontSize: '0.8rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: viewMode === 'player' ? '#10b981' : 'transparent',
                color: viewMode === 'player' ? '#fff' : 'var(--color-text-muted)',
                fontWeight: viewMode === 'player' ? 'bold' : 'normal'
              }}
              title="Mode Joueurs / Écran Table : Masque les secrets MJ et les éléments non révélés"
            >
              <Eye size={14} /> Mode Joueurs
            </button>
          </div>

          <button
            className={showDashboard ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setShowDashboard(!showDashboard)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px' }}
          >
            <LayoutDashboard size={16} />
            Dashboard Session
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <QuestGraphEditor quest={quest} campaignId={campaignId} viewMode={viewMode} />
        {showDashboard && (
          <SessionDashboard
            quest={quest}
            campaignId={campaignId}
            onClose={() => setShowDashboard(false)}
          />
        )}
      </div>
    </div>
  );
}
