import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function fmt(d: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

export default async function Page() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      createdAt: true,
      prompt: true,
      mode: true,
      result: true,
    },
  });

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-gray-400">
              This is your history of generated work (latest 50).
            </p>
          </div>

          <Link
            href="/workspace"
            className="bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            New Project
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-300">No projects yet.</p>
            <p className="text-gray-500 text-sm mt-2">
              Go to Workspace, generate something, then come back here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((p) => (
              <div
                key={p.id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="text-sm text-gray-400">
                    <span className="text-white font-semibold">
                      {p.mode || "Unknown"}
                    </span>{" "}
                    • {fmt(p.createdAt)}
                  </div>

                  <div className="text-xs text-gray-500 break-all">
                    ID: {p.id}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-sm text-gray-400 mb-1">Prompt</div>
                  <div className="text-gray-200 whitespace-pre-wrap">
                    {p.prompt}
                  </div>
                </div>

                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-gray-300">
                    View Result JSON
                  </summary>
                  <pre className="mt-3 bg-black border border-gray-800 rounded-xl p-4 text-xs overflow-auto text-gray-300">
                    {JSON.stringify(p.result, null, 2)}
                  </pre>
                </details>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}