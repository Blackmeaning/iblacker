import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";
import { paypalEnv, paypalFetch, idempotencyKey } from "@/lib/paypal";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const userId = await requireUserId();

    const body = (await req.json().catch(() => ({}))) as { tier?: "PRO" | "ELITE" };
    const tier = body.tier === "ELITE" ? "ELITE" : "PRO";
    const planId = tier === "ELITE" ? paypalEnv.elitePlanId : paypalEnv.proPlanId;

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
    const email = user?.email ?? undefined;

    // PayPal subscription create
    const subscription = await paypalFetch<{
      id: string;
      links: Array<{ rel: string; href: string; method?: string }>;
      status: string;
    }>("/v1/billing/subscriptions", {
      method: "POST",
      headers: {
        "PayPal-Request-Id": idempotencyKey(`${userId}:${tier}:sub`),
      },
      body: JSON.stringify({
        plan_id: planId,
        subscriber: email ? { email_address: email } : undefined,
        application_context: {
          brand_name: "iblacker",
          user_action: "SUBSCRIBE_NOW",
          return_url: "https://www.iblacker.com/billing?paypal=success",
          cancel_url: "https://www.iblacker.com/billing?paypal=cancel",
        },
        custom_id: userId, // IMPORTANT: lets us map webhook -> user
      }),
    });

    // Find approval URL
    const approve = subscription.links.find((l) => l.rel === "approve")?.href;
    if (!approve) return NextResponse.json({ error: "Missing approval link" }, { status: 500 });

    // store pending subscription id
    await prisma.user.update({
      where: { id: userId },
      data: {
        plan: tier,
        subscriptionStatus: "PENDING",
        paypalSubscriptionId: subscription.id,
      },
    });

    return NextResponse.json({ approveUrl: approve });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "create-subscription failed" }, { status: 500 });
  }
}
