import Image from "next/image";

type BrandMarkProps = {
  size?: "sm" | "md";
  subtitle?: boolean;
  className?: string;
};

export function BrandMark({ size = "sm", subtitle = false, className }: BrandMarkProps) {
  const img = size === "md" ? 44 : 34;
  const ring = size === "md" ? "rounded-2xl" : "rounded-xl";
  const title = size === "md" ? "text-lg" : "text-base";
  const sub = size === "md" ? "text-sm" : "text-xs";

  return (
    <div className={["flex items-center gap-3", className ?? ""].join(" ")}>
      <div
        className={[
          "shrink-0 overflow-hidden border border-white/10 bg-white/[0.03] shadow-sm",
          ring,
        ].join(" ")}
        style={{ width: img, height: img }}
      >
        <Image
          src="/brand/logo.png"
          alt="IBlacker"
          width={img}
          height={img}
          className="h-full w-full object-cover"
          priority
        />
      </div>

      <div className="leading-tight">
        <div className={["font-semibold tracking-tight", title].join(" ")}>IBlacker</div>
        {subtitle ? <div className={["text-white/60", sub].join(" ")}>Master AI Platform</div> : null}
      </div>
    </div>
  );
}
