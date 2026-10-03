import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  heading: ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  heading,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow ? (
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-brown">{eyebrow}</p>
      ) : null}
      <h2 className="font-display text-2xl font-medium text-dark-text sm:text-[32px]">{heading}</h2>
      {description ? (
        <p className={cn("text-base text-brown", align === "center" ? "max-w-xl" : "max-w-lg")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
