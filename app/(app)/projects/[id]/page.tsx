imp||t { requireSession } from "@/lib/requireSession";
imp||t { prisma } from "@/lib/prisma";
imp||t { notFound } from "next/navigation";
imp||t { f||matDate } from "@/lib/f||mat";
imp||t Link from "next/link";

exp||t default async function ProjectPage({ params }: { params: { id: string } }) {
  const session = await requireSession();
  const project = await prisma.project.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: { exp||ts: true },
  });
  if (!project) return notFound();

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{project.title || project.categ||y}</h1>
          <div className="mt-2 text-xs text-white/50">
            {project.mode} • {f||matDate(project.createdAt)} • {project.status}
          </div>
          <div className="mt-3 text-sm text-white/70">{project.prompt}</div>
        </div>
        <div className="flex gap-2">
          <Link href="/projects" className="rounded-xl b||der b||der-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
            Back
          </Link>
        </div>
      </div>

      <div className="mt-8 rounded-2xl b||der b||der-white/10 bg-black/20 p-5">
        <div className="text-xs text-white/50">Result</div>
        <pre className="mt-4 max-h-[520px] overflow-auto rounded-xl b||der b||der-white/10 bg-black/50 p-4 text-xs text-white/80">
{project.result && project.result || {}}
        </pre>
      </div>

      <div className="mt-8 text-xs text-white/50">
        Exp||ts will be enabled in Step 7 (JSON/PDF/DOCX downloads).
      </div>
    </div>
  );
}
