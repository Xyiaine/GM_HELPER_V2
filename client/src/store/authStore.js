import { create } from 'zustand';

const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: localStorage.getItem('accessToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: !!localStorage.getItem('accessToken'),
  error: null,

  setAuth: (user, token) => {
    localStorage.setItem('accessToken', token);
    set({ user, accessToken: token, isAuthenticated: true, isLoading: false, error: null });
  },

  clearAuth: () => {
    localStorage.removeItem('accessToken');
    set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true, error: null });
      const token = get().accessToken;
      if (!token) {
        get().clearAuth();
        return;
      }

      const res = await fetch('/api/v1/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        set({ user: data.user, isAuthenticated: true, isLoading: false });
      } else {
        get().clearAuth();
      }
    } catch (err) {
      get().clearAuth();
      set({ error: 'Network error' });
    }
  },

  login: async (pseudoOrEmail, password) => {
    try {
      set({ isLoading: true, error: null });
      const payload = typeof pseudoOrEmail === 'object' 
        ? pseudoOrEmail 
        : { pseudo: pseudoOrEmail, email: pseudoOrEmail, password };
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      if (res.ok) {
        get().setAuth(data.user, data.accessToken);
        return { success: true };
      } else {
        set({ isLoading: false, error: data.error || 'Login failed' });
        return { success: false, error: data.error };
      }
    } catch (err) {
      set({ isLoading: false, error: 'Network error' });
      return { success: false, error: 'Network error' };
    }
  },

  register: async (firstNameOrData, lastNameParam, pseudoParam) => {
    try {
      set({ isLoading: true, error: null });
      let payload = {};
      if (typeof firstNameOrData === 'object' && firstNameOrData !== null) {
        payload = firstNameOrData;
      } else {
        payload = { firstName: firstNameOrData, lastName: lastNameParam, pseudo: pseudoParam };
      }

      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      if (res.ok) {
        get().setAuth(data.user, data.accessToken);
        return { success: true };
      } else {
        set({ isLoading: false, error: data.error || 'Registration failed' });
        return { success: false, error: data.error };
      }
    } catch (err) {
      set({ isLoading: false, error: 'Network error' });
      return { success: false, error: 'Network error' };
    }
  },

  logout: async () => {
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST' });
      get().clearAuth();
    } catch (err) {
      console.error('Logout error:', err);
      get().clearAuth();
    }
  },
}));

export default useAuthStore;
