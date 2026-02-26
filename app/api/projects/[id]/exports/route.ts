import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/currentUser";
import PDFDocument from "pdfkit";
import { Document, Packer, Paragraph, TextRun } from "docx";

export const runtime = "nodejs";

type ExportRequestBody = {
  type?: "JSON" | "PDF" | "DOCX" | "IMAGE_FILE";
  filename?: string;
};

function toSafeString(value: unknown): string {
  if (typeof value === "string") return value;
  return JSON.stringify(value, null, 2);
}

function tryExtractImageDataUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  // data:image/png;base64,....
  if (value.startsWith("data:image/") && value.includes(";base64,")) return value;

  // Sometimes stored as raw base64 (no prefix) - we treat as png base64.
  const maybeB64 = value.trim();
  if (/^[A-Za-z0-9+/=]+$/.test(maybeB64) && maybeB64.length > 200) {
    return `data:image/png;base64,${maybeB64}`;
  }
  return null;
}

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const idx = dataUrl.indexOf(";base64,");
  const b64 = idx >= 0 ? dataUrl.slice(idx + 8) : "";
  const buf = Buffer.from(b64, "base64");
  return new Uint8Array(buf);
}

async function buildPdfBytes(opts: {
  title: string;
  prompt: string;
  resultText: string;
  imageDataUrl?: string | null;
}): Promise<Uint8Array> {
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const chunks: Buffer[] = [];

  doc.on("data", (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
  const done = new Promise<Uint8Array>((resolve, reject) => {
    doc.on("end", () => resolve(new Uint8Array(Buffer.concat(chunks))));
    doc.on("error", reject);
  });

  doc.fontSize(18).text(opts.title, { underline: true });
  doc.moveDown();
  doc.fontSize(12).text("Prompt:", { continued: false });
  doc.fontSize(11).text(opts.prompt || "(none)");
  doc.moveDown();
  doc.fontSize(12).text("Result:", { continued: false });
  doc.fontSize(11).text(opts.resultText || "(empty)");

  if (opts.imageDataUrl) {
    try {
      const imgBytes = Buffer.from(
        opts.imageDataUrl.split(";base64,")[1] ?? "",
        "base64"
      );
      doc.addPage();
      doc.fontSize(14).text("Image Output:");
      doc.moveDown();
      doc.image(imgBytes, { fit: [500, 700], align: "center" });
    } catch {
      // ignore image embedding errors; still return the PDF
    }
  }

  doc.end();
  return done;
}

async function buildDocxBytes(opts: {
  title: string;
  prompt: string;
  resultText: string;
}): Promise<Uint8Array> {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [new TextRun({ text: opts.title, bold: true, size: 32 })],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [new TextRun({ text: "Prompt:", bold: true })],
          }),
          new Paragraph({ text: opts.prompt || "(none)" }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [new TextRun({ text: "Result:", bold: true })],
          }),
          ...opts.resultText
            .split("\n")
            .map((line) => new Paragraph({ text: line })),
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
      select: {
        id: true,
        title: true,
        prompt: true,
        mode: true,
        result: true,
        createdAt: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const body = (await req.json().catch(() => null)) as ExportRequestBody | null;
    const type = body?.type ?? "JSON";

    const safeTitle = project.title?.trim() || `Project ${project.id}`;
    const baseName = `project-${project.id}`;

    let filename = body?.filename?.trim() || "";
    let mimeType = "application/octet-stream";
    let bytes: Uint8Array;

    const resultText = toSafeString(project.result);
    const imageCandidate =
      typeof project.result === "string"
        ? tryExtractImageDataUrl(project.result)
        : null;

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
              mode: project.mode,
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
      bytes = await buildPdfBytes({
        title: safeTitle,
        prompt: project.prompt,
        resultText,
        imageDataUrl: imageCandidate,
      });
    } else if (type === "DOCX") {
      filename = filename || `${baseName}.docx`;
      mimeType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      bytes = await buildDocxBytes({
        title: safeTitle,
        prompt: project.prompt,
        resultText,
      });
    } else if (type === "IMAGE_FILE") {
      const dataUrl = imageCandidate;
      if (!dataUrl) {
        return NextResponse.json(
          { error: "no_image_available" },
          { status: 400 }
        );
      }
      filename = filename || `${baseName}.png`;
      mimeType = "image/png";
      bytes = dataUrlToBytes(dataUrl);
    } else {
      return NextResponse.json({ error: "bad_type" }, { status: 400 });
    }

    const created = await prisma.projectExport.create({
      data: {
        userId,
        projectId,
        filename,
        mimeType,
        data: bytes,
        size: bytes.byteLength,
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

    if (!project) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const exportsList = await prisma.projectExport.findMany({
      where: { projectId, userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        filename: true,
        mimeType: true,
        size: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ ok: true, exports: exportsList });
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
}
