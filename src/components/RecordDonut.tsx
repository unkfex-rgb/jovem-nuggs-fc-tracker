"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Card, CardLabel } from "./ui/Card";
import { formatPercent } from "@/lib/utils";

interface RecordDonutProps {
  wins: number;
  draws: number;
  losses: number;
}

const COLORS = { wins: "#00E5A0", draws: "#FFC65B", losses: "#FF5470" };

export function RecordDonut({ wins, draws, losses }: RecordDonutProps) {
  const total = wins + draws + losses;
  const data = [
    { key: "wins", label: "Vitórias", value: wins, color: COLORS.wins },
    { key: "draws", label: "Empates", value: draws, color: COLORS.draws },
    { key: "losses", label: "Derrotas", value: losses, color: COLORS.losses },
  ];

  return (
    <Card>
      <CardLabel>Aproveitamento</CardLabel>
      <div className="flex items-center gap-6">
        <div className="h-32 w-32 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={38}
                outerRadius={56}
                startAngle={90}
                endAngle={-270}
                stroke="#0B1112"
                strokeWidth={2}
              >
                {data.map((entry) => (
                  <Cell key={entry.key} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="flex-1 space-y-2 font-mono text-sm">
          {data.map((entry) => (
            <li key={entry.key} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-fog-300">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.label}
              </span>
              <span className="tabular-nums text-paper-100">
                {formatPercent(entry.value, total)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
