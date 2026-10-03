"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { useDialogA11y } from "@/lib/use-dialog-a11y";
import { useMediaQuery } from "@/lib/use-media-query";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart?: (product: Product, quantity: number) => void;
}

export function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  return (
    <AnimatePresence>
      {product ? (
        <ProductModalPanel key={product.id} product={product} onClose={onClose} onAddToCart={onAddToCart} />
      ) : null}
    </AnimatePresence>
  );
}

interface ProductModalPanelProps {
  product: Product;
  onClose: () => void;
  onAddToCart?: (product: Product, quantity: number) => void;
}

function ProductModalPanel({ product, onClose, onAddToCart }: ProductModalPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const isMobile = useMediaQuery("(max-width: 639px)");

  useDialogA11y(onClose, containerRef);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(onClose, 1000);
    return () => clearTimeout(timer);
  }, [added, onClose]);

  const handleAddToCart = () => {
    if (added) return;
    onAddToCart?.(product, quantity);
    setAdded(true);
  };

  const panelMotion = isMobile
    ? { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } }
    : { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.96 } };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-dark-text/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />

      <motion.div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        className="relative flex max-h-[90vh] w-full flex-col overflow-y-auto rounded-t-3xl bg-cream sm:max-h-[85vh] sm:max-w-3xl sm:flex-row sm:rounded-2xl"
        {...panelMotion}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-border sm:hidden" aria-hidden="true" />

        <IconButton
          aria-label="Close"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-cream/90 shadow-sm sm:top-4 sm:right-4"
        >
          <X aria-hidden="true" className="size-5" />
        </IconButton>

        <div className="relative h-64 w-full shrink-0 sm:h-auto sm:w-[55%]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 640px) 55vw, 100vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-1 flex-col gap-6 p-6 sm:w-[45%] sm:p-8">
          <div className="flex flex-col gap-2">
            <h2 id="product-modal-title" className="font-display text-2xl font-medium text-dark-text">
              {product.name}
            </h2>
            <p className="text-base text-brown">{product.description}</p>
            <p className="text-lg font-semibold text-dark-text">{formatCurrency(product.price)}</p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-brown">Quantity</span>
            <QuantityStepper
              quantity={quantity}
              onIncrease={() => setQuantity((q) => q + 1)}
              onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
            />
          </div>

          <Button
            type="button"
            variant="primary"
            onClick={handleAddToCart}
            className={cn("mt-auto w-full", added && "bg-success hover:brightness-100")}
          >
            {added ? (
              <span className="inline-flex items-center gap-2">
                <Check aria-hidden="true" className="size-4" />
                Added
              </span>
            ) : (
              "Add to Cart"
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
