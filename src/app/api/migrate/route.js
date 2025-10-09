import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Job from "@/models/Job";
import Application from "@/models/Application";

export async function GET(request) {
  try {
    await connectDB();
    
    console.log("Starting migration...");
    
    // Get all jobs
    const jobs = await Job.find({});
    console.log(`Found ${jobs.length} jobs to migrate`);
    
    let updatedCount = 0;

    for (const job of jobs) {
      try {
        // Count applications for this job
        const applicationCount = await Application.countDocuments({ jobId: job._id });
        console.log(`Job "${job.title}" has ${applicationCount} applications`);
        
        // Update job - this will ADD the field if it doesn't exist
        const result = await Job.findByIdAndUpdate(
          job._id,
          {
            $set: { 
              applicationsCount: applicationCount,
              lastApplicationDate: applicationCount > 0 ? new Date() : null
            }
          },
          { new: true }
        );
        
        console.log(`Updated job "${job.title}": ${applicationCount} applications`);
        updatedCount++;
      } catch (jobError) {
        console.error(`Error updating job ${job.title}:`, jobError);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Migration completed! Updated ${updatedCount} jobs`,
      updatedCount,
      totalJobs: jobs.length
    });

  } catch (error) {
    console.error('Migration failed:', error);
    return NextResponse.json(
      { error: "Migration failed", details: error.message },
      { status: 500 }
    );
  }
}