import Link from "next/link";
import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { BrandMark } from "@/components/BrandMark";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 md:grid-cols-[260px_1fr]">
          <aside className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-6">
              <BrandMark size="sm" subtitle />
            </div>

            <nav className="space-y-1 text-sm">
              <Link className="block rounded-xl px-3 py-2 hover:bg-white/10" href="/dashboard">
                Dashboard
              </Link>
              <Link className="block rounded-xl px-3 py-2 hover:bg-white/10" href="/workspace">
                Workspace
              </Link>
              <Link className="block rounded-xl px-3 py-2 hover:bg-white/10" href="/projects">
                Projects
              </Link>
              <Link className="block rounded-xl px-3 py-2 hover:bg-white/10" href="/chat">
                Chat
              </Link>
              <Link className="block rounded-xl px-3 py-2 hover:bg-white/10" href="/billing">
                Billing
              </Link>
              <Link className="block rounded-xl px-3 py-2 hover:bg-white/10" href="/settings">
                Settings
              </Link>
            </nav>

            <div className="mt-6 border-t border-white/10 pt-4 text-xs text-white/60">
              Signed in
              <div className="mt-1 text-white/80">{session.user.email}</div>
            </div>
          </aside>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            {children}
          </section>
        </div>
      </div>
    </div>
  );
}
