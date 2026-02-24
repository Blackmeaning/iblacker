// /lib/auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

/**
 * IMPORTANT:
 * Turbopack/Next build evaluates route modules during "collecting page data".
 * If NextAuth isn't initialized (providers missing), `handlers` can become undefined
 * and the build crashes when reading handlers.GET/POST.
 *
 * So: we ALWAYS initialize Google provider with safe fallbacks.
 * Real sign-in will only work when you set proper env vars in Vercel.
 */

const googleClientId = process.env.GOOGLE_CLIENT_ID ?? "DUMMY_GOOGLE_CLIENT_ID";
const googleClientSecret =
  process.env.GOOGLE_CLIENT_SECRET ?? "DUMMY_GOOGLE_CLIENT_SECRET";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
  ],
  session: { strategy: "database" },
  secret: process.env.AUTH_SECRET ?? "DUMMY_AUTH_SECRET",
});

// These exports must exist for route re-export:
export const GET = handlers.GET;
export const POST = handlers.POST;