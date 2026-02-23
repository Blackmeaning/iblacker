import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const count = await prisma.project.count();
    return NextResponse.json({ ok: true, projectsCount: count });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, message: e?.message || String(e), stack: e?.stack || null },
      { status: 500 }
    );
  }
}