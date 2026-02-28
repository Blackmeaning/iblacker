"use client";

import { useState } from "react";

async function postJson(url: string, body: any) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Request failed");
  return data;
}

export function PayPalBillingButtons() {
  const [loading, setLoading] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function subscribe(tier: "PRO" | "ELITE") {
    setErr(null);
    setLoading(`sub-${tier}`);
    try {
      const data = await postJson("/api/paypal/create-subscription", { tier });
      window.location.href = data.approveUrl;
    } catch (e: any) {
      setErr(e?.message || "Failed");
      setLoading(null);
    }
  }

  async function buyPack(pack: "pack10" | "pack25" | "pack50") {
    setErr(null);
    setLoading(`pack-${pack}`);
    try {
      const data = await postJson("/api/paypal/create-order", { pack });
      window.location.href = data.approveUrl;
    } catch (e: any) {
      setErr(e?.message || "Failed");
      setLoading(null);
    }
  }

  return (
    <div className="mt-6 grid gap-4">
      <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
        <div className="text-sm font-semibold text-white">Subscriptions</div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => subscribe("PRO")}
            disabled={!!loading}
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black disabled:opacity-60"
          >
            {loading === "sub-PRO" ? "Opening PayPal…" : "Subscribe PRO ($29/mo)"}
          </button>
          <button
            onClick={() => subscribe("ELITE")}
            disabled={!!loading}
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black disabled:opacity-60"
          >
            {loading === "sub-ELITE" ? "Opening PayPal…" : "Subscribe ELITE ($79/mo)"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
        <div className="text-sm font-semibold text-white">Credit Packs</div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => buyPack("pack10")}
            disabled={!!loading}
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black disabled:opacity-60"
          >
            {loading === "pack-pack10" ? "Opening PayPal…" : "Buy $10 (20k credits)"}
          </button>
          <button
            onClick={() => buyPack("pack25")}
            disabled={!!loading}
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black disabled:opacity-60"
          >
            {loading === "pack-pack25" ? "Opening PayPal…" : "Buy $25 (60k credits)"}
          </button>
          <button
            onClick={() => buyPack("pack50")}
            disabled={!!loading}
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black disabled:opacity-60"
          >
            {loading === "pack-pack50" ? "Opening PayPal…" : "Buy $50 (150k credits)"}
          </button>
        </div>
      </div>

      {err ? <div className="text-sm text-red-300">{err}</div> : null}
    </div>
  );
}
