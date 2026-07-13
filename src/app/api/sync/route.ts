import { NextRequest, NextResponse } from "next/server";
import { syncClubData } from "@/scripts/sync-club-data";

// Protegida por CRON_SECRET — configurar o cron (Vercel Cron / GitHub Actions)
// pra chamar isto a cada 3-6h com o header abaixo.
//
//   Authorization: Bearer <CRON_SECRET>

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;

  if (!process.env.CRON_SECRET || authHeader !== expected) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const result = await syncClubData();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[sync] falhou", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Erro desconhecido" },
      { status: 502 }
    );
  }
}
