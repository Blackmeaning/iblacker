export type NormalizedDoc = {
  title: string;
  summary: string;
  sections: Array<{ heading: string; content: string }>;
};

function asString(v: unknown, fallback = ""): string {
  if (typeof v === "string") return v;
  if (v == null) return fallback;
  try {
    return String(v);
  } catch {
    return fallback;
  }
}

export function normalizeResult(mode: string, category: string, result: unknown): NormalizedDoc {
  if (mode === "IMAGE") {
    return {
      title: `${category} (IMAGE)`,
      summary: "Generated image export.",
      sections: [{ heading: "Image", content: "This export contains an image." }],
    };
  }

  if (typeof result === "object" && result !== null) {
    const r = result as Record<string, unknown>;
    const title = asString(r.title, `${category} (${mode})`);
    const summary = asString(r.summary, "");
    const sectionsRaw = r.sections;

    const sections: Array<{ heading: string; content: string }> = Array.isArray(sectionsRaw)
      ? sectionsRaw
          .map((x) => {
            if (typeof x !== "object" || x === null) return null;
            const o = x as Record<string, unknown>;
            return {
              heading: asString(o.heading, "Section"),
              content: asString(o.content, ""),
            };
          })
          .filter((x): x is { heading: string; content: string } => !!x)
      : [{ heading: "Output", content: asString(result, "") }];

    return { title, summary, sections };
  }

  return {
    title: `${category} (${mode})`,
    summary: "",
    sections: [{ heading: "Output", content: asString(result, "") }],
  };
}

export function tryGetImageB64(result: unknown): string | null {
  if (typeof result !== "object" || result === null) return null;
  if (!("image" in result)) return null;

  const img = (result as { image?: unknown }).image;
  if (typeof img !== "object" || img === null) return null;
  if (!("b64" in img)) return null;

  const b64 = (img as { b64?: unknown }).b64;
  return typeof b64 === "string" && b64.length > 0 ? b64 : null;
}
