import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProjectDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      createdAt: true,
      prompt: true,
      mode: true,
      result: true,
    },
  });

  if (!project) return notFound();

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Project</h1>
            <p className="text-gray-400 text-sm break-all">ID: {project.id}</p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/projects"
              className="border border-gray-700 rounded-lg px-4 py-2 hover:bg-gray-900"
            >
              Back
            </Link>
            <Link
              href={`/workspace?load=${project.id}`}
              className="bg-white text-black font-semibold rounded-lg px-4 py-2 hover:bg-gray-200"
            >
              Open in Workspace
            </Link>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-4">
          <div className="text-sm text-gray-400">
            Mode: <span className="text-white">{project.mode}</span> •{" "}
            {new Date(project.createdAt).toLocaleString()}
          </div>

          <div className="mt-3 text-sm text-gray-400">Prompt</div>
          <div className="text-white whitespace-pre-wrap">{project.prompt}</div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="text-sm text-gray-400 mb-2">Saved Result JSON</div>
          <pre className="bg-black border border-gray-800 rounded-xl p-4 text-xs overflow-auto text-gray-300">
            {JSON.stringify(project.result, null, 2)}
          </pre>
        </div>
      </div>
    </main>
  );
}