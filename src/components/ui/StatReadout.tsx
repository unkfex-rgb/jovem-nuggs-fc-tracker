import { cn } from "@/lib/utils";

interface StatReadoutProps {
  label: string;
  value: string | number;
  tone?: "mint" | "coral" | "amber" | "default";
  size?: "sm" | "lg";
}

const TONE_TEXT: Record<NonNullable<StatReadoutProps["tone"]>, string> = {
  mint: "text-mint-400",
  coral: "text-coral-400",
  amber: "text-amber-400",
  default: "text-paper-100",
};

export function StatReadout({ label, value, tone = "default", size = "sm" }: StatReadoutProps) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-widest text-fog-500">{label}</p>
      <p
        className={cn(
          "font-mono font-bold tabular-nums",
          size === "lg" ? "text-4xl" : "text-xl",
          TONE_TEXT[tone]
        )}
      >
        {value}
      </p>
    </div>
  );
}
