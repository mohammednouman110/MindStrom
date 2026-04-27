import { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/12 bg-white/[0.06] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl dark:border-white/8 dark:bg-white/[0.04]",
        className,
      )}
    >
      {children}
    </div>
  );
}
