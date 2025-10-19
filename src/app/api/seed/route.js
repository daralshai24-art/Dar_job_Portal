// app/api/seed/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getRolePermissions } from "@/services/user/permissions";

/**
 * GET /api/seed
 * Creates initial super admin user
 * 
 * IMPORTANT: This endpoint should be disabled in production!
 * Only use it once to create your first admin, then delete this file or add protection.
 */
export async function GET(req) {
  try {
    // ⚠️ SECURITY: Only allow in development or add your own protection
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "This endpoint is disabled in production" },
        { status: 403 }
      );
    }

    await connectDB();

    // Check if any super admin already exists
    const existingSuperAdmin = await User.findOne({ role: "super_admin" });

    if (existingSuperAdmin) {
      return NextResponse.json(
        {
          message: "Super admin already exists!",
          email: existingSuperAdmin.email,
          name: existingSuperAdmin.name,
          note: "You can login with this account or delete it from MongoDB and refresh this page to create a new one.",
        },
        { status: 200 }
      );
    }

    // Create default super admin
    const superAdminData = {
      name: "Super Admin",
      email: "abdulsalam@example.com",
      password: "Dar-job-321", // Change this!
      role: "super_admin",
      department: "IT",
      permissions: getRolePermissions("super_admin"),
      status: "active",
      isEmailVerified: true,
    };

    const superAdmin = await User.create(superAdminData);

    return NextResponse.json(
      {
        success: true,
        message: "✅ Super admin created successfully!",
        credentials: {
          email: "admin@example.com",
          password: "admin123",
          warning: "⚠️ CHANGE THIS PASSWORD IMMEDIATELY AFTER FIRST LOGIN!",
        },
        user: {
          id: superAdmin._id,
          name: superAdmin.name,
          email: superAdmin.email,
          role: superAdmin.role,
        },
        nextSteps: [
          "1. Go to http://localhost:3000/login",
          "2. Login with the credentials above",
          "3. Change your password immediately",
          "4. Create additional users as needed",
          "5. Delete this /api/seed route file for security",
        ],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating super admin:", error);
    return NextResponse.json(
      {
        error: "Failed to create super admin",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/seed
 * Create super admin with custom credentials
 * 
 * Body: { name, email, password }
 */
export async function POST(req) {
  try {
    // ⚠️ SECURITY: Only allow in development
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "This endpoint is disabled in production" },
        { status: 403 }
      );
    }

    await connectDB();

    // Check if any super admin already exists
    const existingSuperAdmin = await User.findOne({ role: "super_admin" });

    if (existingSuperAdmin) {
      return NextResponse.json(
        {
          error: "Super admin already exists!",
          existing: {
            email: existingSuperAdmin.email,
            name: existingSuperAdmin.name,
          },
        },
        { status: 400 }
      );
    }

    // Get custom data from request
    const { name, email, password } = await req.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // Create super admin with custom data
    const superAdmin = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: "super_admin",
      department: "IT",
      permissions: getRolePermissions("super_admin"),
      status: "active",
      isEmailVerified: true,
    });

    return NextResponse.json(
      {
        success: true,
        message: "✅ Super admin created successfully!",
        user: {
          id: superAdmin._id,
          name: superAdmin.name,
          email: superAdmin.email,
          role: superAdmin.role,
        },
        nextSteps: [
          "1. Go to http://localhost:3000/login",
          "2. Login with your credentials",
          "3. Delete this /api/seed route file for security",
        ],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating super admin:", error);
    return NextResponse.json(
      {
        error: "Failed to create super admin",
        details: error.message,
      },
      { status: 500 }
    );
  }
}