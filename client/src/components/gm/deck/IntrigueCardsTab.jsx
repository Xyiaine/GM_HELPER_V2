import React, { useState } from 'react';
import { INTRIGUE_CARDS } from './deckData';
import { Sparkles, Eye, EyeOff, ShieldCheck, Gift, Building2, Plus, Check } from 'lucide-react';

export default function IntrigueCardsTab() {
  const [cards, setCards] = useState(INTRIGUE_CARDS);
  const [revealedSecrets, setRevealedSecrets] = useState({});
  const [completedIds, setCompletedIds] = useState(new Set());
  const [showAddModal, setShowAddModal] = useState(false);

  const [newIntrigue, setNewIntrigue] = useState({
    title: '',
    faction: 'Toutes',
    hook: '',
    secret: '',
    reward: ''
  });

  const toggleSecret = (id) => {
    setRevealedSecrets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCompleted = (id) => {
    setCompletedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDrawRandom = () => {
    const unrevealed = cards.filter(c => !completedIds.has(c.id));
    if (unrevealed.length === 0) return;
    const picked = unrevealed[Math.floor(Math.random() * unrevealed.length)];
    // Scroll or flash it
    setRevealedSecrets(prev => ({ ...prev, [picked.id]: true }));
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!newIntrigue.title.trim() || !newIntrigue.hook.trim()) return;
    const card = {
      id: 'custom_int_' + Date.now(),
      ...newIntrigue,
      isCustom: true
    };
    setCards([card, ...cards]);
    setNewIntrigue({ title: '', faction: 'Toutes', hook: '', secret: '', reward: '' });
    setShowAddModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Action Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: 'var(--color-surface)',
        padding: '10px 14px',
        borderRadius: '8px',
        border: '1px solid var(--color-border)',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={handleDrawRandom}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.82rem',
            cursor: 'pointer'
          }}
        >
          <Sparkles size={15} /> 🎲 Tirer une Rumeur au Hasard
        </button>

        <button
          onClick={() => setShowAddModal(!showAddModal)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px dashed var(--color-primary)',
            backgroundColor: 'var(--primary-tint-strong)',
            color: 'var(--color-primary-light)',
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}
        >
          <Plus size={14} /> Ajouter une Intrigue
        </button>
      </div>

      {/* Form modal/inline */}
      {showAddModal && (
        <form
          onSubmit={handleAddCustom}
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-primary)',
            borderRadius: '8px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px' }}>
            <input
              type="text"
              required
              placeholder="Titre de l'intrigue"
              value={newIntrigue.title}
              onChange={(e) => setNewIntrigue({ ...newIntrigue, title: e.target.value })}
              style={{ padding: '6px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
            />
            <input
              type="text"
              placeholder="Faction / Ville liée"
              value={newIntrigue.faction}
              onChange={(e) => setNewIntrigue({ ...newIntrigue, faction: e.target.value })}
              style={{ padding: '6px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
            />
          </div>
          <textarea
            required
            rows={2}
            placeholder="L'Accroche (ce que les PJ découvrent ou entendent)"
            value={newIntrigue.hook}
            onChange={(e) => setNewIntrigue({ ...newIntrigue, hook: e.target.value })}
            style={{ padding: '6px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
          />
          <textarea
            rows={2}
            placeholder="Le Secret du MJ (la vérité en coulisses)"
            value={newIntrigue.secret}
            onChange={(e) => setNewIntrigue({ ...newIntrigue, secret: e.target.value })}
            style={{ padding: '6px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
          />
          <input
            type="text"
            placeholder="Récompense / Enjeu"
            value={newIntrigue.reward}
            onChange={(e) => setNewIntrigue({ ...newIntrigue, reward: e.target.value })}
            style={{ padding: '6px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              style={{ padding: '4px 10px', background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', cursor: 'pointer' }}
            >
              Annuler
            </button>
            <button
              type="submit"
              style={{ padding: '4px 12px', backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Ajouter
            </button>
          </div>
        </form>
      )}

      {/* Cards List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
        {cards.map((item) => {
          const isDone = completedIds.has(item.id);
          const isSecretOpen = revealedSecrets[item.id];

          return (
            <div
              key={item.id}
              style={{
                backgroundColor: 'var(--color-surface)',
                border: isDone ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--color-border)',
                borderRadius: '10px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                opacity: isDone ? 0.6 : 1,
                boxShadow: isDone ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.2)'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text)' }}>
                    {item.title}
                  </h4>
                  <span style={{
                    fontSize: '0.72rem',
                    color: 'var(--color-primary-light)',
                    backgroundColor: 'var(--primary-tint-strong)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    display: 'inline-block',
                    marginTop: '4px'
                  }}>
                    {item.faction}
                  </span>
                </div>

                <button
                  onClick={() => toggleCompleted(item.id)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: isDone ? '1px solid #10b981' : '1px solid var(--color-border)',
                    backgroundColor: isDone ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                    color: isDone ? 'var(--success-text)' : 'var(--color-text-muted)',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title={isDone ? 'Marquer comme non résolue' : 'Marquer comme résolue'}
                >
                  <Check size={12} /> {isDone ? 'Résolue' : 'En cours'}
                </button>
              </div>

              {/* Hook */}
              <div style={{
                fontSize: '0.82rem',
                color: 'var(--color-text)',
                backgroundColor: 'var(--color-background)',
                padding: '8px',
                borderRadius: '6px',
                lineHeight: 1.35
              }}>
                <strong style={{ color: 'var(--ember-text)' }}>Accroche : </strong>
                {item.hook}
              </div>

              {/* Secret Toggle */}
              <div style={{
                backgroundColor: 'var(--danger-tint)',
                border: '1px dashed rgba(239, 68, 68, 0.3)',
                borderRadius: '6px',
                padding: '8px',
                fontSize: '0.78rem'
              }}>
                <div
                  onClick={() => toggleSecret(item.id)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    color: 'var(--danger-text)',
                    fontWeight: 600
                  }}
                >
                  <span>Envers du décor (Secret MJ)</span>
                  {isSecretOpen ? <EyeOff size={13} /> : <Eye size={13} />}
                </div>
                {isSecretOpen && (
                  <p style={{ margin: '6px 0 0 0', color: 'var(--color-text)', lineHeight: 1.35 }}>
                    {item.secret}
                  </p>
                )}
              </div>

              {/* Reward */}
              {item.reward && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.78rem',
                  color: 'var(--success-text)'
                }}>
                  <Gift size={13} style={{ flexShrink: 0 }} />
                  <span><strong>Enjeu / Butin :</strong> {item.reward}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
