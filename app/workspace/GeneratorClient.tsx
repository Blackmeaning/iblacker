"use client";

import { useMemo, useState } from "react";

type Mode = "Design" | "App Builder";

export default function GeneratorClient() {
  const [mode, setMode] = useState<Mode>("Design");
  const [prompt, setPrompt] = useState("");
  const [modules, setModules] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const endpoint = useMemo(() => {
    return mode === "App Builder" ? "/api/app-builder" : "/api/generate";
  }, [mode]);

  function toggleModule(m: string) {
    setModules((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  }

  async function onGenerate() {
    setError(null);
    setResult(null);
    setProjectId(null);

    const trimmed = prompt.trim();
    if (!trimmed) {
      setError("Write a prompt first.");
      return;
    }

    setLoading(true);
    try {
      const payload =
        mode === "App Builder"
          ? { prompt: trimmed, modules }
          : { prompt: trimmed, mode: "Design" };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || data?.error || "Request failed.");
        return;
      }

      setResult(data);
      setProjectId(data?.projectId || null);
    } catch (e: any) {
      setError(e?.message || "Request failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setMode("Design")}
          className={[
            "rounded-xl px-4 py-2 text-sm font-semibold",
            mode === "Design"
              ? "bg-white text-black"
              : "border border-white/15 bg-transparent text-white hover:bg-white/10",
          ].join(" ")}
        >
          Design
        </button>

        <button
          onClick={() => setMode("App Builder")}
          className={[
            "rounded-xl px-4 py-2 text-sm font-semibold",
            mode === "App Builder"
              ? "bg-white text-black"
              : "border border-white/15 bg-transparent text-white hover:bg-white/10",
          ].join(" ")}
        >
          App Builder
        </button>

        <div className="ml-auto text-xs text-white/50">
          Saves to Projects automatically
        </div>
      </div>

      {mode === "App Builder" && (
        <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4">
          <div className="text-sm font-semibold">Modules</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { key: "auth", label: "Auth" },
              { key: "db", label: "Database" },
              { key: "payments", label: "Payments" },
            ].map((m) => {
              const active = modules.includes(m.key);
              return (
                <button
                  key={m.key}
                  onClick={() => toggleModule(m.key)}
                  className={[
                    "rounded-xl px-3 py-2 text-sm",
                    active
                      ? "bg-white text-black"
                      : "border border-white/15 bg-transparent text-white hover:bg-white/10",
                  ].join(" ")}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-5">
        <label className="text-sm font-semibold text-white/80">Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={
            mode === "App Builder"
              ? "Describe the app you want: pages, features, database models..."
              : "Describe what you want to generate..."
          }
          className="mt-2 min-h-[140px] w-full rounded-xl border border-white/10 bg-black/40 p-4 text-white placeholder:text-white/30 outline-none focus:border-white/25"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={onGenerate}
          disabled={loading}
          className="rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-black hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Generating..." : "Generate"}
        </button>

        {projectId && (
          <a
            href={`/projects/${projectId}`}
            className="rounded-xl border border-white/15 bg-transparent px-4 py-3 text-sm font-semibold hover:bg-white/10"
          >
            Open saved project →
          </a>
        )}

        <div className="ml-auto text-xs text-white/50">{endpoint}</div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 rounded-xl border border-white/10 bg-black/40 p-4">
          <div className="mb-2 text-sm font-semibold text-white/80">Result</div>
          <pre className="max-h-[420px] overflow-auto rounded-lg bg-black/60 p-4 text-xs text-white/80">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </section>
  );
}