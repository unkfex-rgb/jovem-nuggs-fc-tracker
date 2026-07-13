import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hud?: boolean; // aplica os cantos estilo HUD (usar com moderação)
}

export function Card({ className, hud, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-ink-700/60 bg-ink-800/60 p-5 shadow-card backdrop-blur-sm",
        hud && "hud-corners",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-fog-500">
      {children}
    </p>
  );
}
