import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Routes publiques (pas d'auth requise)
const PUBLIC_ROUTES = ["/login", "/api/auth"];

// Routes réservées aux ADMIN uniquement
const ADMIN_ONLY_ROUTES = ["/users", "/audit-logs", "/settings", "/backup"];

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const pathname = nextUrl.pathname;

  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  const isAdminRoute = ADMIN_ONLY_ROUTES.some((route) => pathname.startsWith(route));

  // Si non connecté et route protégée → redirect login
  if (!session && !isPublicRoute) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si connecté et sur /login → redirect dashboard
  if (session && pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Vérification du compte actif
  if (session && !(session.user as { isActive?: boolean }).isActive) {
    return NextResponse.redirect(new URL("/login?error=AccountDisabled", req.url));
  }

  // Route ADMIN uniquement
  if (session && isAdminRoute && (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public/uploads (uploaded files)
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|uploads/|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
