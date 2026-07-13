/**
 * Cliente para os endpoints não-oficiais da EA (ver docs/ea-endpoints.md).
 *
 * REGRA DE OURO: este módulo é o ÚNICO lugar do projeto que fala com a EA.
 * Páginas e componentes NUNCA importam isto diretamente — eles leem do banco
 * (via src/lib/db.ts). Só src/scripts/sync-club-data.ts e a rota
 * src/app/api/sync/route.ts usam este cliente.
 *
 * Fase 1 (ver MANUS_PROMPT.md): implementar de fato o `fetchWithRetry` e os
 * mapeamentos abaixo com o formato real de resposta da EA (hoje os `map*`
 * assumem um formato razoável, mas precisam ser conferidos contra a resposta
 * real, que pode variar).
 */

import type { ClubOverview, MatchSummary, MemberSummary, MatchType, Position } from "./types";

const BASE_URL = "https://proclubs.ea.com/api/fc";
const DEFAULT_TIMEOUT_MS = 8000;
const MAX_RETRIES = 3;

interface FetchOptions {
  timeoutMs?: number;
  retries?: number;
}

/**
 * Wrapper de fetch com timeout + retry com backoff exponencial.
 * Lança erro tipado em vez de deixar o caller lidar com `Response` cru.
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
          // alguns proxies da EA recusam requests sem um User-Agent "normal"
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
          Accept: "application/json",
        },
      });

      if (res.status === 429) {
        // rate limit — espera mais e tenta de novo
        await sleep(2 ** attempt * 1000);
        continue;
      }

      if (!res.ok) {
        throw new EaApiError(`EA respondeu ${res.status} para ${url}`, res.status);
      }

      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        // a EA às vezes devolve HTML de erro genérico com status 200
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
): Promise<MatchSummary[]> {
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
// TODO (Fase 1): confirmar contra o payload real da EA e ajustar os paths.
// ---------------------------------------------------------------------------

function mapClubOverview(raw: unknown, clubId: string): ClubOverview {
  const data = (raw as Record<string, any>)?.[clubId] ?? raw;

  return {
    eaClubId: clubId,
    name: data?.name ?? "Clube desconhecido",
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
  const list = Array.isArray(raw) ? raw : (Object.values(raw ?? {}) as any[]);

  return list.map((m) => ({
    eaMemberId: String(m.playerId ?? m.id),
    gamertag: m.name ?? m.gamertag ?? "Desconhecido",
    position: mapPosition(m.favoritePosition ?? m.position),
    overallRating: Number(m.proOverall ?? m.overallRating ?? 0),
    gamesPlayed: Number(m.gamesPlayed ?? 0),
    goals: Number(m.goals ?? 0),
    assists: Number(m.assists ?? 0),
    passesMade: Number(m.passesMade ?? 0),
    passesAttempted: Number(m.passAttempts ?? m.passesAttempted ?? 0),
    avgMatchRating: Number(m.ratingAve ?? m.avgMatchRating ?? 0),
    manOfTheMatch: Number(m.manOfTheMatch ?? 0),
  }));
}

function mapMatches(raw: unknown, clubId: string, matchType: MatchType): MatchSummary[] {
  const list = Array.isArray(raw) ? raw : [];

  return list.map((match) => {
    const clubs = match.clubs ?? {};
    const own = clubs[clubId];
    const opponentId = Object.keys(clubs).find((id) => id !== clubId);
    const opponent = opponentId ? clubs[opponentId] : undefined;

    const goalsFor = Number(own?.goals ?? 0);
    const goalsAgainst = Number(opponent?.goals ?? 0);

    return {
      eaMatchId: String(match.matchId),
      matchType,
      playedAt: new Date(Number(match.timestamp) * 1000),
      opponentName: opponent?.details?.name ?? "Adversário desconhecido",
      opponentCrestUrl: opponent?.details?.crestAssetId
        ? crestUrlFromAssetId(opponent.details.crestAssetId)
        : null,
      goalsFor,
      goalsAgainst,
      result: goalsFor > goalsAgainst ? "WIN" : goalsFor < goalsAgainst ? "LOSS" : "DRAW",
    };
  });
}

function mapPosition(value: string | undefined): Position {
  switch ((value ?? "").toLowerCase()) {
    case "goalkeeper":
    case "gk":
      return "GOALKEEPER";
    case "defender":
    case "def":
      return "DEFENDER";
    case "midfielder":
    case "mid":
      return "MIDFIELDER";
    case "forward":
    case "att":
      return "FORWARD";
    default:
      return "ANY";
  }
}

function crestUrlFromAssetId(assetId: string): string {
  // placeholder — confirmar o CDN real de escudos da EA na Fase 1
  return `https://media.contentapi.ea.com/content/dam/eacom/fc/pro-clubs/crests/${assetId}.png`;
}
