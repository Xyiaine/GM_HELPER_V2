import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useGmStore } from '../../store/gmStore';
import api from '../../utils/api';
import Modal from '../ui/Modal';
import { Plus, Search, Building2, Shield, Star, Filter, ArrowUpDown, MapPin, X } from 'lucide-react';
import { notify } from '../../store/notificationStore';

const KNOWN_CITIES = [
  "Cité Médicale",
  "Cité du Carburant",
  "Cité Industrielle",
  "Cité de l'Eau & Alimentation",
  "Cité du Divertissement",
  "Nuke City",
  "Cité des Métaux & Recyclage",
  "Cité de l'Armement & Défense",
  "L'Ile des Anciens",
  "Bunker Oméga"
];

const CITY_FACTIONS_MAP = {
  "Cité Médicale": ["Les Blouses Blanches", "Personnel Médical", "Recherche Bio-Pharmaceutique"],
  "Cité du Carburant": ["Les Raffineurs", "Guildes des Pipelines", "Gardiens des Citernes"],
  "Cité Industrielle": ["Les Forgerons d'Acier", "Artisans Métallurgistes", "Ouvriers de la Fonderie"],
  "Cité de l'Eau & Alimentation": ["Les Gardiens de la Source", "Hydrologues", "Distributeurs de Rations"],
  "Cité du Divertissement": ["Les Faiseurs de Rêves", "Directeurs d'Arènes", "Synthetiseurs d'Euphorie"],
  "Nuke City": ["Le Réacteur à Ciel Ouvert", "Cultistes du Noyau", "Techniciens Rad-Protect"],
  "Cité des Métaux & Recyclage": ["Les Fossoyeurs", "Pilleurs de Décharges", "Trieurs d'Alliages"],
  "Cité de l'Armement & Défense": ["Les Arsenaux", "Mercenaires Blindés", "Ingénieurs de Siège"],
  "L'Ile des Anciens": ["Les Anciens", "Gardiens de la Mémoire", "Sages de l'Archipel"],
  "Bunker Oméga": ["Les Fantômes d'Acier", "Commandos Souterrains", "Opérateurs Oméga"]
};

