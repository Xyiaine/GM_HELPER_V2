import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGmStore } from '../../store/gmStore';
import { Users, Map, BookOpen, Swords, Flag, Search, Dices, Truck } from 'lucide-react';
import GMDicePanel from './GMDicePanel';

export default function CampaignDashboard() {
  const { campaignId } = useParams();
  const { campaigns, setActiveCampaign, isLoading, error } = useGmStore();
  const [showDice, setShowDice] = useState(false);

  useEffect(() => {
    if (campaignId) {
      setActiveCampaign(campaignId);
    }
  }, [campaignId, setActiveCampaign]);

  const selectedCampaign = campaigns.find(c => c.id === campaignId);

  if (isLoading && campaigns.length === 0) return <div className="loading-screen">Loading campaign dashboard...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!selectedCampaign) return <div className="empty-state">No campaign selected or campaign not found.</div>;

  const stats = [
    { label: 'Characters', count: selectedCampaign._count?.characters || 0, icon: <Users size={20} />, link: `/gm/campaigns/${campaignId}/characters` },
    { label: 'NPCs', count: selectedCampaign._count?.npcs || 0, icon: <Users size={20} color="var(--color-primary)" />, link: `/gm/campaigns/${campaignId}/npcs` },
    { label: 'Locations', count: selectedCampaign._count?.locations || 0, icon: <Map size={20} />, link: `/gm/campaigns/${campaignId}/locations` },
    { label: 'Quests', count: selectedCampaign._count?.quests || 0, icon: <Flag size={20} color="var(--warning, #f59e0b)" />, link: `/gm/campaigns/${campaignId}/quests` },
    { label: 'Véhicules', count: selectedCampaign._count?.vehicles || 0, icon: <Truck size={20} color="var(--color-text)" />, link: `/gm/campaigns/${campaignId}/vehicles` },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <header style={{ marginBottom: '32px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--color-text)', marginBottom: '8px' }}>
          {selectedCampaign.name}
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          {selectedCampaign.description}
        </p>
        <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
           <span style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.8rem', color: 'var(--color-text)' }}>
              System: {selectedCampaign.gameSystem}
           </span>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {stats.map((stat, idx) => (
          <Link key={idx} to={stat.link} style={{ textDecoration: 'none' }}>
            <div style={{ 
              backgroundColor: 'var(--color-surface)', 
              padding: '20px', 
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              transition: 'background-color 0.2s'
            }}>
              <div style={{ 
                backgroundColor: 'var(--color-background)', 
                width: '48px', 
                height: '48px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px solid var(--color-border)'
              }}>
                {stat.icon}
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-text)' }}>{stat.count}</div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{stat.label}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <section style={{ backgroundColor: 'var(--color-surface)', padding: '24px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px 0', color: 'var(--color-text)' }}>
            <BookOpen size={20} color="var(--color-primary)" /> Recent Notes
          </h2>
          <p style={{ color: 'var(--color-text-muted)' }}>No recent notes. Start writing to keep track of your campaign.</p>
        </section>

        <section style={{ backgroundColor: 'var(--color-surface)', padding: '24px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px 0', color: 'var(--color-text)' }}>
            <Swords size={20} color="var(--danger, #ef4444)" /> Quick Actions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button className="btn-secondary" onClick={() => setShowDice(!showDice)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
               <Dices size={16} /> Roll Dice
            </button>
            <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
               <Search size={16} /> Global Search
            </button>
          </div>
        </section>
      </div>
      
      {showDice && <GMDicePanel onClose={() => setShowDice(false)} />}
    </div>
  );
}
