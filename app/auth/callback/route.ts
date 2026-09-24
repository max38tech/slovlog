import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { Database } from "@/types/database";
import { verifyAdminUser, isInitialAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/admin";

  if (!code) {
    return NextResponse.redirect(new URL("/admin/login?error=missing_code", requestUrl.origin));
  }

  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
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
          // Can be ignored if called from a Route Handler
        }
      },
    },
  });

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    console.error("Auth callback code exchange error:", error?.message);
    return NextResponse.redirect(new URL("/admin/login?error=auth_failed", requestUrl.origin));
  }

  const userEmail = data.user.email;
  const adminCheck = await verifyAdminUser(userEmail);

  if (!adminCheck.authorized) {
    // Revoke session immediately for non-admin accounts
    await supabase.auth.signOut();
    const loginUrl = new URL("/admin/login", requestUrl.origin);
    loginUrl.searchParams.set("error", "unauthorized");
    if (userEmail) {
      loginUrl.searchParams.set("email", userEmail);
    }
    return NextResponse.redirect(loginUrl);
  }

  // If initial admin, make sure they are recorded in admin_users as owner
  if (isInitialAdmin(userEmail) && userEmail) {
    try {
      await (supabase.from("admin_users") as any).upsert(
        { email: userEmail.toLowerCase(), role: "owner" },
        { onConflict: "email" }
      );
    } catch (e) {
      console.warn("Could not upsert owner record:", e);
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
