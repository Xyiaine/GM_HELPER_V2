import React, { useEffect, useState } from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { Dices, Eye, EyeOff, TrendingUp, TrendingDown } from 'lucide-react';

const STATS = [
  { key: 'strength', short: 'FOR', label: 'Force' },
  { key: 'dexterity', short: 'DEX', label: 'Dextérité' },
  { key: 'constitution', short: 'CON', label: 'Constitution' },
  { key: 'intelligence', short: 'INT', label: 'Intelligence' },
  { key: 'wisdom', short: 'SAG', label: 'Sagesse' },
  { key: 'charisma', short: 'CHA', label: 'Charisme' },
];

export default function DiceRoller({ campaignId }) {
  const { character, rollDice, diceHistory, fetchDiceHistory } = usePlayerStore();
  const [customDice, setCustomDice] = useState('1d20');
  const [isSecret, setIsSecret] = useState(false);
  const [mode, setMode] = useState('normal'); // 'normal' | 'advantage' | 'disadvantage'
  const [error, setError] = useState(null);

  useEffect(() => {
    if (campaignId) {
      fetchDiceHistory(campaignId);
    }
  }, [campaignId, fetchDiceHistory]);

  // The payload must match playerDiceRollSchema on the server. It used to send
  // `type: 'skill_check'` with a `statName` field and `baseDice`, none of which
  // the schema accepts, so every roll was rejected with a 400. The free roll
  // used `type: 'custom'`, which is not in the enum either.
  const rollOptions = {
    advantage: mode === 'advantage',
    disadvantage: mode === 'disadvantage',
    secret: isSecret,
  };

  const handleStatRoll = async (stat) => {
    setError(null);
    const res = await rollDice(campaignId, {
      type: 'ability_check',
      ability: stat.key,
      label: `Test de ${stat.label}`,
      ...rollOptions,
    });
    if (!res.success) setError(res.error);
  };

  const handleCustomRoll = async () => {
    setError(null);
    const res = await rollDice(campaignId, {
      type: 'free',
      expression: customDice,
      label: 'Jet libre',
      ...rollOptions,
    });
    if (!res.success) setError(res.error);
  };

  const modeButton = (value, label, Icon) => (
    <button
      onClick={() => setMode(mode === value ? 'normal' : value)}
      title={label}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        padding: '5px 10px',
        borderRadius: '16px',
        fontSize: '0.8rem',
        cursor: 'pointer',
        border: `1px solid ${mode === value ? 'var(--color-primary)' : 'var(--color-border)'}`,
        backgroundColor: mode === value ? 'rgba(99, 102, 241, 0.15)' : 'var(--color-surface)',
        color: mode === value ? 'var(--color-primary)' : 'var(--color-text-muted)',
      }}
    >
      <Icon size={13} /> {label}
    </button>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '16px', paddingBottom: '80px', maxWidth: '600px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, color: 'var(--color-text)' }}>
          <Dices color="var(--color-primary)" />
          Jets rapides
        </h2>
        <button
          onClick={() => setIsSecret(!isSecret)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--color-surface)',
            border: `1px solid ${isSecret ? 'var(--danger, #ef4444)' : 'var(--color-border)'}`,
            color: isSecret ? 'var(--danger, #ef4444)' : 'var(--color-text)',
            padding: '4px 12px',
            borderRadius: '16px',
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          {isSecret ? <><EyeOff size={14} /> Jet secret</> : <><Eye size={14} /> Jet public</>}
        </button>
      </header>

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {modeButton('advantage', 'Avantage', TrendingUp)}
        {modeButton('disadvantage', 'Désavantage', TrendingDown)}
      </div>

      {error && (
        <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.4)', color: 'var(--danger, #ef4444)', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      {character ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {STATS.map(stat => (
            <button
              key={stat.key}
              className="btn-secondary"
              onClick={() => handleStatRoll(stat)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px' }}
            >
              <span style={{ fontWeight: 'bold' }}>{stat.short}</span>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>1d20 + mod.</span>
            </button>
          ))}
        </div>
      ) : (
        <div style={{ padding: '20px', textAlign: 'center', backgroundColor: 'var(--color-surface)', borderRadius: '8px', color: 'var(--color-text-muted)' }}>
          Aucun personnage chargé pour les jets de caractéristique.
        </div>
      )}

      <section style={{ backgroundColor: 'var(--color-surface)', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
        <h3 style={{ margin: '0 0 12px 0', color: 'var(--color-text)', fontSize: '1.1rem' }}>Jet libre</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={customDice}
            onChange={e => setCustomDice(e.target.value)}
            placeholder="ex. 2d6+3"
            style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
          />
          <button className="btn-primary" onClick={handleCustomRoll} style={{ padding: '10px 20px' }}>Lancer</button>
        </div>
      </section>

      <section>
        <h3 style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', marginBottom: '12px', color: 'var(--color-text)' }}>
          Jets récents
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {diceHistory.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '20px' }}>Aucun jet pour le moment.</p>
          ) : (
            diceHistory.map((roll, idx) => (
              <div key={roll.id || idx} style={{
                backgroundColor: 'var(--color-surface)',
                padding: '16px',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid var(--color-border)'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {roll.label || 'Jet'}
                    {roll.visibleToAll === false && <EyeOff size={12} color="var(--danger, #ef4444)" />}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    {roll.expression} • {new Date(roll.createdAt).toLocaleTimeString()}
                  </div>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                  {roll.result}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
