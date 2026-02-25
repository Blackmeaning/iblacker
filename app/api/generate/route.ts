import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateAI } from "@/lib/ai/router";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const prompt = body?.prompt?.trim();
  const mode = (body?.mode?.trim() || "Design") as string;

  if (!prompt) {
    return NextResponse.json({ error: "prompt required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  const result = await generateAI({ prompt, mode });

  const saved = await prisma.project.create({
    data: {
      prompt,
      mode,
      result: result as any,
      userId: user?.id ?? null,
    } as any,
    select: { id: true },
  });

  return NextResponse.json({ ok: true, mode, result, projectId: saved.id });
}