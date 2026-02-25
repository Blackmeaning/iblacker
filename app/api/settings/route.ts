import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/currentUser";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const userId = await requireUserId();
  const body = await req.json().catch(() => null);

  const theme = String(body?.theme || "dark");
  const locale = String(body?.locale || "en");

  const saved = await prisma.userSettings.upsert({
    where: { userId },
    create: { userId, theme, locale },
    update: { theme, locale },
  });

  return NextResponse.json({ ok: true, settings: saved });
}