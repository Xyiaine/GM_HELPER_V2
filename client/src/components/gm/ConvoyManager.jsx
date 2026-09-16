import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Truck, Plus, Trash2, Play, Pause, ChevronLeft, ChevronRight,
  AlertTriangle, Shield, Fuel, Droplets, Apple, Pill, Crosshair,
  RefreshCw, Gift, Check, X, Edit3, Save, SkipForward, ChevronDown,
  Bike, Car, Zap, CloudRain, Users, Coffee, Wrench, Star,
} from 'lucide-react';
import api from '../../utils/api';

// ─── Severity colors ──────────────────────────────────────────
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

const VEHICLE_LABELS = {
  moto: 'Moto',
  car: 'Voiture / Buggy',
  truck: 'Camion / Blindé',
};

export default function ConvoyManager() {
  const { campaignId } = useParams();
  const [convoys, setConvoys] = useState([]);
  const [selectedConvoy, setSelectedConvoy] = useState(null);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Creation form
  const [showCreate, setShowCreate] = useState(false);
  const [formName, setFormName] = useState('');
  const [formOrigin, setFormOrigin] = useState('');
  const [formDest, setFormDest] = useState('');
  const [formDifficulty, setFormDifficulty] = useState(50);
  const [formCargoType, setFormCargoType] = useState('resources');
  const [formCargoDetails, setFormCargoDetails] = useState('');

  // Vehicle form
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [vehName, setVehName] = useState('');
  const [vehType, setVehType] = useState('car');
  const [campActionVehicleId, setCampActionVehicleId] = useState('');

  // Event editing
  const [editingEventId, setEditingEventId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // Rewards
  const [showRewards, setShowRewards] = useState(false);
  const [proposedRewards, setProposedRewards] = useState([]);
  const [selectedRewardIds, setSelectedRewardIds] = useState(new Set());

  // Vehicle Inspection Modal
  const [vehiclesRegistry, setVehiclesRegistry] = useState([]);
  const [inspectVehicle, setInspectVehicle] = useState(null);

  // ─── Fetch ────────────────────────────────────────────────
  const fetchConvoys = useCallback(async () => {
    if (!campaignId) return;
    try {
      const data = await api.get(`/api/v1/gm/campaigns/${campaignId}/convoys`);
      setConvoys(data.convoys || []);
    } catch (err) {
      setError(err.message);
    }
  }, [campaignId]);

  const fetchCities = useCallback(async () => {
    if (!campaignId) return;
    try {
      const data = await api.get(`/api/v1/gm/campaigns/${campaignId}/cities`);
      setCities(data.cities || []);
    } catch (err) {
      console.error('Fetch cities error:', err);
    }
  }, [campaignId]);

  const fetchVehiclesRegistry = useCallback(async () => {
    if (!campaignId) return;
    try {
      const data = await api.get(`/api/v1/gm/campaigns/${campaignId}/vehicles`);
      setVehiclesRegistry(data.vehicles || []);
    } catch (err) {
      console.error('Fetch vehicles error:', err);
    }
  }, [campaignId]);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchConvoys(), fetchCities(), fetchVehiclesRegistry()]).finally(() => setIsLoading(false));
  }, [fetchConvoys, fetchCities, fetchVehiclesRegistry]);

  // ─── Create Convoy ────────────────────────────────────────
  const handleCreate = async () => {
    if (!formName || !formOrigin || !formDest) {
      setError('Veuillez remplir le nom, la ville de départ et la ville d\'arrivée.');
      return;
    }
    try {
      const data = await api.post(`/api/v1/gm/campaigns/${campaignId}/convoys`, {
        name: formName,
        originCityId: formOrigin,
        destinationCityId: formDest,
        difficulty: formDifficulty,
        cargoType: formCargoType,
        cargoDetails: formCargoDetails || undefined,
      });
      setConvoys(prev => [data.convoy, ...prev]);
      setSelectedConvoy(data.convoy);
      setShowCreate(false);
      setFormName(''); setFormOrigin(''); setFormDest('');
      setFormDifficulty(50); setFormCargoType('resources'); setFormCargoDetails('');
    } catch (err) {
      setError(err.message);
    }
  };

  // ─── Delete Convoy ────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce convoi ?')) return;
    try {
      await api.delete(`/api/v1/gm/campaigns/${campaignId}/convoys/${id}`);
      setConvoys(prev => prev.filter(c => c.id !== id));
      if (selectedConvoy?.id === id) setSelectedConvoy(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // ─── Update Status ────────────────────────────────────────
  const handleStatusChange = async (status) => {
    if (!selectedConvoy) return;
    try {
      const data = await api.put(`/api/v1/gm/campaigns/${campaignId}/convoys/${selectedConvoy.id}`, { status });
      setSelectedConvoy(data.convoy);
      setConvoys(prev => prev.map(c => c.id === data.convoy.id ? data.convoy : c));
    } catch (err) {
      setError(err.message);
    }
  };

  // ─── Set Active Step (Non-Linear Timeline) ────────────────
  const handleSetStep = async (stepIndex) => {
    if (!selectedConvoy) return;
    try {
      const data = await api.put(`/api/v1/gm/campaigns/${campaignId}/convoys/${selectedConvoy.id}/step/${stepIndex}`);
      setSelectedConvoy(data.convoy);
      setConvoys(prev => prev.map(c => c.id === data.convoy.id ? data.convoy : c));
    } catch (err) {
      setError(err.message);
    }
  };

  // ─── Update Resources ─────────────────────────────────────
  const handleResourceChange = async (resource, delta) => {
    if (!selectedConvoy) return;
    const newVal = Math.max(0, Math.min(200, selectedConvoy[resource] + delta));
    try {
      const data = await api.put(`/api/v1/gm/campaigns/${campaignId}/convoys/${selectedConvoy.id}/resources`, {
        [resource]: newVal,
      });
      setSelectedConvoy(data.convoy);
      setConvoys(prev => prev.map(c => c.id === data.convoy.id ? data.convoy : c));
    } catch (err) {
      setError(err.message);
    }
  };

  // ─── Add Vehicle ──────────────────────────────────────────
  const handleAddVehicle = async () => {
    if (!selectedConvoy || !vehName) return;
    try {
      const data = await api.post(`/api/v1/gm/campaigns/${campaignId}/convoys/${selectedConvoy.id}/vehicles`, {
        type: vehType,
        name: vehName,
      });
      setSelectedConvoy(prev => ({
        ...prev,
        vehicles: [...(prev.vehicles || []), data.vehicle],
      }));
      setShowAddVehicle(false);
      setVehName(''); setVehType('car');
    } catch (err) {
      setError(err.message);
    }
  };

  // ─── Update Vehicle HP ────────────────────────────────────
  const handleVehicleHpChange = async (vehicleId, delta) => {
    if (!selectedConvoy) return;
    const vehicle = selectedConvoy.vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return;
    const newHp = Math.max(0, Math.min(vehicle.hpMax, vehicle.hpCurrent + delta));
    try {
      const data = await api.put(`/api/v1/gm/campaigns/${campaignId}/convoys/${selectedConvoy.id}/vehicles/${vehicleId}`, {
        hpCurrent: newHp,
      });
      setSelectedConvoy(prev => ({
        ...prev,
        vehicles: prev.vehicles.map(v => v.id === vehicleId ? data.vehicle : v),
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  // ─── Delete Vehicle ───────────────────────────────────────
  const handleDeleteVehicle = async (vehicleId) => {
    if (!selectedConvoy) return;
    try {
      await api.delete(`/api/v1/gm/campaigns/${campaignId}/convoys/${selectedConvoy.id}/vehicles/${vehicleId}`);
      setSelectedConvoy(prev => ({
        ...prev,
        vehicles: prev.vehicles.filter(v => v.id !== vehicleId),
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  // ─── Update Event ─────────────────────────────────────────
  const handleSaveEvent = async (eventId) => {
    if (!selectedConvoy) return;
    try {
      const data = await api.put(`/api/v1/gm/campaigns/${campaignId}/convoys/${selectedConvoy.id}/events/${eventId}`, {
        title: editTitle,
        description: editDesc,
      });
      setSelectedConvoy(prev => ({
        ...prev,
        events: prev.events.map(e => e.id === eventId ? data.event : e),
      }));
      setEditingEventId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // ─── Resolve Event ────────────────────────────────────────
  const handleResolveEvent = async (eventId, outcome) => {
    if (!selectedConvoy) return;
    try {
      const data = await api.put(`/api/v1/gm/campaigns/${campaignId}/convoys/${selectedConvoy.id}/events/${eventId}/resolve`, { outcome });
      setSelectedConvoy(data.convoy);
      setConvoys(prev => prev.map(c => c.id === data.convoy.id ? data.convoy : c));
    } catch (err) {
      setError(err.message);
    }
  };

  // ─── Delete Event ─────────────────────────────────────────
  const handleDeleteEvent = async (eventId) => {
    if (!selectedConvoy) return;
    try {
      await api.delete(`/api/v1/gm/campaigns/${campaignId}/convoys/${selectedConvoy.id}/events/${eventId}`);
      setSelectedConvoy(prev => ({
        ...prev,
        events: prev.events.filter(e => e.id !== eventId),
        totalSteps: prev.totalSteps - 1,
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  // ─── Regenerate Roadmap ───────────────────────────────────
  const handleRegenerate = async () => {
    if (!selectedConvoy || !confirm('Régénérer la roadmap ? Les événements actuels seront perdus.')) return;
    try {
      const data = await api.post(`/api/v1/gm/campaigns/${campaignId}/convoys/${selectedConvoy.id}/regenerate`);
      setSelectedConvoy(data.convoy);
      setConvoys(prev => prev.map(c => c.id === data.convoy.id ? data.convoy : c));
    } catch (err) {
      setError(err.message);
    }
  };

  // ─── Propose & Select Rewards ─────────────────────────────
  const handleProposeRewards = async () => {
    if (!selectedConvoy) return;
    try {
      const data = await api.post(`/api/v1/gm/campaigns/${campaignId}/convoys/${selectedConvoy.id}/rewards/propose`);
      setProposedRewards(data.proposedRewards || []);
      setSelectedRewardIds(new Set());
      setShowRewards(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSelectRewards = async () => {
    if (!selectedConvoy) return;
    const selected = proposedRewards.filter(r => selectedRewardIds.has(r.id));
    try {
      const data = await api.put(`/api/v1/gm/campaigns/${campaignId}/convoys/${selectedConvoy.id}/rewards/select`, {
        selectedRewards: JSON.stringify(selected),
      });
      setSelectedConvoy(data.convoy);
      setConvoys(prev => prev.map(c => c.id === data.convoy.id ? data.convoy : c));
      setShowRewards(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // ─── Render ───────────────────────────────────────────────
  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-muted)' }}>
        <RefreshCw size={24} className="spin" style={{ marginRight: 8 }} /> Chargement des convois...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* ═══ LEFT PANEL: Convoy List ═══ */}
      <div style={{
        width: 300, borderRight: '1px solid var(--color-border)',
        display: 'flex', flexDirection: 'column', background: 'var(--color-surface)',
        flexShrink: 0,
      }}>
        <div style={{ padding: 16, borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Truck size={20} /> Convois
          </h3>
          <button onClick={() => setShowCreate(!showCreate)} style={btnStyle('#6366f1')}>
            <Plus size={16} />
          </button>
        </div>

        {/* Create Form */}
        {showCreate && (
          <div style={{ padding: 16, borderBottom: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--primary-tint)' }}>
            <input value={formName} onChange={e => setFormName(e.target.value)} placeholder="Nom du convoi..." style={inputStyle} />
            <select value={formOrigin} onChange={e => setFormOrigin(e.target.value)} style={{ ...inputStyle, backgroundColor: 'var(--paper-sunken)', color: 'var(--ink)' }}>
              <option value="">— Ville de départ —</option>
              {cities.map(c => <option key={c.id} value={c.id}>{c.location?.name || c.id}</option>)}
            </select>
            <select value={formDest} onChange={e => setFormDest(e.target.value)} style={{ ...inputStyle, backgroundColor: 'var(--paper-sunken)', color: 'var(--ink)' }}>
              <option value="">— Ville d'arrivée —</option>
              {cities.map(c => <option key={c.id} value={c.id}>{c.location?.name || c.id}</option>)}
            </select>
            <div>
              <label style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                Difficulté : {formDifficulty}%
              </label>
              <input type="range" min={0} max={100} value={formDifficulty} onChange={e => setFormDifficulty(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#f59e0b' }} />
            </div>
            <select value={formCargoType} onChange={e => setFormCargoType(e.target.value)} style={{ ...inputStyle, backgroundColor: 'var(--paper-sunken)', color: 'var(--ink)' }}>
              <option value="resources">Ressources Matérielles</option>
              <option value="humans">Ressources Humaines</option>
              <option value="mixed">Mixte</option>
            </select>
            <input value={formCargoDetails} onChange={e => setFormCargoDetails(e.target.value)} placeholder="Détails de la cargaison..." style={inputStyle} />
            <button onClick={handleCreate} style={btnStyle('#22c55e')}>
              <Truck size={14} /> Créer le Convoi
            </button>
          </div>
        )}

        {/* Convoy List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
          {convoys.length === 0 && (
            <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 20, fontSize: '0.9rem' }}>
              Aucun convoi. Créez votre première mission !
            </p>
          )}
          {convoys.map(c => (
            <div
              key={c.id}
              onClick={() => setSelectedConvoy(c)}
              style={{
                padding: 12, borderRadius: 8, marginBottom: 6, cursor: 'pointer',
                background: selectedConvoy?.id === c.id ? 'rgba(99,102,241,0.15)' : 'transparent',
                border: selectedConvoy?.id === c.id ? '1px solid rgba(99,102,241,0.4)' : '1px solid transparent',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (selectedConvoy?.id !== c.id) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { if (selectedConvoy?.id !== c.id) e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.95rem' }}>{c.name}</strong>
                <span style={{
                  fontSize: '0.7rem', padding: '2px 6px', borderRadius: 4,
                  background: c.status === 'in_progress' ? 'rgba(34,197,94,0.2)' : c.status === 'completed' ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.1)',
                  color: c.status === 'in_progress' ? '#22c55e' : c.status === 'completed' ? '#a5b4fc' : 'var(--color-text-muted)',
                }}>
                  {c.status === 'planning' ? 'Planifié' : c.status === 'in_progress' ? 'En cours' : c.status === 'completed' ? 'Terminé' : c.status === 'failed' ? 'Échoué' : 'Abandonné'}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                {c.originCity?.location?.name} → {c.destCity?.location?.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                Étape {Math.max(0, c.currentStepIndex + 1)}/{c.totalSteps} • Difficulté {c.difficulty}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ RIGHT PANEL: Convoy Detail ═══ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {!selectedConvoy ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-muted)' }}>
            <Truck size={40} style={{ opacity: 0.3, marginRight: 12 }} />
            Sélectionnez un convoi ou créez-en un nouveau
          </div>
        ) : (
          <>
            {/* ─── Header ─── */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.3rem' }}>{selectedConvoy.name}</h2>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  {selectedConvoy.originCity?.location?.name} → {selectedConvoy.destCity?.location?.name}
                  {' • '}Difficulté {selectedConvoy.difficulty}%
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {selectedConvoy.status === 'planning' && (
                  <button onClick={() => handleStatusChange('in_progress')} style={btnStyle('#22c55e')}>
                    <Play size={14} /> Lancer
                  </button>
                )}
                {selectedConvoy.status === 'in_progress' && (
                  <>
                    <button onClick={handleProposeRewards} style={btnStyle('#f59e0b')}>
                      <Gift size={14} /> Récompenses
                    </button>
                    <button onClick={() => handleStatusChange('failed')} style={btnStyle('#ef4444')}>
                      <X size={14} /> Échoué
                    </button>
                  </>
                )}
                <button onClick={handleRegenerate} style={btnStyle('rgba(255,255,255,0.1)')}>
                  <RefreshCw size={14} />
                </button>
                <button onClick={() => handleDelete(selectedConvoy.id)} style={btnStyle('#ef4444')}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* ─── Main Content (Scrollable) ─── */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* ─── Resources Bar ─── */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {[
                  { key: 'fuel', label: 'Carburant', icon: Fuel, color: '#f59e0b' },
                  { key: 'water', label: 'Eau', icon: Droplets, color: '#3b82f6' },
                  { key: 'food', label: 'Nourriture', icon: Apple, color: '#22c55e' },
                  { key: 'medicine', label: 'Médicaments', icon: Pill, color: '#ec4899' },
                  { key: 'ammo', label: 'Munitions', icon: Crosshair, color: '#ef4444' },
                ].map(({ key, label, icon: Icon, color }) => (
                  <div key={key} style={{
                    flex: 1, minWidth: 140, background: 'var(--color-surface)', borderRadius: 8,
                    padding: 12, border: '1px solid var(--color-border)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        <Icon size={14} style={{ color }} /> {label}
                      </span>
                      <span style={{ fontWeight: 700, color: selectedConvoy[key] < 20 ? '#ef4444' : 'white' }}>
                        {selectedConvoy[key]}
                      </span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: 'var(--overlay-soft)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 3, transition: 'width 0.3s',
                        width: `${Math.min(100, selectedConvoy[key])}%`,
                        background: selectedConvoy[key] < 20 ? '#ef4444' : color,
                      }} />
                    </div>
                    <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                      <button onClick={() => handleResourceChange(key, -10)} style={smallBtn}>-10</button>
                      <button onClick={() => handleResourceChange(key, -5)} style={smallBtn}>-5</button>
                      <button onClick={() => handleResourceChange(key, 5)} style={{ ...smallBtn, background: 'var(--success-tint-strong)' }}>+5</button>
                      <button onClick={() => handleResourceChange(key, 10)} style={{ ...smallBtn, background: 'var(--success-tint-strong)' }}>+10</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* ─── Fleet ─── */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>🚗 Flotte</h3>
                  <button onClick={() => setShowAddVehicle(!showAddVehicle)} style={btnStyle('#6366f1')}>
                    <Plus size={14} /> Véhicule
                  </button>
                </div>

                {showAddVehicle && (
                  <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center', background: 'var(--color-surface)', padding: 12, borderRadius: 8 }}>
                    <input value={vehName} onChange={e => setVehName(e.target.value)} placeholder="Nom du véhicule..." style={{ ...inputStyle, flex: '2 1 200px', minWidth: '150px' }} />
                    <select value={vehType} onChange={e => setVehType(e.target.value)} style={{ ...inputStyle, backgroundColor: 'var(--paper-sunken)', color: 'var(--ink)', width: '100px', flex: '0 0 100px' }}>
                      <option value="moto">🏍️ Moto</option>
                      <option value="car">🚗 Voiture</option>
                      <option value="truck">🚛 Camion</option>
                    </select>
                    <button onClick={handleAddVehicle} style={{ ...btnStyle('#22c55e'), flex: '0 0 auto' }}>
                      <Check size={14} />
                    </button>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {(selectedConvoy.vehicles || []).map(v => {
                    const VIcon = VEHICLE_ICONS[v.type] || Car;
                    const hpPct = v.hpMax > 0 ? (v.hpCurrent / v.hpMax) * 100 : 0;
                    const regMatch = vehiclesRegistry.find(rv => rv.name.toLowerCase().includes(v.name.toLowerCase()) || v.name.toLowerCase().includes(rv.name.toLowerCase()));

                    return (
                      <div
                        key={v.id}
                        onClick={() => setInspectVehicle({ convoyVeh: v, regVeh: regMatch })}
                        style={{
                          flex: '1 1 200px', maxWidth: 280, background: 'var(--color-surface)', borderRadius: 8,
                          padding: 12, border: `1px solid ${v.isDestroyed ? '#ef4444' : 'var(--color-border)'}`,
                          opacity: v.isDestroyed ? 0.5 : 1,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease-in-out',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                        }}
                        className="vehicle-fleet-card"
                        title="Cliquer pour afficher la Fiche Stat-Block D&D 5e"
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: 'var(--color-primary-light)' }}>
                            <VIcon size={16} /> {v.name}
                          </span>
                          <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
                            <button onClick={() => handleDeleteVehicle(v.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 6 }}>
                          {VEHICLE_LABELS[v.type]} • {v.isDestroyed ? '💥 DÉTRUIT' : `${v.hpCurrent}/${v.hpMax} PV`}
                        </div>
                        {!v.isDestroyed && (
                          <>
                            <div style={{ height: 6, borderRadius: 3, background: 'var(--overlay-soft)', overflow: 'hidden', marginBottom: 6 }}>
                              <div style={{
                                height: '100%', borderRadius: 3, transition: 'width 0.3s',
                                width: `${hpPct}%`,
                                background: hpPct < 25 ? '#ef4444' : hpPct < 50 ? '#f59e0b' : '#22c55e',
                              }} />
                            </div>
                            <div style={{ display: 'flex', gap: 4, marginBottom: 8 }} onClick={e => e.stopPropagation()}>
                              <button onClick={() => handleVehicleHpChange(v.id, -20)} style={smallBtn}>-20</button>
                              <button onClick={() => handleVehicleHpChange(v.id, -10)} style={smallBtn}>-10</button>
                              <button onClick={() => handleVehicleHpChange(v.id, 10)} style={{ ...smallBtn, background: 'var(--success-tint-strong)' }}>+10</button>
                              <button onClick={() => handleVehicleHpChange(v.id, 20)} style={{ ...smallBtn, background: 'var(--success-tint-strong)' }}>+20</button>
                            </div>
                          </>
                        )}
                        <div style={{ fontSize: '0.75rem', color: '#a78bfa', display: 'flex', alignItems: 'center', gap: 4, fontStyle: 'italic' }}>
                          📜 Voir Fiche Stat-Block D&D 5e
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ─── Timeline / Roadmap ─── */}
              <div>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem' }}>🗺️ Roadmap ({selectedConvoy.events?.length || 0} étapes)</h3>

                <div style={{ position: 'relative', paddingLeft: 30 }}>
                  {/* Vertical line */}
                  <div style={{
                    position: 'absolute', left: 14, top: 0, bottom: 0, width: 2,
                    background: 'var(--overlay-soft)',
                  }} />

                  {(selectedConvoy.events || []).map((event, idx) => {
                    const CatIcon = CATEGORY_ICONS[event.category] || Star;
                    const isActive = event.status === 'active';
                    const isResolved = event.status === 'resolved';
                    const isEditing = editingEventId === event.id;
                    const sevColor = SEVERITY_COLORS[event.severity] || '#f59e0b';

                    return (
                      <div key={event.id} style={{
                        position: 'relative', marginBottom: 8,
                        padding: 12, borderRadius: 8,
                        background: isActive ? 'rgba(99,102,241,0.15)' : 'var(--color-surface)',
                        border: isActive ? '1px solid rgba(99,102,241,0.5)' : '1px solid var(--color-border)',
                        cursor: 'pointer',
                        opacity: isResolved ? 0.6 : 1,
                        transition: 'all 0.15s',
                      }}
                        onClick={() => !isEditing && handleSetStep(event.orderIndex)}
                      >
                        {/* Dot on the line */}
                        <div style={{
                          position: 'absolute', left: -24, top: 16, width: 12, height: 12,
                          borderRadius: '50%', background: isActive ? '#6366f1' : isResolved ? '#22c55e' : 'rgba(255,255,255,0.2)',
                          border: '2px solid var(--color-surface)',
                        }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                              <span style={{
                                fontSize: '0.7rem', padding: '2px 6px', borderRadius: 4,
                                background: `${sevColor}20`, color: sevColor,
                              }}>
                                {event.severity?.toUpperCase()}
                              </span>
                              <CatIcon size={14} style={{ color: 'var(--color-text-muted)' }} />
                              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                {CATEGORY_LABELS[event.category] || event.category}
                              </span>
                              {isActive && <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: 4, background: 'var(--primary-border)', color: '#a5b4fc' }}>ACTIF</span>}
                              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>#{idx + 1}</span>
                            </div>

                            {isEditing ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }} onClick={e => e.stopPropagation()}>
                                <input value={editTitle} onChange={e => setEditTitle(e.target.value)} style={inputStyle} />
                                <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} />
                                <div style={{ display: 'flex', gap: 6 }}>
                                  <button onClick={() => handleSaveEvent(event.id)} style={btnStyle('#22c55e')}><Save size={12} /> Sauver</button>
                                  <button onClick={() => setEditingEventId(null)} style={btnStyle('rgba(255,255,255,0.1)')}><X size={12} /></button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <strong style={{ fontSize: '0.95rem' }}>{event.title}</strong>
                                {event.description && (
                                  <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.4, whiteSpace: 'pre-wrap' }}>
                                    {event.description}
                                  </p>
                                )}
                                {isActive && event.effects && (
                                  (() => {
                                    let eff = null;
                                    try { eff = JSON.parse(event.effects); } catch (e) {}
                                    if (!eff) return null;
                                    
                                    const resKey = eff.baseResource ? Object.keys(eff.baseResource)[0] : '';
                                    const resVal = resKey ? eff.baseResource[resKey] : 0;
                                    const sign = eff.type === 'damage' ? '-' : '+';
                                    const actionTxt = eff.type === 'damage' ? 'Risques potentiels' : 'Opportunité de repos';

                                    return (
                                      <div style={{ marginTop: 12, padding: 12, background: 'var(--paper-sunken)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>
                                          {actionTxt} : 
                                          {resKey && <span style={{ marginLeft: 6, fontWeight: 'bold', color: eff.type === 'damage' ? '#f87171' : '#4ade80' }}>{sign}{resVal} {resKey}</span>}
                                          {eff.baseVehicleHp > 0 && <span style={{ marginLeft: 6, fontWeight: 'bold', color: eff.type === 'damage' ? '#f87171' : '#4ade80' }}>{sign}{eff.baseVehicleHp} PV (flotte)</span>}
                                        </div>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                          <button onClick={(e) => { e.stopPropagation(); handleResolveEvent(event.id, 'failure'); }} style={{ ...btnStyle('rgba(239,68,68,0.2)'), color: '#f87171', border: '1px solid #ef4444', flex: 1, justifyContent: 'center' }}>Échec</button>
                                          <button onClick={(e) => { e.stopPropagation(); handleResolveEvent(event.id, 'partial'); }} style={{ ...btnStyle('rgba(245,158,11,0.2)'), color: '#fbbf24', border: '1px solid #f59e0b', flex: 1, justifyContent: 'center' }}>Partielle</button>
                                          <button onClick={(e) => { e.stopPropagation(); handleResolveEvent(event.id, 'success'); }} style={{ ...btnStyle('rgba(34,197,94,0.2)'), color: '#4ade80', border: '1px solid #22c55e', flex: 1, justifyContent: 'center' }}>Totale</button>
                                        </div>
                                      </div>
                                    );
                                  })()
                                )}
                                {isActive && event.severity === 'low' && (
                                  <div style={{ marginTop: 16, padding: 12, background: 'var(--success-tint)', borderRadius: 8, border: '1px solid rgba(52, 211, 153, 0.4)' }}>
                                    <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#34d399' }}>⛺ Actions de Campement (PJ)</h4>
                                    
                                    {/* Ravitaillement */}
                                    <div style={{ marginBottom: 12 }}>
                                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 6 }}>Fouille & Ravitaillement (Eau, Nourriture, Carburant)</div>
                                      <div style={{ display: 'flex', gap: 6 }}>
                                        <button onClick={(e) => { e.stopPropagation(); }} style={{ ...btnStyle('rgba(239,68,68,0.2)'), color: '#f87171', border: '1px solid #ef4444', flex: 1, justifyContent: 'center' }}>Échec (+0)</button>
                                        <button onClick={(e) => { e.stopPropagation(); handleResourceChange('water', 5); handleResourceChange('food', 5); handleResourceChange('fuel', 5); }} style={{ ...btnStyle('rgba(245,158,11,0.2)'), color: '#fbbf24', border: '1px solid #f59e0b', flex: 1, justifyContent: 'center' }}>Partielle (+5)</button>
                                        <button onClick={(e) => { e.stopPropagation(); handleResourceChange('water', 15); handleResourceChange('food', 15); handleResourceChange('fuel', 15); }} style={{ ...btnStyle('rgba(34,197,94,0.2)'), color: '#4ade80', border: '1px solid #22c55e', flex: 1, justifyContent: 'center' }}>Totale (+15)</button>
                                      </div>
                                    </div>

                                    {/* Soins */}
                                    <div style={{ marginBottom: 12 }}>
                                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 6 }}>Soins Médicaux (Médicaments)</div>
                                      <div style={{ display: 'flex', gap: 6 }}>
                                        <button onClick={(e) => { e.stopPropagation(); }} style={{ ...btnStyle('rgba(239,68,68,0.2)'), color: '#f87171', border: '1px solid #ef4444', flex: 1, justifyContent: 'center' }}>Échec (+0)</button>
                                        <button onClick={(e) => { e.stopPropagation(); handleResourceChange('meds', 10); }} style={{ ...btnStyle('rgba(245,158,11,0.2)'), color: '#fbbf24', border: '1px solid #f59e0b', flex: 1, justifyContent: 'center' }}>Partielle (+10)</button>
                                        <button onClick={(e) => { e.stopPropagation(); handleResourceChange('meds', 20); }} style={{ ...btnStyle('rgba(34,197,94,0.2)'), color: '#4ade80', border: '1px solid #22c55e', flex: 1, justifyContent: 'center' }}>Totale (+20)</button>
                                      </div>
                                    </div>

                                    {/* Réparation */}
                                    <div>
                                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>Réparation Mécanique (PV Véhicule)</span>
                                        <select 
                                          value={campActionVehicleId} 
                                          onChange={e => setCampActionVehicleId(e.target.value)}
                                          onClick={e => e.stopPropagation()}
                                          style={{ background: 'var(--paper-sunken)', color: 'var(--ink)', border: '1px solid var(--color-border)', borderRadius: 4, padding: '2px 6px', fontSize: '0.75rem' }}
                                        >
                                          <option value="">Sélectionner un véhicule...</option>
                                          {selectedConvoy.vehicles?.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                        </select>
                                      </div>
                                      <div style={{ display: 'flex', gap: 6 }}>
                                        <button onClick={(e) => { e.stopPropagation(); }} disabled={!campActionVehicleId} style={{ ...btnStyle('rgba(239,68,68,0.2)'), color: '#f87171', border: '1px solid #ef4444', flex: 1, opacity: campActionVehicleId ? 1 : 0.5, justifyContent: 'center' }}>Échec (+0)</button>
                                        <button onClick={(e) => { e.stopPropagation(); handleVehicleHpChange(campActionVehicleId, 25); }} disabled={!campActionVehicleId} style={{ ...btnStyle('rgba(245,158,11,0.2)'), color: '#fbbf24', border: '1px solid #f59e0b', flex: 1, opacity: campActionVehicleId ? 1 : 0.5, justifyContent: 'center' }}>Partielle (+25)</button>
                                        <button onClick={(e) => { e.stopPropagation(); handleVehicleHpChange(campActionVehicleId, 50); }} disabled={!campActionVehicleId} style={{ ...btnStyle('rgba(34,197,94,0.2)'), color: '#4ade80', border: '1px solid #22c55e', flex: 1, opacity: campActionVehicleId ? 1 : 0.5, justifyContent: 'center' }}>Totale (+50)</button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                          </div>

                          {!isEditing && (
                            <div style={{ display: 'flex', gap: 4, marginLeft: 8, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                              <button onClick={() => { setEditingEventId(event.id); setEditTitle(event.title); setEditDesc(event.description || ''); }}
                                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                                <Edit3 size={14} />
                              </button>
                              <button onClick={() => handleDeleteEvent(event.id)}
                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ─── Rewards Modal ─── */}
            {showRewards && (
              <div style={{
                position: 'fixed', inset: 0, background: 'var(--scrim)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', zIndex: 1000,
              }} onClick={() => setShowRewards(false)}>
                <div style={{
                  background: 'var(--color-surface)', borderRadius: 12, padding: 24, width: 500, maxHeight: '80vh',
                  overflowY: 'auto', border: '1px solid var(--color-border)',
                }} onClick={e => e.stopPropagation()}>
                  <h3 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Gift size={20} style={{ color: '#f59e0b' }} /> Récompenses Proposées
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 16 }}>
                    Sélectionnez les récompenses à accorder aux joueurs :
                  </p>
                  {proposedRewards.map(r => (
                    <div key={r.id} onClick={() => {
                      setSelectedRewardIds(prev => {
                        const next = new Set(prev);
                        next.has(r.id) ? next.delete(r.id) : next.add(r.id);
                        return next;
                      });
                    }} style={{
                      padding: 12, borderRadius: 8, marginBottom: 8, cursor: 'pointer',
                      background: selectedRewardIds.has(r.id) ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.03)',
                      border: selectedRewardIds.has(r.id) ? '1px solid rgba(34,197,94,0.4)' : '1px solid var(--color-border)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong>{r.label}</strong>
                        <span style={{ fontSize: '0.8rem', color: '#f59e0b' }}>{r.type}</span>
                      </div>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{r.description}</p>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                    <button onClick={handleSelectRewards} style={btnStyle('#22c55e')} disabled={selectedRewardIds.size === 0}>
                      <Check size={14} /> Valider ({selectedRewardIds.size})
                    </button>
                    <button onClick={() => setShowRewards(false)} style={btnStyle('rgba(255,255,255,0.1)')}>
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* ─── Vehicle Stat-Block D&D 5e Modal ─── */}
            {inspectVehicle && (() => {
              const { convoyVeh, regVeh } = inspectVehicle;
              let notes = {};
              if (regVeh && regVeh.notes) {
                try { notes = JSON.parse(regVeh.notes); } catch (e) {}
              }

              const ac = regVeh?.acBase || (convoyVeh.passengers?.match(/CA (\d+)/)?.[1]) || (convoyVeh.type === 'moto' ? 13 : convoyVeh.type === 'car' ? 16 : convoyVeh.name.includes("Forteresse") ? 20 : 18);
              const hpMax = regVeh?.hpMaxBase || convoyVeh.hpMax || 100;
              const hpCurrent = convoyVeh.hpCurrent;

              // Speed resolution based on size rule: Moto=24m, Voiture=16m, Camion=12m, Mastodonte=8m
              let rawSpeed = regVeh?.speedBase;
              if (!rawSpeed && convoyVeh.passengers) {
                const match = convoyVeh.passengers.match(/Vitesse (\d+)m/);
                if (match) rawSpeed = parseInt(match[1]);
              }

              let speedText = "12m (8 cases)";
              if (rawSpeed === 24 || convoyVeh.type === 'moto') speedText = "24m (16 cases)";
              else if (rawSpeed === 16 || (convoyVeh.type === 'car' && !convoyVeh.name.includes("Molosse"))) speedText = "16m (10 cases)";
              else if (rawSpeed === 8 || convoyVeh.name.includes("Forteresse")) speedText = "8m (5 cases)";
              else if (rawSpeed === 12 || convoyVeh.type === 'truck') speedText = "12m (8 cases)";
              else if (rawSpeed) speedText = `${rawSpeed}m`;

              const init = notes.initiative || (convoyVeh.passengers?.match(/Init ([\+\-\d]+)/)?.[1]) || (convoyVeh.type === 'moto' ? "+5" : convoyVeh.type === 'car' ? "+3" : convoyVeh.name.includes("Forteresse") ? "-2" : "+1");
              const pilote = notes.pilote || convoyVeh.passengers || "Équipage standard";

              return (
                <div style={{
                  position: 'fixed', inset: 0, background: 'var(--scrim)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', zIndex: 1100, backdropFilter: 'blur(3px)'
                }} onClick={() => setInspectVehicle(null)}>
                  <div style={{
                    background: 'var(--paper-sunken)', borderRadius: 12, padding: 24, width: 560, maxHeight: '85vh',
                    overflowY: 'auto', border: '2px solid #b91c1c', boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                    fontFamily: 'system-ui, sans-serif'
                  }} onClick={e => e.stopPropagation()}>
                    
                    {/* Header */}
                    <div style={{ borderBottom: '2px solid #b91c1c', paddingBottom: 12, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h2 style={{ margin: 0, color: '#fca5a5', fontSize: '1.4rem' }}>{convoyVeh.name}</h2>
                        <div style={{ fontSize: '0.85rem', color: '#9ca3af', fontStyle: 'italic' }}>
                          {regVeh?.modelType || VEHICLE_LABELS[convoyVeh.type]} • {selectedConvoy?.name}
                        </div>
                      </div>
                      <button onClick={() => setInspectVehicle(null)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
                        <X size={22} />
                      </button>
                    </div>

                    {/* D&D 5e Stat Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginBottom: 16, backgroundColor: 'var(--paper-sunken)', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>CA (Armure)</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#f59e0b' }}>🛡️ {ac}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>PV</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: hpCurrent < hpMax * 0.3 ? '#ef4444' : '#10b981' }}>❤️ {hpCurrent}/{hpMax}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>Vitesse</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#60a5fa' }}>🏎️ {speedText}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>Initiative</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#a78bfa' }}>⚡ {init}</div>
                      </div>
                    </div>

                    {/* Pilote & Résistances */}
                    <div style={{ fontSize: '0.85rem', marginBottom: 14, lineHeight: 1.5, borderBottom: '1px solid #3f3f46', paddingBottom: 12 }}>
                      <div><strong>👨‍✈️ Pilote & Équipage :</strong> {pilote}</div>
                      {notes.resistances && <div style={{ color: '#fbbf24', marginTop: 4 }}><strong>🛡️ Résistances :</strong> {notes.resistances}</div>}
                    </div>

                    {/* Capacités Spéciales */}
                    {notes.specialAbilities && notes.specialAbilities.length > 0 && (
                      <div style={{ marginBottom: 16, borderBottom: '1px solid #3f3f46', paddingBottom: 12 }}>
                        <h4 style={{ margin: '0 0 8px 0', color: '#fcd34d', fontSize: '0.95rem' }}>✨ Capacités Spéciales</h4>
                        {notes.specialAbilities.map((ab, idx) => (
                          <div key={idx} style={{ fontSize: '0.85rem', marginBottom: 6, lineHeight: 1.4 }}>
                            <strong style={{ color: '#fef08a' }}>• {ab.name} :</strong> {ab.description}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Actions & Armement */}
                    {notes.actions && notes.actions.length > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        <h4 style={{ margin: '0 0 8px 0', color: '#ef4444', fontSize: '0.95rem' }}>⚔️ Armement & Actions D&D 5e</h4>
                        {notes.actions.map((act, idx) => (
                          <div key={idx} style={{ backgroundColor: 'var(--danger-tint)', borderLeft: '3px solid #ef4444', padding: '8px 12px', borderRadius: 4, marginBottom: 8, fontSize: '0.85rem' }}>
                            <div style={{ fontWeight: 'bold', color: '#fca5a5', display: 'flex', justifyContent: 'space-between' }}>
                              <span>{act.name}</span>
                              <span style={{ fontSize: '0.75rem', color: '#f87171' }}>{act.type} • Portée : {act.range}</span>
                            </div>
                            <div style={{ color: '#fecaca', marginTop: 2 }}>
                              <strong>Toucher :</strong> {act.attackBonus} | <strong>Dégâts :</strong> {act.damage}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* HP Adjustment Controls */}
                    <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #3f3f46', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Ajuster PV en direct :</span>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => handleVehicleHpChange(convoyVeh.id, -20)} style={{ ...smallBtn, background: 'var(--danger)' }}>-20 PV</button>
                        <button onClick={() => handleVehicleHpChange(convoyVeh.id, -10)} style={{ ...smallBtn, background: 'var(--danger)' }}>-10 PV</button>
                        <button onClick={() => handleVehicleHpChange(convoyVeh.id, 10)} style={{ ...smallBtn, background: 'var(--success)' }}>+10 PV</button>
                        <button onClick={() => handleVehicleHpChange(convoyVeh.id, 20)} style={{ ...smallBtn, background: 'var(--success)' }}>+20 PV</button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })()}
          </>
        )}
      </div>

      {/* Error Toast */}
      {error && (
        <div style={{
          position: 'fixed', bottom: 20, right: 20, background: 'var(--danger)', color: 'white',
          padding: '12px 20px', borderRadius: 8, zIndex: 1000, display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <AlertTriangle size={16} /> {error}
          <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginLeft: 8 }}>
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Shared Styles ────────────────────────────────────────────
const btnStyle = (bg) => ({
  display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
  background: bg, border: 'none', borderRadius: 6, color: 'white',
  cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500,
  transition: 'opacity 0.15s',
});

const inputStyle = {
  backgroundColor: 'var(--paper-sunken)', border: '1px solid var(--color-border)',
  borderRadius: 6, padding: '8px 12px', color: 'white', fontSize: '0.85rem',
  outline: 'none',
};

const smallBtn = {
  flex: 1, padding: '3px 0', background: 'var(--danger-tint)', border: 'none',
  borderRadius: 4, color: 'white', cursor: 'pointer', fontSize: '0.75rem',
};
