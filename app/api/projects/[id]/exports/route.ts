import { NextResponse } from "next/server";
import { requireSession } from "@/lib/requireSession";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { exportJSON } from "@/lib/exporters/json";
import { exportPDF } from "@/lib/exporters/pdf";
import { exportDOCX } from "@/lib/exporters/docx";

export const runtime = "nodejs";

const BodySchema = z.object({
  type: z.enum(["JSON", "PDF", "DOCX"]),
});

export async function POST(req: Request, ctx: { params: { id: string } }) {
  const session = await requireSession();
  const userId = session.user.id;
  const projectId = ctx.params.id;

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
    select: { id: true, mode: true, category: true, result: true, title: true, prompt: true, createdAt: true },
  });

  if (!project) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input", details: parsed.error.flatten() }, { status: 400 });
  }

  const { type } = parsed.data;

  const baseName = (project.title || `${project.category}-${project.mode}`).replace(/[^a-z0-9-_]+/gi, "_");
  let filename = "";
  let mimeType = "";
  let data: Buffer;

  if (type === "JSON") {
    const out = exportJSON(project);
    filename = `${baseName}.json`;
    mimeType = out.mime;
    data = out.data;
  } else if (type === "PDF") {
    const out = await exportPDF({ mode: project.mode, category: project.category, result: project.result });
    filename = `${baseName}.pdf`;
    mimeType = out.mime;
    data = out.data;
  } else {
    const out = await exportDOCX({ mode: project.mode, category: project.category, result: project.result });
    filename = `${baseName}.docx`;
    mimeType = out.mime;
    data = out.data;
  }

  const size = data.byteLength;
  if (size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "too_large", limitMB: 8 }, { status: 413 });
  }

  const saved = await prisma.projectExport.create({
    data: {
      projectId,
      userId,
      filename,
      mimeType,
      data,
      size,
    },
    select: { id: true },
  });

  return NextResponse.json({
    ok: true,
    exportId: saved.id,
    downloadUrl: `/api/projects/${projectId}/exports/${saved.id}/download`,
  });
}
