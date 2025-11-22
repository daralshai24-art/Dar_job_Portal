// src/app/api/applications/related/route.js

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Application from "@/models/Application";
import Job from "@/models/Job";


export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const currentId = searchParams.get("currentId");

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email parameter is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const query = { email: normalizedEmail };

    if (currentId && currentId !== "undefined" && currentId !== "null") {
      if (mongoose.Types.ObjectId.isValid(currentId)) {
        query._id = { $ne: new mongoose.Types.ObjectId(currentId) };
      }
    }

    const relatedApplications = await Application.find(query)
      .select("jobId status createdAt name updatedAt")
      .sort({ createdAt: -1 })
      .lean();

    const applicationsWithJobs = await Promise.all(
      relatedApplications.map(async (app) => {
        let jobTitle = "وظيفة غير محددة";

        if (app.jobId) {
          try {
            const job = await Job.findById(app.jobId).select("title").lean();
            if (job && job.title) jobTitle = job.title;
          } catch (err) {
            console.error(`Error fetching job ${app.jobId}:`, err.message);
          }
        }

        return {
          ...app,
          jobTitle,
          jobId: app.jobId,
        };
      })
    );

    return NextResponse.json({
      success: true,
      count: applicationsWithJobs.length,
      data: applicationsWithJobs,
    });

  } catch (error) {
    console.error("[Related Apps API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch related applications" },
      { status: 500 }
    );
  }
}
