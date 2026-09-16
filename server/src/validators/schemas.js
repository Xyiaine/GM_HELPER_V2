// GM Helper — Zod Validation Schemas
const { z } = require('zod');

// ============================================================
// AUTH
// ============================================================

const registerSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis').max(50),
  lastName: z.string().min(1, 'Le nom est requis').max(50),
  pseudo: z.string().min(1).max(50).optional(),
  displayName: z.string().min(1).max(50).optional(),
  email: z.string().email('Invalid email address').optional(),
  password: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().optional(),
  pseudo: z.string().optional(),
  password: z.string().optional(),
});

// ============================================================
// CAMPAIGNS
// ============================================================

const createCampaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required').max(100),
  description: z.string().max(5000).optional(),
  gameSystem: z.string().max(50).optional(),
  joinPassword: z.string().max(100).optional(),
});

const updateCampaignSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(5000).optional(),
  gameSystem: z.string().max(50).optional(),
  joinPassword: z.string().max(100).optional(),
});

const invitePlayerSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const joinCampaignSchema = z.object({
  campaignId: z.string().min(1, 'ID de la campagne requis'),
  password: z.string().min(1, 'Mot de passe requis'),
});

// ============================================================
// CHARACTERS
// ============================================================

const createCharacterSchema = z.object({
  name: z.string().min(1, 'Character name is required').max(100),
  ownerUserId: z.string().optional(),
  race: z.string().max(50).optional(),
  class: z.string().max(50).optional(),
  level: z.number().int().min(1).max(30).optional(),
  alignment: z.string().max(50).optional(),
  background: z.string().max(5000).optional(),
  strength: z.number().int().min(1).max(30).optional(),
  dexterity: z.number().int().min(1).max(30).optional(),
  constitution: z.number().int().min(1).max(30).optional(),
  intelligence: z.number().int().min(1).max(30).optional(),
  wisdom: z.number().int().min(1).max(30).optional(),
  charisma: z.number().int().min(1).max(30).optional(),
  hpCurrent: z.number().int().min(0).optional(),
  hpMax: z.number().int().min(1).optional(),
  temporaryHp: z.number().int().min(0).optional(),
  armorClass: z.number().int().min(0).optional(),
  speed: z.number().int().min(0).optional(),
  initiative: z.number().int().optional(),
  hitDice: z.string().optional(),
  deathSaves: z.string().optional(),
  heroicInspiration: z.boolean().optional(),
  proficiencyBonus: z.number().int().min(1).max(10).optional(),
  skills: z.string().optional(),       // JSON string
  savingThrows: z.string().optional(),  // JSON string
  traits: z.string().optional(),
  skillPoints: z.number().int().min(0).optional(),
  unlockedSkills: z.string().optional(),
  notes: z.string().max(10000).optional(),
  gmNotes: z.string().max(10000).optional(),
  portraitUrl: z.string().optional(),
  currency: z.string().optional(),
  attacks: z.string().optional(),
  canBeEditedByPlayer: z.boolean().optional(),
});

const updateCharacterSchema = createCharacterSchema.partial();

// Player character update — more restricted
const playerUpdateCharacterSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  race: z.string().max(50).optional(),
  alignment: z.string().max(50).optional(),
  background: z.string().max(5000).optional(),
  hpCurrent: z.number().int().min(0).optional(),
  hpMax: z.number().int().min(1).optional(),
  temporaryHp: z.number().int().min(0).optional(),
  armorClass: z.number().int().min(0).optional(),
  speed: z.number().int().min(0).optional(),
  initiative: z.number().int().optional(),
  hitDice: z.string().optional(),
  deathSaves: z.string().optional(),
  heroicInspiration: z.boolean().optional(),
  level: z.number().int().min(1).max(30).optional(),
  strength: z.number().int().min(1).max(30).optional(),
  dexterity: z.number().int().min(1).max(30).optional(),
  constitution: z.number().int().min(1).max(30).optional(),
  intelligence: z.number().int().min(1).max(30).optional(),
  wisdom: z.number().int().min(1).max(30).optional(),
  charisma: z.number().int().min(1).max(30).optional(),
  skills: z.string().optional(),
  savingThrows: z.string().optional(),
  traits: z.string().optional(),
  skillPoints: z.number().int().min(0).optional(),
  unlockedSkills: z.string().optional(),
  notes: z.string().max(10000).optional(),
  currency: z.string().optional(),
  attacks: z.string().optional(),
  portraitUrl: z.string().optional(),
});

