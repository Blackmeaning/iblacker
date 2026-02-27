import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // Logged in? Go straight to the product.
  if (session) redirect("/dashboard");

  // Not logged in: premium landing
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="flex items-center justify-between">
  <BrandMark size="sm" />
</div>
    <div className="text-xs text-white/60">Master AI Platform</div>
  </div>
</div>
    <div className="text-xs text-white/60">Master AI Platform</div>
  </div>
</div>
              <div className="text-xs text-white/60">Master AI Platform</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
            >
              Log in
            </Link>
          </div>
        </header>

        <section className="mt-16 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight lg:text-5xl">
              Build digital products with a single AI workspace.
            </h1>
            <p className="mt-5 text-white/70 leading-relaxed">
              Generate structured outputs for plans, code, content, and assets — then export to JSON, PDF, and DOCX.
              Built for speed, quality, and scalability.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90"
              >
                Start building
              </Link>
              <Link
                href="/login"
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm hover:bg-white/10"
              >
                View dashboard
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-3 text-sm text-white/70">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="font-semibold text-white">Text</div>
                <div className="mt-1 text-white/60">Blueprints, plans, docs</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="font-semibold text-white">Code</div>
                <div className="mt-1 text-white/60">APIs, apps, websites</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="font-semibold text-white">Image</div>
                <div className="mt-1 text-white/60">Design & visual assets</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="font-semibold text-white">Exports</div>
                <div className="mt-1 text-white/60">JSON • PDF • DOCX</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 shadow-2xl">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
              <div className="text-xs text-white/50">Preview</div>
              <div className="mt-3 space-y-3">
                <div className="h-3 w-3/4 rounded bg-white/10" />
                <div className="h-3 w-full rounded bg-white/10" />
                <div className="h-3 w-5/6 rounded bg-white/10" />
                <div className="h-24 w-full rounded-xl bg-white/5 border border-white/10" />
              </div>
              <div className="mt-5 flex gap-2">
                <div className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-black">Generate</div>
                <div className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/70">Save</div>
                <div className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/70">Export</div>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-20 border-t border-white/10 pt-8 text-xs text-white/50">
          © {new Date().getFullYear()} IBlacker. All rights reserved.
        </footer>
      </div>
    </main>
  );
}