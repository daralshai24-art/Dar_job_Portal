// src/app/api/categories/test/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connectDB();
    
    // Count total categories
    const totalCategories = await Category.countDocuments();
    
    // Get some sample categories
    const sampleCategories = await Category.find({})
      .select('name _id')
      .limit(5)
      .sort({ name: 1 });
    
    return NextResponse.json({
      success: true,
      message: "Categories API is working correctly",
      totalCategories,
      sampleCategories,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}