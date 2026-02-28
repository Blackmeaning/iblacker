import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/currentUser";

export const runtime = "nodejs";

function toInt(v: unknown, fallback: number): number {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  if (!Number.isFinite(n)) return fallback;
  return Math.trunc(n);
}

function parseBool(v: unknown, fallback: boolean): boolean {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") {
    const s = v.toLowerCase();
    if (s === "true") return true;
    if (s === "false") return false;
  }
  return fallback;
}

export async function GET() {
  const userId = await requireUserId();

  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      role: true,

      plan: true,
      creditsBalance: true,
      monthlyCredits: true,

      autoTopUp: true,
      autoTopUpThreshold: true,
      autoTopUpAmount: true,

      stripeCustomerId: true,
      subscription: {
        select: {
          status: true,
          stripePriceId: true,
          currentPeriodEnd: true,
        },
      },
      createdAt: true,
    },
  });

  if (!u) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ user: u });
}

export async function PATCH(req: Request) {
  const userId = await requireUserId();
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  const autoTopUp = parseBool(body.autoTopUp, false);
  const autoTopUpThreshold = Math.max(0, toInt(body.autoTopUpThreshold, 2000));
  const autoTopUpAmount = Math.max(0, toInt(body.autoTopUpAmount, 10000));

  const u = await prisma.user.update({
    where: { id: userId },
    data: {
      autoTopUp,
      autoTopUpThreshold,
      autoTopUpAmount,
    },
    select: {
      plan: true,
      creditsBalance: true,
      monthlyCredits: true,
      autoTopUp: true,
      autoTopUpThreshold: true,
      autoTopUpAmount: true,
    },
  });

  return NextResponse.json({ ok: true, user: u });
}
