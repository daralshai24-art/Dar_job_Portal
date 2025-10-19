// app/api/users/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { withAuth } from "@/lib/apiAuth";
import { UserBusinessService } from "@/services/user/userBusinessService";

/**
 * GET /api/users - Fetch all users
 * Permission: users.view
 */
async function getUsersHandler(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const department = searchParams.get("department");

    // Build query
    const query = {};

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
      .sort({ createdAt: -1 });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "فشل في تحميل المستخدمين" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users - Create new user
 * Permission: users.create
 */
async function createUserHandler(req) {
  try {
    await connectDB();

    const userData = await req.json();

    // Create user using business service
    const user = await UserBusinessService.createUser(userData);

    return NextResponse.json(
      { message: "تم إنشاء المستخدم بنجاح", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: error.message || "فشل في إنشاء المستخدم" },
      { status: 400 }
    );
  }
}

// Export protected routes
export const GET = withAuth(getUsersHandler, {
  permission: { module: "users", action: "view" },
});

export const POST = withAuth(createUserHandler, {
  permission: { module: "users", action: "create" },
});