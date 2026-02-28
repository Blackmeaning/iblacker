import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/currentUser";
import { paypalFetch, idempotencyKey } from "@/lib/paypal";

export const runtime = "nodejs";

const PACKS: Record<string, { usd: string; credits: number }> = {
  pack10: { usd: "10.00", credits: 20000 },
  pack25: { usd: "25.00", credits: 60000 },
  pack50: { usd: "50.00", credits: 150000 },
};

export async function POST(req: Request) {
  try {
    const userId = await requireUserId();
    const body = (await req.json().catch(() => ({}))) as { pack?: keyof typeof PACKS };
    const pack = body.pack && PACKS[body.pack] ? body.pack : "pack10";

    const { usd, credits } = PACKS[pack];

    const order = await paypalFetch<{
      id: string;
      links: Array<{ rel: string; href: string }>;
    }>("/v2/checkout/orders", {
      method: "POST",
      headers: {
        "PayPal-Request-Id": idempotencyKey(`${userId}:${pack}:order`),
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            custom_id: userId, // map back in webhook if needed
            description: `iblacker credits: ${credits}`,
            amount: { currency_code: "USD", value: usd },
          },
        ],
        application_context: {
          brand_name: "iblacker",
          user_action: "PAY_NOW",
          return_url: "https://www.iblacker.com/billing?paypal=success",
          cancel_url: "https://www.iblacker.com/billing?paypal=cancel",
        },
      }),
    });

    const approveUrl = order.links.find((l) => l.rel === "approve")?.href;
    if (!approveUrl) return NextResponse.json({ error: "Missing approve link" }, { status: 500 });

    return NextResponse.json({ orderId: order.id, approveUrl, credits });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "create-order failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
