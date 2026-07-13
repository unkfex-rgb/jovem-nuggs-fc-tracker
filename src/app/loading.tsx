// Skeleton de loading da home. Fase 5 (MANUS_PROMPT.md): replicar esse
// padrão (pulse + mesma geometria do conteúdo real) em membros/ e partidas/.

export default function Loading() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-36 rounded-2xl border border-ink-700/60 bg-ink-800/40" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 rounded-xl border border-ink-700/60 bg-ink-800/40" />
        ))}
      </div>
      <div className="h-64 rounded-xl border border-ink-700/60 bg-ink-800/40" />
    </div>
  );
}
