// src/components/admin/CategoryForm.tsx
"use client";

import { useState } from "react";
import { ImageCropUpload } from "@/components/admin/ImageCropUpload";
import { createCategory, updateCategory } from "@/app/admin/(dashboard)/categories/actions";
import { useActionComplete } from "@/lib/admin/use-action-complete";
import type { Category } from "@/types/category";

interface CategoryFormProps {
  category?: Category;
  onDone: () => void;
}

export function CategoryForm({ category, onDone }: CategoryFormProps) {
  const isEdit = Boolean(category);
  const { state, formAction, isPending } = useActionComplete(isEdit ? updateCategory : createCategory, onDone);
  const [imageUrl, setImageUrl] = useState<string | undefined>(category?.image);
  const [name, setName] = useState(category?.name ?? "");

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-xl border border-border bg-white p-6">
      {isEdit ? <input type="hidden" name="id" value={category!.id} /> : null}
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

      <div className="flex flex-col gap-1.5">
        <span className="text-sm text-brown">Photo</span>
        <ImageCropUpload aspectRatio={1} folder="categories" existingImageUrl={category?.image} onUploaded={setImageUrl} />
      </div>

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
          {isPending ? "Saving…" : isEdit ? "Save changes" : "Add category"}
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
