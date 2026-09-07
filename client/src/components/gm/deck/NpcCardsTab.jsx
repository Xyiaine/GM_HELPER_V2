import React, { useState } from 'react';
import { generateRandomNpc, NPC_GENERATOR_DATA } from './deckData';
import { useGmStore } from '../../../store/gmStore';
import {
  User, MessageSquare, Activity, Key, Eye, EyeOff, Save, Trash2,
  Sparkles, Building2, Shield, Plus, Check
} from 'lucide-react';

const ATTITUDE_LEVELS = [
  { val: -2, label: 'Hostile', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' },
  { val: -1, label: 'Méfiant', color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)' },
  { val: 0, label: 'Neutre', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.15)' },
  { val: 1, label: 'Favorable', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
  { val: 2, label: 'Allié', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)' }
];

export default function NpcCardsTab() {
  const { activeCampaignId, createNpc } = useGmStore();
  const [activeNpcs, setActiveNpcs] = useState([
    generateRandomNpc("Cité Médicale")
  ]);
  const [selectedCityFilter, setSelectedCityFilter] = useState('');
  const [revealedSecrets, setRevealedSecrets] = useState({});
  const [savingId, setSavingId] = useState(null);

  const handleGenerateNpc = () => {
    const newNpc = generateRandomNpc(selectedCityFilter || null);
    setActiveNpcs(prev => [newNpc, ...prev]);
  };

  const handleRemoveNpc = (id) => {
    setActiveNpcs(prev => prev.filter(n => n.id !== id));
  };

  const handleAttitudeChange = (id, newAttitude) => {
    setActiveNpcs(prev => prev.map(n => n.id === id ? { ...n, attitude: newAttitude } : n));
  };

  const toggleSecret = (id) => {
    setRevealedSecrets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSaveToCampaign = async (npc) => {
    if (!activeCampaignId || npc.isSaved) return;
    setSavingId(npc.id);
    try {
      await createNpc(activeCampaignId, {
        name: npc.name,
        role: npc.role,
        personality: `${npc.speechPattern} | Tic: ${npc.physicalTic}`,
        description: `[Apparence] ${npc.appearance} \n[Secret] ${npc.secret} \n[Cité] ${npc.city}`,
        race: 'Humain'
      });
      setActiveNpcs(prev => prev.map(n => n.id === npc.id ? { ...n, isSaved: true } : n));
    } catch (err) {
      console.error('Error saving NPC to campaign:', err);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Top Generator Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '10px',
        padding: '12px 14px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Building2 size={16} color="var(--color-text-muted)" />
          <select
            value={selectedCityFilter}
            onChange={(e) => setSelectedCityFilter(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-background)',
              color: 'var(--color-text)',
              fontSize: '0.85rem'
            }}
          >
            <option value="">Toutes les Cités du Bassin</option>
            {NPC_GENERATOR_DATA.cities.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleGenerateNpc}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
          }}
        >
          <Sparkles size={16} /> 🎲 Générer un PNJ Express
        </button>
      </div>

      {/* Cards List */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
        gap: '12px'
      }}>
        {activeNpcs.map((npc) => {
          const currentAttitude = ATTITUDE_LEVELS.find(a => a.val === npc.attitude) || ATTITUDE_LEVELS[2];
          const isSecretRevealed = revealedSecrets[npc.id];

          return (
            <div
              key={npc.id}
              style={{
                backgroundColor: 'var(--color-surface)',
                border: `1px solid ${currentAttitude.color}40`,
                borderRadius: '10px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                boxShadow: `0 4px 16px ${currentAttitude.color}15`,
                transition: 'all 0.2s ease'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)' }}>
                    {npc.name}
                  </h4>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      color: 'var(--color-text)'
                    }}>
                      {npc.role}
                    </span>
                    <span style={{
                      fontSize: '0.72rem',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(99, 102, 241, 0.15)',
                      color: 'var(--color-primary-light)'
                    }}>
                      {npc.city}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveNpc(npc.id)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                  title="Retirer la carte"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {/* Quirk / Appearance */}
              <div style={{
                fontSize: '0.8rem',
                color: 'var(--color-text)',
                backgroundColor: 'var(--color-background)',
                padding: '8px',
                borderRadius: '6px',
                borderLeft: '3px solid var(--color-primary)'
              }}>
                <strong>Apparence :</strong> {npc.appearance}
              </div>

              {/* Roleplay Cues */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                  <MessageSquare size={14} color="#60a5fa" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: '#60a5fa' }}>Voix / Ton :</strong> {npc.speechPattern}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                  <Activity size={14} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: '#f59e0b' }}>Tic physique :</strong> {npc.physicalTic}
                  </div>
                </div>
              </div>

              {/* Secret inavouable (Toggleable) */}
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1px dashed rgba(239, 68, 68, 0.3)',
                borderRadius: '6px',
                padding: '8px',
                fontSize: '0.78rem'
              }}>
                <div
                  onClick={() => toggleSecret(npc.id)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    color: '#ef4444',
                    fontWeight: 600
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Key size={13} /> Secret Inavouable
                  </span>
                  {isSecretRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                </div>
                {isSecretRevealed && (
                  <p style={{ margin: '6px 0 0 0', color: 'var(--color-text)', lineHeight: 1.35 }}>
                    {npc.secret}
                  </p>
                )}
              </div>

              {/* Interactive Attitude Bar */}
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.72rem',
                  marginBottom: '4px'
                }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Disposition envers le groupe :</span>
                  <strong style={{ color: currentAttitude.color }}>{currentAttitude.label}</strong>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
                  {ATTITUDE_LEVELS.map((att) => {
                    const isActive = npc.attitude === att.val;
                    return (
                      <button
                        key={att.val}
                        onClick={() => handleAttitudeChange(npc.id, att.val)}
                        style={{
                          padding: '4px 2px',
                          borderRadius: '4px',
                          border: isActive ? `1px solid ${att.color}` : '1px solid var(--color-border)',
                          backgroundColor: isActive ? att.color : 'transparent',
                          color: isActive ? '#fff' : 'var(--color-text-muted)',
                          fontSize: '0.7rem',
                          fontWeight: isActive ? 700 : 400,
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        {att.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Save to Campaign Button */}
              <button
                onClick={() => handleSaveToCampaign(npc)}
                disabled={npc.isSaved || savingId === npc.id}
                style={{
                  padding: '6px',
                  borderRadius: '6px',
                  border: npc.isSaved ? '1px solid #10b981' : '1px solid var(--color-border)',
                  backgroundColor: npc.isSaved ? 'rgba(16, 185, 129, 0.12)' : 'var(--color-surface)',
                  color: npc.isSaved ? '#10b981' : 'var(--color-text-muted)',
                  fontSize: '0.78rem',
                  cursor: npc.isSaved ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  marginTop: '4px'
                }}
              >
                {npc.isSaved ? (
                  <>
                    <Check size={14} /> Enregistré dans la Campagne
                  </>
                ) : savingId === npc.id ? (
                  'Enregistrement...'
                ) : (
                  <>
                    <Save size={14} /> Enregistrer dans la Campagne
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
