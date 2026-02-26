import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireUserId(): Promise<string> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (typeof userId !== "string" || userId.length === 0) {
    throw new Error("unauthorized");
  }

  return userId;
}
