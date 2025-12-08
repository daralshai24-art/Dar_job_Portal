// app/api/users/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { withAuth } from "@/lib/apiAuth";
import { UserBusinessService } from "@/services/user/userBusinessService";

/**
 * GET /api/users/[id] - Fetch single user
 */
async function getUserHandler(req, props) {
  const params = await props.params;
  try {
    await connectDB();

    const user = await User.findById(params.id).select("-password");

    if (!user) {
      return NextResponse.json(
        { error: "المستخدم غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "فشل في تحميل بيانات المستخدم" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/users/[id] - Update user
 */
async function updateUserHandler(req, props) {
  const params = await props.params;
  try {
    await connectDB();

    const updateData = await req.json();
    const currentUser = req.user; // From auth middleware

    // Check if user can manage target user
    const targetUser = await User.findById(params.id);
    if (!targetUser) {
      return NextResponse.json(
        { error: "المستخدم غير موجود" },
        { status: 404 }
      );
    }

    // Super admin can edit everyone, admin can edit everyone except super admin
    if (currentUser.role !== "super_admin") {
      if (targetUser.role === "super_admin") {
        return NextResponse.json(
          { error: "لا يمكنك تعديل حساب المدير العام" },
          { status: 403 }
        );
      }
      if (currentUser.role !== "admin") {
        return NextResponse.json(
          { error: "غير مصرح لك بهذا الإجراء" },
          { status: 403 }
        );
      }
    }

    // Update user using business service
    const user = await UserBusinessService.updateUser(params.id, updateData);

    return NextResponse.json({
      message: "تم تحديث المستخدم بنجاح",
      user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: error.message || "فشل في تحديث المستخدم" },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/users/[id] - Delete user
 */
async function deleteUserHandler(req, props) {
  const params = await props.params;
  try {
    await connectDB();

    const currentUser = req.user;

    // Check if user can manage target user
    const targetUser = await User.findById(params.id);
    if (!targetUser) {
      return NextResponse.json(
        { error: "المستخدم غير موجود" },
        { status: 404 }
      );
    }

    // Only super admin and admin can delete, but cannot delete super admin
    if (targetUser.role === "super_admin") {
      return NextResponse.json(
        { error: "لا يمكن حذف المدير العام" },
        { status: 403 }
      );
    }

    // Cannot delete yourself
    if (params.id === currentUser.id) {
      return NextResponse.json(
        { error: "لا يمكنك حذف حسابك الخاص" },
        { status: 403 }
      );
    }

    await UserBusinessService.deleteUser(params.id);

    return NextResponse.json({ message: "تم حذف المستخدم بنجاح" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: error.message || "فشل في حذف المستخدم" },
      { status: 400 }
    );
  }
}

// Export protected routes
export const GET = withAuth(getUserHandler, {
  permission: { module: "users", action: "view" },
});

export const PUT = withAuth(updateUserHandler, {
  permission: { module: "users", action: "edit" },
});

export const DELETE = withAuth(deleteUserHandler, {
  permission: { module: "users", action: "delete" },
});