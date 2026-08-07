import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { normalizeRole } from "./lib/roles";

/**
 * Server-side route guard middleware.
 * - Reads `nafam_role` cookie, normalizes it, and blocks Viewer access to /reports.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only enforce for reports route (and subpaths)
  if (pathname.startsWith("/reports")) {
    const roleCookie = request.cookies.get("nafam_role")?.value ?? null;
    const role = normalizeRole(roleCookie);

    if (role === "Viewer") {
      // Redirect viewers to dashboard
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/reports/:path*"],
};
