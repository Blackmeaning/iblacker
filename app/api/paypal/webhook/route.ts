import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPayPalWebhook, paypalFetch } from "@/lib/paypal";

export const runtime = "nodejs";

type JsonObject = Record<string, unknown>;

function asObj(v: unknown): JsonObject | null {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as JsonObject) : null;
}

function asStr(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function path(v: unknown, keys: string[]): unknown {
  let cur: unknown = v;
  for (const k of keys) {
    const o = asObj(cur);
    if (!o) return undefined;
    cur = o[k];
  }
  return cur;
}

function tierToMonthlyCredits(tier: string): number {
  if (tier === "ELITE") return 200_000;
  if (tier === "PRO") return 50_000;
  return 0;
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const ok = await verifyPayPalWebhook(rawBody, new Headers(req.headers));
  if (!ok) return NextResponse.json({ error: "invalid webhook signature" }, { status: 400 });

  const eventUnknown: unknown = JSON.parse(rawBody);
  const event = asObj(eventUnknown);
  const type = asStr(event?.["event_type"]);

  try {
    // SUBSCRIPTION ACTIVATED
    if (type === "BILLING.SUBSCRIPTION.ACTIVATED") {
      const res = asObj(event?.["resource"]);
      const paypalSubscriptionId = asStr(res?.["id"]);
      const userId = asStr(res?.["custom_id"]);
      if (!paypalSubscriptionId || !userId) return NextResponse.json({ ok: true });

      const user = await prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });
      const tier = user?.plan ?? "PRO";
      const monthlyCredits = tierToMonthlyCredits(tier);

      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionStatus: "ACTIVE",
          monthlyCredits,
          creditsBalance: monthlyCredits,
          paypalSubscriptionId,
        },
      });

      return NextResponse.json({ ok: true });
    }

    // SUBSCRIPTION CANCELLED / SUSPENDED
    if (type === "BILLING.SUBSCRIPTION.CANCELLED" || type === "BILLING.SUBSCRIPTION.SUSPENDED") {
      const res = asObj(event?.["resource"]);
      const userId = asStr(res?.["custom_id"]);
      if (!userId) return NextResponse.json({ ok: true });

      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionStatus: "CANCELED",
          plan: "FREE",
          monthlyCredits: 0,
        },
      });

      return NextResponse.json({ ok: true });
    }

    // CREDIT PACKS: capture completed
    if (type === "PAYMENT.CAPTURE.COMPLETED" || type === "PAYMENT.SALE.COMPLETED") {
      const res = asObj(event?.["resource"]);

      const orderId = asStr(path(res, ["supplementary_data", "related_ids", "order_id"]));
      let userId = asStr(res?.["custom_id"]);
      let description = asStr(res?.["description"]);

      if (orderId) {
        const order = await paypalFetch<JsonObject>(`/v2/checkout/orders/${orderId}`);
        userId = asStr(path(order, ["purchase_units", "0", "custom_id"])) || userId;
        description = asStr(path(order, ["purchase_units", "0", "description"])) || description;
      }

      if (!userId) return NextResponse.json({ ok: true });

      const match = description.match(/credits:\s*(\d+)/i);
      const credits = match ? Math.max(0, parseInt(match[1], 10)) : 0;
      if (!credits) return NextResponse.json({ ok: true });

      await prisma.user.update({
        where: { id: userId },
        data: { creditsBalance: { increment: credits } },
      });

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "webhook failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
