import { prisma } from "@/lib/prisma";
import { requireUserId, getSessionEmail } from "@/lib/currentUser";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const email = await getSessionEmail();
  if (!email) redirect("/");

  const userId = await requireUserId();

  const [projectsCount, exportsCount, productsCount] = await Promise.all([
    prisma.project.count({ where: { userId } }),
    prisma.projectExport.count({ where: { userId } }),
    prisma.product.count({ where: { userId } }),
  ]);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-extrabold">Profile</h1>
        <p className="mt-1 text-white/60">{email}</p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card title="Projects" value={projectsCount} />
          <Card title="Exports" value={exportsCount} />
          <Card title="Products" value={productsCount} />
        </div>

        <div className="mt-8 flex gap-3">
          <a className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-black" href="/workspace">
            Go to Workspace
          </a>
          <a className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/10" href="/projects">
            View Projects
          </a>
          <a className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/10" href="/settings">
            Settings
          </a>
        </div>
      </div>
    </main>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="text-sm text-white/60">{title}</div>
      <div className="mt-2 text-3xl font-extrabold">{value}</div>
    </div>
  );
}