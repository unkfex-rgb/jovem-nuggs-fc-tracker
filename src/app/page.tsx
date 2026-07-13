// Fase 4 — Jovem Nuggs FC
// Home Page com Analytics reais e Forma Recente.

import { ClubHeader } from "@/components/ClubHeader";
import { RecordDonut } from "@/components/RecordDonut";
import { MatchHistoryList } from "@/components/MatchHistoryList";
import { Card, CardLabel } from "@/components/ui/Card";
import { StatReadout } from "@/components/ui/StatReadout";
import { Badge } from "@/components/ui/Badge";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const club = await db.club.findFirst({
    where: { eaClubId: process.env.EA_CLUB_ID ?? "8044401" },
    include: {
      members: true,
      matches: {
        orderBy: { playedAt: "desc" },
        take: 10,
      },
    },
  });

  if (!club) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-mono text-2xl text-coral-500">DADOS NÃO ENCONTRADOS</h1>
        <p className="max-w-md text-fog-500">
          O banco de dados local ainda não possui informações do clube. 
          Execute o comando <code className="text-mint-400">npm run sync</code> para buscar os dados da EA.
        </p>
      </div>
    );
  }

  const members = club.members;
  const matches = club.matches;
  const totalMatches = club.wins + club.draws + club.losses;

  const topScorer = [...members].sort((a, b) => b.goals - a.goals)[0];
  const bestRating = [...members].sort((a, b) => b.avgMatchRating - a.avgMatchRating)[0];
  
  // Analytics extra: Melhor passador (mínimo 5 jogos)
  const bestPasser = [...members]
    .filter(m => m.gamesPlayed >= 5)
    .sort((a, b) => {
      const accA = a.passesAttempted > 0 ? a.passesMade / a.passesAttempted : 0;
      const accB = b.passesAttempted > 0 ? b.passesMade / b.passesAttempted : 0;
      return accB - accA;
    })[0];

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-3 font-mono text-xs text-fog-500">
          <span className="text-mint-400">$</span> fetch club --id {club.eaClubId}
        </p>
        <ClubHeader club={club as any} />
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardLabel>Partidas jogadas</CardLabel>
          <StatReadout label="total" value={totalMatches} size="lg" />
        </Card>
        <Card>
          <CardLabel>Gols</CardLabel>
          <div className="flex gap-6">
            <StatReadout label="marcados" value={club.goalsFor} tone="mint" size="lg" />
            <StatReadout label="sofridos" value={club.goalsAgainst} tone="coral" size="lg" />
          </div>
        </Card>
        <Card>
          <CardLabel>Saldo de gols</CardLabel>
          <StatReadout
            label="diferença"
            value={club.goalsFor - club.goalsAgainst >= 0 ? `+${club.goalsFor - club.goalsAgainst}` : club.goalsFor - club.goalsAgainst}
            tone={club.goalsFor - club.goalsAgainst >= 0 ? "mint" : "coral"}
            size="lg"
          />
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-[1fr_1.4fr]">
        <RecordDonut wins={club.wins} draws={club.draws} losses={club.losses} />

        <Card hud>
          <CardLabel>Destaques do elenco</CardLabel>
          <div className="mt-2 space-y-4">
            {topScorer && (
              <HighlightRow
                tone="mint"
                tag="ARTILHEIRO"
                name={topScorer.gamertag}
                value={`${topScorer.goals} gols`}
              />
            )}
            {bestRating && (
              <HighlightRow
                tone="violet"
                tag="MELHOR MÉDIA"
                name={bestRating.gamertag}
                value={bestRating.avgMatchRating.toFixed(1)}
              />
            )}
            {bestPasser && (
              <HighlightRow
                tone="neutral"
                tag="MESTRE DO PASSE"
                name={bestPasser.gamertag}
                value={`${Math.round((bestPasser.passesMade / (bestPasser.passesAttempted || 1)) * 100)}% acc`}
              />
            )}
            {!topScorer && (
              <p className="py-4 text-center font-mono text-xs text-fog-600 uppercase">
                Aguardando estatísticas dos membros...
              </p>
            )}
          </div>
        </Card>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-mono text-sm uppercase tracking-widest text-fog-500">
            Últimas partidas
          </h2>
          <Badge tone="neutral">{matches.length} recentes</Badge>
        </div>
        <MatchHistoryList matches={matches as any} />
      </section>
    </div>
  );
}

function HighlightRow({
  tone,
  tag,
  name,
  value,
}: {
  tone: "mint" | "violet" | "neutral";
  tag: string;
  name: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-ink-700/60 bg-ink-900/40 px-4 py-3">
      <div className="flex items-center gap-3">
        <Badge tone={tone}>{tag}</Badge>
        <span className="font-medium text-paper-100">{name}</span>
      </div>
      <span className="font-mono font-bold text-paper-100">{value}</span>
    </div>
  );
}
