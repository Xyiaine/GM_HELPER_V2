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
  bestiary: [],
  vehicles: [],
  activeEncounter: null,
  items: [],
  tags: [],
  isLoading: false,
  error: null,

  // Doom Pool & MJ Deck System
  doomPool: 3,
  isDeckDrawerOpen: false,
  activeDeckTab: 'hazard',
  activeComplications: [],
  customHazardCards: [],

  setActiveCampaign: (id) => {
    set({ activeCampaignId: id });
    if (id) {
      try {
        const savedDoom = localStorage.getItem(`gm_doom_${id}`);
        if (savedDoom !== null) {
          set({ doomPool: parseInt(savedDoom, 10) || 0 });
        }
        const savedComps = localStorage.getItem(`gm_comps_${id}`);
        if (savedComps) {
          set({ activeComplications: JSON.parse(savedComps) });
        }
        const savedCustomCards = localStorage.getItem(`gm_custom_hazard_${id}`);
        if (savedCustomCards) {
          set({ customHazardCards: JSON.parse(savedCustomCards) });
        }
      } catch (e) {
        console.error('Error loading doom pool from storage', e);
      }
    }
  },

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

  updateCampaign: async (campaignId, payload) => {
    try {
      const data = await api.put(`/api/v1/gm/campaigns/${campaignId}`, payload);
      set((state) => ({
        campaigns: state.campaigns.map(c => c.id === campaignId ? { ...c, ...data.campaign } : c)
      }));
      return data;
    } catch (err) {
      console.error('Update campaign error:', err);
      throw err;
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
      if (get().activeEncounter?.id === encounterId) {
        set({ activeEncounter: data.encounter });
      }
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  fetchEncounterDetail: async (campaignId, encounterId) => {
    try {
      const data = await api.get(`/api/v1/gm/campaigns/${campaignId}/encounters/${encounterId}`);
      set({ activeEncounter: data.encounter });
      return data.encounter;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  syncPcsInEncounter: async (campaignId, encounterId) => {
    try {
      const data = await api.post(`/api/v1/gm/campaigns/${campaignId}/encounters/${encounterId}/sync-pcs`);
      set({ activeEncounter: data.encounter });
      get().fetchEncounters(campaignId);
      return data.encounter;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  resetEncounter: async (campaignId, encounterId) => {
    try {
      try {
        const data = await api.post(`/api/v1/gm/campaigns/${campaignId}/encounters/${encounterId}/reset`);
        set({ activeEncounter: data.encounter });
        get().fetchEncounters(campaignId);
        return data.encounter;
      } catch (err) {
        console.warn('Reset endpoint fallback engaged:', err);
        const encData = await api.put(`/api/v1/gm/campaigns/${campaignId}/encounters/${encounterId}`, {
          status: 'planned',
          phase: 'planned',
          currentRound: 0,
          currentTurnIndex: 0,
        });
        const currentEncounter = encData.encounter || get().activeEncounter;
        if (currentEncounter && currentEncounter.combatants) {
          for (const c of currentEncounter.combatants) {
            try {
              await api.patch(`/api/v1/gm/campaigns/${campaignId}/encounters/${encounterId}/combatants/${c.id}`, {
                hpCurrent: c.hpMax,
                initiative: 0,
                isSurprised: false,
                conditions: '[]',
              });
            } catch (e) {
              console.error('Failed to reset combatant in fallback:', e);
            }
          }
        }
        return await get().fetchEncounterDetail(campaignId, encounterId);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  addCombatantsBulk: async (campaignId, encounterId, combatants) => {
    try {
      const data = await api.post(`/api/v1/gm/campaigns/${campaignId}/encounters/${encounterId}/combatants/bulk`, { combatants });
      set({ activeEncounter: data.encounter });
      get().fetchEncounters(campaignId);
      return data.encounter;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  updateCombatantInCombat: async (campaignId, encounterId, combatantId, payload) => {
    try {
      const data = await api.patch(`/api/v1/gm/campaigns/${campaignId}/encounters/${encounterId}/combatants/${combatantId}`, payload);
      set({ activeEncounter: data.encounter });
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  removeCombatantInCombat: async (campaignId, encounterId, combatantId) => {
    try {
      const data = await api.delete(`/api/v1/gm/campaigns/${campaignId}/encounters/${encounterId}/combatants/${combatantId}`);
      set({ activeEncounter: data.encounter });
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  startSurpriseCheck: async (campaignId, encounterId) => {
    try {
      const data = await api.post(`/api/v1/gm/campaigns/${campaignId}/encounters/${encounterId}/start-surprise-check`);
      set({ activeEncounter: data.encounter });
      get().fetchEncounters(campaignId);
      return data.encounter;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  startInitiativeEntry: async (campaignId, encounterId) => {
    try {
      const data = await api.post(`/api/v1/gm/campaigns/${campaignId}/encounters/${encounterId}/start-initiative-entry`);
      set({ activeEncounter: data.encounter });
      get().fetchEncounters(campaignId);
      return data.encounter;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  startCombat: async (campaignId, encounterId) => {
    try {
      const data = await api.post(`/api/v1/gm/campaigns/${campaignId}/encounters/${encounterId}/start-combat`);
      set({ activeEncounter: data.encounter });
      get().fetchEncounters(campaignId);
      return data.encounter;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  nextTurnInCombat: async (campaignId, encounterId) => {
    try {
      const data = await api.post(`/api/v1/gm/campaigns/${campaignId}/encounters/${encounterId}/next-turn`);
      set({ activeEncounter: data.encounter });
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  endCombat: async (campaignId, encounterId) => {
    try {
      const data = await api.post(`/api/v1/gm/campaigns/${campaignId}/encounters/${encounterId}/end-combat`);
      set({ activeEncounter: data.encounter });
      get().fetchEncounters(campaignId);
      return data.encounter;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  spawnEncounterFromNode: async (campaignId, questId, nodeId) => {
    try {
      const data = await api.post(`/api/v1/gm/quests/${questId}/nodes/${nodeId}/spawn-encounter`);
      get().fetchEncounters(campaignId);
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // --- BESTIARY ACTIONS ---
  fetchBestiary: async (campaignId, queryParams = {}) => {
    try {
      const searchParams = new URLSearchParams(queryParams).toString();
      const url = `/api/v1/gm/campaigns/${campaignId}/bestiary${searchParams ? `?${searchParams}` : ''}`;
      const data = await api.get(url);
      set({ bestiary: data.bestiary || [] });
    } catch (err) {
      console.error('Fetch bestiary error:', err);
    }
  },

  createBestiaryEntry: async (campaignId, payload) => {
    try {
      const data = await api.post(`/api/v1/gm/campaigns/${campaignId}/bestiary`, payload);
      set(state => ({ bestiary: [data.entry, ...state.bestiary] }));
      return data.entry;
    } catch (err) {
      console.error('Create bestiary entry error:', err);
      throw err;
    }
  },

  updateBestiaryEntry: async (campaignId, id, payload) => {
    try {
      const data = await api.patch(`/api/v1/gm/campaigns/${campaignId}/bestiary/${id}`, payload);
      set(state => ({
        bestiary: state.bestiary.map(b => (b.id === id ? data.entry : b)),
      }));
      return data.entry;
    } catch (err) {
      console.error('Update bestiary entry error:', err);
      throw err;
    }
  },

  deleteBestiaryEntry: async (campaignId, id) => {
    try {
      await api.delete(`/api/v1/gm/campaigns/${campaignId}/bestiary/${id}`);
      set(state => ({
        bestiary: state.bestiary.filter(b => b.id !== id),
      }));
    } catch (err) {
      console.error('Delete bestiary entry error:', err);
      throw err;
    }
  },

  fetchVehicles: async (campaignId) => {
    try {
      const data = await api.get(`/api/v1/gm/campaigns/${campaignId}/vehicles`);
      set({ vehicles: data.vehicles || [] });
    } catch (err) {
      console.error('Fetch vehicles error:', err);
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

  deleteQuest: async (campaignId, questId) => {
    try {
      await api.delete(`/api/v1/gm/campaigns/${campaignId}/quests/${questId}`);
      set((state) => ({
        quests: state.quests.filter(q => q.id !== questId)
      }));
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

  // === THREAT TRACKER ===
  advanceThreat: async (campaignId, questId, threatId, direction = 'increment') => {
    try {
      const data = await api.post(
        `/api/v1/gm/campaigns/${campaignId}/quests/${questId}/threats/${threatId}/advance`,
        { direction }
      );
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  updateThreat: async (campaignId, questId, threatId, payload) => {
    try {
      const data = await api.put(
        `/api/v1/gm/campaigns/${campaignId}/quests/${questId}/threats/${threatId}`,
        payload
      );
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // === FACTION PROGRESS ===
  updateFaction: async (campaignId, questId, factionId, payload) => {
    try {
      const data = await api.patch(
        `/api/v1/gm/campaigns/${campaignId}/quests/${questId}/factions/${factionId}`,
        payload
      );
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // === RANDOM EVENT DRAW ===
  drawRandomEvent: async (campaignId, questId) => {
    try {
      const data = await api.post(
        `/api/v1/gm/campaigns/${campaignId}/quests/${questId}/draw-event`
      );
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // === MECHANIC NOTES ===
  updateMechanicNotes: async (campaignId, questId, payload) => {
    try {
      const data = await api.put(
        `/api/v1/gm/campaigns/${campaignId}/quests/${questId}/mechanic-notes`,
        payload
      );
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // === ARCHITECTURE REVIEW ACTIONS ===
  instantiateQuest: async (campaignId, questId) => {
    try {
      const data = await api.post(`/api/v1/gm/campaigns/${campaignId}/quests/${questId}/instantiate`);
      if (data.quest) {
        set((state) => ({ quests: [data.quest, ...state.quests] }));
      }
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  resetQuestInstance: async (campaignId, questId) => {
    try {
      const data = await api.post(`/api/v1/gm/campaigns/${campaignId}/quests/${questId}/reset-instance`);
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  evaluateQuestConditions: async (campaignId, questId, payload = {}) => {
    try {
      const data = await api.post(`/api/v1/gm/campaigns/${campaignId}/quests/${questId}/evaluate-conditions`, payload);
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  drawScenePool: async (campaignId, questId) => {
    try {
      const data = await api.post(`/api/v1/gm/campaigns/${campaignId}/quests/${questId}/scene-pool/draw`);
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  auditQuestIntegrity: async (campaignId, questId) => {
    try {
      const data = await api.get(`/api/v1/gm/campaigns/${campaignId}/quests/${questId}/audit-integrity`);
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  convertRules: async (campaignId, questId, text, targetSystem = 'dnd5e') => {
    try {
      const data = await api.post(`/api/v1/gm/campaigns/${campaignId}/quests/${questId}/convert-rules`, { text, targetSystem });
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  unlockSkill: async (campaignId, characterId, nodeId, treeId) => {
    try {
      const data = await api.post(`/api/v1/gm/campaigns/${campaignId}/skill-trees/characters/${characterId}/unlock`, { nodeId, treeId });
      if (data.character) {
        set((state) => ({
          characters: state.characters.map(c => c.id === characterId ? data.character : c)
        }));
      }
      return data;
    } catch (err) {
      console.error(err);
      throw err;
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
  },

  // ─── DOOM POOL & MJ DECK ACTIONS ───────────────────────────
  toggleDeckDrawer: (force) => {
    set((state) => ({
      isDeckDrawerOpen: typeof force === 'boolean' ? force : !state.isDeckDrawerOpen
    }));
  },

  setActiveDeckTab: (tab) => {
    set({ activeDeckTab: tab });
  },

  setDoomPool: (val) => {
    const cid = get().activeCampaignId;
    const newVal = Math.max(0, val);
    set({ doomPool: newVal });
    if (cid) {
      try { localStorage.setItem(`gm_doom_${cid}`, String(newVal)); } catch (e) {}
    }
  },

  incrementDoomPool: (delta) => {
    const cid = get().activeCampaignId;
    set((state) => {
      const newVal = Math.max(0, state.doomPool + delta);
      if (cid) {
        try { localStorage.setItem(`gm_doom_${cid}`, String(newVal)); } catch (e) {}
      }
      return { doomPool: newVal };
    });
  },

  spendDoomPool: (amount) => {
    const cid = get().activeCampaignId;
    const current = get().doomPool;
    if (current < amount) return false;
    const newVal = current - amount;
    set({ doomPool: newVal });
    if (cid) {
      try { localStorage.setItem(`gm_doom_${cid}`, String(newVal)); } catch (e) {}
    }
    return true;
  },

  addActiveComplication: (card) => {
    const cid = get().activeCampaignId;
    const item = {
      ...card,
      uid: 'comp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      activatedAt: Date.now()
    };
    set((state) => {
      const next = [item, ...state.activeComplications];
      if (cid) {
        try { localStorage.setItem(`gm_comps_${cid}`, JSON.stringify(next)); } catch (e) {}
      }
      return { activeComplications: next };
    });
    return item;
  },

  dismissActiveComplication: (uid) => {
    const cid = get().activeCampaignId;
    set((state) => {
      const next = state.activeComplications.filter(c => c.uid !== uid);
      if (cid) {
        try { localStorage.setItem(`gm_comps_${cid}`, JSON.stringify(next)); } catch (e) {}
      }
      return { activeComplications: next };
    });
  },

  addCustomHazardCard: (card) => {
    const cid = get().activeCampaignId;
    const newCard = {
      ...card,
      id: 'custom_hz_' + Date.now(),
      isCustom: true
    };
    set((state) => {
      const next = [newCard, ...state.customHazardCards];
      if (cid) {
        try { localStorage.setItem(`gm_custom_hazard_${cid}`, JSON.stringify(next)); } catch (e) {}
      }
      return { customHazardCards: next };
    });
    return newCard;
  }
}));
