import React, { useState, useEffect } from 'react';
import { useGmStore } from '../../store/gmStore';
import api from '../../utils/api';
import socket from '../../utils/socket';
import { Radio, MessageSquare, Play, Square, Camera, Link as LinkIcon, Target, CheckCircle, PauseCircle, FileText, Users, Copy } from 'lucide-react';
import { notify } from '../../store/notificationStore';
import SpotlightController from './SpotlightController';
import SessionRecapModal from './SessionRecapModal';

export default function SessionManager() {
  const { activeCampaignId, quests, fetchQuests, updateQuest } = useGmStore();
  const [session, setSession] = useState(null);
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [showQuickNote, setShowQuickNote] = useState(false);
  const [quickNoteMsg, setQuickNoteMsg] = useState('');
  const [activePlayers, setActivePlayers] = useState([]);
  const [showRecapModal, setShowRecapModal] = useState(false);

  useEffect(() => {
    if (activeCampaignId) {
      checkActiveSession();
      fetchQuests(activeCampaignId);
    }
  }, [activeCampaignId, fetchQuests]);

  useEffect(() => {
    if (session) {
      // Fetch initial players
      api.get(`/api/v1/gm/campaigns/${activeCampaignId}/sessions/${session.id}/players`)
        .then(res => setActivePlayers(res.data.players || []))
        .catch(err => console.error('Error fetching players', err));

      const handlePlayerJoined = (player) => {
        setActivePlayers(prev => [...prev.filter(p => p.userId !== player.userId), player]);
      };
      const handlePlayerLeft = (player) => {
        setActivePlayers(prev => prev.filter(p => p.userId !== player.userId));
      };

      socket.on('player_joined', handlePlayerJoined);
      socket.on('player_left', handlePlayerLeft);

      return () => {
        socket.off('player_joined', handlePlayerJoined);
        socket.off('player_left', handlePlayerLeft);
      };
    } else {
      setActivePlayers([]);
    }
  }, [session, activeCampaignId]);

  const activeQuests = quests?.filter(q => q.status === 'active' || q.status === 'paused') || [];

  const checkActiveSession = async () => {
    try {
      const data = await api.get(`/api/v1/gm/campaigns/${activeCampaignId}/sessions/status/active`);
      setSession(data.session);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartSession = async (mode) => {
    try {
      const data = await api.post(`/api/v1/gm/campaigns/${activeCampaignId}/sessions`, {
        status: 'live',
        scheduledFor: new Date().toISOString(),
        mode
      });
      setSession(data.session);
      setShowStartMenu(false);
    } catch (err) {
      console.error(err);
      notify.error(err.response?.data?.error || 'Erreur au démarrage de la séance');
    }
  };

  const handleEndSession = () => {
    if (!session) return;
    setShowRecapModal(true);
  };

  const confirmEndSession = async () => {
    if (!session) return;
    try {
      await api.put(`/api/v1/gm/campaigns/${activeCampaignId}/sessions/${session.id}`, {
        status: 'ended'
      });
      setSession(null);
      setShowBroadcast(false);
      setShowRecapModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastMsg.trim() || !session) return;
    try {
      await api.post(`/api/v1/gm/campaigns/${activeCampaignId}/sessions/${session.id}/message`, {
        message: broadcastMsg
      });
      setBroadcastMsg('');
      setShowBroadcast(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickNote = async (e) => {
    e.preventDefault();
    if (!quickNoteMsg.trim()) return;
    try {
      await api.post(`/api/v1/gm/campaigns/${activeCampaignId}/notes`, {
        title: `Note rapide - ${new Date().toLocaleString()}`,
        content: quickNoteMsg
      });
      setQuickNoteMsg('');
      setShowQuickNote(false);
      notify.success('Note enregistrée');
    } catch (err) {
      console.error(err);
      notify.error('Erreur lors de l\'enregistrement de la note');
    }
  };

  if (!activeCampaignId) return null;

  return (
    <div style={{ padding: '16px', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.9rem', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Radio size={16} color={session ? 'var(--danger, #ef4444)' : 'var(--color-text-muted)'} />
          {session ? 'Session Live' : 'Offline'}
        </span>
        {session ? (
          <button onClick={handleEndSession} style={{ background: 'transparent', border: '1px solid var(--danger, #ef4444)', color: 'var(--danger, #ef4444)', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
            <Square size={12} /> End
          </button>
        ) : (
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowStartMenu(!showStartMenu)} style={{ background: 'transparent', border: '1px solid var(--success, #10b981)', color: 'var(--success, #10b981)', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
              <Play size={12} /> Start
            </button>
            {showStartMenu && (
              <div style={{ position: 'absolute', bottom: '100%', right: 0, marginBottom: '8px', padding: '8px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 10 }}>
                <button className="btn-secondary" onClick={() => handleStartSession('remote')} style={{ fontSize: '0.8rem', padding: '4px 8px', whiteSpace: 'nowrap' }}>Remote Mode</button>
                <button className="btn-secondary" onClick={() => handleStartSession('in_person')} style={{ fontSize: '0.8rem', padding: '4px 8px', whiteSpace: 'nowrap' }}>In-Person (Table Screen)</button>
              </div>
            )}
          </div>
        )}
      </div>

      {session && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--color-primary-light)', paddingBottom: '4px', borderBottom: '1px solid var(--color-border)' }}>
          <Users size={14} /> 
          <span>Joueurs connectés: <strong>{activePlayers.length}</strong></span>
          {activePlayers.length > 0 && (
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
              ({activePlayers.map(p => p.displayName).join(', ')})
            </span>
          )}
        </div>
      )}

      {session && session.mode === 'in_person' && session.tableScreenToken && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.85rem', color: 'var(--color-primary)', backgroundColor: 'var(--primary-tint-strong)', padding: '8px', borderRadius: '4px', marginBottom: '16px' }}>
          <LinkIcon size={14} />
          <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {window.location.origin}/table/{session.tableScreenToken}
          </span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/table/${session.tableScreenToken}`);
              notify.success('Lien copié dans le presse-papier');
            }}
            style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Copy size={12} /> Copier
          </button>
        </div>
      )}

      {session && (
        <div style={{ display: 'flex', gap: '8px', position: 'relative' }}>
          <button onClick={() => { setShowBroadcast(!showBroadcast); setShowSpotlight(false); setShowQuickNote(false); }} className="btn-secondary" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', fontSize: '0.85rem', padding: '4px' }}>
            <MessageSquare size={14} /> Msg
          </button>
          
          <button onClick={() => { setShowSpotlight(!showSpotlight); setShowBroadcast(false); setShowQuickNote(false); }} className="btn-secondary" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', fontSize: '0.85rem', padding: '4px' }}>
            <Camera size={14} /> Spotlight
          </button>

          <button onClick={() => { setShowQuickNote(!showQuickNote); setShowBroadcast(false); setShowSpotlight(false); }} className="btn-secondary" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', fontSize: '0.85rem', padding: '4px' }}>
            <FileText size={14} /> Note
          </button>
          
          {showBroadcast && (
            <div style={{ position: 'absolute', bottom: '100%', left: 0, right: 0, marginBottom: '8px', padding: '12px', backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', zIndex: 100 }}>
              <form onSubmit={handleBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <textarea 
                  value={broadcastMsg}
                  onChange={e => setBroadcastMsg(e.target.value)}
                  placeholder="Message to all players..."
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', resize: 'none' }}
                  rows={3}
                />
                <button type="submit" className="btn-primary" style={{ padding: '4px' }}>Send</button>
              </form>
            </div>
          )}

          {showSpotlight && (
            <div style={{ position: 'absolute', bottom: '100%', left: 0, right: 0, marginBottom: '8px', zIndex: 100 }}>
              <SpotlightController sessionId={session.id} onClose={() => setShowSpotlight(false)} />
            </div>
          )}

          {showQuickNote && (
            <div style={{ position: 'absolute', bottom: '100%', left: 0, right: 0, marginBottom: '8px', padding: '12px', backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', zIndex: 100 }}>
              <form onSubmit={handleQuickNote} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <textarea 
                  value={quickNoteMsg}
                  onChange={e => setQuickNoteMsg(e.target.value)}
                  placeholder="Note rapide..."
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', resize: 'none' }}
                  rows={4}
                />
                <button type="submit" className="btn-primary" style={{ padding: '4px' }}>Enregistrer</button>
              </form>
            </div>
          )}
        </div>
      )}

      {session && (
        <div style={{ marginTop: '16px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
          <h4 style={{ margin: '0 0 12px 0', color: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Target size={16} /> Quêtes en cours ({activeQuests.length})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
            {activeQuests.length > 0 ? activeQuests.map(quest => (
              <div key={quest.id} style={{ background: 'var(--color-background)', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ color: 'var(--color-text)' }}>{quest.name}</strong>
                  <span style={{ fontSize: '0.75rem', color: quest.status === 'active' ? '#10b981' : '#f59e0b' }}>
                    {quest.status === 'active' ? 'Active' : 'En pause'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {quest.status === 'active' ? (
                    <button className="btn-secondary" style={{ padding: '2px 6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => updateQuest(activeCampaignId, quest.id, { status: 'paused' })}>
                      <PauseCircle size={12} /> Pause
                    </button>
                  ) : (
                    <button className="btn-secondary" style={{ padding: '2px 6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => updateQuest(activeCampaignId, quest.id, { status: 'active' })}>
                      <Play size={12} /> Reprendre
                    </button>
                  )}
                  <button className="btn-secondary" style={{ padding: '2px 6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => updateQuest(activeCampaignId, quest.id, { status: 'completed' })}>
                    <CheckCircle size={12} /> Terminer
                  </button>
                </div>
              </div>
            )) : (
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Aucune quête active.</span>
            )}
          </div>
        </div>
      )}

      {showRecapModal && session && (
        <SessionRecapModal
          isOpen={showRecapModal}
          onClose={() => setShowRecapModal(false)}
          campaignId={activeCampaignId}
          sessionId={session.id}
          onConfirmEnd={confirmEndSession}
        />
      )}
    </div>
  );
}
