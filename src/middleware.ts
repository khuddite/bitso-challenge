import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import ROUTES from "./constants/routes";

// Specify protected and public routes
const protectedRoutes = [ROUTES.DASHBOARD];
const publicRoutes = [ROUTES.LOGIN];

export async function middleware(req: NextRequest) {
  // Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path as ROUTES);
  const isPublicRoute = publicRoutes.includes(path as ROUTES);

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token?.sub;

  // Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, req.nextUrl));
  }

  // Redirect to /dashboard if the user is authenticated
  if (
    isPublicRoute &&
    isAuthenticated &&
    !req.nextUrl.pathname.startsWith(ROUTES.DASHBOARD)
  ) {
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD, req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
