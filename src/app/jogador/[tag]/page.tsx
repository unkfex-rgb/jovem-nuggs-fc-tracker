// Fase 3 — Jovem Nuggs FC
// Perfil individual do jogador conectado ao banco de dados real.

import { notFound } from "next/navigation";
import { Card, CardLabel } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatReadout } from "@/components/ui/StatReadout";
import { PlayerRatingChart } from "@/components/PlayerRatingChart";
import { db } from "@/lib/db";
import { formatPercent } from "@/lib/utils";

export const dynamic = "force-dynamic";

const POSITION_LABEL = {
  GOALKEEPER: "Goleiro",
  DEFENDER: "Zagueiro",
  MIDFIELDER: "Meia",
  FORWARD: "Atacante",
  ANY: "—",
} as const;

export default async function PlayerPage({ params }: { params: { tag: string } }) {
  const gamertag = decodeURIComponent(params.tag);
  
  const member = await db.member.findFirst({
    where: { 
      gamertag: {
        equals: gamertag
      }
    },
    include: {
      appearances: {
        include: {
          match: true,
        },
        orderBy: {
          match: { playedAt: "desc" },
        },
        take: 10,
      },
    },
  });

  if (!member) notFound();

  const ratingHistory = member.appearances
    .map((app, i) => ({
      match: app.match.playedAt.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      rating: app.rating,
    }))
    .reverse();

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-3 font-mono text-xs text-fog-500">
          <span className="text-mint-400">$</span> cat jogadores/{member.gamertag}.json
        </p>
        <div className="flex items-center gap-3">
          <h1 className="font-mono text-2xl font-bold text-paper-100">{member.gamertag}</h1>
          <Badge tone="mint">{POSITION_LABEL[member.position as keyof typeof POSITION_LABEL] || "—"}</Badge>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardLabel>Overall</CardLabel>
          <StatReadout label="" value={member.overallRating} tone="mint" size="lg" />
        </Card>
        <Card>
          <CardLabel>Jogos</CardLabel>
          <StatReadout label="" value={member.gamesPlayed} size="lg" />
        </Card>
        <Card>
          <CardLabel>Gols / Assistências</CardLabel>
          <StatReadout label="" value={`${member.goals} / ${member.assists}`} size="lg" />
        </Card>
        <Card>
          <CardLabel>Precisão de passe</CardLabel>
          <StatReadout
            label=""
            value={formatPercent(member.passesMade, member.passesAttempted)}
            size="lg"
          />
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card hud>
          <CardLabel>Evolução de nota — últimas partidas</CardLabel>
          <PlayerRatingChart data={ratingHistory} />
        </Card>

        <Card>
          <CardLabel>Últimas atuações</CardLabel>
          <div className="mt-4 space-y-3">
            {member.appearances.length > 0 ? (
              member.appearances.map((app) => (
                <div 
                  key={app.id} 
                  className="flex items-center justify-between rounded-lg border border-ink-700/60 bg-ink-900/40 px-4 py-3"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-mono text-fog-500 uppercase tracking-tighter">
                      vs {app.match.opponentName}
                    </span>
                    <span className="text-[10px] text-fog-600">
                      {app.match.playedAt.toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    {app.goals > 0 && <Badge tone="mint">{app.goals} G</Badge>}
                    {app.motm && <Badge tone="violet">MOTM</Badge>}
                    <span className="font-mono text-lg font-bold text-paper-100">
                      {app.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-8 text-center font-mono text-xs text-fog-600 uppercase">
                Nenhuma atuação registrada no cache.
              </p>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}
