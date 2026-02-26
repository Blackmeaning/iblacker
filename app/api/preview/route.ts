import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const mode = body?.mode;
  const category = body?.category;
  const prompt = body?.prompt;

  if (!mode || !category || !prompt || String(prompt).trim().length < 8) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  // Step 6 will call OpenAI + image provider. For now, return a deterministic structured preview.
  const title = `${category} (${mode})`;
  const result = {
    title,
    summary: "This is a preview. Step 6 will generate real model output.",
    sections: [
      { heading: "Prompt", content: String(prompt) },
      { heading: "Next", content: "Save this preview to Projects, then export in Step 7." },
    ],
    metadata: { mode, category },
  };

  return NextResponse.json({ title, result });
}
