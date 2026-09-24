import { createAdminClient } from "@/lib/supabase/server";

export const INITIAL_ADMIN_EMAIL = (
  process.env.INITIAL_ADMIN_EMAIL || "shawn.shiobara@gmail.com"
).toLowerCase().trim();

export function normalizeEmail(email?: string | null): string {
  if (!email) return "";
  return email.toLowerCase().trim();
}

export function isInitialAdmin(email?: string | null): boolean {
  const normalized = normalizeEmail(email);
  return Boolean(normalized && normalized === INITIAL_ADMIN_EMAIL);
}

export function isProtectedOwner(email?: string | null): boolean {
  return isInitialAdmin(email);
}

export async function verifyAdminUser(email?: string | null): Promise<{
  authorized: boolean;
  role: "owner" | "admin" | null;
  reason?: string;
}> {
  const normalized = normalizeEmail(email);

  if (!normalized) {
    return {
      authorized: false,
      role: null,
      reason: "No email address found in session",
    };
  }

  // Initial admin is always authorized as owner
  if (isInitialAdmin(normalized)) {
    return {
      authorized: true,
      role: "owner",
    };
  }

  try {
    const supabase = createAdminClient();
    const { data: adminRecord, error } = await (supabase.from("admin_users") as any)
      .select("role")
      .eq("email", normalized)
      .maybeSingle();

    if (error) {
      console.error("Error querying admin_users table:", error.message);
      return {
        authorized: false,
        role: null,
        reason: "Database error verifying admin privileges",
      };
    }

    if (!adminRecord) {
      return {
        authorized: false,
        role: null,
        reason: "Your Google account is not on the authorized admin list",
      };
    }

    const role = (adminRecord as { role: "owner" | "admin" }).role || "admin";
    return {
      authorized: true,
      role,
    };
  } catch (err) {
    console.error("Exception during admin verification:", err);
    return {
      authorized: false,
      role: null,
      reason: "Unexpected error verifying admin privileges",
    };
  }
}
