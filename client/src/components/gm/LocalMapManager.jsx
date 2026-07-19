import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Map as MapIcon,
  Upload,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Plus,
  ChevronLeft,
  Pin,
  Trash2,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import api from '../../utils/api';
import useAuthStore from '../../store/authStore';
import { getBuildingLore } from '../../utils/loreData';

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 8;
const ZOOM_STEP = 0.15;
const SAVE_DEBOUNCE_MS = 1500;

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function canvasToWorld(cx, cy, pan, zoom) {
  return {
    wx: (cx - pan.x) / zoom,
    wy: (cy - pan.y) / zoom,
  };
}

function worldToCanvas(wx, wy, pan, zoom) {
  return {
    cx: wx * zoom + pan.x,
    cy: wy * zoom + pan.y,
  };
}

export default function LocalMapManager() {
  const { campaignId, locationId } = useParams();
  const { accessToken } = useAuthStore();

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const bgImageRef = useRef(null);
  const animFrameRef = useRef(null);
  const saveTimerRef = useRef(null);

  const [location, setLocation] = useState(null);
  const [customMarkers, setCustomMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [bgLoaded, setBgLoaded] = useState(false);

  const panRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(1);
  const isPanningRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const draggingMarkerRef = useRef(null);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tool, setTool] = useState('pan');
  const [newMarkerLabel, setNewMarkerLabel] = useState('');
  const [newMarkerColor, setNewMarkerColor] = useState('#f59e0b');
  const [addingMarker, setAddingMarker] = useState(false);
  const [hoveredEntity, setHoveredEntity] = useState(null);
  const [newMarkerDescription, setNewMarkerDescription] = useState('');

  const fetchMap = useCallback(async () => {
    if (!campaignId || !locationId) return;
    setIsLoading(true);
    try {
      const data = await api.get(`/api/v1/gm/campaigns/${campaignId}/locations/${locationId}`);
      setLocation(data.location);

      if (data.location.imageUrl) {
        loadBgImage(data.location.imageUrl, true);
      }
      
      let parsedMarkers = [];
      try {
        if (data.location.notableFeatures) {
          parsedMarkers = JSON.parse(data.location.notableFeatures).markers || [];
        }
      } catch (e) {}

      const childLocs = data.location.childLocations || [];
      const newMarkers = [...parsedMarkers];
      let changed = false;
      
      childLocs.forEach(child => {
        const existing = newMarkers.find(m => m.id === child.id);
        if (!existing) {
          newMarkers.push({
            id: child.id,
            wx: 300 + Math.random() * 400,
            wy: 300 + Math.random() * 400,
            label: child.name,
            color: '#10b981',
            description: child.description
          });
          changed = true;
        } else {
          if (existing.description !== child.description || existing.label !== child.name) {
            existing.description = child.description;
            existing.label = child.name;
            changed = true;
          }
        }
      });
      setCustomMarkers(newMarkers);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [campaignId, locationId]);

  const saveLocalMap = useCallback(
    (newMarkers) => {
      if (!campaignId || !locationId) return;
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(async () => {
        setIsSaving(true);
        try {
          const payload = {
            notableFeatures: JSON.stringify({ markers: newMarkers }),
          };
          await api.put(`/api/v1/gm/campaigns/${campaignId}/locations/${locationId}`, payload);
        } catch (err) {
          console.error('Save failed:', err);
        } finally {
          setIsSaving(false);
        }
      }, SAVE_DEBOUNCE_MS);
    },
    [campaignId, locationId]
  );

  const fitMapToCanvasRef = useRef(null);

  function loadBgImage(url, autoFit = false) {
    setBgLoaded(false);
    const img = new Image();
    img.onload = () => {
      bgImageRef.current = img;
      setBgLoaded(true);
      if (autoFit && fitMapToCanvasRef.current) {
        setTimeout(() => {
          if (fitMapToCanvasRef.current) fitMapToCanvasRef.current();
        }, 150);
      }
    };
    img.src = url;
  }

  useEffect(() => {
    fetchMap();
  }, [fetchMap]);

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch(
        `/api/v1/gm/campaigns/${campaignId}/locations/${locationId}/image`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
          body: formData,
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setLocation(prev => ({ ...prev, imageUrl: data.url }));
      loadBgImage(data.url);
    } catch (err) {
      setError(err.message);
    }
  }

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    const z = zoomRef.current;
    const p = panRef.current;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, width, height);

    if (bgImageRef.current) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.scale(z, z);
      ctx.drawImage(bgImageRef.current, 0, 0);
      ctx.restore();
    }

    customMarkers.forEach((m) => {
      const { cx, cy } = worldToCanvas(m.wx, m.wy, p, z);
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fillStyle = m.color || '#f59e0b';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      if (m.label) {
        ctx.font = `10px Inter, sans-serif`;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'rgba(0,0,0,0.8)';
        ctx.lineWidth = 2.5;
        ctx.textAlign = 'center';
        ctx.strokeText(m.label, cx, cy + 19);
        ctx.fillText(m.label, cx, cy + 19);
      }
    });

    animFrameRef.current = requestAnimationFrame(draw);
  }, [customMarkers, bgLoaded]);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(draw);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    const observer = new ResizeObserver(() => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const handleMouseDown = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (addingMarker) {
      const { wx, wy } = canvasToWorld(mx, my, panRef.current, zoomRef.current);
      const newM = { id: Date.now().toString(), wx, wy, label: newMarkerLabel, color: newMarkerColor, description: newMarkerDescription };
      const updated = [...customMarkers, newM];
      setCustomMarkers(updated);
      saveLocalMap(updated);
      setAddingMarker(false);
      setNewMarkerDescription('');
      return;
    }

    let hit = null;
    for (const m of customMarkers) {
      const { cx, cy } = worldToCanvas(m.wx, m.wy, panRef.current, zoomRef.current);
      if (Math.hypot(mx - cx, my - cy) <= 10) {
        hit = m;
        break;
      }
    }
    
    if (hit) {
      draggingMarkerRef.current = hit;
      return;
    }

    isPanningRef.current = true;
    lastMouseRef.current = { x: mx, y: my };
  }, [addingMarker, newMarkerLabel, newMarkerColor, newMarkerDescription, customMarkers, saveLocalMap]);

  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (draggingMarkerRef.current) {
      const { wx, wy } = canvasToWorld(mx, my, panRef.current, zoomRef.current);
      const updated = customMarkers.map(m => m.id === draggingMarkerRef.current.id ? { ...m, wx, wy } : m);
      setCustomMarkers(updated);
      draggingMarkerRef.current = updated.find(m => m.id === draggingMarkerRef.current.id);
      return;
    }

    if (!isPanningRef.current) {
      let hit = null;
      for (const m of customMarkers) {
        const { cx, cy } = worldToCanvas(m.wx, m.wy, panRef.current, zoomRef.current);
        if (Math.hypot(mx - cx, my - cy) <= 10) {
          const nativeLore = getBuildingLore(location?.name, m.label);
          hit = { type: 'marker', data: m, lore: nativeLore, x: e.clientX, y: e.clientY };
          break;
        }
      }
      setHoveredEntity(hit);
      return;
    }

    const dx = mx - lastMouseRef.current.x;
    const dy = my - lastMouseRef.current.y;
    lastMouseRef.current = { x: mx, y: my };
    panRef.current = { x: panRef.current.x + dx, y: panRef.current.y + dy };
    setPan({ ...panRef.current });
  }, [customMarkers, location]);

  const handleMouseUp = useCallback(() => {
    if (draggingMarkerRef.current) {
      saveLocalMap(customMarkers);
      draggingMarkerRef.current = null;
    }
    isPanningRef.current = false;
  }, [customMarkers, saveLocalMap]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const oldZoom = zoomRef.current;
    const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
    const newZoom = clamp(oldZoom + delta, MIN_ZOOM, MAX_ZOOM);
    const scaleFactor = newZoom / oldZoom;
    panRef.current = {
      x: mx - (mx - panRef.current.x) * scaleFactor,
      y: my - (my - panRef.current.y) * scaleFactor,
    };
    zoomRef.current = newZoom;
    setZoom(newZoom);
    setPan({ ...panRef.current });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (canvas) canvas.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  const fitMapToCanvas = () => {
    if (!bgImageRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    
    const container = canvas.parentElement;
    if (container && container.clientWidth > 0) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }
    
    if (canvas.width === 0 || canvas.height === 0) return;

    const img = bgImageRef.current;
    const scaleX = canvas.width / img.width;
    const scaleY = canvas.height / img.height;
    const newZoom = clamp(Math.min(scaleX, scaleY) * 0.95, MIN_ZOOM, MAX_ZOOM);
    zoomRef.current = newZoom;
    setZoom(newZoom);
    const scaledWidth = img.width * newZoom;
    const scaledHeight = img.height * newZoom;
    const newPan = { x: (canvas.width - scaledWidth) / 2, y: (canvas.height - scaledHeight) / 2 };
    panRef.current = newPan;
    setPan(newPan);
  };

  useEffect(() => {
    fitMapToCanvasRef.current = fitMapToCanvas;
  }, [customMarkers]);

  const deleteMarker = (id) => {
    const updated = customMarkers.filter(p => p.id !== id);
    setCustomMarkers(updated);
    saveLocalMap(updated);
  };

  if (isLoading) {
    return <div style={{ color: 'white', padding: 20 }}>Loading map...</div>;
  }

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: '#0f172a', position: 'absolute', inset: 0 }}>
      {/* TOOLBAR */}
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10, display: 'flex', gap: 12 }}>
        <div style={{ background: 'var(--color-surface)', padding: 6, borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button onClick={() => setZoom(z => clamp(z + ZOOM_STEP, MIN_ZOOM, MAX_ZOOM))}><ZoomIn size={18} /></button>
          <button onClick={() => setZoom(z => clamp(z - ZOOM_STEP, MIN_ZOOM, MAX_ZOOM))}><ZoomOut size={18} /></button>
          <button onClick={fitMapToCanvas}><Maximize2 size={18} /></button>
          <button onClick={() => { panRef.current = { x: 0, y: 0 }; zoomRef.current = 1; setZoom(1); setPan({ x: 0, y: 0 }); }}><RefreshCw size={18} /></button>
          <div style={{ height: 1, background: 'var(--color-border)', margin: '4px 0' }} />
          <button onClick={() => fileInputRef.current?.click()} title="Upload Base Map"><Upload size={18} /></button>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />
        </div>
        
        <div style={{ background: 'var(--color-surface)', padding: 6, borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <input type="text" value={newMarkerLabel} onChange={(e) => setNewMarkerLabel(e.target.value)} placeholder="Marker label..." style={{ width: 130 }} />
          <input type="text" value={newMarkerDescription} onChange={(e) => setNewMarkerDescription(e.target.value)} placeholder="Lore / Description..." style={{ width: 130 }} />
          <div style={{ display: 'flex', gap: 4 }}>
            <input type="color" value={newMarkerColor} onChange={(e) => setNewMarkerColor(e.target.value)} style={{ width: 28, height: 28 }} />
            <button onClick={() => setAddingMarker(v => !v)} style={{ flex: 1, background: addingMarker ? '#f59e0b' : 'rgba(255,255,255,0.1)', color: addingMarker ? '#111' : 'white' }}><Pin size={14} /> Add Pin</button>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <canvas ref={canvasRef} style={{ display: 'block', cursor: addingMarker ? 'crosshair' : (draggingMarkerRef.current ? 'grabbing' : 'grab'), touchAction: 'none' }} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} />
      </div>

      <div style={{ width: 250, background: 'var(--color-surface)', borderLeft: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
        <div style={{ padding: 16, borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to={`/gm/campaigns/${campaignId}/map`} style={{ color: 'var(--color-text)' }}><ArrowLeft size={18} /></Link>
          <h3 style={{ margin: 0 }}>{location?.name} Map</h3>
        </div>
        <div style={{ padding: 16, flex: 1, overflowY: 'auto' }}>
          <h4 style={{ color: 'var(--color-text-muted)' }}>Custom Pins</h4>
          {customMarkers.map(m => (
            <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: m.color }} />
                <span>{m.label || 'Unnamed'}</span>
              </div>
              <button onClick={() => deleteMarker(m.id)} style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer' }}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip Render */}
      {hoveredEntity && (
        <div
          style={{
            position: 'fixed',
            left: hoveredEntity.x + 15,
            top: hoveredEntity.y + 15,
            background: 'rgba(17,24,39,0.95)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 8,
            padding: 12,
            maxWidth: 320,
            pointerEvents: 'none',
            zIndex: 1000,
            backdropFilter: 'blur(8px)',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
            color: 'white',
            fontSize: '0.85rem',
            lineHeight: 1.4,
          }}
        >
          <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: hoveredEntity.data.color || '#f59e0b' }}>
            {hoveredEntity.data.label || 'Unnamed Marker'}
          </h4>
          
          {hoveredEntity.lore && hoveredEntity.lore.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {hoveredEntity.lore.map((point, i) => <li key={i}>{point}</li>)}
            </ul>
          ) : hoveredEntity.data.description ? (
            <p style={{ margin: 0 }}>{hoveredEntity.data.description}</p>
          ) : (
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>Aucune information disponible.</p>
          )}
        </div>
      )}
    </div>
  );
}
