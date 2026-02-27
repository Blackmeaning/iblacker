import Stripe from "stripe";

let stripeSingleton: Stripe | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }

  if (!stripeSingleton) {
    // Do NOT pin apiVersion here — your installed Stripe types expect a newer version string.
    stripeSingleton = new Stripe(key);
  }

  return stripeSingleton;
}
