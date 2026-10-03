import "server-only";
import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/supabase/client";
import type { Category } from "@/types/category";

async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, slug, name, image_url, sort_order")
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to load categories: ${error.message}`);
  }

  return data.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    image: row.image_url,
    sortOrder: row.sort_order,
  }));
}

export const getCategories = unstable_cache(fetchCategories, ["categories"], {
  tags: ["categories"],
  revalidate: 60,
});
