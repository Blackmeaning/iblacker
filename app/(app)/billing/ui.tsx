"use client";

import { useState } from "react";

type Props = {
  plan: "FREE" | "PRO";
  credits: number;
  subscriptionStatus: string;
};

async function startCheckout(payload: unknown) {
  const res = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: { url?: string; error?: string; detail?: string } = await res.json().catch(() => ({}));
  if (!res.ok || !data.url) {
    const msg = data.detail ? `${data.error}: ${data.detail}` : data.error || "checkout_failed";
    throw new Error(msg);
  }

  window.location.href = data.url;
}

export default function BillingClient({ plan, credits, subscriptionStatus }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [err, setErr] = useState<string>("");

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-semibold">Billing</h1>
      <p className="mt-2 text-sm text-white/60">
        Buy credits (tokens) or subscribe to PRO for monthly credits.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="text-sm text-white/60">Current Plan</div>
          <div className="mt-1 text-xl font-medium">{plan}</div>
          <div className="mt-3 text-sm text-white/60">Subscription status: {subscriptionStatus}</div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-4">
            <div className="text-sm text-white/60">Credits balance</div>
            <div className="mt-1 text-3xl font-semibold">{credits.toLocaleString()}</div>
            <div className="mt-2 text-xs text-white/50">
              Credits are consumed when you generate content or chat.
            </div>
          </div>

          <button
            onClick={async () => {
              setErr("");
              setLoading("pro");
              try {
                await startCheckout({ mode: "subscription" });
              } catch (e) {
                setErr(e instanceof Error ? e.message : "failed");
                setLoading(null);
              }
            }}
            className="mt-6 w-full rounded-2xl bg-white px-6 py-3 text-black font-medium hover:bg-white/90 transition disabled:opacity-50"
            disabled={loading !== null}
          >
            {loading === "pro" ? "Opening Stripe…" : "Upgrade to PRO (monthly credits)"}
          </button>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="text-sm text-white/60">Buy Credits</div>
          <div className="mt-1 text-xl font-medium">One-time top ups</div>
          <p className="mt-2 text-sm text-white/60">
            Instant credits added to your balance after payment.
          </p>

          <div className="mt-6 grid gap-3">
            {[
              { id: "starter", title: "Starter", desc: "2,000 credits", hint: "Good for testing" },
              { id: "growth", title: "Growth", desc: "8,000 credits", hint: "For active users" },
              { id: "scale", title: "Scale", desc: "20,000 credits", hint: "For teams & heavy usage" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={async () => {
                  setErr("");
                  setLoading(p.id);
                  try {
                    await startCheckout({ mode: "payment", pack: p.id });
                  } catch (e) {
                    setErr(e instanceof Error ? e.message : "failed");
                    setLoading(null);
                  }
                }}
                className="group rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-left hover:bg-white/[0.06] transition disabled:opacity-50"
                disabled={loading !== null}
              >
                <div className="flex items-center justify-between">
                  <div className="text-base font-semibold">{p.title}</div>
                  <div className="text-xs text-white/60">{p.hint}</div>
                </div>
                <div className="mt-1 text-sm text-white/70">{p.desc}</div>
                <div className="mt-2 text-xs text-white/50 group-hover:text-white/70">
                  Click to pay via Stripe
                </div>
                {loading === p.id && <div className="mt-2 text-xs text-white/60">Opening Stripe…</div>}
              </button>
            ))}
          </div>

          {err && (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {err}
            </div>
          )}

          <div className="mt-6 text-xs text-white/40">
            Tip: You can tune credit amounts + pricing later without changing code (Stripe prices).
          </div>
        </div>
      </div>
    </div>
  );
}
