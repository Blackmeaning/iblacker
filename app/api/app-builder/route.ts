import { NextResponse } from "next/server";
import { generateBlueprint } from "@/lib/appbuilder/blueprint";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const prompt = body?.prompt?.trim();
    const modules = Array.isArray(body?.modules) ? body.modules : [];

    if (!prompt) {
      return NextResponse.json({ error: "prompt required" }, { status: 400 });
    }

    const session = await auth();

    const blueprint = await generateBlueprint(prompt, modules);

    const saved = await prisma.project.create({
      data: {
        prompt,
        mode: "App Builder",
        result: blueprint as any,
        userId: session?.user?.id ?? null,
      },
      select: { id: true },
    });

    return NextResponse.json({ ...blueprint, projectId: saved.id });
  } catch (e: any) {
    return NextResponse.json(
      { error: "builder_failed", message: e?.message || String(e) },
      { status: 500 }
    );
  }
}