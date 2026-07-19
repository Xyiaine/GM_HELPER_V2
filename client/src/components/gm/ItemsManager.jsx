import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGmStore } from '../../store/gmStore';
import Modal from '../ui/Modal';
import { Package, Plus } from 'lucide-react';

export default function ItemsManager() {
  const { campaignId } = useParams();
  const { items, fetchItems, createItem } = useGmStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'weapon',
    rarity: 'common',
    description: '',
    value: 0,
    weight: 0
  });

  useEffect(() => {
    if (campaignId) {
      fetchItems(campaignId);
    }
  }, [campaignId, fetchItems]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createItem(campaignId, {
        ...formData,
        value: Number(formData.value),
        weight: Number(formData.weight)
      });
      setIsModalOpen(false);
      setFormData({ name: '', type: 'weapon', rarity: 'common', description: '', value: 0, weight: 0 });
    } catch (err) {
      alert('Failed to create item');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: 'var(--color-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Package /> Items & Loot
        </h1>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Plus size={18} /> Create Item
        </button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {items.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>No items found. Create one!</div>
        ) : (
          items.map(item => (
            <div key={item.id} style={{ 
              backgroundColor: 'var(--color-surface)', 
              padding: '16px', 
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
            }}>
              <h3 style={{ margin: '0 0 8px 0', color: 'var(--color-text)' }}>{item.name}</h3>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '12px', backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                  {item.type}
                </span>
                <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '12px', backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)', color: item.rarity === 'legendary' ? 'var(--warning, #f59e0b)' : 'var(--color-primary)' }}>
                  {item.rarity}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{item.description}</p>
              <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--color-text)' }}>
                Value: {item.value} | Weight: {item.weight}
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Item">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', color: 'var(--color-text-muted)' }}>Name</label>
            <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', color: 'var(--color-text-muted)' }}>Type</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="weapon">Weapon</option>
                <option value="armor">Armor</option>
                <option value="potion">Potion</option>
                <option value="misc">Misc</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', color: 'var(--color-text-muted)' }}>Rarity</label>
              <select value={formData.rarity} onChange={e => setFormData({...formData, rarity: e.target.value})}>
                <option value="common">Common</option>
                <option value="uncommon">Uncommon</option>
                <option value="rare">Rare</option>
                <option value="legendary">Legendary</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', color: 'var(--color-text-muted)' }}>Description</label>
            <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', color: 'var(--color-text-muted)' }}>Value</label>
              <input type="number" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', color: 'var(--color-text-muted)' }}>Weight</label>
              <input type="number" step="0.1" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Create Item</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
