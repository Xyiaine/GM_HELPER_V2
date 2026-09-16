import React, { useEffect, useState, useRef } from 'react';
import { usePlayerStore } from '../../store/playerStore';
import useAuthStore from '../../store/authStore';
import api from '../../utils/api';
import socket, { acquireSocket, autoJoinCampaignRoom } from '../../utils/socket';
import { Map as MapIcon, X } from 'lucide-react';

export default function PlayerMapView({ campaignId }) {
  const { session, fetchSession } = usePlayerStore();
  const { accessToken } = useAuthStore();
  const [revealedZones, setRevealedZones] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (campaignId) {
      fetchSession(campaignId);
      loadRevealedZones();
    }
  }, [campaignId, fetchSession]);

  const loadRevealedZones = async () => {
    try {
      const data = await api.get(`/api/v1/gm/campaigns/${campaignId}/maps/world/revealed-zones`);
      setRevealedZones(data.zones || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!campaignId || !accessToken) return;

    const releaseSocket = acquireSocket({ token: accessToken });
    const stopAutoJoin = autoJoinCampaignRoom(campaignId);

    const handleZoneRevealed = (zone) => {
      setRevealedZones(prev => [...prev.filter(z => z.id !== zone.id), zone]);
    };

    const handleZoneHidden = (payload) => {
      setRevealedZones(prev => prev.filter(z => z.id !== payload.id));
    };

    socket.on('map_zone_revealed', handleZoneRevealed);
    socket.on('map_zone_hidden', handleZoneHidden);

    return () => {
      socket.off('map_zone_revealed', handleZoneRevealed);
      socket.off('map_zone_hidden', handleZoneHidden);
      stopAutoJoin();
      releaseSocket();
    };
  }, [campaignId, accessToken]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Fill with fog (black)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw revealed zones
    // Assuming zoneData is JSON string like: { x, y, radius }
    revealedZones.forEach(zone => {
      try {
        const data = JSON.parse(zone.zoneData);
        if (data.type === 'circle') {
          // Erase the fog
          ctx.globalCompositeOperation = 'destination-out';
          ctx.beginPath();
          ctx.arc(data.x, data.y, data.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalCompositeOperation = 'source-over';
        }
      } catch (err) {
        console.error("Invalid zone data", err);
      }
    });

  }, [revealedZones]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '16px' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <MapIcon size={24} color="var(--color-primary)" />
        <h2 style={{ margin: 0, color: 'var(--color-text)' }}>Carte du Monde</h2>
      </header>
      
      <div style={{ 
        flex: 1, 
        backgroundColor: '#111', 
        borderRadius: '8px', 
        border: '1px solid var(--color-border)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Placeholder for the actual map image beneath the fog */}
        <div style={{ 
          position: 'absolute', 
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'url(https://via.placeholder.com/800x600?text=World+Map)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.5
        }} />

        <canvas 
          ref={canvasRef}
          width={800}
          height={600}
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%',
            pointerEvents: 'none'
          }}
        />
      </div>
    </div>
  );
}
