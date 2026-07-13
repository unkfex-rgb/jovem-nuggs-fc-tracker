import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { fetchClubOverview, fetchClubMembers, fetchClubMatches } from "@/lib/ea-client";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // overview, members, matches

  const CLUB_ID = process.env.EA_CLUB_ID ?? "8044401";
  const PLATFORM = process.env.EA_PLATFORM ?? "common-gen5";

  try {
    if (type === "overview" || !type) {
      const overview = await fetchClubOverview(CLUB_ID, PLATFORM);
      await db.club.upsert({
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
    }

    if (type === "members" || !type) {
      const members = await fetchClubMembers(CLUB_ID, PLATFORM);
      const club = await db.club.findUnique({ where: { eaClubId: CLUB_ID } });
      if (club) {
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
      }
    }

    if (type === "matches" || !type) {
      const club = await db.club.findUnique({ where: { eaClubId: CLUB_ID } });
      if (club) {
        for (const matchType of ["LEAGUE", "PLAYOFF", "FRIENDLY"] as const) {
          const matches = await fetchClubMatches(CLUB_ID, PLATFORM, matchType);
          for (const m of matches) {
            const match = await db.match.upsert({
              where: { eaMatchId: m.eaMatchId },
              update: {
                goalsFor: m.goalsFor,
                goalsAgainst: m.goalsAgainst,
                result: m.result,
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
              },
            });

            if (m.players) {
              for (const p of m.players) {
                const member = await db.member.findFirst({ where: { gamertag: p.gamertag } });
                if (member) {
                  await db.matchAppearance.upsert({
                    where: { matchId_memberId: { matchId: match.id, memberId: member.id } },
                    update: { rating: p.rating, goals: p.goals, assists: p.assists, motm: p.motm },
                    create: { matchId: match.id, memberId: member.id, rating: p.rating, goals: p.goals, assists: p.assists, motm: p.motm },
                  });
                }
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true, type: type || "all" });
  } catch (error: any) {
    console.error("Sync error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
