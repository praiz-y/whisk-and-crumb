"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { IconButton } from "@/components/ui/IconButton";
import { formatCurrency } from "@/lib/currency";
import type { Product } from "@/types/product";

interface CartItemProps {
  product: Product;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export function CartItem({ product, quantity, onIncrease, onDecrease, onRemove }: CartItemProps) {
  return (
    <motion.li
      layout
      initial={false}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex gap-4 py-4"
    >
      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-border">
        <Image src={product.image} alt={product.name} fill sizes="64px" className="object-cover" />
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-dark-text">{product.name}</p>
            <p className="text-sm text-brown">{formatCurrency(product.price)}</p>
          </div>
          <IconButton
            aria-label={`Remove ${product.name} from cart`}
            onClick={onRemove}
            className="shrink-0"
          >
            <Trash2 aria-hidden="true" className="size-4" />
          </IconButton>
        </div>

        <div className="flex items-center justify-between gap-2">
          <QuantityStepper quantity={quantity} onIncrease={onIncrease} onDecrease={onDecrease} />
          <p className="text-sm font-semibold text-dark-text">{formatCurrency(product.price * quantity)}</p>
        </div>
      </div>
    </motion.li>
  );
}
