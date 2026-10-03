import "server-only";
import { supabase } from "@/lib/supabase/client";
import type { ActionResult } from "@/types/admin";

// Drag-and-drop can move a row to any position in one operation, not just
// swap it with a neighbor, so every row between the old and new position
// needs its sort_order rewritten to match orderedIds' index. Delegated to
// a Postgres function (see supabase/schema.sql) so the whole rewrite runs
// as one atomic statement instead of a client-side loop of updates.
export async function reorderAllBySortOrder(
  table: "categories" | "gallery_images",
  orderedIds: string[]
): Promise<ActionResult> {
  const rpcName = table === "categories" ? "reorder_categories" : "reorder_gallery_images";
  const { error } = await supabase.rpc(rpcName, { ids: orderedIds });
  if (error) return { ok: false, error: `Failed to reorder ${table}: ${error.message}` };

  return { ok: true };
}

// A new row's sort_order must be "one past the current max", not the row
// count — count only equals that once, before any row is ever deleted.
// After a delete leaves a gap, count-based assignment collides with an
// existing row's sort_order silently (no unique constraint on this
// column), corrupting order for both the public site's display and this
// table's own up/down reorder.
export async function getNextSortOrder(table: "categories" | "gallery_images"): Promise<number> {
  const { data, error } = await supabase
    .from(table)
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`Failed to determine next sort order for ${table}: ${error.message}`);

  return (data?.sort_order ?? -1) + 1;
}
