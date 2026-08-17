import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/dashboard/preview/")) return NextResponse.next();
  const hasSession = request.cookies.has("bf_access") || request.cookies.has("bf_refresh");
  if (!hasSession) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/customer/dashboard/:path*", "/builder/dashboard/:path*", "/admin/dashboard/:path*"] };