// ============================================================
// NPCs
// ============================================================

const createNpcSchema = z.object({
  name: z.string().min(1, 'NPC name is required').max(100),
  race: z.string().max(50).optional(),
  role: z.string().max(100).optional(),
  personality: z.string().max(5000).optional(),
  description: z.string().max(5000).optional(),
  locationId: z.string().nullable().optional(),
  stats: z.string().optional(),
  armorClass: z.number().int().min(0).nullable().optional(),
  hpMax: z.number().int().min(1).nullable().optional(),
  hpCurrent: z.number().int().min(0).nullable().optional(),
  speed: z.string().max(50).optional(),
  bestiaryId: z.string().nullable().optional(),
  portraitUrl: z.string().optional(),
  gmNotes: z.string().max(10000).optional(),
  isFavorite: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

const updateNpcSchema = createNpcSchema.partial();

// ============================================================
// LOCATIONS
// ============================================================

const createLocationSchema = z.object({
  name: z.string().min(1, 'Location name is required').max(100),
  parentLocationId: z.string().nullable().optional(),
  type: z.enum(['continent', 'region', 'city', 'City-State', 'district', 'building', 'room', 'Point of Interest']),
  description: z.string().max(10000).optional(),
  climate: z.string().max(200).optional(),
  population: z.string().max(200).optional(),
  government: z.string().max(200).optional(),
  notableFeatures: z.string().max(5000).optional(),
});

const updateLocationSchema = createLocationSchema.partial();

// ============================================================
// CITIES
// ============================================================

const createCitySchema = z.object({
  locationId: z.string(),
  health: z.number().int().min(0).max(100).optional(),
  wealth: z.number().int().min(0).max(100).optional(),
  technology: z.number().int().min(0).max(100).optional(),
  food: z.number().int().min(0).max(100).optional(),
  happiness: z.number().int().min(0).max(100).optional(),
  armament: z.number().int().min(0).max(100).optional(),
  fuel: z.number().int().min(0).max(100).optional(),
  customParameters: z.string().optional(),
  specialty: z.string().max(500).optional(),
  strength: z.string().max(500).optional(),
  weakness: z.string().max(500).optional(),
  peculiarity: z.string().max(500).optional(),
});

const updateCitySchema = createCitySchema.omit({ locationId: true }).partial();

const adjustCityParamSchema = z.object({
  parameter: z.enum(['health', 'wealth', 'technology', 'food', 'happiness', 'armament', 'fuel']),
  value: z.number().int(),
  cause: z.string().min(1, 'Cause is required').max(500),
});

// ============================================================
// QUESTS
// ============================================================

const createQuestSchema = z.object({
  name: z.string().min(1, 'Quest name is required').max(200),
  description: z.string().max(10000).optional(),
  type: z.enum(['main', 'secondary', 'faction', 'personal', 'principale']).optional(),
  difficulty: z.string().max(50).optional(),
  level: z.number().int().min(1).max(30).optional(),
  duration: z.string().max(100).optional(),
  visibility: z.enum(['secret', 'known', 'partial']).optional(),
  playerSummary: z.string().max(10000).optional(),
  gmNotes: z.string().max(50000).optional(),
  gmSecrets: z.string().max(50000).optional(),
  gmChangelog: z.string().max(50000).optional(),
  isTemplate: z.boolean().optional(),
  templateQuestId: z.string().optional(),
  questGiverNpcId: z.string().optional(),
  xpReward: z.number().int().min(0).optional(),
  goldReward: z.number().int().min(0).optional(),
  itemRewards: z.string().optional(),
  status: z.enum(['not_started', 'active', 'paused', 'completed', 'failed', 'abandoned']).optional(),
});

const updateQuestSchema = createQuestSchema.partial();

const createQuestObjectiveSchema = z.object({
  description: z.string().min(1).max(1000),
  orderIndex: z.number().int().min(0).optional(),
  isHidden: z.boolean().optional(),
  isOptional: z.boolean().optional(),
  status: z.enum(['pending', 'completed', 'failed']).optional(),
  notes: z.string().max(5000).optional(),
  investigationLeads: z.string().optional(),
  unlockedByNodeId: z.string().optional(),
});

const createQuestCityImpactSchema = z.object({
  outcome: z.string().min(1).max(200),
  cityId: z.string(),
  parameter: z.enum(['health', 'wealth', 'technology', 'food', 'happiness', 'armament', 'fuel']),
  modifier: z.number().int(),
});

const createQuestNpcLinkSchema = z.object({
  npcId: z.string(),
  role: z.string().max(200),
});

const createQuestLocationLinkSchema = z.object({
  locationId: z.string(),
  role: z.string().max(200).optional(),
});

const createQuestItemLinkSchema = z.object({
  itemId: z.string(),
});

const createQuestDependencySchema = z.object({
  dependsOnQuestId: z.string(),
  type: z.enum(['prerequisite', 'trigger']).optional(),
});

const resolveQuestSchema = z.object({
  outcome: z.string().min(1, 'Outcome is required'),
  status: z.enum(['completed', 'failed']),
});

const createQuestNodeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  mjDescription: z.string().max(50000).optional(),
  sensoryText: z.string().max(50000).optional(),
  nodeType: z.enum(['start', 'intermediate', 'convergence', 'end']).optional(),
  endOutcome: z.enum(['success', 'failure', 'abandoned']).nullable().optional(),
  isTimed: z.boolean().optional(),
  timerDurationSeconds: z.number().int().min(1).nullable().optional(),
  timerVisibleToPlayers: z.boolean().optional(),
  timeoutNodeId: z.string().nullable().optional(),
  linkedNpcId: z.string().nullable().optional(),
  linkedLocationId: z.string().nullable().optional(),
  linkedEncounterId: z.string().nullable().optional(),
  // Illustration projetée sur l'écran de table quand ce nœud est la scène courante.
  imageUrl: z.string().max(2000).nullable().optional(),
  combatTemplate: z.string().nullable().optional(),
  positionX: z.number().optional(),
  positionY: z.number().optional(),
  detectionMechanic: z.string().nullable().optional(),
  pathGroup: z.string().max(200).nullable().optional(),
  displayCode: z.string().max(50).nullable().optional(),
  isOptional: z.boolean().optional(),
  pacingTag: z.string().max(100).nullable().optional(),
  requiredSkillCategory: z.string().max(100).nullable().optional(),
  sensoryVisual: z.string().max(50000).nullable().optional(),
  sensorySound: z.string().max(50000).nullable().optional(),
  sensorySmell: z.string().max(50000).nullable().optional(),
  isStrategicChoice: z.boolean().optional(),
  routeChoiceOptions: z.string().optional(),
  poolNotes: z.string().max(50000).optional(),
  generativeFailure: z.string().optional(),
  captainSelection: z.string().optional(),
  resolutionBranches: z.string().optional(),
});

