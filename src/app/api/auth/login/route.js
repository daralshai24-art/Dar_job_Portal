// ==================== BONUS: app/api/auth/login/route.js ====================
// Example of how to use the service for login
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; 
import { UserBusinessService } from "@/services/user/userBusinessService";

export async function POST(request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "البريد الإلكتروني وكلمة المرور مطلوبان" },
        { status: 400 }
      );
    }

    // Delegate to business service - handles all login logic
    const user = await UserBusinessService.handleLoginAttempt(email, password);

    // TODO: Create session/JWT token here
    // const token = createToken(user._id);

    return NextResponse.json({
      message: "تم تسجيل الدخول بنجاح",
      user,
      // token
    });
  } catch (error) {
    console.error("Login error:", error);
    
    const status = error.message.includes("مقفل") ? 423 : 401;
    
    return NextResponse.json(
      { error: error.message || "فشل تسجيل الدخول" },
      { status }
    );
  }
}