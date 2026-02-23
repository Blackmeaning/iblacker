import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const formData = await req.formData();

    const prompt = String(formData.get("prompt") || "").trim();
    const mode = String(formData.get("mode") || "App");

    if (!prompt) {
      return NextResponse.json({ error: "Prompt required" }, { status: 400 });
    }

    // Here you can plug your real AI logic
    const result = {
      regenerated: true,
      prompt,
      mode,
      updatedAt: new Date().toISOString(),
    };

    await prisma.project.update({
      where: { id },
      data: {
        prompt,
        mode,
        result,
      },
    });

    return NextResponse.redirect(
      new URL(`/projects/${id}`, req.url)
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Update failed" },
      { status: 500 }
    );
  }
}