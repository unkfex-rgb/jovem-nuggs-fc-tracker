// Fase 2 — Jovem Nuggs FC
// Página de membros conectada ao banco de dados local.

import { MembersTable } from "@/components/MembersTable";
import { Card, CardLabel } from "@/components/ui/Card";
import { StatReadout } from "@/components/ui/StatReadout";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const POSITIONS = ["GOALKEEPER", "DEFENDER", "MIDFIELDER", "FORWARD"] as const;
const POSITION_LABEL: Record<(typeof POSITIONS)[number], string> = {
  GOALKEEPER: "Goleiros",
  DEFENDER: "Zagueiros",
  MIDFIELDER: "Meias",
  FORWARD: "Atacantes",
};

export default async function MembersPage() {
  const members = await db.member.findMany({
    orderBy: { overallRating: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-3 font-mono text-xs text-fog-500">
          <span className="text-mint-400">$</span> ls elenco/ --total {members.length}
        </p>
        <h1 className="font-mono text-2xl font-bold text-paper-100">Elenco</h1>
        <p className="mt-1 text-sm text-fog-500">
          Clique num jogador pra ver o perfil individual. Clique num cabeçalho de coluna
          pra ordenar.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {POSITIONS.map((pos) => (
          <Card key={pos}>
            <CardLabel>{POSITION_LABEL[pos]}</CardLabel>
            <StatReadout
              label=""
              value={members.filter((m) => m.position === pos).length}
              tone="mint"
            />
          </Card>
        ))}
      </div>

      <MembersTable members={members as any} />
    </div>
  );
}
