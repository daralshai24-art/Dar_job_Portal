// app/api/users/[id]/reset-password/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { withAuth } from "@/lib/apiAuth";
import { UserBusinessService } from "@/services/user/userBusinessService";

/**
 * POST /api/users/[id]/reset-password
 * Reset user password (admin only)
 */
async function resetPasswordHandler(req, { params }) {
  try {
    await connectDB();

    const { newPassword } = await req.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" },
        { status: 400 }
      );
    }

  
    const userId = params?.id;
    if (!userId) {
      return NextResponse.json(
        { error: "معرّف المستخدم غير موجود" },
        { status: 400 }
      );
    }

    await UserBusinessService.resetPassword(userId, newPassword);

    return NextResponse.json({
      message: "تم إعادة تعيين كلمة المرور بنجاح",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: error.message || "فشل في إعادة تعيين كلمة المرور" },
      { status: 400 }
    );
  }
}


// Only admins can reset passwords
export const POST = withAuth(resetPasswordHandler, {
  roles: ["super_admin", "admin"],
});