import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { usePlayerStore } from '../../store/playerStore';
import { LogIn, Key, ShieldCheck } from 'lucide-react';

export default function JoinCampaignModal({ isOpen, onClose, onSuccess }) {
  const [campaignId, setCampaignId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { joinCampaign } = usePlayerStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!campaignId.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const res = await joinCampaign(campaignId.trim(), password.trim());
      setSubmitting(false);
      setCampaignId('');
      setPassword('');
      if (onSuccess) {
        onSuccess(res.campaign);
      }
      onClose();
    } catch (err) {
      setSubmitting(false);
      setError(err.response?.data?.error || err.message || 'Impossible de rejoindre la campagne.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rejoindre une Campagne">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          <ShieldCheck size={18} color="var(--color-primary, #6366f1)" />
          <span>Entrez l'identifiant et le mot de passe transmis par le Maître du Jeu.</span>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '6px',
            color: '#f87171',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)' }}>
            ID de la campagne
          </label>
          <input
            type="text"
            placeholder="ex: clx..."
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-background)',
              color: 'var(--color-text)',
              fontSize: '0.95rem',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)' }}>
            Mot de passe de la campagne
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                paddingRight: '40px',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-text)',
                fontSize: '0.95rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              required
            />
            <Key size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'transparent',
              color: 'var(--color-text)',
              cursor: 'pointer'
            }}
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '8px 20px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'var(--color-primary, #6366f1)',
              color: '#ffffff',
              fontWeight: 600,
              cursor: submitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              opacity: submitting ? 0.7 : 1
            }}
          >
            <LogIn size={16} />
            {submitting ? 'Connexion...' : 'Rejoindre'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
