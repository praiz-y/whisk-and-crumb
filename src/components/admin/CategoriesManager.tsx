// src/components/admin/CategoriesManager.tsx
"use client";

import { useState } from "react";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { CategoriesTable } from "@/components/admin/CategoriesTable";
import type { Category } from "@/types/category";

interface CategoriesManagerProps {
  categories: Category[];
  productCounts: Record<string, number>;
}

export function CategoriesManager({ categories, productCounts }: CategoriesManagerProps) {
  const [editing, setEditing] = useState<Category | "new" | null>(null);

  if (editing) {
    return <CategoryForm category={editing === "new" ? undefined : editing} onDone={() => setEditing(null)} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => setEditing("new")}
        className="inline-flex min-h-11 w-fit items-center justify-center rounded-lg bg-caramel px-6 text-[15px] font-medium text-cream"
      >
        Add category
      </button>
      <CategoriesTable categories={categories} productCounts={productCounts} onEdit={setEditing} />
    </div>
  );
}
