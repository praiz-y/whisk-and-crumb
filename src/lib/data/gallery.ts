import "server-only";
import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/supabase/client";
import type { GalleryImage } from "@/types/content";

async function fetchGalleryImages(): Promise<GalleryImage[]> {
  const { data, error } = await supabase
    .from("gallery_images")
    .select("id, image_url, alt, sort_order")
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to load gallery images: ${error.message}`);
  }

  return data.map((row) => ({
    id: row.id,
    image: row.image_url,
    alt: row.alt,
    sortOrder: row.sort_order,
  }));
}

export const getGalleryImages = unstable_cache(fetchGalleryImages, ["gallery-images"], {
  tags: ["gallery"],
  revalidate: 60,
});
