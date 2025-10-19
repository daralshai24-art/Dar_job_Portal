// middleware.js (in root directory)
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * Middleware for route protection
 * Runs before protected routes are accessed
 */
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Allow access to login page
    if (path === "/login") {
      return NextResponse.next();
    }

    // Check if user is authenticated
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Check if user account is active
    if (token.status !== "active") {
      return NextResponse.redirect(new URL("/login?error=account_inactive", req.url));
    }

    // Role-based access control for specific routes
    const roleRestrictions = {
      "/admin/users": ["super_admin", "admin"],
      "/admin/settings": ["super_admin", "admin", "hr_manager"],
    };

    // Check if current path has role restrictions
    for (const [restrictedPath, allowedRoles] of Object.entries(roleRestrictions)) {
      if (path.startsWith(restrictedPath)) {
        if (!allowedRoles.includes(token.role)) {
          return NextResponse.redirect(new URL("/admin?error=unauthorized", req.url));
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Return true to run the middleware function
        // Return false to redirect to login (handled by NextAuth)
        return true;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

/**
 * Configure which routes to protect
 */
export const config = {
  matcher: [
    "/admin/:path*",
    "/api/users/:path*",
    "/api/jobs/:path*",
    "/api/applications/:path*",
  ],
};