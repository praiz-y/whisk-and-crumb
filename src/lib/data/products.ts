import "server-only";
import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/supabase/client";
import type { Product } from "@/types/product";

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  image_url: string;
  featured: boolean;
  categories: { slug: string } | null;
}

async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("id, slug, name, description, price, category_id, image_url, featured, categories(slug)")
    .order("created_at", { ascending: true })
    .returns<ProductRow[]>();

  if (error) {
    throw new Error(`Failed to load products: ${error.message}`);
  }

  return data.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: row.price,
    category: row.categories?.slug ?? "",
    categoryId: row.category_id,
    image: row.image_url,
    featured: row.featured,
  }));
}

export const getProducts = unstable_cache(fetchProducts, ["products"], {
  tags: ["products"],
  revalidate: 60,
});
