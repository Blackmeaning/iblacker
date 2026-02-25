import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string; exportId: string }> }
) {
  const { exportId } = await context.params;

  const item = await prisma.projectExport.findUnique({
    where: { id: exportId },
    select: { filename: true, mimeType: true, data: true },
  });

  if (!item) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return new Response(item.data, {
    headers: {
      "Content-Type": item.mimeType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${item.filename}"`,
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
}