"use client";

import { useState } from "react";
import { ImageCropUpload } from "@/components/admin/ImageCropUpload";
import { createProduct, updateProduct } from "@/app/admin/(dashboard)/products/actions";
import { FEATURED_CAP } from "@/lib/admin/constants";
import { useActionComplete } from "@/lib/admin/use-action-complete";
import type { Product } from "@/types/product";
import type { Category } from "@/types/category";

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  featuredCount: number;
  onDone: () => void;
}

export function ProductForm({ product, categories, featuredCount, onDone }: ProductFormProps) {
  const isEdit = Boolean(product);
  const { state, formAction, isPending } = useActionComplete(isEdit ? updateProduct : createProduct, onDone);
  const [imageUrl, setImageUrl] = useState<string | undefined>(product?.image);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price != null ? String(product.price) : "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");

  const featuredDisabled = featuredCount >= FEATURED_CAP && !product?.featured;

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-xl border border-border bg-white p-6">
      {isEdit ? <input type="hidden" name="id" value={product!.id} /> : null}
      <input type="hidden" name="imageUrl" value={imageUrl ?? ""} />

      <label className="flex flex-col gap-1.5 text-sm text-brown">
        Name
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="rounded-lg border border-border px-3 py-2.5 text-dark-text outline-none focus-visible:ring-2 focus-visible:ring-caramel"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm text-brown">
        Description
        <textarea
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          className="rounded-lg border border-border px-3 py-2.5 text-dark-text outline-none focus-visible:ring-2 focus-visible:ring-caramel"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm text-brown">
        Price (₦)
        <input
          type="number"
          name="price"
          min={1}
          step={1}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="rounded-lg border border-border px-3 py-2.5 text-dark-text outline-none focus-visible:ring-2 focus-visible:ring-caramel"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm text-brown">
        Category
        <select
          name="categoryId"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          className="rounded-lg border border-border px-3 py-2.5 text-dark-text outline-none focus-visible:ring-2 focus-visible:ring-caramel"
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm text-brown">Photo</span>
        <ImageCropUpload aspectRatio={4 / 5} folder="products" existingImageUrl={product?.image} onUploaded={setImageUrl} />
      </div>

      <label className="flex items-center gap-2 text-sm text-dark-text">
        <input
          type="checkbox"
          name="featured"
          checked={featured}
          disabled={featuredDisabled}
          onChange={(event) => setFeatured(event.target.checked)}
          className="size-4 rounded border-border"
        />
        Featured
      </label>
      {featuredDisabled ? (
        <p className="text-xs text-brown">Limit reached: {FEATURED_CAP} products are already featured.</p>
      ) : null}

      {!state.ok ? (
        <p role="alert" className="text-sm text-error">
          {state.error}
        </p>
      ) : null}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-caramel px-6 text-[15px] font-medium text-cream disabled:opacity-50"
        >
          {isPending ? "Saving…" : isEdit ? "Save changes" : "Add product"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-brown px-6 text-[15px] font-medium text-brown"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
