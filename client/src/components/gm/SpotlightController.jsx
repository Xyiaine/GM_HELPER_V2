import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useGmStore } from '../../store/gmStore';
import { Image, Map as MapIcon, Type, X, Library, Link as LinkIcon, User, Building2, Sword } from 'lucide-react';

const ASSET_TABS = [
  { key: 'npcs', label: 'PNJ', icon: User },
  { key: 'locations', label: 'Lieux', icon: Building2 },
  { key: 'bestiary', label: 'Bestiaire', icon: Sword },
];

export default function SpotlightController({ sessionId, onClose }) {
  const { activeCampaignId, npcs, locations, bestiary, fetchNpcs, fetchLocations, fetchBestiary } = useGmStore();
  const [contentType, setContentType] = useState('image');
  const [imageUrl, setImageUrl] = useState('');
  const [text, setText] = useState('');
  const [mapAssetId, setMapAssetId] = useState('');
  const [inputMode, setInputMode] = useState('library'); // 'library' | 'url'
  const [assetTab, setAssetTab] = useState('npcs');
  const [loadingAssets, setLoadingAssets] = useState(false);

  useEffect(() => {
    if (!activeCampaignId) return;
    setLoadingAssets(true);
    Promise.all([
      fetchNpcs(activeCampaignId),
      fetchLocations(activeCampaignId),
      fetchBestiary(activeCampaignId),
    ]).finally(() => setLoadingAssets(false));
  }, [activeCampaignId, fetchNpcs, fetchLocations, fetchBestiary]);

  const getAssets = () => {
    switch (assetTab) {
      case 'npcs': return npcs.filter((n) => n.imageUrl);
      case 'locations': return locations.filter((l) => l.imageUrl);
      case 'bestiary': return bestiary.filter((b) => b.imageUrl);
      default: return [];
    }
  };

  const handleSelectAsset = (asset) => {
    setImageUrl(asset.imageUrl);
  };

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

  const assets = getAssets();

  return (
    <div style={{ padding: '12px', backgroundColor: 'var(--paper-raised)', border: '1px solid var(--rule)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '420px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, color: 'var(--ink)', fontFamily: 'var(--font-heading)' }}>Spotlight</h4>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--ink-muted)', cursor: 'pointer' }}><X size={16} /></button>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button className={contentType === 'image' ? 'btn-primary' : 'btn-secondary'} onClick={() => setContentType('image')} style={{ flex: 1, padding: '4px', fontSize: 'var(--text-xs)' }}><Image size={14}/> Image</button>
        <button className={contentType === 'banner' ? 'btn-primary' : 'btn-secondary'} onClick={() => setContentType('banner')} style={{ flex: 1, padding: '4px', fontSize: 'var(--text-xs)' }}><Type size={14}/> Bannière</button>
        <button className={contentType === 'battle_map' ? 'btn-primary' : 'btn-secondary'} onClick={() => setContentType('battle_map')} style={{ flex: 1, padding: '4px', fontSize: 'var(--text-xs)' }}><MapIcon size={14}/> Carte</button>
      </div>

      <form onSubmit={handleBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {(contentType === 'image' || contentType === 'banner') && (
          <>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className={inputMode === 'library' ? 'btn-primary' : 'btn-secondary'}
                onClick={() => setInputMode('library')}
                style={{ flex: 1, padding: '4px', fontSize: 'var(--text-xs)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
              >
                <Library size={14} /> Bibliothèque
              </button>
              <button
                type="button"
                className={inputMode === 'url' ? 'btn-primary' : 'btn-secondary'}
                onClick={() => setInputMode('url')}
                style={{ flex: 1, padding: '4px', fontSize: 'var(--text-xs)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
              >
                <LinkIcon size={14} /> URL
              </button>
            </div>

            {inputMode === 'library' ? (
              <>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {ASSET_TABS.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        className={assetTab === tab.key ? 'btn-primary' : 'btn-secondary'}
                        onClick={() => setAssetTab(tab.key)}
                        style={{ flex: 1, padding: '3px', fontSize: 'var(--text-2xs)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}
                      >
                        <Icon size={12} /> {tab.label}
                      </button>
                    );
                  })}
                </div>

                {loadingAssets ? (
                  <div style={{ textAlign: 'center', padding: 'var(--space-4)', color: 'var(--ink-muted)', fontSize: 'var(--text-xs)' }}>Chargement…</div>
                ) : assets.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 'var(--space-4)', color: 'var(--ink-muted)', fontSize: 'var(--text-xs)' }}>
                    Aucun {ASSET_TABS.find((t) => t.key === assetTab)?.label.toLowerCase()} avec image.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', maxHeight: '180px', overflowY: 'auto', padding: '2px' }}>
                    {assets.map((asset) => (
                      <button
                        key={asset.id}
                        type="button"
                        onClick={() => handleSelectAsset(asset)}
                        style={{
                          position: 'relative',
                          padding: 0,
                          border: imageUrl === asset.imageUrl ? '2px solid var(--accent-rust)' : '1px solid var(--rule)',
                          borderRadius: 'var(--radius-sm)',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          background: 'var(--paper)',
                          aspectRatio: '1',
                        }}
                      >
                        <img
                          src={asset.imageUrl}
                          alt={asset.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          loading="lazy"
                        />
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          padding: '2px 4px',
                          background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                          color: '#fff',
                          fontSize: 'var(--text-2xs)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {asset.name}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <input
                type="text"
                placeholder="URL de l'image"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                style={{ padding: '6px', borderRadius: 'var(--radius-md)', border: '1px solid var(--rule)', backgroundColor: 'var(--paper)', color: 'var(--ink)' }}
              />
            )}
          </>
        )}

        {(contentType === 'map_zone' || contentType === 'battle_map') && (
          <input
            type="text"
            placeholder="ID de la carte"
            value={mapAssetId}
            onChange={(e) => setMapAssetId(e.target.value)}
            style={{ padding: '6px', borderRadius: 'var(--radius-md)', border: '1px solid var(--rule)', backgroundColor: 'var(--paper)', color: 'var(--ink)' }}
          />
        )}

        <textarea
          placeholder="Texte superposé (optionnel)…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ padding: '6px', borderRadius: 'var(--radius-md)', border: '1px solid var(--rule)', backgroundColor: 'var(--paper)', color: 'var(--ink)', resize: 'none' }}
          rows={2}
        />

        {imageUrl && (
          <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--ink-muted)', wordBreak: 'break-all' }}>
            Image sélectionnée : {imageUrl}
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="submit" className="btn-primary" style={{ flex: 1, padding: '6px' }}>Diffuser</button>
          <button type="button" className="btn-secondary" onClick={handleClear} style={{ padding: '6px', color: 'var(--danger)' }}>Effacer</button>
        </div>
      </form>
    </div>
  );
}
