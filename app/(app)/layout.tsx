import Image from "next/image";
import { requireSession } from "@/lib/requireSession";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UserMenu from "./user-menu";
import { BrandMark } from "@/components/BrandMark";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await requireSession();
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 md:grid-cols-[260px_1fr]">
          <aside className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3 px-2 py-2">
  <BrandMark size="sm" />
</div>
    <div className="text-xs text-white/60">Master AI Platform</div>
  </div>
</div>
                <div className="text-xs text-white/60">Master AI Platform</div>
              </div>
            </div>

            <nav className="mt-6 space-y-1 text-sm">
              <NavLink href="/dashboard" label="Dashboard" />
              <NavLink href="/workspace" label="Workspace" />
              <NavLink href="/projects" label="Projects" />
              <NavLink href="/chat" label="Chat" />
              <NavLink href="/billing" label="Billing" />
              <NavLink href="/settings" label="Settings" />
            </nav>

            <div className="mt-8 border-t border-white/10 pt-4">
              <UserMenu email={session?.user?.email ?? ""} />
              <form action="/api/auth/signout" method="post" className="mt-3">
                <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10">
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </form>
            </div>
          </aside>

          <main className="rounded-2xl border border-white/10 bg-white/5 p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block rounded-xl border border-transparent px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white"
    >
      {label}
    </Link>
  );
}