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
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="flex items-center justify-between">
          <BrandMark size="sm" subtitle />
          <Link
            href="/login"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
          >
            Log in
          </Link>
        </header>

        <section className="mt-16 grid gap-10 lg:grid-cols-2">
          <div>
            <h1 className="text-5xl md:text-6xl font-semibold leading-[1.05]">
              Build digital products
              <br />
              with a single AI
              <br />
              workspace.
            </h1>

            <p className="mt-6 text-white/70 max-w-xl">
              Generate structured outputs for plans, code, content, and assets — then
              export to JSON, PDF, and DOCX. Built for speed, quality, and scalability.
            </p>

            <div className="mt-8 flex gap-3">
              <Link
                href="/login"
                className="rounded-xl bg-white text-black px-5 py-3 font-medium hover:bg-white/90 transition"
              >
                Start building
              </Link>
              <Link
                href="/login"
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-medium hover:bg-white/10 transition"
              >
                View dashboard
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-white/60">Preview</div>
            <div className="mt-4 space-y-3">
              <div className="h-3 rounded bg-white/10" />
              <div className="h-3 rounded bg-white/10 w-5/6" />
              <div className="h-3 rounded bg-white/10 w-4/6" />
              <div className="h-40 rounded-2xl border border-white/10 bg-black/30 mt-6" />
            </div>

            <div className="mt-6 flex gap-2">
              <button className="rounded-xl bg-white text-black px-4 py-2 text-sm font-medium">
                Generate
              </button>
              <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm">
                Save
              </button>
              <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm">
                Export
              </button>
            </div>
          </div>
        </section>

        <footer className="mt-20 text-xs text-white/40">
          © {new Date().getFullYear()} IBlacker. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
