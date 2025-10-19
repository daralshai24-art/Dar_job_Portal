// src/hooks/useAuth.js
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

/**
 * Custom Auth Hook
 * Provides authentication state and methods
 */
export const useAuth = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const user = session?.user;
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  /**
   * Login method
   */
  const login = async (credentials) => {
    try {
      const result = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
        return { success: false, error: result.error };
      }

      if (result?.ok) {
        toast.success("تم تسجيل الدخول بنجاح");
        router.push("/admin");
        router.refresh();
        return { success: true };
      }

      return { success: false, error: "فشل تسجيل الدخول" };
    } catch (error) {
      console.error("Login error:", error);
      toast.error("حدث خطأ أثناء تسجيل الدخول");
      return { success: false, error: error.message };
    }
  };

  /**
   * Logout method
   */
  const logout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("تم تسجيل الخروج بنجاح");
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("حدث خطأ أثناء تسجيل الخروج");
    }
  };

  /**
   * Update session (useful after profile updates)
   */
  const refreshSession = async () => {
    await update();
  };

  /**
   * Check if user has permission
   */
  const hasPermission = (module, action) => {
    if (!user) return false;
    if (user.role === "super_admin") return true;
    return user.permissions?.[module]?.[action] === true;
  };

  /**
   * Check if user has any of the specified roles
   */
  const hasRole = (...roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  /**
   * Check if user can manage another user
   */
  const canManageUser = (targetUserRole) => {
    if (!user) return false;
    if (user.role === "super_admin") return true;
    if (user.role === "admin" && targetUserRole !== "super_admin") return true;
    return false;
  };

  return {
    // State
    user,
    session,
    isAuthenticated,
    isLoading,
    status,

    // Methods
    login,
    logout,
    refreshSession,

    // Permission checks
    hasPermission,
    hasRole,
    canManageUser,
  };
};