import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body?.prompt) {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }

  // Mock output (next step we replace with real AI + agents)
  const result = {
    ok: true,
    prompt: body.prompt,
    mode: body.mode ?? "Design",
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
        content:
          "This is a placeholder. Next step: connect OpenAI/Gemini and multi-agent generation.",
      },
    ],
  };

  return NextResponse.json(result);
}