import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        // 1. Admin/HR Routes protection
        if (path.startsWith("/admin")) {
            // Shared access for various roles
            const allowedRoles = ["super_admin", "admin", "hr_manager", "hr_specialist"];
            const isManager = ["department_manager", "head_of_department", "direct_manager"].includes(token?.role);

            // Department managers have limited admin access (e.g. only settings they participate in)
            // But mainly they use /dashboard. If they try to access /admin/applications directly:
            if (path.startsWith("/admin/applications") && isManager) {
                // We allow access, but specific API/Page logic must filter data.
                // Middleware just checks general role "tier".
                return NextResponse.next();
            }

            if (!allowedRoles.includes(token?.role) && !isManager) {
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
