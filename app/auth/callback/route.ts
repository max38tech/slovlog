import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  // Forward to new direct Google callback if parameters present
  const code = requestUrl.searchParams.get("code");
  if (code) {
    const callbackUrl = new URL("/api/auth/google/callback", requestUrl.origin);
    requestUrl.searchParams.forEach((value, key) => {
      callbackUrl.searchParams.set(key, value);
    });
    return NextResponse.redirect(callbackUrl);
  }
  return NextResponse.redirect(new URL("/admin/login", requestUrl.origin));
}
