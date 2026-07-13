// Dados de exemplo, baseados nos prints reais do Jovem Nuggs FC, só pra
// telas terem o que renderizar antes da Fase 1 (sync real) estar pronta.
// TODO (Fase 1/2): substituir todo uso disto por leitura via src/lib/db.ts.

import type { ClubOverview, MatchSummary, MemberSummary } from "./types";

export const mockClub: ClubOverview = {
  eaClubId: "8044401",
  name: "Jovem Nuggs FC",
  crestUrl: null,
  skillRating: 1579,
  wins: 75,
  draws: 18,
  losses: 75,
  goalsFor: 399,
  goalsAgainst: 374,
  reputationTier: "Emerging Stars",
  lastSyncedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
};

export const mockMembers: MemberSummary[] = [
  { eaMemberId: "1", gamertag: "araujozx77_", position: "FORWARD", overallRating: 86, gamesPlayed: 150, goals: 46, assists: 18, passesMade: 1000, passesAttempted: 1109, avgMatchRating: 7.1, manOfTheMatch: 12 },
  { eaMemberId: "2", gamertag: "arthur_zskk", position: "DEFENDER", overallRating: 85, gamesPlayed: 23, goals: 0, assists: 2, passesMade: 160, passesAttempted: 186, avgMatchRating: 6.8, manOfTheMatch: 1 },
  { eaMemberId: "3", gamertag: "CELTA4656", position: "FORWARD", overallRating: 88, gamesPlayed: 16, goals: 11, assists: 3, passesMade: 190, passesAttempted: 223, avgMatchRating: 7.4, manOfTheMatch: 3 },
  { eaMemberId: "4", gamertag: "corintia4i20", position: "FORWARD", overallRating: 87, gamesPlayed: 123, goals: 12, assists: 22, passesMade: 1250, passesAttempted: 1418, avgMatchRating: 6.9, manOfTheMatch: 5 },
  { eaMemberId: "5", gamertag: "Dghs100", position: "GOALKEEPER", overallRating: 95, gamesPlayed: 45, goals: 0, assists: 0, passesMade: 190, passesAttempted: 223, avgMatchRating: 7.6, manOfTheMatch: 8 },
  { eaMemberId: "6", gamertag: "eozafe", position: "FORWARD", overallRating: 87, gamesPlayed: 33, goals: 18, assists: 6, passesMade: 300, passesAttempted: 358, avgMatchRating: 7.2, manOfTheMatch: 4 },
  { eaMemberId: "7", gamertag: "Jessysz0", position: "DEFENDER", overallRating: 78, gamesPlayed: 95, goals: 23, assists: 14, passesMade: 900, passesAttempted: 1064, avgMatchRating: 6.5, manOfTheMatch: 2 },
  { eaMemberId: "8", gamertag: "Kauanpecinha", position: "FORWARD", overallRating: 84, gamesPlayed: 31, goals: 13, assists: 5, passesMade: 270, passesAttempted: 324, avgMatchRating: 6.9, manOfTheMatch: 1 },
  { eaMemberId: "9", gamertag: "rochax07", position: "MIDFIELDER", overallRating: 76, gamesPlayed: 76, goals: 9, assists: 15, passesMade: 780, passesAttempted: 940, avgMatchRating: 6.6, manOfTheMatch: 3 },
];

export const mockMatches: MatchSummary[] = [
  { eaMatchId: "m1", matchType: "LEAGUE", playedAt: new Date(Date.now() - 6 * 3600 * 1000), opponentName: "Rua do Porto", opponentCrestUrl: null, goalsFor: 3, goalsAgainst: 3, result: "DRAW" },
  { eaMatchId: "m2", matchType: "LEAGUE", playedAt: new Date(Date.now() - 6 * 3600 * 1000), opponentName: "Primos Brown", opponentCrestUrl: null, goalsFor: 5, goalsAgainst: 4, result: "WIN" },
  { eaMatchId: "m3", matchType: "LEAGUE", playedAt: new Date(Date.now() - 7 * 3600 * 1000), opponentName: "Macanticos FC", opponentCrestUrl: null, goalsFor: 1, goalsAgainst: 0, result: "WIN" },
  { eaMatchId: "m4", matchType: "PLAYOFF", playedAt: new Date(Date.now() - 7 * 3600 * 1000), opponentName: "XUPA XUPA FC", opponentCrestUrl: null, goalsFor: 4, goalsAgainst: 7, result: "LOSS" },
  { eaMatchId: "m5", matchType: "FRIENDLY", playedAt: new Date(Date.now() - 8 * 3600 * 1000), opponentName: "Estrela do Norte", opponentCrestUrl: null, goalsFor: 3, goalsAgainst: 0, result: "WIN" },
];
