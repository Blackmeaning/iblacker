import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAI } from "@/lib/ai/router";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const prompt = body?.prompt?.trim();
  const mode = body?.mode?.trim() || "Design";

  if (!prompt) {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }

  const aiResult = await generateAI({ prompt, mode });

  const saved = await prisma.project.create({
    data: {
      prompt,
      mode,
      result: aiResult,
    },
  });

  return NextResponse.json({
    ...aiResult,
    projectId: saved.id,
  });
}