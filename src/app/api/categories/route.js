// src/app/api/categories/route.js
import { NextResponse } from "next/server";
import Category from "@/models/Category";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    
    const categories = await Category.find({ isActive: true })
      .select("name _id") // Only select name and _id
      .sort({ name: 1 });
    
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Only accept name field
    const { name } = body;
    
    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Category name is required" },
        { status: 400 }
      );
    }

    // Create category with only Arabic name
    const category = await Category.create({
      name: name.trim()
    });
    
    return NextResponse.json(
      { success: true, data: category },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}