// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-black">
      <div className="max-w-3xl w-full px-6 text-center">
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight">
          IBlacker
        </h1>

        <p className="mt-4 text-lg md:text-xl text-white/70">
          Design. Generate. Build.
        </p>

        <div className="mt-10 flex items-center justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-black hover:bg-white/90 transition"
          >
            Enter Dashboard
          </Link>
        </div>

        <p className="mt-6 text-sm text-white/40">
          If you see this page, the platform is running ✅
        </p>
      </div>
    </main>
  );
}