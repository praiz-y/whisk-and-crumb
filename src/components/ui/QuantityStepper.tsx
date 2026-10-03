import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  className?: string;
}

const stepperButtonClasses =
  "flex size-11 shrink-0 items-center justify-center rounded-lg text-brown transition-colors duration-200 " +
  "hover:bg-cream-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel " +
  "disabled:pointer-events-none disabled:opacity-40";

export function QuantityStepper({ quantity, onIncrease, onDecrease, min = 1, className }: QuantityStepperProps) {
  return (
    <div className={cn("inline-flex items-center rounded-lg border border-border", className)}>
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
        className={stepperButtonClasses}
      >
        <Minus aria-hidden="true" className="size-4" />
      </button>
      <span className="w-8 text-center text-base font-medium text-dark-text" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        aria-label="Increase quantity"
        className={stepperButtonClasses}
      >
        <Plus aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}
