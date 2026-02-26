import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const mode = body?.mode;
  const category = body?.category;
  const prompt = body?.prompt;
  const title = body?.title;
  const result = body?.result;

  if (!mode || !category || !prompt || !result) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const created = await prisma.project.create({
    data: {
      userId: session.user.id,
      mode,
      category,
      title: title ?? null,
      prompt,
      result,
      status: "SAVED",
      provider: "mock",
      model: "mock-v1",
      tokensIn: 0,
      tokensOut: 0,
      costUsd: 0,
    },
    select: { id: true },
  });

  return NextResponse.json({ id: created.id });
}
