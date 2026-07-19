import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGmStore } from '../../store/gmStore';
import Modal from '../ui/Modal';
import { Plus } from 'lucide-react';

export default function NpcsList() {
  const { campaignId } = useParams();
  const { npcs, fetchNpcs, createNpc } = useGmStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    race: '',
    role: '',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;
    try {
      await createNpc(campaignId, formData);
      setIsModalOpen(false);
      setFormData({ name: '', race: '', role: '', description: '' });
    } catch (err) {
      alert('Failed to create NPC');
    }
  };

  useEffect(() => {
    if (campaignId) {
      fetchNpcs(campaignId);
    }
  }, [campaignId, fetchNpcs]);

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: 'var(--color-primary)', margin: 0 }}>NPCs</h1>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Plus size={18} /> Create NPC
        </button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
        {npcs.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>No NPCs found.</div>
        ) : (
          npcs.map(npc => (
            <div key={npc.id} style={{ 
              backgroundColor: 'var(--color-surface)', 
              padding: '16px', 
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ margin: '0 0 4px 0', color: 'var(--color-text)' }}>{npc.name}</h3>
                {npc.isFavorite && <span style={{ color: 'var(--warning)', fontSize: '1.2rem' }}>★</span>}
              </div>
              <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                {npc.race} {npc.role && `• ${npc.role}`}
              </p>
              {npc.location && (
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  📍 {npc.location.name}
                </div>
              )}
              {npc.description && (
                <p style={{ 
                  marginTop: '12px', 
                  fontSize: '0.85rem', 
                  color: 'var(--color-text)',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  flex: 1
                }}>
                  {npc.description}
                </p>
              )}
            </div>
          ))
        )}
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New NPC">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', color: 'var(--color-text-muted)' }}>Name</label>
            <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', color: 'var(--color-text-muted)' }}>Race</label>
              <input value={formData.race} onChange={e => setFormData({...formData, race: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', color: 'var(--color-text-muted)' }}>Role</label>
              <input value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', color: 'var(--color-text-muted)' }}>Description</label>
            <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Create NPC</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
