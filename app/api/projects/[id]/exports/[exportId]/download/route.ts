import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/currentUser";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: { exportId: string } }) {
  const userId = await requireUserId();
  const exportId = ctx.params.exportId;

  const exp = await prisma.projectExport.findFirst({
    where: { id: exportId, userId },
    select: { filename: true, mimeType: true, data: true },
  });

  if (!exp) return new Response("Not found", { status: 404 });

  return new Response(exp.data, {
    headers: {
      "content-type": exp.mimeType,
      "content-disposition": `attachment; filename="${exp.filename}"`,
      "cache-control": "private, max-age=0, no-store",
    },
  });
}