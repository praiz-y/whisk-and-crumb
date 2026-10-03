"use client";

import { Plus } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import type { Product } from "@/types/product";

interface AddToCartButtonProps {
  product: Product;
  onAddToCart?: (product: Product, quantity: number) => void;
  className?: string;
}

/**
 * Client island boundary for cart interactivity. A later phase will pass a
 * real `onAddToCart` handler wired to the Zustand store — until then this is
 * a visually complete, inert placeholder (no fake cart behavior).
 */
export function AddToCartButton({ product, onAddToCart, className }: AddToCartButtonProps) {
  return (
    <IconButton
      aria-label={`Add ${product.name} to cart`}
      className={className}
      onClick={(event) => {
        event.stopPropagation();
        onAddToCart?.(product, 1);
      }}
    >
      <Plus aria-hidden="true" className="size-5" />
    </IconButton>
  );
}
