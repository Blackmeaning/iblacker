import Stripe from "stripe";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SubLike = {
  id?: string;
  status?: string;
  metadata?: Record<string, string>;
  items?: { data?: Array<{ price?: { id?: string } }> };
  current_period_end?: number;
};

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return new Response("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });

  const sig = headers().get("stripe-signature");
  if (!sig) return new Response("Missing stripe-signature", { status: 400 });

  const stripe = getStripe();
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "invalid_signature";
    return new Response(`Webhook Error: ${msg}`, { status: 400 });
  }

  // Only handle subscription lifecycle
  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const sub = event.data.object as unknown as SubLike;

    const userId = sub.metadata?.userId;
    const subId = sub.id ?? null;
    const priceId = sub.items?.data?.[0]?.price?.id ?? null;
    const status = sub.status ?? (event.type === "customer.subscription.deleted" ? "canceled" : "inactive");

    // Some Stripe TS builds don't expose current_period_end in types, so we read it safely:
    const periodEndUnix = typeof sub.current_period_end === "number" ? sub.current_period_end : null;
    const periodEnd = periodEndUnix ? new Date(periodEndUnix * 1000) : null;

    if (userId) {
      await prisma.subscription.upsert({
        where: { userId },
        update: {
          stripeSubscriptionId: subId,
          stripePriceId: priceId,
          status,
          currentPeriodEnd: periodEnd,
        },
        create: {
          userId,
          stripeSubscriptionId: subId,
          stripePriceId: priceId,
          status,
          currentPeriodEnd: periodEnd,
        },
      });

      // optional: ensure stripeCustomerId is recorded if you want later
      // (requires you pass customerId in metadata or fetch from Stripe)
    }
  }

  return new Response("OK");
}
