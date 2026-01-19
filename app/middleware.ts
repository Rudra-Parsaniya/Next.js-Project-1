import { NextRequest, NextResponse } from "next/server";
import { SESSION_NAME } from "@/lib/auth";

const PUBLIC_PATHS = ["/login", "/register", "/"]; // pages NOT requiring login
const PROTECTED_PATHS = ["/dashboard", "/projects", "/tasks"]; // pages requiring login
const ADMIN_PATHS = ["/admin"];// pages requiring admin role 

export function middleware(req: NextRequest) {
  const token = req.cookies.get(SESSION_NAME)?.value;
  const { pathname } = req.nextUrl;

  const isPublic = PUBLIC_PATHS.some((p) => pathname === p);
  const isProtected = PROTECTED_PATHS.some((p) =>
    pathname.startsWith(p)
  );
  const isAdminRoute = ADMIN_PATHS.some((p) => pathname.startsWith(p));

  // 🚫 Not logged in & trying to access protected → redirect
  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔄 Logged in & trying to go to login/register → redirect to dashboard
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 🚫 Admin route attempted → Only allow "session_token" presence for now
  // (Admin validation will be inside page using isAdmin())
  if (!token && isAdminRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }


  // 🟢 Otherwise allowed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/tasks/:path*",
    "/login",
    "/register",
  ],
};
