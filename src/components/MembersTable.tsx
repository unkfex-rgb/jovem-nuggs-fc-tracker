"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { MemberSummary } from "@/lib/types";
import { Badge } from "./ui/Badge";
import { cn, formatPercent } from "@/lib/utils";

type SortKey = "overallRating" | "gamesPlayed" | "goals" | "avgMatchRating" | "passAccuracy";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "overallRating", label: "Rating" },
  { key: "gamesPlayed", label: "Jogos" },
  { key: "goals", label: "Gols" },
  { key: "avgMatchRating", label: "Média" },
  { key: "passAccuracy", label: "Passe %" },
];

const POSITION_TONE = {
  GOALKEEPER: "amber",
  DEFENDER: "violet",
  MIDFIELDER: "mint",
  FORWARD: "coral",
  ANY: "neutral",
} as const;

const POSITION_LABEL = {
  GOALKEEPER: "GOL",
  DEFENDER: "ZAG",
  MIDFIELDER: "MEI",
  FORWARD: "ATA",
  ANY: "—",
} as const;

export function MembersTable({ members }: { members: MemberSummary[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("overallRating");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const rows = useMemo(() => {
    const withDerived = members.map((m) => ({
      ...m,
      passAccuracy: m.passesAttempted > 0 ? (m.passesMade / m.passesAttempted) * 100 : 0,
    }));

    return withDerived.sort((a, b) => {
      const diff = a[sortKey] - b[sortKey];
      return sortDir === "desc" ? -diff : diff;
    });
  }, [members, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-ink-700/60">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-mint-500/10 text-left font-mono text-[11px] uppercase tracking-wider text-mint-400">
            <th className="px-4 py-3 font-medium">Jogador</th>
            {COLUMNS.map((col) => (
              <th key={col.key} className="px-4 py-3 font-medium">
                <button
                  onClick={() => toggleSort(col.key)}
                  className="flex items-center gap-1 transition-colors hover:text-mint-300"
                >
                  {col.label}
                  {sortKey === col.key && <span>{sortDir === "desc" ? "↓" : "↑"}</span>}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((m, i) => (
            <tr
              key={m.eaMemberId}
              className={cn(
                "border-t border-ink-700/60 transition-colors hover:bg-ink-800/60",
                i % 2 === 0 ? "bg-ink-900/30" : "bg-transparent"
              )}
            >
              <td className="px-4 py-3">
                <Link
                  href={`/jogador/${m.gamertag}`}
                  className="flex items-center gap-3 font-medium text-paper-100 hover:text-mint-400"
                >
                  <Badge tone={POSITION_TONE[m.position]}>{POSITION_LABEL[m.position]}</Badge>
                  {m.gamertag}
                </Link>
              </td>
              <td className="px-4 py-3 font-mono tabular-nums text-paper-100">
                {m.overallRating}
              </td>
              <td className="px-4 py-3 font-mono tabular-nums text-fog-300">{m.gamesPlayed}</td>
              <td className="px-4 py-3 font-mono tabular-nums text-fog-300">{m.goals}</td>
              <td className="px-4 py-3 font-mono tabular-nums text-fog-300">
                {m.avgMatchRating.toFixed(1)}
              </td>
              <td className="px-4 py-3 font-mono tabular-nums text-fog-300">
                {formatPercent(m.passesMade, m.passesAttempted)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
