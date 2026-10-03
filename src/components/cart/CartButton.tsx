"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { Badge } from "@/components/ui/Badge";
import { useCartStore } from "@/store/cart-store";
import type { Product } from "@/types/product";

interface CartButtonProps {
  products: Product[];
  onClick?: () => void;
}

export function CartButton({ products, onClick }: CartButtonProps) {
  const itemCount = useCartStore((state) => state.getItemCount(products));

  // Store uses `skipHydration` so the first client render matches the
  // server (empty cart); this reads the real persisted cart right after
  // mount, once hydration has already been reconciled.
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  return (
    <IconButton aria-label={`Open cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`} onClick={onClick}>
      <span className="relative">
        <ShoppingBag aria-hidden="true" className="size-5" />
        {itemCount > 0 ? (
          <motion.span
            key={itemCount}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute -top-2 -right-2"
          >
            <Badge>{itemCount}</Badge>
          </motion.span>
        ) : null}
      </span>
    </IconButton>
  );
}
