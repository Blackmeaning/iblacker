import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { BrandMark } from "@/components/BrandMark";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect("/dashboard");

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">

      {/* ===== PREMIUM BACKGROUND ===== */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-400px] left-1/2 -translate-x-1/2 h-[900px] w-[900px] rounded-full bg-white/5 blur-[200px]" />
        <div className="absolute bottom-[-200px] right-[-200px] h-[700px] w-[700px] rounded-full bg-white/4 blur-[180px]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.6)_1px,transparent_0)] [background-size:36px_36px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-12">

        {/* ===== HEADER ===== */}
        <header className="flex items-center justify-between">
          <div className="scale-[1.25] origin-left">
            <BrandMark size="md" subtitle />
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-white/60 hover:text-white transition"
            >
              Log in
            </Link>

            <Link
              href="/login"
              className="rounded-xl bg-white text-black px-5 py-2.5 text-sm font-medium hover:bg-white/90 transition shadow-lg"
            >
              Get started
            </Link>
          </div>
        </header>

        {/* ===== HERO ===== */}
        <section className="mt-28 text-center">

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs text-white/60 backdrop-blur-md">
            AI Infrastructure Workspace
          </div>

          <h1 className="mt-8 text-[52px] md:text-[80px] font-semibold leading-[1.02] tracking-tight">
            <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
              The operating system
            </span>
            <br />
            for AI builders.
          </h1>

          <p className="mt-8 text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Generate structured outputs. Refine them. Export them.
            Ship faster with a unified AI workflow.
          </p>

          <div className="mt-12 flex justify-center gap-4">
            <Link
              href="/login"
              className="rounded-2xl bg-white text-black px-8 py-4 text-base font-medium hover:bg-white/90 transition shadow-xl"
            >
              Start building
            </Link>

            <Link
              href="/login"
              className="rounded-2xl border border-white/10 bg-white/[0.05] px-8 py-4 text-base font-medium hover:bg-white/[0.08] transition backdrop-blur-md"
            >
              View dashboard
            </Link>
          </div>

        </section>

        {/* ===== FLOATING PREVIEW ===== */}
        <section className="mt-28 flex justify-center">

          <div className="relative w-full max-w-5xl">

            <div className="absolute inset-0 rounded-[40px] bg-white/5 blur-3xl opacity-40" />

            <div className="relative rounded-[40px] border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-10 backdrop-blur-xl shadow-[0_0_100px_rgba(255,255,255,0.08)]">

              <div className="flex items-center justify-between mb-8">
                <div className="text-sm text-white/50">Workspace</div>
                <div className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/60">
                  Live
                </div>
              </div>

              <div className="space-y-4">
                <div className="h-3 rounded bg-white/10 w-full" />
                <div className="h-3 rounded bg-white/10 w-5/6" />
                <div className="h-3 rounded bg-white/10 w-4/6" />
              </div>

              <div className="mt-8 h-64 rounded-3xl border border-white/10 bg-black/40" />

              <div className="mt-8 flex gap-4">
                <button className="rounded-xl bg-white text-black px-5 py-2 text-sm font-medium">
                  Generate
                </button>
                <button className="rounded-xl border border-white/10 bg-white/[0.05] px-5 py-2 text-sm">
                  Save
                </button>
                <button className="rounded-xl border border-white/10 bg-white/[0.05] px-5 py-2 text-sm">
                  Export
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* ===== SIMPLE POWER SECTION ===== */}
        <section className="mt-36 text-center">

          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Built for scale.
            <span className="text-white/50"> Not experiments.</span>
          </h2>

          <div className="mt-16 grid md:grid-cols-3 gap-10 text-left">

            <div>
              <div className="text-xl font-medium">Structured generation</div>
              <p className="mt-4 text-white/60 leading-relaxed">
                Clean outputs ready for real-world use. No messy formatting.
              </p>
            </div>

            <div>
              <div className="text-xl font-medium">Production exports</div>
              <p className="mt-4 text-white/60 leading-relaxed">
                PDF, DOCX, JSON, and image exports that actually work.
              </p>
            </div>

            <div>
              <div className="text-xl font-medium">Unified workflow</div>
              <p className="mt-4 text-white/60 leading-relaxed">
                From idea to deliverable inside one premium interface.
              </p>
            </div>

          </div>

        </section>

        {/* ===== FINAL CTA ===== */}
        <section className="mt-36 mb-20 text-center">

          <h3 className="text-4xl font-semibold tracking-tight">
            Build like a serious company.
          </h3>

          <p className="mt-6 text-white/60 max-w-xl mx-auto">
            IBlacker gives you the AI infrastructure layer your workflow deserves.
          </p>

          <div className="mt-10">
            <Link
              href="/login"
              className="rounded-2xl bg-white text-black px-10 py-4 text-base font-medium hover:bg-white/90 transition shadow-xl"
            >
              Start now
            </Link>
          </div>

          <footer className="mt-16 text-xs text-white/40">
            © {new Date().getFullYear()} IBlacker. All rights reserved.
          </footer>

        </section>

      </div>
    </main>
  );
}
