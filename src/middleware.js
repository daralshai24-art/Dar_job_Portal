import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        // 1. Admin/HR Routes protection
        if (path.startsWith("/admin")) {
            const allowedRoles = ["super_admin", "admin", "hr_manager", "hr_specialist"];

            // Strictly forbid department managers from admin panel
            // They should use /dashboard
            if (!allowedRoles.includes(token?.role)) {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/admin/:path*", "/dashboard/:path*"],
};
