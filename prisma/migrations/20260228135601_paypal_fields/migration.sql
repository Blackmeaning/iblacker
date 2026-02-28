-- PayPal fields (safe)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "paypalSubscriptionId" VARCHAR(191);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "subscriptionStatus" TEXT NOT NULL DEFAULT 'FREE';