const updateQuestNodeSchema = createQuestNodeSchema.partial().extend({
  status: z.enum(['not_reached', 'reached']).optional(),
});

const createQuestNodeConnectionSchema = z.object({
  fromNodeId: z.string(),
  toNodeId: z.string(),
  label: z.string().max(500).nullable().optional(),
  isTimeoutConnection: z.boolean().optional(),
  condition: z.string().max(1000).nullable().optional(),
});

const updateQuestNodeConnectionSchema = createQuestNodeConnectionSchema.partial();

const createQuestThreatSchema = z.object({
  name: z.string().min(1).max(200),
  currentLevel: z.number().int().min(0).optional(),
  maxLevel: z.number().int().min(1).optional(),
  stateLabel: z.string().max(100).optional().default('dormant'),
  description: z.string().max(5000).optional(),
  thresholds: z.string().optional(),
  directApparitionBudget: z.string().optional(),
});

const updateQuestThreatSchema = createQuestThreatSchema.partial();

const createQuestFactionProgressSchema = z.object({
  factionName: z.string().min(1).max(200),
  progressValue: z.number().int().min(0).max(100).optional(),
  lastUpdatedNodeId: z.string().nullable().optional(),
  relationshipState: z.string().max(100).nullable().optional(),
  relationshipUpdateNodeIds: z.string().nullable().optional(),
  relationshipNotes: z.string().max(5000).nullable().optional(),
  notes: z.string().max(5000).nullable().optional(),
});

