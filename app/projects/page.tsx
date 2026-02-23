import Link from "next/link";

type Project = {
  id: string;
  prompt: string;
  mode: string;
  createdAt: string;
};

async function getProjects(): Promise<Project[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/projects`, {
    cache: "no-store",
  });

  if (!res.ok) return [];
  const data = await res.json();
  return data.projects || [];
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold">Projects</h1>
            <p className="text-gray-400 mt-2">Your generated history (latest 50).</p>
          </div>

          <Link
            href="/workspace"
            className="bg-white text-black font-semibold rounded-lg px-5 py-3 hover:bg-gray-200 transition"
          >
            New Project
          </Link>
        </div>

        <div className="mt-8">
          {projects.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-gray-300">
              No projects yet. Go to Workspace and generate something.
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="block bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-sm text-gray-400">{p.mode}</div>
                      <div className="font-semibold truncate">{p.prompt}</div>
                    </div>
                    <div className="text-sm text-gray-500 whitespace-nowrap">
                      {new Date(p.createdAt).toLocaleString()}
                    </div>
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