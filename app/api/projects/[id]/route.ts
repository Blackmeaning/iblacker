// app/projects/[id]/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <h1 className="text-3xl font-bold">Project not found</h1>
          <p className="mt-2 text-white/60">
            The project id doesn’t exist (or was deleted).
          </p>
          <Link
            href="/projects"
            className="inline-block mt-6 rounded-xl bg-white px-5 py-3 font-semibold text-black"
          >
            Back to Projects
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold">Project</h1>
            <p className="mt-2 text-white/60">{project.id}</p>
          </div>

          <Link
            href="/projects"
            className="rounded-xl bg-white px-5 py-3 font-semibold text-black hover:bg-white/90 transition"
          >
            Back
          </Link>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm text-white/50">
            {new Date(project.createdAt).toLocaleString()}
          </div>

          <div className="mt-3 text-lg font-semibold">
            {project.mode}
          </div>

          <div className="mt-2 text-white/80">
            {project.prompt}
          </div>

          <h2 className="mt-8 text-lg font-semibold">Result</h2>
          <pre className="mt-3 overflow-auto rounded-xl border border-white/10 bg-black p-4 text-sm text-white/80">
            {JSON.stringify(project.result, null, 2)}
          </pre>
        </div>
      </div>
    </main>
  );
}