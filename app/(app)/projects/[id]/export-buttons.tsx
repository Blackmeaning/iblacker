"use client";

import { useState } from "react";

type ExportType = "JSON" | "PDF" | "DOCX";

export default function ExportButtons({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState<ExportType | null>(null);

  async function run(type: ExportType) {
    setLoading(type);
    try {
      const res = await fetch(`/api/projects/${projectId}/exports`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type }),
      });

      const data: unknown = await res.json();
      if (!res.ok) {
        const msg =
          typeof data === "object" && data !== null && "error" in data
            ? String((data as { error?: unknown }).error ?? "export_failed")
            : "export_failed";
        throw new Error(msg);
      }

      const url =
        typeof data === "object" && data !== null && "downloadUrl" in data
          ? String((data as { downloadUrl?: unknown }).downloadUrl ?? "")
          : "";

      if (!url) throw new Error("missing_download_url");
      window.location.href = url;
    } catch (e) {
      alert(e instanceof Error ? e.message : "Export failed");
    } finally {
      setLoading(null);
    }
  }

  const btn = (type: ExportType) => (
    <button
      key={type}
      onClick={() => run(type)}
      disabled={loading !== null}
      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-50"
    >
      {loading === type ? `Exporting ${type}…` : `Export ${type}`}
    </button>
  );

  return <div className="mt-3 flex flex-wrap gap-2">{(["JSON", "PDF", "DOCX"] as ExportType[]).map(btn)}</div>;
}
