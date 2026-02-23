// app/projects/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      prompt: true,
      mode: true,
      createdAt: true,
    },
  });

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold">Projects</h1>
            <p className="mt-2 text-white/60">
              Your history of generated work (latest 50).
            </p>
          </div>

          <Link
            href="/workspace"
            className="rounded-xl bg-white px-5 py-3 font-semibold text-black hover:bg-white/90 transition"
          >
            New Project
          </Link>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          {projects.length === 0 ? (
            <div className="p-6 text-white/70">
              <div className="font-semibold">No projects yet.</div>
              <div className="mt-1 text-sm text-white/50">
                Go to Workspace, generate something, then come back here.
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-white/10">
              {projects.map((p) => (
                <li key={p.id} className="p-5 hover:bg-white/5 transition">
                  <Link href={`/projects/${p.id}`} className="block">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm text-white/50">
                          {new Date(p.createdAt).toLocaleString()}
                        </div>
                        <div className="mt-1 font-semibold">
                          {p.mode} •{" "}
                          <span className="text-white/80">{p.prompt}</span>
                        </div>
                      </div>

                      <div className="text-sm text-white/60">
                        Open →
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}