const updateQuestFactionProgressSchema = createQuestFactionProgressSchema.partial();

const updateQuestCharacterStateSchema = z.object({
  characterId: z.string(),
  stateKey: z.string().min(1).max(200),
  stateValue: z.string().max(5000),
});

const createQuestNPCProfileSchema = z.object({
  npcId: z.string().min(1).max(200),
  name: z.string().min(1).max(200),
  speechPattern: z.string().max(5000).optional(),
  physicalTic: z.string().max(5000).optional(),
  signatureBehavior: z.string().max(5000).optional(),
});

const updateQuestNPCProfileSchema = createQuestNPCProfileSchema.partial();

const updateQuestMechanicNotesSchema = z.object({
  scenePoolFramework: z.string().optional(),
  rivalConvoyEncounterFramework: z.string().optional(),
  generativeFailures: z.string().optional(),
  stakesBeforeRoll: z.string().optional(),
  sensoryPresentationVariety: z.string().optional(),
  tableCalibration: z.string().optional(),
  ruleSystemConversion: z.string().optional(),
  floatingEventDrawTable: z.string().optional(),
  postSessionDebrief: z.string().optional(),
  tableMusic: z.string().optional(),
});

const createQuestNodeRewardSchema = z.object({
  rewardType: z.string().min(1).max(100),
  rewardValue: z.string().min(1).max(5000),
  conditional: z.string().max(1000).optional(),
  payoffNodeId: z.string().optional(),
});

const createQuestNodeThreatEffectSchema = z.object({
  threatId: z.string(),
  effect: z.string().min(1).max(100),
  effectValue: z.number().int().optional(),
  condition: z.string().max(1000).optional(),
  notes: z.string().max(5000).optional(),
});

const unlockSkillSchema = z.object({
  treeId: z.string().min(1),
  nodeId: z.string().min(1),
});



// ============================================================
// BESTIARY
// ============================================================

const createBestiarySchema = z.object({
  name: z.string().min(1).max(200),
  category: z.enum(['humanoid', 'beast', 'undead', 'construct', 'aberration', 'other']).optional(),
  challengeRating: z.number().min(0).max(30).nullable().optional(),
  armorClass: z.number().int().min(0).optional(),
  hpMax: z.number().int().min(1).optional(),
  hpFormula: z.string().max(100).nullable().optional(),
  speed: z.string().max(100).nullable().optional(),
  stats: z.string().nullable().optional(),
  attacks: z.string().nullable().optional(),
  traits: z.string().nullable().optional(),
  savingThrows: z.string().nullable().optional(),
  description: z.string().max(5000).nullable().optional(),
  isFavorite: z.boolean().optional(),
});

const updateBestiarySchema = createBestiarySchema.partial();

// ============================================================
// ENCOUNTERS
// ============================================================

const createEncounterSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(5000).optional().nullable(),
  locationId: z.string().optional().nullable(),
  phase: z.enum(['planned', 'surprise_check', 'initiative_entry', 'active', 'completed']).optional(),
  surpriseEnabled: z.boolean().optional(),
  questNodeId: z.string().optional().nullable(),
});

const updateEncounterSchema = createEncounterSchema.partial().extend({
  status: z.enum(['planned', 'active', 'completed']).optional(),
  phase: z.enum(['planned', 'surprise_check', 'initiative_entry', 'active', 'completed']).optional(),
  surpriseEnabled: z.boolean().optional(),
  currentRound: z.number().int().min(0).optional(),
  currentTurnIndex: z.number().int().min(0).optional(),
  summary: z.string().optional().nullable(),
});

const createCombatantSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['character', 'npc', 'monster', 'vehicle']),
  sourceType: z.enum(['character', 'npc', 'bestiary', 'vehicle', 'manual']).optional(),
  sourceId: z.string().optional().nullable(),
  initiative: z.number().int().optional(),
  hpCurrent: z.number().int().min(0).optional(),
  hpMax: z.number().int().min(0).optional(),
  armorClass: z.number().int().min(0).optional(),
  conditions: z.string().optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
  characterId: z.string().optional().nullable(),
  npcId: z.string().optional().nullable(),
  bestiaryId: z.string().optional().nullable(),
  vehicleId: z.string().optional().nullable(),
  isSurprised: z.boolean().optional(),
  isVisibleToPlayers: z.boolean().optional(),
});

