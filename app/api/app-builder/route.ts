import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateBlueprint } from "@/lib/appbuilder/blueprint";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const prompt = body?.prompt?.trim();
    const modules = Array.isArray(body?.modules) ? body.modules : [];

    if (!prompt) {
      return NextResponse.json({ error: "prompt required" }, { status: 400 });
    }

    const blueprint = await generateBlueprint(prompt, modules);

    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id ?? null;

    const saved = await prisma.project.create({
      data: {
        prompt,
        mode: "App Builder",
        result: blueprint as any,
        ...(userId ? ({ userId } as any) : {}),
      } as any,
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