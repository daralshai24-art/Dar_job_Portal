// app/api/jobs/route.js
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import Job from "../../../models/Job";


/**
 * GET /api/jobs
 * Retrieves all jobs with optional filtering
 */
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let query = {};

    // Add status filter if provided
    if (status && status !== "all") {
      query.status = status;
    }

    // Add category filter if provided - expects category ID
    if (category && category !== "all") {
      query.category = category;
    }

    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const jobs = await Job.find(query)
      .populate("category", "name _id")
      .sort({ createdAt: -1 });

    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    console.error("GET /api/jobs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs", details: error.message },
      { status: 500 }
    );
  }
}
