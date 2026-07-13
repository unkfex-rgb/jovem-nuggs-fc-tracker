/**
 * Cliente para os endpoints não-oficiais da EA (ver docs/ea-endpoints.md).
 *
 * REGRA DE OURO: este módulo é o ÚNICO lugar do projeto que fala com a EA.
 * Páginas e componentes NUNCA importam isto diretamente — eles leem do banco
 * (via src/lib/db.ts). Só src/scripts/sync-club-data.ts e a rota
 * src/app/api/sync/route.ts usam este cliente.
 */

import type { ClubOverview, MatchSummary, MemberSummary, MatchType, Position, PlayerMatchAppearance } from "./types";

const BASE_URL = "https://proclubs.ea.com/api/fc";
const DEFAULT_TIMEOUT_MS = 10000;
const MAX_RETRIES = 3;

interface FetchOptions {
  timeoutMs?: number;
  retries?: number;
}

/**
 * Wrapper de fetch com timeout + retry com backoff exponencial.
 */
async function fetchWithRetry(
  url: string,
  { timeoutMs = DEFAULT_TIMEOUT_MS, retries = MAX_RETRIES }: FetchOptions = {}
): Promise<unknown> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
          Accept: "application/json",
        },
      });

      if (res.status === 429) {
        await sleep(2 ** attempt * 1000);
        continue;
      }

      if (!res.ok) {
        throw new EaApiError(`EA respondeu ${res.status} para ${url}`, res.status);
      }

      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        throw new EaApiError(`Resposta não-JSON de ${url} (provável instabilidade da EA)`);
      }

      return await res.json();
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await sleep(2 ** attempt * 500);
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new EaApiError(`Falha ao buscar ${url} após ${retries + 1} tentativas`);
}

export class EaApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "EaApiError";
    this.status = status;
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------

export async function fetchClubOverview(
  clubId: string,
  platform: string
): Promise<ClubOverview> {
  const url = `${BASE_URL}/clubs/overallStats?platform=${platform}&clubIds=${clubId}`;
  const raw = await fetchWithRetry(url);
  return mapClubOverview(raw, clubId);
}

export async function fetchClubMembers(
  clubId: string,
  platform: string
): Promise<MemberSummary[]> {
  const url = `${BASE_URL}/members/stats?platform=${platform}&clubId=${clubId}`;
  const raw = await fetchWithRetry(url);
  return mapMembers(raw);
}

export async function fetchClubMatches(
  clubId: string,
  platform: string,
  matchType: MatchType
): Promise<(MatchSummary & { raw: any })[]> {
  const eaMatchType =
    matchType === "LEAGUE"
      ? "leagueMatch"
      : matchType === "PLAYOFF"
        ? "playoffMatch"
        : "friendlyMatch";

  const url = `${BASE_URL}/clubs/matches?matchType=${eaMatchType}&platform=${platform}&clubIds=${clubId}`;
  const raw = await fetchWithRetry(url);
  return mapMatches(raw, clubId, matchType);
}

// ---------------------------------------------------------------------------
// Mapeamento raw -> tipos de domínio
// ---------------------------------------------------------------------------

function mapClubOverview(raw: unknown, clubId: string): ClubOverview {
  const list = Array.isArray(raw) ? raw : [];
  const data = list.find((item: any) => String(item.clubId) === clubId) || list[0];

  return {
    eaClubId: clubId,
    name: data?.name ?? "Jovem Nuggs FC",
    crestUrl: data?.crestAssetId ? crestUrlFromAssetId(data.crestAssetId) : null,
    skillRating: Number(data?.skillRating ?? 0),
    wins: Number(data?.wins ?? 0),
    draws: Number(data?.ties ?? data?.draws ?? 0),
    losses: Number(data?.losses ?? 0),
    goalsFor: Number(data?.goals ?? 0),
    goalsAgainst: Number(data?.goalsAgainst ?? 0),
    reputationTier: data?.clubInfo?.reputationTier ?? null,
    lastSyncedAt: new Date(),
  };
}

function mapMembers(raw: unknown): MemberSummary[] {
  const data = raw as any;
  const list = Array.isArray(data?.members) ? data.members : [];

  return list.map((m: any) => {
    const successRate = Number(m.passSuccessRate ?? 100);
    const passesMade = Number(m.passesMade ?? 0);
    // Evitar NaN na divisão por zero ou taxa zero
    const passesAttempted = successRate > 0 
      ? Math.round(passesMade / (successRate / 100)) 
      : passesMade;

    return {
      eaMemberId: String(m.name),
      gamertag: m.name ?? "Desconhecido",
      position: mapPosition(m.favoritePosition ?? m.proPos),
      overallRating: Number(m.proOverall ?? 0),
      gamesPlayed: Number(m.gamesPlayed ?? 0),
      goals: Number(m.goals ?? 0),
      assists: Number(m.assists ?? 0),
      passesMade: passesMade,
      passesAttempted: passesAttempted,
      avgMatchRating: Number(m.ratingAve ?? 0),
      manOfTheMatch: Number(m.manOfTheMatch ?? 0),
    };
  });
}

function mapMatches(raw: unknown, clubId: string, matchType: MatchType): (MatchSummary & { raw: any })[] {
  const list = Array.isArray(raw) ? raw : [];

  return list.map((match: any) => {
    const clubs = match.clubs ?? {};
    const own = clubs[clubId];
    const opponentId = Object.keys(clubs).find((id) => id !== clubId);
    const opponent = opponentId ? clubs[opponentId] : undefined;

    const goalsFor = Number(own?.goals ?? 0);
    const goalsAgainst = Number(opponent?.goals ?? 0);

    const players: PlayerMatchAppearance[] = [];
    if (match.players && match.players[clubId]) {
      Object.entries(match.players[clubId]).forEach(([gamertag, stats]: [string, any]) => {
        players.push({
          gamertag,
          rating: Number(stats.rating ?? 0),
          goals: Number(stats.goals ?? 0),
          assists: Number(stats.assists ?? 0),
          passesMade: Number(stats.passesmade ?? 0),
          passesAttempted: Number(stats.passesattempted ?? 0),
          motm: stats.mom === "1",
        });
      });
    }

    return {
      eaMatchId: String(match.matchId),
      matchType,
      playedAt: new Date(Number(match.timestamp) * 1000),
      opponentName: opponent?.details?.name ?? "Adversário",
      opponentCrestUrl: opponent?.details?.crestAssetId
        ? crestUrlFromAssetId(opponent.details.crestAssetId)
        : null,
      goalsFor,
      goalsAgainst,
      result: goalsFor > goalsAgainst ? "WIN" : goalsFor < goalsAgainst ? "LOSS" : "DRAW",
      players,
      raw: match,
    };
  });
}

function mapPosition(value: string | undefined): Position {
  const pos = (value ?? "").toLowerCase();
  if (pos.includes("goalkeeper") || pos === "0") return "GOALKEEPER";
  if (pos.includes("defender") || ["1", "3", "7", "8"].includes(pos)) return "DEFENDER";
  if (pos.includes("midfielder") || ["10", "12", "14", "15", "16"].includes(pos)) return "MIDFIELDER";
  if (pos.includes("forward") || ["23", "25"].includes(pos)) return "FORWARD";
  return "ANY";
}

function crestUrlFromAssetId(assetId: string): string {
  return `https://media.contentapi.ea.com/content/dam/eacom/fc/pro-clubs/crests/crest_${assetId}.png`;
}
