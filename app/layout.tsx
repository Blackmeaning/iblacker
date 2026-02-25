import "./globals.css";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: "IBlacker",
  description: "Design. Generate. Build.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white">
        <header className="border-b border-white/10">
          <div className="mx-auto max-w-6xl px-6 py-4 flex items-center gap-6">
            
            {/* LOGO */}
            <Link
              href="/"
              className="font-extrabold tracking-tight text-lg hover:opacity-90"
            >
              IBlacker
            </Link>

            {/* NAVIGATION */}
            {session?.user ? (
              <nav className="ml-auto flex items-center gap-6 text-sm text-white/80">
                
                <Link className="hover:text-white" href="/workspace">
                  Workspace
                </Link>

                <Link className="hover:text-white" href="/projects">
                  Projects
                </Link>

                <Link className="hover:text-white" href="/profile">
                  Profile
                </Link>

                <Link className="hover:text-white" href="/settings">
                  Settings
                </Link>

                <span className="text-white/40">
                  {session.user.email}
                </span>

                <Link
                  href="/api/auth/signout"
                  className="rounded-lg bg-white px-3 py-1 text-black font-semibold hover:opacity-90"
                >
                  Logout
                </Link>
              </nav>
            ) : (
              <nav className="ml-auto flex items-center gap-6 text-sm text-white/80">
                <Link className="hover:text-white" href="/">
                  Home
                </Link>
              </nav>
            )}
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}