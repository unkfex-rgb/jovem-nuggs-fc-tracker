import { cn } from "@/lib/utils";

type Tone = "mint" | "violet" | "coral" | "amber" | "neutral";

const TONE_STYLES: Record<Tone, string> = {
  mint: "bg-mint-500/10 text-mint-400 border-mint-500/30",
  violet: "bg-violet-500/10 text-violet-400 border-violet-500/30",
  coral: "bg-coral-500/10 text-coral-400 border-coral-500/30",
  amber: "bg-amber-400/10 text-amber-400 border-amber-400/30",
  neutral: "bg-ink-700/60 text-fog-300 border-ink-600",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium",
        TONE_STYLES[tone]
      )}
    >
      {children}
    </span>
  );
}
