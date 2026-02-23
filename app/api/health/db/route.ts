import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const count = await prisma.project.count();

    // Works on Postgres (Neon). If it fails, we still return count.
    let db: string | null = null;
    try {
      const rows = await prisma.$queryRaw<{ current_database: string }[]>`
        SELECT current_database()
      `;
      db = rows?.[0]?.current_database ?? null;
    } catch {}

    return NextResponse.json({
      ok: true,
      projectsCount: count,
      database: db,
      envHasDbUrl: Boolean(process.env.DATABASE_URL),
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || String(e) },
      { status: 500 }
    );
  }
}