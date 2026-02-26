import { requireSession } from "@/lib/requireSession";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/format";

export default async function DashboardPage() {
  const session = await requireSession();

  const recent = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="mt-2 text-sm text-white/60">
            Your workspace overview and recent activity.
          </p>
        </div>
        <Link
          href="/workspace"
          className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90"
        >
          New generation
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card title="Modes enabled" value="Text • Code • Image" />
        <Card title="Exports" value="JSON • PDF • DOCX" />
        <Card title="Status" value="Production-ready base" />
      </div>

      <div className="mt-10">
        <h2 className="text-sm font-semibold text-white/80">Recent projects</h2>
        <div className="mt-3 overflow-hidden rounded-2xl border border-white/10">
          {recent.length === 0 ? (
            <div className="bg-black/20 p-6 text-sm text-white/60">
              No projects yet. Create your first one in{" "}
              <Link className="underline" href="/workspace">Workspace</Link>.
            </div>
          ) : (
            <ul className="divide-y divide-white/10">
              {recent.map((p) => (
                <li key={p.id} className="bg-black/20 p-4 hover:bg-black/30">
                  <Link href={`/projects/${p.id}`} className="block">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">
                          {p.title || p.category}
                        </div>
                        <div className="mt-1 truncate text-xs text-white/60">
                          {p.prompt}
                        </div>
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
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <div className="text-xs text-white/50">{title}</div>
      <div className="mt-2 text-base font-semibold">{value}</div>
    </div>
  );
}
