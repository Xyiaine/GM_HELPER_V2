import React, { useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import CampaignList from '../components/gm/CampaignList';
import CampaignDashboard from '../components/gm/CampaignDashboard';
import CitiesManager from '../components/gm/CitiesManager';
import QuestManager from '../components/gm/QuestManager';
import QuestDetail from '../components/gm/QuestDetail';
import CombatTracker from '../components/gm/CombatTracker';
import BestiaryManager from '../components/gm/BestiaryManager';
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
import PrintStudio from '../components/gm/PrintStudio';
import GmDeckDrawer from '../components/gm/deck/GmDeckDrawer';
import ActiveComplicationsBanner from '../components/gm/deck/ActiveComplicationsBanner';
import ToastContainer from '../components/ui/ToastContainer';
import { useGmStore } from '../store/gmStore';
import useAuthStore from '../store/authStore';
import { acquireSocket, autoJoinCampaignRoom } from '../utils/socket';
import {
  Flame, LayoutDashboard, Map as MapIcon, ScrollText, Users, Building2,
  Target, Swords, BookOpen, Backpack, Tags, Truck, Car, Printer,
} from 'lucide-react';

// Les quatorze entrées étaient toutes au même niveau : rien ne distinguait ce
// qui sert à mener une partie de ce qui sert à préparer. Elles sont groupées
// par usage réel.
function buildNavGroups(campaignId) {
  const base = `/gm/campaigns/${campaignId}`;
  return [
    {
      label: 'Conduite',
      items: [
        { to: base, label: 'Tableau de bord', icon: LayoutDashboard, exact: true },
        { to: `${base}/quests`, label: 'Quêtes', icon: Target },
        { to: `${base}/encounters`, label: 'Combat', icon: Swords },
        { to: `${base}/convoys`, label: 'Convois', icon: Truck },
        { to: `${base}/exports`, label: 'Impression', icon: Printer },
      ],
    },
    {
      label: 'Monde',
      items: [
        { to: `${base}/map`, label: 'Carte du monde', icon: MapIcon },
        { to: `${base}/locations`, label: 'Cités & lieux', icon: Building2 },
        { to: `${base}/npcs`, label: 'PNJ', icon: Users },
        { to: `${base}/characters`, label: 'Personnages', icon: Users },
      ],
    },
    {
      label: 'Référence',
      items: [
        { to: `${base}/bestiary`, label: 'Bestiaire', icon: BookOpen },
        { to: `${base}/items`, label: 'Objets & équipement', icon: Backpack },
        { to: `${base}/vehicles`, label: 'Véhicules', icon: Car },
        { to: `${base}/notes`, label: 'Notes & lore', icon: ScrollText },
        { to: `${base}/tags`, label: 'Étiquettes', icon: Tags },
      ],
    },
  ];
}

export default function GmApp() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    campaigns,
    activeCampaignId,
    fetchCampaigns,
    doomPool,
    isDeckDrawerOpen,
    toggleDeckDrawer,
    activeComplications,
  } = useGmStore();
  const { user, logout, accessToken } = useAuthStore();

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  // L'application MJ n'ouvrait aucune connexion : plusieurs composants posaient
  // des écouteurs sur un socket jamais connecté. Connexion unique, ici.
  useEffect(() => {
    if (!activeCampaignId || !accessToken) return;
    const releaseSocket = acquireSocket({ token: accessToken });
    const stopAutoJoin = autoJoinCampaignRoom(activeCampaignId);
    return () => {
      stopAutoJoin();
      releaseSocket();
    };
  }, [activeCampaignId, accessToken]);

  // Raccourci global : la touche M ouvre le cockpit, où que l'on soit.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.isContentEditable) {
        return;
      }
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleDeckDrawer();
      }
      if (e.key === 'Escape' && isDeckDrawerOpen) {
        toggleDeckDrawer(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleDeckDrawer, isDeckDrawerOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const campaign = campaigns.find((c) => c.id === activeCampaignId);
  const navGroups = activeCampaignId ? buildNavGroups(activeCampaignId) : [];

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  };

  return (
    <div className="gm-layout" style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <aside style={{
        width: '264px',
        flexShrink: 0,
        backgroundColor: 'var(--paper-raised)',
        borderRight: '1px solid var(--rule)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* En-tête */}
        <div style={{
          padding: 'var(--space-4) var(--space-4) var(--space-3)',
          borderBottom: '1px solid var(--rule)',
        }}>
          <div style={{
            fontFamily: 'var(--font-title)',
            fontSize: 'var(--text-lg)',
            fontWeight: 600,
            color: 'var(--ink)',
            letterSpacing: '-0.01em',
          }}>
            GM Helper
          </div>
          {campaign && (
            <div style={{
              marginTop: '2px',
              fontSize: 'var(--text-xs)',
              color: 'var(--ink-faint)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {campaign.name}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-3) var(--space-2)' }}>
          <Link
            to="/gm/campaigns"
            style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
              padding: 'var(--space-2) var(--space-3)',
              marginBottom: 'var(--space-2)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
              color: location.pathname === '/gm/campaigns' ? 'var(--rust)' : 'var(--ink-muted)',
              backgroundColor: location.pathname === '/gm/campaigns' ? 'var(--primary-tint)' : 'transparent',
              fontWeight: location.pathname === '/gm/campaigns' ? 600 : 400,
            }}
          >
            <LayoutDashboard size={15} />
            Mes campagnes
          </Link>

          {navGroups.map((group) => (
            <div key={group.label} style={{ marginBottom: 'var(--space-4)' }}>
              <div className="label-section" style={{ padding: '0 var(--space-3)', marginBottom: 'var(--space-2)' }}>
                {group.label}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                      padding: 'var(--space-2) var(--space-3)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-sm)',
                      color: active ? 'var(--rust)' : 'var(--ink-muted)',
                      backgroundColor: active ? 'var(--primary-tint)' : 'transparent',
                      fontWeight: active ? 600 : 400,
                      transition: 'background-color var(--motion-fast), color var(--motion-fast)',
                    }}
                  >
                    <Icon size={15} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Pied : identité et déconnexion */}
        {user && (
          <div style={{
            padding: 'var(--space-3) var(--space-4)',
            borderTop: '1px solid var(--rule)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-2)',
          }}>
            <span style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--ink-faint)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {user.displayName}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: '1px solid var(--rule)',
                color: 'var(--ink-muted)',
                borderRadius: 'var(--radius-sm)',
                padding: '3px 10px',
                fontSize: 'var(--text-xs)',
                flexShrink: 0,
              }}
            >
              Quitter
            </button>
          </div>
        )}

        {/* Le gestionnaire de session reste ancré en bas de la barre latérale */}
        {activeCampaignId && <SessionManager />}
      </aside>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: 'var(--paper)' }}>
        {activeCampaignId && (
          <>
            <header style={{
              padding: 'var(--space-3) var(--space-5)',
              borderBottom: '1px solid var(--rule)',
              backgroundColor: 'var(--paper-raised)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 'var(--space-4)',
              flexShrink: 0,
            }}>
              {/* Accès au cockpit et à la réserve de Menace */}
              <button
                onClick={() => toggleDeckDrawer()}
                title="Ouvrir le cockpit MJ (raccourci : M)"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--danger-border)',
                  backgroundColor: 'var(--danger-tint)',
                  color: 'var(--danger)',
                  fontWeight: 600,
                  fontSize: 'var(--text-sm)',
                }}
              >
                <Flame size={16} />
                <span>
                  Menace&nbsp;
                  <span className="data" style={{ fontSize: 'var(--text-base)' }}>{doomPool}</span>
                </span>
                {activeComplications?.length > 0 && (
                  <span className="data" style={{
                    fontSize: 'var(--text-2xs)',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--danger-tint-strong)',
                  }}>
                    {activeComplications.length} en cours
                  </span>
                )}
                <span className="data" style={{
                  fontSize: 'var(--text-2xs)',
                  padding: '1px 5px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--overlay-soft)',
                  color: 'var(--ink-faint)',
                }}>
                  M
                </span>
              </button>

              <GlobalSearch />
            </header>
            <ActiveComplicationsBanner />
          </>
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
            <Route path="/campaigns/:campaignId/bestiary" element={<BestiaryManager />} />
            <Route path="/campaigns/:campaignId/items" element={<ItemsManager />} />
            <Route path="/campaigns/:campaignId/tags" element={<TagManager />} />
            <Route path="/campaigns/:campaignId/exports" element={<PrintStudio />} />
            <Route path="/campaigns/:campaignId/convoys" element={<ConvoyManager />} />
            <Route path="/campaigns/:campaignId/vehicles" element={<VehiclesList />} />
            <Route path="/campaigns/:campaignId/vehicles/:vehicleId" element={<VehicleSheet />} />
          </Routes>
        </div>
      </main>

      <GmDeckDrawer />
      <ToastContainer />
    </div>
  );
}
