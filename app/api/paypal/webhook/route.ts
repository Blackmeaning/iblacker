import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPayPalWebhook, paypalFetch } from "@/lib/paypal";

export const runtime = "nodejs";

type AnyObj = Record<string, any>;

function tierToMonthlyCredits(tier: string): number {
  if (tier === "ELITE") return 200_000;
  if (tier === "PRO") return 50_000;
  return 0;
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const headers = new Headers(req.headers);

  const ok = await verifyPayPalWebhook(rawBody, headers);
  if (!ok) return NextResponse.json({ error: "invalid webhook signature" }, { status: 400 });

  const event = JSON.parse(rawBody) as AnyObj;
  const type = String(event.event_type || "");

  try {
    // ---- SUBSCRIPTION ACTIVATED ----
    if (type === "BILLING.SUBSCRIPTION.ACTIVATED") {
      const sub = event.resource as AnyObj;
      const paypalSubscriptionId = String(sub.id || "");
      const userId = String(sub.custom_id || "");

      if (!paypalSubscriptionId || !userId) return NextResponse.json({ ok: true });

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { plan: true },
      });

      const tier = user?.plan ?? "PRO";
      const monthlyCredits = tierToMonthlyCredits(tier);

      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionStatus: "ACTIVE",
          monthlyCredits,
          creditsBalance: monthlyCredits, // reset monthly
          paypalSubscriptionId,
        },
      });

      return NextResponse.json({ ok: true });
    }

    // ---- SUBSCRIPTION CANCELLED / SUSPENDED ----
    if (type === "BILLING.SUBSCRIPTION.CANCELLED" || type === "BILLING.SUBSCRIPTION.SUSPENDED") {
      const sub = event.resource as AnyObj;
      const userId = String(sub.custom_id || "");
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

    // ---- PAYMENT CAPTURE COMPLETED (credit packs) ----
    // Some accounts send PAYMENT.CAPTURE.COMPLETED, some PAYMENT.SALE.COMPLETED.
    if (type === "PAYMENT.CAPTURE.COMPLETED" || type === "PAYMENT.SALE.COMPLETED") {
      const res = event.resource as AnyObj;

      // Try to find userId from custom_id
      const userId =
        String(res.custom_id || "") ||
        String(res?.supplementary_data?.related_ids?.order_id || "");

      // If it’s an order, fetch order to read purchase_units[0].custom_id / description
      let finalUserId = userId;
      let description = "";

      const orderId = String(res?.supplementary_data?.related_ids?.order_id || "");
      if (orderId) {
        const order = await paypalFetch<AnyObj>(`/v2/checkout/orders/${orderId}`);
        finalUserId = String(order?.purchase_units?.[0]?.custom_id || finalUserId);
        description = String(order?.purchase_units?.[0]?.description || "");
      } else {
        description = String(res?.description || "");
      }

      if (!finalUserId) return NextResponse.json({ ok: true });

      // parse credits from "iblacker credits: 60000"
      const m = description.match(/credits:\s*(\d+)/i);
      const credits = m ? Math.max(0, parseInt(m[1], 10)) : 0;
      if (!credits) return NextResponse.json({ ok: true });

      await prisma.user.update({
        where: { id: finalUserId },
        data: { creditsBalance: { increment: credits } },
      });

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "webhook failed" }, { status: 500 });
  }
}
