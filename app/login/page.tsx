"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-900 border border-gray-800 p-10 rounded-xl text-center">
        <h1 className="text-2xl font-bold mb-6">Sign in to IBlacker</h1>

        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="bg-white text-black px-6 py-3 rounded-lg font-semibold"
        >
          Continue with Google
        </button>
      </div>
    </main>
  );
}