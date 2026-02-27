"use client";

import { signIn } from "next-auth/react";
import { BrandMark } from "@/components/BrandMark";

export function SignInCard() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
        <BrandMark size="md" subtitle />

        <div className="mt-6 text-sm text-white/70">
          Sign in to access your workspace, projects, and chat.
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="mt-6 w-full rounded-xl bg-white text-black font-medium px-4 py-3 hover:bg-white/90 transition"
        >
          Continue with Google
        </button>

        <div className="mt-4 text-xs text-white/50">
          By continuing you agree to our terms.
        </div>
      </div>
    </main>
  );
}