export default function NpcsList() {
  const { campaignId } = useParams();
  const { npcs, fetchNpcs, createNpc, locations, fetchLocations } = useGmStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedFaction, setSelectedFaction] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState('name_asc'); // 'name_asc' | 'name_desc' | 'city_asc' | 'favorite_first'

  const [formData, setFormData] = useState({
    name: '',
    race: '',
    role: '',
    description: '',
    locationId: '',
    personality: ''
  });

  useEffect(() => {
    if (campaignId) {
      fetchNpcs(campaignId);
      if (!locations || locations.length === 0) {
        fetchLocations(campaignId);
      }
    }
  }, [campaignId, fetchNpcs, fetchLocations]);

  // Helper to determine the City of an NPC
  const getCityName = (npc) => {
    if (!npc.location) return 'Sans ville';
    if (npc.location.type === 'city') return npc.location.name;
    if (npc.location.parentLocation?.name) return npc.location.parentLocation.name;
    return npc.location.name;
  };

  // Helper to determine Faction of an NPC
  const getFactionName = (npc) => {
    if (!npc) return 'Générique';
    const text = `${npc.role || ''} ${npc.description || ''} ${npc.personality || ''}`;

    // 1. Check direct faction match in text
    for (const factionList of Object.values(CITY_FACTIONS_MAP)) {
      for (const fName of factionList) {
        if (text.toLowerCase().includes(fName.toLowerCase())) {
          return fName;
        }
      }
    }

    // 2. Fallback to city dominant faction
    const city = getCityName(npc);
    for (const [cName, fList] of Object.entries(CITY_FACTIONS_MAP)) {
      if (city.toLowerCase().includes(cName.toLowerCase())) {
        return fList[0];
      }
    }

    return 'Survivants Indépendants';
  };

  // Dynamically compute unique cities from NPCs and known cities
  const availableCities = useMemo(() => {
    const set = new Set(KNOWN_CITIES);
    npcs.forEach(n => {
      const city = getCityName(n);
      if (city && city !== 'Sans ville') set.add(city);
    });
    return Array.from(set).sort();
  }, [npcs]);

  // Dynamically compute available factions based on selected city or all NPCs
  const availableFactions = useMemo(() => {
    if (selectedCity && CITY_FACTIONS_MAP[selectedCity]) {
      return CITY_FACTIONS_MAP[selectedCity];
    }
    const set = new Set();
    Object.values(CITY_FACTIONS_MAP).forEach(list => list.forEach(f => set.add(f)));
    npcs.forEach(n => {
      const f = getFactionName(n);
      if (f) set.add(f);
    });
    return Array.from(set).sort();
  }, [selectedCity, npcs]);

  // Filter & Sort logic
  const filteredNpcs = useMemo(() => {
    return npcs.filter(npc => {
      // 1. Search Query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = npc.name?.toLowerCase().includes(q);
        const matchRole = npc.role?.toLowerCase().includes(q);
        const matchRace = npc.race?.toLowerCase().includes(q);
        const matchDesc = npc.description?.toLowerCase().includes(q);
        if (!matchName && !matchRole && !matchRace && !matchDesc) return false;
      }

      // 2. City Filter
      if (selectedCity) {
        const city = getCityName(npc);
        if (!city.toLowerCase().includes(selectedCity.toLowerCase())) return false;
      }

      // 3. Faction Filter
      if (selectedFaction) {
        const faction = getFactionName(npc);
        const text = `${npc.role || ''} ${npc.description || ''} ${npc.personality || ''}`;
        const matchFaction = faction.toLowerCase().includes(selectedFaction.toLowerCase()) || text.toLowerCase().includes(selectedFaction.toLowerCase());
        if (!matchFaction) return false;
      }

      // 4. Favorites Only
      if (onlyFavorites && !npc.isFavorite) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
      if (sortBy === 'city_asc') return getCityName(a).localeCompare(getCityName(b));
      if (sortBy === 'favorite_first') return (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0);
      return 0;
    });
  }, [npcs, searchQuery, selectedCity, selectedFaction, onlyFavorites, sortBy]);

  const toggleFavorite = async (npcId, e) => {
    e.stopPropagation();
    try {
      await api.patch(`/api/v1/gm/campaigns/${campaignId}/npcs/${npcId}/favorite`);
      fetchNpcs(campaignId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;
    try {
      await createNpc(campaignId, formData);
      setIsModalOpen(false);
      setFormData({ name: '', race: '', role: '', description: '', locationId: '', personality: '' });
      fetchNpcs(campaignId);
      notify.success('PNJ créé.');
    } catch (err) {
      notify.error('Erreur lors de la création du PNJ');
    }
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: 'var(--color-primary)', margin: 0, fontSize: '1.8rem' }}>👥 Base de Données PNJ</h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '0.9rem' }}>
            Gestion des Personnages Non-Joueurs, filtres par Cités-États et Factions.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={18} /> Créer un PNJ
        </button>
      </header>

      {/* Filter Control Bar */}
      <div style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search Input */}
          <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
            <Search size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Rechercher PNJ par nom, rôle ou description..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-text)',
                fontSize: '0.85rem'
              }}
            />
          </div>

          {/* Filter by City */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Building2 size={16} color="#38bdf8" />
            <select
              value={selectedCity}
              onChange={e => {
                setSelectedCity(e.target.value);
                setSelectedFaction(''); // Reset faction filter when city changes
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-text)',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <option value="">🏙️ Toutes les Villes ({availableCities.length})</option>
              {availableCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Filter by Faction */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Shield size={16} color="#a78bfa" />
            <select
              value={selectedFaction}
              onChange={e => setSelectedFaction(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-text)',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <option value="">🛡️ Toutes les Factions ({availableFactions.length})</option>
              {availableFactions.map(faction => (
                <option key={faction} value={faction}>{faction}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowUpDown size={16} color="var(--color-primary-light)" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-text)',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <option value="name_asc">🔤 Nom (A → Z)</option>
              <option value="name_desc">🔤 Nom (Z → A)</option>
              <option value="city_asc">🏙️ Par Ville (A → Z)</option>
              <option value="favorite_first">★ Favoris en premier</option>
            </select>
          </div>

          {/* Favorites Only Toggle */}
          <button
            type="button"
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            style={{
              padding: '8px 12px',
              fontSize: '0.85rem',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              backgroundColor: onlyFavorites ? 'rgba(245, 158, 11, 0.2)' : 'var(--color-background)',
              color: onlyFavorites ? '#f59e0b' : 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Star size={15} fill={onlyFavorites ? '#f59e0b' : 'none'} color="#f59e0b" />
            Favoris
          </button>

          {/* Reset Filters */}
          {(searchQuery || selectedCity || selectedFaction || onlyFavorites) && (
            <button
              className="btn-secondary"
              onClick={() => {
                setSearchQuery('');
                setSelectedCity('');
                setSelectedFaction('');
                setOnlyFavorites(false);
              }}
              style={{ padding: '8px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <X size={14} /> Effacer filtres
            </button>
          )}
        </div>

        {/* Counter Summary */}
        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
          <span>
            Affichage de <strong>{filteredNpcs.length}</strong> / <strong>{npcs.length}</strong> PNJ
            {selectedCity && <span> • Ville: <strong style={{ color: '#38bdf8' }}>{selectedCity}</strong></span>}
            {selectedFaction && <span> • Faction: <strong style={{ color: '#a78bfa' }}>{selectedFaction}</strong></span>}
          </span>
        </div>
      </div>
      
      {/* NPC Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {filteredNpcs.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Aucun PNJ ne correspond aux filtres sélectionnés.
          </div>
        ) : (
          filteredNpcs.map(npc => {
            const city = getCityName(npc);
            const faction = getFactionName(npc);
            return (
              <div key={npc.id} style={{ 
                backgroundColor: 'var(--color-surface)', 
                padding: '16px', 
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ margin: '0 0 2px 0', color: 'var(--color-text)', fontSize: '1.05rem' }}>{npc.name}</h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      {npc.race || 'Humain'} {npc.role && `• ${npc.role}`}
                    </p>
                  </div>
                  <button
                    onClick={(e) => toggleFavorite(npc.id, e)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px' }}
                    title={npc.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  >
                    <Star size={18} fill={npc.isFavorite ? '#f59e0b' : 'none'} color={npc.isFavorite ? '#f59e0b' : '#6b7280'} />
                  </button>
                </div>

                {/* City & Faction Badges */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: 'var(--info-tint)',
                    color: '#38bdf8',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Building2 size={12} /> {city}
                  </span>

                  <span style={{
                    fontSize: '0.75rem',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: 'var(--arcane-tint)',
                    color: '#a78bfa',
                    border: '1px solid rgba(167, 139, 250, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Shield size={12} /> {faction}
                  </span>
                </div>

                {/* Location sub-details */}
                {npc.location && npc.location.type !== 'city' && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} /> Bâtiment/Lieu : {npc.location.name}
                  </div>
                )}

                {npc.description && (
                  <p style={{ 
                    marginTop: '8px', 
                    fontSize: '0.8rem', 
                    color: 'var(--color-text)',
                    lineHeight: '1.3',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    whiteSpace: 'pre-line'
                  }}>
                    {npc.description}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
      
      {/* Create NPC Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Créer un nouveau PNJ">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Nom du PNJ *</label>
            <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Race / Origine</label>
              <input value={formData.race} onChange={e => setFormData({...formData, race: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Rôle / Faction</label>
              <input placeholder="ex: Chef Les Raffineurs" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Rattachement à une Ville / Lieu</label>
            <select
              value={formData.locationId}
              onChange={e => setFormData({...formData, locationId: e.target.value})}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
            >
              <option value="">-- Aucun lieu spécifique --</option>
              {locations && locations.map(l => (
                <option key={l.id} value={l.id}>{l.name} ({l.type})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Description / Personnalité</label>
            <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Annuler</button>
            <button type="submit" className="btn-primary">Créer le PNJ</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
