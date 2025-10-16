// app/api/users/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

// ==================== GET SINGLE USER ====================
export async function GET(request, { params }) {
  try {
    await connectDB();

    const user = await User.findById(params.id)
      .select("-password")
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    if (!user) {
      return NextResponse.json(
        { message: "المستخدم غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "فشل في تحميل بيانات المستخدم", error: error.message },
      { status: 500 }
    );
  }
}

// ==================== UPDATE USER ====================
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const body = await request.json();
    const { name, email, password, role, department, phone, position, bio, status, permissions } = body;

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { message: "المستخدم غير موجود" },
        { status: 404 }
      );
    }

    // Check if email is being changed and if it's already taken
    if (email && email.toLowerCase() !== user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return NextResponse.json(
          { message: "البريد الإلكتروني مستخدم بالفعل" },
          { status: 400 }
        );
      }
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (password) user.password = password; // Will be hashed by middleware
    if (role) user.role = role;
    if (department) user.department = department;
    if (phone !== undefined) user.phone = phone;
    if (position !== undefined) user.position = position;
    if (bio !== undefined) user.bio = bio;
    if (status) user.status = status;
    if (permissions) user.permissions = permissions;

    // user.updatedBy = currentUser._id; // TODO: Get from session

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(user._id).select("-password");

    return NextResponse.json({
      message: "تم تحديث المستخدم بنجاح",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "البريد الإلكتروني مستخدم بالفعل" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: "فشل في تحديث المستخدم", error: error.message },
      { status: 500 }
    );
  }
}

// ==================== DELETE USER ====================
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;

    
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { message: "المستخدم غير موجود" },
        { status: 404 }
      );
    }

    // Prevent deleting super admin
    if (user.role === "super_admin") {
      return NextResponse.json(
        { message: "لا يمكن حذف المدير العام" },
        { status: 403 }
      );
    }

    await User.findByIdAndDelete(params.id);

    return NextResponse.json({
      message: "تم حذف المستخدم بنجاح",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "فشل في حذف المستخدم", error: error.message },
      { status: 500 }
    );
  }
}