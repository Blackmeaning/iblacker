import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

function env(name: string): string | undefined {
  const v = process.env[name];
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  // keep DB sessions (fine)
  session: { strategy: "database" },

  // IMPORTANT: do not throw at import-time. Missing env will show in logs instead.
  secret: env("NEXTAUTH_SECRET"),

  providers: [
    GoogleProvider({
      clientId: env("GOOGLE_CLIENT_ID") ?? "",
      clientSecret: env("GOOGLE_CLIENT_SECRET") ?? "",
    }),
  ],

  pages: { signIn: "/login" },

  callbacks: {
    async redirect({ url, baseUrl }) {
      // Always keep www to prevent callbackUrl mismatch loops
      const wwwBase = "https://www.iblacker.com";
      if (url.startsWith("/")) return wwwBase + url;
      if (url.startsWith(wwwBase)) return url;
      if (url.startsWith(baseUrl)) return url.replace(baseUrl, wwwBase);
      return wwwBase;
    },

    async session({ session, user }) {
      // your typed augmentation assumed
      session.user.id = user.id;
      session.user.role = user.role;
      return session;
    },
  },

  // Debug logs in Vercel
  debug: true,
  logger: {
    error(code, metadata) {
      console.error("NEXTAUTH_ERROR", code, metadata);
    },
    warn(code) {
      console.warn("NEXTAUTH_WARN", code);
    },
    debug(code, metadata) {
      console.log("NEXTAUTH_DEBUG", code, metadata);
    },
  },
};
