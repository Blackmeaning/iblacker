import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

export const runtime = "nodejs";

/**
 * IMPORTANT:
 * - This file exports: auth(), GET, POST
 * - We intentionally DO NOT use PrismaAdapter right now to avoid adapter/type/version mismatches
 *   until your auth stack is fully stable on Vercel.
 * - Session strategy = "jwt" so it works without DB adapter.
 */
export const authConfig: NextAuthConfig = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],

  session: { strategy: "jwt" },

  // This prevents crashing builds if env vars are missing on Vercel
  secret: process.env.AUTH_SECRET,
};

export const { handlers, auth } = NextAuth(authConfig);

// Export GET/POST so App Router route can re-export or import directly
export const GET = handlers.GET;
export const POST = handlers.POST;