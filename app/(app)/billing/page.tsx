"use client";

import { useMemo, useState } from "react";

export default function BillingPage() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const qs = useMemo(() => {
    if (typeof window === "undefined") return { success: false, canceled: false };
    const sp = new URLSearchParams(window.location.search);
    return { success: sp.get("success") === "1", canceled: sp.get("canceled") === "1" };
  }, []);

  async function upgrade() {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string; detail?: string };

      if (!res.ok || !data.url) {
        throw new Error(data.detail || data.error || `request_failed_${res.status}`);
      }

      window.location.href = data.url;
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "unknown_error");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-semibold">Billing</h1>
      <p className="mt-2 text-sm text-white/60">
        Upgrade to Pro to unlock higher limits and keep your AI generations running.
      </p>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="text-sm text-white/60">Pro Subscription</div>
        <div className="mt-1 text-2xl font-semibold">$29 / month</div>

        <div className="mt-4 text-sm text-white/75">
          Includes higher fair-use limits, priority experience, and the best performance for consistent creation.
        </div>

        <button
          onClick={upgrade}
          disabled={loading}
          className="mt-6 w-full rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90 disabled:opacity-60"
        >
          {loading ? "Redirecting…" : "Upgrade to Pro"}
        </button>

        {qs.success ? <div className="mt-3 text-xs text-green-300">Payment successful ✅</div> : null}
        {qs.canceled ? <div className="mt-3 text-xs text-yellow-300">Checkout canceled.</div> : null}
        {err ? <div className="mt-3 text-xs text-red-300">{err}</div> : null}
      </div>
    </div>
  );
}
