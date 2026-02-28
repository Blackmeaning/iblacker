-- Add monthlyCredits if it doesn't exist (safe for already-patched DBs)
ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "monthlyCredits" INTEGER NOT NULL DEFAULT 0;