const updateCombatantSchema = createCombatantSchema.partial();

const bulkAddCombatantsSchema = z.object({
  combatants: z.array(z.object({
    sourceType: z.enum(['character', 'npc', 'bestiary', 'vehicle', 'manual']),
    sourceId: z.string().optional().nullable(),
    name: z.string().optional().nullable(),
    armorClass: z.number().int().optional().nullable(),
    hpMax: z.number().int().optional().nullable(),
    count: z.number().int().min(1).max(50).optional().default(1),
  })),
});

// ============================================================
// ITEMS
// ============================================================

const createItemSchema = z.object({
  name: z.string().min(1).max(200),
  type: z.string().max(50).optional(),
  rarity: z.enum(['common', 'uncommon', 'rare', 'very_rare', 'legendary']).optional(),
  description: z.string().max(5000).optional(),
  value: z.number().int().min(0).optional(),
  weight: z.number().min(0).optional(),
  properties: z.string().optional(),
});

const updateItemSchema = createItemSchema.partial();

// ============================================================
// NOTES
// ============================================================

const createNoteSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().max(50000).optional(),
  parentFolderId: z.string().nullable().optional(),
  isFolder: z.boolean().optional(),
  isPinned: z.boolean().optional(),
  visibleByPlayers: z.boolean().optional(),
});

const updateNoteSchema = createNoteSchema.partial();

// ============================================================
// TAGS
// ============================================================

const createTagSchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Color must be a valid hex color').optional(),
});

// ============================================================
// ENTITY LINKS
// ============================================================

const createEntityLinkSchema = z.object({
  sourceEntityType: z.string().min(1).max(50),
  sourceEntityId: z.string(),
  targetEntityType: z.string().min(1).max(50),
  targetEntityId: z.string(),
  relationType: z.string().max(100).optional(),
});

// ============================================================
// DICE
// ============================================================

const diceRollSchema = z.object({
  expression: z.string().min(1).max(100),
  label: z.string().max(200).optional(),
  visibleToAll: z.boolean().optional(),
  characterId: z.string().optional(),
});

const playerDiceRollSchema = z.object({
  type: z.enum(['ability_check', 'saving_throw', 'skill_check', 'attack', 'damage', 'initiative', 'free']),
  ability: z.string().optional(),    // "strength", "dexterity", etc.
  skill: z.string().optional(),      // "perception", "stealth", etc.
  expression: z.string().max(50).optional(),  // For free rolls only
  label: z.string().max(200).optional(),
  advantage: z.boolean().optional(),
  disadvantage: z.boolean().optional(),
  // A secret roll is kept between the GM and the player who rolled it. The
  // client already exposed the toggle, but the field was absent from the schema
  // so it was silently dropped and every roll ended up public.
  secret: z.boolean().optional(),
});

// ============================================================
// SESSIONS
// ============================================================

const createSessionSchema = z.object({
  summary: z.string().max(10000).optional(),
  mode: z.enum(['remote', 'in_person']).optional(),
  // Le client envoie `status: 'live'` pour démarrer directement une séance.
  // Le champ était absent du schéma : Zod le supprimait silencieusement, la
  // session restait au statut « planned » par défaut et ne passait donc jamais
  // en direct. L'écran de table et le mode joueur, qui exigent tous deux le
  // statut « live », étaient inaccessibles.
  status: z.enum(['planned', 'live', 'ended']).optional(),
});

const updateSessionSchema = z.object({
  status: z.enum(['planned', 'live', 'ended']).optional(),
  summary: z.string().max(10000).optional(),
  activeEncounterId: z.string().nullable().optional(),
  shareInitiative: z.boolean().optional(),
});

const createSpotlightSchema = z.object({
  contentType: z.enum(['image', 'map_zone', 'battle_map', 'banner']),
  imageUrl: z.string().optional(),
  mapAssetId: z.string().optional(),
  text: z.string().max(500).optional(),
});

// ============================================================
// WORLD MAP
// ============================================================

const updateWorldMapSchema = z.object({
  baseMapImageUrl: z.string().nullable().optional(),
  canvasState: z.string().nullable().optional(),
  zoom: z.number().min(0.1).max(10).optional(),
  panX: z.number().optional(),
  panY: z.number().optional(),
});

