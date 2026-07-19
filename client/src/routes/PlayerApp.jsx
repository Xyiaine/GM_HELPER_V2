import React, { useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { usePlayerStore } from '../store/playerStore';
import CharacterSheet from '../components/player/CharacterSheet';
import DiceRoller from '../components/player/DiceRoller';
import LiveSession from '../components/player/LiveSession';
import ConvoyDashboard from '../components/player/ConvoyDashboard';
import PlayerMapView from '../components/player/PlayerMapView';

export default function PlayerApp() {
  const location = useLocation();
  const { 
    campaigns, 
    activeCampaignId, 
    fetchCampaigns, 
    setActiveCampaign,
    isLoading 
  } = usePlayerStore();

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  if (isLoading && campaigns.length === 0) {
    return <div className="loading-screen">Loading Player App...</div>;
  }

  if (campaigns.length === 0) {
    return <div className="empty-state">You are not a player in any campaigns yet.</div>;
  }

  return (
    <div className="player-layout">
      <header className="player-header" style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>
        <select 
          value={activeCampaignId || ''} 
          onChange={(e) => setActiveCampaign(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '4px', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
        >
          {campaigns.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
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
    </div>
  );
}
