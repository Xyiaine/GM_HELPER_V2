import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import CampaignList from '../components/gm/CampaignList';
import CampaignDashboard from '../components/gm/CampaignDashboard';
import CitiesManager from '../components/gm/CitiesManager';
import QuestManager from '../components/gm/QuestManager';
import QuestDetail from '../components/gm/QuestDetail';
import CombatTracker from '../components/gm/CombatTracker';
import CharactersList from '../components/gm/CharactersList';
import NpcsList from '../components/gm/NpcsList';
import NotesManager from '../components/gm/NotesManager';
import SessionManager from '../components/gm/SessionManager';
import ItemsManager from '../components/gm/ItemsManager';
import GlobalSearch from '../components/gm/GlobalSearch';
import TagManager from '../components/gm/TagManager';
import MapManager from '../components/gm/MapManager';
import LocalMapManager from '../components/gm/LocalMapManager';
import ConvoyManager from '../components/gm/ConvoyManager';
import VehiclesList from '../components/gm/VehiclesList';
import VehicleSheet from '../components/gm/VehicleSheet';
import { useGmStore } from '../store/gmStore';
import useAuthStore from '../store/authStore';

export default function GmApp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { campaigns, activeCampaignId, fetchCampaigns } = useGmStore();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="gm-layout" style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <aside className="gm-sidebar" style={{ 
        width: '250px', 
        backgroundColor: 'var(--color-surface)', 
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ padding: '20px', fontWeight: 'bold', fontSize: '1.2rem', borderBottom: '1px solid var(--color-border)' }}>
          GM Helper
        </div>
        
        {user && (
          <div style={{ padding: '16px', fontSize: '0.9rem', color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)' }}>
            Logged in as {user.displayName}
            <button onClick={handleLogout} style={{ display: 'block', marginTop: '8px', padding: '4px 8px', background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text)', borderRadius: '4px', cursor: 'pointer' }}>
              Logout
            </button>
          </div>
        )}

        <nav style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto' }}>
          <Link to="/gm/campaigns" style={{ padding: '8px', borderRadius: '4px', textDecoration: 'none', color: location.pathname === '/gm/campaigns' ? 'var(--color-primary)' : 'var(--color-text)' }}>
            My Campaigns
          </Link>
          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '8px 0' }} />
          
          {activeCampaignId && (
            <>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', padding: '0 8px' }}>Current Campaign</div>
              <Link to={`/gm/campaigns/${activeCampaignId}`} style={{ padding: '8px', borderRadius: '4px', textDecoration: 'none', color: 'var(--color-text)' }}>Dashboard</Link>
              <Link to={`/gm/campaigns/${activeCampaignId}/map`} style={{ padding: '8px', borderRadius: '4px', textDecoration: 'none', color: 'var(--color-text)' }}>Map</Link>
              <Link to={`/gm/campaigns/${activeCampaignId}/notes`} style={{ padding: '8px', borderRadius: '4px', textDecoration: 'none', color: 'var(--color-text)' }}>Notes</Link>
              <Link to={`/gm/campaigns/${activeCampaignId}/characters`} style={{ padding: '8px', borderRadius: '4px', textDecoration: 'none', color: 'var(--color-text)' }}>Characters</Link>
              <Link to={`/gm/campaigns/${activeCampaignId}/npcs`} style={{ padding: '8px', borderRadius: '4px', textDecoration: 'none', color: 'var(--color-text)' }}>NPCs</Link>
              <Link to={`/gm/campaigns/${activeCampaignId}/locations`} style={{ padding: '8px', borderRadius: '4px', textDecoration: 'none', color: 'var(--color-text)' }}>Locations & Cities</Link>
              <Link to={`/gm/campaigns/${activeCampaignId}/quests`} style={{ padding: '8px', borderRadius: '4px', textDecoration: 'none', color: 'var(--color-text)' }}>Quests</Link>
              <Link to={`/gm/campaigns/${activeCampaignId}/encounters`} style={{ padding: '8px', borderRadius: '4px', textDecoration: 'none', color: 'var(--color-text)' }}>Encounters</Link>
              <Link to={`/gm/campaigns/${activeCampaignId}/items`} style={{ padding: '8px', borderRadius: '4px', textDecoration: 'none', color: 'var(--color-text)' }}>Items</Link>
              <Link to={`/gm/campaigns/${activeCampaignId}/tags`} style={{ padding: '8px', borderRadius: '4px', textDecoration: 'none', color: 'var(--color-text)' }}>Tags</Link>
              <Link to={`/gm/campaigns/${activeCampaignId}/convoys`} style={{ padding: '8px', borderRadius: '4px', textDecoration: 'none', color: 'var(--color-text)', fontWeight: location.pathname.includes('/convoys') ? 'bold' : 'normal' }}>🚛 Convois</Link>
              <Link to={`/gm/campaigns/${activeCampaignId}/vehicles`} style={{ padding: '8px', borderRadius: '4px', textDecoration: 'none', color: 'var(--color-text)', fontWeight: location.pathname.includes('/vehicles') ? 'bold' : 'normal' }}>🚚 Véhicules</Link>
            </>
          )}
        </nav>
        
        {/* Session Manager anchored at the bottom of the sidebar */}
        {activeCampaignId && <SessionManager />}
      </aside>
      
      <main className="gm-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: 'var(--color-background)' }}>
        {activeCampaignId && (
          <header style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
            <GlobalSearch />
          </header>
        )}
        <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
          <Routes>
            <Route path="/" element={<CampaignList />} />
            <Route path="/campaigns" element={<CampaignList />} />
            <Route path="/campaigns/:campaignId" element={<CampaignDashboard />} />
            <Route path="/campaigns/:campaignId/map" element={<MapManager />} />
            <Route path="/campaigns/:campaignId/locations/:locationId/map" element={<LocalMapManager />} />
            <Route path="/campaigns/:campaignId/notes" element={<NotesManager />} />
            <Route path="/campaigns/:campaignId/characters" element={<CharactersList />} />
            <Route path="/campaigns/:campaignId/npcs" element={<NpcsList />} />
            <Route path="/campaigns/:campaignId/locations" element={<CitiesManager />} />
            <Route path="/campaigns/:campaignId/quests" element={<QuestManager />} />
            <Route path="/campaigns/:campaignId/quests/:questId" element={<QuestDetail />} />
            <Route path="/campaigns/:campaignId/encounters" element={<CombatTracker />} />
            <Route path="/campaigns/:campaignId/items" element={<ItemsManager />} />
            <Route path="/campaigns/:campaignId/tags" element={<TagManager />} />
            <Route path="/campaigns/:campaignId/convoys" element={<ConvoyManager />} />
            <Route path="/campaigns/:campaignId/vehicles" element={<VehiclesList />} />
            <Route path="/campaigns/:campaignId/vehicles/:vehicleId" element={<VehicleSheet />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
