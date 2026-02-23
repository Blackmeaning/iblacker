import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const row = await prisma.project.create({
    data: {
      prompt: "Seed test (browser GET)",
      mode: "Seed",
      result: { ok: true, ts: new Date().toISOString() } as any,
    },
    select: { id: true },
  });

  const count = await prisma.project.count();
  return NextResponse.json({ ok: true, createdId: row.id, projectsCount: count });
}