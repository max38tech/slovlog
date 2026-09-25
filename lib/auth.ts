import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { verifySessionToken, type SessionPayload } from "@/lib/auth-token";

export { type SessionPayload };

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
    const { data: adminRecord, error } = await (supabase.from("slog_admin_users") as any)
      .select("role")
      .eq("email", normalized)
      .maybeSingle();

    if (error) {
      console.error("Error querying slog_admin_users table:", error.message);
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

export async function getSessionUser(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("slog_session");
    if (!sessionCookie || !sessionCookie.value) {
      return null;
    }

    const payload = await verifySessionToken(sessionCookie.value);
    if (!payload || !payload.email) {
      return null;
    }

    // Re-verify authorization in database
    const check = await verifyAdminUser(payload.email);
    if (!check.authorized) {
      return null;
    }

    return {
      ...payload,
      role: check.role || "admin",
    };
  } catch {
    return null;
  }
}
