import { create } from 'zustand';
import api from '../utils/api';

// ─── Persistance de l'état de séance ────────────────────────────────────────
// La réserve de Menace, les complications et les cartes personnalisées vivaient
// dans le localStorage du navigateur du MJ. Elles sont désormais persistées côté
// serveur : elles survivent à un rafraîchissement, suivent le MJ d'un appareil à
// l'autre, et deviennent exploitables par le récapitulatif de séance.
//
// Les écritures sont regroupées : cliquer cinq fois sur « +1 Menace » puis jouer
// une carte ne doit produire qu'une seule requête, et surtout ne doit pas perdre
// les modifications intermédiaires.
const pendingState = { campaignId: null, patch: {}, timer: null };

async function flushStatePersist() {
  const campaignId = pendingState.campaignId;
  const patch = pendingState.patch;
  pendingState.timer = null;
  pendingState.patch = {};
  pendingState.campaignId = null;

  if (!campaignId || Object.keys(patch).length === 0) return;

  try {
    await api.patch(`/api/v1/gm/campaigns/${campaignId}/state`, patch);
  } catch (err) {
    console.error('Persist campaign state error:', err);
  }
}

function scheduleStatePersist(campaignId, patch) {
  if (!campaignId) return;

  // Changement de campagne : on vide ce qui était en attente pour l'ancienne.
  if (pendingState.campaignId && pendingState.campaignId !== campaignId) {
    flushStatePersist();
  }

  if (pendingState.campaignId !== campaignId) {
    pendingState.campaignId = campaignId;
    pendingState.patch = {};
  }

  pendingState.patch = { ...pendingState.patch, ...patch };

  if (pendingState.timer) clearTimeout(pendingState.timer);
  pendingState.timer = setTimeout(flushStatePersist, 400);
}

// ─── Reprise de l'ancien état local ─────────────────────────────────────────
// Au premier chargement après cette migration, le serveur renvoie encore ses
// valeurs par défaut alors que le localStorage contient peut-être la Menace
// accumulée par le MJ. On la remonte une fois, puis on efface la clé locale.
function readLegacyLocalState(campaignId) {
  try {
    const doom = localStorage.getItem(`gm_doom_${campaignId}`);
    const comps = localStorage.getItem(`gm_comps_${campaignId}`);
    const cards = localStorage.getItem(`gm_custom_hazard_${campaignId}`);
    if (doom === null && !comps && !cards) return null;

    return {
      doomPool: doom !== null ? (parseInt(doom, 10) || 0) : 3,
      complications: comps ? JSON.parse(comps) : [],
      customCards: cards ? JSON.parse(cards) : [],
    };
  } catch (e) {
    console.error('Error reading legacy local state', e);
    return null;
  }
}

function clearLegacyLocalState(campaignId) {
  try {
    localStorage.removeItem(`gm_doom_${campaignId}`);
    localStorage.removeItem(`gm_comps_${campaignId}`);
    localStorage.removeItem(`gm_custom_hazard_${campaignId}`);
  } catch (e) {
    /* stockage indisponible, sans conséquence */
  }
}

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
  wormClock: 0,
  isCampaignStateLoaded: false,

  setActiveCampaign: (id) => {
    set({ activeCampaignId: id, isCampaignStateLoaded: false });
    if (id) {
      get().fetchCampaignState(id);
    }
  },

  fetchCampaignState: async (campaignId) => {
    try {
      const data = await api.get(`/api/v1/gm/campaigns/${campaignId}/state`);
      const state = data.state || {};

      const serverIsPristine =
        (state.doomPool === 3 || state.doomPool === undefined) &&
        (state.complications || []).length === 0 &&
        (state.customCards || []).length === 0;

      const legacy = serverIsPristine ? readLegacyLocalState(campaignId) : null;

      if (legacy) {
        // Première ouverture après la migration : l'état local est plus riche
        // que celui du serveur, on le remonte.
        set({
          doomPool: legacy.doomPool,
          activeComplications: legacy.complications,
          customHazardCards: legacy.customCards,
          isCampaignStateLoaded: true,
        });
        clearLegacyLocalState(campaignId);
        scheduleStatePersist(campaignId, legacy);
        return;
      }

      set({
        doomPool: state.doomPool ?? 3,
        activeComplications: state.complications || [],
        customHazardCards: state.customCards || [],
        wormClock: state.wormClock ?? 0,
        isCampaignStateLoaded: true,
      });
    } catch (err) {
      // Le MJ doit pouvoir mener sa séance même si le chargement échoue : on
      // garde les valeurs par défaut plutôt que de bloquer l'interface.
      console.error('Fetch campaign state error:', err);
      set({ isCampaignStateLoaded: true });
    }
  },

  fetchCampaigns: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.get('/api/v1/gm/campaigns');
      const campaignsList = data.campaigns || data || [];
      set({ campaigns: campaignsList, isLoading: false });
      if (campaignsList.length > 0 && !get().activeCampaignId) {
        // Passe par setActiveCampaign pour que l'état de séance soit chargé :
        // un simple set() laissait le tiroir de decks sur ses valeurs par défaut.
        get().setActiveCampaign(campaignsList[0].id);
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

  // Note: a second `deleteQuest` used to be defined here, shadowing the one above.
  // It removed the quest from the local list only, leaving the server response
  // (node counts, related entities) unreflected. The surviving definition above
  // refetches the list instead.

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
    scheduleStatePersist(cid, { doomPool: newVal });
  },

  incrementDoomPool: (delta) => {
    const cid = get().activeCampaignId;
    const newVal = Math.max(0, get().doomPool + delta);
    set({ doomPool: newVal });
    scheduleStatePersist(cid, { doomPool: newVal });
  },

  spendDoomPool: (amount) => {
    const cid = get().activeCampaignId;
    const current = get().doomPool;
    if (current < amount) return false;
    const newVal = current - amount;
    set({ doomPool: newVal });
    scheduleStatePersist(cid, { doomPool: newVal });
    return true;
  },

  setWormClock: (value) => {
    const cid = get().activeCampaignId;
    const newVal = Math.max(0, value);
    set({ wormClock: newVal });
    scheduleStatePersist(cid, { wormClock: newVal });
  },

  addActiveComplication: (card) => {
    const cid = get().activeCampaignId;
    const item = {
      ...card,
      uid: 'comp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      activatedAt: Date.now()
    };
    const next = [item, ...get().activeComplications];
    set({ activeComplications: next });
    scheduleStatePersist(cid, { complications: next });
    return item;
  },

  dismissActiveComplication: (uid) => {
    const cid = get().activeCampaignId;
    const next = get().activeComplications.filter(c => c.uid !== uid);
    set({ activeComplications: next });
    scheduleStatePersist(cid, { complications: next });
  },

  addCustomHazardCard: (card) => {
    const cid = get().activeCampaignId;
    const newCard = {
      ...card,
      id: 'custom_hz_' + Date.now(),
      isCustom: true
    };
    const next = [newCard, ...get().customHazardCards];
    set({ customHazardCards: next });
    scheduleStatePersist(cid, { customCards: next });
    return newCard;
  }
}));
