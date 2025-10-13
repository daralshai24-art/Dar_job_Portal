// src/app/api/jobs/options/route.js
import { NextResponse } from "next/server";
import Job from "@/models/Job";
import Category from "@/models/Category";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find({ isActive: true })
      .select('name _id')
      .sort({ name: 1 });

    const [titles, locations] = await Promise.all([
      Job.distinct("title", { title: { $ne: "" } }),
      Job.distinct("location", { location: { $ne: "" } })
    ]);

    return NextResponse.json({
      titles: titles.sort(),
      locations: locations.sort(),
      categories: categories.map(cat => ({
        _id: cat._id,
        name: cat.name
      }))
    });
  } catch (error) {
    console.error("Error fetching job options:", error);
    return NextResponse.json(
      { error: "Failed to fetch options", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const { field, value } = await request.json();

    console.log("Received request to add option:", { field, value });

    if (!field || !value) {
      return NextResponse.json(
        { error: "Field and value are required" },
        { status: 400 }
      );
    }

    // Handle category creation
    if (field === "categories") {
      const trimmedValue = value.trim();
      
      if (!trimmedValue) {
        return NextResponse.json(
          { error: "Category name cannot be empty" },
          { status: 400 }
        );
      }

      // Check if category already exists
      const existingCategory = await Category.findOne({
        name: trimmedValue
      });

      if (existingCategory) {
        return NextResponse.json(
          { 
            error: "Category already exists",
            data: {
              _id: existingCategory._id,
              name: existingCategory.name
            }
          },
          { status: 409 }
        );
      }

      // Create new category
      const newCategory = await Category.create({
        name: trimmedValue
      });

      console.log("New category created:", newCategory);

      return NextResponse.json({
        success: true,
        message: "Category created successfully",
        data: {
          _id: newCategory._id,
          name: newCategory.name
        }
      });
    }

    // For titles and locations - return success response
    return NextResponse.json({
      success: true,
      message: "Option will be available after saving a job",
      [field]: value
    });

  } catch (error) {
    console.error("Error adding job option:", error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 409 }
      );
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to add option", details: error.message },
      { status: 500 }
    );
  }
}