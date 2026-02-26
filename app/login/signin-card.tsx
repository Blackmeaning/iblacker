"use client";

import { signIn } from "next-auth/react";

export default function SignInCard() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-white/5 border border-white/10 rounded-xl p-8 w-96">
        <h1 className="text-xl font-semibold mb-4">IBlacker</h1>
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full bg-white text-black py-2 rounded-lg"
        >
          Continue with Google
        </button>
      </div>
    </main>
  );
}
