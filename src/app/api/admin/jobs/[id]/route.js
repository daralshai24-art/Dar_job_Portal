// app/api/admin/jobs/[id]/route.js
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import Job from "@/models/Job";
import Committee from "@/models/Committee";

/**
 * Helper to validate if a committee exists for the job
 */
async function validateCommitteeForJob(department, categoryId) {
  // 1. Try Department Match
  let committee = await Committee.findOne({
    department,
    isActive: true,
    "settings.autoAssignToApplications": true
  });

  if (committee) return true;

  // 2. Try Category Match
  committee = await Committee.findOne({
    category: categoryId,
    isActive: true,
    "settings.autoAssignToApplications": true
  });

  if (committee) return true;

  return false;
}

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

    // 🔴 Validation: Ensure Committee Exists if Status is becoming Active
    if (body.status === 'active') {
      // We might need to fetch current job if dept/category are not in body
      // But usually admin sends full form or at least changed fields.
      // To be safe, we should fetch the job current state if fields are missing
      const currentJob = await Job.findById(id);

      const targetDepartment = body.department || currentJob.department;
      const targetCategory = body.category || currentJob.category;

      const hasCommittee = await validateCommitteeForJob(targetDepartment, targetCategory);
      if (!hasCommittee) {
        return NextResponse.json(
          {
            error: "لا يمكن نشر الوظيفة",
            details: `لا توجد لجنة توظيف نشطة (مفعل بها التعيين التلقائي) لهذا القسم (${targetDepartment}) أو التصنيف. يرجى إنشاء لجنة أولاً.`
          },
          { status: 400 }
        );
      }
    }

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
