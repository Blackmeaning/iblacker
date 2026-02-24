// /app/workspace/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function WorkspacePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-bold mb-2">Creative Workspace</h1>
        <p className="text-white/60">
          Signed in as{" "}
          <span className="text-white font-semibold">
            {session.user.email}
          </span>
        </p>
      </div>
    </main>
  );
}