import type { Product } from "@/types/product";
import { ProductCard } from "@/components/products/ProductCard";

interface ProductGridProps {
  products: Product[];
  onSelectProduct?: (product: Product) => void;
  onAddToCart?: (product: Product, quantity: number) => void;
}

export function ProductGrid({ products, onSelectProduct, onAddToCart }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onSelectProduct={onSelectProduct}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
