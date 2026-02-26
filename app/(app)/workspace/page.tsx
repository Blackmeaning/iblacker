import { requireSession } from "@/lib/requireSession";
import WorkspaceClient from "./workspace-client";

export default async function WorkspacePage() {
  await requireSession();
  return (
    <div>
      <h1 className="text-2xl font-semibold">Workspace</h1>
      <p className="mt-2 text-sm text-white/60">
        Generate a preview first, then save it to Projects.
      </p>
      <div className="mt-6">
        <WorkspaceClient />
      </div>
    </div>
  );
}
