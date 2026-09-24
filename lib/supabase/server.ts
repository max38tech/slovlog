import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/types/database";
import {
  getSupabaseCredentials,
  getSupabaseAdminCredentials,
  isSupabaseConfigured,
} from "./config";

export { isSupabaseConfigured };

export async function createClient() {
  const cookieStore = await cookies();
  const { url, key } = getSupabaseCredentials();

  return createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Can be ignored if called from a Server Component
        }
      },
    },
  });
}

// Service role client for server-only administrative tasks
export function createAdminClient() {
  const { url, key } = getSupabaseAdminCredentials();

  return createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {},
    },
  });
}
