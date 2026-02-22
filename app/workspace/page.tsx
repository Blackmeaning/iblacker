"use client";

import { useState } from "react";

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("App Builder");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function onGenerate() {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const endpoint =
        mode === "App Builder" ? "/api/app-builder" : "/api/generate";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, mode }),
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
      body: JSON.stringify({ prompt }),
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
          App Builder generates a blueprint and can export a project ZIP.
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

          {error && <div className="mt-4 text-sm text-red-300">{error}</div>}

          {data && (
            <div className="mt-6 bg-black border border-gray-800 rounded-xl p-5">
              <div className="text-sm text-gray-400 mb-3">
                Mode: <span className="text-white">{mode}</span>
              </div>

              {mode === "App Builder" ? (
                <>
                  <h2 className="text-lg font-semibold mb-3">Blueprint</h2>
                  <pre className="text-gray-300 whitespace-pre-wrap text-sm overflow-auto">
                    {JSON.stringify(data, null, 2)}
                  </pre>

                  <button
                    onClick={onDownloadZip}
                    className="mt-4 bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
                  >
                    Download Project ZIP
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold mb-3">Plan</h2>
                  <ol className="list-decimal pl-6 text-gray-300 space-y-1">
                    {data.plan?.map((x: string, i: number) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ol>

                  <h2 className="text-lg font-semibold mt-6 mb-3">Output</h2>
                  <div className="text-gray-300 whitespace-pre-wrap">
                    {data.output}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}