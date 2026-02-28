"use client";

import { useEffect, useMemo, useState } from "react";
import { SettingsCard } from "@/components/SettingsCard";

type MeUser = {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
  role: "USER" | "ADMIN";
  plan: string;
  creditsBalance: number;
  monthlyCredits: number;
  autoTopUp: boolean;
  autoTopUpThreshold: number;
  autoTopUpAmount: number;
  stripeCustomerId: string | null;
  subscription: { status: string; stripePriceId: string | null; currentPeriodEnd: string | null } | null;
  createdAt: string;
};

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [user, setUser] = useState<MeUser | null>(null);
  const [autoTopUp, setAutoTopUp] = useState(false);
  const [threshold, setThreshold] = useState(2000);
  const [amount, setAmount] = useState(10000);

  const dirty = useMemo(() => {
    if (!user) return false;
    return (
      autoTopUp !== user.autoTopUp ||
      threshold !== user.autoTopUpThreshold ||
      amount !== user.autoTopUpAmount
    );
  }, [user, autoTopUp, threshold, amount]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setErr(null);
        const res = await fetch("/api/me", { cache: "no-store" });
        if (!res.ok) {
          // If not authed, NextAuth usually redirects elsewhere; keep message clean.
          const text = await res.text();
          throw new Error(text || `Failed: ${res.status}`);
        }
        const data = (await res.json()) as { user: MeUser };
        if (!alive) return;

        setUser(data.user);
        setAutoTopUp(Boolean(data.user.autoTopUp));
        setThreshold(Number(data.user.autoTopUpThreshold) || 2000);
        setAmount(Number(data.user.autoTopUpAmount) || 10000);
      } catch (e) {
        if (!alive) return;
        setErr(e instanceof Error ? e.message : "Failed to load settings");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  async function save() {
    if (!dirty) return;
    try {
      setSaving(true);
      setErr(null);

      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          autoTopUp,
          autoTopUpThreshold: threshold,
          autoTopUpAmount: amount,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Save failed: ${res.status}`);
      }

      const data = (await res.json()) as { ok: boolean; user: Partial<MeUser> };
      setUser((prev) => (prev ? { ...prev, ...data.user } as MeUser : prev));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Settings</h1>
          <p className="mt-1 text-sm text-white/60">Manage your account, plan, and auto top-up.</p>
        </div>

        <button
          onClick={() => void save()}
          disabled={!dirty || saving || loading}
          className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {err ? (
        <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {err}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4">
        <SettingsCard
          title="Account"
          description="Identity + sign-in provider (Google)."
        >
          {loading ? (
            <div className="text-sm text-white/60">Loading…</div>
          ) : user ? (
            <div className="grid gap-2 text-sm">
              <div className="text-white">
                <span className="text-white/60">Email:</span> {user.email ?? "—"}
              </div>
              <div className="text-white">
                <span className="text-white/60">Name:</span> {user.name ?? "—"}
              </div>
              <div className="text-white">
                <span className="text-white/60">Role:</span> {user.role}
              </div>
              <div className="text-white">
                <span className="text-white/60">Member since:</span>{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
          ) : (
            <div className="text-sm text-white/60">Not signed in.</div>
          )}
        </SettingsCard>

        <SettingsCard
          title="Plan & Credits"
          description="Credits are used for generations. Your plan can include monthly credits + auto top-up."
        >
          {loading ? (
            <div className="text-sm text-white/60">Loading…</div>
          ) : user ? (
            <div className="grid gap-2 text-sm">
              <div className="text-white">
                <span className="text-white/60">Plan:</span> {user.plan}
              </div>
              <div className="text-white">
                <span className="text-white/60">Credits balance:</span> {user.creditsBalance.toLocaleString()}
              </div>
              <div className="text-white">
                <span className="text-white/60">Monthly credits:</span> {user.monthlyCredits.toLocaleString()}
              </div>
              <div className="text-white">
                <span className="text-white/60">Subscription status:</span>{" "}
                {user.subscription?.status ?? "none"}
              </div>
            </div>
          ) : (
            <div className="text-sm text-white/60">Not signed in.</div>
          )}
        </SettingsCard>

        <SettingsCard
          title="Auto Top-Up"
          description="If enabled, we can automatically add credits when you drop below a threshold (Stripe required)."
        >
          <div className="grid gap-4">
            <label className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <div>
                <div className="text-sm font-semibold text-white">Enable Auto Top-Up</div>
                <div className="text-xs text-white/60">Keeps your app running when credits get low.</div>
              </div>
              <input
                type="checkbox"
                checked={autoTopUp}
                onChange={(e) => setAutoTopUp(e.target.checked)}
                className="h-5 w-5"
                disabled={loading}
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <div className="text-xs text-white/60">Threshold (credits)</div>
                <input
                  type="number"
                  min={0}
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none"
                  disabled={loading}
                />
              </label>

              <label className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <div className="text-xs text-white/60">Top-up amount (credits)</div>
                <input
                  type="number"
                  min={0}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none"
                  disabled={loading}
                />
              </label>
            </div>

            <div className="text-xs text-white/50">
              Auto top-up is stored now. Charging requires Stripe keys + a checkout flow (we’ll wire that next).
            </div>
          </div>
        </SettingsCard>

        <SettingsCard
          title="Sign out"
          description="Signing out clears your session."
          right={
            <a
              href="/api/auth/signout?callbackUrl=/login"
              className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black"
            >
              Sign out
            </a>
          }
        />
      </div>
    </div>
  );
}
