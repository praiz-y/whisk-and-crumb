"use server";

import { updateTag } from "next/cache";
import { supabase } from "@/lib/supabase/client";
import { isValidWhatsAppNumber } from "@/lib/whatsapp";
import { isValidHttpUrl } from "@/lib/admin/validate-url";
import { requireAdmin } from "@/lib/auth/session";
import { getAdminPasswordHash, setAdminPasswordHash } from "@/lib/auth/credentials";
import { hashPassword, verifyPasswordHash } from "@/lib/auth/password";
import type { ActionResult } from "@/types/admin";

function optionalField(formData: FormData, key: string): string | null {
  const value = String(formData.get(key) ?? "").trim();
  return value === "" ? null : value;
}

export async function updateSettings(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const authError = await requireAdmin();
  if (authError) return authError;

  const whatsappNumber = String(formData.get("whatsappNumber") ?? "").trim();
  if (!isValidWhatsAppNumber(whatsappNumber)) {
    return { ok: false, error: "WhatsApp number must be 7-15 digits, no spaces or symbols." };
  }

  const phone = optionalField(formData, "phone");
  if (phone !== null && !isValidWhatsAppNumber(phone)) {
    return { ok: false, error: "Phone number must be 7-15 digits, no spaces or symbols." };
  }

  const email = optionalField(formData, "email");
  const address = optionalField(formData, "address");
  const instagramUrl = optionalField(formData, "instagramUrl");
  const facebookUrl = optionalField(formData, "facebookUrl");
  const tiktokUrl = optionalField(formData, "tiktokUrl");
  const xUrl = optionalField(formData, "xUrl");
  const mapImageUrl = optionalField(formData, "mapImageUrl");

  for (const [label, value] of [
    ["Instagram", instagramUrl],
    ["Facebook", facebookUrl],
    ["TikTok", tiktokUrl],
    ["X", xUrl],
  ] as const) {
    if (value && !isValidHttpUrl(value)) {
      return { ok: false, error: `${label} link must be a valid web address (starting with https:// or http://).` };
    }
  }

  const { data: updated, error } = await supabase
    .from("business_settings")
    .update({
      whatsapp_number: whatsappNumber,
      phone,
      email,
      address,
      instagram_url: instagramUrl,
      facebook_url: facebookUrl,
      tiktok_url: tiktokUrl,
      x_url: xUrl,
      map_image_url: mapImageUrl,
    })
    .eq("id", 1)
    .select("id");

  if (error) return { ok: false, error: `Failed to save settings: ${error.message}` };
  if (!updated?.length) return { ok: false, error: "Settings row not found." };

  updateTag("settings");
  return { ok: true };
}

export async function changePassword(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const authError = await requireAdmin();
  if (authError) return authError;

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  let storedHash: string;
  try {
    storedHash = await getAdminPasswordHash();
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to load current password." };
  }

  if (!verifyPasswordHash(currentPassword, storedHash)) {
    return { ok: false, error: "Current password is incorrect." };
  }
  if (newPassword.length < 8) {
    return { ok: false, error: "New password must be at least 8 characters." };
  }
  if (newPassword !== confirmPassword) {
    return { ok: false, error: "New passwords do not match." };
  }

  try {
    await setAdminPasswordHash(hashPassword(newPassword));
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to save new password." };
  }

  return { ok: true };
}
