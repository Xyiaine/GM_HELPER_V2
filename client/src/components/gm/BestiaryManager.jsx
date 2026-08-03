import React, { useEffect, useState } from 'react';
import { useGmStore } from '../../store/gmStore';
import {
  Skull,
  Plus,
  Search,
  Star,
  Shield,
  Heart,
  Zap,
  Edit2,
  Trash2,
  X,
  Check,
  Swords,
  Filter,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'humanoid', label: 'Humanoïde' },
  { id: 'beast', label: 'Bête' },
  { id: 'undead', label: 'Mort-vivant' },
  { id: 'construct', label: 'Construct' },
  { id: 'aberration', label: 'Aberration' },
  { id: 'other', label: 'Autre' },
];

export default function BestiaryManager() {
  const {
    activeCampaignId,
    bestiary,
    fetchBestiary,
    createBestiaryEntry,
    updateBestiaryEntry,
    deleteBestiaryEntry,
  } = useGmStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [favoriteOnly, setFavoriteOnly] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'humanoid',
    challengeRating: 1,
    armorClass: 12,
    hpMax: 15,
    hpFormula: '',
    speed: '9m',
    stats: JSON.stringify({ str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 }),
    attacks: JSON.stringify([{ name: 'Attaque de mêlée', bonus: 4, damage: '1d6+2', range: '1.5m' }]),
    traits: '',
    savingThrows: '',
    description: '',
    isFavorite: false,
  });

  useEffect(() => {
    if (activeCampaignId) {
      fetchBestiary(activeCampaignId, {
        category: selectedCategory,
        favoriteOnly: favoriteOnly ? 'true' : undefined,
        search,
      });
    }
  }, [activeCampaignId, selectedCategory, favoriteOnly, search, fetchBestiary]);

  const handleOpenModal = (entry = null) => {
    setErrorMessage(null);
    if (entry) {
      setEditingEntry(entry);
      setFormData({
        name: entry.name || '',
        category: entry.category || 'humanoid',
        challengeRating: entry.challengeRating ?? 1,
        armorClass: entry.armorClass ?? 10,
        hpMax: entry.hpMax ?? 10,
        hpFormula: entry.hpFormula || '',
        speed: entry.speed || '9m',
        stats: entry.stats || JSON.stringify({ str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 }),
        attacks: entry.attacks || '',
        traits: entry.traits || '',
        savingThrows: entry.savingThrows || '',
        description: entry.description || '',
        isFavorite: entry.isFavorite || false,
      });
    } else {
      setEditingEntry(null);
      setFormData({
        name: '',
        category: 'humanoid',
        challengeRating: 1,
        armorClass: 12,
        hpMax: 15,
        hpFormula: '',
        speed: '9m',
        stats: JSON.stringify({ str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 }),
        attacks: JSON.stringify([{ name: 'Attaque de mêlée', bonus: 4, damage: '1d6+2', range: '1.5m' }]),
        traits: '',
        savingThrows: '',
        description: '',
        isFavorite: false,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      const payload = {
        ...formData,
        challengeRating: formData.challengeRating ? parseFloat(formData.challengeRating) : null,
        armorClass: parseInt(formData.armorClass, 10) || 10,
        hpMax: parseInt(formData.hpMax, 10) || 1,
      };

      if (editingEntry) {
        await updateBestiaryEntry(activeCampaignId, editingEntry.id, payload);
      } else {
        await createBestiaryEntry(activeCampaignId, payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      setErrorMessage(err.response?.data?.error || err.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet élément du bestiaire ?')) return;
    try {
      await deleteBestiaryEntry(activeCampaignId, id);
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors de la suppression');
    }
  };

  const handleToggleFavorite = async (entry) => {
    try {
      await updateBestiaryEntry(activeCampaignId, entry.id, { isFavorite: !entry.isFavorite });
    } catch (err) {
      console.error(err);
    }
  };

  const parseJsonStats = (jsonStr) => {
    try {
      return JSON.parse(jsonStr || '{}');
    } catch (e) {
      return {};
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <header
        style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ color: 'var(--color-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Skull size={28} /> Bestiaire D&D 5e
          </h1>
          <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>
            Bibliothèque de stat blocks de créatures et PNJ réutilisables en combat.
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => handleOpenModal()}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> Nouveau Monstre
        </button>
      </header>

      {/* Filter Bar */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid var(--color-border)',
          marginBottom: '24px',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* Search */}
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <Search size={18} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
          <input
            type="text"
            placeholder="Rechercher une créature..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 38px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-background)',
              color: 'var(--color-text)',
            }}
          />
        </div>

        {/* Category dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="var(--color-text-muted)" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-background)',
              color: 'var(--color-text)',
            }}
          >
            <option value="">Toutes les catégories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Favorite toggle */}
        <button
          onClick={() => setFavoriteOnly(!favoriteOnly)}
          style={{
            padding: '8px 14px',
            borderRadius: '6px',
            border: favoriteOnly ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
            backgroundColor: favoriteOnly ? 'rgba(var(--color-primary-rgb, 120, 80, 255), 0.2)' : 'var(--color-background)',
            color: favoriteOnly ? 'var(--color-primary)' : 'var(--color-text)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Star size={16} fill={favoriteOnly ? 'currentColor' : 'none'} />
          Favoris uniquement
        </button>
      </div>

      {/* Grid of Creatures */}
      {bestiary.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '48px',
            backgroundColor: 'var(--color-surface)',
            borderRadius: '8px',
            border: '1px dashed var(--color-border)',
          }}
        >
          <Skull size={48} color="var(--color-text-muted)" style={{ opacity: 0.4, marginBottom: '12px' }} />
          <h3 style={{ margin: 0, color: 'var(--color-text-muted)' }}>Aucun monstre trouvé</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Créez votre premier stat block pour alimenter vos combats de campagne.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px',
          }}
        >
          {bestiary.map((entry) => {
            const stats = parseJsonStats(entry.stats);
            const attacks = parseJsonStats(entry.attacks);
            const categoryLabel = CATEGORIES.find((c) => c.id === entry.category)?.label || entry.category;

            return (
              <div
                key={entry.id}
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  position: 'relative',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
              >
                {/* Top Row: Name & Favorite */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.1rem' }}>{entry.name}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      {categoryLabel} • FP {entry.challengeRating ?? 'N/A'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggleFavorite(entry)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: entry.isFavorite ? '#f59e0b' : 'var(--color-text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    <Star size={18} fill={entry.isFavorite ? 'currentColor' : 'none'} />
                  </button>
                </div>

                {/* Stats Badges */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(59, 130, 246, 0.15)',
                      color: '#60a5fa',
                      fontSize: '0.85rem',
                    }}
                  >
                    <Shield size={14} /> CA {entry.armorClass}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      color: '#f87171',
                      fontSize: '0.85rem',
                    }}
                  >
                    <Heart size={14} /> {entry.hpMax} PV {entry.hpFormula ? `(${entry.hpFormula})` : ''}
                  </div>

                  {entry.speed && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        color: '#34d399',
                        fontSize: '0.85rem',
                      }}
                    >
                      <Zap size={14} /> {entry.speed}
                    </div>
                  )}
                </div>

                {/* Characteristics Row */}
                {stats && Object.keys(stats).length > 0 && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(6, 1fr)',
                      gap: '4px',
                      backgroundColor: 'var(--color-background)',
                      padding: '6px',
                      borderRadius: '4px',
                      textAlign: 'center',
                      fontSize: '0.75rem',
                    }}
                  >
                    <div>FOR {stats.str || 10}</div>
                    <div>DEX {stats.dex || 10}</div>
                    <div>CON {stats.con || 10}</div>
                    <div>INT {stats.int || 10}</div>
                    <div>SAG {stats.wis || 10}</div>
                    <div>CHA {stats.cha || 10}</div>
                  </div>
                )}

                {/* Description / Attacks Snippet */}
                {entry.description && (
                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--color-text-muted)',
                      margin: 0,
                      maxHeight: '40px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {entry.description}
                  </p>
                )}

                {/* Actions Row */}
                <div
                  style={{
                    display: 'flex',
                    justify: 'flex-end',
                    gap: '8px',
                    marginTop: 'auto',
                    borderTop: '1px solid var(--color-border)',
                    paddingTop: '8px',
                  }}
                >
                  <button
                    onClick={() => handleOpenModal(entry)}
                    style={{
                      padding: '4px 8px',
                      background: 'none',
                      border: '1px solid var(--color-border)',
                      borderRadius: '4px',
                      color: 'var(--color-text)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.8rem',
                    }}
                  >
                    <Edit2 size={14} /> Éditer
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    style={{
                      padding: '4px 8px',
                      background: 'none',
                      border: '1px solid #ef4444',
                      borderRadius: '4px',
                      color: '#ef4444',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.8rem',
                    }}
                  >
                    <Trash2 size={14} /> Supprimer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              width: '100%',
              maxWidth: '650px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, color: 'var(--color-primary)' }}>
                {editingEntry ? 'Éditer la Créature' : 'Nouveau Monstre au Bestiaire'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {errorMessage && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#f87171', padding: '10px', borderRadius: '6px', marginBottom: '16px' }}>
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>Nom de la créature *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>Catégorie</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Combat Core Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>CA (Armure)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.armorClass}
                    onChange={(e) => setFormData({ ...formData, armorClass: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>PV Max</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.hpMax}
                    onChange={(e) => setFormData({ ...formData, hpMax: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>Formule PV</label>
                  <input
                    type="text"
                    placeholder="ex: 8d8+16"
                    value={formData.hpFormula}
                    onChange={(e) => setFormData({ ...formData, hpFormula: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>FP (CR)</label>
                  <input
                    type="number"
                    step="0.125"
                    min="0"
                    value={formData.challengeRating}
                    onChange={(e) => setFormData({ ...formData, challengeRating: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>Vitesse de déplacement</label>
                <input
                  type="text"
                  placeholder="ex: 9m, vol 18m"
                  value={formData.speed}
                  onChange={(e) => setFormData({ ...formData, speed: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }}
                />
              </div>

              {/* Characteristics JSON */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>Caractéristiques (JSON Format)</label>
                <input
                  type="text"
                  value={formData.stats}
                  onChange={(e) => setFormData({ ...formData, stats: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)', fontFamily: 'monospace', fontSize: '0.8rem' }}
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>Description & Capacités</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'none', color: 'var(--color-text)', cursor: 'pointer' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '8px 16px' }}
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
