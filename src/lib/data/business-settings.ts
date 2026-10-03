import "server-only";
import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/supabase/client";
import type { BusinessSettings } from "@/types/business";

async function fetchBusinessSettings(): Promise<BusinessSettings> {
  const { data, error } = await supabase
    .from("business_settings")
    .select(
      "whatsapp_number, phone, email, address, map_image_url, instagram_url, facebook_url, tiktok_url, x_url"
    )
    .eq("id", 1)
    .single();

  if (error || !data) {
    throw new Error(`Failed to load business settings: ${error?.message ?? "no row found"}`);
  }

  return {
    whatsappNumber: data.whatsapp_number,
    phone: data.phone ?? undefined,
    email: data.email ?? undefined,
    address: data.address ?? undefined,
    mapImageUrl: data.map_image_url ?? undefined,
    social: {
      instagram: data.instagram_url ?? undefined,
      facebook: data.facebook_url ?? undefined,
      tiktok: data.tiktok_url ?? undefined,
      x: data.x_url ?? undefined,
    },
  };
}

export const getBusinessSettings = unstable_cache(fetchBusinessSettings, ["business-settings"], {
  tags: ["settings"],
  revalidate: 60,
});
