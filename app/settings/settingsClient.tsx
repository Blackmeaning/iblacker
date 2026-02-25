"use client";

import { useState } from "react";

export default function SettingsClient({ initial }: { initial: any }) {
  const [theme, setTheme] = useState(initial.theme ?? "dark");
  const [locale, setLocale] = useState(initial.locale ?? "en");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setMsg(null);
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ theme, locale }),
    });
    setSaving(false);
    setMsg(res.ok ? "Saved ✅" : "Save failed");
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="text-sm font-semibold text-white/80">Theme</div>
          <select
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 p-3"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="dark">dark</option>
            <option value="light">light</option>
          </select>
        </div>

        <div>
          <div className="text-sm font-semibold text-white/80">Locale</div>
          <select
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 p-3"
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
          >
            <option value="en">en</option>
            <option value="he">he</option>
          </select>
        </div>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="mt-5 rounded-xl bg-white px-4 py-2 text-sm font-bold text-black disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save"}
      </button>

      {msg && <div className="mt-3 text-sm text-white/70">{msg}</div>}
    </div>
  );
}