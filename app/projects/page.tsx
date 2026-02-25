import { redirect } from "next/navigation";
import { getSessionEmail } from "@/lib/currentUser";

export default async function ProjectsPage() {
  const email = await getSessionEmail();
  if (!email) redirect("/");

  const res = await fetch(`${process.env.NEXTAUTH_URL ?? ""}/api/projects`, {
    cache: "no-store",
  }).catch(() => null);

  const data = res ? await res.json().catch(() => null) : null;
  const projects = data?.projects ?? [];

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold">Projects</h1>
            <p className="mt-1 text-white/60">Your history (latest 50)</p>
          </div>
          <a className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-black" href="/workspace">
            New Project
          </a>
        </div>

        <div className="mt-8 space-y-3">
          {projects.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
              No projects yet. Go to Workspace and generate something.
            </div>
          ) : (
            projects.map((p: any) => (
              <a
                key={p.id}
                href={`/projects/${p.id}`}
                className="block rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold">{p.mode}</div>
                  <div className="text-xs text-white/50">
                    {new Date(p.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="mt-2 text-white/70 line-clamp-2">{p.prompt}</div>
              </a>
            ))
          )}
        </div>
      </div>
    </main>
  );
}