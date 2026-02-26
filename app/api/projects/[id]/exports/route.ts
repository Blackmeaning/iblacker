import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId, UnauthorizedError } from "@/lib/currentUser";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { Document, Packer, Paragraph, TextRun } from "docx";

export const runtime = "nodejs";

type ExportType = "JSON" | "PDF" | "DOCX" | "IMAGE_FILE";
type ExportRequestBody = { type?: ExportType; filename?: string; imageIndex?: number };

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function getString(obj: Record<string, unknown>, key: string): string | null {
  const v = obj[key];
  return typeof v === "string" ? v : null;
}

function getNumber(obj: Record<string, unknown>, key: string): number | null {
  const v = obj[key];
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

function toPrismaBytes(input: Uint8Array): Uint8Array<ArrayBuffer> {
  const ab = new ArrayBuffer(input.byteLength);
  const out = new Uint8Array(ab);
  out.set(input);
  return out;
}

function toText(value: unknown): string {
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function looksLikeBase64(s: string): boolean {
  const t = s.trim();
  if (t.length < 200) return false;
  return /^[A-Za-z0-9+/=]+$/.test(t);
}

function isHttpUrl(s: string): boolean {
  return /^https?:\/\//i.test(s);
}

function parseDataUrlImage(dataUrl: string): { mime: string; bytes: Uint8Array } | null {
  const m = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/.exec(dataUrl);
  if (!m) return null;
  const mime = m[1] ?? "image/png";
  const b64 = m[2] ?? "";
  const buf = Buffer.from(b64, "base64");
  return { mime, bytes: new Uint8Array(buf) };
}

function base64ToBytes(b64: string): Uint8Array {
  return new Uint8Array(Buffer.from(b64, "base64"));
}

type ImageCandidate =
  | { kind: "dataUrl"; dataUrl: string }
  | { kind: "base64"; b64: string; mime?: string }
  | { kind: "url"; url: string };

function collectImageCandidates(value: unknown, out: ImageCandidate[]): void {
  if (typeof value === "string") {
    const s = value.trim();
    if (s.startsWith("data:image/") && s.includes(";base64,")) {
      out.push({ kind: "dataUrl", dataUrl: s });
      return;
    }
    if (isHttpUrl(s)) {
      out.push({ kind: "url", url: s });
      return;
    }
    if (looksLikeBase64(s)) {
      out.push({ kind: "base64", b64: s });
      return;
    }
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) collectImageCandidates(item, out);
    return;
  }

  if (isRecord(value)) {
    const b64 = getString(value, "b64_json");
    if (b64 && looksLikeBase64(b64)) out.push({ kind: "base64", b64 });

    const url = getString(value, "url");
    if (url && isHttpUrl(url)) out.push({ kind: "url", url });

    const mime = getString(value, "mime");

    const commonKeys = [
      "image",
      "imageBase64",
      "image_b64",
      "imageDataUrl",
      "dataUrl",
      "base64",
      "png",
      "jpeg",
      "jpg",
      "images",
      "outputs",
      "output",
      "result",
      "data",
    ];

    for (const k of commonKeys) {
      if (k in value) collectImageCandidates(value[k], out);
    }

    // also walk all fields
    for (const v of Object.values(value)) collectImageCandidates(v, out);

    // if we saw base64 but no mime, keep it as png by default
    if (mime && looksLikeBase64(mime)) {
      out.push({ kind: "base64", b64: mime });
    }
  }
}

async function fetchImageUrl(url: string): Promise<{ mime: string; bytes: Uint8Array } | null> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;

  const contentType = res.headers.get("content-type") ?? "application/octet-stream";
  if (!contentType.toLowerCase().startsWith("image/")) return null;

  const ab = await res.arrayBuffer();
  const bytes = new Uint8Array(ab);
  if (bytes.byteLength > 10 * 1024 * 1024) return null;

  return { mime: contentType, bytes };
}

async function extractImage(result: unknown, imageIndex: number): Promise<{ mime: string; bytes: Uint8Array } | null> {
  const candidates: ImageCandidate[] = [];
  collectImageCandidates(result, candidates);
  if (candidates.length === 0) return null;

  const idx = Math.max(0, Math.min(imageIndex, candidates.length - 1));
  const picked = candidates[idx];

  if (picked.kind === "dataUrl") return parseDataUrlImage(picked.dataUrl);
  if (picked.kind === "base64") return { mime: picked.mime ?? "image/png", bytes: base64ToBytes(picked.b64) };
  if (picked.kind === "url") return await fetchImageUrl(picked.url);

  return null;
}

