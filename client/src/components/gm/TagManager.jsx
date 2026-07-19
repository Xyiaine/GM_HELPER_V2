import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGmStore } from '../../store/gmStore';
import { Tag, Trash2 } from 'lucide-react';
import Modal from '../ui/Modal';

export default function TagManager() {
  const { campaignId } = useParams();
  const { tags, fetchTags, createTag, deleteTag } = useGmStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', color: '#3b82f6' });

  useEffect(() => {
    if (campaignId) {
      fetchTags(campaignId);
    }
  }, [campaignId, fetchTags]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTag(campaignId, formData);
      setFormData({ name: '', color: '#3b82f6' });
      setIsModalOpen(false);
    } catch (err) {
      alert('Failed to create tag');
    }
  };

  const handleDelete = async (tagId) => {
    if (confirm('Are you sure you want to delete this tag? It will be removed from all entities.')) {
      await deleteTag(campaignId, tagId);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: 'var(--color-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Tag /> Campaign Tags
        </h1>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>Create Tag</button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        {tags.length === 0 ? (
          <div className="empty-state">No tags found.</div>
        ) : (
          tags.map(tag => (
            <div key={tag.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: '20px',
              backgroundColor: `${tag.color}20`,
              border: `1px solid ${tag.color}`,
              color: 'var(--color-text)'
            }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: tag.color }} />
              <span>{tag.name}</span>
              <button 
                onClick={() => handleDelete(tag.id)}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '0 4px' }}
                title="Delete Tag"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Tag">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', color: 'var(--color-text-muted)' }}>Name</label>
            <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', color: 'var(--color-text-muted)' }}>Color</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input type="color" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} style={{ width: '50px', height: '40px', padding: 0, border: 'none' }} />
              <input type="text" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} pattern="^#[0-9a-fA-F]{6}$" style={{ width: '100px' }} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Create</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
