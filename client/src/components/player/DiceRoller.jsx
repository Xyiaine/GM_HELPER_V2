import React, { useEffect, useState } from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { Dices, Eye, EyeOff } from 'lucide-react';

export default function DiceRoller({ campaignId }) {
  const { character, rollDice, diceHistory, fetchDiceHistory } = usePlayerStore();
  const [customDice, setCustomDice] = useState('1d20');
  const [isSecret, setIsSecret] = useState(false);

  useEffect(() => {
    if (campaignId) {
      fetchDiceHistory(campaignId);
    }
  }, [campaignId, fetchDiceHistory]);

  const handleStatRoll = (statName) => {
    rollDice(campaignId, {
      type: 'skill_check',
      statName,
      baseDice: '1d20',
      label: `${statName.charAt(0).toUpperCase() + statName.slice(1)} Check`,
      isSecret
    });
  };

  const handleCustomRoll = () => {
    rollDice(campaignId, {
      type: 'custom',
      baseDice: customDice,
      label: 'Custom Roll',
      isSecret
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '16px', paddingBottom: '80px', maxWidth: '600px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, color: 'var(--color-text)' }}>
          <Dices color="var(--color-primary)" />
          Quick Rolls
        </h2>
        <button 
          onClick={() => setIsSecret(!isSecret)}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            background: isSecret ? 'var(--color-surface)' : 'var(--color-surface)', 
            border: `1px solid ${isSecret ? 'var(--danger, #ef4444)' : 'var(--color-border)'}`, 
            color: isSecret ? 'var(--danger, #ef4444)' : 'var(--color-text)', 
            padding: '4px 12px', 
            borderRadius: '16px', 
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          {isSecret ? <><EyeOff size={14} /> Secret Roll</> : <><Eye size={14} /> Public Roll</>}
        </button>
      </header>

      {character ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map(stat => (
            <button 
              key={stat}
              className="btn-secondary"
              onClick={() => handleStatRoll(stat)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px' }}
            >
              <span style={{ fontWeight: 'bold' }}>{stat.substring(0,3).toUpperCase()}</span>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>1d20 + Mod</span>
            </button>
          ))}
        </div>
      ) : (
        <div style={{ padding: '20px', textAlign: 'center', backgroundColor: 'var(--color-surface)', borderRadius: '8px', color: 'var(--color-text-muted)' }}>
          No character loaded for quick stats.
        </div>
      )}

      <section style={{ backgroundColor: 'var(--color-surface)', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
        <h3 style={{ margin: '0 0 12px 0', color: 'var(--color-text)', fontSize: '1.1rem' }}>Custom Roll</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            value={customDice} 
            onChange={e => setCustomDice(e.target.value)}
            placeholder="e.g. 2d6+3"
            style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
          />
          <button className="btn-primary" onClick={handleCustomRoll} style={{ padding: '10px 20px' }}>Roll</button>
        </div>
      </section>

      <section>
        <h3 style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', marginBottom: '12px', color: 'var(--color-text)' }}>
          Recent Rolls
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {diceHistory.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '20px' }}>No recent rolls.</p>
          ) : (
            diceHistory.map((roll, idx) => (
              <div key={idx} style={{ 
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
                    {roll.label || 'Roll'} 
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
