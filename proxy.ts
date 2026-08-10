import { NextRequest, NextResponse } from "next/server";

/**
 * Auth gate:
 *   - Unauthenticated → redirect to /login
 *   - All authenticated users can access every page
 */

// Pages that are always public (no auth required)
const PUBLIC_PREFIXES = ["/", "/login", "/signup", "/api/", "/landing"];

function isPublic(pathname: string): boolean {
  return PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );
}

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Let public pages and Next.js internals through
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // Read session token from cookie
  const token = req.cookies.get("nafam_token")?.value;

  if (!token) {
    // Not authenticated — send to login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Routes Proxy should not run on
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
