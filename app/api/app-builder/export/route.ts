import { NextResponse } from "next/server";
import archiver from "archiver";
import { generateProjectFiles } from "@/lib/appbuilder/projectGenerator";
import { PassThrough } from "stream";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = body?.prompt?.trim();

    if (!prompt) {
      return NextResponse.json({ error: "prompt required" }, { status: 400 });
    }

    const { files } = await generateProjectFiles(prompt);

    const stream = new PassThrough();
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.pipe(stream);

    for (const [filePath, content] of Object.entries(files)) {
      archive.append(content, { name: filePath });
    }

    await archive.finalize();

    return new NextResponse(stream as any, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment; filename=iblacker-app.zip"
      }
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}