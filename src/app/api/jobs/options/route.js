import { NextResponse } from "next/server";
import Job from "@/models/Job";
import {connectDB} from "@/lib/db";

// GET /api/jobs/options - Get all dynamic options
export async function GET() {
  try {
    await connectDB();

    // Get unique values from existing jobs
    const [titles, locations, categories] = await Promise.all([
      Job.distinct("title", { title: { $ne: "" } }),
      Job.distinct("location", { location: { $ne: "" } }),
      Job.distinct("category", { category: { $ne: "" } })
    ]);

    return NextResponse.json({
      titles: titles.sort(),
      locations: locations.sort(),
      categories: categories.sort()
    });
  } catch (error) {
    console.error("Error fetching job options:", error);
    return NextResponse.json(
      { error: "Failed to fetch options" },
      { status: 500 }
    );
  }
}

// POST /api/jobs/options - Add new option
export async function POST(request) {
  try {
    await connectDB();
    const { field, value } = await request.json();

    if (!field || !value) {
      return NextResponse.json(
        { error: "Field and value are required" },
        { status: 400 }
      );
    }

    // Validate field
    const validFields = ["titles", "locations", "categories"];
    if (!validFields.includes(field)) {
      return NextResponse.json(
        { error: "Invalid field" },
        { status: 400 }
      );
    }

    // Since we're using dynamic options from existing data, 
    // we don't need to store separately. The option will be available
    // once a job is created with it.
    return NextResponse.json({
      message: "Option will be available after saving a job",
      [field]: value
    });
  } catch (error) {
    console.error("Error adding job option:", error);
    return NextResponse.json(
      { error: "Failed to add option" },
      { status: 500 }
    );
  }
}