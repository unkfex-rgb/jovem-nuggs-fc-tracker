// TODO (Fase 3): trocar mock-data por leitura real do banco (Member +
// MatchAppearance) filtrando por gamertag. Se não achar, usar notFound().

import { notFound } from "next/navigation";
import { Card, CardLabel } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatReadout } from "@/components/ui/StatReadout";
import { PlayerRatingChart } from "@/components/PlayerRatingChart";
import { mockMembers } from "@/lib/mock-data";
import { formatPercent } from "@/lib/utils";

const POSITION_LABEL = {
  GOALKEEPER: "Goleiro",
  DEFENDER: "Zagueiro",
  MIDFIELDER: "Meia",
  FORWARD: "Atacante",
  ANY: "—",
} as const;

// Últimas notas de exemplo — Fase 3: puxar de MatchAppearance de verdade.
function mockRecentRatings(seed: number) {
  return Array.from({ length: 8 }, (_, i) => ({
    match: `#${i + 1}`,
    rating: Number((6 + ((seed + i * 3) % 30) / 10).toFixed(1)),
  }));
}

export default function PlayerPage({ params }: { params: { tag: string } }) {
  const member = mockMembers.find(
    (m) => m.gamertag.toLowerCase() === decodeURIComponent(params.tag).toLowerCase()
  );

  if (!member) notFound();

  const ratingHistory = mockRecentRatings(member.eaMemberId.length + member.goals);

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-3 font-mono text-xs text-fog-500">
          <span className="text-mint-400">$</span> cat jogadores/{member.gamertag}.json
        </p>
        <div className="flex items-center gap-3">
          <h1 className="font-mono text-2xl font-bold text-paper-100">{member.gamertag}</h1>
          <Badge tone="mint">{POSITION_LABEL[member.position]}</Badge>
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

      <Card hud>
        <CardLabel>Evolução de nota — últimas partidas</CardLabel>
        <PlayerRatingChart data={ratingHistory} />
      </Card>
    </div>
  );
}
