//src\app\api\admin\categories\[id]\route.js
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

// ✅ Update category
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const user = await verifyAdmin();
    if (user?.status === 403) return user;

    const { id } = params;
    const { name } = await request.json();
    if (!name) return NextResponse.json({ message: "اسم الفئة مطلوب" }, { status: 400 });

    const updated = await Category.findByIdAndUpdate(id, { name }, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ PATCH activate category
export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const user = await verifyAdmin();
    if (user?.status === 403) return user;

    const { id } = params;
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

// ✅ DELETE permanently (hard delete)
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const user = await verifyAdmin();
    if (user?.status === 403) return user;

    const { id } = params;
    await Category.findByIdAndDelete(id);
    return NextResponse.json({ message: "تم حذف الفئة نهائياً" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}