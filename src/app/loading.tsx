// Fase 5 — Jovem Nuggs FC
// Skeleton de loading global com geometria condizente ao conteúdo real.

export default function Loading() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Cabeçalho */}
      <div className="h-36 rounded-2xl border border-ink-700/60 bg-ink-800/40" />
      
      {/* Grid de Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 rounded-xl border border-ink-700/60 bg-ink-800/40" />
        ))}
      </div>
      
      {/* Conteúdo Principal */}
      <div className="grid gap-4 sm:grid-cols-[1fr_1.4fr]">
        <div className="h-64 rounded-xl border border-ink-700/60 bg-ink-800/40" />
        <div className="h-64 rounded-xl border border-ink-700/60 bg-ink-800/40" />
      </div>

      {/* Lista/Tabela */}
      <div className="space-y-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 rounded-lg border border-ink-700/40 bg-ink-900/40" />
        ))}
      </div>
    </div>
  );
}