const updateCityMapPositionSchema = z.object({
  mapX: z.number(),
  mapY: z.number(),
});

const updateCityTerritorySchema = z.object({
  territoryData: z.string(), // JSON string of [{x, y}, ...]
});

const updateCityFactionColorSchema = z.object({
  factionColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color'),
});

// ============================================================
// CONVOYS
// ============================================================

const createConvoySchema = z.object({
  name: z.string().min(1, 'Convoy name is required').max(200),
  originCityId: z.string().min(1, 'Origin city is required'),
  destinationCityId: z.string().min(1, 'Destination city is required'),
  difficulty: z.number().int().min(0).max(100).optional().default(50),
  cargoType: z.enum(['resources', 'humans', 'mixed']),
  cargoDetails: z.string().optional(),
});

const updateConvoySchema = z.object({
  name: z.string().min(1).max(200).optional(),
  status: z.enum(['planning', 'in_progress', 'completed', 'failed', 'abandoned']).optional(),
  difficulty: z.number().int().min(0).max(100).optional(),
  currentStepIndex: z.number().int().min(-1).optional(),
  cargoType: z.enum(['resources', 'humans', 'mixed']).optional(),
  cargoDetails: z.string().optional(),
});

const createConvoyVehicleSchema = z.object({
  type: z.enum(['moto', 'car', 'truck']),
  name: z.string().min(1, 'Vehicle name is required').max(100),
  hpMax: z.number().int().min(1).max(1000).optional().default(100),
  passengers: z.string().optional(),
});

const updateConvoyVehicleSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  hpCurrent: z.number().int().min(0).optional(),
  hpMax: z.number().int().min(1).max(1000).optional(),
  passengers: z.string().optional(),
  isDestroyed: z.boolean().optional(),
});

const createConvoyEventSchema = z.object({
  orderIndex: z.number().int().min(0),
  category: z.enum(['climate', 'encounter', 'calm', 'mechanical', 'custom']),
  title: z.string().min(1, 'Event title is required').max(200),
  description: z.string().max(5000).optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']).optional().default('medium'),
  biomeSource: z.string().optional(),
  effects: z.string().optional(),
  gmNotes: z.string().optional(),
});

// ============================================================
// VEHICLES
// ============================================================

const createVehicleSchema = z.object({
  factionId: z.string().nullable().optional(),
  name: z.string().min(1).max(200),
  modelType: z.string().max(100).optional(),
  description: z.string().max(5000).optional(),
  imageUrl: z.string().optional(),
  speedBase: z.number().int().min(0).optional(),
  acBase: z.number().int().min(0).optional(),
  hpMaxBase: z.number().int().min(1).optional(),
  hpCurrent: z.number().int().min(0).optional(),
  fuelCurrent: z.number().int().min(0).optional(),
  fuelMax: z.number().int().min(1).optional(),
  exhaustionLevel: z.number().int().min(0).optional(),
  notes: z.string().max(10000).optional(),
  tags: z.string().optional(),
});

const updateVehicleSchema = createVehicleSchema.partial();

const createVehiclePartSchema = z.object({
  name: z.string().min(1).max(200),
  partType: z.string().max(50),
  description: z.string().max(5000).optional(),
  rarity: z.string().max(50).optional(),
  value: z.number().int().min(0).optional(),
  weight: z.number().min(0).optional(),
  imageUrl: z.string().optional(),
  modifiers: z.string().optional(),
});

const updateVehiclePartSchema = createVehiclePartSchema.partial();

const createVehiclePartSlotSchema = z.object({
  partType: z.string().max(50),
  partId: z.string().nullable().optional(),
  condition: z.string().max(50).optional(),
});

const updateVehiclePartSlotSchema = createVehiclePartSlotSchema.partial();

const createVehicleCrewSlotSchema = z.object({
  role: z.string().max(100),
  characterId: z.string().nullable().optional(),
  description: z.string().max(500).optional(),
});

const updateVehicleCrewSlotSchema = createVehicleCrewSlotSchema.partial();

const createVehicleAccessSchema = z.object({
  userId: z.string().nullable().optional(),
  characterId: z.string().nullable().optional(),
  accessLevel: z.enum(['view', 'operate']),
});

