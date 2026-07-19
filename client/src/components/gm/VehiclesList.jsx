import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Truck, Plus, Search, Trash2, Edit } from 'lucide-react';
import api from '../../utils/api';

export default function VehiclesList() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVehicles();
  }, [campaignId]);

  const fetchVehicles = async () => {
    try {
      const data = await api.get(`/api/v1/gm/campaigns/${campaignId}/vehicles`);
      setVehicles(data.vehicles);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateVehicle = async () => {
    try {
      const data = await api.post(`/api/v1/gm/campaigns/${campaignId}/vehicles`, {
        name: 'Nouveau Véhicule',
        modelType: 'Standard'
      });
      navigate(`/gm/campaigns/${campaignId}/vehicles/${data.vehicle.id}`);
    } catch (err) {
      console.error('Error creating vehicle:', err);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Supprimer ce véhicule ?')) return;
    try {
      await api.delete(`/api/v1/gm/campaigns/${campaignId}/vehicles/${id}`);
      setVehicles(v => v.filter(vec => vec.id !== id));
    } catch (err) {
      console.error('Error deleting vehicle:', err);
    }
  };

  const filtered = vehicles.filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (isLoading) return <div className="loading-screen">Chargement...</div>;

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 0, color: 'var(--color-text)' }}>
          <Truck size={32} color="var(--color-primary)" />
          Véhicules
        </h1>
        <button className="btn-primary" onClick={handleCreateVehicle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Créer
        </button>
      </header>

      <div style={{ marginBottom: '24px', position: 'relative' }}>
        <Search size={20} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        <input 
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '12px 12px 12px 40px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text)' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {filtered.map(v => (
          <div 
            key={v.id}
            onClick={() => navigate(`/gm/campaigns/${campaignId}/vehicles/${v.id}`)}
            style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '16px', cursor: 'pointer', transition: 'transform 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', color: 'var(--color-text)' }}>{v.name}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-background)', padding: '2px 8px', borderRadius: '12px' }}>{v.modelType}</span>
              </div>
              <button 
                className="btn-icon" 
                onClick={(e) => handleDelete(e, v.id)}
                style={{ color: 'var(--danger, #ef4444)' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <div style={{ marginTop: '16px', display: 'flex', gap: '16px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              <div>HP: {v.hpCurrent}/{v.hpMaxBase}</div>
              <div>Essence: {v.fuelCurrent}/{v.fuelMax}</div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '32px', color: 'var(--color-text-muted)' }}>
            Aucun véhicule trouvé.
          </div>
        )}
      </div>
    </div>
  );
}
