import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database";
import { getSupabaseCredentials, isSupabaseConfigured } from "./config";

export { isSupabaseConfigured };

export function createClient() {
  const { url, key } = getSupabaseCredentials();
  return createBrowserClient<Database>(url, key);
}
