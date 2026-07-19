import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Truck, Save, ArrowLeft, Shield, Wind, Battery, Activity } from 'lucide-react';
import api from '../../utils/api';

export default function VehicleSheet() {
  const { campaignId, vehicleId } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVehicle();
  }, [campaignId, vehicleId]);

  const fetchVehicle = async () => {
    try {
      const data = await api.get(`/api/v1/gm/campaigns/${campaignId}/vehicles/${vehicleId}`);
      setVehicle(data.vehicle);
    } catch (err) {
      console.error('Error fetching vehicle:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setVehicle(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const { id, campaignId, createdAt, updatedAt, partSlots, crewSlots, accesses, ...updateData } = vehicle;
      await api.put(`/api/v1/gm/campaigns/${campaignId}/vehicles/${vehicleId}`, updateData);
      alert('Sauvegardé avec succès.');
    } catch (err) {
      console.error('Error saving vehicle:', err);
      alert('Erreur lors de la sauvegarde.');
    }
  };

  const calculateVehicleStats = () => {
    let ac = vehicle.acBase || 10;
    let hpMax = vehicle.hpMaxBase || 50;
    let speed = vehicle.speedBase || 40;

    const parts = (vehicle.partSlots || []).map(slot => slot.part);
    for (const part of parts) {
      if (!part || !part.modifiers) continue;
      try {
        const mods = typeof part.modifiers === 'string' ? JSON.parse(part.modifiers) : part.modifiers;
        if (mods.acBonus) ac += mods.acBonus;
        if (mods.hpBonus) hpMax += mods.hpBonus;
        if (mods.speedBonus) speed += mods.speedBonus;
      } catch (e) {
        console.warn("Failed to parse vehicle part modifiers", e);
      }
    }
    return { ac, hpMax, speed };
  };

  if (isLoading) return <div className="loading-screen">Chargement...</div>;
  if (!vehicle) return <div className="empty-state">Véhicule introuvable.</div>;

  const stats = calculateVehicleStats();

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn-icon" onClick={() => navigate(`/gm/campaigns/${campaignId}/vehicles`)}>
            <ArrowLeft size={20} />
          </button>
          <h1 style={{ margin: 0, color: 'var(--color-text)' }}>Fiche Véhicule</h1>
        </div>
        <button className="btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Save size={18} /> Sauvegarder
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: 'var(--color-surface)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            <h2 style={{ marginTop: 0, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={20} color="var(--color-primary)" /> Identité
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Nom</label>
                <input 
                  className="input-field" 
                  value={vehicle.name} 
                  onChange={(e) => handleChange('name', e.target.value)} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Type de Véhicule</label>
                <select 
                  className="input-field" 
                  value={vehicle.modelType || 'Voiture'} 
                  onChange={(e) => handleChange('modelType', e.target.value)} 
                >
                  <option value="Moto">Moto</option>
                  <option value="Voiture">Voiture</option>
                  <option value="Camion">Camion</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Description</label>
              <textarea 
                className="input-field" 
                rows={3} 
                value={vehicle.description || ''} 
                onChange={(e) => handleChange('description', e.target.value)} 
              />
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--color-surface)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            <h2 style={{ marginTop: 0, color: 'var(--color-text)' }}>Pièces & Armement</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {['engine', 'body', 'nos', 'weapon'].map(category => {
                const labels = { engine: 'Moteur', body: 'Carrosserie', nos: 'Kit NOS', weapon: 'Armes' };
                const slots = (vehicle.partSlots || []).filter(s => s.partType === category);
                return (
                  <div key={category} style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 12px 0', color: 'var(--color-primary)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>{labels[category]}</h4>
                    {slots.length === 0 ? (
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>Aucune pièce installée.</div>
                    ) : (
                      slots.map(slot => (
                        <div key={slot.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: '8px 12px', borderRadius: '6px', marginBottom: '8px' }}>
                          <div>
                            <div style={{ color: 'var(--color-text)', fontWeight: 'bold' }}>{slot.part ? slot.part.name : 'Slot Vide'}</div>
                            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>État : {slot.condition}</div>
                          </div>
                          {slot.part && slot.part.modifiers && (
                            <div style={{ fontSize: '0.8rem', color: '#34d399' }}>
                              {slot.part.modifiers}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                    <button className="btn-icon" style={{ fontSize: '0.8rem', color: 'var(--color-primary)', marginTop: '8px', padding: 0 }} onClick={() => alert('Bientôt disponible ! (Création de slot/assignation pièce)')}>+ Gérer {labels[category]}</button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: 'var(--color-surface)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            <h2 style={{ marginTop: 0, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={20} color="var(--danger, #ef4444)" /> État
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>PV (Actuels / Max Final)</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="number" className="input-field" style={{ width: '80px' }} value={vehicle.hpCurrent} onChange={(e) => handleChange('hpCurrent', parseInt(e.target.value))} />
                  <span>/</span>
                  <strong style={{ color: 'var(--color-text)' }}>{stats.hpMax}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginLeft: '8px' }}>(Base: <input type="number" style={{ width: '50px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '2px 4px', borderRadius: '4px' }} value={vehicle.hpMaxBase} onChange={(e) => handleChange('hpMaxBase', parseInt(e.target.value))} />)</span>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  <Battery size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Essence (Actuelle / Max)
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="number" className="input-field" value={vehicle.fuelCurrent} onChange={(e) => handleChange('fuelCurrent', parseInt(e.target.value))} />
                  <span style={{ display: 'flex', alignItems: 'center' }}>/</span>
                  <input type="number" className="input-field" value={vehicle.fuelMax} onChange={(e) => handleChange('fuelMax', parseInt(e.target.value))} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Épuisement</label>
                <input type="number" className="input-field" value={vehicle.exhaustionLevel} onChange={(e) => handleChange('exhaustionLevel', parseInt(e.target.value))} />
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--color-surface)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            <h2 style={{ marginTop: 0, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={20} color="var(--color-primary)" /> Statistiques
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Classe d'Armure (Finale)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ color: 'var(--color-text)', fontSize: '1.2rem' }}>{stats.ac}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>(Base: <input type="number" style={{ width: '50px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '2px 4px', borderRadius: '4px' }} value={vehicle.acBase} onChange={(e) => handleChange('acBase', parseInt(e.target.value))} />)</span>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  <Wind size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Vitesse (Finale)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ color: 'var(--color-text)', fontSize: '1.2rem' }}>{stats.speed} m</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>(Base: <input type="number" style={{ width: '50px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '2px 4px', borderRadius: '4px' }} value={vehicle.speedBase} onChange={(e) => handleChange('speedBase', parseInt(e.target.value))} />)</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
