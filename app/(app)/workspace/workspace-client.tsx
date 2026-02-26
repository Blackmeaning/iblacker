"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Mode = "TEXT" | "CODE" | "IMAGE";

type Preview = {
  mode: Mode;
  category: string;
  title?: string;
  prompt: string;
  result: unknown;
};

type ImagePreviewResult = {
  image: { b64: string; mime?: string };
};

function hasImageB64(result: unknown): result is ImagePreviewResult {
  if (typeof result !== "object" || result === null) return false;
  if (!("image" in result)) return false;

  const img = (result as { image?: unknown }).image;
  if (typeof img !== "object" || img === null) return false;
  if (!("b64" in img)) return false;

  const b64 = (img as { b64?: unknown }).b64;
  return typeof b64 === "string" && b64.length > 0;
}

export default function WorkspaceClient() {
  const [mode, setMode] = useState<Mode>("TEXT");
  const [category, setCategory] = useState("GENERAL");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [saving, setSaving] = useState(false);

  const canGenerate = prompt.trim().length >= 8;

  const categories = useMemo(() => {
    if (mode === "TEXT") return ["GENERAL", "BUSINESS_PLAN", "CV", "BLUEPRINT", "MARKETING"];
    if (mode === "CODE") return ["GENERAL", "API", "WEBSITE", "APP_MODULE"];
    return ["GENERAL", "LOGO", "ILLUSTRATION", "UI_MOCKUP"];
  }, [mode]);

  async function generate() {
    setLoading(true);
    setPreview(null);
    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode, category, prompt }),
      });
      const data: unknown = await res.json();

      if (!res.ok) {
        const msg =
          typeof data === "object" && data !== null && "error" in data
            ? String((data as { error?: unknown }).error ?? "Failed")
            : "Failed";
        throw new Error(msg);
      }

      const title =
        typeof data === "object" && data !== null && "title" in data
          ? String((data as { title?: unknown }).title ?? "")
          : "";

      const result =
        typeof data === "object" && data !== null && "result" in data
          ? (data as { result?: unknown }).result
          : null;

      setPreview({ mode, category, prompt, title, result });
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!preview) return;
    setSaving(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(preview),
      });
      const data: unknown = await res.json();

      if (!res.ok) {
        const msg =
          typeof data === "object" && data !== null && "error" in data
            ? String((data as { error?: unknown }).error ?? "Failed to save")
            : "Failed to save";
        throw new Error(msg);
      }

      const id =
        typeof data === "object" && data !== null && "id" in data
          ? String((data as { id?: unknown }).id ?? "")
          : "";

      if (!id) throw new Error("Missing project id from server");
      window.location.href = `/projects/${id}`;
    } catch (e) {
      alert(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
        <div className="grid gap-3">
          <label className="text-xs text-white/60">Mode</label>
          <div className="flex gap-2">
            {(["TEXT", "CODE", "IMAGE"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setCategory("GENERAL");
                }}
                className={
                  "rounded-xl px-3 py-2 text-xs border " +
                  (mode === m
                    ? "bg-white text-black border-white"
                    : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10")
                }
              >
                {m}
              </button>
            ))}
          </div>

          <label className="mt-4 text-xs text-white/60">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <label className="mt-4 text-xs text-white/60">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[160px] rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
            placeholder="Describe what you want IBlacker to generate…"
          />

          <div className="mt-2 flex gap-2">
            <button
              disabled={!canGenerate || loading}
              onClick={generate}
              className={
                "rounded-xl px-4 py-2 text-sm font-semibold " +
                (canGenerate && !loading
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-white/10 text-white/40")
              }
            >
              {loading ? "Generating…" : "Generate preview"}
            </button>

            <button
              disabled={!preview || saving}
              onClick={save}
              className={
                "rounded-xl px-4 py-2 text-sm border " +
                (preview && !saving
                  ? "border-white/15 bg-white/5 hover:bg-white/10"
                  : "border-white/10 bg-white/5 text-white/40")
              }
            >
              {saving ? "Saving…" : "Save to Projects"}
            </button>
          </div>

          <div className="mt-2 text-xs text-white/50">
            Preview does not save to DB until you click Save.
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
        <div className="text-xs text-white/50">Preview</div>

        {!preview ? (
          <div className="mt-4 text-sm text-white/60">
            Generate a preview to see the structured output here.
          </div>
        ) : (
          <div className="mt-4">
            <div className="text-sm font-semibold">{preview.title || preview.category}</div>
            <div className="mt-2 text-xs text-white/50">Mode: {preview.mode}</div>

            {preview.mode === "IMAGE" && hasImageB64(preview.result) ? (
              <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
                <Image
                  src={`data:image/png;base64,${preview.result.image.b64}`}
                  alt="Generated preview"
                  width={1024}
                  height={1024}
                  className="h-auto w-full"
                  priority
                />
              </div>
            ) : (
              <pre className="mt-4 max-h-[420px] overflow-auto rounded-xl border border-white/10 bg-black/50 p-4 text-xs text-white/80">
{JSON.stringify(preview.result, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
