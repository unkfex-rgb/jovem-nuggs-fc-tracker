-- CreateTable
CREATE TABLE "Club" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eaClubId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "crestUrl" TEXT,
    "skillRating" INTEGER NOT NULL DEFAULT 0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "draws" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "goalsFor" INTEGER NOT NULL DEFAULT 0,
    "goalsAgainst" INTEGER NOT NULL DEFAULT 0,
    "division" TEXT,
    "reputationTier" TEXT,
    "lastSyncedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clubId" TEXT NOT NULL,
    "eaMemberId" TEXT NOT NULL,
    "gamertag" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "overallRating" INTEGER NOT NULL DEFAULT 0,
    "gamesPlayed" INTEGER NOT NULL DEFAULT 0,
    "goals" INTEGER NOT NULL DEFAULT 0,
    "assists" INTEGER NOT NULL DEFAULT 0,
    "passesMade" INTEGER NOT NULL DEFAULT 0,
    "passesAttempted" INTEGER NOT NULL DEFAULT 0,
    "avgMatchRating" REAL NOT NULL DEFAULT 0,
    "manOfTheMatch" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Member_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clubId" TEXT NOT NULL,
    "eaMatchId" TEXT NOT NULL,
    "matchType" TEXT NOT NULL,
    "playedAt" DATETIME NOT NULL,
    "opponentName" TEXT NOT NULL,
    "opponentCrestUrl" TEXT,
    "goalsFor" INTEGER NOT NULL,
    "goalsAgainst" INTEGER NOT NULL,
    "result" TEXT NOT NULL,
    "rawPayload" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Match_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MatchAppearance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matchId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "rating" REAL NOT NULL,
    "goals" INTEGER NOT NULL DEFAULT 0,
    "assists" INTEGER NOT NULL DEFAULT 0,
    "passesMade" INTEGER NOT NULL DEFAULT 0,
    "passesAttempted" INTEGER NOT NULL DEFAULT 0,
    "motm" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "MatchAppearance_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MatchAppearance_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Club_eaClubId_key" ON "Club"("eaClubId");

-- CreateIndex
CREATE UNIQUE INDEX "Member_eaMemberId_key" ON "Member"("eaMemberId");

-- CreateIndex
CREATE INDEX "Member_clubId_idx" ON "Member"("clubId");

-- CreateIndex
CREATE UNIQUE INDEX "Match_eaMatchId_key" ON "Match"("eaMatchId");

-- CreateIndex
CREATE INDEX "Match_clubId_playedAt_idx" ON "Match"("clubId", "playedAt");

-- CreateIndex
CREATE UNIQUE INDEX "MatchAppearance_matchId_memberId_key" ON "MatchAppearance"("matchId", "memberId");
