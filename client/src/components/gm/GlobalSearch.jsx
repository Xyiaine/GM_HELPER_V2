import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search, User, MapPin, Sword, Package, FileText, X } from 'lucide-react';
import api from '../../utils/api';

export default function GlobalSearch() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 2 && campaignId) {
        setIsLoading(true);
        try {
          const data = await api.get(`/api/v1/gm/campaigns/${campaignId}/search?q=${encodeURIComponent(query)}`);
          setResults(data.results || []);
          setIsOpen(true);
        } catch (err) {
          console.error('Search failed', err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, campaignId]);

  const handleSelect = (item) => {
    setIsOpen(false);
    setQuery('');
    
    // Navigate based on entity type
    switch (item.entityType) {
      case 'character':
        navigate(`/gm/campaigns/${campaignId}/characters`);
        break;
      case 'npc':
        navigate(`/gm/campaigns/${campaignId}/npcs`);
        break;
      case 'location':
        navigate(`/gm/campaigns/${campaignId}/locations`);
        break;
      case 'quest':
        navigate(`/gm/campaigns/${campaignId}/quests`);
        break;
      case 'item':
        navigate(`/gm/campaigns/${campaignId}/items`);
        break;
      case 'note':
        navigate(`/gm/campaigns/${campaignId}/notes`);
        break;
      default:
        break;
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'character': return <User size={16} color="var(--color-primary)" />;
      case 'npc': return <User size={16} color="var(--warning, #f59e0b)" />;
      case 'location': return <MapPin size={16} color="var(--success, #10b981)" />;
      case 'quest': return <Sword size={16} color="var(--danger, #ef4444)" />;
      case 'item': return <Package size={16} color="#8b5cf6" />;
      case 'note': return <FileText size={16} color="var(--color-text-muted)" />;
      default: return <Search size={16} />;
    }
  };

  if (!campaignId) return null;

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '300px' }}>
      <div style={{ position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--color-text-muted)' }} />
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
          placeholder="Global Search (Ctrl+K)"
          style={{ 
            width: '100%', 
            padding: '8px 10px 8px 32px', 
            borderRadius: '20px', 
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)'
          }}
        />
        {query && (
          <X 
            size={14} 
            onClick={() => { setQuery(''); setIsOpen(false); }}
            style={{ position: 'absolute', right: '10px', top: '11px', color: 'var(--color-text-muted)', cursor: 'pointer' }} 
          />
        )}
      </div>

      {isOpen && (
        <div style={{ 
          position: 'absolute', 
          top: '100%', 
          left: 0, 
          right: 0, 
          marginTop: '8px', 
          backgroundColor: 'var(--color-surface)', 
          border: '1px solid var(--color-border)', 
          borderRadius: '8px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          maxHeight: '400px',
          overflowY: 'auto',
          zIndex: 1000
        }}>
          {isLoading ? (
            <div style={{ padding: '16px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Searching...</div>
          ) : results.length === 0 ? (
            <div style={{ padding: '16px', textAlign: 'center', color: 'var(--color-text-muted)' }}>No results found</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {results.map((item, idx) => (
                <li 
                  key={`${item.entityType}-${item.id}-${idx}`}
                  onClick={() => handleSelect(item)}
                  style={{ 
                    padding: '12px 16px', 
                    borderBottom: '1px solid var(--color-border)', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-background)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {getIcon(item.entityType)}
                  <div>
                    <div style={{ color: 'var(--color-text)', fontWeight: '500', fontSize: '0.95rem' }}>{item.name}</div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'capitalize' }}>
                      {item.entityType} {item.type ? `• ${item.type}` : ''} {item.race ? `• ${item.race}` : ''}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
