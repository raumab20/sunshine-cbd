import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Extract the token using next-auth's getToken utility
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Define routes restricted for authenticated users
  const protectedRoutesForAuthenticated = ["/sign-in", "/register"];

  if (token && protectedRoutesForAuthenticated.includes(pathname)) {
    // Redirect authenticated users away from these routes
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Define routes restricted for unauthenticated users
  const protectedRoutesForUnauthenticated = ["/dashboard", "/profile"];

  if (
    !token &&
    protectedRoutesForUnauthenticated.some((route) =>
      pathname.startsWith(route)
    )
  ) {
    // Redirect unauthenticated users to the sign-in page
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Allow the request to proceed if it doesn't match any conditions
  return NextResponse.next();
}

// Middleware configuration for matching routes
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)", // Exclude API and static file routes
  ],
};
