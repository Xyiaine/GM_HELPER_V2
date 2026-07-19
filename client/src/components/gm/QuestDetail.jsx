import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGmStore } from '../../store/gmStore';
import { ArrowLeft } from 'lucide-react';
import QuestGraphEditor from './QuestGraphEditor';

export default function QuestDetail() {
  const { campaignId, questId } = useParams();
  const { fetchQuestDetail } = useGmStore();
  const [quest, setQuest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchQuestDetail(campaignId, questId);
        setQuest(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [campaignId, questId, fetchQuestDetail]);

  if (loading) return <div style={{ padding: '24px' }}>Loading quest...</div>;
  if (!quest) return <div style={{ padding: '24px' }}>Quest not found.</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <header style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link to={`/gm/campaigns/${campaignId}/quests`} style={{ color: 'var(--color-text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 style={{ margin: 0, color: 'var(--color-text)' }}>{quest.name}</h2>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Quest Graph</div>
        </div>
      </header>
      
      <div style={{ flex: 1, position: 'relative' }}>
        <QuestGraphEditor quest={quest} campaignId={campaignId} />
      </div>
    </div>
  );
}
