import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Workspace() {
  const session = await auth();

  // If not signed in, go to your login page (or NextAuth default sign-in)
  if (!session) {
    redirect("/login"); // or: redirect("/api/auth/signin");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-bold mb-2">Creative Workspace</h1>
        <p className="text-white/60">
          Signed in as{" "}
          <span className="text-white font-semibold">
            {session.user?.email ?? "unknown"}
          </span>
        </p>

        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6">
          <p className="text-white/80">
            Workspace is protected ✅ (NextAuth + Prisma)
          </p>
        </div>
      </div>
    </main>
  );
}