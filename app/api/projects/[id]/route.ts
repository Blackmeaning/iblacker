import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/currentUser";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  try {
    const userId = await requireUserId();
    const id = ctx.params.id;

    const project = await prisma.project.findFirst({
      where: { id, userId },
      select: {
        id: true,
        createdAt: true,
        prompt: true,
        mode: true,
        result: true,
        exports: {
          orderBy: { createdAt: "desc" },
          select: { id: true, createdAt: true, filename: true, size: true },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, project });
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
}