-- Add plan + creditsBalance if they don't exist (safe for already-patched DBs)
ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "plan" TEXT NOT NULL DEFAULT 'FREE';

ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "creditsBalance" INTEGER NOT NULL DEFAULT 0;
