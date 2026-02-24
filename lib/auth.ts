import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: { strategy: "database" },

  callbacks: {
    async session({ session, user }) {
      // Make session.user.id available
      if (session.user) {
        (session.user as any).id = user.id;
      }
      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
});