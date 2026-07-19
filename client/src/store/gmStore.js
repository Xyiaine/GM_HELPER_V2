import { create } from 'zustand';
import api from '../utils/api';

export const useGmStore = create((set, get) => ({
  campaigns: [],
  activeCampaignId: null,
  characters: [],
  npcs: [],
  locations: [],
  cities: [],
  quests: [],
  encounters: [],
  items: [],
  tags: [],
  isLoading: false,
  error: null,

  setActiveCampaign: (id) => set({ activeCampaignId: id }),

  fetchCampaigns: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.get('/api/v1/gm/campaigns');
      const campaignsList = data.campaigns || data || [];
      set({ campaigns: campaignsList, isLoading: false });
      if (campaignsList.length > 0 && !get().activeCampaignId) {
        set({ activeCampaignId: campaignsList[0].id });
      }
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchCharacters: async (campaignId) => {
    try {
      const data = await api.get(`/api/v1/gm/campaigns/${campaignId}/characters`);
      set({ characters: data.characters || data || [] });
    } catch (err) {
      console.error(err);
    }
  },

  createCharacter: async (campaignId, payload) => {
    try {
      const data = await api.post(`/api/v1/gm/campaigns/${campaignId}/characters`, payload);
      set((state) => ({ characters: [...state.characters, data.character] }));
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  updateCharacter: async (campaignId, characterId, payload) => {
    try {
      const data = await api.put(`/api/v1/gm/campaigns/${campaignId}/characters/${characterId}`, payload);
      set((state) => ({
        characters: state.characters.map(c => c.id === characterId ? data.character : c)
      }));
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  fetchNpcs: async (campaignId) => {
    try {
      const data = await api.get(`/api/v1/gm/campaigns/${campaignId}/npcs`);
      set({ npcs: data.npcs || data || [] });
    } catch (err) {
      console.error(err);
    }
  },

  fetchItems: async (campaignId) => {
    try {
      const data = await api.get(`/api/v1/gm/campaigns/${campaignId}/items`);
      set({ items: data.items || data || [] });
    } catch (err) {
      console.error(err);
    }
  },

  createNpc: async (campaignId, payload) => {
    try {
      const data = await api.post(`/api/v1/gm/campaigns/${campaignId}/npcs`, payload);
      set((state) => ({ npcs: [data.npc, ...state.npcs] }));
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  fetchLocations: async (campaignId) => {
    try {
      const data = await api.get(`/api/v1/gm/campaigns/${campaignId}/locations?tree=true`);
      set({ locations: data.locations || [] });
    } catch (err) {
      console.error(err);
    }
  },

  fetchEncounters: async (campaignId) => {
    try {
      const data = await api.get(`/api/v1/gm/campaigns/${campaignId}/encounters`);
      set({ encounters: data.encounters || data });
    } catch (err) {
      console.error(err);
    }
  },

  createEncounter: async (campaignId, payload) => {
    try {
      const data = await api.post(`/api/v1/gm/campaigns/${campaignId}/encounters`, payload);
      set((state) => ({ encounters: [data.encounter, ...state.encounters] }));
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  updateEncounter: async (campaignId, encounterId, payload) => {
    try {
      const data = await api.put(`/api/v1/gm/campaigns/${campaignId}/encounters/${encounterId}`, payload);
      get().fetchEncounters(campaignId);
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  fetchCities: async (campaignId) => {
    try {
      const data = await api.get(`/api/v1/gm/campaigns/${campaignId}/cities`);
      set({ cities: data.cities || data || [] });
    } catch (err) {
      console.error(err);
    }
  },

  adjustCityParam: async (campaignId, cityId, payload) => {
    try {
      await api.post(`/api/v1/gm/campaigns/${campaignId}/cities/${cityId}/adjust`, payload);
      get().fetchCities(campaignId); // refresh
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  fetchQuests: async (campaignId) => {
    try {
      const data = await api.get(`/api/v1/gm/campaigns/${campaignId}/quests`);
      set({ quests: data.quests || [] });
    } catch (err) {
      console.error(err);
    }
  },

  createQuest: async (campaignId, payload) => {
    try {
      const data = await api.post(`/api/v1/gm/campaigns/${campaignId}/quests`, payload);
      set((state) => ({ quests: [data.quest, ...state.quests] }));
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  updateQuest: async (campaignId, questId, payload) => {
    try {
      const data = await api.put(`/api/v1/gm/campaigns/${campaignId}/quests/${questId}`, payload);
      get().fetchQuests(campaignId);
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  deleteQuest: async (campaignId, questId) => {
    try {
      await api.delete(`/api/v1/gm/campaigns/${campaignId}/quests/${questId}`);
      get().fetchQuests(campaignId);
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  duplicateQuest: async (campaignId, questId) => {
    try {
      const data = await api.post(`/api/v1/gm/campaigns/${campaignId}/quests/${questId}/duplicate`);
      get().fetchQuests(campaignId);
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  resolveQuest: async (campaignId, questId, payload) => {
    try {
      const data = await api.post(`/api/v1/gm/campaigns/${campaignId}/quests/${questId}/resolve`, payload);
      // Reload quests and cities to reflect changes
      get().fetchQuests(campaignId);
      get().fetchCities(campaignId);
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  fetchQuestDetail: async (campaignId, questId) => {
    try {
      const data = await api.get(`/api/v1/gm/campaigns/${campaignId}/quests/${questId}`);
      return data.quest;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  createQuestNode: async (campaignId, questId, payload) => {
    try {
      const data = await api.post(`/api/v1/gm/campaigns/${campaignId}/quests/${questId}/nodes`, payload);
      return data.node;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  updateQuestNode: async (campaignId, questId, nodeId, payload) => {
    try {
      const data = await api.put(`/api/v1/gm/campaigns/${campaignId}/quests/${questId}/nodes/${nodeId}`, payload);
      return data.node;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  deleteQuestNode: async (campaignId, questId, nodeId) => {
    try {
      await api.delete(`/api/v1/gm/campaigns/${campaignId}/quests/${questId}/nodes/${nodeId}`);
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  createQuestNodeConnection: async (campaignId, questId, nodeId, payload) => {
    try {
      const data = await api.post(`/api/v1/gm/campaigns/${campaignId}/quests/${questId}/nodes/${nodeId}/connections`, payload);
      return data.connection;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  updateQuestNodeConnection: async (campaignId, questId, nodeId, connId, payload) => {
    try {
      const data = await api.put(`/api/v1/gm/campaigns/${campaignId}/quests/${questId}/nodes/${nodeId}/connections/${connId}`, payload);
      return data.connection;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  deleteQuestNodeConnection: async (campaignId, questId, nodeId, connId) => {
    try {
      await api.delete(`/api/v1/gm/campaigns/${campaignId}/quests/${questId}/nodes/${nodeId}/connections/${connId}`);
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  reachQuestNode: async (campaignId, questId, nodeId) => {
    try {
      const data = await api.post(`/api/v1/gm/campaigns/${campaignId}/quests/${questId}/nodes/${nodeId}/reach`);
      get().fetchQuests(campaignId); // refresh quest status if ended
      return data.node;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  startNodeTimer: async (campaignId, questId, nodeId) => {
    try {
      await api.post(`/api/v1/gm/campaigns/${campaignId}/quests/${questId}/nodes/${nodeId}/start-timer`);
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  unreachQuestNode: async (campaignId, questId, nodeId) => {
    try {
      const data = await api.post(`/api/v1/gm/campaigns/${campaignId}/quests/${questId}/nodes/${nodeId}/unreach`);
      return data.node;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  fetchItems: async (campaignId) => {
    try {
      const data = await api.get(`/api/v1/gm/campaigns/${campaignId}/items`);
      set({ items: data.items || [] });
    } catch (err) {
      console.error(err);
    }
  },

  createItem: async (campaignId, payload) => {
    try {
      const data = await api.post(`/api/v1/gm/campaigns/${campaignId}/items`, payload);
      set((state) => ({ items: [data.item, ...state.items] }));
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  fetchTags: async (campaignId) => {
    try {
      const data = await api.get(`/api/v1/gm/campaigns/${campaignId}/tags`);
      set({ tags: data.tags || [] });
    } catch (err) {
      console.error(err);
    }
  },

  createTag: async (campaignId, payload) => {
    try {
      const data = await api.post(`/api/v1/gm/campaigns/${campaignId}/tags`, payload);
      set((state) => ({ tags: [...state.tags, data.tag].sort((a,b) => a.name.localeCompare(b.name)) }));
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  deleteTag: async (campaignId, tagId) => {
    try {
      await api.delete(`/api/v1/gm/campaigns/${campaignId}/tags/${tagId}`);
      set((state) => ({ tags: state.tags.filter(t => t.id !== tagId) }));
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}));
