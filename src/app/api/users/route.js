// app/api/users/route.js
import { NextResponse } from "next/server";
import {connectDB} from "@/lib/db";
import User from "@/models/User";

// ==================== GET ALL USERS ====================
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const department = searchParams.get("department");

    // Build query
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role && role !== "all") {
      query.role = role;
    }

    if (status && status !== "all") {
      query.status = status;
    }

    if (department && department !== "all") {
      query.department = department;
    }

    // Fetch users (exclude password)
    const users = await User.find(query)
      .select("-password")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "فشل في تحميل المستخدمين", error: error.message },
      { status: 500 }
    );
  }
}

// ==================== CREATE USER ====================
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    
    console.log("Received user data:", body);

    const { name, email, password, role, department, phone, position, bio, status } = body;

    // Validation
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: "الاسم والبريد الإلكتروني وكلمة المرور والدور مطلوبة" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { message: "البريد الإلكتروني مستخدم بالفعل" },
        { status: 400 }
      );
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role,
      department: department || "HR",
      phone,
      position,
      bio,
      status: status || "active",
      isEmailVerified: false,
      // createdBy: currentUser._id, // TODO: Get from session
    });

    // Return user without password
    const userWithoutPassword = await User.findById(user._id).select("-password");

    return NextResponse.json(
      {
        message: "تم إنشاء المستخدم بنجاح",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "البريد الإلكتروني مستخدم بالفعل" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "فشل في إنشاء المستخدم", error: error.message },
      { status: 500 }
    );
  }
}