"use client";

import { useState, type ReactNode } from "react";
import type { Product } from "@/types/product";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductModal } from "@/components/products/ProductModal";
import { useCartStore } from "@/store/cart-store";

interface ProductBrowserProps {
  products: Product[];
  emptyState?: ReactNode;
}

/**
 * Owns which product is selected (for the modal) so ProductGrid/ProductCard
 * stay simple, stateless, reusable components. Used by both the Products
 * page and the homepage's Featured Products section.
 */
export function ProductBrowser({ products, emptyState }: ProductBrowserProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (product: Product, quantity: number) => {
    addItem(product.id, quantity);
  };

  if (products.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <>
      <ProductGrid products={products} onSelectProduct={setSelectedProduct} onAddToCart={handleAddToCart} />
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />
    </>
  );
}
