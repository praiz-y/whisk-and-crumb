"use client";

import { useState } from "react";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductsTable } from "@/components/admin/ProductsTable";
import type { Product } from "@/types/product";
import type { Category } from "@/types/category";

interface ProductsManagerProps {
  products: Product[];
  categories: Category[];
}

export function ProductsManager({ products, categories }: ProductsManagerProps) {
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const featuredCount = products.filter((p) => p.featured).length;

  if (editing) {
    return (
      <ProductForm
        product={editing === "new" ? undefined : editing}
        categories={categories}
        featuredCount={featuredCount}
        onDone={() => setEditing(null)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => setEditing("new")}
        className="inline-flex min-h-11 w-fit items-center justify-center rounded-lg bg-caramel px-6 text-[15px] font-medium text-cream"
      >
        Add product
      </button>
      <ProductsTable products={products} categories={categories} onEdit={setEditing} />
    </div>
  );
}
