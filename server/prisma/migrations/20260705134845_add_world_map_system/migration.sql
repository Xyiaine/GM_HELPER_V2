-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT,
    "gameSystem" TEXT NOT NULL DEFAULT 'Custom',
    "gmUserId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "campaign_memberships" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "invitedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "campaign_memberships_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "campaign_memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "characters" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "ownerUserId" TEXT,
    "name" TEXT NOT NULL,
    "race" TEXT,
    "class" TEXT,
    "level" INTEGER NOT NULL DEFAULT 1,
    "alignment" TEXT,
    "background" TEXT,
    "strength" INTEGER NOT NULL DEFAULT 10,
    "dexterity" INTEGER NOT NULL DEFAULT 10,
    "constitution" INTEGER NOT NULL DEFAULT 10,
    "intelligence" INTEGER NOT NULL DEFAULT 10,
    "wisdom" INTEGER NOT NULL DEFAULT 10,
    "charisma" INTEGER NOT NULL DEFAULT 10,
    "hpCurrent" INTEGER NOT NULL DEFAULT 10,
    "hpMax" INTEGER NOT NULL DEFAULT 10,
    "armorClass" INTEGER NOT NULL DEFAULT 10,
    "speed" INTEGER NOT NULL DEFAULT 30,
    "initiative" INTEGER NOT NULL DEFAULT 0,
    "proficiencyBonus" INTEGER NOT NULL DEFAULT 2,
    "skills" TEXT,
    "savingThrows" TEXT,
    "traits" TEXT,
    "spells" TEXT,
    "spellSlots" TEXT,
    "notes" TEXT,
    "portraitUrl" TEXT,
    "canBeEditedByPlayer" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "characters_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "characters_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "character_inventory_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "characterId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "equipped" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "character_inventory_items_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "character_inventory_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "npcs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "race" TEXT,
    "role" TEXT,
    "portraitUrl" TEXT,
    "personality" TEXT,
    "description" TEXT,
    "locationId" TEXT,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "stats" TEXT,
    "gmNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "npcs_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "npcs_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "parentLocationId" TEXT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "climate" TEXT,
    "population" TEXT,
    "government" TEXT,
    "notableFeatures" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "locations_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "locations_parentLocationId_fkey" FOREIGN KEY ("parentLocationId") REFERENCES "locations" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "locationId" TEXT NOT NULL,
    "health" INTEGER NOT NULL DEFAULT 50,
    "wealth" INTEGER NOT NULL DEFAULT 50,
    "technology" INTEGER NOT NULL DEFAULT 50,
    "food" INTEGER NOT NULL DEFAULT 50,
    "happiness" INTEGER NOT NULL DEFAULT 50,
    "armament" INTEGER NOT NULL DEFAULT 50,
    "fuel" INTEGER NOT NULL DEFAULT 50,
    "customParameters" TEXT,
    "specialty" TEXT,
    "strength" TEXT,
    "weakness" TEXT,
    "peculiarity" TEXT,
    "mapX" REAL,
    "mapY" REAL,
    "factionColor" TEXT NOT NULL DEFAULT '#6366f1',
    "territoryData" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "cities_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "city_parameter_history" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cityId" TEXT NOT NULL,
    "parameter" TEXT NOT NULL,
    "oldValue" INTEGER NOT NULL,
    "newValue" INTEGER NOT NULL,
    "cause" TEXT NOT NULL,
    "questId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "city_parameter_history_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "world_maps" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "baseMapImageUrl" TEXT,
    "canvasState" TEXT,
    "zoom" REAL NOT NULL DEFAULT 1.0,
    "panX" REAL NOT NULL DEFAULT 0,
    "panY" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "world_maps_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "map_assets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "layerData" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "map_assets_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "map_markers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mapAssetId" TEXT NOT NULL,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "linkedNpcId" TEXT,
    "linkedLocationId" TEXT,
    "linkedQuestId" TEXT,
    CONSTRAINT "map_markers_mapAssetId_fkey" FOREIGN KEY ("mapAssetId") REFERENCES "map_assets" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "map_markers_linkedLocationId_fkey" FOREIGN KEY ("linkedLocationId") REFERENCES "locations" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "quests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'secondary',
    "difficulty" TEXT,
    "level" INTEGER,
    "duration" TEXT,
    "imageUrl" TEXT,
    "questGiverNpcId" TEXT,
    "xpReward" INTEGER,
    "goldReward" INTEGER,
    "itemRewards" TEXT,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "quests_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "quest_objectives" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "isOptional" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'pending',
    CONSTRAINT "quest_objectives_questId_fkey" FOREIGN KEY ("questId") REFERENCES "quests" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "quest_city_impacts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questId" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "parameter" TEXT NOT NULL,
    "modifier" INTEGER NOT NULL,
    CONSTRAINT "quest_city_impacts_questId_fkey" FOREIGN KEY ("questId") REFERENCES "quests" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "quest_city_impacts_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "quest_npc_links" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questId" TEXT NOT NULL,
    "npcId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    CONSTRAINT "quest_npc_links_questId_fkey" FOREIGN KEY ("questId") REFERENCES "quests" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "quest_npc_links_npcId_fkey" FOREIGN KEY ("npcId") REFERENCES "npcs" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "quest_location_links" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    CONSTRAINT "quest_location_links_questId_fkey" FOREIGN KEY ("questId") REFERENCES "quests" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "quest_location_links_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "encounters" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "locationId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "currentRound" INTEGER NOT NULL DEFAULT 0,
    "currentTurnIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "encounters_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "encounters_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "encounter_combatants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "encounterId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "initiative" INTEGER NOT NULL DEFAULT 0,
    "hpCurrent" INTEGER NOT NULL DEFAULT 0,
    "hpMax" INTEGER NOT NULL DEFAULT 0,
    "armorClass" INTEGER NOT NULL DEFAULT 10,
    "conditions" TEXT,
    "notes" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "characterId" TEXT,
    "npcId" TEXT,
    CONSTRAINT "encounter_combatants_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "encounters" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "encounter_combatants_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "encounter_combatants_npcId_fkey" FOREIGN KEY ("npcId") REFERENCES "npcs" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "rarity" TEXT NOT NULL DEFAULT 'common',
    "description" TEXT,
    "value" INTEGER,
    "weight" REAL,
    "imageUrl" TEXT,
    "properties" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "items_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "notes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "parentFolderId" TEXT,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "isFolder" BOOLEAN NOT NULL DEFAULT false,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "visibleByPlayers" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "notes_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "notes_parentFolderId_fkey" FOREIGN KEY ("parentFolderId") REFERENCES "notes" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#6366f1',
    CONSTRAINT "tags_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "entity_tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tagId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "entity_links" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "sourceEntityType" TEXT NOT NULL,
    "sourceEntityId" TEXT NOT NULL,
    "targetEntityType" TEXT NOT NULL,
    "targetEntityId" TEXT NOT NULL,
    "relationType" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "entity_links_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "dice_rolls" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "characterId" TEXT,
    "expression" TEXT NOT NULL,
    "result" INTEGER NOT NULL,
    "details" TEXT,
    "label" TEXT,
    "visibleToAll" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "dice_rolls_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "dice_rolls_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "dice_rolls_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "startedAt" DATETIME,
    "endedAt" DATETIME,
    "summary" TEXT,
    "activeEncounterId" TEXT,
    "shareInitiative" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "sessions_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");

