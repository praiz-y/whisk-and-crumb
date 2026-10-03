// src/components/admin/CategoriesTable.tsx
"use client";

import Image from "next/image";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { DndContext, PointerSensor, KeyboardSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMediaQuery } from "@/lib/use-media-query";
import { useRowMutation } from "@/lib/admin/use-row-mutation";
import { useDragReorder } from "@/lib/admin/use-drag-reorder";
import { deleteCategory, reorderCategories } from "@/app/admin/(dashboard)/categories/actions";
import type { Category } from "@/types/category";

interface CategoriesTableProps {
  categories: Category[];
  productCounts: Record<string, number>;
  onEdit: (category: Category) => void;
}

export function CategoriesTable({ categories, productCounts, onEdit }: CategoriesTableProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { isPending: isDeleting, error: deleteError, confirmAndRun } = useRowMutation();
  const { items, handleDragEnd, error: reorderError } = useDragReorder(categories, reorderCategories);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDelete(category: Category) {
    confirmAndRun(`Delete "${category.name}"? This cannot be undone.`, () => deleteCategory(category.id));
  }

  const error = deleteError ?? reorderError;

  const rows = items.map((category) => (
    <CategoryRow
      key={category.id}
      category={category}
      productCount={productCounts[category.id] ?? 0}
      isDesktop={isDesktop}
      disabled={isDeleting}
      onEdit={() => onEdit(category)}
      onDelete={() => handleDelete(category)}
    />
  ));

  return (
    <div className="flex flex-col gap-3">
      {error ? (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      ) : null}
      <DndContext id="categories-dnd" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {isDesktop ? (
            <table className="w-full border-collapse overflow-hidden rounded-xl border border-border bg-white text-sm">
              <thead>
                <tr className="border-b border-border bg-cream-dark/40 text-left text-brown">
                  <th className="w-8 px-2 py-3" aria-hidden="true" />
                  <th className="px-4 py-3 font-medium">Photo</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Products</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </table>
          ) : (
            <div className="flex flex-col gap-3">{rows}</div>
          )}
        </SortableContext>
      </DndContext>
    </div>
  );
}

interface CategoryRowProps {
  category: Category;
  productCount: number;
  isDesktop: boolean;
  disabled: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

function CategoryRow({ category, productCount, isDesktop, disabled, onEdit, onDelete }: CategoryRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: category.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  const dragHandle = (
    <button
      type="button"
      aria-label={`Reorder ${category.name}`}
      className="cursor-grab touch-none rounded-lg p-2 text-brown/50 hover:bg-cream-dark hover:text-brown active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <GripVertical aria-hidden="true" className="size-4" />
    </button>
  );

  const actions = (
    <div className="flex items-center gap-2">
      <button type="button" aria-label={`Edit ${category.name}`} onClick={onEdit} className="rounded-lg p-2 text-brown hover:bg-cream-dark">
        <Pencil aria-hidden="true" className="size-4" />
      </button>
      <button type="button" aria-label={`Delete ${category.name}`} disabled={disabled} onClick={onDelete} className="rounded-lg p-2 text-error hover:bg-error/10 disabled:opacity-50">
        <Trash2 aria-hidden="true" className="size-4" />
      </button>
    </div>
  );

  if (isDesktop) {
    return (
      <tr ref={setNodeRef} style={style} className="border-b border-border last:border-0 bg-white">
        <td className="px-2 py-3">{dragHandle}</td>
        <td className="px-4 py-3">
          <div className="relative size-10 overflow-hidden rounded-lg border border-border">
            <Image src={category.image} alt="" fill sizes="40px" unoptimized className="object-cover" />
          </div>
        </td>
        <td className="px-4 py-3 text-dark-text">{category.name}</td>
        <td className="px-4 py-3 text-brown">{productCount}</td>
        <td className="px-4 py-3">{actions}</td>
      </tr>
    );
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 rounded-xl border border-border bg-white p-3">
      {dragHandle}
      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-border">
        <Image src={category.image} alt="" fill sizes="48px" unoptimized className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col">
        <span className="text-sm font-medium text-dark-text">{category.name}</span>
        <span className="text-xs text-brown">
          {productCount} product{productCount === 1 ? "" : "s"}
        </span>
      </div>
      {actions}
    </div>
  );
}
