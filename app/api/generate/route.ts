import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const prompt = body?.prompt?.trim();
  const mode = body?.mode?.trim() || "Design";

  if (!prompt) {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }

  const result = {
    ok: true,
    prompt,
    mode,
    plan: [
      "Understand goal + target audience",
      "Select best template + layout",
      "Generate assets (copy, colors, typography)",
      "Produce final export (web, image, video, etc.)",
    ],
    outputs: [
      {
        type: "text",
        title: "Generated Plan",
        content: "Saved to database ✅ (Step 13: real AI + agents).",
      },
    ],
  };

  const saved = await prisma.project.create({
    data: { prompt, mode, result },
  });

  return NextResponse.json({ ...result, projectId: saved.id });
}