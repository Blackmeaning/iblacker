"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("App Builder");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [modAuth, setModAuth] = useState(true);
  const [modDb, setModDb] = useState(true);
  const [modPayments, setModPayments] = useState(true);

  function selectedModules() {
    const m: string[] = [];
    if (modAuth) m.push("auth");
    if (modDb) m.push("db");
    if (modPayments) m.push("payments");
    return m;
  }

  // load old project via ?load=<id>
  useEffect(() => {
    const url = new URL(window.location.href);
    const id = url.searchParams.get("load");
    if (!id) return;

    (async () => {
      try {
        const res = await fetch(`/api/projects/${id}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json?.message || "Failed to load project");
        setPrompt(json.project.prompt || "");
        setMode(json.project.mode || "App Builder");
        setData(json.project.result || null);
      } catch (e: any) {
        setError(e?.message || "Load error");
      }
    })();
  }, []);

  async function onGenerate() {
    setLoading(true);
    setError(null);

    try {
      const endpoint =
        mode === "App Builder" ? "/api/app-builder" : "/api/generate";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, mode, modules: selectedModules() }),
      });

      const text = await res.text();
      let json: any = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch {}

      if (!res.ok) {
        throw new Error(json?.message || json?.error || text || "Request failed");
      }
      if (!json) throw new Error("Empty response");

      setData(json);
    } catch (e: any) {
      setError(e?.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  async function onDownloadZip() {
    const res = await fetch("/api/app-builder/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, modules: selectedModules() }),
    });

    if (!res.ok) {
      const t = await res.text();
      alert(t || "Export failed");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "iblacker-app.zip";
    a.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-2">Creative Workspace</h1>
        <p className="text-gray-400 mb-8">
          Open an old project, edit prompt, regenerate, export again.
        </p>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600"
              placeholder='Example: "Build a SaaS for gym booking"'
            />

            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="bg-black border border-gray-800 rounded-lg px-4 py-3 text-white"
            >
              <option>App Builder</option>
              <option>Design</option>
              <option>Video</option>
              <option>Music</option>
              <option>Marketing</option>
            </select>

            <button
              onClick={onGenerate}
              disabled={loading || !prompt.trim()}
              className="bg-white text-black font-semibold rounded-lg px-6 py-3 hover:bg-gray-200 transition disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={modAuth}
                onChange={(e) => setModAuth(e.target.checked)}
              />
              Auth
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={modDb}
                onChange={(e) => setModDb(e.target.checked)}
              />
              Database
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={modPayments}
                onChange={(e) => setModPayments(e.target.checked)}
              />
              Payments
            </label>
          </div>

          {error && <div className="mt-4 text-sm text-red-300">{error}</div>}

          {data && (
            <div className="mt-6 bg-black border border-gray-800 rounded-xl p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm text-gray-400">
                  Mode: <span className="text-white">{mode}</span>
                </div>
                {mode === "App Builder" && (
                  <button
                    onClick={onDownloadZip}
                    className="bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
                  >
                    Download Project ZIP
                  </button>
                )}
              </div>

              <pre className="mt-4 text-xs text-gray-300 overflow-auto whitespace-pre-wrap">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}