import Image from "next/image";
import type { ClubOverview } from "@/lib/types";
import { Badge } from "./ui/Badge";
import { StatReadout } from "./ui/StatReadout";
import { timeAgo } from "@/lib/utils";

export function ClubHeader({ club }: { club: ClubOverview }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-ink-700/60 bg-ink-800/40 p-6 sm:p-8">
      <div className="pointer-events-none absolute inset-0 bg-grid-fade" />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-mint-500/30 bg-ink-900 shadow-glow sm:h-20 sm:w-20">
            {club.crestUrl ? (
              <Image
                src={club.crestUrl}
                alt={`Escudo do ${club.name}`}
                width={56}
                height={56}
                className="opacity-90"
              />
            ) : (
              <span className="font-mono text-2xl font-bold text-mint-400">
                {club.name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-fog-500">
              rankings / club overview
            </p>
            <h1 className="font-mono text-2xl font-bold text-paper-100 sm:text-3xl">
              {club.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {club.reputationTier && <Badge tone="mint">{club.reputationTier}</Badge>}
              {club.lastSyncedAt && (
                <span className="font-mono text-[11px] text-fog-500">
                  sincronizado {timeAgo(club.lastSyncedAt)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 sm:gap-8">
          <StatReadout label="rating" value={club.skillRating} tone="mint" size="lg" />
          <div className="flex gap-4">
            <StatReadout label="V" value={club.wins} tone="mint" />
            <StatReadout label="E" value={club.draws} tone="amber" />
            <StatReadout label="D" value={club.losses} tone="coral" />
          </div>
        </div>
      </div>
    </div>
  );
}
