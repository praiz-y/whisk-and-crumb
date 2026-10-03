"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { Button } from "@/components/ui/Button";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { useDialogA11y } from "@/lib/use-dialog-a11y";
import { useCartStore } from "@/store/cart-store";
import { getCartItemCount } from "@/lib/cart-totals";
import { buildWhatsAppOrderUrl } from "@/lib/whatsapp";
import type { Product } from "@/types/product";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  whatsappNumber: string;
}

export function CartDrawer({ isOpen, onClose, products, whatsappNumber }: CartDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <CartDrawerPanel onClose={onClose} products={products} whatsappNumber={whatsappNumber} />
      ) : null}
    </AnimatePresence>
  );
}

function CartDrawerPanel({
  onClose,
  products,
  whatsappNumber,
}: {
  onClose: () => void;
  products: Product[];
  whatsappNumber: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getSubtotal(products));
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const removeItem = useCartStore((state) => state.removeItem);

  useDialogA11y(onClose, containerRef);

  // Cart items whose product no longer exists in the catalog are treated
  // as absent — the drawer must never display or checkout a phantom item.
  const validItems = items.filter((item) => products.some((p) => p.id === item.productId));
  const itemCount = getCartItemCount(validItems, products);
  const whatsappUrl =
    validItems.length > 0 ? buildWhatsAppOrderUrl(items, products, whatsappNumber) : null;

  return (
    <div className="fixed inset-0 z-50">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-dark-text/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      />

      <motion.div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className="absolute inset-y-0 right-0 flex w-full flex-col bg-cream shadow-[-8px_0_24px_rgba(47,42,38,0.12)] sm:w-[420px]"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-5">
          <div>
            <h2 id="cart-drawer-title" className="font-display text-xl font-medium text-dark-text">
              Your Cart
            </h2>
            {itemCount > 0 ? (
              <p className="text-sm text-brown">
                {itemCount} item{itemCount === 1 ? "" : "s"}
              </p>
            ) : null}
          </div>
          <IconButton aria-label="Close cart" onClick={onClose}>
            <X aria-hidden="true" className="size-5" />
          </IconButton>
        </header>

        {validItems.length === 0 ? (
          <CartEmptyState onClose={onClose} />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6">
              <ul className="flex flex-col divide-y divide-border">
                <AnimatePresence initial={false}>
                  {items.map((item) => {
                    const product = products.find((p) => p.id === item.productId);
                    if (!product) return null;
                    return (
                      <CartItem
                        key={item.productId}
                        product={product}
                        quantity={item.quantity}
                        onIncrease={() => increment(item.productId)}
                        onDecrease={() => decrement(item.productId)}
                        onRemove={() => removeItem(item.productId)}
                      />
                    );
                  })}
                </AnimatePresence>
              </ul>
            </div>
            <div className="shrink-0 border-t border-border bg-cream-dark px-6 py-5">
              <CartSummary subtotal={subtotal} whatsappUrl={whatsappUrl} />
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

function CartEmptyState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <ShoppingBag aria-hidden="true" className="size-10 text-brown/40" />
      <div className="flex flex-col gap-1">
        <p className="font-display text-lg text-dark-text">Your cart is empty.</p>
        <p className="text-sm text-brown">Looks like you haven&rsquo;t picked your treats yet.</p>
      </div>
      <Button href="/products" variant="secondary" onClick={onClose}>
        Browse Products
      </Button>
    </div>
  );
}
