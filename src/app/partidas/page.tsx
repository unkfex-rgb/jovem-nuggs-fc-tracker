// Fase 2 — Jovem Nuggs FC
// Página de partidas conectada ao banco de dados local.

import { MatchHistoryList } from "@/components/MatchHistoryList";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function MatchesPage() {
  const matches = await db.match.findMany({
    orderBy: { playedAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-3 font-mono text-xs text-fog-500">
          <span className="text-mint-400">$</span> git log --club jovem-nuggs-fc
        </p>
        <h1 className="font-mono text-2xl font-bold text-paper-100">Histórico de partidas</h1>
        <p className="mt-1 text-sm text-fog-500">League, playoff e amistosos, mais recentes primeiro.</p>
      </div>

      <MatchHistoryList matches={matches as any} />
    </div>
  );
}
