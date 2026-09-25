import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    request.nextUrl.origin;
  const response = NextResponse.redirect(new URL("/admin/login", origin));
  response.cookies.delete("slog_session");
  return response;
}

export async function POST(request: NextRequest) {
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    request.nextUrl.origin;
  const response = NextResponse.json({ success: true });
  response.cookies.delete("slog_session");
  return response;
}
