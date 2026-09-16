import { create } from 'zustand';

let nextId = 1;

export const useNotificationStore = create((set, get) => ({
  toasts: [],

  add: (toast) => {
    const id = nextId++;
    const item = { id, duration: 4000, ...toast };
    set((state) => ({ toasts: [...state.toasts, item] }));

    if (item.duration > 0) {
      setTimeout(() => {
        get().remove(id);
      }, item.duration);
    }

    return id;
  },

  remove: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  success: (message, opts = {}) => get().add({ type: 'success', message, ...opts }),
  error: (message, opts = {}) => get().add({ type: 'error', message, ...opts }),
  warning: (message, opts = {}) => get().add({ type: 'warning', message, ...opts }),
  info: (message, opts = {}) => get().add({ type: 'info', message, ...opts }),
}));

// Helper pour les composants qui n'ont pas accès au store
export const notify = {
  success: (message, opts) => useNotificationStore.getState().success(message, opts),
  error: (message, opts) => useNotificationStore.getState().error(message, opts),
  warning: (message, opts) => useNotificationStore.getState().warning(message, opts),
  info: (message, opts) => useNotificationStore.getState().info(message, opts),
};
