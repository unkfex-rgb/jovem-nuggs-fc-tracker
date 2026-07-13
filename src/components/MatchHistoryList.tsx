"use client";

import { useState } from "react";
import type { MatchSummary, MatchType } from "@/lib/types";
import { cn, resultLabel, timeAgo } from "@/lib/utils";

const FILTERS: { key: MatchType | "ALL"; label: string }[] = [
  { key: "ALL", label: "Todos" },
  { key: "LEAGUE", label: "League" },
  { key: "PLAYOFF", label: "Playoff" },
  { key: "FRIENDLY", label: "Friendly" },
];

const RESULT_STYLES = {
  WIN: "border-mint-500/40 text-mint-400 bg-mint-500/10",
  DRAW: "border-amber-400/40 text-amber-400 bg-amber-400/10",
  LOSS: "border-coral-500/40 text-coral-400 bg-coral-500/10",
};

export function MatchHistoryList({ matches }: { matches: MatchSummary[] }) {
  const [filter, setFilter] = useState<MatchType | "ALL">("ALL");

  const filtered = filter === "ALL" ? matches : matches.filter((m) => m.matchType === filter);

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "rounded-full border px-3 py-1 font-mono text-xs transition-colors",
              filter === f.key
                ? "border-mint-500/50 bg-mint-500/10 text-mint-400"
                : "border-ink-700 text-fog-500 hover:border-ink-600 hover:text-fog-300"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Log de partidas — estilo "git log" do club terminal */}
      <ol className="space-y-2 border-l border-ink-700/60 pl-5">
        {filtered.map((match) => {
          const { label, short } = resultLabel(match.result);
          return (
            <li key={match.eaMatchId} className="relative">
              <span
                className={cn(
                  "absolute -left-[27px] top-2 flex h-4 w-4 items-center justify-center rounded-full border font-mono text-[9px] font-bold",
                  RESULT_STYLES[match.result]
                )}
              >
                {short}
              </span>
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-ink-700/60 bg-ink-800/40 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-paper-100">
                    {match.goalsFor} – {match.goalsAgainst}
                  </span>
                  <span className="text-sm text-fog-300">vs {match.opponentName}</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[11px] text-fog-500">
                  <span className="uppercase">{match.matchType.toLowerCase()}</span>
                  <span>{timeAgo(match.playedAt)}</span>
                </div>
              </div>
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="py-6 text-center font-mono text-sm text-fog-500">
            nenhuma partida encontrada nesse filtro.
          </li>
        )}
      </ol>
    </div>
  );
}
