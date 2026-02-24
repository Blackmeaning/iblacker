// /lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const hasGoogleCreds =
  !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;

/**
 * NextAuth v4 options.
 * NOTE: In prod, you MUST set:
 * - AUTH_SECRET
 * - GOOGLE_CLIENT_ID
 * - GOOGLE_CLIENT_SECRET
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: hasGoogleCreds
    ? [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
      ]
    : [],

  secret: process.env.AUTH_SECRET,

  session: { strategy: "database" },

  callbacks: {
    async session({ session, user }) {
      // attach user.id to session for server routes
      if (session.user) {
        (session.user as any).id = user.id;
      }
      return session;
    },
  },
};