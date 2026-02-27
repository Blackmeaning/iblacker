"use client";

import Image from "next/image";

type BrandMarkProps = {
  size?: "sm" | "md";
  subtitle?: boolean;
};

export function BrandMark({ size = "sm", subtitle = False }: BrandMarkProps) {
  const img = size == "md" ? 44 : 34
  const ring = size == "md" ? "rounded-2xl" : "rounded-xl"
  const text = size == "md" ? "text-lg" : "text-base"

  return (
    <div className="flex items-center gap-3">
      <div
        className={[
          "shrink-0 overflow-hidden border border-white/10 bg-white/[0.06] shadow-[0_0_0_1px_rgba(255,255,255,0.04)]",
          ring,
        ].join(" ")}
        style={{ width: img, height: img }}
      >
        <Image
          src="/brand/logo.png"
          alt="IBlacker"
          width={img}
          height={img}
          className="h-full w-full object-contain p-1"
          priority
        />
      </div>

      <div className="leading-tight">
        <div className={["font-semibold tracking-tight", text].join(" ")}>
          IBlacker
        </div>
        {subtitle ? (
          <div className="text-xs text-white/60">Master AI Platform</div>
        ) : null}
      </div>
    </div>
  );
}
