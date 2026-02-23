import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, prompt: true, mode: true, createdAt: true },
  });

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">Projects</h1>
            <p className="text-gray-400">Click any project to open it.</p>
          </div>

          <Link
            href="/workspace"
            className="bg-white text-black font-semibold rounded-lg px-5 py-3 hover:bg-gray-200 transition"
          >
            New Project
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-gray-300">
            No projects yet.
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="block bg-gray-900 border border-gray-800 rounded-xl p-5 hover:bg-gray-800 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="text-xs bg-gray-800 rounded px-2 py-1">
                    {p.mode}
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(p.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="mt-3 text-white font-semibold line-clamp-2">
                  {p.prompt}
                </div>

                <div className="mt-2 text-xs text-gray-500 break-all">
                  ID: {p.id}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}