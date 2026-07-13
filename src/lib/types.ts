// Tipos de domínio do app. Mantenha isso como fonte única da verdade —
// se um endpoint da EA mudar, ajuste o mapeamento em ea-client.ts, não crie
// tipos paralelos em cada componente.

export type Position = "GOALKEEPER" | "DEFENDER" | "MIDFIELDER" | "FORWARD" | "ANY";

export type MatchType = "LEAGUE" | "PLAYOFF" | "FRIENDLY";

export type MatchResult = "WIN" | "DRAW" | "LOSS";

export interface ClubOverview {
  eaClubId: string;
  name: string;
  crestUrl: string | null;
  skillRating: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  reputationTier: string | null;
  lastSyncedAt: Date | null;
}

export interface MemberSummary {
  eaMemberId: string;
  gamertag: string;
  position: Position;
  overallRating: number;
  gamesPlayed: number;
  goals: number;
  assists: number;
  passesMade: number;
  passesAttempted: number;
  avgMatchRating: number;
  manOfTheMatch: number;
}

export interface MatchSummary {
  eaMatchId: string;
  matchType: MatchType;
  playedAt: Date;
  opponentName: string;
  opponentCrestUrl: string | null;
  goalsFor: number;
  goalsAgainst: number;
  result: MatchResult;
}

export interface PlayerMatchAppearance {
  eaMatchId: string;
  playedAt: Date;
  opponentName: string;
  rating: number;
  goals: number;
  assists: number;
  motm: boolean;
}

/** Estatísticas agregadas de destaque, calculadas a partir dos membros. */
export interface ClubHighlights {
  topScorer: MemberSummary | null;
  bestAverageRating: MemberSummary | null;
  bestPassAccuracy: (MemberSummary & { passAccuracy: number }) | null;
}
