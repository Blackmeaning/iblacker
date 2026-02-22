export const dynamic = "force-dynamic";

async function getProjects() {
  const res = await fetch("https://iblacker.com/api/projects", { cache: "no-store" });
  return res.json();
}

export default async function Projects() {
  const data = await getProjects();
  const projects = data.projects || [];

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>

      <div className="space-y-4">
        {projects.length === 0 && (
          <div className="bg-gray-900 p-6 rounded-lg text-gray-400">
            No projects yet. Go to Workspace → Generate.
          </div>
        )}

        {projects.map((p: any) => (
          <div key={p.id} className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="text-sm text-gray-400">
              {new Date(p.createdAt).toLocaleString()} • {p.mode}
            </div>
            <div className="mt-2 font-semibold">{p.prompt}</div>
          </div>
        ))}
      </div>
    </main>
  );
}