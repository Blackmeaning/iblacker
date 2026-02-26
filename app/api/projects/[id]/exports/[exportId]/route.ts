import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/currentUser";

export const runtime = "nodejs";

export async function DELETE(
  _req: Request,
  ctx: { params: { id: string; exportId: string } }
) {
  try {
    const userId = await requireUserId();
    const { id: projectId, exportId } = ctx.params;

    const existing = await prisma.projectExport.findFirst({
      where: { id: exportId, projectId, userId },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    await prisma.projectExport.delete({ where: { id: exportId } });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
}
