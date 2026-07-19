import React, { useEffect, useState } from 'react';
import { useGmStore } from '../../store/gmStore';
import { useNavigate } from 'react-router-dom';
import { MapPin, Activity, Shield, Zap, Wheat, Heart, Fuel, ChevronRight, ChevronDown } from 'lucide-react';
import Modal from '../ui/Modal';

const LocationNode = ({ location, level = 0, campaignId }) => {
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();
  const hasChildren = location.children && location.children.length > 0;

  return (
    <div style={{ marginLeft: `${level * 20}px`, marginTop: '8px' }}>
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          padding: '6px 8px',
          backgroundColor: 'var(--color-surface)',
          borderRadius: '4px',
          border: '1px solid var(--color-border)'
        }}
      >
        <div 
          onClick={() => hasChildren && setExpanded(!expanded)}
          style={{ cursor: hasChildren ? 'pointer' : 'default', display: 'flex', alignItems: 'center' }}
        >
          {hasChildren ? (
            expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
          ) : (
            <MapPin size={16} color="var(--color-text-muted)" />
          )}
        </div>
        <span 
          style={{ 
            fontWeight: level === 0 ? 'bold' : 'normal', 
            color: 'var(--color-text)',
            cursor: 'pointer',
            flex: 1
          }}
          onClick={() => navigate(`/gm/campaigns/${campaignId}/locations/${location.id}/map`)}
          title="Voir la carte"
        >
          {location.name}
        </span>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginLeft: 'auto' }}>{location.type}</span>
      </div>
      
      {expanded && hasChildren && (
        <div style={{ borderLeft: '1px dashed var(--color-border)', marginLeft: '12px', paddingLeft: '4px' }}>
          {location.children.map(child => (
            <LocationNode key={child.id} location={child} level={level + 1} campaignId={campaignId} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function CitiesManager() {
  const { activeCampaignId, cities, locations, fetchCities, fetchLocations, adjustCityParam } = useGmStore();
  const [adjustingCity, setAdjustingCity] = useState(null);
  const navigate = useNavigate();
  const [adjustForm, setAdjustForm] = useState({ parameter: 'health', value: 0, cause: '' });

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    if (!adjustingCity) return;
    try {
      await adjustCityParam(activeCampaignId, adjustingCity.id, {
        parameter: adjustForm.parameter,
        value: Number(adjustForm.value),
        cause: adjustForm.cause
      });
      setAdjustingCity(null);
      setAdjustForm({ parameter: 'health', value: 0, cause: '' });
    } catch (err) {
      alert('Failed to adjust city values');
    }
  };

  useEffect(() => {
    if (activeCampaignId) {
      fetchCities(activeCampaignId);
      fetchLocations(activeCampaignId);
    }
  }, [activeCampaignId, fetchCities, fetchLocations]);

  // Helper to render a parameter bar
  const ParameterBar = ({ label, value, icon: Icon, color }) => (
    <div style={{ marginBottom: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--color-text-muted)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Icon size={12} /> {label}</span>
        <span>{value}/100</span>
      </div>
      <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-background)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', backgroundColor: color, transition: 'width 0.3s ease' }}></div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '24px', display: 'flex', gap: '24px' }}>
      {/* LEFT COLUMN: Locations Tree */}
      <div style={{ flex: '1', minWidth: '300px', backgroundColor: 'var(--color-surface)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ color: 'var(--color-primary)', margin: 0 }}>Locations</h2>
          <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>+ New</button>
        </div>
        
        {(!locations || locations.length === 0) ? (
          <p style={{ color: 'var(--color-text-muted)' }}>No locations yet.</p>
        ) : (
          <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
            <div style={{ marginTop: '8px' }}>
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '6px 8px',
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: '4px',
                  border: '1px solid var(--color-primary)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <MapPin size={16} color="var(--color-primary)" />
                </div>
                <span 
                  style={{ 
                    fontWeight: 'bold', 
                    color: 'var(--color-primary)', 
                    cursor: 'pointer',
                    flex: 1
                  }}
                  onClick={() => navigate(`/gm/campaigns/${activeCampaignId}/map`)}
                  title="Voir la carte du monde"
                >
                  🌍 Carte du monde
                </span>
              </div>
              
              <div style={{ borderLeft: '1px dashed var(--color-border)', marginLeft: '12px', paddingLeft: '4px' }}>
                {locations.map(loc => (
                  <LocationNode key={loc.id} location={loc} campaignId={activeCampaignId} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: City-States Parameters */}
      <div style={{ flex: '2', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <header>
          <h1 style={{ color: 'var(--color-text)', margin: '0 0 8px 0' }}>City-States Parameters</h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Track the delicate balance of power and resources across the wastes.</p>
        </header>

        {(!cities || cities.length === 0) ? (
           <p style={{ color: 'var(--color-text-muted)' }}>No cities created yet in this campaign.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {cities.map(city => (
              <div key={city.id} style={{ 
                backgroundColor: 'var(--color-surface)', 
                padding: '20px', 
                borderRadius: '8px', 
                border: '1px solid var(--color-border)' 
              }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--color-text)' }}>
                  <MapPin color="var(--color-primary)" />
                  {city.location?.name || 'Unknown City'}
                </h3>
                
                <ParameterBar label="Health" value={city.health} icon={Activity} color="var(--success, #10b981)" />
                <ParameterBar label="Wealth" value={city.wealth} icon={Zap} color="#fcd34d" />
                <ParameterBar label="Technology" value={city.technology} icon={Zap} color="var(--color-primary)" />
                <ParameterBar label="Food" value={city.food} icon={Wheat} color="#a3e635" />
                <ParameterBar label="Happiness" value={city.happiness} icon={Heart} color="#f472b6" />
                <ParameterBar label="Armament" value={city.armament} icon={Shield} color="var(--danger, #ef4444)" />
                <ParameterBar label="Fuel" value={city.fuel} icon={Fuel} color="var(--warning, #f59e0b)" />
                
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '4px 12px' }} onClick={() => { setAdjustingCity(city); setAdjustForm({...adjustForm, value: 0, cause: ''}); }}>Adjust Values</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={!!adjustingCity} onClose={() => setAdjustingCity(null)} title={`Adjust Parameters: ${adjustingCity?.location?.name}`}>
        <form onSubmit={handleAdjustSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Apply a direct modification to one of the city's parameters. Use negative values for decreases.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', color: 'var(--color-text-muted)' }}>Parameter</label>
              <select 
                value={adjustForm.parameter} 
                onChange={e => setAdjustForm({...adjustForm, parameter: e.target.value})}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
              >
                <option value="health">Health</option>
                <option value="wealth">Wealth</option>
                <option value="technology">Technology</option>
                <option value="food">Food</option>
                <option value="happiness">Happiness</option>
                <option value="armament">Armament</option>
                <option value="fuel">Fuel</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', color: 'var(--color-text-muted)' }}>Value Change</label>
              <input 
                type="number" 
                required 
                value={adjustForm.value} 
                onChange={e => setAdjustForm({...adjustForm, value: e.target.value})} 
                placeholder="-10 or +15"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', color: 'var(--color-text-muted)' }}>Cause (History Log)</label>
            <input 
              type="text" 
              required 
              value={adjustForm.cause} 
              onChange={e => setAdjustForm({...adjustForm, cause: e.target.value})} 
              placeholder="e.g. Famine, Trade deal, Attack"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <button type="button" className="btn-secondary" onClick={() => setAdjustingCity(null)}>Cancel</button>
            <button type="submit" className="btn-primary">Apply Adjustment</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
