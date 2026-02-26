import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/currentUser";
import PDFDocument from "pdfkit";
import { Document, Packer, Paragraph, TextRun } from "docx";

export const runtime = "nodejs";

type ExportType = "JSON" | "PDF" | "DOCX" | "IMAGE_FILE";
type ExportRequestBody = { type?: ExportType; filename?: string };

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function getString(obj: Record<string, unknown>, key: string): string | null {
  const v = obj[key];
  return typeof v === "string" ? v : null;
}

function toPrismaBytes(input: Uint8Array): Uint8Array<ArrayBuffer> {
  const ab = new ArrayBuffer(input.byteLength);
  const out = new Uint8Array(ab);
  out.set(input);
  return out;
}

function toText(value: unknown): string {
  if (typeof value === "string") return value;
  return JSON.stringify(value, null, 2);
}

function tryExtractImageDataUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;

  if (value.startsWith("data:image/") && value.includes(";base64,")) return value;

  const maybeB64 = value.trim();
  if (/^[A-Za-z0-9+/=]+$/.test(maybeB64) && maybeB64.length > 200) {
    return `data:image/png;base64,${maybeB64}`;
  }
  return null;
}

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const idx = dataUrl.indexOf(";base64,");
  const b64 = idx >= 0 ? dataUrl.slice(idx + 8) : "";
  return new Uint8Array(Buffer.from(b64, "base64"));
}

async function buildPdfBytes(
  title: string,
  prompt: string,
  resultText: string
): Promise<Uint8Array> {
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const chunks: Buffer[] = [];

  doc.on("data", (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));

  const done = new Promise<Uint8Array>((resolve, reject) => {
    doc.on("end", () => resolve(new Uint8Array(Buffer.concat(chunks))));
    doc.on("error", reject);
  });

  doc.fontSize(18).text(title, { underline: true });
  doc.moveDown();
  doc.fontSize(12).text("Prompt:");
  doc.fontSize(11).text(prompt || "(none)");
  doc.moveDown();
  doc.fontSize(12).text("Result:");
  doc.fontSize(11).text(resultText || "(empty)");
  doc.end();

  return done;
}

async function buildDocxBytes(
  title: string,
  prompt: string,
  resultText: string
): Promise<Uint8Array> {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [new TextRun({ text: title, bold: true, size: 32 })],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({ children: [new TextRun({ text: "Prompt:", bold: true })] }),
          new Paragraph({ text: prompt || "(none)" }),
          new Paragraph({ text: "" }),
          new Paragraph({ children: [new TextRun({ text: "Result:", bold: true })] }),
          ...resultText.split("\n").map((line) => new Paragraph({ text: line })),
        ],
      },
    ],
  });

  const buf = await Packer.toBuffer(doc);
  return new Uint8Array(buf);
}

export async function POST(req: Request, ctx: { params: { id: string } }) {
  try {
    const userId = await requireUserId();
    const projectId = ctx.params.id;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
      select: { id: true, title: true, prompt: true, result: true, createdAt: true },
    });

    if (!project) return NextResponse.json({ error: "not_found" }, { status: 404 });

    const rawBody: unknown = await req.json().catch(() => ({}));
    const body: ExportRequestBody = isRecord(rawBody)
      ? {
          type: (getString(rawBody, "type") as ExportType | null) ?? undefined,
          filename: getString(rawBody, "filename") ?? undefined,
        }
      : {};

    const type: ExportType = body.type ?? "JSON";
    const baseName = `project-${project.id}`;
    const title = project.title?.trim() || `Project ${project.id}`;

    const resultText = toText(project.result);
    const imageDataUrl = tryExtractImageDataUrl(project.result);

    let filename = body.filename?.trim() || "";
    let mimeType = "application/octet-stream";
    let bytes: Uint8Array;

    if (type === "JSON") {
      filename = filename || `${baseName}.json`;
      mimeType = "application/json; charset=utf-8";
      bytes = new Uint8Array(
        Buffer.from(
          JSON.stringify(
            {
              id: project.id,
              title: project.title,
              prompt: project.prompt,
              createdAt: project.createdAt,
              result: project.result,
            },
            null,
            2
          ),
          "utf8"
        )
      );
    } else if (type === "PDF") {
      filename = filename || `${baseName}.pdf`;
      mimeType = "application/pdf";
      bytes = await buildPdfBytes(title, project.prompt, resultText);
    } else if (type === "DOCX") {
      filename = filename || `${baseName}.docx`;
      mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      bytes = await buildDocxBytes(title, project.prompt, resultText);
    } else if (type === "IMAGE_FILE") {
      if (!imageDataUrl) return NextResponse.json({ error: "no_image_available" }, { status: 400 });
      filename = filename || `${baseName}.png`;
      mimeType = "image/png";
      bytes = dataUrlToBytes(imageDataUrl);
    } else {
      return NextResponse.json({ error: "bad_type" }, { status: 400 });
    }

    const prismaBytes: Uint8Array<ArrayBuffer> = toPrismaBytes(bytes);

    const created = await prisma.projectExport.create({
      data: {
        userId,
        projectId,
        filename,
        mimeType,
        data: prismaBytes,
        size: prismaBytes.byteLength,
      },
      select: { id: true },
    });

    return NextResponse.json({ ok: true, exportId: created.id });
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
}

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  try {
    const userId = await requireUserId();
    const projectId = ctx.params.id;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
      select: { id: true },
    });

    if (!project) return NextResponse.json({ error: "not_found" }, { status: 404 });

    const exportsList = await prisma.projectExport.findMany({
      where: { projectId, userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, filename: true, mimeType: true, size: true, createdAt: true },
    });

    return NextResponse.json({ ok: true, exports: exportsList });
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
}
