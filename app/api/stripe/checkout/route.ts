import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/currentUser";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const userId = await requireUserId();

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return NextResponse.json({ error: "user_not_found" }, { status: 404 });
  }

  if (!user.stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { userId },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customer.id },
    });

    user.stripeCustomerId = customer.id;
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: user.stripeCustomerId,
    line_items: [
      {
        price: process.env.STRIPE_PRO_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: process.env.NEXTAUTH_URL + "/billing?success=1",
    cancel_url: process.env.NEXTAUTH_URL + "/billing?canceled=1",
  });

  return NextResponse.json({ url: session.url });
}
