"use client";

import { useState } from "react";

export default function Workspace() {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("App");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function onGenerate() {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, mode }),
      });

      const text = await res.text();
      let json: any = null;

      try {
        json = text ? JSON.parse(text) : null;
      } catch {
        // ignore parse error
      }

      if (!res.ok) {
        throw new Error(
          json?.message || json?.error || text || "Request failed"
        );
      }

      if (!json) {
        throw new Error("Server returned empty response");
      }

      setData(json);
    } catch (e: any) {
      setError(e?.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-2">Creative Workspace</h1>
        <p className="text-gray-400 mb-8">
          Tell IBlacker what you want. It will generate a structured AI plan.
        </p>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <label className="block text-sm text-gray-300 mb-2">
            AI Command
          </label>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600"
              placeholder='Example: "Create a SaaS landing page for a fitness app"'
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

          {error && (
            <div className="mt-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {data && (
            <div className="mt-6 bg-black border border-gray-800 rounded-xl p-5">
              <div className="text-sm text-gray-400 mb-2">
                Mode: <span className="text-white">{mode}</span>
              </div>

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
            </div>
          )}
        </div>
      </div>
    </main>
  );
}