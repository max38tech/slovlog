import { NextRequest, NextResponse } from "next/server";
import { verifyAdminUser, isInitialAdmin } from "@/lib/auth";
import { createSessionToken } from "@/lib/auth-token";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    request.nextUrl.origin;

  if (error || !code) {
    console.error("Google OAuth error or missing code:", error);
    return NextResponse.redirect(new URL("/admin/login?error=auth_failed", origin));
  }

  // Validate state
  const stateCookie = request.cookies.get("slog_oauth_state")?.value;
  if (!stateCookie || stateCookie !== state) {
    console.error("Google OAuth state mismatch or expired");
    return NextResponse.redirect(new URL("/admin/login?error=state_mismatch", origin));
  }

  let next = "/admin";
  try {
    const parsedState = JSON.parse(
      Buffer.from(state, "base64url").toString("utf-8")
    );
    if (parsedState.next && typeof parsedState.next === "string") {
      next = parsedState.next;
    }
  } catch {
    // Fallback to /admin if parsing fails
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
    return NextResponse.redirect(
      new URL("/admin/login?error=missing_credentials", origin)
    );
  }

  const redirectUri = `${origin}/api/auth/google/callback`;

  try {
    // 1. Exchange code for Google tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const errBody = await tokenRes.text();
      console.error("Failed to exchange Google OAuth code:", errBody);
      return NextResponse.redirect(
        new URL("/admin/login?error=auth_failed", origin)
      );
    }

    const tokens = await tokenRes.json();
    const accessToken = tokens.access_token;

    // 2. Fetch user profile from Google
    const userinfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userinfoRes.ok) {
      console.error("Failed to fetch Google userinfo");
      return NextResponse.redirect(
        new URL("/admin/login?error=auth_failed", origin)
      );
    }

    const profile = await userinfoRes.json();
    const email = profile.email?.toLowerCase().trim();

    if (!email) {
      console.error("No email returned from Google userinfo");
      return NextResponse.redirect(
        new URL("/admin/login?error=no_email", origin)
      );
    }

    // 3. Verify user authorization against slog_admin_users & owner check
    const adminCheck = await verifyAdminUser(email);

    if (!adminCheck.authorized) {
      const response = NextResponse.redirect(
        new URL(
          `/admin/login?error=unauthorized&email=${encodeURIComponent(email)}`,
          origin
        )
      );
      response.cookies.delete("slog_oauth_state");
      return response;
    }

    // 4. Ensure owner record is seeded in slog_admin_users if first login
    if (isInitialAdmin(email)) {
      try {
        const supabase = createAdminClient();
        await (supabase.from("slog_admin_users") as any).upsert(
          {
            email,
            role: "owner",
          },
          { onConflict: "email" }
        );
      } catch (dbErr) {
        console.error("Failed to upsert owner record:", dbErr);
      }
    }

    // 5. Issue session JWT
    const sessionToken = await createSessionToken({
      email,
      name: profile.name,
      avatar: profile.picture,
      role: adminCheck.role || "admin",
    });

    // 6. Set secure session cookie and redirect to requested admin destination
    const targetUrl = new URL(next.startsWith("/") ? next : "/admin", origin);
    const response = NextResponse.redirect(targetUrl);

    response.cookies.set("slog_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    response.cookies.delete("slog_oauth_state");
    return response;
  } catch (err) {
    console.error("Unhandled Google OAuth callback error:", err);
    return NextResponse.redirect(new URL("/admin/login?error=auth_failed", origin));
  }
}
