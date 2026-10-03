"use server";

import { updateTag } from "next/cache";
import { supabase } from "@/lib/supabase/client";
import { reorderAllBySortOrder, getNextSortOrder } from "@/lib/admin/reorder";
import { requireAdmin } from "@/lib/auth/session";
import type { ActionResult } from "@/types/admin";

export async function createGalleryImage(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const authError = await requireAdmin();
  if (authError) return authError;

  const alt = String(formData.get("alt") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();

  if (!alt) return { ok: false, error: "Alt text is required." };
  if (!imageUrl) return { ok: false, error: "Photo is required." };

  let sortOrder: number;
  try {
    sortOrder = await getNextSortOrder("gallery_images");
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to determine next sort order." };
  }

  const { error } = await supabase.from("gallery_images").insert({
    alt,
    image_url: imageUrl,
    sort_order: sortOrder,
  });

  if (error) return { ok: false, error: `Failed to add image: ${error.message}` };

  updateTag("gallery");
  return { ok: true };
}

export async function updateGalleryImage(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const authError = await requireAdmin();
  if (authError) return authError;

  const id = String(formData.get("id") ?? "");
  const alt = String(formData.get("alt") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();

  if (!id) return { ok: false, error: "Missing image id." };
  if (!alt) return { ok: false, error: "Alt text is required." };
  if (!imageUrl) return { ok: false, error: "Photo is required." };

  const { data: updated, error } = await supabase
    .from("gallery_images")
    .update({ alt, image_url: imageUrl })
    .eq("id", id)
    .select("id");
  if (error) return { ok: false, error: `Failed to update image: ${error.message}` };
  if (!updated?.length) return { ok: false, error: "Image not found." };

  updateTag("gallery");
  return { ok: true };
}

export async function deleteGalleryImage(id: string): Promise<ActionResult> {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { error } = await supabase.from("gallery_images").delete().eq("id", id);
  if (error) return { ok: false, error: `Failed to delete image: ${error.message}` };

  updateTag("gallery");
  return { ok: true };
}

export async function reorderGalleryImages(orderedIds: string[]): Promise<ActionResult> {
  const authError = await requireAdmin();
  if (authError) return authError;

  const result = await reorderAllBySortOrder("gallery_images", orderedIds);
  if (result.ok) updateTag("gallery");
  return result;
}
