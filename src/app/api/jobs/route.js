// app/api/jobs/route.js
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import Job from "../../../models/Job";
import Category from "@/models/Category";
import Application from "@/models/Application";

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

/**
 * POST /api/jobs
 * Creates a new job posting
 */
const validateJobInput = (body) => {
  const errors = [];

  if (!body.title?.trim()) errors.push("Title is required");
  if (!body.description?.trim()) errors.push("Description is required");
  if (!body.location?.trim()) errors.push("Location is required");
  if (!body.category) errors.push("Category is required");

  if (body.title?.length > 100) errors.push("Title must be less than 100 characters");
  if (body.description?.length > 2000) errors.push("Description must be less than 2000 characters");

  const validStatus = ["draft", "active", "inactive", "closed"];
  if (body.status && !validStatus.includes(body.status)) {
    errors.push(`Status must be one of: ${validStatus.join(", ")}`);
  }

  const validJobTypes = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"];
  if (body.jobType && !validJobTypes.includes(body.jobType)) {
    errors.push(`Job type must be one of: ${validJobTypes.join(", ")}`);
  }

  const validExperience = ["Entry Level", "Mid Level", "Senior Level", "Executive"];
  if (body.experience && !validExperience.includes(body.experience)) {
    errors.push(`Experience must be one of: ${validExperience.join(", ")}`);
  }

  return errors;
};

const prepareJobData = (body) => {
  return {
    title: body.title?.trim(),
    description: body.description?.trim(),
    location: body.location?.trim(),
    salary: body.salary?.trim() || "",
    status: body.status || "draft",
    category: body.category,
    jobType: body.jobType || "Full-time",
    experience: body.experience || "Entry Level",
    requirements: body.requirements?.trim() || ""
  };
};

export async function POST(request) {
  try {
    await connectDB();

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const validationErrors = validateJobInput(body);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      );
    }

    const categoryExists = await Category.findById(body.category);
    if (!categoryExists) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 }
      );
    }

    const jobData = prepareJobData(body);
    const job = await Job.create(jobData);

    const populatedJob = await Job.findById(job._id)
      .populate("category", "name _id");

    return NextResponse.json(
      { success: true, message: "Job created successfully", data: populatedJob },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/jobs error:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { 
          error: "Database validation failed",
          details: Object.values(error.errors).map((e) => e.message)
        },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Job with similar details already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/jobs
 * DELETE all jobs AND all applications
 */
export async function DELETE() {
  try {
    await connectDB();

    await Application.deleteMany({});
    await Job.deleteMany({});

    return NextResponse.json(
      { success: true, message: "✅ All jobs and applications deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/jobs error:", error);
    return NextResponse.json(
      { error: "Failed to delete jobs", details: error.message },
      { status: 500 }
    );
  }
}
