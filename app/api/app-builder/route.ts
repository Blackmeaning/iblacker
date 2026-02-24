import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateBlueprint } from "@/lib/appbuilder/blueprint";
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
    // @ts-expect-error added by types/next-auth.d.ts
    const userId: string | null = session?.user?.id ?? null;

    const blueprint = await generateBlueprint(prompt, modules);

    // IMPORTANT: make data "any" so build won't fail if Prisma client types lag on Vercel
    const data: any = {
      prompt,
      mode: "App Builder",
      result: blueprint as any,
    };

    // only attach if exists
    if (userId) data.userId = userId;

    const saved = await prisma.project.create({
      data,
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