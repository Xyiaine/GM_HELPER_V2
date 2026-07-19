import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';
import socket from '../../utils/socket';
import { Camera } from 'lucide-react';

export default function TableScreenView() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [activeSpotlight, setActiveSpotlight] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [timers, setTimers] = useState([]);
  const [error, setError] = useState(null);

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
    async function loadData() {
      try {
        const res = await api.get(`/api/v1/table-screen/${token}`);
        setData(res);
        const active = res.broadcasts?.find(b => b.isActive);
        setActiveSpotlight(active || null);
        setGallery(res.broadcasts || []);
      } catch (err) {
        setError('Jeton invalide ou expiré.');
      }
    }
    loadData();
  }, [token]);

  useEffect(() => {
    if (!token) return;

    // Connect with token in auth
    socket.auth = { tableScreenToken: token };
    socket.connect();

    // Rejoin the room
    socket.emit('join:table_screen', token);

    const handleSpotlight = (payload) => {
      setActiveSpotlight(payload);
      setGallery(prev => [payload, ...prev.filter(b => b.id !== payload.id)]);
    };
    
    const handleClearSpotlight = () => {
      setActiveSpotlight(null);
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

    socket.on('spotlight_update', handleSpotlight);
    socket.on('spotlight_clear', handleClearSpotlight);
    socket.on('quest_node_timer_started', handleTimerStarted);
    socket.on('quest_node_timer_cleared', handleTimerCleared);

    return () => {
      socket.off('spotlight_update', handleSpotlight);
      socket.off('spotlight_clear', handleClearSpotlight);
      socket.off('quest_node_timer_started', handleTimerStarted);
      socket.off('quest_node_timer_cleared', handleTimerCleared);
      socket.disconnect();
    };
  }, [token]);

  if (error) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: 'var(--error, #ef4444)' }}>
        <h2>{error}</h2>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: 'white' }}>
        Connexion à la table...
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      width: '100vw', 
      backgroundColor: '#000', 
      color: 'white',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {!activeSpotlight ? (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
          <Camera size={64} style={{ marginBottom: '24px' }} />
          <h1>{data.session?.campaign?.name || 'Session Live'}</h1>
          <p>En attente d'une diffusion du MJ...</p>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', paddingBottom: gallery.length > 0 ? '120px' : '24px' }}>
          {(activeSpotlight.contentType === 'image' || activeSpotlight.contentType === 'banner') && activeSpotlight.imageUrl && (
            <img 
              src={activeSpotlight.imageUrl} 
              alt="Spotlight" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%', 
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.8)'
              }} 
            />
          )}
        </div>
      )}

      {timers.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          zIndex: 100
        }}>
          {timers.map(timer => {
            const mins = Math.floor(timer.remaining / 60);
            const secs = timer.remaining % 60;
            const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;
            const isUrgent = timer.remaining < 30;

            return (
              <div key={timer.nodeId} style={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                border: `2px solid ${isUrgent ? '#ef4444' : '#f59e0b'}`,
                padding: '16px 24px', 
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: isUrgent ? '0 0 20px rgba(239, 68, 68, 0.8)' : '0 4px 12px rgba(0,0,0,0.5)',
                backdropFilter: 'blur(8px)',
                animation: isUrgent ? 'pulse 1s infinite' : 'none'
              }}>
                <h3 style={{ color: 'white', margin: '0 0 8px 0', fontSize: '1.2rem' }}>{timer.title}</h3>
                <div style={{ 
                  fontSize: '3rem', 
                  fontWeight: 'bold', 
                  fontFamily: 'monospace',
                  color: isUrgent ? '#ef4444' : '#f59e0b',
                  textShadow: '0 2px 8px rgba(0,0,0,0.8)'
                }}>
                  {timeStr}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {gallery.length > 0 && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '100px',
          backgroundColor: 'rgba(0,0,0,0.8)',
          borderTop: '1px solid #333',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '0 24px',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}>
          {gallery.filter(b => b.imageUrl).map(b => (
            <img
              key={b.id}
              src={b.imageUrl}
              alt="Gallery item"
              onClick={() => setActiveSpotlight(b)}
              style={{
                height: '80px',
                width: '120px',
                objectFit: 'cover',
                borderRadius: '4px',
                cursor: 'pointer',
                opacity: activeSpotlight?.id === b.id ? 1 : 0.5,
                border: activeSpotlight?.id === b.id ? '2px solid var(--color-primary)' : '2px solid transparent',
                transition: 'all 0.2s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
