import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/requireSession";
import { notFound } from "next/navigation";
import ExportButtons from "./export-buttons";

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const session = await requireSession();
  const userId = session.user.id;

  const project = await prisma.project.findFirst({
    where: { id: params.id, userId },
    select: { id: true, title: true, mode: true, category: true, prompt: true, result: true, createdAt: true },
  });

  if (!project) notFound();

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{project.title || "Project"}</h1>
          <div className="mt-1 text-sm text-white/60">
            {project.mode} • {project.category}
          </div>
        </div>

        <form
          className="flex gap-2"
          action={async (formData) => {
            "use server";
            // Server Actions not used here; buttons are client-side via fetch below (kept simple)
          }}
        >
          {/* buttons rendered by small client script below */}
        </form>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
        <div className="text-xs text-white/50">Prompt</div>
        <p className="mt-2 whitespace-pre-wrap text-sm text-white/80">{project.prompt}</p>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
        <div className="text-xs text-white/50">Result</div>
        <pre className="mt-3 max-h-[520px] overflow-auto rounded-xl border border-white/10 bg-black/50 p-4 text-xs text-white/80">
{JSON.stringify(project.result, null, 2)}
        </pre>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
        <div className="text-xs text-white/50">Exports</div>
        <ExportButtons projectId={project.id} />
      </div>
    </main>
  );
}

