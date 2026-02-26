import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/requireSession";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: { id: string; exportId: string } }) {
  const session = await requireSession();
  const userId = session.user.id;

  const exp = await prisma.projectExport.findFirst({
    where: { id: ctx.params.exportId, userId, projectId: ctx.params.id },
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
