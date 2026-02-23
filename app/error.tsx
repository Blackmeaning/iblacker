"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body style={{ background: "#000", color: "#fff", padding: 24, fontFamily: "system-ui" }}>
        <h1 style={{ fontSize: 28, fontWeight: 900 }}>App Error</h1>
        <p style={{ opacity: 0.7 }}>
          This page crashed. Here is the real error message:
        </p>

        <pre style={{ marginTop: 16, padding: 16, background: "#111", border: "1px solid #222", borderRadius: 12, overflow: "auto" }}>
          {error?.message}
          {"\n\n"}
          Digest: {error?.digest || "none"}
        </pre>

        <button
          onClick={() => reset()}
          style={{ marginTop: 16, background: "#fff", color: "#000", fontWeight: 800, padding: "10px 14px", borderRadius: 10 }}
        >
          Retry
        </button>
      </body>
    </html>
  );
}