import { create } from 'zustand';
import api from '../utils/api';

export const usePlayerStore = create((set, get) => ({
  campaigns: [],
  activeCampaignId: null,
  character: null,
  diceHistory: [],
  session: null,
  privateNotes: [],
  isLoading: false,
  error: null,
  
  setActiveCampaign: (id) => set({ activeCampaignId: id }),

  fetchCampaigns: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.get('/api/v1/player/campaigns');
      set({ campaigns: data, isLoading: false });
      if (data.length > 0 && !get().activeCampaignId) {
        set({ activeCampaignId: data[0].id });
      }
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  joinCampaign: async (campaignId, password) => {
    try {
      const res = await api.post('/api/v1/player/campaigns/join', { campaignId, password });
      await get().fetchCampaigns();
      if (res.campaign?.id) {
        set({ activeCampaignId: res.campaign.id });
      }
      return res;
    } catch (err) {
      console.error('Join campaign error:', err);
      throw err;
    }
  },

  fetchCharacter: async (campaignId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.get(`/api/v1/player/campaigns/${campaignId}/character`);
      set({ character: data, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  updateCharacter: async (campaignId, updates) => {
    try {
      const data = await api.put(`/api/v1/player/campaigns/${campaignId}/character`, updates);
      set({ character: data });
    } catch (err) {
      console.error(err);
    }
  },

  fetchDiceHistory: async (campaignId) => {
    try {
      const data = await api.get(`/api/v1/player/campaigns/${campaignId}/dice`);
      set({ diceHistory: data });
    } catch (err) {
      console.error(err);
    }
  },

  rollDice: async (campaignId, payload) => {
    try {
      const newRoll = await api.post(`/api/v1/player/campaigns/${campaignId}/dice`, payload);
      set(state => ({ diceHistory: [newRoll, ...state.diceHistory] }));
    } catch (err) {
      console.error(err);
    }
  },

  fetchSession: async (campaignId) => {
    try {
      const data = await api.get(`/api/v1/player/campaigns/${campaignId}/session`);
      set({ session: data.session });
    } catch (err) {
      console.error(err);
    }
  },

  fetchPrivateNotes: async (campaignId) => {
    try {
      const data = await api.get(`/api/v1/player/campaigns/${campaignId}/private-notes`);
      set({ privateNotes: data.notes || [] });
    } catch (err) {
      console.error(err);
    }
  },

  createPrivateNote: async (campaignId, payload) => {
    try {
      const data = await api.post(`/api/v1/player/campaigns/${campaignId}/private-notes`, payload);
      set(state => ({ privateNotes: [data.note, ...state.privateNotes] }));
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  updatePrivateNote: async (campaignId, noteId, payload) => {
    try {
      const data = await api.put(`/api/v1/player/campaigns/${campaignId}/private-notes/${noteId}`, payload);
      set(state => ({
        privateNotes: state.privateNotes.map(n => n.id === noteId ? data.note : n)
      }));
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  deletePrivateNote: async (campaignId, noteId) => {
    try {
      await api.delete(`/api/v1/player/campaigns/${campaignId}/private-notes/${noteId}`);
      set(state => ({
        privateNotes: state.privateNotes.filter(n => n.id !== noteId)
      }));
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}));
