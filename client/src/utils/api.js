import useAuthStore from '../store/authStore';

const api = {
  getHeaders: () => {
    const token = useAuthStore.getState().accessToken;
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  },

  get: async (url) => {
    const res = await fetch(url, {
      method: 'GET',
      headers: api.getHeaders(),
    });
    return api.handleResponse(res);
  },

  post: async (url, body) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: api.getHeaders(),
      body: JSON.stringify(body),
    });
    return api.handleResponse(res);
  },

  put: async (url, body) => {
    const res = await fetch(url, {
      method: 'PUT',
      headers: api.getHeaders(),
      body: JSON.stringify(body),
    });
    return api.handleResponse(res);
  },

  delete: async (url) => {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: api.getHeaders(),
    });
    return api.handleResponse(res);
  },

  handleResponse: async (res) => {
    if (res.status === 401) {
      useAuthStore.getState().clearAuth();
      throw new Error('Unauthorized');
    }
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(data?.error || 'Request failed');
    }
    return data;
  }
};

export default api;
