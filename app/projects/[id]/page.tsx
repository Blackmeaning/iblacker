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
      <main className="min-h-screen bg-black text-white p-10">
        <h1 className="text-3xl font-bold">Project not found</h1>
        <Link href="/projects" className="mt-6 inline-block text-white underline">
          Back
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Project Editor</h1>
          <Link
            href="/projects"
            className="bg-white text-black px-4 py-2 rounded-lg font-semibold"
          >
            Back
          </Link>
        </div>

        <div className="mt-8 space-y-6">
          <form action={`/api/projects/${id}/update`} method="POST">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Prompt
              </label>
              <textarea
                name="prompt"
                defaultValue={project.prompt}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg p-4"
                rows={4}
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm text-gray-400 mb-2">
                Mode
              </label>
              <input
                name="mode"
                defaultValue={project.mode}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg p-3"
              />
            </div>

            <button
              type="submit"
              className="mt-6 bg-white text-black px-6 py-3 rounded-lg font-semibold"
            >
              Regenerate & Save
            </button>
          </form>

          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-3">Current Result</h2>
            <pre className="bg-gray-900 border border-gray-800 p-4 rounded-lg text-sm overflow-auto">
              {JSON.stringify(project.result, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}