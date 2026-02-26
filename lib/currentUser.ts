import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/requireSession";

/**
 * Returns the current authenticated user's DB id.
 * Throws if the user is not authenticated or not found in the DB.
 */
export async function requireUserId(): Promise<string> {
  const session = await requireSession();

  // If your session callback already attaches user.id, prefer it.
  const sessionUserId = session.user?.id ?? null;
  if (sessionUserId) return sessionUserId;

  // Otherwise fall back to email -> DB lookup.
  const email = session.user?.email ?? null;
  if (!email) throw new Error("unauthorized");

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) throw new Error("unauthorized");
  return user.id;
}