import { NextResponse } from "next/server";
import { generateBlueprint } from "../../../lib/appbuilder/blueprint";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = body?.prompt?.trim();
    const modules = Array.isArray(body?.modules) ? body.modules : [];

    if (!prompt) {
      return NextResponse.json({ error: "prompt required" }, { status: 400 });
    }

    const blueprint = await generateBlueprint(prompt, modules);
    return NextResponse.json(blueprint);
  } catch (e: any) {
    return NextResponse.json(
      { error: "builder_failed", message: e?.message || String(e) },
      { status: 500 }
    );
  }
}