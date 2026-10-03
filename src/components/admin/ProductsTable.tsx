"use client";

import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { useMediaQuery } from "@/lib/use-media-query";
import { formatCurrency } from "@/lib/currency";
import { useRowMutation } from "@/lib/admin/use-row-mutation";
import { deleteProduct } from "@/app/admin/(dashboard)/products/actions";
import type { Product } from "@/types/product";
import type { Category } from "@/types/category";

interface ProductsTableProps {
  products: Product[];
  categories: Category[];
  onEdit: (product: Product) => void;
}

export function ProductsTable({ products, categories, onEdit }: ProductsTableProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { isPending, error, confirmAndRun } = useRowMutation();
  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? "—";

  function handleDelete(product: Product) {
    confirmAndRun(`Delete "${product.name}"? This cannot be undone.`, () => deleteProduct(product.id));
  }

  const rows = products.map((product) => (
    <ProductRow
      key={product.id}
      product={product}
      categoryName={categoryName(product.categoryId)}
      isDesktop={isDesktop}
      disabled={isPending}
      onEdit={() => onEdit(product)}
      onDelete={() => handleDelete(product)}
    />
  ));

  return (
    <div className="flex flex-col gap-3">
      {error ? (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      ) : null}
      {isDesktop ? (
        <table className="w-full border-collapse overflow-hidden rounded-xl border border-border bg-white text-sm">
          <thead>
            <tr className="border-b border-border bg-cream-dark/40 text-left text-brown">
              <th className="px-4 py-3 font-medium">Photo</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Featured</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      ) : (
        <div className="flex flex-col gap-3">{rows}</div>
      )}
    </div>
  );
}

interface ProductRowProps {
  product: Product;
  categoryName: string;
  isDesktop: boolean;
  disabled: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

function ProductRow({ product, categoryName, isDesktop, disabled, onEdit, onDelete }: ProductRowProps) {
  const actions = (
    <div className="flex items-center gap-2">
      <button type="button" aria-label={`Edit ${product.name}`} onClick={onEdit} className="rounded-lg p-2 text-brown hover:bg-cream-dark">
        <Pencil aria-hidden="true" className="size-4" />
      </button>
      <button
        type="button"
        aria-label={`Delete ${product.name}`}
        disabled={disabled}
        onClick={onDelete}
        className="rounded-lg p-2 text-error hover:bg-error/10 disabled:opacity-50"
      >
        <Trash2 aria-hidden="true" className="size-4" />
      </button>
    </div>
  );

  if (isDesktop) {
    return (
      <tr className="border-b border-border last:border-0">
        <td className="px-4 py-3">
          <div className="relative h-12 w-10 overflow-hidden rounded-lg border border-border">
            <Image src={product.image} alt="" fill sizes="40px" unoptimized className="object-cover" />
          </div>
        </td>
        <td className="px-4 py-3 text-dark-text">{product.name}</td>
        <td className="px-4 py-3 text-brown">{categoryName}</td>
        <td className="px-4 py-3 text-brown">{formatCurrency(product.price)}</td>
        <td className="px-4 py-3 text-brown">{product.featured ? "Yes" : "—"}</td>
        <td className="px-4 py-3">{actions}</td>
      </tr>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-white p-3">
      <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg border border-border">
        <Image src={product.image} alt="" fill sizes="44px" unoptimized className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col">
        <span className="text-sm font-medium text-dark-text">{product.name}</span>
        <span className="text-xs text-brown">
          {categoryName} · {formatCurrency(product.price)}
          {product.featured ? " · Featured" : ""}
        </span>
      </div>
      {actions}
    </div>
  );
}
