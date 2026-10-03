import "server-only";
import { supabase } from "@/lib/supabase/client";

function slugify(name: string): string {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "item";
}

export async function generateUniqueSlug(table: "categories" | "products", name: string): Promise<string> {
  const base = slugify(name);
  for (let suffix = 1; suffix < 1000; suffix++) {
    const slug = suffix === 1 ? base : `${base}-${suffix}`;
    const { data, error } = await supabase.from(table).select("id").eq("slug", slug).maybeSingle();
    if (error) throw new Error(`Failed to check slug uniqueness: ${error.message}`);
    if (!data) return slug;
  }
  throw new Error("Could not generate a unique slug after 999 attempts.");
}
