"use server";

import { updateTag } from "next/cache";
import { supabase } from "@/lib/supabase/client";
import { generateUniqueSlug } from "@/lib/admin/slug";
import { reorderAllBySortOrder, getNextSortOrder } from "@/lib/admin/reorder";
import { requireAdmin } from "@/lib/auth/session";
import type { ActionResult } from "@/types/admin";

export async function createCategory(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const authError = await requireAdmin();
  if (authError) return authError;

  const name = String(formData.get("name") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();

  if (!name) return { ok: false, error: "Name is required." };
  if (!imageUrl) return { ok: false, error: "Photo is required." };

  let sortOrder: number;
  try {
    sortOrder = await getNextSortOrder("categories");
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to determine next sort order." };
  }

  let slug: string;
  try {
    slug = await generateUniqueSlug("categories", name);
  } catch {
    return { ok: false, error: "Failed to generate a unique slug. Please try again." };
  }

  const { error } = await supabase.from("categories").insert({
    name,
    slug,
    image_url: imageUrl,
    sort_order: sortOrder,
  });

  if (error) return { ok: false, error: `Failed to create category: ${error.message}` };

  updateTag("categories");
  return { ok: true };
}

export async function updateCategory(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const authError = await requireAdmin();
  if (authError) return authError;

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();

  if (!id) return { ok: false, error: "Missing category id." };
  if (!name) return { ok: false, error: "Name is required." };
  if (!imageUrl) return { ok: false, error: "Photo is required." };

  const { data: updated, error } = await supabase
    .from("categories")
    .update({ name, image_url: imageUrl })
    .eq("id", id)
    .select("id");

  if (error) return { ok: false, error: `Failed to update category: ${error.message}` };
  if (!updated?.length) return { ok: false, error: "Category not found." };

  updateTag("categories");
  return { ok: true };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { count, error: countError } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);

  if (countError) return { ok: false, error: `Failed to check category usage: ${countError.message}` };

  if (count && count > 0) {
    return {
      ok: false,
      error: `Cannot delete: ${count} product${count === 1 ? "" : "s"} still assigned to this category.`,
    };
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { ok: false, error: `Failed to delete category: ${error.message}` };

  updateTag("categories");
  return { ok: true };
}

export async function reorderCategories(orderedIds: string[]): Promise<ActionResult> {
  const authError = await requireAdmin();
  if (authError) return authError;

  const result = await reorderAllBySortOrder("categories", orderedIds);
  if (result.ok) updateTag("categories");
  return result;
}
