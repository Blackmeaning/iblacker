import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-16 flex items-center justify-center">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            IBlacker
          </h1>

          <p className="mt-5 text-white/70 text-lg md:text-xl">
            Design. Generate. Build.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="bg-white text-black font-semibold px-7 py-3 rounded-xl hover:bg-gray-200 transition"
            >
              Enter
            </Link>

            <Link
              href="/workspace"
              className="border border-white/20 text-white font-semibold px-7 py-3 rounded-xl hover:border-white/40 transition"
            >
              Open Workspace
            </Link>
          </div>

          <p className="mt-8 text-sm text-white/50">
            Your AI workspace to generate apps, designs, and exports — with history.
          </p>
        </div>
      </div>
    </main>
  );
}