"use server";

import { updateTag } from "next/cache";
import { supabase } from "@/lib/supabase/client";
import { generateUniqueSlug } from "@/lib/admin/slug";
import { FEATURED_CAP } from "@/lib/admin/constants";
import { requireAdmin } from "@/lib/auth/session";
import type { ActionResult } from "@/types/admin";

export async function createProduct(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const authError = await requireAdmin();
  if (authError) return authError;

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const featured = formData.get("featured") === "on";
  const price = Number(String(formData.get("price") ?? ""));

  if (!name) return { ok: false, error: "Name is required." };
  if (!description) return { ok: false, error: "Description is required." };
  if (!categoryId) return { ok: false, error: "Category is required." };
  if (!imageUrl) return { ok: false, error: "Photo is required." };
  if (!Number.isFinite(price) || price <= 0) return { ok: false, error: "Price must be a positive number." };

  if (featured) {
    const { count, error: countError } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("featured", true);
    if (countError) return { ok: false, error: `Failed to check featured count: ${countError.message}` };
    if ((count ?? 0) >= FEATURED_CAP) {
      return { ok: false, error: `Cannot feature: the limit is ${FEATURED_CAP} featured products at once.` };
    }
  }

  let slug: string;
  try {
    slug = await generateUniqueSlug("products", name);
  } catch {
    return { ok: false, error: "Failed to generate a unique slug. Please try again." };
  }

  const { error } = await supabase.from("products").insert({
    name,
    slug,
    description,
    price,
    category_id: categoryId,
    image_url: imageUrl,
    featured,
  });

  if (error) return { ok: false, error: `Failed to create product: ${error.message}` };

  updateTag("products");
  return { ok: true };
}

export async function updateProduct(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const authError = await requireAdmin();
  if (authError) return authError;

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const featured = formData.get("featured") === "on";
  const price = Number(String(formData.get("price") ?? ""));

  if (!id) return { ok: false, error: "Missing product id." };
  if (!name) return { ok: false, error: "Name is required." };
  if (!description) return { ok: false, error: "Description is required." };
  if (!categoryId) return { ok: false, error: "Category is required." };
  if (!imageUrl) return { ok: false, error: "Photo is required." };
  if (!Number.isFinite(price) || price <= 0) return { ok: false, error: "Price must be a positive number." };

  if (featured) {
    const { data: current, error: currentError } = await supabase
      .from("products")
      .select("featured")
      .eq("id", id)
      .maybeSingle();
    if (currentError) return { ok: false, error: `Failed to check current product: ${currentError.message}` };
    if (!current) return { ok: false, error: "Product not found." };

    // Only enforce the cap on a genuine false -> true transition. Saving an
    // already-featured product must never be rejected, otherwise any over-cap
    // drift locks the owner out of editing every featured product at once.
    if (!current.featured) {
      const { count, error: countError } = await supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("featured", true)
        .neq("id", id);
      if (countError) return { ok: false, error: `Failed to check featured count: ${countError.message}` };
      if ((count ?? 0) >= FEATURED_CAP) {
        return { ok: false, error: `Cannot feature: the limit is ${FEATURED_CAP} featured products at once.` };
      }
    }
  }

  const { data: updated, error } = await supabase
    .from("products")
    .update({ name, description, price, category_id: categoryId, image_url: imageUrl, featured })
    .eq("id", id)
    .select("id");

  if (error) return { ok: false, error: `Failed to update product: ${error.message}` };
  if (!updated?.length) return { ok: false, error: "Product not found." };

  updateTag("products");
  return { ok: true };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { ok: false, error: `Failed to delete product: ${error.message}` };

  updateTag("products");
  return { ok: true };
}
