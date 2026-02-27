"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname?.startsWith(href));

  return (
    <Link
      href={href}
      className={[
        "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
        active
          ? "bg-white/10 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.10)]"
          : "text-white/60 hover:text-white hover:bg-white/[0.06]",
      ].join(" ")}
    >
      <span
        className={[
          "h-2.5 w-2.5 rounded-full transition",
          active ? "bg-white" : "bg-white/20 group-hover:bg-white/40",
        ].join(" ")}
      />
      <span className="font-medium">{children}</span>
    </Link>
  );
}
