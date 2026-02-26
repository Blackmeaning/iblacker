import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/ai/openai";
import { z } from "zod";

const BodySchema = z.object({
  mode: z.enum(["TEXT", "CODE", "IMAGE"]),
  category: z.string().min(2).max(64),
  prompt: z.string().min(8).max(12000),
});

function env(name: string, fallback?: string) {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const { mode, category, prompt } = parsed.data;

  // --- IMAGE ---
  if (mode === "IMAGE") {
    const model = env("OPENAI_MODEL_IMAGE", "gpt-image-1");
    const r = await openai.images.generate({
      model,
      prompt: `Category: ${category}\n\n${prompt}`,
      size: "1024x1024",
    });

    const b64 = r.data?.[0]?.b64_json;
    if (!b64) return NextResponse.json({ error: "Image generation failed" }, { status: 500 });

    const title = `${category} (IMAGE)`;
    const result = {
      title,
      image: {
        mime: "image/png",
        b64,
      },
      metadata: { mode, category, model },
    };

    // Preview-only: no DB write here. Save happens in /api/projects (already implemented).
    return NextResponse.json({ title, result });
  }

  // --- TEXT/CODE ---
  const model =
    mode === "CODE"
      ? env("OPENAI_MODEL_CODE", "gpt-5.2")
      : env("OPENAI_MODEL_TEXT", "gpt-5.2");

  const system = [
    "You are IBlacker, a professional product generator.",
    "Return STRICT JSON only. No markdown, no code fences, no extra text.",
    "The JSON must match this shape exactly:",
    "{",
    '  "title": string,',
    '  "summary": string,',
    '  "sections": Array<{ "heading": string, "content": string }>,',
    '  "next_actions": string[],',
    '  "metadata": { "mode": "TEXT"|"CODE", "category": string }',
    "}",
  ].join("\n");

  const input = [
    { role: "system", content: system },
    {
      role: "user",
      content: `Mode: ${mode}\nCategory: ${category}\n\nPROMPT:\n${prompt}`,
    },
  ];

  const resp = await openai.responses.create({
    model,
    input,
  });

  const outputText = resp.output_text ?? "";
  let parsedJson: any = null;

  try {
    parsedJson = JSON.parse(outputText);
  } catch {
    // Fallback: if model didn't obey, still return something usable
    parsedJson = {
      title: `${category} (${mode})`,
      summary: "Model returned non-JSON output. Showing raw text in sections.",
      sections: [{ heading: "Output", content: outputText.slice(0, 20000) }],
      next_actions: ["Refine the prompt and generate again."],
      metadata: { mode, category },
    };
  }

  // Optional lightweight usage log (won't break if fields missing)
  try {
    await prisma.usageLog.create({
      data: {
        userId: session.user.id,
        mode,
        category,
        provider: "openai",
        model,
        ok: true,
        tokensIn: 0,
        tokensOut: 0,
        costUsd: 0,
      },
    });
  } catch {
    // ignore logging errors for now
  }

  return NextResponse.json({ title: parsedJson.title ?? `${category} (${mode})`, result: parsedJson });
}
