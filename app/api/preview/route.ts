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
      image: { mime: "image/png", b64 },
      metadata: { mode, category, model },
    };

    return NextResponse.json({ title, result });
  }

  // --- TEXT/CODE ---
  const model =
    mode === "CODE"
      ? env("OPENAI_MODEL_CODE", "gpt-4o-mini")
      : env("OPENAI_MODEL_TEXT", "gpt-4o-mini");

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

  const completion = await openai.chat.completions.create({
    model,
    temperature: 0.2,
    messages: [
      { role: "system", content: system },
      { role: "user", content: `Mode: ${mode}\nCategory: ${category}\n\nPROMPT:\n${prompt}` },
    ],
  });

  const outputText = completion.choices?.[0]?.message?.content ?? "";

  let parsedJson: unknown = null;
  try {
    parsedJson = JSON.parse(outputText);
  } catch {
    parsedJson = {
      title: `${category} (${mode})`,
      summary: "Model returned non-JSON output. Showing raw text in sections.",
      sections: [{ heading: "Output", content: outputText.slice(0, 20000) }],
      next_actions: ["Refine the prompt and generate again."],
      metadata: { mode, category },
    };
  }

  const safeTitle =
    typeof parsedJson === "object" && parsedJson !== null && "title" in parsedJson
      ? String((parsedJson as { title: unknown }).title ?? `${category} (${mode})`)
      : `${category} (${mode})`;

  // Optional lightweight generation log (safe if env missing; ignored if DB insert fails)
  try {
    await prisma.generationLog.create({
      data: {
        userId: session.user.id,
        mode,
        category,
        provider: "openai",
        model,
        ok: true,  # will be replaced below
      },
    });
  } catch {}

  return NextResponse.json({ title: safeTitle, result: parsedJson });
}
