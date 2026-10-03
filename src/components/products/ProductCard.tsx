"use client";

import Image from "next/image";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/lib/currency";
import { AddToCartButton } from "@/components/products/AddToCartButton";

interface ProductCardProps {
  product: Product;
  onSelectProduct?: (product: Product) => void;
  onAddToCart?: (product: Product, quantity: number) => void;
}

export function ProductCard({ product, onSelectProduct, onAddToCart }: ProductCardProps) {
  return (
    <div className="group flex flex-col gap-3">
      <div className="relative aspect-4/5 overflow-hidden rounded-xl border border-border">
        <button
          type="button"
          onClick={() => onSelectProduct?.(product)}
          aria-label={`View ${product.name}`}
          className="absolute inset-0 block size-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </button>
        <AddToCartButton
          product={product}
          onAddToCart={onAddToCart}
          className="absolute right-3 bottom-3 bg-cream opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 max-md:opacity-100"
        />
      </div>
      <button
        type="button"
        onClick={() => onSelectProduct?.(product)}
        className="flex flex-col gap-1 text-left focus-visible:outline-none"
      >
        <h3 className="text-base font-medium text-dark-text">{product.name}</h3>
        <p className="text-sm text-brown">{product.description}</p>
        <p className="text-base font-semibold text-dark-text">{formatCurrency(product.price)}</p>
      </button>
    </div>
  );
}
