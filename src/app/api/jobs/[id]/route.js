// app/api/jobs/[id]/route.js
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import Job from "@/models/Job";

/**
 * GET /api/jobs/[id]
 * Retrieves a single job by ID
 */
export async function GET(request, context) {
  try {
    await connectDB();
    
    const { params } = context;
    const { id } = await params; // ✅ Await params before accessing properties

    // Find job by ID and populate category
    const job = await Job.findById(id)
      .populate('category', 'name _id')
      .exec();

    if (!job) {
      return NextResponse.json(
        { error: "الوظيفة غير موجودة" },
        { status: 404 }
      );
    }
  
    return NextResponse.json(job, { status: 200 });
  } catch (error) {
    console.error("GET /api/jobs/[id] error:", error);
    return NextResponse.json(
      { error: "فشل في جلب بيانات الوظيفة", details: error.message },
      { status: 500 }
    );
  }
}
