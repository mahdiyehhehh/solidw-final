import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Routes that require a signed-in session.
const PROTECTED_PREFIXES = ["/dashboard"];
// Auth routes a signed-in user shouldn't see again.
const AUTH_PREFIXES = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const isAuthRoute = AUTH_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!user && isProtectedRoute) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("next", pathname);
    return copyCookies(supabaseResponse, NextResponse.redirect(redirectUrl));
  }

  if (user && isAuthRoute) {
    return copyCookies(
      supabaseResponse,
      NextResponse.redirect(new URL("/dashboard", request.url))
    );
  }

  return supabaseResponse;
}

/**
 * updateSession() may have rotated the Supabase session cookies while
 * checking auth state (e.g. refreshing an expired access token). A
 * NextResponse.redirect() built fresh doesn't carry those cookies over —
 * without copying them, the rotated refresh token is silently dropped,
 * which can break the session on the very next request. Always copy
 * cookies from supabaseResponse onto any redirect response we return.
 */
function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => to.cookies.set(cookie));
  return to;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
