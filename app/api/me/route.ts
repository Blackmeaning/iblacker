import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/currentUser";

export const runtime = "nodejs";

type PatchBody = {
  name?: string;
  autoTopUp?: boolean;
  autoTopUpThreshold?: number;
  autoTopUpAmount?: number;
};

function toInt(v: unknown, fallback: number): number {
  if (typeof v === "number" && Number.isFinite(v)) return Math.trunc(v);
  if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v))) return Math.trunc(Number(v));
  return fallback;
}

export async function GET() {
  const userId = await requireUserId();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      plan: true,
      creditsBalance: true,
      monthlyCredits: true,
      autoTopUp: true,
      autoTopUpThreshold: true,
      autoTopUpAmount: true,
    },
  });

  return NextResponse.json({ user });
}

export async function PATCH(req: Request) {
  const userId = await requireUserId();

  let body: PatchBody = {};
  try {
    body = (await req.json()) as PatchBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const data: {
    name?: string;
    autoTopUp?: boolean;
    autoTopUpThreshold?: number;
    autoTopUpAmount?: number;
  } = {};

  if (typeof body.name === "string") data.name = body.name.trim().slice(0, 80);

  if (typeof body.autoTopUp === "boolean") data.autoTopUp = body.autoTopUp;

  if (body.autoTopUpThreshold !== undefined) {
    const th = toInt(body.autoTopUpThreshold, 2000);
    data.autoTopUpThreshold = Math.max(0, Math.min(th, 1_000_000));
  }

  if (body.autoTopUpAmount !== undefined) {
    const am = toInt(body.autoTopUpAmount, 10000);
    data.autoTopUpAmount = Math.max(0, Math.min(am, 5_000_000));
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      plan: true,
      creditsBalance: true,
      monthlyCredits: true,
      autoTopUp: true,
      autoTopUpThreshold: true,
      autoTopUpAmount: true,
    },
  });

  return NextResponse.json({ ok: true, user });
}
