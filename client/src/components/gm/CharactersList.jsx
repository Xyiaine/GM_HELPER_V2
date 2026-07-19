import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGmStore } from '../../store/gmStore';
import { Network, Plus, FileText, X } from 'lucide-react';
import SkillTreeViewer from './SkillTreeViewer';
import CharacterSheet from '../player/CharacterSheet';
import { formatClasses } from '../../utils/formatters';

export default function CharactersList() {
  const { campaignId } = useParams();
  const { characters, fetchCharacters, updateCharacter, createCharacter, campaigns, activeCampaignId } = useGmStore();
  const campaign = campaigns.find(c => c.id === activeCampaignId);
  const members = campaign?.memberships?.map(m => m.user) || [];
  const [editingTreeFor, setEditingTreeFor] = useState(null);
  const [viewingSheetFor, setViewingSheetFor] = useState(null);

  useEffect(() => {
    if (campaignId) {
      fetchCharacters(campaignId);
    }
  }, [campaignId, fetchCharacters]);

  const handleCreateCharacter = async () => {
    try {
      await createCharacter(campaignId, { name: "Nouveau PJ", race: "Humain" });
    } catch (err) {
      alert("Erreur lors de la création du personnage.");
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, color: 'var(--color-primary)' }}>Characters</h1>
        <button className="btn-primary" onClick={handleCreateCharacter} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={16} /> Nouveau PJ
        </button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
        {characters.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>No characters found.</div>
        ) : (
          characters.map(char => (
            <div key={char.id} style={{ 
              backgroundColor: 'var(--color-surface)', 
              padding: '16px', 
              borderRadius: '8px',
              border: '1px solid var(--color-border)'
            }}>
              <h3 style={{ margin: '0 0 8px 0', color: 'var(--color-text)' }}>{char.name}</h3>
              <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Level {char.level || 1} {char.race} {formatClasses(char.class)}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '8px' }}>
                <span>HP: {char.hpCurrent}/{char.hpMax}</span>
                <span>AC: {char.armorClass || 10}</span>
              </div>
              
              <div style={{ marginTop: '12px', padding: '8px', backgroundColor: 'var(--color-bg)', borderRadius: '4px', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ color: 'var(--color-text-muted)' }}>Joueur :</label>
                  <select 
                    value={char.ownerUserId || ''} 
                    onChange={(e) => updateCharacter(campaignId, char.id, { ownerUserId: e.target.value || null })}
                    style={{ background: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '4px' }}
                  >
                    <option value="">Aucun</option>
                    {members.map(u => (
                      <option key={u.id} value={u.id}>{u.displayName || u.email}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="checkbox" 
                    id={`edit-${char.id}`} 
                    checked={char.canBeEditedByPlayer || false}
                    onChange={(e) => updateCharacter(campaignId, char.id, { canBeEditedByPlayer: e.target.checked })}
                  />
                  <label htmlFor={`edit-${char.id}`} style={{ color: 'var(--color-text)' }}>Joueur peut éditer</label>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button 
                  onClick={() => setViewingSheetFor(char)}
                  style={{ 
                    flex: 1, padding: '8px', borderRadius: '4px', border: 'none',
                    background: 'var(--color-primary)', color: '#fff', fontWeight: 'bold', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                  }}
                >
                  <FileText size={14} /> Fiche PJ
                </button>
                <button 
                  onClick={() => setEditingTreeFor(char)}
                  style={{ 
                    flex: 1, padding: '8px', borderRadius: '4px', border: 'none',
                    background: '#f59e0b', color: '#fff', fontWeight: 'bold', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                  }}
                >
                  <Network size={14} /> Arbres
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {editingTreeFor && (
        <SkillTreeViewer 
          campaignId={campaignId}
          character={editingTreeFor}
          isGm={true}
          onUpdateCharacter={async (data) => {
            await updateCharacter(campaignId, editingTreeFor.id, data);
          }}
          onClose={() => setEditingTreeFor(null)}
        />
      )}

      {viewingSheetFor && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 50, display: 'flex', justifyContent: 'center', overflowY: 'auto', padding: '24px' }}>
          <div style={{ backgroundColor: 'var(--color-bg)', width: '100%', maxWidth: '800px', borderRadius: '8px', position: 'relative', minHeight: '80vh', border: '1px solid var(--color-border)' }}>
            <button onClick={() => setViewingSheetFor(null)} style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
              <X size={24} />
            </button>
            <CharacterSheet 
              campaignId={campaignId}
              characterData={viewingSheetFor}
              isGm={true}
              onUpdate={async (data) => {
                await updateCharacter(campaignId, viewingSheetFor.id, data);
                // Also update local state so the sheet updates immediately without waiting for fetch
                setViewingSheetFor({ ...viewingSheetFor, ...data });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
