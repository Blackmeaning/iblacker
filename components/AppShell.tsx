"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { NavLink } from "@/components/NavLink";

export function AppShell({
  userEmail,
  children,
}: {
  userEmail?: string | null;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* premium background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-[420px] left-1/2 -translate-x-1/2 h-[900px] w-[900px] rounded-full bg-white/5 blur-[200px]" />
        <div className="absolute -bottom-[260px] -right-[260px] h-[720px] w-[720px] rounded-full bg-white/4 blur-[180px]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.6)_1px,transparent_0)] [background-size:36px_36px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 md:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside className="h-[calc(100vh-48px)] sticky top-6 rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-xl shadow-[0_0_90px_rgba(255,255,255,0.06)] overflow-hidden flex flex-col">
            <div className="p-5 border-b border-white/10">
              <BrandMark size="md" subtitle />
            </div>

            <nav className="p-3 space-y-1">
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/workspace">Workspace</NavLink>
              <NavLink href="/projects">Projects</NavLink>
              <NavLink href="/chat">Chat</NavLink>
              <NavLink href="/billing">Billing</NavLink>
              <NavLink href="/settings">Settings</NavLink>
            </nav>

            <div className="mt-auto p-4 border-t border-white/10">
              <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                <div className="text-[11px] text-white/50">Signed in</div>
                <div className="text-sm font-medium truncate">{userEmail || "—"}</div>
              </div>

              <div className="mt-3">
                <Link
                  href="/api/auth/signout"
                  className="block w-full text-center rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/[0.08] transition"
                >
                  Sign out
                </Link>
              </div>
            </div>
          </aside>

          {/* Main */}
          <section className="min-h-[calc(100vh-48px)] rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_0_90px_rgba(255,255,255,0.04)] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="text-sm text-white/60">Master AI Platform</div>
              <div className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                Production
              </div>
            </div>

            <div className="p-6">{children}</div>
          </section>
        </div>
      </div>
    </div>
  );
}
