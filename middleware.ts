// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Routen, die für angemeldete Benutzer nicht zugänglich sind
  const protectedRoutesForAuthenticated = ["/sign-in", "/register"];

  if (token && protectedRoutesForAuthenticated.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Routen, die nur für angemeldete Benutzer zugänglich sind
  const protectedRoutesForUnauthenticated = ["/dashboard", "/profile"];

  if (
    !token &&
    protectedRoutesForUnauthenticated.some((route) =>
      pathname.startsWith(route)
    )
  ) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
