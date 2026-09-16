import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';
import socket, { acquireSocket } from '../../utils/socket';

// Écran de table — projeté sur une télévision en bout de table.
//
// Direction artistique : « projection de fortune ». L'image est celle d'un
// moniteur récupéré, alimenté par un groupe électrogène fatigué — grain, léger
// balayage, vignettage. Palette de sable et d'ambre sur un fond de métal
// poussiéreux, parce que l'univers est un monde sans espoir et que la lumière
// y est rare.
//
// Contraintes de conception :
//  - lu à plusieurs mètres : grandes tailles, fort contraste, peu d'éléments ;
//  - purement passif : aucune interaction, l'écran se met à jour tout seul ;
//  - aucun point de vie affiché : les joueurs tiennent leur fiche papier, et
//    l'écran ne montre que l'ordre d'initiative.
const PALETTE = {
  base: '#0a0908',
  ink: '#ece5d8',
  muted: '#8a8175',
  amber: '#d99a3f',
  amberBright: '#f0b755',
  danger: '#e0483a',
};

function formatClock(seconds) {
  const safe = Math.max(0, seconds);
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function TableScreenView() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [activeSpotlight, setActiveSpotlight] = useState(null);
  const [scene, setScene] = useState(null);
  const [encounter, setEncounter] = useState(null);
  const [timers, setTimers] = useState([]);
  const [error, setError] = useState(null);
  const [now, setNow] = useState(() => Date.now());

  // ─── Chargement initial ───────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await api.get(`/api/v1/table-screen/${token}`);
        if (cancelled) return;
        setData(res);
        setScene(res.scene || null);
        setEncounter(res.encounter || null);
        setTimers(res.timers || []);
        setActiveSpotlight((res.broadcasts || []).find((b) => b.isActive) || null);
      } catch (err) {
        if (!cancelled) setError('Jeton invalide ou session close.');
      }
    }

    load();
    return () => { cancelled = true; };
  }, [token]);

  // ─── Temps réel ───────────────────────────────────────────────────
  useEffect(() => {
    if (!token) return;

    const releaseSocket = acquireSocket({ token, isTableScreen: true });

    const handleSpotlight = (payload) => setActiveSpotlight(payload);
    const handleSpotlightClear = () => setActiveSpotlight(null);

    const handleScene = (payload) => {
      if (payload && payload.scene !== undefined) setScene(payload.scene);
    };

    const handleEncounter = (payload) => {
      if (payload && payload.encounter) setEncounter(payload.encounter);
    };

    const handleTimerStarted = (payload) => {
      setTimers((prev) => {
        const next = prev.filter((t) => t.nodeId !== payload.nodeId);
        return [...next, { ...payload, expiresAt: payload.expiresAt }];
      });
    };

    const handleTimerCleared = (payload) => {
      setTimers((prev) => prev.filter((t) => t.nodeId !== payload.nodeId));
    };

    socket.on('spotlight_update', handleSpotlight);
    socket.on('spotlight_clear', handleSpotlightClear);
    socket.on('table_scene_changed', handleScene);
    socket.on('encounter_state_changed', handleEncounter);
    socket.on('encounter_state_changed_public', handleEncounter);
    socket.on('quest_node_timer_started', handleTimerStarted);
    socket.on('quest_node_timer_cleared', handleTimerCleared);

    return () => {
      socket.off('spotlight_update', handleSpotlight);
      socket.off('spotlight_clear', handleSpotlightClear);
      socket.off('table_scene_changed', handleScene);
      socket.off('encounter_state_changed', handleEncounter);
      socket.off('encounter_state_changed_public', handleEncounter);
      socket.off('quest_node_timer_started', handleTimerStarted);
      socket.off('quest_node_timer_cleared', handleTimerCleared);
      releaseSocket();
    };
  }, [token]);

  // ─── Décompte ─────────────────────────────────────────────────────
  // Un seul intervalle pour tous les minuteurs : chaque minuteur n'a plus à
  // maintenir son propre état, et rien ne se décale.
  useEffect(() => {
    if (timers.length === 0) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [timers.length]);

  const liveTimers = useMemo(
    () => timers
      .map((t) => ({ ...t, remaining: Math.max(0, Math.floor((new Date(t.expiresAt).getTime() - now) / 1000)) }))
      .filter((t) => t.remaining > 0),
    [timers, now],
  );

  const combatActive = encounter && (encounter.phase === 'active' || encounter.status === 'active');

  // Priorité d'affichage : ce que le MJ pousse explicitement, puis la scène
  // courante de la quête. L'image de la quête sert de dernier recours.
  const heroImage = activeSpotlight?.imageUrl || scene?.imageUrl || null;
  const isBanner = activeSpotlight && !activeSpotlight.imageUrl && activeSpotlight.text;

  if (error) {
    return (
      <Frame>
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.5rem' }}>
          <p style={{ fontSize: '1.4rem', color: PALETTE.danger, letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
            {error}
          </p>
          <p style={{ fontSize: '1rem', color: PALETTE.muted, margin: 0 }}>
            Vérifiez le lien affiché dans le gestionnaire de session.
          </p>
        </div>
      </Frame>
    );
  }

  if (!data) {
    return (
      <Frame>
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontSize: '1.2rem', color: PALETTE.muted, letterSpacing: '0.3em', textTransform: 'uppercase', margin: 0 }}>
            Connexion à la table
          </p>
        </div>
      </Frame>
    );
  }

  return (
    <Frame>
      {/* Image de fond plein cadre */}
      {heroImage && !isBanner && (
        <div
          key={heroImage}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("${heroImage}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            animation: 'tsDrift 40s ease-in-out infinite alternate',
          }}
        />
      )}

      {/* Voile de lisibilité : assombrit le bas et les bords pour que le texte
          reste lisible quelle que soit l'image projetée. */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(to top, ${PALETTE.base} 2%, rgba(10,9,8,0.82) 26%, rgba(10,9,8,0.25) 62%, rgba(10,9,8,0.6) 100%)`,
      }} />

      {/* ─── Minuteurs ─────────────────────────────────────────── */}
      {liveTimers.length > 0 && (
        <div style={{
          position: 'absolute', top: '3rem', right: '3rem', zIndex: 30,
          display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'flex-end',
        }}>
          {liveTimers.map((timer) => {
            const urgent = timer.remaining < 30;
            return (
              <div
                key={timer.nodeId}
                style={{
                  border: `2px solid ${urgent ? PALETTE.danger : PALETTE.amber}`,
                  borderRadius: '4px',
                  padding: '1rem 1.75rem',
                  backgroundColor: 'rgba(10,9,8,0.82)',
                  textAlign: 'right',
                  animation: urgent ? 'tsPulse 1s ease-in-out infinite' : 'none',
                }}
              >
                <div style={{ fontSize: '0.95rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: urgent ? PALETTE.danger : PALETTE.amber, marginBottom: '0.35rem' }}>
                  {timer.title}
                </div>
                <div style={{
                  fontSize: '4.5rem', fontWeight: 700, lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                  color: urgent ? PALETTE.danger : PALETTE.ink,
                }}>
                  {formatClock(timer.remaining)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Contenu principal ─────────────────────────────────── */}
      <div style={{
        position: 'relative', zIndex: 20, flex: 1,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '0 6vw 4rem',
      }}>
        {isBanner ? (
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <p style={{
              fontSize: 'clamp(2rem, 4.4vw, 3.6rem)',
              lineHeight: 1.35,
              color: PALETTE.ink,
              textAlign: 'center',
              maxWidth: '26ch',
              margin: 0,
              borderTop: '1px solid rgba(217,154,63,0.35)',
              borderBottom: '1px solid rgba(217,154,63,0.35)',
              padding: '2.5rem 0',
              whiteSpace: 'pre-line',
            }}>
              {activeSpotlight.text}
            </p>
          </div>
        ) : (
          <>
            {scene && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.9rem' }}>
                  {scene.displayCode && (
                    <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: '1.05rem', color: PALETTE.amber, letterSpacing: '0.16em' }}>
                      {scene.displayCode}
                    </span>
                  )}
                  <span style={{ width: '3rem', height: '1px', backgroundColor: 'rgba(217,154,63,0.45)' }} />
                  {scene.questName && (
                    <span style={{ fontSize: '0.95rem', color: PALETTE.muted, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                      {scene.questName}
                    </span>
                  )}
                </div>

                <h1 style={{
                  fontSize: 'clamp(2.4rem, 5.2vw, 4.4rem)',
                  fontWeight: 600,
                  lineHeight: 1.08,
                  letterSpacing: '-0.015em',
                  color: PALETTE.ink,
                  margin: '0 0 1.5rem',
                  maxWidth: '24ch',
                }}>
                  {scene.title}
                </h1>

                {scene.sensoryText && (
                  <p style={{
                    fontSize: 'clamp(1.15rem, 1.7vw, 1.6rem)',
                    lineHeight: 1.65,
                    color: '#cdc4b4',
                    maxWidth: '62ch',
                    margin: 0,
                    whiteSpace: 'pre-line',
                  }}>
                    {scene.sensoryText}
                  </p>
                )}
              </>
            )}

            {!scene && !heroImage && (
              <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.5rem' }}>
                <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 500, color: PALETTE.ink, margin: 0, letterSpacing: '-0.01em' }}>
                  {data.campaign?.name}
                </h1>
                <p style={{ fontSize: '1rem', color: PALETTE.muted, letterSpacing: '0.28em', textTransform: 'uppercase', margin: 0 }}>
                  En attente de la première scène
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* ─── Ordre d'initiative ────────────────────────────────── */}
      {/* Ni points de vie, ni classe d'armure : l'écran montre qui agit et
          quand, les chiffres restent sur les fiches papier. */}
      {combatActive && (
        <div style={{
          position: 'relative', zIndex: 25,
          borderTop: '1px solid rgba(217,154,63,0.3)',
          backgroundColor: 'rgba(10,9,8,0.9)',
          padding: '1.5rem 3rem 1.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.05rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: PALETTE.amber }}>
              Round {encounter.currentRound || 1}
            </span>
            <span style={{ fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: PALETTE.muted }}>
              Ordre d'initiative
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
            {(encounter.combatants || []).map((c, idx) => {
              const isCurrent = idx === encounter.currentTurnIndex;
              return (
                <div
                  key={c.id || idx}
                  style={{
                    flexShrink: 0,
                    padding: '0.7rem 1.4rem',
                    borderRadius: '3px',
                    border: isCurrent ? `2px solid ${PALETTE.amberBright}` : '1px solid rgba(236,229,216,0.14)',
                    backgroundColor: isCurrent ? 'rgba(217,154,63,0.16)' : 'rgba(236,229,216,0.04)',
                    color: isCurrent ? PALETTE.ink : '#a49a8c',
                    fontSize: '1.25rem',
                    fontWeight: isCurrent ? 600 : 400,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.7rem',
                    animation: isCurrent ? 'tsPulse 2.4s ease-in-out infinite' : 'none',
                  }}
                >
                  <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: '0.95rem', color: isCurrent ? PALETTE.amberBright : PALETTE.muted }}>
                    {idx + 1}
                  </span>
                  <span>{c.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Bandeau d'état ────────────────────────────────────── */}
      <div style={{
        position: 'relative', zIndex: 25,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.85rem 3rem',
        borderTop: '1px solid rgba(236,229,216,0.08)',
        fontSize: '0.8rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: PALETTE.muted,
      }}>
        <span>{data.campaign?.name}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{
            width: '7px', height: '7px', borderRadius: '50%',
            backgroundColor: PALETTE.amber,
            animation: 'tsBlink 3s ease-in-out infinite',
          }} />
          En direct
        </span>
      </div>
    </Frame>
  );
}

/**
 * Enveloppe commune : fond, texture de grain, balayage, vignettage.
 * Ces effets donnent l'impression d'un écran de récupération ; ils sont
 * désactivés si le système demande de réduire les animations.
 */
function Frame({ children }) {
  return (
    <div style={{
      position: 'relative',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      backgroundColor: PALETTE.base,
      color: PALETTE.ink,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Inter', 'Roboto', system-ui, sans-serif",
    }}>
      <style>{`
        @keyframes tsDrift {
          from { transform: scale(1.02) translate3d(0, 0, 0); }
          to   { transform: scale(1.09) translate3d(-1.2%, -1.4%, 0); }
        }
        @keyframes tsGrain {
          from { background-position: 0 0; }
          to   { background-position: 180px 180px; }
        }
        @keyframes tsSweep {
          from { transform: translateY(-12vh); }
          to   { transform: translateY(112vh); }
        }
        @keyframes tsPulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.62; }
        }
        @keyframes tsBlink {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.25; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ts-anim { animation: none !important; }
        }
      `}</style>

      {/* Grain : texture fixe déplacée lentement, peu coûteuse pour un téléviseur */}
      <div className="ts-anim" style={{
        position: 'absolute',
        inset: '-100px',
        pointerEvents: 'none',
        opacity: 0.05,
        zIndex: 40,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E\")",
        animation: 'tsGrain 0.9s steps(4) infinite',
      }} />

      {/* Balayage vertical, très discret */}
      <div className="ts-anim" style={{
        position: 'absolute',
        left: 0,
        right: 0,
        height: '12vh',
        pointerEvents: 'none',
        zIndex: 41,
        background: 'linear-gradient(to bottom, transparent, rgba(236,229,216,0.035), transparent)',
        animation: 'tsSweep 11s linear infinite',
      }} />

      {/* Vignettage : ramène le regard au centre de la table */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 42,
        background: 'radial-gradient(ellipse at center, transparent 42%, rgba(0,0,0,0.55) 100%)',
      }} />

      {children}
    </div>
  );
}
