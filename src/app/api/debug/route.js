import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Job from "@/models/Job";
import { JOB_DEPARTMENTS } from "@/lib/constants";
import User from "@/models/user";
import Application from "@/models/Application";
import applicationCommitteeService from "@/services/committee/ApplicationCommitteeService";

export async function GET() {
  try {
    await connectDB();

    console.log("Constants loaded:", JOB_DEPARTMENTS);

    // Test 1: Job with Population
    const jobs = await Job.find({}).populate("category").limit(1);

    // Test 2: User Fetch
    const users = await User.find({}).select("name email role department").limit(1);

    // Test 3: Application Fetch with Populate
    // Test 3: Application Fetch with STRICT Population (mimic api/applications)
    const applications = await Application.find({})
      .populate("jobId", "title category location department")
      .sort({ createdAt: -1 })
      .limit(10);

    // Test 4: Auth Check
    const { authOptions } = await import("@/lib/auth.config");
    console.log("Auth options loaded:", !!authOptions);

    // Test 5: Execute getServerSession (Expect it to potentially fail or return null, but NOT crash)
    const { getServerSession } = await import("next-auth");
    let session = null;
    try {
      session = await getServerSession(authOptions);
    } catch (e) {
      console.error("getServerSession failed:", e);
      throw new Error("getServerSession CRASH: " + e.message);
    }

    return NextResponse.json({
      status: "ok",
      constants: { JOB_DEPARTMENTS },
      jobs_count: jobs.length,
      sample_job: jobs[0],
      users_count: users.length,
      sample_user: users[0],
      applications_count: applications.length,
      sample_app: applications[0],
      auth_loaded: !!authOptions,
      session_check: session ? "Active" : "Null (Expected in curl)"
    });
  } catch (error) {
    console.error("DIAGNOSTIC_ERROR:", error);
    return NextResponse.json({
      status: "error",
      message: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}