import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/currentUser";

export const runtime = "nodejs";

export async function POST(req: Request, ctx: { params: { id: string } }) {
  try {
    const userId = await requireUserId();
    const projectId = ctx.params.id;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
      select: { id: true },
    });
    if (!project) return NextResponse.json({ error: "not_found" }, { status: 404 });

    const body = await req.json().catch(() => null);

    // Expect server to send: { filename, base64Zip }
    const filename = String(body?.filename || `project-${projectId}.zip`);
    const base64Zip = String(body?.base64Zip || "");

    if (!base64Zip) {
      return NextResponse.json({ error: "missing_artifact" }, { status: 400 });
    }

    const data = Buffer.from(base64Zip, "base64");
    const size = data.byteLength;

    // Safety: prevent insane DB blobs
    if (size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: "too_large", limitMB: 8 }, { status: 413 });
    }

    const saved = await prisma.projectExport.create({
      data: {
        projectId,
        userId,
        filename,
        mimeType: "application/zip",
        data,
        size,
      },
      select: { id: true },
    });

    return NextResponse.json({ ok: true, exportId: saved.id });
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
}