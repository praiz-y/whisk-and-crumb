"use server";

import { supabase } from "@/lib/supabase/client";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/admin/image-constraints";
import { requireAdmin } from "@/lib/auth/session";

export type UploadFolder = "products" | "categories" | "gallery" | "settings";
export type UploadResult = { ok: true; url: string } | { ok: false; error: string };

export async function uploadImage(folder: UploadFolder, file: File): Promise<UploadResult> {
  const authError = await requireAdmin();
  if (authError) return authError;

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { ok: false, error: "Only JPG, PNG, or WebP images are allowed." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: "Image must be 8MB or smaller." };
  }

  const path = `${folder}/${crypto.randomUUID()}.jpg`;
  const { error: uploadError } = await supabase.storage
    .from("site-images")
    .upload(path, file, { contentType: "image/jpeg", upsert: false });

  if (uploadError) {
    return { ok: false, error: `Upload failed: ${uploadError.message}` };
  }

  const { data } = supabase.storage.from("site-images").getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}
