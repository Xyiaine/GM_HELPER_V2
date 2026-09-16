import React, { useState, useEffect } from 'react';
import { X, FileText, Check, Loader, Edit3, Eye } from 'lucide-react';
import api from '../../utils/api';

export default function SessionRecapModal({
  isOpen,
  onClose,
  campaignId,
  sessionId,
  onConfirmEnd,
}) {
  const [recap, setRecap] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && sessionId) {
      generateRecap();
    }
  }, [isOpen, sessionId]);

  const generateRecap = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.post(`/api/v1/gm/campaigns/${campaignId}/sessions/${sessionId}/recap`);
      setRecap(data.recap || '');
      setEditMode(false);
    } catch (err) {
      setError(err.message || 'Erreur lors de la génération du récapitulatif');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndEnd = async () => {
    setSaving(true);
    try {
      if (editMode && recap) {
        await api.put(`/api/v1/gm/campaigns/${campaignId}/sessions/${sessionId}`, {
          summary: recap,
        });
      }
      onConfirmEnd();
      onClose();
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

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
          maxWidth: '640px',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <FileText size={20} color="var(--accent-rust)" />
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-lg)',
                color: 'var(--ink)',
                margin: 0,
              }}
            >
              Clore la séance
            </h3>
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
          {loading ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-8) 0', color: 'var(--ink-muted)' }}>
              <Loader size={24} style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ marginTop: 'var(--space-3)' }}>Compilation des événements…</p>
            </div>
          ) : error ? (
            <div
              style={{
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
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-3)' }}>
                <button
                  className="btn-secondary"
                  onClick={() => setEditMode(!editMode)}
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-xs)' }}
                >
                  {editMode ? <Eye size={14} /> : <Edit3 size={14} />}
                  {editMode ? 'Prévisualiser' : 'Éditer'}
                </button>
              </div>

              {editMode ? (
                <textarea
                  value={recap}
                  onChange={(e) => setRecap(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '300px',
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-sm)',
                    lineHeight: 1.6,
                    backgroundColor: 'var(--paper)',
                    color: 'var(--ink)',
                    border: '1px solid var(--rule)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-3)',
                    resize: 'vertical',
                  }}
                />
              ) : (
                <div
                  style={{
                    backgroundColor: 'var(--paper)',
                    border: '1px solid var(--rule)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-4)',
                    fontSize: 'var(--text-sm)',
                    lineHeight: 1.6,
                    color: 'var(--ink)',
                    whiteSpace: 'pre-wrap',
                    minHeight: '200px',
                  }}
                  dangerouslySetInnerHTML={{
                    __html: recap
                      .replace(/&/g, '&amp;')
                      .replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;')
                      .replace(/^## (.*$)/gim, '<h3 style="margin:16px 0 8px;color:var(--accent-rust);font-size:1.1rem">$1</h3>')
                      .replace(/^# (.*$)/gim, '<h2 style="margin:0 0 12px;color:var(--ink);font-size:1.3rem">$1</h2>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/^- (.*$)/gim, '<li style="margin:4px 0">$1</li>')
                      .replace(/<li>/g, '<ul style="margin:8px 0;padding-left:20px"><li>')
                      .replace(/<\/li>\n(?!<li>)/g, '</li></ul>\n')
                      .replace(/---/g, '<hr style="border:none;border-top:1px solid var(--rule);margin:16px 0">')
                      .replace(/_(.*?)_/g, '<em style="color:var(--ink-muted)">$1</em>'),
                  }}
                />
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: 'var(--space-3) var(--space-5)',
            borderTop: '1px solid var(--rule)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 'var(--space-2)',
          }}
        >
          <button className="btn-secondary" onClick={onClose} disabled={saving}>
            Annuler
          </button>
          <button
            className="btn-primary"
            onClick={handleSaveAndEnd}
            disabled={loading || saving}
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
          >
            {saving ? (
              'Sauvegarde…'
            ) : (
              <>
                <Check size={16} />
                Clore la séance
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
