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

    const result = await generateAI({ prompt, mode });

    const session = await auth();
    const userEmail = session?.user?.email ?? null;

    const saved = await prisma.project.create({
      data: {
        prompt,
        mode,
        result: result as any,
        // userId: null, // later when DB session strategy is enabled
        // userEmail,     // if you add this column
      } as any,
      select: { id: true },
    });

    return NextResponse.json({ ok: true, mode, result, projectId: saved.id, userEmail });
  } catch (e: any) {
    return NextResponse.json(
      { error: "generate_failed", message: e?.message || String(e) },
      { status: 500 }
    );
  }
}