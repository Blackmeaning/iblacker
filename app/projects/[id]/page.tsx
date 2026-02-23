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
      <main className="min-h-[calc(100vh-64px)] bg-black text-white p-10">
        <h1 className="text-3xl font-bold">Project not found</h1>
        <Link href="/projects" className="mt-6 inline-block underline">
          Back to Projects
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold">Project</h1>
          <Link
            href="/projects"
            className="bg-white text-black px-4 py-2 rounded-lg font-semibold"
          >
            Back
          </Link>
        </div>

        <div className="mt-2 text-sm text-white/50">
          ID: {project.id} • Created: {project.createdAt.toISOString()}
        </div>

        <form
          action={`/api/projects/${project.id}/update`}
          method="POST"
          className="mt-8 border border-white/10 bg-white/5 rounded-2xl p-6"
        >
          <label className="block text-sm text-white/70 mb-2">Prompt</label>
          <textarea
            name="prompt"
            defaultValue={project.prompt}
            className="w-full bg-black/60 border border-white/10 rounded-xl p-4 outline-none focus:border-white/30"
            rows={4}
          />

          <label className="block text-sm text-white/70 mt-5 mb-2">Mode</label>
          <input
            name="mode"
            defaultValue={project.mode}
            className="w-full bg-black/60 border border-white/10 rounded-xl p-3 outline-none focus:border-white/30"
          />

          <button
            type="submit"
            className="mt-6 bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
          >
            Regenerate & Save
          </button>
        </form>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Saved Result</h2>
          <pre className="bg-black/60 border border-white/10 rounded-2xl p-5 text-sm overflow-auto">
            {JSON.stringify(project.result, null, 2)}
          </pre>
        </div>
      </div>
    </main>
  );
}