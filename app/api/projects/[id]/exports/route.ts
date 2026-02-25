import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await context.params;

  // TODO: replace with your real export bytes
  const filename = "project-export.zip";
  const data = Buffer.from("replace-with-real-bytes");
  const size = data.length;

  // If you later add auth, set userId from session here
  const userId: string | null = null;

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
}