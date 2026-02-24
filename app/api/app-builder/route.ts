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

    const blueprint = await generateBlueprint(prompt, modules);

    // JWT session: we have email/name/image but NOT guaranteed user.id
    const session = await auth();
    const userEmail = session?.user?.email ?? null;

    // Save project (keep it compatible even if userId/user table isn't ready yet)
    const saved = await prisma.project.create({
      data: {
        prompt,
        mode: "App Builder",
        result: blueprint as any,
        // If you already added userId in schema and want it later:
        // userId: null,
        // For now we do NOT write userId because JWT strategy has no stable user.id.
        // If you added userEmail column, you can store it:
        // userEmail,
      } as any,
      select: { id: true },
    });

    return NextResponse.json({ ...blueprint, projectId: saved.id, userEmail });
  } catch (e: any) {
    return NextResponse.json(
      { error: "builder_failed", message: e?.message || String(e) },
      { status: 500 }
    );
  }
}