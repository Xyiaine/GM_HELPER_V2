import React, { useState, useEffect } from 'react';
import { X, Gift, Users, Check, AlertCircle } from 'lucide-react';

const REWARD_TYPE_LABELS = {
  item: 'Objet',
  gold: 'Or',
  xp: 'Expérience',
  npcFavor: 'Faveur',
  information: 'Information',
};

const REWARD_TYPE_ICONS = {
  item: Gift,
  gold: Gift,
  xp: Gift,
  npcFavor: Users,
  information: Gift,
};

export default function RewardDistributionModal({
  isOpen,
  onClose,
  node,
  quest,
  characters,
  campaignId,
  onDistribute,
}) {
  const [selections, setSelections] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const rewards = node?.rewards || [];

  useEffect(() => {
    if (isOpen) {
      setSelections({});
      setResult(null);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen || !node) return null;

  const toggleCharacter = (rewardId, characterId) => {
    setSelections((prev) => {
      const current = prev[rewardId] || [];
      const next = current.includes(characterId)
        ? current.filter((id) => id !== characterId)
        : [...current, characterId];
      return { ...prev, [rewardId]: next };
    });
  };

  const handleDistribute = async () => {
    const distributions = Object.entries(selections)
      .filter(([, chars]) => chars.length > 0)
      .map(([rewardId, characterIds]) => ({ rewardId, characterIds }));

    if (distributions.length === 0) {
      setError('Aucune récompense sélectionnée.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await onDistribute(distributions);
      setResult(data.distributed || []);
    } catch (err) {
      setError(err.message || 'Erreur lors de la distribution.');
    } finally {
      setLoading(false);
    }
  };

  const activePlayers = characters.filter((c) => c.ownerUserId);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--scrim)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--paper-raised)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--rule)',
          boxShadow: 'var(--shadow-lg)',
          maxWidth: '560px',
          width: '100%',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-4) var(--space-5)',
            borderBottom: '1px solid var(--rule)',
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-lg)',
                color: 'var(--ink)',
                margin: 0,
              }}
            >
              Distribuer les récompenses
            </h3>
            <p
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--ink-muted)',
                margin: '4px 0 0',
              }}
            >
              {quest?.name} — {node.title}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--ink-muted)',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ overflow: 'auto', padding: 'var(--space-4) var(--space-5)', flex: 1 }}>
          {rewards.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                color: 'var(--ink-muted)',
                padding: 'var(--space-8) 0',
              }}
            >
              <Gift size={32} style={{ marginBottom: 'var(--space-3)', opacity: 0.5 }} />
              <p>Aucune récompense planifiée sur ce nœud.</p>
              <p style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-2)' }}>
                Créez des récompenses dans l'onglet « Récompenses » du nœud.
              </p>
            </div>
          ) : result ? (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  color: 'var(--success)',
                  marginBottom: 'var(--space-4)',
                }}
              >
                <Check size={18} />
                <span style={{ fontWeight: 500 }}>Récompenses distribuées</span>
              </div>
              {result.map((r, i) => (
                <div
                  key={i}
                  style={{
                    padding: 'var(--space-2) var(--space-3)',
                    backgroundColor: 'var(--paper-sunken)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--space-2)',
                    fontSize: 'var(--text-sm)',
                  }}
                >
                  {r.error ? (
                    <span style={{ color: 'var(--danger)' }}>
                      <AlertCircle size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                      {r.error}
                    </span>
                  ) : (
                    <span>
                      <strong>{r.characterName}</strong> —{' '}
                      {REWARD_TYPE_LABELS[r.rewardType] || r.rewardType}
                      {r.applied?.itemName && ` : ${r.applied.itemName}`}
                      {r.applied?.amount && ` : ${r.applied.amount}${r.applied.unit || ''}`}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {rewards.map((reward) => {
                const Icon = REWARD_TYPE_ICONS[reward.rewardType] || Gift;
                const selectedChars = selections[reward.id] || [];
                return (
                  <div
                    key={reward.id}
                    style={{
                      border: '1px solid var(--rule)',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-3)',
                      backgroundColor: 'var(--paper)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        marginBottom: 'var(--space-3)',
                      }}
                    >
                      <Icon size={16} color="var(--accent-rust)" />
                      <span
                        style={{
                          fontWeight: 500,
                          fontSize: 'var(--text-sm)',
                          color: 'var(--ink)',
                        }}
                      >
                        {REWARD_TYPE_LABELS[reward.rewardType] || reward.rewardType}
                      </span>
                      <span style={{ color: 'var(--ink-faint)', fontSize: 'var(--text-xs)' }}>
                        {reward.rewardValue}
                      </span>
                    </div>

                    {activePlayers.length === 0 ? (
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-muted)' }}>
                        Aucun personnage joueur dans cette campagne.
                      </p>
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 'var(--space-2)',
                        }}
                      >
                        {activePlayers.map((char) => (
                          <label
                            key={char.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 'var(--space-1)',
                              padding: '4px 8px',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: selectedChars.includes(char.id)
                                ? 'var(--success-tint)'
                                : 'var(--paper-sunken)',
                              border: `1px solid ${selectedChars.includes(char.id) ? 'var(--success-border)' : 'var(--rule)'}`,
                              cursor: 'pointer',
                              fontSize: 'var(--text-xs)',
                              userSelect: 'none',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedChars.includes(char.id)}
                              onChange={() => toggleCharacter(reward.id, char.id)}
                              style={{ accentColor: 'var(--success)' }}
                            />
                            {char.name}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {error && (
            <div
              style={{
                marginTop: 'var(--space-4)',
                padding: 'var(--space-3)',
                backgroundColor: 'var(--danger-tint)',
                border: '1px solid var(--danger-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--danger)',
                fontSize: 'var(--text-sm)',
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        {!result && rewards.length > 0 && (
          <div
            style={{
              padding: 'var(--space-3) var(--space-5)',
              borderTop: '1px solid var(--rule)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 'var(--space-2)',
            }}
          >
            <button
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </button>
            <button
              className="btn-primary"
              onClick={handleDistribute}
              disabled={loading || Object.values(selections).every((c) => c.length === 0)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
              }}
            >
              {loading ? (
                'Distribution…'
              ) : (
                <>
                  <Gift size={16} />
                  Distribuer
                </>
              )}
            </button>
          </div>
        )}

        {result && (
          <div
            style={{
              padding: 'var(--space-3) var(--space-5)',
              borderTop: '1px solid var(--rule)',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <button className="btn-primary" onClick={onClose}>
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