-- CreateIndex
CREATE INDEX "refresh_tokens_token_idx" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "campaigns_gmUserId_idx" ON "campaigns"("gmUserId");

-- CreateIndex
CREATE INDEX "campaign_memberships_campaignId_idx" ON "campaign_memberships"("campaignId");

-- CreateIndex
CREATE INDEX "campaign_memberships_userId_idx" ON "campaign_memberships"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_memberships_campaignId_userId_key" ON "campaign_memberships"("campaignId", "userId");

-- CreateIndex
CREATE INDEX "characters_campaignId_idx" ON "characters"("campaignId");

-- CreateIndex
CREATE INDEX "characters_ownerUserId_idx" ON "characters"("ownerUserId");

-- CreateIndex
CREATE INDEX "character_inventory_items_characterId_idx" ON "character_inventory_items"("characterId");

-- CreateIndex
CREATE INDEX "character_inventory_items_itemId_idx" ON "character_inventory_items"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "character_inventory_items_characterId_itemId_key" ON "character_inventory_items"("characterId", "itemId");

-- CreateIndex
CREATE INDEX "npcs_campaignId_idx" ON "npcs"("campaignId");

-- CreateIndex
CREATE INDEX "npcs_locationId_idx" ON "npcs"("locationId");

-- CreateIndex
CREATE INDEX "locations_campaignId_idx" ON "locations"("campaignId");

-- CreateIndex
CREATE INDEX "locations_parentLocationId_idx" ON "locations"("parentLocationId");

-- CreateIndex
CREATE UNIQUE INDEX "cities_locationId_key" ON "cities"("locationId");

