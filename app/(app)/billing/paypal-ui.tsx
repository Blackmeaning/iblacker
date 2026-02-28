"use client";

import { useMemo, useState } from "react";

type CreateSubscriptionResponse = { id: string; approveUrl: string };
type CreateOrderResponse = { id: string; approveUrl: string };

type PlanKey = "PRO" | "ELITE";
type PackKey = "PACK_10K" | "PACK_50K" | "PACK_150K";

const PLANS: Array<{ key: PlanKey; name: string; priceLabel: string; creditsLabel: string }> = [
  { key: "PRO", name: "Pro", priceLabel: "$9.99 / month", creditsLabel: "50,000 credits / month" },
  { key: "ELITE", name: "Elite", priceLabel: "$29.99 / month", creditsLabel: "200,000 credits / month" },
];

const PACKS: Array<{ key: PackKey; name: string; priceLabel: string; credits: number }> = [
  { key: "PACK_10K", name: "10K Credits", priceLabel: "$4.99", credits: 10_000 },
  { key: "PACK_50K", name: "50K Credits", priceLabel: "$19.99", credits: 50_000 },
  { key: "PACK_150K", name: "150K Credits", priceLabel: "$49.99", credits: 150_000 },
];

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || `Request failed: ${res.status}`);
  }

  return (await res.json()) as T;
}

export default function PayPalBillingUI() {
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const planButtons = useMemo(() => PLANS, []);
  const packButtons = useMemo(() => PACKS, []);

  async function startSubscription(plan: PlanKey) {
    setErr(null);
    setBusy(`Starting ${plan}...`);
    try {
      const data = await postJson<CreateSubscriptionResponse>("/api/paypal/create-subscription", { plan });
      window.location.href = data.approveUrl;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to start subscription";
      setErr(msg);
      setBusy(null);
    }
  }

  async function buyPack(pack: PackKey) {
    setErr(null);
    setBusy("Creating order...");
    try {
      const data = await postJson<CreateOrderResponse>("/api/paypal/create-order", { pack });
      window.location.href = data.approveUrl;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to create order";
      setErr(msg);
      setBusy(null);
    }
  }

  return (
    <div className="space-y-10">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Subscriptions</h2>
        <p className="mt-1 text-sm text-white/70">Monthly credits reset automatically each billing cycle.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {planButtons.map((p) => (
            <div key={p.key} className="rounded-2xl border border-white/10 bg-black/30 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-white font-semibold">{p.name}</div>
                  <div className="text-sm text-white/70">{p.creditsLabel}</div>
                </div>
                <div className="text-sm text-white/80">{p.priceLabel}</div>
              </div>

              <button
                className="mt-4 w-full rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black disabled:opacity-60"
                disabled={!!busy}
                onClick={() => startSubscription(p.key)}
              >
                Subscribe with PayPal
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Credit packs</h2>
        <p className="mt-1 text-sm text-white/70">One-time purchase. Credits add to your balance after payment.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {packButtons.map((p) => (
            <div key={p.key} className="rounded-2xl border border-white/10 bg-black/30 p-5">
              <div className="text-white font-semibold">{p.name}</div>
              <div className="text-sm text-white/70">{p.credits.toLocaleString()} credits</div>
              <div className="mt-1 text-sm text-white/80">{p.priceLabel}</div>

              <button
                className="mt-4 w-full rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black disabled:opacity-60"
                disabled={!!busy}
                onClick={() => buyPack(p.key)}
              >
                Buy with PayPal
              </button>
            </div>
          ))}
        </div>
      </div>

      {busy ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/80">{busy}</div>
      ) : null}

      {err ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{err}</div>
      ) : null}
    </div>
  );
}
