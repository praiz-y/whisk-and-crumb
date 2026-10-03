import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "text";

const baseClasses =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg text-[15px] font-medium whitespace-nowrap " +
  "transition-[background-color,color,transform,filter] duration-200 ease-out " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel focus-visible:ring-offset-2 focus-visible:ring-offset-cream " +
  "disabled:pointer-events-none disabled:opacity-50";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-caramel px-7 py-3.5 text-cream hover:brightness-95 active:scale-[0.98]",
  secondary:
    "border border-brown bg-transparent px-7 py-3.5 text-brown hover:bg-brown/8 active:scale-[0.98]",
  text: "px-1 text-brown underline-offset-4 hover:underline",
};

interface ButtonOwnProps {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
  href?: string;
  onClick?: () => void;
}

type ButtonProps = ButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps>;

export function Button({ variant = "primary", className, children, href, onClick, ...props }: ButtonProps) {
  const classes = cn(baseClasses, variantClasses[variant], className);

  if (href) {
    const isExternal = /^https?:\/\//.test(href);

    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes} onClick={onClick}>
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} onClick={onClick} {...props}>
      {children}
    </button>
  );
}
