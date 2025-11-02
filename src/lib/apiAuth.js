  // src/lib/apiAuth.js
  import { getServerSession } from "next-auth";
  import { authOptions } from "@/lib/auth.config";
  import { NextResponse } from "next/server";

  /**
   * Get authenticated user from API route
   * Returns user or throws 401 error
   */
  export async function getAuthUser(req) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }

    return session.user;
  }

  /**
   * Check if user has permission
   */
  export function checkPermission(user, module, action) {
    if (!user) return false;
    if (user.role === "super_admin") return true;
    return user.permissions?.[module]?.[action] === true;
  }

  /**
   * Middleware wrapper for protected API routes
   */
  export function withAuth(handler, options = {}) {
    return async (req, context) => {
      try {
        // Get authenticated user
        const user = await getAuthUser(req);

        // Check if user is active
        if (user.status !== "active") {
          return NextResponse.json(
            { error: "الحساب غير نشط" },
            { status: 403 }
          );
        }

        // Check required permissions
        if (options.permission) {
          const { module, action } = options.permission;
          if (!checkPermission(user, module, action)) {
            return NextResponse.json(
              { error: "غير مصرح لك بهذا الإجراء" },
              { status: 403 }
            );
          }
        }

        // Check required roles
        if (options.roles) {
          if (!options.roles.includes(user.role)) {
            return NextResponse.json(
              { error: "غير مصرح لك بهذا الإجراء" },
              { status: 403 }
            );
          }
        }

        // Attach user to request
        req.user = user;

        // Call the actual handler
        return await handler(req, context);
      } catch (error) {
        if (error.message === "Unauthorized") {
          return NextResponse.json(
            { error: "يجب تسجيل الدخول أولاً" },
            { status: 401 }
          );
        }

        console.error("API Auth Error:", error);
        return NextResponse.json(
          { error: "حدث خطأ في السيرفر" },
          { status: 500 }
        );
      }
    };
  }

  /**
   * Helper to create protected API routes
   */
  export function createProtectedRoute(handlers, options = {}) {
    const wrappedHandlers = {};

    for (const [method, handler] of Object.entries(handlers)) {
      wrappedHandlers[method] = withAuth(handler, options);
    }

    return wrappedHandlers;
  }