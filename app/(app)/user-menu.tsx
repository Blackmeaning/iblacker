"use client";

export default function UserMenu({ email }: { email: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2">
      <div className="text-xs text-white/50">Signed in</div>
      <div className="truncate text-sm text-white">{email || "unknown"}</div>
    </div>
  );
}
