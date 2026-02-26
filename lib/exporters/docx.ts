import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import { normalizeResult } from "./normalize";

export async function exportDOCX(params: {
  mode: string;
  category: string;
  result: unknown;
}): Promise<{ filename: string; mime: string; data: Buffer }> {
  const { mode, category, result } = params;
  const doc = normalizeResult(mode, category, result);

  const paragraphs: Paragraph[] = [new Paragraph({ text: doc.title, heading: HeadingLevel.TITLE })];

  if (doc.summary) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: doc.summary, italics: true })],
      })
    );
  }

  for (const s of doc.sections) {
    paragraphs.push(new Paragraph({ text: s.heading, heading: HeadingLevel.HEADING_1 }));
    paragraphs.push(new Paragraph({ text: s.content || "-" }));
  }

  const d = new Document({ sections: [{ children: paragraphs }] });
  const buf = await Packer.toBuffer(d);

  return {
    filename: "export.docx",
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    data: Buffer.from(buf),
  };
}
