// TODO (Fase 2): trocar mock-data por leitura real do banco, com paginação
// (a EA costuma limitar quantas partidas voltam por chamada — ver docs/ea-endpoints.md).

import { MatchHistoryList } from "@/components/MatchHistoryList";
import { mockMatches } from "@/lib/mock-data";

export default function MatchesPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="mb-3 font-mono text-xs text-fog-500">
          <span className="text-mint-400">$</span> git log --club jovem-nuggs-fc
        </p>
        <h1 className="font-mono text-2xl font-bold text-paper-100">Histórico de partidas</h1>
        <p className="mt-1 text-sm text-fog-500">League, playoff e amistosos, mais recentes primeiro.</p>
      </div>

      <MatchHistoryList matches={mockMatches} />
    </div>
  );
}
