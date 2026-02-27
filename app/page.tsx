import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { BrandMark } from "@/components/BrandMark";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      
      {/* subtle background glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-white/5 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-6 py-20">
        
        {/* HEADER */}
        <header className="flex items-center justify-between">
          <div className="scale-110">
            <BrandMark size="md" subtitle />
          </div>

          <Link
            href="/login"
            className="rounded-xl border border-white/15 bg-white/5 px-5 py-2 text-sm hover:bg-white/10 transition"
          >
            Log in
          </Link>
        </header>

        {/* HERO */}
        <section className="mt-24 grid gap-16 lg:grid-cols-2 items-center">

          <div>
            <h1 className="text-6xl md:text-7xl font-semibold leading-[1.05] tracking-tight">
              Build digital products
              <br />
              <span className="text-white/70">with one AI workspace.</span>
            </h1>

            <p className="mt-8 text-lg text-white/60 max-w-xl leading-relaxed">
              Generate structured outputs for plans, code, content, and assets —
              then export to JSON, PDF, DOCX, and more.
              Designed for serious builders.
            </p>

            <div className="mt-10 flex gap-4">
              <Link
                href="/login"
                className="rounded-2xl bg-white text-black px-6 py-4 font-medium text-base hover:bg-white/90 transition shadow-lg"
              >
                Start building
              </Link>

              <Link
                href="/login"
                className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 font-medium text-base hover:bg-white/10 transition"
              >
                View dashboard
              </Link>
            </div>
          </div>

          {/* PREVIEW CARD */}
          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-8 shadow-[0_0_60px_rgba(255,255,255,0.05)]">

            <div className="text-sm text-white/50 mb-6">Live Preview</div>

            <div className="space-y-4">
              <div className="h-3 rounded bg-white/10 w-full" />
              <div className="h-3 rounded bg-white/10 w-5/6" />
              <div className="h-3 rounded bg-white/10 w-4/6" />
            </div>

            <div className="mt-8 h-48 rounded-2xl border border-white/10 bg-black/40" />

            <div className="mt-8 flex gap-3">
              <button className="rounded-xl bg-white text-black px-4 py-2 text-sm font-medium">
                Generate
              </button>
              <button className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm">
                Save
              </button>
              <button className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm">
                Export
              </button>
            </div>
          </div>

        </section>

        <footer className="mt-28 text-xs text-white/40">
          © {new Date().getFullYear()} IBlacker. All rights reserved.
        </footer>

      </div>
    </main>
  );
}
