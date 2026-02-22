import { NextResponse } from "next/server";
import { generateProjectFiles } from "@/lib/appbuilder/projectGenerator";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = body?.prompt?.trim();

    if (!prompt) {
      return NextResponse.json(
        { error: "prompt required" },
        { status: 400 }
      );
    }

    const blueprint = await generateBlueprint(prompt);

    return NextResponse.json(blueprint);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "builder failed" },
      { status: 500 }
    );
  }
}