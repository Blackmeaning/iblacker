// /app/api/generate/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAI } from "@/lib/ai/router";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const prompt = body?.prompt?.trim();
    const mode = body?.mode?.trim() || "Design";

    if (!prompt) {
      return NextResponse.json({ error: "prompt required" }, { status: 400 });
    }

    const result = await generateAI({ prompt, mode });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    const saved = await prisma.project.create({
      // Cast to any to avoid type mismatch if Vercel Prisma client is stale.
      data: {
        prompt,
        mode,
        result: result as any,
        userId: user?.id ?? null,
      } as any,
      select: { id: true },
    });

    return NextResponse.json({ ok: true, mode, result, projectId: saved.id });
  } catch (e: any) {
    return NextResponse.json(
      { error: "generate_failed", message: e?.message || String(e) },
      { status: 500 }
    );
  }
}