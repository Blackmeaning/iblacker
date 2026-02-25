import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateBlueprint } from "@/lib/appbuilder/blueprint";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const prompt = body?.prompt?.trim();
  const modules = Array.isArray(body?.modules) ? body.modules : [];

  if (!prompt) {
    return NextResponse.json({ error: "prompt required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  const blueprint = await generateBlueprint(prompt, modules);

  const saved = await prisma.project.create({
    data: {
      prompt,
      mode: "App Builder",
      result: blueprint as any,
      userId: user?.id ?? null,
    } as any,
    select: { id: true },
  });

  return NextResponse.json({ ...blueprint, projectId: saved.id });
}