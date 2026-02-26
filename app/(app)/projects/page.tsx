import { requireSession } from "@/lib/requireSession";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/format";

export default async function ProjectsPage() {
  const session = await requireSession();
  const projects = await prisma.project.findMany({
    where: { userId: session.user.id, status: "SAVED" },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="mt-2 text-sm text-white/60">Your saved generations.</p>
        </div>
        <Link href="/workspace" className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90">
          New
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
        {projects.length == 0 ? (
          <div className="bg-black/20 p-6 text-sm text-white/60">
            No saved projects yet. Use <Link className="underline" href="/workspace">Workspace</Link>.
          </div>
        ) : (
          <ul className="divide-y divide-white/10">
            {projects.map(p => (
              <li key={p.id} className="bg-black/20 p-4 hover:bg-black/30">
                <Link href={`/projects/${p.id}`} className="block">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{p.title || p.category}</div>
                      <div className="mt-1 truncate text-xs text-white/60">{p.prompt}</div>
                    </div>
                    <div className="text-right text-xs text-white/50">
                      <div>{p.mode}</div>
                      <div>{formatDate(p.createdAt)}</div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
