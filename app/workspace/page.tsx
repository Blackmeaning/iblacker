import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import GeneratorClient from "./GeneratorClient";

export default async function WorkspacePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/");

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Workspace</h1>
            <p className="mt-1 text-white/60">
              Signed in as <span className="text-white">{session.user.email}</span>
            </p>
          </div>

          <a
            href="/projects"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10"
          >
            View Projects
          </a>
        </div>

        <div className="mt-8">
          <GeneratorClient />
        </div>
      </div>
    </main>
  );
}