-- CreateIndex
CREATE INDEX "city_parameter_history_cityId_idx" ON "city_parameter_history"("cityId");

-- CreateIndex
CREATE INDEX "city_parameter_history_questId_idx" ON "city_parameter_history"("questId");

-- CreateIndex
CREATE UNIQUE INDEX "world_maps_campaignId_key" ON "world_maps"("campaignId");

-- CreateIndex
CREATE INDEX "map_assets_campaignId_idx" ON "map_assets"("campaignId");

-- CreateIndex
CREATE INDEX "map_markers_mapAssetId_idx" ON "map_markers"("mapAssetId");

-- CreateIndex
CREATE INDEX "quests_campaignId_idx" ON "quests"("campaignId");

-- CreateIndex
CREATE INDEX "quests_questGiverNpcId_idx" ON "quests"("questGiverNpcId");

-- CreateIndex
CREATE INDEX "quests_status_idx" ON "quests"("status");

-- CreateIndex
CREATE INDEX "quest_objectives_questId_idx" ON "quest_objectives"("questId");

-- CreateIndex
CREATE INDEX "quest_city_impacts_questId_idx" ON "quest_city_impacts"("questId");

-- CreateIndex
CREATE INDEX "quest_city_impacts_cityId_idx" ON "quest_city_impacts"("cityId");

-- CreateIndex
CREATE INDEX "quest_npc_links_questId_idx" ON "quest_npc_links"("questId");

-- CreateIndex
CREATE INDEX "quest_npc_links_npcId_idx" ON "quest_npc_links"("npcId");

-- CreateIndex
CREATE UNIQUE INDEX "quest_npc_links_questId_npcId_key" ON "quest_npc_links"("questId", "npcId");

-- CreateIndex
CREATE INDEX "quest_location_links_questId_idx" ON "quest_location_links"("questId");

-- CreateIndex
CREATE INDEX "quest_location_links_locationId_idx" ON "quest_location_links"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "quest_location_links_questId_locationId_key" ON "quest_location_links"("questId", "locationId");

-- CreateIndex
CREATE INDEX "encounters_campaignId_idx" ON "encounters"("campaignId");

-- CreateIndex
CREATE INDEX "encounter_combatants_encounterId_idx" ON "encounter_combatants"("encounterId");

-- CreateIndex
CREATE INDEX "items_campaignId_idx" ON "items"("campaignId");

-- CreateIndex
CREATE INDEX "notes_campaignId_idx" ON "notes"("campaignId");

-- CreateIndex
CREATE INDEX "notes_parentFolderId_idx" ON "notes"("parentFolderId");

-- CreateIndex
CREATE INDEX "tags_campaignId_idx" ON "tags"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "tags_campaignId_name_key" ON "tags"("campaignId", "name");

-- CreateIndex
CREATE INDEX "entity_tags_tagId_idx" ON "entity_tags"("tagId");

-- CreateIndex
CREATE INDEX "entity_tags_entityType_entityId_idx" ON "entity_tags"("entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "entity_tags_tagId_entityType_entityId_key" ON "entity_tags"("tagId", "entityType", "entityId");

-- CreateIndex
CREATE INDEX "entity_links_campaignId_idx" ON "entity_links"("campaignId");

-- CreateIndex
CREATE INDEX "entity_links_sourceEntityType_sourceEntityId_idx" ON "entity_links"("sourceEntityType", "sourceEntityId");

-- CreateIndex
CREATE INDEX "entity_links_targetEntityType_targetEntityId_idx" ON "entity_links"("targetEntityType", "targetEntityId");

-- CreateIndex
CREATE UNIQUE INDEX "entity_links_campaignId_sourceEntityType_sourceEntityId_targetEntityType_targetEntityId_key" ON "entity_links"("campaignId", "sourceEntityType", "sourceEntityId", "targetEntityType", "targetEntityId");

-- CreateIndex
CREATE INDEX "dice_rolls_campaignId_idx" ON "dice_rolls"("campaignId");

-- CreateIndex
CREATE INDEX "dice_rolls_userId_idx" ON "dice_rolls"("userId");

-- CreateIndex
CREATE INDEX "dice_rolls_characterId_idx" ON "dice_rolls"("characterId");

-- CreateIndex
CREATE INDEX "dice_rolls_createdAt_idx" ON "dice_rolls"("createdAt");

-- CreateIndex
CREATE INDEX "sessions_campaignId_idx" ON "sessions"("campaignId");

-- CreateIndex
CREATE INDEX "sessions_status_idx" ON "sessions"("status");