const updateVehicleAccessSchema = createVehicleAccessSchema.partial();

const updateConvoyEventSchema = z.object({
  status: z.enum(['pending', 'active', 'resolved', 'skipped']).optional(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  effects: z.string().optional(),
  gmNotes: z.string().optional(),
  category: z.enum(['climate', 'encounter', 'calm', 'mechanical', 'custom']).optional(),
});

const updateConvoyResourcesSchema = z.object({
  fuel: z.number().int().min(0).max(200).optional(),
  water: z.number().int().min(0).max(200).optional(),
  food: z.number().int().min(0).max(200).optional(),
  medicine: z.number().int().min(0).max(200).optional(),
  ammo: z.number().int().min(0).max(200).optional(),
});

const selectConvoyRewardsSchema = z.object({
  selectedRewards: z.string().min(1, 'Selected rewards JSON is required'),
});

// ============================================================
// CAMPAGNE — ÉTAT DE SÉANCE
// ============================================================

// Toutes les clés sont optionnelles : le MJ ne modifie qu'un champ à la fois.
const updateCampaignStateSchema = z.object({
  doomPool: z.number().int().min(0).max(99).optional(),
  complications: z.array(z.any()).optional(),
  customCards: z.array(z.any()).optional(),
  wormClock: z.number().int().min(0).max(20).optional(),
});

const createSessionLogEntrySchema = z.object({
  kind: z.enum(['message', 'spotlight', 'complication', 'reward', 'dice', 'node', 'state']),
  payload: z.record(z.any()),
  sessionId: z.string().optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  createCampaignSchema,
  updateCampaignSchema,
  invitePlayerSchema,
  joinCampaignSchema,
  createCharacterSchema,
  updateCharacterSchema,
  playerUpdateCharacterSchema,
  createNpcSchema,
  updateNpcSchema,
  createLocationSchema,
  updateLocationSchema,
  createCitySchema,
  updateCitySchema,
  adjustCityParamSchema,
  createQuestSchema,
  updateQuestSchema,
  createQuestObjectiveSchema,
  createQuestCityImpactSchema,
  createQuestNpcLinkSchema,
  createQuestLocationLinkSchema,
  createQuestItemLinkSchema,
  createQuestDependencySchema,
  resolveQuestSchema,
  createQuestNodeSchema,
  updateQuestNodeSchema,
  createQuestNodeConnectionSchema,
  updateQuestNodeConnectionSchema,
  createQuestThreatSchema,
  updateQuestThreatSchema,
  createQuestFactionProgressSchema,
  updateQuestFactionProgressSchema,
  updateQuestCharacterStateSchema,
  createQuestNPCProfileSchema,
  updateQuestNPCProfileSchema,
  updateQuestMechanicNotesSchema,
  createQuestNodeRewardSchema,
  createQuestNodeThreatEffectSchema,
  unlockSkillSchema,
  createBestiarySchema,
  updateBestiarySchema,
  createEncounterSchema,
  updateEncounterSchema,
  createCombatantSchema,
  updateCombatantSchema,
  bulkAddCombatantsSchema,
  createItemSchema,
  updateItemSchema,
  createNoteSchema,
  updateNoteSchema,
  createTagSchema,
  createEntityLinkSchema,
  diceRollSchema,
  playerDiceRollSchema,
  createSessionSchema,
  updateSessionSchema,
  createSpotlightSchema,
  updateWorldMapSchema,
  updateCityMapPositionSchema,
  updateCityTerritorySchema,
  updateCityFactionColorSchema,
  // Convoy schemas
  createConvoySchema,
  updateConvoySchema,
  createConvoyVehicleSchema,
  updateConvoyVehicleSchema,
  createConvoyEventSchema,
  updateConvoyEventSchema,
  updateConvoyResourcesSchema,
  selectConvoyRewardsSchema,
  // Vehicles
  createVehicleSchema,
  updateVehicleSchema,
  createVehiclePartSchema,
  updateVehiclePartSchema,
  createVehiclePartSlotSchema,
  updateVehiclePartSlotSchema,
  createVehicleCrewSlotSchema,
  updateVehicleCrewSlotSchema,
  createVehicleAccessSchema,
  updateVehicleAccessSchema,
  // Campain session state
  updateCampaignStateSchema,
  createSessionLogEntrySchema,
};
