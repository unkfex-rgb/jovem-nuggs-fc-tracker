import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPercent(part: number, total: number): string {
  if (total === 0) return "0%";
  return `${((part / total) * 100).toFixed(1)}%`;
}

export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const hours = Math.floor(seconds / 3600);
  if (hours < 1) return "há poucos minutos";
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  return `há ${days}d`;
}

export function resultLabel(result: "WIN" | "DRAW" | "LOSS"): { label: string; short: string } {
  switch (result) {
    case "WIN":
      return { label: "Vitória", short: "V" };
    case "DRAW":
      return { label: "Empate", short: "E" };
    case "LOSS":
      return { label: "Derrota", short: "D" };
  }
}
