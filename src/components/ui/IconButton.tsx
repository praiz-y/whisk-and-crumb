import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "@/lib/utils";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  "aria-label": string;
  ref?: Ref<HTMLButtonElement>;
}

export function IconButton({ children, className, ref, ...props }: IconButtonProps) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-full text-brown transition-colors duration-200 ease-out",
        "hover:bg-cream-dark",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
