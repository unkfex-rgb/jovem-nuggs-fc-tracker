/**
 * Sincroniza os dados do clube com a EA e persiste no banco.
 * Otimizado para evitar timeouts na Vercel (processamento sequencial).
 */

import { db } from "../lib/db";
import { fetchClubOverview, fetchClubMembers, fetchClubMatches } from "../lib/ea-client";
import type { MatchType } from "../lib/types";

const CLUB_ID = process.env.EA_CLUB_ID ?? "8044401";
const PLATFORM = process.env.EA_PLATFORM ?? "common-gen5";
const MATCH_TYPES: MatchType[] = ["LEAGUE", "PLAYOFF", "FRIENDLY"];

export async function syncClubData() {
  console.log(`[sync] iniciando sincronização do clube ${CLUB_ID}...`);

  // 1. Sincronizar Overview do Clube
  let club;
  try {
    const overview = await fetchClubOverview(CLUB_ID, PLATFORM);
    club = await db.club.upsert({
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
    console.log(`[sync] clube ok: ${club.name}`);
  } catch (err) {
    console.error(`[sync] erro ao sincronizar overview:`, err);
    throw err; // Se falhar o básico, não adianta continuar
  }

  // 2. Sincronizar Membros
  try {
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
  } catch (err) {
    console.error(`[sync] erro ao sincronizar membros (continuando para partidas):`, err);
  }

  // 3. Sincronizar Partidas (um tipo por vez para evitar timeout)
  let totalMatches = 0;
  for (const matchType of MATCH_TYPES) {
    try {
      console.log(`[sync] buscando partidas tipo ${matchType}...`);
      const matches = await fetchClubMatches(CLUB_ID, PLATFORM, matchType);
      
      for (const m of matches) {
        const match = await db.match.upsert({
          where: { eaMatchId: m.eaMatchId },
          update: {
            goalsFor: m.goalsFor,
            goalsAgainst: m.goalsAgainst,
            result: m.result,
            rawPayload: JSON.stringify(m.raw),
          },
          create: {
            eaMatchId: m.eaMatchId,
            clubId: club.id,
            matchType: m.matchType,
            playedAt: m.playedAt,
            opponentName: m.opponentName,
            opponentCrestUrl: m.opponentCrestUrl,
            goalsFor: m.goalsFor,
            goalsAgainst: m.goalsAgainst,
            result: m.result,
            rawPayload: JSON.stringify(m.raw),
          },
        });

        // Aparições individuais
        if (m.players && m.players.length > 0) {
          for (const p of m.players) {
            const member = await db.member.findFirst({
              where: { gamertag: p.gamertag }
            });

            if (member) {
              await db.matchAppearance.upsert({
                where: {
                  matchId_memberId: {
                    matchId: match.id,
                    memberId: member.id
                  }
                },
                update: {
                  rating: p.rating,
                  goals: p.goals,
                  assists: p.assists,
                  passesMade: p.passesMade,
                  passesAttempted: p.passesAttempted,
                  motm: p.motm,
                },
                create: {
                  matchId: match.id,
                  memberId: member.id,
                  rating: p.rating,
                  goals: p.goals,
                  assists: p.assists,
                  passesMade: p.passesMade,
                  passesAttempted: p.passesAttempted,
                  motm: p.motm,
                }
              });
            }
          }
        }
        totalMatches++;
      }
    } catch (err) {
      console.error(`[sync] erro ao sincronizar partidas ${matchType}:`, err);
    }
  }
  console.log(`[sync] ${totalMatches} partidas sincronizadas no total`);

  return { clubId: club.id, matches: totalMatches };
}

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
