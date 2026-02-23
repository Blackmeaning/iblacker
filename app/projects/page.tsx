import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <main className="min-h-[calc(100vh-64px)] bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold">Projects</h1>
            <p className="mt-2 text-white/60">
              Your history of generated work (latest 50).
            </p>
          </div>

          <Link
            href="/workspace"
            className="bg-white text-black px-5 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
          >
            New Project
          </Link>
        </div>

        <div className="mt-8">
          {projects.length === 0 ? (
            <div className="border border-white/10 bg-white/5 rounded-2xl p-6 text-white/70">
              No projects yet. Go to Workspace → Generate something → come back here.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="border border-white/10 bg-white/5 rounded-2xl p-5 hover:border-white/25 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-white/60">{p.mode}</div>
                    <div className="text-xs text-white/40">
                      {p.createdAt.toISOString().slice(0, 19).replace("T", " ")}
                    </div>
                  </div>

                  <div className="mt-3 font-semibold line-clamp-2">
                    {p.prompt}
                  </div>

                  <div className="mt-3 text-sm text-white/60">
                    Open →
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}