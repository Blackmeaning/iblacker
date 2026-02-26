import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { requireUserId } from "@/lib/currentUser";

export const runtime = "nodejs";

type ChatRole = "system" | "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function isChatRole(v: unknown): v is ChatRole {
  return v === "system" || v === "user" || v === "assistant";
}

function parseMessages(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input)) return null;

  const result: ChatMessage[] = [];

  for (const item of input) {
    if (!isRecord(item)) return null;

    const role = item["role"];
    const content = item["content"];

    if (!isChatRole(role)) return null;
    if (typeof content !== "string") return null;

    const trimmed = content.trim();
    if (trimmed.length === 0) return null;

    result.push({ role, content: trimmed });
  }

  return result;
}

export async function POST(req: Request) {
  try {
    await requireUserId(); // protect endpoint

    const body: unknown = await req.json().catch(() => null);
    if (!isRecord(body)) {
      return NextResponse.json({ error: "bad_body" }, { status: 400 });
    }

    const messages = parseMessages(body["messages"]);
    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "messages_required" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are IBlacker AI. Be concise, practical, and intelligent. If discussing investing, focus on education and include a short risk disclaimer.",
        },
        ...messages,
      ],
      temperature: 0.3,
    });

    const reply = completion.choices[0]?.message?.content ?? "";

    return NextResponse.json({
      ok: true,
      message: reply,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "chat_failed";

    return NextResponse.json(
      { error: "chat_failed", detail: message },
      { status: 500 }
    );
  }
}
