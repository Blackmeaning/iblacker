import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "IBlacker",
  description: "All-in-one creative OS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <header className="h-16 border-b border-gray-800">
          <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between">
            {/* LOGO NAME -> HOME */}
            <Link href="/" className="font-bold text-lg tracking-tight">
              IBlacker
            </Link>

            <nav className="flex gap-6 text-sm text-gray-300">
              <Link href="/workspace" className="hover:text-white">
                Workspace
              </Link>
              <Link href="/projects" className="hover:text-white">
                Projects
              </Link>
              <Link href="/settings" className="hover:text-white">
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