async function buildPdfBytes(
  title: string,
  prompt: string,
  resultText: string
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  const page = pdfDoc.addPage();
  const { height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let y = height - 50;

  const drawTextBlock = (text: string, size: number) => {
    const lines = text.split("\n");
    for (const line of lines) {
      page.drawText(line, {
        x: 50,
        y,
        size,
        font,
      });
      y -= size + 6;
      if (y < 50) {
        y = height - 50;
        pdfDoc.addPage();
      }
    }
  };

  drawTextBlock(title || "Project", 20);
  y -= 10;
  drawTextBlock("Prompt:", 14);
  drawTextBlock(prompt || "(none)", 11);
  y -= 10;
  drawTextBlock("Result:", 14);
  drawTextBlock(resultText || "(empty)", 11);

  const pdfBytes = await pdfDoc.save();
  return new Uint8Array(pdfBytes);
}

async function buildDocxBytes(title: string, prompt: string, resultText: string): Promise<Uint8Array> {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ children: [new TextRun({ text: title || "Project", bold: true, size: 32 })] }),
          new Paragraph({ text: "" }),
          new Paragraph({ children: [new TextRun({ text: "Prompt:", bold: true })] }),
          new Paragraph({ text: prompt || "(none)" }),
          new Paragraph({ text: "" }),
          new Paragraph({ children: [new TextRun({ text: "Result:", bold: true })] }),
          ...String(resultText || "").split("\n").map((line) => new Paragraph({ text: line })),
        ],
      },
    ],
  });

  const buf = await Packer.toBuffer(doc);
  return new Uint8Array(buf);
}

function errorToMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  return "unknown_error";
}

export async function POST(req: Request, ctx: { params: { id: string } }) {
  let userId: string;
  try {
    userId = await requireUserId();
  } catch (e) {
    if (e instanceof UnauthorizedError) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "auth_failed" }, { status: 500 });
  }

  try {
    const projectId = ctx.params.id;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
      select: { id: true, title: true, prompt: true, result: true, createdAt: true },
    });

    if (!project) return NextResponse.json({ error: "not_found" }, { status: 404 });

    const raw: unknown = await req.json().catch(() => ({}));
    const body: ExportRequestBody = isRecord(raw)
      ? {
          type: (getString(raw, "type") as ExportType | null) ?? undefined,
          filename: getString(raw, "filename") ?? undefined,
          imageIndex: getNumber(raw, "imageIndex") ?? undefined,
        }
      : {};

    const type: ExportType = body.type ?? "JSON";
    const baseName = `project-${project.id}`;
    const title = project.title?.trim() || `Project ${project.id}`;
    const prompt = project.prompt ?? "";
    const resultText = toText(project.result);
    const imageIndex = typeof body.imageIndex === "number" ? body.imageIndex : 0;

    let filename = body.filename?.trim() || "";
    let mimeType = "application/octet-stream";
    let bytes: Uint8Array;

    if (type === "JSON") {
      filename = filename || `${baseName}.json`;
      mimeType = "application/json; charset=utf-8";
      bytes = new Uint8Array(
        Buffer.from(
          JSON.stringify(
            { id: project.id, title: project.title, prompt: project.prompt, createdAt: project.createdAt, result: project.result },
            null,
            2
          ),
          "utf8"
        )
      );
    } else if (type === "PDF") {
      filename = filename || `${baseName}.pdf`;
      mimeType = "application/pdf";
      bytes = await buildPdfBytes(title, prompt, resultText);
    } else if (type === "DOCX") {
      filename = filename || `${baseName}.docx`;
      mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      bytes = await buildDocxBytes(title, prompt, resultText);
    } else if (type === "IMAGE_FILE") {
      const image = await extractImage(project.result, imageIndex);
      if (!image) {
        return NextResponse.json(
          { error: "no_image_available", hint: "This project result does not contain an image (data URL, base64, b64_json, or image URL)." },
          { status: 400 }
        );
      }

      const ext =
        image.mime.includes("png") ? "png" : image.mime.includes("jpeg") ? "jpg" : image.mime.includes("webp") ? "webp" : "img";

      filename = filename || `${baseName}.${ext}`;
      mimeType = image.mime;
      bytes = image.bytes;
    } else {
      return NextResponse.json({ error: "bad_type" }, { status: 400 });
    }

    const prismaBytes = toPrismaBytes(bytes);

    const created = await prisma.projectExport.create({
      data: { userId, projectId, filename, mimeType, data: prismaBytes, size: prismaBytes.byteLength },
      select: { id: true },
    });

    return NextResponse.json({ ok: true, exportId: created.id });
  } catch (e) {
    // IMPORTANT: do not lie and say "unauthorized" when PDFKit fails
    return NextResponse.json(
      { error: "export_failed", detail: errorToMessage(e) },
      { status: 500 }
    );
  }
}

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  let userId: string;
  try {
    userId = await requireUserId();
  } catch (e) {
    if (e instanceof UnauthorizedError) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "auth_failed" }, { status: 500 });
  }

  try {
    const projectId = ctx.params.id;

    const project = await prisma.project.findFirst({ where: { id: projectId, userId }, select: { id: true } });
    if (!project) return NextResponse.json({ error: "not_found" }, { status: 404 });

    const exportsList = await prisma.projectExport.findMany({
      where: { projectId, userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, filename: true, mimeType: true, size: true, createdAt: true },
    });

    return NextResponse.json({ ok: true, exports: exportsList });
  } catch (e) {
    return NextResponse.json({ error: "exports_list_failed", detail: errorToMessage(e) }, { status: 500 });
  }
}
