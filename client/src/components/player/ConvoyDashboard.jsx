import React, { useEffect, useState } from 'react';
import {
  Truck, AlertTriangle, Shield, Fuel, Droplets, Apple, Pill, Crosshair,
  RefreshCw, CloudRain, Users, Coffee, Wrench, Star, Bike, Car
} from 'lucide-react';
import api from '../../utils/api';
import useAuthStore from '../../store/authStore';
import socket, { acquireSocket, autoJoinCampaignRoom } from '../../utils/socket';

const SEVERITY_COLORS = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#f97316',
  critical: '#ef4444',
};

const CATEGORY_ICONS = {
  climate: CloudRain,
  encounter: Users,
  calm: Coffee,
  mechanical: Wrench,
  custom: Star,
};

const CATEGORY_LABELS = {
  climate: 'Climatique',
  encounter: 'Rencontre',
  calm: 'Calme',
  mechanical: 'Avarie',
  custom: 'Personnalisé',
};

const VEHICLE_ICONS = {
  moto: Bike,
  car: Car,
  truck: Truck,
};

export default function ConvoyDashboard({ campaignId }) {
  const [convoy, setConvoy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { accessToken } = useAuthStore();

  const fetchConvoy = async () => {
    try {
      const data = await api.get(`/api/v1/player/campaigns/${campaignId}/convoys`);
      setConvoy(data.convoys?.[0] || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!campaignId) return;
    setIsLoading(true);
    fetchConvoy();
  }, [campaignId]);

  useEffect(() => {
    if (!campaignId || !accessToken) return;

    // Uses the shared socket instance rather than opening a second connection.
    const releaseSocket = acquireSocket({ token: accessToken });
    const stopAutoJoin = autoJoinCampaignRoom(campaignId);

    const handleUpdate = () => fetchConvoy();

    socket.on('convoy_created', handleUpdate);
    socket.on('convoy_updated', handleUpdate);
    socket.on('convoy_step_changed', handleUpdate);
    socket.on('convoy_resources_updated', handleUpdate);
    socket.on('convoy_vehicle_added', handleUpdate);
    socket.on('convoy_vehicle_updated', handleUpdate);
    socket.on('convoy_vehicle_destroyed', handleUpdate);
    socket.on('convoy_completed', handleUpdate);
    socket.on('convoy_deleted', handleUpdate);

    return () => {
      socket.off('convoy_created', handleUpdate);
      socket.off('convoy_updated', handleUpdate);
      socket.off('convoy_step_changed', handleUpdate);
      socket.off('convoy_resources_updated', handleUpdate);
      socket.off('convoy_vehicle_added', handleUpdate);
      socket.off('convoy_vehicle_updated', handleUpdate);
      socket.off('convoy_vehicle_destroyed', handleUpdate);
      socket.off('convoy_completed', handleUpdate);
      socket.off('convoy_deleted', handleUpdate);
      stopAutoJoin();
      releaseSocket();
    };
  }, [campaignId, accessToken]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-muted)' }}>
        <RefreshCw size={24} className="spin" style={{ marginRight: 8 }} /> Chargement du convoi...
      </div>
    );
  }

  if (!convoy) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-muted)', padding: 20, textAlign: 'center' }}>
        <Truck size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
        <p>Aucun convoi en cours actuellement.</p>
        <p style={{ fontSize: '0.85rem' }}>Le Maître de Jeu n'a pas encore lancé de mission.</p>
      </div>
    );
  }

  const activeEvent = convoy.events?.[0]; // Since the backend filters where status: 'active', there should be at most 1

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 80 }}>
      {/* HEADER */}
      <div style={{ background: 'var(--color-surface)', padding: 20, borderRadius: 12, border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Truck size={24} /> {convoy.name}
            </h2>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              {convoy.originCity?.location?.name} → {convoy.destCity?.location?.name}
            </div>
          </div>
          <div style={{ background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', padding: '4px 12px', borderRadius: 16, fontSize: '0.85rem', fontWeight: 'bold' }}>
            En cours
          </div>
        </div>

        {/* Timeline Progress */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 6 }}>
            <span>Progression</span>
            <span>Étape {Math.max(0, convoy.currentStepIndex + 1)} / {convoy.totalSteps}</span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              background: '#6366f1',
              width: `${Math.max(0, (convoy.currentStepIndex + 1) / convoy.totalSteps * 100)}%`,
              transition: 'width 0.5s ease-out'
            }} />
          </div>
        </div>
      </div>

      {/* ACTIVE EVENT */}
      {activeEvent ? (
        <div style={{
          background: 'var(--color-surface)',
          padding: 24,
          borderRadius: 12,
          border: `1px solid ${SEVERITY_COLORS[activeEvent.severity] || 'var(--color-border)'}`,
          boxShadow: `0 0 20px ${SEVERITY_COLORS[activeEvent.severity] || '#f59e0b'}20`,
        }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>
            Événement Actuel
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{
              background: `${SEVERITY_COLORS[activeEvent.severity]}20`,
              color: SEVERITY_COLORS[activeEvent.severity],
              padding: 12,
              borderRadius: 12,
            }}>
              {React.createElement(CATEGORY_ICONS[activeEvent.category] || AlertTriangle, { size: 32 })}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem' }}>{activeEvent.title}</h3>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: 4 }}>
                  {CATEGORY_LABELS[activeEvent.category] || activeEvent.category}
                </span>
                <span style={{ fontSize: '0.75rem', background: `${SEVERITY_COLORS[activeEvent.severity]}30`, color: SEVERITY_COLORS[activeEvent.severity], padding: '2px 8px', borderRadius: 4 }}>
                  {activeEvent.severity?.toUpperCase()}
                </span>
              </div>
              {activeEvent.description && (
                <p style={{ margin: 0, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  {activeEvent.description}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ background: 'var(--color-surface)', padding: 24, borderRadius: 12, border: '1px solid var(--color-border)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Aucun événement actif. Le convoi progresse paisiblement.
        </div>
      )}

      {/* RESOURCES & FLEET */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
        
        {/* RESOURCES */}
        <div style={{ background: 'var(--color-surface)', padding: 20, borderRadius: 12, border: '1px solid var(--color-border)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={18} /> Ressources
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { key: 'fuel', label: 'Carburant', icon: Fuel, color: '#f59e0b' },
              { key: 'water', label: 'Eau', icon: Droplets, color: '#3b82f6' },
              { key: 'food', label: 'Nourriture', icon: Apple, color: '#22c55e' },
              { key: 'medicine', label: 'Médicaments', icon: Pill, color: '#ec4899' },
              { key: 'ammo', label: 'Munitions', icon: Crosshair, color: '#ef4444' },
            ].map(({ key, label, icon: Icon, color }) => (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                    <Icon size={16} style={{ color }} /> {label}
                  </span>
                  <span style={{ fontWeight: 'bold', color: convoy[key] < 20 ? '#ef4444' : 'white' }}>
                    {convoy[key]}
                  </span>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    background: convoy[key] < 20 ? '#ef4444' : color,
                    width: `${Math.min(100, convoy[key])}%`, // Assuming max is 100 or scaling if higher
                    transition: 'width 0.3s ease-out, background 0.3s'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FLEET */}
        <div style={{ background: 'var(--color-surface)', padding: 20, borderRadius: 12, border: '1px solid var(--color-border)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Car size={18} /> Flotte
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(convoy.vehicles || []).map(v => {
              const VIcon = VEHICLE_ICONS[v.type] || Car;
              const hpPct = v.hpMax > 0 ? (v.hpCurrent / v.hpMax) * 100 : 0;
              return (
                <div key={v.id} style={{
                  padding: 12,
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${v.isDestroyed ? '#ef4444' : 'var(--color-border)'}`,
                  opacity: v.isDestroyed ? 0.6 : 1,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                      <VIcon size={18} /> {v.name}
                    </div>
                    {v.isDestroyed ? (
                      <span style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 'bold' }}>DÉTRUIT</span>
                    ) : (
                      <span style={{ fontSize: '0.85rem' }}>{v.hpCurrent} / {v.hpMax} PV</span>
                    )}
                  </div>
                  {!v.isDestroyed && (
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        background: hpPct < 25 ? '#ef4444' : hpPct < 50 ? '#f59e0b' : '#22c55e',
                        width: `${hpPct}%`,
                        transition: 'width 0.3s ease-out, background 0.3s'
                      }} />
                    </div>
                  )}
                </div>
              );
            })}
            {convoy.vehicles?.length === 0 && (
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: 12 }}>
                Aucun véhicule assigné.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
