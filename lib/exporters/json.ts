export function exportJSON(payload: unknown): { filename: string; mime: string; data: Buffer } {
  const text = JSON.stringify(payload, null, 2);
  return {
    filename: "export.json",
    mime: "application/json",
    data: Buffer.from(text, "utf-8"),
  };
}
