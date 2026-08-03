import React, { useEffect, useState } from 'react';
import { usePlayerStore } from '../../store/playerStore';
import useAuthStore from '../../store/authStore';
import socket from '../../utils/socket';
import { Radio, AlertCircle, MessageSquare } from 'lucide-react';

export default function LiveSession({ campaignId }) {
  const { session, fetchSession } = usePlayerStore();
  const { accessToken } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [spotlight, setSpotlight] = useState(null);
  const [timers, setTimers] = useState([]);

  // Timer countdown effect
  useEffect(() => {
    if (timers.length === 0) return;
    const interval = setInterval(() => {
      setTimers(currentTimers => 
        currentTimers.map(t => {
          const remaining = Math.max(0, Math.floor((new Date(t.expiresAt).getTime() - Date.now()) / 1000));
          return { ...t, remaining };
        }).filter(t => t.remaining > 0)
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [timers.length]);

  useEffect(() => {
    if (campaignId) {
      fetchSession(campaignId);
    }
  }, [campaignId, fetchSession]);

  useEffect(() => {
    if (!campaignId || !accessToken) return;

    // Connect socket
    socket.auth = { token: accessToken };
    socket.connect();

    socket.emit('join:campaign', campaignId);

    const handleMessage = (data) => {
      setMessages(prev => [...prev, data]);
    };

    const handleSessionStarted = () => {
      fetchSession(campaignId);
    };

    const handleSessionEnded = () => {
      fetchSession(campaignId);
    };

    const handleSpotlightUpdate = (data) => {
      setSpotlight(data);
    };

    const handleSpotlightClear = () => {
      setSpotlight(null);
    };

    const handleTimerStarted = (data) => {
      setTimers(prev => {
        const filtered = prev.filter(t => t.nodeId !== data.nodeId);
        return [...filtered, { ...data, remaining: data.duration }];
      });
    };

    const handleTimerCleared = (data) => {
      setTimers(prev => prev.filter(t => t.nodeId !== data.nodeId));
    };

    const [combatState, setCombatState] = useState(null);

    const handleEncounterState = (data) => {
      if (data && data.encounter) {
        setCombatState(data.encounter);
      }
    };

    socket.on('session:message', handleMessage);
    socket.on('session:started', handleSessionStarted);
    socket.on('session:ended', handleSessionEnded);
    socket.on('spotlight_update', handleSpotlightUpdate);
    socket.on('spotlight_clear', handleSpotlightClear);
    socket.on('quest_node_timer_started', handleTimerStarted);
    socket.on('quest_node_timer_cleared', handleTimerCleared);
    socket.on('encounter_state_changed', handleEncounterState);

    return () => {
      socket.off('session:message', handleMessage);
      socket.off('session:started', handleSessionStarted);
      socket.off('session:ended', handleSessionEnded);
      socket.off('spotlight_update', handleSpotlightUpdate);
      socket.off('spotlight_clear', handleSpotlightClear);
      socket.off('quest_node_timer_started', handleTimerStarted);
      socket.off('quest_node_timer_cleared', handleTimerCleared);
      socket.off('encounter_state_changed', handleEncounterState);
      socket.disconnect();
    };
  }, [campaignId, accessToken, fetchSession]);

  if (!session) return <div className="loading-screen">Checking session...</div>;

  if (session.status !== 'live') {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        <Radio size={48} style={{ opacity: 0.5, margin: '0 auto 16px' }} />
        <h2 style={{ color: 'var(--color-text)' }}>No Active Session</h2>
        <p>Your GM has not started a live session yet.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '16px', paddingBottom: '80px' }}>
      <header style={{ 
        backgroundColor: 'var(--danger, #ef4444)', 
        color: 'white', 
        padding: '16px', 
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
      }}>
        <Radio size={24} className="pulse-animation" />
        <div>
          <h2 style={{ margin: 0, color: 'white' }}>Session Live</h2>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem' }}>Campaign is active</p>
        </div>
      </header>

      {session.activeEncounterId && (
        <section style={{ 
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          padding: '20px', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: 'var(--color-text)', margin: '0 0 8px 0' }}>Combat Active</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>Encounter is ongoing. Please check with your GM.</p>
        </section>
      )}

      {timers.length > 0 && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {timers.map(timer => {
            const mins = Math.floor(timer.remaining / 60);
            const secs = timer.remaining % 60;
            const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;
            const isUrgent = timer.remaining < 30;

            return (
              <div key={timer.nodeId} style={{ 
                backgroundColor: isUrgent ? 'rgba(239, 68, 68, 0.2)' : 'var(--color-surface)',
                border: `1px solid ${isUrgent ? 'var(--danger, #ef4444)' : 'var(--warning, #f59e0b)'}`,
                padding: '16px', 
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: isUrgent ? '0 0 12px rgba(239, 68, 68, 0.5)' : 'none'
              }}>
                <div>
                  <h3 style={{ color: 'var(--color-text)', margin: '0 0 4px 0' }}>{timer.title}</h3>
                  <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '0.85rem' }}>Le temps presse...</p>
                </div>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold', 
                  fontFamily: 'monospace',
                  color: isUrgent ? 'var(--danger, #ef4444)' : 'var(--warning, #f59e0b)'
                }}>
                  {timeStr}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {spotlight && (
        <section style={{ 
          backgroundColor: 'var(--color-surface)',
          border: '2px solid var(--color-primary)',
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '16px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)'
        }}>
          <h3 style={{ color: 'var(--color-primary-light)', margin: '0 0 16px 0', alignSelf: 'flex-start' }}>GM Spotlight</h3>
          
          {(spotlight.contentType === 'image' || spotlight.contentType === 'banner') && spotlight.imageUrl && (
            <img 
              src={spotlight.imageUrl} 
              alt="Spotlight" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '400px', 
                objectFit: 'contain',
                borderRadius: '4px'
              }} 
            />
          )}
          
          {spotlight.text && (
            <div style={{
              marginTop: '16px',
              padding: '12px 24px',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              fontSize: '1.2rem',
              textAlign: 'center',
              color: 'var(--color-text)'
            }}>
              {spotlight.text}
            </div>
          )}
        </section>
      )}

      <section style={{ backgroundColor: 'var(--color-surface)', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)', flex: 1 }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)', margin: '0 0 16px 0' }}>
          <MessageSquare size={18} /> GM Broadcasts
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '20px' }}>
              Waiting for messages from GM...
            </p>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} style={{ backgroundColor: 'var(--color-background)', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-primary)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 'bold', marginBottom: '4px' }}>
                  {msg.from || 'GM'} • {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
                <div style={{ color: 'var(--color-text)' }}>{msg.message}</div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
