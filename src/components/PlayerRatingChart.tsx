"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface RatingPoint {
  match: string;
  rating: number;
}

export function PlayerRatingChart({ data }: { data: RatingPoint[] }) {
  return (
    <div className="h-56 w-full font-mono text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1B2426" />
          <XAxis dataKey="match" stroke="#6B7876" tickLine={false} axisLine={false} />
          <YAxis
            domain={[5, 10]}
            stroke="#6B7876"
            tickLine={false}
            axisLine={false}
            width={30}
          />
          <Tooltip
            contentStyle={{
              background: "#0B1112",
              border: "1px solid #283335",
              borderRadius: 8,
              fontFamily: "var(--font-jetbrains)",
              fontSize: 12,
            }}
            labelStyle={{ color: "#9FB0AD" }}
            itemStyle={{ color: "#00E5A0" }}
          />
          <Line
            type="monotone"
            dataKey="rating"
            stroke="#00E5A0"
            strokeWidth={2}
            dot={{ r: 3, fill: "#00E5A0", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
