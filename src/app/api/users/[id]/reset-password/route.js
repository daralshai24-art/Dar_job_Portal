// app/api/users/[id]/reset-password/route.js
import { NextResponse } from "next/server";
import {connectDB} from "@/lib/db";
import User from "@/models/User";

// ==================== RESET PASSWORD ====================
export async function POST(request, { params }) {
  try {
    await connectDB();

    const { newPassword } = await request.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" },
        { status: 400 }
      );
    }

    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json(
        { message: "المستخدم غير موجود" },
        { status: 404 }
      );
    }

    // Update password (will be hashed by pre-save middleware)
    user.password = newPassword;
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    return NextResponse.json({
      message: "تم إعادة تعيين كلمة المرور بنجاح",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { message: "فشل في إعادة تعيين كلمة المرور", error: error.message },
      { status: 500 }
    );
  }
}