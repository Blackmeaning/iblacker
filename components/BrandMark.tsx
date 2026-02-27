import Image from "next/image";

type BrandMarkProps = {
  size?: "sm" | "md";
  subtitle?: boolean;
  className?: string;
};

export function BrandMark({
  size = "md",
  subtitle = true,
  className,
}: BrandMarkProps) {
  const box = size === "sm" ? "h-10 w-10 rounded-xl" : "h-11 w-11 rounded-xl";
  const img = size === "sm" ? 26 : 28;
  const title = size === "sm" ? "text-lg" : "text-xl";

  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <div
        className={`${box} bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0`}
      >
        <Image
          src="/brand/logo.png"
          alt="IBlacker"
          width={img}
          height={img}
          priority
          className="object-contain"
        />
      </div>

      <div className="leading-tight">
        <div className={`${title} font-semibold leading-tight`}>IBlacker</div>
        {subtitle ? (
          <div className="text-xs text-white/60">Master AI Platform</div>
        ) : null}
      </div>
    </div>
  );
}
