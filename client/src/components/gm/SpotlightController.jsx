import React, { useState } from 'react';
import api from '../../utils/api';
import { useGmStore } from '../../store/gmStore';
import { Image, Map as MapIcon, Type, X } from 'lucide-react';

export default function SpotlightController({ sessionId, onClose }) {
  const { activeCampaignId } = useGmStore();
  const [contentType, setContentType] = useState('image');
  const [imageUrl, setImageUrl] = useState('');
  const [text, setText] = useState('');
  const [mapAssetId, setMapAssetId] = useState('');

  const handleBroadcast = async (e) => {
    e.preventDefault();
    try {
      const payload = { contentType };
      if (contentType === 'image' || contentType === 'banner') payload.imageUrl = imageUrl;
      if (contentType === 'map_zone' || contentType === 'battle_map') payload.mapAssetId = mapAssetId;
      if (text) payload.text = text;

      await api.post(`/api/v1/gm/campaigns/${activeCampaignId}/sessions/${sessionId}/spotlight`, payload);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClear = async () => {
    try {
      await api.delete(`/api/v1/gm/campaigns/${activeCampaignId}/sessions/${sessionId}/spotlight`);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '12px', backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, color: 'var(--color-text)' }}>Spotlight Control</h4>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><X size={16} /></button>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button className={contentType === 'image' ? 'btn-primary' : 'btn-secondary'} onClick={() => setContentType('image')} style={{ flex: 1, padding: '4px', fontSize: '0.8rem' }}><Image size={14}/> Image</button>
        <button className={contentType === 'banner' ? 'btn-primary' : 'btn-secondary'} onClick={() => setContentType('banner')} style={{ flex: 1, padding: '4px', fontSize: '0.8rem' }}><Type size={14}/> Banner</button>
        <button className={contentType === 'battle_map' ? 'btn-primary' : 'btn-secondary'} onClick={() => setContentType('battle_map')} style={{ flex: 1, padding: '4px', fontSize: '0.8rem' }}><MapIcon size={14}/> Map</button>
      </div>

      <form onSubmit={handleBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {(contentType === 'image' || contentType === 'banner') && (
          <input 
            type="text" 
            placeholder="Image URL" 
            value={imageUrl} 
            onChange={e => setImageUrl(e.target.value)} 
            style={{ padding: '6px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
          />
        )}
        {(contentType === 'map_zone' || contentType === 'battle_map') && (
          <input 
            type="text" 
            placeholder="Map Asset ID" 
            value={mapAssetId} 
            onChange={e => setMapAssetId(e.target.value)} 
            style={{ padding: '6px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
          />
        )}
        <textarea 
          placeholder="Optional text overlay..." 
          value={text} 
          onChange={e => setText(e.target.value)} 
          style={{ padding: '6px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', resize: 'none' }}
          rows={2}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="submit" className="btn-primary" style={{ flex: 1, padding: '6px' }}>Broadcast</button>
          <button type="button" className="btn-secondary" onClick={handleClear} style={{ padding: '6px', color: 'var(--error, #ef4444)' }}>Clear</button>
        </div>
      </form>
    </div>
  );
}
