import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Map as MapIcon,
  Upload,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Plus,
  X,
  ChevronRight,
  ChevronLeft,
  Crosshair,
  Layers,
  Eye,
  EyeOff,
  Pin,
  Trash2,
  Save,
  RefreshCw,
} from 'lucide-react';
import api from '../../utils/api';
import useAuthStore from '../../store/authStore';
import { getCityLore } from '../../utils/loreData';

// ─── Constants ────────────────────────────────────────────────
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 8;
const ZOOM_STEP = 0.15;
const CITY_MARKER_RADIUS = 10;
const SAVE_DEBOUNCE_MS = 1500;

// ─── Helpers ──────────────────────────────────────────────────
function hexToRgba(hex, alpha = 0.25) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

// Convert canvas coords → world coords
function canvasToWorld(cx, cy, pan, zoom) {
  return {
    wx: (cx - pan.x) / zoom,
    wy: (cy - pan.y) / zoom,
  };
}

// Convert world coords → canvas coords
function worldToCanvas(wx, wy, pan, zoom) {
  return {
    cx: wx * zoom + pan.x,
    cy: wy * zoom + pan.y,
  };
}

// ─── City Parameter Bar ───────────────────────────────────────
// Ce composant n'est utilisé que dans le panneau latéral de la carte, qui reste
// un panneau sombre : il lui faut donc les encres prévues pour ces surfaces.
function ParamBar({ label, value, color }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 2 }}>
        <span style={{ color: 'var(--ink-on-dark-muted)' }}>{label}</span>
        <span style={{ color: 'var(--ink-on-dark)', fontWeight: 600 }}>{value}</span>
      </div>
      <div style={{ height: 5, background: 'var(--overlay-soft)', borderRadius: 3, overflow: 'hidden' }}>
        <div
          style={{
            width: `${value}%`,
            height: '100%',
            background: color,
            borderRadius: 3,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────
export default function MapManager() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const bgImageRef = useRef(null);
  const animFrameRef = useRef(null);
  const saveTimerRef = useRef(null);

  // Map state
  const [worldMap, setWorldMap] = useState(null);
  const [cities, setCities] = useState([]);
  const [customMarkers, setCustomMarkers] = useState([]); // { id, wx, wy, label, color }
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [bgLoaded, setBgLoaded] = useState(false);

  // Canvas interaction state (refs to avoid stale closures in handlers)
  const panRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(1);
  const isPanningRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const draggingCityRef = useRef(null);
  const draggedCityHasMovedRef = useRef(false);
  const dragStartMouseRef = useRef({ x: 0, y: 0 });
  // UI state
  const [zoom, setZoom] = useState(1); // mirror for display
  const [pan, setPan] = useState({ x: 0, y: 0 }); // mirror for display
  const [selectedCity, setSelectedCity] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tool, setTool] = useState('pan'); // 'pan' | 'marker'
  const [showTerritories, setShowTerritories] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [newMarkerLabel, setNewMarkerLabel] = useState('');
  const [newMarkerColor, setNewMarkerColor] = useState('#f59e0b');
  const [addingMarker, setAddingMarker] = useState(false);
  const [hoveredEntity, setHoveredEntity] = useState(null);

  // ── Fetch world map data ─────────────────────────────────────
  const fetchMap = useCallback(async () => {
    if (!campaignId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get(`/api/v1/gm/campaigns/${campaignId}/world-map`);
      setWorldMap(data.worldMap);
      setCities(data.cities || []);

      // Restore saved view
      if (data.worldMap.zoom) {
        zoomRef.current = data.worldMap.zoom;
        setZoom(data.worldMap.zoom);
      }
      if (data.worldMap.panX != null) {
        panRef.current = { x: data.worldMap.panX, y: data.worldMap.panY };
        setPan({ x: data.worldMap.panX, y: data.worldMap.panY });
      }

      // Restore custom markers from canvasState
      if (data.worldMap.canvasState) {
        try {
          const state = JSON.parse(data.worldMap.canvasState);
          setCustomMarkers(state.markers || []);
        } catch {
          setCustomMarkers([]);
        }
      }

      // Load background image
      const isDefault = data.worldMap.zoom === 1 && data.worldMap.panX === 0 && data.worldMap.panY === 0;
      if (data.worldMap.baseMapImageUrl) {
        loadBgImage(data.worldMap.baseMapImageUrl, isDefault);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [campaignId]);

  const fitMapToCanvasRef = useRef(null);

  function loadBgImage(url, autoFit = false) {
    setBgLoaded(false);
    const img = new Image();
    img.onload = () => {
      bgImageRef.current = img;
      setBgLoaded(true);
      if (autoFit && fitMapToCanvasRef.current) {
        // Wait for layout to settle before fitting
        setTimeout(() => {
          if (fitMapToCanvasRef.current) fitMapToCanvasRef.current();
        }, 150);
      }
    };
    img.onerror = () => {
      bgImageRef.current = null;
      setBgLoaded(false);
    };
    img.src = url;
  }

  useEffect(() => {
    fetchMap();
  }, [fetchMap]);

  // ── Save world map state (debounced) ─────────────────────────
  const saveMap = useCallback(
    (newZoom, newPan, newMarkers) => {
      if (!campaignId) return;
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(async () => {
        setIsSaving(true);
        try {
          await api.put(`/api/v1/gm/campaigns/${campaignId}/world-map`, {
            zoom: newZoom,
            panX: newPan.x,
            panY: newPan.y,
            canvasState: JSON.stringify({ markers: newMarkers }),
          });
        } catch (err) {
          console.error('Save failed:', err);
        } finally {
          setIsSaving(false);
        }
      }, SAVE_DEBOUNCE_MS);
    },
    [campaignId]
  );

  // ── Upload background image ─────────────────────────────────
  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const token = accessToken;
      const res = await fetch(
        `/api/v1/gm/campaigns/${campaignId}/world-map/base-image`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setWorldMap(data.worldMap);
      loadBgImage(data.worldMap.baseMapImageUrl);
    } catch (err) {
      setError(err.message);
    }
  }

  // ── Draw loop ─────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    const z = zoomRef.current;
    const p = panRef.current;

    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, width, height);

    // Grid
    drawGrid(ctx, width, height, z, p);

    // Base map image
    if (bgImageRef.current) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.scale(z, z);
      ctx.drawImage(bgImageRef.current, 0, 0);
      ctx.restore();
    }

    // Territory overlays
    if (showTerritories) {
      cities.forEach((city) => {
        if (city.mapX != null && city.mapY != null) {
          const totalStats = (city.health || 50) + (city.wealth || 50) + (city.technology || 50) + (city.food || 50) + (city.happiness || 50) + (city.armament || 50) + (city.fuel || 50);
          const maxStats = 700;
          const territoryRadius = 30 + (totalStats / maxStats) * 120; // 30 to 150 radius

          const { cx, cy } = worldToCanvas(city.mapX, city.mapY, p, z);
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, territoryRadius * z, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgba(city.factionColor || '#6366f1', 0.2);
          ctx.strokeStyle = hexToRgba(city.factionColor || '#6366f1', 0.6);
          ctx.lineWidth = 1;
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }
      });
    }

    // City markers
    cities.forEach((city) => {
      if (city.mapX == null || city.mapY == null) return;
      const { cx, cy } = worldToCanvas(city.mapX, city.mapY, p, z);
      const color = city.factionColor || '#6366f1';
      const isSelected = selectedCity?.id === city.id;

      // Glow effect for selected
      if (isSelected) {
        ctx.save();
        ctx.shadowBlur = 20;
        ctx.shadowColor = color;
        ctx.restore();
      }

      // Outer ring
      ctx.beginPath();
      ctx.arc(cx, cy, CITY_MARKER_RADIUS + (isSelected ? 3 : 0), 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? color : hexToRgba(color, 0.3);
      ctx.fill();

      // Inner dot
      ctx.beginPath();
      ctx.arc(cx, cy, CITY_MARKER_RADIUS - 3, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // White center
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();

      // Label
      if (showLabels) {
        ctx.font = `bold ${Math.max(9, 11 * Math.min(z, 2))}px Inter, sans-serif`;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'rgba(0,0,0,0.8)';
        ctx.lineWidth = 3;
        ctx.textAlign = 'center';
        const label = city.location?.name || 'City';
        ctx.strokeText(label, cx, cy + CITY_MARKER_RADIUS + 14);
        ctx.fillText(label, cx, cy + CITY_MARKER_RADIUS + 14);
      }
    });

    // Custom markers
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
      if (showLabels && m.label) {
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
  }, [cities, customMarkers, showTerritories, showLabels, selectedCity, bgLoaded]);

  function drawGrid(ctx, width, height, z, p) {
    const baseSpacing = 100;
    const spacing = baseSpacing * z;
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    const startX = p.x % spacing;
    const startY = p.y % spacing;
    ctx.beginPath();
    for (let x = startX; x < width; x += spacing) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = startY; y < height; y += spacing) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();
  }

  // Start/stop animation frame
  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(draw);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [draw]);

  // ── Resize canvas to match container ─────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    const observer = new ResizeObserver(() => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    });
    observer.observe(container);
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    return () => observer.disconnect();
  }, []);

  // ── Mouse interaction ─────────────────────────────────────────
  const handleMouseDown = useCallback(
    (e) => {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      if (addingMarker) {
        const { wx, wy } = canvasToWorld(mx, my, panRef.current, zoomRef.current);
        const newM = {
          id: Date.now().toString(),
          wx,
          wy,
          label: newMarkerLabel,
          color: newMarkerColor,
        };
        const updated = [...customMarkers, newM];
        setCustomMarkers(updated);
        saveMap(zoomRef.current, panRef.current, updated);
        setAddingMarker(false);
        setTool('pan');
        return;
      }

      // Check city hit test
      const hitCity = cities.find((city) => {
        if (city.mapX == null || city.mapY == null) return false;
        const { cx, cy } = worldToCanvas(city.mapX, city.mapY, panRef.current, zoomRef.current);
        const dist = Math.hypot(mx - cx, my - cy);
        return dist <= CITY_MARKER_RADIUS + 3;
      });

      if (hitCity) {
        setSelectedCity(hitCity);
        draggingCityRef.current = hitCity;
        draggedCityHasMovedRef.current = false;
        lastMouseRef.current = { x: mx, y: my };
        dragStartMouseRef.current = { x: mx, y: my };
        return;
      }

      // Check custom marker hit
      const hitMarker = customMarkers.find((m) => {
        const { cx, cy } = worldToCanvas(m.wx, m.wy, panRef.current, zoomRef.current);
        return Math.hypot(mx - cx, my - cy) <= 10;
      });

      if (hitMarker) {
        setSelectedCity(null);
        return;
      }

      // Start pan
      setSelectedCity(null);
      isPanningRef.current = true;
      lastMouseRef.current = { x: mx, y: my };
    },
    [tool, addingMarker, cities, customMarkers, newMarkerLabel, newMarkerColor, saveMap]
  );

  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    // Hover logic for tooltips
    if (!isPanningRef.current && !draggingCityRef.current) {
      let hit = null;
      // 1. Check custom markers
      for (const m of customMarkers) {
        const { cx, cy } = worldToCanvas(m.wx, m.wy, panRef.current, zoomRef.current);
        if (Math.hypot(mx - cx, my - cy) <= 10) {
          hit = { type: 'marker', data: m, x: e.clientX, y: e.clientY };
          break;
        }
      }
      // 2. Check cities
      if (!hit) {
        for (const city of cities) {
          if (city.mapX == null || city.mapY == null) continue;
          const { cx, cy } = worldToCanvas(city.mapX, city.mapY, panRef.current, zoomRef.current);
          if (Math.hypot(mx - cx, my - cy) <= CITY_MARKER_RADIUS + 3) {
            const lore = getCityLore(city.location?.name);
            hit = { type: 'city', data: city, lore, x: e.clientX, y: e.clientY };
            break;
          }
        }
      }
      setHoveredEntity(hit);
      return; // Do nothing else if not panning/dragging
    }

    if (draggingCityRef.current) {
      const startDx = mx - dragStartMouseRef.current.x;
      const startDy = my - dragStartMouseRef.current.y;
      
      if (Math.abs(startDx) > 5 || Math.abs(startDy) > 5) {
        draggedCityHasMovedRef.current = true;
      }
      
      const dx = mx - lastMouseRef.current.x;
      const dy = my - lastMouseRef.current.y;
      
      if (draggedCityHasMovedRef.current) {
        const { wx: lastWx, wy: lastWy } = canvasToWorld(lastMouseRef.current.x, lastMouseRef.current.y, panRef.current, zoomRef.current);
        const { wx, wy } = canvasToWorld(mx, my, panRef.current, zoomRef.current);
        const dwx = wx - lastWx;
        const dwy = wy - lastWy;

        const cityId = draggingCityRef.current.id;
        setCities(prev => prev.map(c => c.id === cityId ? { ...c, mapX: (c.mapX || 0) + dwx, mapY: (c.mapY || 0) + dwy } : c));
      }
      
      lastMouseRef.current = { x: mx, y: my };
      return;
    }

    const dx = mx - lastMouseRef.current.x;
    const dy = my - lastMouseRef.current.y;

    lastMouseRef.current = { x: mx, y: my };
    panRef.current = {
      x: panRef.current.x + dx,
      y: panRef.current.y + dy,
    };
    setPan({ ...panRef.current });
  }, []);

  const handleMouseUp = useCallback(async () => {
    if (isPanningRef.current) {
      isPanningRef.current = false;
      saveMap(zoomRef.current, panRef.current, customMarkers);
    }
    if (draggingCityRef.current) {
      const city = cities.find(c => c.id === draggingCityRef.current.id);
      if (!draggedCityHasMovedRef.current && city) {
        // Was a click
        const locId = city.location?.id || city.locationId;
        navigate(`/gm/campaigns/${campaignId}/locations/${locId}/map`);
      } else if (city) {
        // Was a drag
        try {
          await api.patch(`/api/v1/gm/campaigns/${campaignId}/cities/${city.id}/map-position`, {
            mapX: city.mapX,
            mapY: city.mapY
          });
        } catch (err) {
          console.error("Failed to save city position", err);
        }
      }
      draggingCityRef.current = null;
    }
  }, [cities, customMarkers, saveMap, campaignId, navigate]);

  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const oldZoom = zoomRef.current;
      const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
      const newZoom = clamp(oldZoom + delta, MIN_ZOOM, MAX_ZOOM);

      // Zoom towards mouse position
      const scaleFactor = newZoom / oldZoom;
      panRef.current = {
        x: mx - (mx - panRef.current.x) * scaleFactor,
        y: my - (my - panRef.current.y) * scaleFactor,
      };
      zoomRef.current = newZoom;
      setZoom(newZoom);
      setPan({ ...panRef.current });
      saveMap(newZoom, panRef.current, customMarkers);
    },
    [customMarkers, saveMap]
  );

  // Attach wheel event (need passive: false to prevent page scroll)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // ── Zoom controls ─────────────────────────────────────────────
  function zoomIn() {
    const canvas = canvasRef.current;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const oldZoom = zoomRef.current;
    const newZoom = clamp(oldZoom + ZOOM_STEP, MIN_ZOOM, MAX_ZOOM);
    const s = newZoom / oldZoom;
    panRef.current = { x: cx - (cx - panRef.current.x) * s, y: cy - (cy - panRef.current.y) * s };
    zoomRef.current = newZoom;
    setZoom(newZoom);
    setPan({ ...panRef.current });
    saveMap(newZoom, panRef.current, customMarkers);
  }

  function zoomOut() {
    const canvas = canvasRef.current;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const oldZoom = zoomRef.current;
    const newZoom = clamp(oldZoom - ZOOM_STEP, MIN_ZOOM, MAX_ZOOM);
    const s = newZoom / oldZoom;
    panRef.current = { x: cx - (cx - panRef.current.x) * s, y: cy - (cy - panRef.current.y) * s };
    zoomRef.current = newZoom;
    setZoom(newZoom);
    setPan({ ...panRef.current });
    saveMap(newZoom, panRef.current, customMarkers);
  }

  function resetView() {
    panRef.current = { x: 0, y: 0 };
    zoomRef.current = 1;
    setZoom(1);
    setPan({ x: 0, y: 0 });
    saveMap(1, { x: 0, y: 0 }, customMarkers);
  }

  function fitMapToCanvas() {
    if (!bgImageRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    
    // Ensure canvas dimensions are up-to-date with its parent
    const container = canvas.parentElement;
    if (container && container.clientWidth > 0) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }

    if (canvas.width === 0 || canvas.height === 0) return;

    const imgW = bgImageRef.current.naturalWidth;
    const imgH = bgImageRef.current.naturalHeight;
    const scaleX = canvas.width / imgW;
    const scaleY = canvas.height / imgH;
    const newZoom = clamp(Math.min(scaleX, scaleY) * 0.95, MIN_ZOOM, MAX_ZOOM); // 0.95 to add a small padding
    const newPan = {
      x: (canvas.width - imgW * newZoom) / 2,
      y: (canvas.height - imgH * newZoom) / 2,
    };
    panRef.current = newPan;
    zoomRef.current = newZoom;
    setZoom(newZoom);
    setPan(newPan);
    saveMap(newZoom, newPan, customMarkers);
  }

  useEffect(() => {
    fitMapToCanvasRef.current = fitMapToCanvas;
  }, [customMarkers, saveMap]);

  function deleteCustomMarker(id) {
    const updated = customMarkers.filter((m) => m.id !== id);
    setCustomMarkers(updated);
    saveMap(zoomRef.current, panRef.current, updated);
  }

  // ── Cursor style ──────────────────────────────────────────────
  const cursor = addingMarker ? 'crosshair' : isPanningRef.current ? 'grabbing' : 'grab';

  // ── Stat bar colors ───────────────────────────────────────────
  const paramColors = {
    health: '#10b981',
    wealth: '#f59e0b',
    technology: '#3b82f6',
    food: '#84cc16',
    happiness: '#ec4899',
    armament: '#ef4444',
    fuel: '#8b5cf6',
  };

  // ── Render ────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-muted)' }}>
        <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite', marginRight: 12 }} />
        Loading world map…
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 12 }}>
        <p style={{ color: 'var(--danger)' }}>Error: {error}</p>
        <button className="btn-primary" onClick={fetchMap}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', position: 'absolute', inset: 0, overflow: 'hidden', background: '#111827' }}>
      {/* ── Canvas Area ─────────────────────────────── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <canvas
          ref={canvasRef}
          style={{ display: 'block', cursor, touchAction: 'none' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />

        {/* No map image message */}
        {!worldMap?.baseMapImageUrl && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <MapIcon size={64} style={{ opacity: 0.15, marginBottom: 16 }} />
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, marginBottom: 8 }}>No base map image uploaded yet.</p>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>Use the toolbar to upload one.</p>
          </div>
        )}

        {/* ── Toolbar (top-left) ──────────────────────── */}
        <div
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          {/* Map title */}
          <div
            style={{
              background: 'rgba(17,24,39,0.9)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10,
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backdropFilter: 'blur(8px)',
            }}
          >
            <MapIcon size={16} color="#6366f1" />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>World Map</span>
            {isSaving && (
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginLeft: 4 }}>
                <Save size={10} style={{ display: 'inline', marginRight: 2 }} />saving…
              </span>
            )}
          </div>

          {/* Tool buttons */}
          <div
            style={{
              background: 'rgba(17,24,39,0.9)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10,
              padding: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              backdropFilter: 'blur(8px)',
            }}
          >
            <ToolButton
              icon={<ZoomIn size={16} />}
              title="Zoom In"
              onClick={zoomIn}
            />
            <ToolButton
              icon={<ZoomOut size={16} />}
              title="Zoom Out"
              onClick={zoomOut}
            />
            <ToolButton
              icon={<Maximize2 size={16} />}
              title="Fit to Canvas"
              onClick={fitMapToCanvas}
              disabled={!bgImageRef.current}
            />
            <ToolButton
              icon={<Crosshair size={16} />}
              title="Reset View"
              onClick={resetView}
            />
            <div style={{ height: 1, background: 'var(--overlay-soft)', margin: '2px 0' }} />
            <ToolButton
              icon={<Eye size={16} />}
              title={showTerritories ? 'Hide Territories' : 'Show Territories'}
              onClick={() => setShowTerritories((v) => !v)}
              active={showTerritories}
            />
            <ToolButton
              icon={<Layers size={16} />}
              title={showLabels ? 'Hide Labels' : 'Show Labels'}
              onClick={() => setShowLabels((v) => !v)}
              active={showLabels}
            />
            <div style={{ height: 1, background: 'var(--overlay-soft)', margin: '2px 0' }} />
            <ToolButton
              icon={<Upload size={16} />}
              title="Upload Base Map"
              onClick={() => fileInputRef.current?.click()}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
          </div>

          {/* Marker tool */}
          <div
            style={{
              background: 'rgba(17,24,39,0.9)',
              border: `1px solid ${addingMarker ? '#f59e0b' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 10,
              padding: 8,
              backdropFilter: 'blur(8px)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <input
                type="text"
                placeholder="Marker label…"
                value={newMarkerLabel}
                onChange={(e) => setNewMarkerLabel(e.target.value)}
                style={{
                  fontSize: 11,
                  padding: '4px 8px',
                  background: 'var(--overlay-subtle)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 6,
                  color: 'white',
                  width: 130,
                }}
              />
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <input
                  type="color"
                  value={newMarkerColor}
                  onChange={(e) => setNewMarkerColor(e.target.value)}
                  style={{ width: 28, height: 28, border: 'none', background: 'none', cursor: 'pointer', borderRadius: 4 }}
                />
                <button
                  onClick={() => setAddingMarker((v) => !v)}
                  title="Click on map to place marker"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                    background: addingMarker ? '#f59e0b' : 'rgba(255,255,255,0.1)',
                    color: addingMarker ? '#111' : 'white',
                    border: 'none',
                    borderRadius: 6,
                    padding: '5px 8px',
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Pin size={12} />
                  {addingMarker ? 'Click map' : 'Add Pin'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Zoom indicator (bottom-left) */}
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            background: 'rgba(17,24,39,0.8)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            padding: '4px 10px',
            fontSize: 11,
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          {Math.round(zoom * 100)}%
        </div>

        {/* City count (bottom-center) */}
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(17,24,39,0.8)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            padding: '4px 12px',
            fontSize: 11,
            color: 'rgba(255,255,255,0.4)',
          }}
        >
          {cities.filter((c) => c.mapX != null).length} / {cities.length} cities placed •{' '}
          {customMarkers.length} custom pins
        </div>

        {/* Sidebar toggle (right) */}
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          style={{
            position: 'absolute',
            top: '50%',
            right: sidebarOpen ? 320 : 0,
            transform: 'translateY(-50%)',
            background: 'rgba(17,24,39,0.9)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px 0 0 8px',
            padding: '10px 6px',
            color: 'white',
            cursor: 'pointer',
            transition: 'right 0.3s ease',
            zIndex: 10,
          }}
        >
          {sidebarOpen ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* ── Right Sidebar ───────────────────────────── */}
      <div
        style={{
          width: sidebarOpen ? 320 : 0,
          overflow: 'hidden',
          transition: 'width 0.3s ease',
          background: 'rgba(17,24,39,0.95)',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ width: 320, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {selectedCity ? (
            // ── City Detail Panel ───────────────────
            <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: selectedCity.factionColor || '#6366f1',
                      boxShadow: `0 0 8px ${selectedCity.factionColor || '#6366f1'}`,
                      flexShrink: 0,
                    }}
                  />
                  <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'white' }}>
                    {selectedCity.location?.name || 'Unknown City'}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedCity(null)}
                  style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 4 }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* City details */}
              {selectedCity.specialty && (
                <div style={{ marginBottom: 12, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                  <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Specialty:</strong> {selectedCity.specialty}
                </div>
              )}
              {selectedCity.strength && (
                <div style={{ marginBottom: 8, fontSize: 12 }}>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>⬆ {selectedCity.strength}</span>
                </div>
              )}
              {selectedCity.weakness && (
                <div style={{ marginBottom: 8, fontSize: 12 }}>
                  <span style={{ color: '#ef4444', fontWeight: 600 }}>⬇ {selectedCity.weakness}</span>
                </div>
              )}
              {selectedCity.peculiarity && (
                <div style={{ marginBottom: 16, fontSize: 12, fontStyle: 'italic', color: 'rgba(255,255,255,0.5)' }}>
                  ✦ {selectedCity.peculiarity}
                </div>
              )}

              {/* Parameters */}
              <div
                style={{
                  background: 'var(--overlay-subtle)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 10,
                  padding: 14,
                  marginBottom: 16,
                }}
              >
                <h3 style={{ margin: '0 0 12px', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)' }}>
                  City Parameters
                </h3>
                {['health', 'wealth', 'technology', 'food', 'happiness', 'armament', 'fuel'].map((param) => (
                  <ParamBar
                    key={param}
                    label={param.charAt(0).toUpperCase() + param.slice(1)}
                    value={selectedCity[param] ?? 50}
                    color={paramColors[param]}
                  />
                ))}

                {/* Custom parameters */}
                {selectedCity.customParameters && (() => {
                  try {
                    const custom = JSON.parse(selectedCity.customParameters);
                    return custom.map((cp) => (
                      <ParamBar key={cp.name} label={cp.name} value={cp.value} color="#a78bfa" />
                    ));
                  } catch {
                    return null;
                  }
                })()}
              </div>

              {/* Map coordinates & GPS */}
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 12, backgroundColor: 'var(--overlay-subtle)', padding: '8px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ color: '#38bdf8', fontWeight: 'bold', marginBottom: '2px' }}>
                  📍 Position GPS : {(() => {
                    const name = selectedCity.name || selectedCity.location?.name || '';
                    const match = Object.entries({
                      "BUNKER OMÉGA": "46.2044° N, 6.1432° E (Genève)",
                      "CITÉ INDUSTRIELLE": "45.0703° N, 7.6869° E (Turin)",
                      "CITÉ MÉDICALE": "31.2001° N, 29.9187° E (Alexandrie)",
                      "CITÉ DE L'ARMEMENT & DÉFENSE": "36.1408° N, 5.3536° O (Gibraltar)",
                      "CITÉ DE L'EAU & ALIMENTATION": "43.5000° N, 4.6000° E (Camargue/Rhône)",
                      "CITÉ DES MÉTAUX & RECYCLAGE": "37.9838° N, 23.7275° E (Athènes)",
                      "CITÉ DU CARBURANT": "36.7538° N, 3.0588° E (Alger)",
                      "CITÉ DU DIVERTISSEMENT": "41.9028° N, 12.4964° E (Rome)",
                      "L'ILE DES ANCIENS": "36.0000° N, 8.5000° O (Atlantique Ouest)",
                      "NUKE CITY": "43.2965° N, 5.3698° E (Marseille)"
                    }).find(([k]) => name.toUpperCase().includes(k));
                    return match ? match[1] : 'GPS non renseigné';
                  })()}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>
                  Canvas Coords: ({Math.round(selectedCity.mapX)}, {Math.round(selectedCity.mapY)})
                </div>
              </div>

              <button
                className="btn-primary"
                style={{ width: '100%', padding: '10px', marginTop: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                onClick={() => navigate(`/gm/campaigns/${campaignId}/locations/${selectedCity.locationId}/map`)}
              >
                <MapIcon size={16} /> Voir la carte de la ville
              </button>
            </div>
          ) : (
            // ── City List Panel ─────────────────────
            <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
              <h2 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapIcon size={16} color="#6366f1" /> Cities
              </h2>

              {cities.length === 0 ? (
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 40 }}>
                  No cities found for this campaign.
                  <br />
                  <span style={{ fontSize: 11 }}>Create cities in the Locations & Cities panel.</span>
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {cities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => {
                        setSelectedCity(city);
                        if (city.mapX != null) {
                          // Pan to city
                          const canvas = canvasRef.current;
                          const cx = canvas.width / 2;
                          const cy = canvas.height / 2;
                          panRef.current = {
                            x: cx - city.mapX * zoomRef.current,
                            y: cy - city.mapY * zoomRef.current,
                          };
                          setPan({ ...panRef.current });
                        }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        background: 'var(--overlay-subtle)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: 8,
                        padding: '10px 12px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        color: 'white',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                    >
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          background: city.factionColor || '#6366f1',
                          flexShrink: 0,
                          boxShadow: `0 0 6px ${city.factionColor || '#6366f1'}`,
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{city.location?.name || 'Unnamed'}</div>
                        {city.specialty && (
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>{city.specialty}</div>
                        )}
                      </div>
                      {city.mapX == null ? (
                        <span style={{ fontSize: 10, color: '#f59e0b', background: 'var(--warning-tint)', borderRadius: 4, padding: '2px 5px' }}>
                          Unplaced
                        </span>
                      ) : (
                        <span style={{ fontSize: 10, color: '#10b981', background: 'var(--success-tint)', borderRadius: 4, padding: '2px 5px' }}>
                          Placed
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Custom markers list */}
              {customMarkers.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <h3 style={{ margin: '0 0 10px', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)' }}>
                    Custom Pins
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {customMarkers.map((m) => (
                      <div
                        key={m.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          background: 'var(--overlay-subtle)',
                          border: '1px solid rgba(255,255,255,0.07)',
                          borderRadius: 8,
                          padding: '8px 10px',
                        }}
                      >
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: m.color,
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ flex: 1, fontSize: 12, color: 'white' }}>{m.label || 'Pin'}</span>
                        <button
                          onClick={() => deleteCustomMarker(m.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'rgba(255,255,255,0.3)',
                            cursor: 'pointer',
                            padding: 2,
                            display: 'flex',
                          }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
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
          {hoveredEntity.type === 'city' && hoveredEntity.lore ? (
            <>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: hoveredEntity.data.factionColor || '#6366f1' }}>
                {hoveredEntity.lore.name}
              </h4>
              <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <li><strong>Spécialité :</strong> {hoveredEntity.lore.specialty}</li>
                <li><strong>Force :</strong> {hoveredEntity.lore.strength}</li>
                <li><strong>Faiblesse :</strong> {hoveredEntity.lore.weakness}</li>
                <li><strong>Particularité :</strong> {hoveredEntity.lore.particularity}</li>
              </ul>
            </>
          ) : hoveredEntity.type === 'city' ? (
            <h4 style={{ margin: 0, fontSize: '1rem' }}>{hoveredEntity.data.location?.name}</h4>
          ) : (
            <h4 style={{ margin: 0, fontSize: '1rem' }}>{hoveredEntity.data.label || 'Unnamed Marker'}</h4>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Toolbar Button ───────────────────────────────────────────
function ToolButton({ icon, title, onClick, active, disabled }) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        background: active ? 'rgba(99,102,241,0.3)' : 'transparent',
        border: active ? '1px solid rgba(99,102,241,0.5)' : '1px solid transparent',
        borderRadius: 6,
        color: disabled ? 'rgba(255,255,255,0.2)' : active ? '#a5b4fc' : 'rgba(255,255,255,0.7)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s',
        padding: 0,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !active) e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
      }}
      onMouseLeave={(e) => {
        if (!disabled && !active) e.currentTarget.style.background = 'transparent';
      }}
    >
      {icon}
    </button>
  );
}
