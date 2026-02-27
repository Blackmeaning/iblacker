import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("stripe-signature");

  if (!sig) {
    return new Response("Missing signature", { status: 400 });
  }

  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const customerId = session.customer as string;

    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: customerId },
    });

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          plan: "PRO",
          creditsBalance: 1000,
          monthlyCredits: 1000,
        },
      });
    }
  }

  return new Response("OK");
}
