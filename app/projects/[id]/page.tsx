import { redirect } from "next/navigation";
import { getSessionEmail } from "@/lib/currentUser";

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const email = await getSessionEmail();
  if (!email) redirect("/");

  const res = await fetch(`${process.env.NEXTAUTH_URL ?? ""}/api/projects/${params.id}`, {
    cache: "no-store",
  }).catch(() => null);

  if (!res || !res.ok) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <h1 className="text-3xl font-extrabold">Project not found</h1>
          <p className="mt-2 text-white/60">
            This project doesn’t exist or it belongs to another user.
          </p>
          <a className="mt-6 inline-block rounded-xl bg-white px-4 py-2 text-sm font-bold text-black" href="/projects">
            Back to Projects
          </a>
        </div>
      </main>
    );
  }

  const data = await res.json();
  const project = data.project;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold">{project.mode}</h1>
            <p className="mt-1 text-white/60">{new Date(project.createdAt).toLocaleString()}</p>
          </div>
          <a className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/10" href="/projects">
            Back
          </a>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm font-semibold text-white/80">Prompt</div>
          <div className="mt-2 text-white/70 whitespace-pre-wrap">{project.prompt}</div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm font-semibold text-white/80">Exports</div>
          <div className="mt-3 space-y-2">
            {project.exports?.length ? (
              project.exports.map((e: any) => (
                <div key={e.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 p-3">
                  <div>
                    <div className="text-sm font-semibold">{e.filename}</div>
                    <div className="text-xs text-white/50">
                      {new Date(e.createdAt).toLocaleString()} • {(e.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                  <a
                    className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-black"
                    href={`/api/exports/${e.id}/download`}
                  >
                    Download
                  </a>
                </div>
              ))
            ) : (
              <div className="text-white/60 text-sm">No exports saved yet.</div>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm font-semibold text-white/80">Result</div>
          <pre className="mt-3 max-h-[520px] overflow-auto rounded-xl bg-black/50 p-4 text-xs text-white/80">
            {JSON.stringify(project.result, null, 2)}
          </pre>
        </div>
      </div>
    </main>
  );
}