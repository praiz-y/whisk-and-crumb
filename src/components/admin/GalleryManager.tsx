"use client";

import { useState } from "react";
import Image from "next/image";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { DndContext, PointerSensor, KeyboardSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, rectSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GalleryImageForm } from "@/components/admin/GalleryImageForm";
import { useRowMutation } from "@/lib/admin/use-row-mutation";
import { useDragReorder } from "@/lib/admin/use-drag-reorder";
import { deleteGalleryImage, reorderGalleryImages } from "@/app/admin/(dashboard)/gallery/actions";
import type { GalleryImage } from "@/types/content";

export function GalleryManager({ images }: { images: GalleryImage[] }) {
  const [editing, setEditing] = useState<GalleryImage | "new" | null>(null);
  const { isPending: isDeleting, error: deleteError, confirmAndRun } = useRowMutation();
  const { items, handleDragEnd, error: reorderError } = useDragReorder(images, reorderGalleryImages);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (editing) {
    return <GalleryImageForm image={editing === "new" ? undefined : editing} onDone={() => setEditing(null)} />;
  }

  function handleDelete(image: GalleryImage) {
    confirmAndRun("Delete this image? This cannot be undone.", () => deleteGalleryImage(image.id));
  }

  const error = deleteError ?? reorderError;

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => setEditing("new")}
        className="inline-flex min-h-11 w-fit items-center justify-center rounded-lg bg-caramel px-6 text-[15px] font-medium text-cream"
      >
        Add image
      </button>
      {error ? (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      ) : null}
      <DndContext id="gallery-dnd" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((image) => (
              <GalleryCard
                key={image.id}
                image={image}
                disabled={isDeleting}
                onEdit={() => setEditing(image)}
                onDelete={() => handleDelete(image)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

interface GalleryCardProps {
  image: GalleryImage;
  disabled: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

function GalleryCard({ image, disabled, onEdit, onDelete }: GalleryCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: image.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} className="flex flex-col gap-2 rounded-xl border border-border bg-white p-3">
      <div className="relative aspect-4/5 overflow-hidden rounded-lg border border-border">
        <Image src={image.image} alt={image.alt} fill sizes="200px" unoptimized className="object-cover" />
      </div>
      <p className="truncate text-xs text-brown">{image.alt}</p>
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label={`Reorder ${image.alt}`}
          className="cursor-grab touch-none rounded-lg p-1.5 text-brown/50 hover:bg-cream-dark hover:text-brown active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical aria-hidden="true" className="size-4" />
        </button>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Edit image"
            onClick={onEdit}
            className="rounded-lg p-1.5 text-brown hover:bg-cream-dark"
          >
            <Pencil aria-hidden="true" className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Delete image"
            disabled={disabled}
            onClick={onDelete}
            className="rounded-lg p-1.5 text-error hover:bg-error/10 disabled:opacity-50"
          >
            <Trash2 aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
