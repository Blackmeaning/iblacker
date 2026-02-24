// /app/api/app-builder/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateBlueprint } from "@/lib/appbuilder/blueprint";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const prompt = body?.prompt?.trim();
    const modules = Array.isArray(body?.modules) ? body.modules : [];

    if (!prompt) {
      return NextResponse.json({ error: "prompt required" }, { status: 400 });
    }

    const blueprint = await generateBlueprint(prompt, modules);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    const saved = await prisma.project.create({
      // Cast to any to avoid type mismatch if Vercel Prisma client is stale.
      data: {
        prompt,
        mode: "App Builder",
        result: blueprint as any,
        userId: user?.id ?? null,
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