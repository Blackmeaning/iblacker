// app/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "IBlacker",
  description: "Design. Generate. Build.",
};

function Header() {
  return (
    <header className="border-b border-white/10 bg-black/40 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        {/* Logo -> Home */}
        <Link href="/" className="text-xl font-bold tracking-tight text-white">
          IBlacker
        </Link>

        <nav className="flex items-center gap-6 text-sm text-white/80">
          <Link className="hover:text-white" href="/workspace">
            Workspace
          </Link>
          <Link className="hover:text-white" href="/projects">
            Projects
          </Link>
          <Link className="hover:text-white" href="/settings">
            Settings
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Header />
        {children}
      </body>
    </html>
  );
}