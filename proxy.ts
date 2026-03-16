import { NextResponse, type NextRequest } from "next/server";

const AUTH_COOKIE_NAME = "auth_token";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/signin", "/signup"];

function isProtectedRoute(pathname: string) {
  return protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function isAuthRoute(pathname: string) {
  return authRoutes.includes(pathname);
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (isProtectedRoute(pathname) && !token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (isAuthRoute(pathname) && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/signup"],
};