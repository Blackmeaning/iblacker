import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/currentUser";

export const runtime = "nodejs";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getString(obj: Record<string, unknown>, key: string): string | null {
  const v = obj[key];
  return typeof v === "string" ? v : null;
}

export async function POST(req: Request, ctx: { params: { id: string } }) {
  try {
    const userId = await requireUserId();
    const projectId = ctx.params.id;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
      select: { id: true },
    });

    if (!project) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const body: unknown = await req.json();

    if (!isRecord(body)) {
      return NextResponse.json({ error: "invalid_body" }, { status: 400 });
    }

    const base64Zip = getString(body, "base64Zip");
    if (!base64Zip) {
      return NextResponse.json({ error: "missing_artifact" }, { status: 400 });
    }

    const filename = getString(body, "filename") ?? `project-${projectId}.zip`;

    const buf = Buffer.from(base64Zip, "base64");

    // Copy Buffer -> Uint8Array<ArrayBuffer> for Prisma Bytes strict typing.
    const bytes = new Uint8Array(buf.byteLength);
    bytes.set(buf);

    const size = bytes.byteLength;

    const saved = await prisma.projectExport.create({
      data: {
        projectId,
        userId,
        filename,
        mimeType: "application/zip",
        data: bytes,
        size,
      },
      select: { id: true },
    });

    return NextResponse.json({ ok: true, exportId: saved.id });
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
}

export async function GET(
  _req: Request,
  ctx: { params: { id: string } }
) {
  try {
    const userId = await requireUserId();
    const projectId = ctx.params.id;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
      select: { id: true },
    });

    if (!project) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const exportsList = await prisma.projectExport.findMany({
      where: { projectId, userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        filename: true,
        mimeType: true,
        size: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ ok: true, exports: exportsList });
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
}
