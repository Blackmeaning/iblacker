import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { BrandMark } from "@/components/BrandMark";

function Icon({ name }: { name: "spark" | "shield" | "export" | "speed" | "team" | "brain" }) {
  const common = "h-5 w-5 text-white/80";
  if (name == "spark") return (
    <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5L12 2z" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
  if (name == "shield") return (
    <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M9.5 12l1.8 1.8L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  if (name == "export") return (
    <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 7l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 14v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
  if (name == "speed") return (
    <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-18 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 12l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M6.5 18.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
  if (name == "team") return (
    <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M16 11a3 3 0 1 0-6 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M5 20a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M20 20a5.5 5.5 0 0 0-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".6"/>
      <path d="M4 20a5.5 5.5 0 0 1 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".6"/>
    </svg>
  );
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 18h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10 21h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 2a7 7 0 0 0-4 12c.6.5 1 1.2 1.2 2h5.6c.2-.8.6-1.5 1.2-2A7 7 0 0 0 12 2z" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs text-white/70">
      <span className="h-2 w-2 rounded-full bg-white/60" />
      {children}
    </div>
  );
}

function Card({
  icon,
  title,
  desc,
}: {
  icon: "spark" | "shield" | "export" | "speed" | "team" | "brain";
  title: string;
  desc: string;
}) {
  return (
    <div className="group rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-6 shadow-[0_0_60px_rgba(255,255,255,0.04)] transition hover:border-white/15 hover:from-white/[0.09]">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
          <Icon name={icon} />
        </div>
        <div className="text-base font-semibold tracking-tight">{title}</div>
      </div>
      <div className="mt-3 text-sm leading-relaxed text-white/60">{desc}</div>
      <div className="mt-5 text-xs text-white/45">
        Learn more <span className="opacity-60">→</span>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* Premium background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-56 left-1/2 -translate-x-1/2 h-[760px] w-[760px] rounded-full bg-white/6 blur-3xl" />
        <div className="absolute top-40 left-[-180px] h-[520px] w-[520px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-64 right-[-220px] h-[640px] w-[640px] rounded-full bg-white/4 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.4)_1px,transparent_0)] [background-size:28px_28px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="scale-[1.15] origin-left">
            <BrandMark size="md" subtitle />
          </div>

          <nav className="hidden md:flex items-center gap-7 text-sm text-white/65">
            <a className="hover:text-white transition" href="#features">Features</a>
            <a className="hover:text-white transition" href="#security">Security</a>
            <a className="hover:text-white transition" href="#pricing">Pricing</a>
            <a className="hover:text-white transition" href="#faq">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
            >
              Log in
            </Link>
            <Link
              href="/login"
              className="rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90 transition shadow-lg"
            >
              Get started
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className="mt-16 md:mt-20 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <Pill>AI workspace for builders who ship</Pill>

            <h1 className="mt-6 text-[44px] leading-[1.05] md:text-[64px] font-semibold tracking-tight">
              Build, refine, and export
              <br />
              <span className="text-white/70">high-quality outputs—fast.</span>
            </h1>

            <p className="mt-6 text-base md:text-lg text-white/60 max-w-xl leading-relaxed">
              IBlacker turns prompts into structured plans, code, content, and assets with a clean workflow.
              Export to JSON, PDF, DOCX, and images—ready to share.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3">
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

            <div className="mt-8 flex items-center gap-6 text-xs text-white/45">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
                Production-ready exports
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-sky-400/80" />
                Secure auth & sessions
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-violet-400/80" />
                Fast, clean UI
              </div>
            </div>
          </div>

          {/* Hero Preview */}
          <div className="relative">
            <div className="rounded-[32px] border border-white/12 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-7 shadow-[0_0_80px_rgba(255,255,255,0.06)]">
              <div className="flex items-center justify-between">
                <div className="text-sm text-white/60">Workspace Preview</div>
                <div className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-white/55">
                  Live
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="h-3 rounded bg-white/10 w-full" />
                <div className="h-3 rounded bg-white/10 w-5/6" />
                <div className="h-3 rounded bg-white/10 w-2/3" />
              </div>

              <div className="mt-6 h-56 rounded-3xl border border-white/10 bg-black/40" />

              <div className="mt-6 flex gap-3">
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
          </div>
        </section>

        {/* Trust strip */}
        <section className="mt-16 md:mt-20">
          <div className="text-xs text-white/45">TRUSTED WORKFLOW PATTERNS</div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {["Design", "Product", "Engineering", "Marketing", "Research", "Ops"].map((x) => (
              <div key={x} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-center text-xs text-white/55">
                {x}
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mt-18 md:mt-24">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="text-xs text-white/45">FEATURES</div>
              <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
                Everything you need to ship faster.
              </h2>
              <p className="mt-3 text-white/60 max-w-2xl">
                A clean workflow for generating, editing, and exporting structured outputs. Built to scale from solo builders to teams.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Card icon="brain" title="Smart generation" desc="High-quality outputs for plans, code, and content with predictable structure." />
            <Card icon="export" title="Exports that work" desc="Export to PDF, DOCX, JSON, and images with production stability." />
            <Card icon="speed" title="Fast workflow" desc="Minimal friction UI with clean state management and quick iteration." />
            <Card icon="shield" title="Secure by default" desc="Session-based access control. Protected API routes and safe server runtimes." />
            <Card icon="team" title="Team-ready" desc="Organize projects, share outputs, and build repeatable internal workflows." />
            <Card icon="spark" title="Premium experience" desc="Polished UI, strong hierarchy, and consistent branding throughout the system." />
          </div>
        </section>

        {/* Stats */}
        <section id="security" className="mt-18 md:mt-24">
          <div className="rounded-[32px] border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <div>
                <div className="text-xs text-white/45">QUALITY</div>
                <h3 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight">
                  Built for reliability, not demos.
                </h3>
                <p className="mt-3 text-white/60 max-w-2xl">
                  Stable exports, consistent rendering, and a clean pipeline from prompt to deliverable.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
                  <div className="text-2xl font-semibold">4</div>
                  <div className="mt-1 text-xs text-white/50">Export types</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
                  <div className="text-2xl font-semibold">1</div>
                  <div className="mt-1 text-xs text-white/50">Unified workflow</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
                  <div className="text-2xl font-semibold">∞</div>
                  <div className="mt-1 text-xs text-white/50">Iterations</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mt-18 md:mt-24">
          <div className="text-xs text-white/45">TESTIMONIALS</div>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
            Builders love how fast it feels.
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              {
                quote:
                  "The export pipeline is the difference. I can generate and share deliverables without redoing everything.",
                name: "Product Lead",
              },
              {
                quote:
                  "It feels like a premium internal tool. Clean UI, no chaos, and the outputs are structured.",
                name: "Engineer",
              },
              {
                quote:
                  "Finally a workspace that doesn’t fight me. It’s fast, stable, and looks professional.",
                name: "Founder",
              },
            ].map((t) => (
              <div key={t.name} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <div className="text-sm text-white/70 leading-relaxed">“{t.quote}”</div>
                <div className="mt-4 text-xs text-white/45">{t.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing teaser */}
        <section id="pricing" className="mt-18 md:mt-24">
          <div className="rounded-[32px] border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-8 md:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <div className="text-xs text-white/45">PRICING</div>
              <h3 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight">
                Start free. Upgrade when you scale.
              </h3>
              <p className="mt-3 text-white/60 max-w-2xl">
                Get a premium experience today. When you’re ready, unlock higher limits and team workflows.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/40 p-6 w-full lg:w-[360px]">
              <div className="text-sm text-white/70 font-medium">Pro</div>
              <div className="mt-2 text-4xl font-semibold">$19</div>
              <div className="mt-1 text-xs text-white/50">per month • billed monthly</div>
              <ul className="mt-4 space-y-2 text-sm text-white/60">
                <li>• Higher export limits</li>
                <li>• Priority generation</li>
                <li>• Team-ready workflows</li>
              </ul>
              <Link
                href="/login"
                className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-white text-black px-5 py-3 text-sm font-medium hover:bg-white/90 transition"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mt-18 md:mt-24">
          <div className="text-xs text-white/45">FAQ</div>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
            Quick answers.
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {[
              {
                q: "What can I export?",
                a: "PDF, DOCX, JSON, and image exports are supported so you can share deliverables instantly.",
              },
              {
                q: "Is it secure?",
                a: "Protected routes + authenticated sessions. Your exports and projects are scoped to your account.",
              },
              {
                q: "Is it fast?",
                a: "The UI is designed to feel immediate. You can iterate quickly without friction.",
              },
              {
                q: "Can I use it for investing advice?",
                a: "It can provide educational guidance, but always verify with professionals—markets carry risk.",
              },
            ].map((x) => (
              <div key={x.q} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <div className="font-medium">{x.q}</div>
                <div className="mt-2 text-sm text-white/60 leading-relaxed">{x.a}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-18 md:mt-24 mb-10">
          <div className="rounded-[32px] border border-white/10 bg-gradient-to-b from-white/[0.10] to-white/[0.02] p-10 text-center">
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Ready to build with IBlacker?
            </h3>
            <p className="mt-3 text-white/60 max-w-2xl mx-auto">
              Generate, refine, and export professional deliverables. Built to look premium—and ship fast.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/login"
                className="rounded-2xl bg-white text-black px-7 py-4 font-medium text-base hover:bg-white/90 transition shadow-lg"
              >
                Start now
              </Link>
              <Link
                href="/login"
                className="rounded-2xl border border-white/15 bg-white/5 px-7 py-4 font-medium text-base hover:bg-white/10 transition"
              >
                View dashboard
              </Link>
            </div>
          </div>

          <footer className="mt-10 text-center text-xs text-white/40">
            © {new Date().getFullYear()} IBlacker. All rights reserved.
          </footer>
        </section>
      </div>
    </main>
  );
}
