// src\app\api\admin\jobs\route.js
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import Job from "../../../../models/Job";
import Category from "@/models/Category";
import Application from "@/models/Application";
import { JOB_DEPARTMENTS, JOB_TYPES, JOB_LEVELS } from "@/lib/constants";


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
  if (!body.department) errors.push("Department is required");

  if (body.title?.length > 100) errors.push("Title must be less than 100 characters");
  if (body.description?.length > 2000) errors.push("Description must be less than 2000 characters");

  const validStatus = ["draft", "active", "inactive", "closed"];
  if (body.status && !validStatus.includes(body.status)) {
    errors.push(`Status must be one of: ${validStatus.join(", ")}`);
  }

  if (body.department && !JOB_DEPARTMENTS.includes(body.department)) {
    errors.push(`Department must be one of: ${JOB_DEPARTMENTS.join(", ")}`);
  }

  if (body.jobType && !JOB_TYPES.includes(body.jobType)) {
    errors.push(`Job type must be one of: ${JOB_TYPES.join(", ")}`);
  }

  if (body.experience && !JOB_LEVELS.includes(body.experience)) {
    errors.push(`Experience must be one of: ${JOB_LEVELS.join(", ")}`);
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
    department: body.department,
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

    console.log("API Received Job Body:", body); // DEBUG LOG

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
