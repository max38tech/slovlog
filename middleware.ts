import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let public routes, API callbacks, robots/sitemap, and static assets pass through
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/brand") ||
    pathname.startsWith("/fonts") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.startsWith("/.well-known")
  ) {
    return NextResponse.next();
  }

  try {
    // Handle /admin route protection
    if (pathname.startsWith("/admin")) {
      const { supabaseResponse, user } = await updateSession(request);

      // If attempting to access /admin/login while already logged in, redirect to /admin
      if (pathname === "/admin/login") {
        if (user) {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
        return supabaseResponse;
      }

      // For any other /admin routes, require an authenticated session
      if (!user) {
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(loginUrl);
      }

      return supabaseResponse;
    }

    // Public blog routes pass through with refreshed sessions if present
    const { supabaseResponse } = await updateSession(request);
    return supabaseResponse;
  } catch (error) {
    console.error("Middleware caught unhandled error safely:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|otf|woff2)$).*)",
  ],
};
