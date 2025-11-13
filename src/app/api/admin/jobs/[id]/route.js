// app/api/admin/jobs/[id]/route.js
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

/**
 * PUT /api/jobs/[id]
 * Updates a job by ID
 */
export async function PUT(request, context) {
  try {
    await connectDB();
    
    const { params } = context;
    const { id } = await params; // ✅ Await params

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    console.log('Updating job:', id, 'with data:', body);

    // Find and update the job
    const updatedJob = await Job.findByIdAndUpdate(
      id,
      { 
        ...body,
        updatedAt: new Date() 
      },
      { 
        new: true, // Return the updated document
        runValidators: true // Run schema validators
      }
    ).populate('category', 'name _id');

    if (!updatedJob) {
      return NextResponse.json(
        { error: "الوظيفة غير موجودة" },
        { status: 404 }
      );
    }

    console.log('Job updated successfully:', updatedJob._id);

    return NextResponse.json({
      success: true,
      message: "تم تحديث الوظيفة بنجاح",
      data: updatedJob,
    }, { status: 200 });

  } catch (error) {
    console.error("PUT /api/jobs/[id] error:", error);

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return NextResponse.json(
        { 
          error: "فشل في التحقق من البيانات", 
          details: validationErrors 
        },
        { status: 400 }
      );
    }

    if (error.name === "CastError") {
      return NextResponse.json(
        { error: "معرف الوظيفة غير صالح" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: "فشل في تحديث الوظيفة",
        message: process.env.NODE_ENV === "development" ? error.message : "حدث خطأ ما"
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/jobs/[id]
 * Deletes a job by ID
 */
export async function DELETE(request, context) {
  try {
    await connectDB();
    
    const { params } = context;
    const { id } = await params; // ✅ Await params

    console.log('Attempting to delete job:', id);

    const deletedJob = await Job.findByIdAndDelete(id);

    if (!deletedJob) {
      return NextResponse.json(
        { error: "الوظيفة غير موجودة" },
        { status: 404 }
      );
    }

    console.log('Job deleted successfully:', deletedJob._id);

    return NextResponse.json({
      success: true,
      message: "تم حذف الوظيفة بنجاح",
      data: deletedJob,
    }, { status: 200 });

  } catch (error) {
    console.error("DELETE /api/jobs/[id] error:", error);

    if (error.name === "CastError") {
      return NextResponse.json(
        { error: "معرف الوظيفة غير صالح" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: "فشل في حذف الوظيفة",
        message: process.env.NODE_ENV === "development" ? error.message : "حدث خطأ ما"
      },
      { status: 500 }
    );
  }
}
