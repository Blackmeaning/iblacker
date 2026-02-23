import Link from "next/link";

type Project = {
  id: string;
  prompt: string;
  mode: string;
  createdAt: string;
  result: any;
};

async function getProject(id: string): Promise<Project | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/projects/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  const data = await res.json();
  return data.project || null;
}

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold">Project not found</h1>
          <Link className="text-gray-300 underline mt-4 inline-block" href="/projects">
            Back to Projects
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold">Project</h1>
            <p className="text-gray-400 mt-2">
              {project.mode} • {new Date(project.createdAt).toLocaleString()}
            </p>
          </div>

          <Link
            href="/projects"
            className="border border-gray-700 text-white font-semibold rounded-lg px-5 py-3 hover:bg-gray-900 transition"
          >
            Back
          </Link>
        </div>

        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-sm text-gray-400 mb-2">Prompt</div>
          <div className="text-lg font-semibold">{project.prompt}</div>
        </div>

        <div className="mt-4 bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-sm text-gray-400 mb-2">Result (raw JSON)</div>
          <pre className="text-xs text-gray-200 whitespace-pre-wrap break-words">
            {JSON.stringify(project.result, null, 2)}
          </pre>
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            href="/workspace"
            className="bg-white text-black font-semibold rounded-lg px-6 py-3 hover:bg-gray-200 transition"
          >
            Create New
          </Link>
        </div>
      </div>
    </main>
  );
}