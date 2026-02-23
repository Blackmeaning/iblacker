export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { PassThrough } from "stream";
import { generateProjectFiles } from "../../../../lib/appbuilder/projectGenerator";

const archiver = require("archiver");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = body?.prompt?.trim();
    const modules = Array.isArray(body?.modules) ? body.modules : [];

    if (!prompt) {
      return NextResponse.json({ error: "prompt required" }, { status: 400 });
    }

    const { files } = await generateProjectFiles(prompt, modules);

    const stream = new PassThrough();
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.on("error", (err: any) => stream.destroy(err));
    archive.pipe(stream);

    for (const [filePath, content] of Object.entries(files)) {
      archive.append(String(content), { name: filePath });
    }

    await archive.finalize();

    return new NextResponse(stream as any, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="iblacker-app.zip"',
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "export_failed", message: e?.message || String(e) },
      { status: 500 }
    );
  }
}