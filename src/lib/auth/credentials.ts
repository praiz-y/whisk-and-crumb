import "server-only";
import { supabase } from "@/lib/supabase/client";

export async function getAdminPasswordHash(): Promise<string> {
  const { data, error } = await supabase.from("admin_credentials").select("password_hash").eq("id", 1).single();
  if (error || !data) {
    throw new Error(`Failed to load admin credentials: ${error?.message ?? "no row found"}`);
  }
  return data.password_hash;
}

export async function setAdminPasswordHash(hash: string): Promise<void> {
  const { error } = await supabase.from("admin_credentials").update({ password_hash: hash }).eq("id", 1);
  if (error) throw new Error(`Failed to update admin credentials: ${error.message}`);
}
