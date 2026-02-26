import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  secret: requireEnv("NEXTAUTH_SECRET"),
  providers: [
    GoogleProvider({
      clientId: requireEnv("GOOGLE_CLIENT_ID"),
      clientSecret: requireEnv("GOOGLE_CLIENT_SECRET"),
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // thanks to module augmentation in types/next-auth.d.ts, these fields are typed
      session.user.id = user.id;
      session.user.role = user.role;
      return session;
    },
  },
  pages: { signIn: "/login" },
};
