import { supabaseClient } from "@/lib/supabaseClient";

export async function getCurrentUser() {
  const { data } = await supabaseClient.auth.getUser();
  return data.user;
}