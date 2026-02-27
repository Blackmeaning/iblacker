"use client";
import Image from "next/image";

import { signIn } from "next-auth/react";

export default function SignInCard() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 w-[380px] shadow-2xl">
        <div className="flex items-center justify-center gap-3">
  <div className="h-11 w-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
    <Image src="/brand/logo.png" alt="IBlacker" width={28} height={28} priority className="object-contain" />
  </div>
  <div className="leading-tight text-left">
    <div className="flex items-center justify-center gap-3">
  <div className="h-11 w-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
    <Image src="/brand/logo.png" alt="IBlacker" width={28} height={28} priority className="object-contain" />
  </div>
  <div className="leading-tight text-left">
    <h1 className="text-xl font-semibold">IBlacker</h1>
    <div className="text-xs text-white/60">Master AI Platform</div>
  </div>
</div>
    <div className="text-xs text-white/60">Master AI Platform</div>
  </div>
</div>
        <p className="mt-2 text-sm text-white/60">Sign in to your AI workspace</p>

        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="mt-8 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-white/90"
        >
          Continue with Google
        </button>
      </div>
    </main>
  );
}
