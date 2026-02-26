import { requireSession } from "@/lib/requireSession";

export default async function BillingPage() {
  await requireSession();
  return (
    <div>
      <h1 className="text-2xl font-semibold">Billing</h1>
      <p className="mt-2 text-sm text-white/60">Step 8 will add Stripe subscriptions + limits.</p>
    </div>
  );
}
