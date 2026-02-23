import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function mask(url?: string) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.password) u.password = "****";
    return u.toString();
  } catch {
    return "INVALID_DATABASE_URL";
  }
}

export async function GET() {
  try {
    const count = await prisma.project.count();

    let currentDb: string | null = null;
    try {
      const rows = await prisma.$queryRaw<{ current_database: string }[]>`
        SELECT current_database()
      `;
      currentDb = rows?.[0]?.current_database ?? null;
    } catch {}

    return NextResponse.json({
      ok: true,
      projectsCount: count,
      currentDb,
      DATABASE_URL_masked: mask(process.env.DATABASE_URL),
      envHasDbUrl: Boolean(process.env.DATABASE_URL),
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || String(e) },
      { status: 500 }
    );
  }
}