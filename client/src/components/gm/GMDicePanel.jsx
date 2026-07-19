import React, { useState, useEffect } from 'react';
import { useGmStore } from '../../store/gmStore';
import api from '../../utils/api';
import { X, Dices } from 'lucide-react';

export default function GMDicePanel({ onClose }) {
  const { activeCampaignId } = useGmStore();
  const [history, setHistory] = useState([]);
  const [formula, setFormula] = useState('1d20');

  useEffect(() => {
    if (activeCampaignId) {
      api.get(`/api/v1/gm/campaigns/${activeCampaignId}/dice`)
         .then(data => setHistory(Array.isArray(data) ? data : (data.history || [])))
         .catch(console.error);
    }
  }, [activeCampaignId]);

  const handleRoll = async (e) => {
    e.preventDefault();
    if (!formula) return;
    try {
      const data = await api.post(`/api/v1/gm/campaigns/${activeCampaignId}/dice`, {
        expression: formula,
        label: 'GM Roll',
        visibleToAll: true
      });
      setHistory(prev => [data.roll, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '300px',
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: '8px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)' }}>
          <Dices size={18} color="var(--color-primary)" />
          GM Dice Roller
        </h3>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
          <X size={18} />
        </button>
      </div>
      
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <form onSubmit={handleRoll} style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            value={formula} 
            onChange={e => setFormula(e.target.value)} 
            placeholder="e.g. 2d6+3"
            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '8px 12px' }}>Roll</button>
        </form>

        <div style={{ flex: 1, minHeight: '200px', maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {history.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', fontSize: '0.9rem' }}>No recent rolls.</p>
          ) : (
            history.map((roll, i) => (
              <div key={i} style={{ padding: '8px', backgroundColor: 'var(--color-background)', borderRadius: '4px', fontSize: '0.9rem', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  <span>{roll.expression}</span>
                  <span>{new Date(roll.createdAt).toLocaleTimeString()}</span>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text)' }}>
                  Résultat: {roll.result}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
