import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/currentUser";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string; exportId: string }> }
) {
  const userId = await requireUserId();
  const { exportId } = await ctx.params;

  const exp = await prisma.projectExport.findFirst({
    where: { id: exportId, userId },
    select: { filename: true, mimeType: true, data: true },
  });

  if (!exp) return new Response("Not found", { status: 404 });

  return new Response(exp.data, {
    headers: {
      "content-type": exp.mimeType ?? "application/zip",
      "content-disposition": `attachment; filename="${exp.filename}"`,
      "cache-control": "private, no-store",
    },
  });
}