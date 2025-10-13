// app/api/jobs/route.js
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import Job from "../../../models/Job";
import Category from "@/models/Category";

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

    // Add category filter if provided - NOW USING CATEGORY ID
    if (category && category !== "all") {
      query.category = category; // Now expects category ID
    }

    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Execute query with category population
    const jobs = await Job.find(query)
      .populate('category', 'name  _id') // Populate category data
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

  // Required fields
  if (!body.title?.trim()) errors.push("Title is required");
  if (!body.description?.trim()) errors.push("Description is required");
  if (!body.location?.trim()) errors.push("Location is required");
  if (!body.category) errors.push("Category is required"); // Now required

  // Field length validation
  if (body.title?.length > 100) errors.push("Title must be less than 100 characters");
  if (body.description?.length > 2000) errors.push("Description must be less than 2000 characters");

  // Enum validation
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
    category: body.category, // Now expects category ID
    jobType: body.jobType || "Full-time",
    experience: body.experience || "Entry Level",
    requirements: body.requirements?.trim() || "",
  };
};

export async function POST(request) {
  try {
    await connectDB();

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    console.log('Received job data:', body);

    // Validate input
    const validationErrors = validateJobInput(body);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: validationErrors 
        },
        { status: 400 }
      );
    }

    // Verify category exists
    const categoryExists = await Category.findById(body.category);
    if (!categoryExists) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 }
      );
    }

    // Prepare job data
    const jobData = prepareJobData(body);

    // Create job in database
    const job = await Job.create(jobData);

    console.log('Job created successfully:', job._id);

    // Return populated job data
    const populatedJob = await Job.findById(job._id).populate('category', 'name  _id');

    return NextResponse.json(
      { 
        success: true,
        message: "Job created successfully",
        data: populatedJob 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("POST /api/jobs error:", error);

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return NextResponse.json(
        { 
          error: "Database validation failed", 
          details: validationErrors 
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
      { 
        error: "Internal server error",
        message: process.env.NODE_ENV === "development" ? error.message : "Something went wrong"
      },
      { status: 500 }
    );
  }
}