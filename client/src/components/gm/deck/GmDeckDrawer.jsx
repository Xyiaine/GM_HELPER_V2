import React from 'react';
import { useGmStore } from '../../../store/gmStore';
import DoomPoolWidget from './DoomPoolWidget';
import HazardCardsTab from './HazardCardsTab';
import NpcCardsTab from './NpcCardsTab';
import IntrigueCardsTab from './IntrigueCardsTab';
import HiddenRollsTab from './HiddenRollsTab';
import { X, Flame, Users, Scroll, Layers, Eye } from 'lucide-react';

export default function GmDeckDrawer() {
  const {
    isDeckDrawerOpen,
    toggleDeckDrawer,
    activeDeckTab,
    setActiveDeckTab,
    activeCampaignId
  } = useGmStore();

  if (!isDeckDrawerOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => toggleDeckDrawer(false)}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'var(--paper-inset)',
          backdropFilter: 'blur(3px)',
          zIndex: 9998,
          transition: 'opacity 0.25s ease'
        }}
      />

      {/* Drawer Panel */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '540px',
          maxWidth: '92vw',
          backgroundColor: 'var(--color-surface, #1e1e1e)',
          borderLeft: '1px solid var(--color-border)',
          boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>

        {/* Drawer Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'rgba(15, 15, 15, 0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="var(--color-primary, #6366f1)" />
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)' }}>
              Cockpit & Multi-Decks MJ
            </h2>
            <span style={{
              fontSize: '0.7rem',
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: 'var(--overlay-subtle)',
              color: 'var(--color-text-muted)',
              fontFamily: 'monospace'
            }}>
              Touche [M]
            </span>
          </div>

          <button
            onClick={() => toggleDeckDrawer(false)}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: '6px',
              transition: 'background-color 0.15s'
            }}
            title="Fermer le tiroir (Échap ou M)"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Always Visible Doom Pool Widget */}
          <DoomPoolWidget />

          {/* Tab Navigation — deux colonnes, quatre onglets */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            backgroundColor: 'var(--color-background)',
            padding: '4px',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
            gap: '4px',
            flexShrink: 0
          }}>
            <button
              onClick={() => setActiveDeckTab('hazard')}
              style={{
                flex: 1,
                padding: '8px 6px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeDeckTab === 'hazard' ? 'var(--color-primary)' : 'transparent',
                color: activeDeckTab === 'hazard' ? '#fff' : 'var(--color-text-muted)',
                fontWeight: activeDeckTab === 'hazard' ? 600 : 400,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                transition: 'all 0.15s ease'
              }}
            >
              <Flame size={14} /> Dangers & Menaces
            </button>

            <button
              onClick={() => setActiveDeckTab('npc')}
              style={{
                flex: 1,
                padding: '8px 6px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeDeckTab === 'npc' ? 'var(--color-primary)' : 'transparent',
                color: activeDeckTab === 'npc' ? '#fff' : 'var(--color-text-muted)',
                fontWeight: activeDeckTab === 'npc' ? 600 : 400,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                transition: 'all 0.15s ease'
              }}
            >
              <Users size={14} /> PNJ Express
            </button>

            <button
              onClick={() => setActiveDeckTab('intrigue')}
              style={{
                flex: 1,
                padding: '8px 6px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeDeckTab === 'intrigue' ? 'var(--color-primary)' : 'transparent',
                color: activeDeckTab === 'intrigue' ? '#fff' : 'var(--color-text-muted)',
                fontWeight: activeDeckTab === 'intrigue' ? 600 : 400,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                transition: 'all 0.15s ease'
              }}
            >
              <Scroll size={14} /> Intrigues & Rumeurs
            </button>

            <button
              onClick={() => setActiveDeckTab('hidden')}
              style={{
                padding: '8px 6px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeDeckTab === 'hidden' ? 'var(--color-primary)' : 'transparent',
                color: activeDeckTab === 'hidden' ? '#fff' : 'var(--color-text-muted)',
                fontWeight: activeDeckTab === 'hidden' ? 600 : 400,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                transition: 'all 0.15s ease'
              }}
            >
              <Eye size={14} /> Jets cachés
            </button>
          </div>

          {/* Active Tab Content */}
          <div>
            {activeDeckTab === 'hazard' && <HazardCardsTab />}
            {activeDeckTab === 'npc' && <NpcCardsTab />}
            {activeDeckTab === 'intrigue' && <IntrigueCardsTab />}
            {activeDeckTab === 'hidden' && <HiddenRollsTab />}
          </div>
        </div>
      </aside>
    </>
  );
}
