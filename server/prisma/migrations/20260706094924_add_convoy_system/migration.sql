-- CreateTable
CREATE TABLE "convoys" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'planning',
    "originCityId" TEXT NOT NULL,
    "destinationCityId" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL DEFAULT 50,
    "cargoType" TEXT NOT NULL,
    "cargoDetails" TEXT,
    "fuel" INTEGER NOT NULL DEFAULT 100,
    "water" INTEGER NOT NULL DEFAULT 100,
    "food" INTEGER NOT NULL DEFAULT 100,
    "medicine" INTEGER NOT NULL DEFAULT 100,
    "ammo" INTEGER NOT NULL DEFAULT 100,
    "currentStepIndex" INTEGER NOT NULL DEFAULT -1,
    "totalSteps" INTEGER NOT NULL DEFAULT 0,
    "proposedRewards" TEXT,
    "selectedRewards" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "convoys_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "convoys_originCityId_fkey" FOREIGN KEY ("originCityId") REFERENCES "cities" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "convoys_destinationCityId_fkey" FOREIGN KEY ("destinationCityId") REFERENCES "cities" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "convoy_vehicles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "convoyId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hpCurrent" INTEGER NOT NULL DEFAULT 100,
    "hpMax" INTEGER NOT NULL DEFAULT 100,
    "passengers" TEXT,
    "isDestroyed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "convoy_vehicles_convoyId_fkey" FOREIGN KEY ("convoyId") REFERENCES "convoys" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "convoy_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "convoyId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "biomeSource" TEXT,
    "effects" TEXT,
    "gmNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "convoy_events_convoyId_fkey" FOREIGN KEY ("convoyId") REFERENCES "convoys" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "convoys_campaignId_idx" ON "convoys"("campaignId");

-- CreateIndex
CREATE INDEX "convoys_status_idx" ON "convoys"("status");

-- CreateIndex
CREATE INDEX "convoy_vehicles_convoyId_idx" ON "convoy_vehicles"("convoyId");

-- CreateIndex
CREATE INDEX "convoy_events_convoyId_idx" ON "convoy_events"("convoyId");

-- CreateIndex
CREATE INDEX "convoy_events_orderIndex_idx" ON "convoy_events"("orderIndex");
