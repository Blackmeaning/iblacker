import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-black text-white flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight">
          IBlacker
        </h1>

        <p className="mt-4 text-lg md:text-xl text-gray-300">
          All-in-one creative OS. Design. Generate. Build.
        </p>

        <div className="mt-10 flex items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="bg-white text-black font-semibold rounded-lg px-6 py-3 hover:bg-gray-200 transition"
          >
            Enter Dashboard
          </Link>

          <Link
            href="/workspace"
            className="border border-gray-700 text-white font-semibold rounded-lg px-6 py-3 hover:bg-gray-900 transition"
          >
            Open Workspace
          </Link>
        </div>
      </div>
    </main>
  );
}