import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-w-[18px] items-center justify-center rounded-full bg-caramel px-1 text-[11px] font-semibold leading-[18px] text-cream",
        className
      )}
    >
      {children}
    </span>
  );
}
