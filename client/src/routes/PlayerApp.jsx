import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { usePlayerStore } from '../store/playerStore';
import CharacterSheet from '../components/player/CharacterSheet';
import DiceRoller from '../components/player/DiceRoller';
import LiveSession from '../components/player/LiveSession';
import ConvoyDashboard from '../components/player/ConvoyDashboard';
import PlayerMapView from '../components/player/PlayerMapView';
import JoinCampaignModal from '../components/player/JoinCampaignModal';
import { LogIn } from 'lucide-react';

export default function PlayerApp() {
  const location = useLocation();
  const { 
    campaigns, 
    activeCampaignId, 
    fetchCampaigns, 
    setActiveCampaign,
    isLoading 
  } = usePlayerStore();
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  if (isLoading && campaigns.length === 0) {
    return <div className="loading-screen">Loading Player App...</div>;
  }

  if (campaigns.length === 0) {
    return (
      <div className="empty-state" style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ marginBottom: '20px', fontSize: '1.1rem' }}>You are not a player in any campaigns yet.</p>
        <button 
          onClick={() => setIsJoinModalOpen(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: 'var(--color-primary, #6366f1)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <LogIn size={18} /> Join Campaign
        </button>
        <JoinCampaignModal 
          isOpen={isJoinModalOpen} 
          onClose={() => setIsJoinModalOpen(false)} 
          onSuccess={() => fetchCampaigns()}
        />
      </div>
    );
  }

  return (
    <div className="player-layout">
      <header className="player-header" style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <select 
          value={activeCampaignId || ''} 
          onChange={(e) => setActiveCampaign(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '4px', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
        >
          {campaigns.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button
          onClick={() => setIsJoinModalOpen(true)}
          style={{
            padding: '6px 12px',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.875rem'
          }}
        >
          <LogIn size={14} /> Join Campaign
        </button>
      </header>

      <main className="player-content">
        {activeCampaignId ? (
          <Routes>
            <Route path="/" element={<Navigate to="character" replace />} />
            <Route path="/character" element={<CharacterSheet campaignId={activeCampaignId} />} />
            <Route path="/dice" element={<DiceRoller campaignId={activeCampaignId} />} />
            <Route path="/session" element={<LiveSession campaignId={activeCampaignId} />} />
            <Route path="/map" element={<PlayerMapView campaignId={activeCampaignId} />} />
            <Route path="/convoys" element={<ConvoyDashboard campaignId={activeCampaignId} />} />
          </Routes>
        ) : (
          <div className="empty-state">Select a campaign to continue.</div>
        )}
      </main>

      <nav className="player-nav">
        <Link 
          to="character" 
          style={{ 
            color: location.pathname.includes('character') ? 'var(--color-primary)' : 'var(--color-text-muted)'
          }}
        >
          My Sheet
        </Link>
        <Link 
          to="dice"
          style={{ 
            color: location.pathname.includes('dice') ? 'var(--color-primary)' : 'var(--color-text-muted)'
          }}
        >
          Dice
        </Link>
        <Link 
          to="session"
          style={{ 
            color: location.pathname.includes('session') ? 'var(--color-primary)' : 'var(--color-text-muted)'
          }}
        >
          Session
        </Link>
        <Link 
          to="map"
          style={{ 
            color: location.pathname.includes('map') ? 'var(--color-primary)' : 'var(--color-text-muted)'
          }}
        >
          Map
        </Link>
        <Link 
          to="convoys"
          style={{ 
            color: location.pathname.includes('convoys') ? 'var(--color-primary)' : 'var(--color-text-muted)'
          }}
        >
          Convoi
        </Link>
      </nav>

      <JoinCampaignModal 
        isOpen={isJoinModalOpen} 
        onClose={() => setIsJoinModalOpen(false)} 
        onSuccess={() => fetchCampaigns()}
      />
    </div>
  );
}
