"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { ActionResult } from "@/types/admin";

// Shared by CategoriesTable and GalleryManager's drag-and-drop reorder.
// Reflows the dragged list instantly (optimistic), then persists the new
// order; reverts to the server's last-known order if the save fails.
export function useDragReorder<T extends { id: string }>(
  serverItems: T[],
  reorderAction: (orderedIds: string[]) => Promise<ActionResult>
) {
  const [items, setItems] = useState(serverItems);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Sync local (possibly optimistic) state to a genuinely new serverItems
  // prop during render, not in an effect — an effect-based setState here
  // would cause an extra render/flicker every time the server refreshes.
  const [syncedServerItems, setSyncedServerItems] = useState(serverItems);
  if (serverItems !== syncedServerItems) {
    setSyncedServerItems(serverItems);
    setItems(serverItems);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered);
    setError(null);

    startTransition(async () => {
      const result = await reorderAction(reordered.map((item) => item.id));
      if (!result.ok) {
        setError(result.error);
        setItems(serverItems);
      } else {
        router.refresh();
      }
    });
  }

  return { items, handleDragEnd, isPending, error };
}
