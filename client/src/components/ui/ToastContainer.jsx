import React from 'react';
import { useNotificationStore } from '../../store/notificationStore';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const STYLES = {
  success: {
    background: 'var(--success-tint)',
    border: '1px solid var(--success-border)',
    color: 'var(--success)',
    iconColor: 'var(--success)',
  },
  error: {
    background: 'var(--danger-tint)',
    border: '1px solid var(--danger-border)',
    color: 'var(--danger)',
    iconColor: 'var(--danger)',
  },
  warning: {
    background: 'var(--warning-tint)',
    border: '1px solid var(--warning-border)',
    color: 'var(--warning)',
    iconColor: 'var(--warning)',
  },
  info: {
    background: 'var(--info-tint)',
    border: '1px solid var(--info-border)',
    color: 'var(--info)',
    iconColor: 'var(--info)',
  },
};

export default function ToastContainer() {
  const toasts = useNotificationStore((s) => s.toasts);
  const remove = useNotificationStore((s) => s.remove);

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 'var(--space-4)',
        right: 'var(--space-4)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        maxWidth: '360px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type] || Info;
        const style = STYLES[toast.type] || STYLES.info;
        return (
          <div
            key={toast.id}
            style={{
              ...style,
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--space-2)',
              fontSize: 'var(--text-sm)',
              pointerEvents: 'auto',
              animation: 'toast-in 0.2s ease-out',
            }}
          >
            <Icon size={18} style={{ flexShrink: 0, marginTop: '1px', color: style.iconColor }} />
            <span style={{ flex: 1, lineHeight: 1.4 }}>{toast.message}</span>
            <button
              onClick={() => remove(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px',
                color: style.color,
                opacity: 0.6,
                flexShrink: 0,
              }}
              aria-label="Fermer"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
