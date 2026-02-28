"use client";

import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  right?: ReactNode;
  children?: ReactNode;
};

export function SettingsCard({ title, description, right, children }: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-base font-semibold text-white">{title}</div>
          {description ? (
            <div className="mt-1 text-sm text-white/60">{description}</div>
          ) : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>

      {children ? <div className="mt-5">{children}</div> : null}
    </div>
  );
}
