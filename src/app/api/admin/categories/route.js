//src\app\api\admin\categories\route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { getAuthUser } from "@/lib/apiAuth";

async function verifyAdmin() {
  const user = await getAuthUser();
  if (!user || !["super_admin", "admin"].includes(user.role)) {
    return NextResponse.json({ message: "غير مصرح لك بالوصول" }, { status: 403 });
  }
  return user;
}

// GET all categories
export async function GET() {
  try {
    await connectDB();
    const user = await verifyAdmin();
    if (user?.status === 403) return user;

    const categories = await Category.find().sort({ createdAt: -1 });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create category
export async function POST(request) {
  try {
    await connectDB();
    const user = await verifyAdmin();
    if (user?.status === 403) return user;

    const { name } = await request.json();
    if (!name) return NextResponse.json({ message: "اسم الفئة مطلوب" }, { status: 400 });

    const exists = await Category.findOne({ name });
    if (exists) return NextResponse.json({ message: "الفئة موجودة بالفعل" }, { status: 409 });

    const category = await Category.create({ name, createdBy: user._id });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update category
export async function PUT(request) {
  try {
    await connectDB();
    const user = await verifyAdmin();
    if (user?.status === 403) return user;

    const { id, name } = await request.json();
    const updated = await Category.findByIdAndUpdate(id, { name }, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH activate category
export async function PATCH(request) {
  try {
    await connectDB();
    const user = await verifyAdmin();
    if (user?.status === 403) return user;

    const { id } = await request.json();
    const updated = await Category.findByIdAndUpdate(
      id, 
      { isActive: true }, 
      { new: true }
    );
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE deactivate category (soft delete)
export async function DELETE(request) {
  try {
    await connectDB();
    const user = await verifyAdmin();
    if (user?.status === 403) return user;

    const { id } = await request.json();
    await Category.findByIdAndUpdate(id, { isActive: false });
    return NextResponse.json({ message: "تم تعطيل الفئة" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}