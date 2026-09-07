import React, { useState } from 'react';
import { INITIAL_HAZARD_CARDS } from './deckData';
import { useGmStore } from '../../../store/gmStore';
import {
  CloudRain, Wrench, Swords, Sparkles, Plus, Check, Filter,
  AlertTriangle, ShieldAlert, Zap
} from 'lucide-react';

const CATEGORIES = [
  { key: 'all', label: 'Toutes', icon: Sparkles },
  { key: 'climate', label: 'Climat & Sel', icon: CloudRain },
  { key: 'mechanical', label: 'Véhicules & Convoi', icon: Wrench },
  { key: 'combat', label: 'Combat & Dangers', icon: Swords },
  { key: 'calm', label: 'Revers de Fortune', icon: AlertTriangle }
];

const SEVERITY_BADGES = {
  low: { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e', border: 'rgba(34, 197, 94, 0.3)', label: 'Mineur' },
  medium: { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)', label: 'Modéré' },
  high: { bg: 'rgba(249, 115, 22, 0.15)', text: '#f97316', border: 'rgba(249, 115, 22, 0.3)', label: 'Sévère' },
  critical: { bg: 'rgba(239, 68, 68, 0.18)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.4)', label: 'Critique' }
};

export default function HazardCardsTab() {
  const {
    doomPool,
    spendDoomPool,
    addActiveComplication,
    customHazardCards,
    addCustomHazardCard
  } = useGmStore();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [justPlayedId, setJustPlayedId] = useState(null);

  // Form for custom card
  const [customForm, setCustomForm] = useState({
    title: '',
    category: 'combat',
    cost: 2,
    severity: 'medium',
    flavor: '',
    effect: ''
  });

  const allCards = [...customHazardCards, ...INITIAL_HAZARD_CARDS];

  const filteredCards = selectedCategory === 'all'
    ? allCards
    : allCards.filter(c => c.category === selectedCategory);

  const handlePlayCard = (card) => {
    if (doomPool < card.cost) return;
    const ok = spendDoomPool(card.cost);
    if (ok) {
      addActiveComplication(card);
      setJustPlayedId(card.id);
      setTimeout(() => setJustPlayedId(null), 1500);
    }
  };

  const handleCreateCustomCard = (e) => {
    e.preventDefault();
    if (!customForm.title.trim() || !customForm.effect.trim()) return;

    addCustomHazardCard({
      title: customForm.title.trim(),
      category: customForm.category,
      cost: parseInt(customForm.cost, 10) || 1,
      severity: customForm.severity,
      flavor: customForm.flavor.trim(),
      effect: customForm.effect.trim()
    });

    setCustomForm({
      title: '',
      category: 'combat',
      cost: 2,
      severity: 'medium',
      flavor: '',
      effect: ''
    });
    setShowAddCustom(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Category Pills & Add Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 10px',
                  borderRadius: '16px',
                  fontSize: '0.78rem',
                  fontWeight: isSelected ? 600 : 400,
                  border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                  backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: isSelected ? '#fff' : 'var(--color-text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={13} />
                {cat.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setShowAddCustom(!showAddCustom)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '5px 10px',
            borderRadius: '6px',
            border: '1px dashed var(--color-primary)',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            color: 'var(--color-primary-light, #818cf8)',
            fontSize: '0.78rem',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          <Plus size={14} /> Carte Custom
        </button>
      </div>

      {/* Custom Card Creation Form */}
      {showAddCustom && (
        <form
          onSubmit={handleCreateCustomCard}
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-primary)',
            borderRadius: '10px',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-primary-light)' }}>
            Créer une Carte d'Intervention Personnalisée
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Titre de la carte</label>
              <input
                type="text"
                required
                value={customForm.title}
                onChange={(e) => setCustomForm({ ...customForm, title: e.target.value })}
                placeholder="Ex: Piston fendu"
                style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Catégorie</label>
              <select
                value={customForm.category}
                onChange={(e) => setCustomForm({ ...customForm, category: e.target.value })}
                style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
              >
                <option value="climate">Climat & Sel</option>
                <option value="mechanical">Véhicule</option>
                <option value="combat">Combat</option>
                <option value="calm">Revers</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Coût en Menace</label>
              <input
                type="number"
                min="1"
                max="10"
                value={customForm.cost}
                onChange={(e) => setCustomForm({ ...customForm, cost: e.target.value })}
                style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Texte d'ambiance (phrase d'immersion orale)</label>
            <input
              type="text"
              value={customForm.flavor}
              onChange={(e) => setCustomForm({ ...customForm, flavor: e.target.value })}
              placeholder="Ex: Une odeur de brûlé se répand dans l'habitacle..."
              style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Effet mécanique concret</label>
            <textarea
              required
              rows={2}
              value={customForm.effect}
              onChange={(e) => setCustomForm({ ...customForm, effect: e.target.value })}
              placeholder="Ex: Vitesse divisée par 2. Test de Bricolage DD 12 nécessaire."
              style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setShowAddCustom(false)}
              style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text-muted)', cursor: 'pointer' }}
            >
              Annuler
            </button>
            <button
              type="submit"
              style={{ padding: '6px 14px', borderRadius: '4px', border: 'none', backgroundColor: 'var(--color-primary)', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
            >
              Sauvegarder la Carte
            </button>
          </div>
        </form>
      )}

      {/* Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
        gap: '12px'
      }}>
        {filteredCards.map((card) => {
          const canAfford = doomPool >= card.cost;
          const severityInfo = SEVERITY_BADGES[card.severity] || SEVERITY_BADGES.medium;
          const isJustPlayed = justPlayedId === card.id;

          return (
            <div
              key={card.id}
              style={{
                backgroundColor: 'var(--color-surface)',
                border: isJustPlayed
                  ? '1px solid #10b981'
                  : canAfford
                  ? '1px solid rgba(255, 255, 255, 0.12)'
                  : '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '10px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '10px',
                boxShadow: canAfford ? '0 4px 12px rgba(0, 0, 0, 0.25)' : 'none',
                opacity: canAfford ? 1 : 0.65,
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Top Row: Title & Badges */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.3 }}>
                    {card.title}
                  </h4>

                  {/* Cost Badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    backgroundColor: canAfford ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                    border: canAfford ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid var(--color-border)',
                    color: canAfford ? '#ef4444' : 'var(--color-text-muted)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    flexShrink: 0
                  }}>
                    <Zap size={12} /> {card.cost}
                  </div>
                </div>

                {/* Sub Badges */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: severityInfo.bg,
                    color: severityInfo.text,
                    border: `1px solid ${severityInfo.border}`,
                    fontWeight: 600
                  }}>
                    {severityInfo.label}
                  </span>
                  {card.isCustom && (
                    <span style={{
                      fontSize: '0.7rem',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(99, 102, 241, 0.15)',
                      color: 'var(--color-primary-light)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      fontWeight: 600
                    }}>
                      Custom
                    </span>
                  )}
                </div>

                {/* Flavor text */}
                {card.flavor && (
                  <p style={{
                    margin: '0 0 8px 0',
                    fontSize: '0.8rem',
                    fontStyle: 'italic',
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.35
                  }}>
                    « {card.flavor} »
                  </p>
                )}

                {/* Mechanical Effect */}
                <div style={{
                  backgroundColor: 'var(--color-background)',
                  borderLeft: `3px solid ${severityInfo.text}`,
                  borderRadius: '0 6px 6px 0',
                  padding: '8px 10px',
                  fontSize: '0.82rem',
                  color: 'var(--color-text)',
                  lineHeight: 1.4
                }}>
                  {card.effect}
                </div>
              </div>

              {/* Bottom Play Button */}
              <button
                onClick={() => handlePlayCard(card)}
                disabled={!canAfford}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: canAfford ? 'none' : '1px solid var(--color-border)',
                  backgroundColor: isJustPlayed
                    ? '#10b981'
                    : canAfford
                    ? '#ef4444'
                    : 'rgba(255, 255, 255, 0.05)',
                  color: canAfford || isJustPlayed ? '#fff' : 'var(--color-text-muted)',
                  cursor: canAfford ? 'pointer' : 'not-allowed',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                {isJustPlayed ? (
                  <>
                    <Check size={16} /> Carte Jouée !
                  </>
                ) : canAfford ? (
                  <>
                    <Zap size={14} /> Jouer la complication (-{card.cost} Menace)
                  </>
                ) : (
                  `Menace insuffisante (${doomPool}/${card.cost})`
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
