import PDFDocument from "pdfkit";
import { normalizeResult, tryGetImageB64 } from "./normalize";

export async function exportPDF(params: {
  mode: string;
  category: string;
  result: unknown;
}): Promise<{ filename: string; mime: string; data: Buffer }> {
  const { mode, category, result } = params;
  const doc = normalizeResult(mode, category, result);

  const pdf = new PDFDocument({ margin: 50 });
  const chunks: Buffer[] = [];

  pdf.on("data", (c) => chunks.push(Buffer.from(c)));
  const done = new Promise<Buffer>((resolve, reject) => {
    pdf.on("end", () => resolve(Buffer.concat(chunks)));
    pdf.on("error", reject);
  });

  pdf.fontSize(20).text(doc.title);
  pdf.moveDown();
  if (doc.summary) {
    pdf.fontSize(12).fillColor("gray").text(doc.summary);
    pdf.fillColor("black").moveDown();
  }

  // If IMAGE mode has base64, embed it
  const b64 = tryGetImageB64(result);
  if (mode === "IMAGE" && b64) {
    const imgBuf = Buffer.from(b64, "base64");
    pdf.moveDown();
    pdf.fontSize(12).text("Generated Image:");
    pdf.moveDown(0.5);
    // Fit image nicely on page
    pdf.image(imgBuf, { fit: [500, 500], align: "center" });
    pdf.addPage();
  }

  for (const s of doc.sections) {
    pdf.fontSize(14).text(s.heading);
    pdf.moveDown(0.25);
    pdf.fontSize(11).text(s.content || "-", { lineGap: 4 });
    pdf.moveDown();
  }

  pdf.end();
  const data = await done;

  return { filename: "export.pdf", mime: "application/pdf", data };
}
