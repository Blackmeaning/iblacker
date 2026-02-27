import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/currentUser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FREE_GEN_LIMIT_PER_MONTH = 20; // change later

function monthKey(d = new Date()) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

async function isProUser(userId: string) {
  const sub = await prisma.subscription.findUnique({ where: { userId } });
  if (!sub) return false
  const active = sub.status === "active";
  if (!active) return false;
  if (sub.currentPeriodEnd && sub.currentPeriodEnd < new Date()) return false;
  return true;
}

export async function POST(req: Request) {
  try {
    const userId = await requireUserId();

    const body = (await req.json()) as { messages?: Array<{ role: "user" | "assistant"; content: string }> };
    const messages = body.messages ?? [];

    if (messages.length === 0) {
      return NextResponse.json({ error: "missing_messages" }, { status: 400 });
    }

    const pro = await isProUser(userId);

    if (!pro) {
      const period = monthKey();
      const usage = await prisma.usage.upsert({
        where: { userId_period: { userId, period } },
        update: {},
        create: { userId, period, generations: 0, tokensIn: 0, tokensOut: 0 },
      });

      if (usage.generations >= FREE_GEN_LIMIT_PER_MONTH) {
        return NextResponse.json(
          { error: "upgrade_required", detail: "Free monthly limit reached. Upgrade to Pro to continue." },
          { status: 402 }
        );
      }

      await prisma.usage.update({
        where: { id: usage.id },
        data: { generations: { increment: 1 } },
      });
    }

    const system = [
      "You are IBlacker AI. Be concise, practical, and intelligent.",
      "If discussing investing: educational only (not financial advice). Mention risk briefly.",
    ].join(" ");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: system }, ...messages],
      temperature: 0.7,
    });

    const text = completion.choices[0]?.message?.content ?? "";
    return NextResponse.json({ text });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "unknown_error";
    return NextResponse.json({ error: "chat_failed", detail: msg }, { status: 500 });
  }
}
