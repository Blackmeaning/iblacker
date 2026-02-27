"use client";
import Image from "next/image";

import { signIn } from "next-auth/react";
import { BrandMark } from "@/components/BrandMark";

export default function SignInCard() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
  <BrandMark size="sm" />
</h1>
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