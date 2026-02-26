"use client";

import { useState } from "react";

type ExportType = "JSON" | "PDF" | "DOCX" | "IMAGE_FILE";

export function ExportButtons({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState<ExportType | null>(null);

  async function doExport(type: ExportType) {
    try {
      setLoading(type);

      const res = await fetch(`/api/projects/${projectId}/exports`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type }),
      });

      const data = (await res.json().catch(() => null)) as
        | { ok: true; exportId: string }
        | { error: string; detail?: string }
        | null;

      if (!res.ok || !data || !("ok" in data) || data.ok !== true) {
        const msg =
          data && "error" in data && typeof data.error === "string"
            ? `${data.error}${data.detail ? `: ${data.detail}` : ""}`
            : "export_failed";
        alert(msg);
        return;
      }

      const url = `/api/projects/${projectId}/exports/${data.exportId}/download`;
      window.open(url, "_blank", "noopener,noreferrer");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button className="rounded-md border px-3 py-2 text-sm" onClick={() => void doExport("JSON")} disabled={loading !== null}>
        {loading === "JSON" ? "Exporting JSON..." : "Export JSON"}
      </button>

      <button className="rounded-md border px-3 py-2 text-sm" onClick={() => void doExport("PDF")} disabled={loading !== null}>
        {loading === "PDF" ? "Exporting PDF..." : "Export PDF"}
      </button>

      <button className="rounded-md border px-3 py-2 text-sm" onClick={() => void doExport("DOCX")} disabled={loading !== null}>
        {loading === "DOCX" ? "Exporting DOCX..." : "Export DOCX"}
      </button>

      <button
        className="rounded-md border px-3 py-2 text-sm"
        onClick={() => void doExport("IMAGE_FILE")}
        disabled={loading !== null}
        title="Exports a PNG if this project contains an image result"
      >
        {loading === "IMAGE_FILE" ? "Exporting Image..." : "Export Image"}
      </button>
    </div>
  );
}
