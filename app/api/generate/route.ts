import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAI } from "@/lib/ai/router";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const prompt = body?.prompt?.trim();
    const mode = body?.mode?.trim() || "Design";

    if (!prompt) {
      return NextResponse.json({ error: "prompt required" }, { status: 400 });
    }

    const session = await auth();
    // @ts-expect-error added by types/next-auth.d.ts
    const userId: string | null = session?.user?.id ?? null;

    const result = await generateAI({ prompt, mode });

    const data: any = {
      prompt,
      mode,
      result: result as any,
    };
    if (userId) data.userId = userId;

    const saved = await prisma.project.create({
      data,
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