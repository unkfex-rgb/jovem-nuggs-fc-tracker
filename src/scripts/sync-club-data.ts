/**
 * Sincroniza os dados do clube com a EA e persiste no banco.
 *
 * Uso direto (fora do Next.js): `npm run sync`
 * Uso via web: POST /api/sync (ver src/app/api/sync/route.ts)
 *
 * Fase 1 (MANUS_PROMPT.md): este arquivo já orquestra o fluxo certo
 * (overview -> membros -> partidas -> grava tudo). O que falta é validar os
 * mapeamentos em ea-client.ts contra o payload real da EA.
 */

import { db } from "@/lib/db";
import { fetchClubOverview, fetchClubMembers, fetchClubMatches } from "@/lib/ea-client";
import type { MatchType } from "@/lib/types";

const CLUB_ID = process.env.EA_CLUB_ID ?? "8044401";
const PLATFORM = process.env.EA_PLATFORM ?? "common-gen5";
const MATCH_TYPES: MatchType[] = ["LEAGUE", "PLAYOFF", "FRIENDLY"];

export async function syncClubData() {
  console.log(`[sync] iniciando sincronização do clube ${CLUB_ID}...`);

  const overview = await fetchClubOverview(CLUB_ID, PLATFORM);

  const club = await db.club.upsert({
    where: { eaClubId: CLUB_ID },
    update: {
      name: overview.name,
      crestUrl: overview.crestUrl,
      skillRating: overview.skillRating,
      wins: overview.wins,
      draws: overview.draws,
      losses: overview.losses,
      goalsFor: overview.goalsFor,
      goalsAgainst: overview.goalsAgainst,
      reputationTier: overview.reputationTier,
      lastSyncedAt: new Date(),
    },
    create: {
      eaClubId: CLUB_ID,
      name: overview.name,
      crestUrl: overview.crestUrl,
      skillRating: overview.skillRating,
      wins: overview.wins,
      draws: overview.draws,
      losses: overview.losses,
      goalsFor: overview.goalsFor,
      goalsAgainst: overview.goalsAgainst,
      reputationTier: overview.reputationTier,
      lastSyncedAt: new Date(),
    },
  });

  console.log(`[sync] clube ok: ${club.name} (${club.id})`);

  const members = await fetchClubMembers(CLUB_ID, PLATFORM);
  for (const m of members) {
    await db.member.upsert({
      where: { eaMemberId: m.eaMemberId },
      update: {
        gamertag: m.gamertag,
        position: m.position,
        overallRating: m.overallRating,
        gamesPlayed: m.gamesPlayed,
        goals: m.goals,
        assists: m.assists,
        passesMade: m.passesMade,
        passesAttempted: m.passesAttempted,
        avgMatchRating: m.avgMatchRating,
        manOfTheMatch: m.manOfTheMatch,
      },
      create: {
        eaMemberId: m.eaMemberId,
        clubId: club.id,
        gamertag: m.gamertag,
        position: m.position,
        overallRating: m.overallRating,
        gamesPlayed: m.gamesPlayed,
        goals: m.goals,
        assists: m.assists,
        passesMade: m.passesMade,
        passesAttempted: m.passesAttempted,
        avgMatchRating: m.avgMatchRating,
        manOfTheMatch: m.manOfTheMatch,
      },
    });
  }
  console.log(`[sync] ${members.length} membros sincronizados`);

  let totalMatches = 0;
  for (const matchType of MATCH_TYPES) {
    const matches = await fetchClubMatches(CLUB_ID, PLATFORM, matchType);
    for (const match of matches) {
      await db.match.upsert({
        where: { eaMatchId: match.eaMatchId },
        update: {
          goalsFor: match.goalsFor,
          goalsAgainst: match.goalsAgainst,
          result: match.result,
        },
        create: {
          eaMatchId: match.eaMatchId,
          clubId: club.id,
          matchType: match.matchType,
          playedAt: match.playedAt,
          opponentName: match.opponentName,
          opponentCrestUrl: match.opponentCrestUrl,
          goalsFor: match.goalsFor,
          goalsAgainst: match.goalsAgainst,
          result: match.result,
        },
      });
      totalMatches++;
    }
  }
  console.log(`[sync] ${totalMatches} partidas sincronizadas`);

  return { clubId: club.id, members: members.length, matches: totalMatches };
}

// Permite rodar `npm run sync` direto via tsx
if (require.main === module) {
  syncClubData()
    .then((r) => {
      console.log("[sync] concluído", r);
      process.exit(0);
    })
    .catch((err) => {
      console.error("[sync] erro fatal", err);
      process.exit(1);
    });
}
