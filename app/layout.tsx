import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "IBlacker",
  description: "Design. Generate. Build.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white">
        <header className="border-b border-white/10">
          <div className="mx-auto max-w-6xl px-6 py-4 flex items-center gap-6">
            {/* LOGO → HOME */}
            <Link
              href="/"
              className="font-extrabold tracking-tight text-lg hover:opacity-90"
            >
              IBlacker
            </Link>

            <nav className="ml-auto flex items-center gap-6 text-sm text-white/80">
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

        {children}
      </body>
    </html>
  );
}