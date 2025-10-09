import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Application from "@/models/Application";

export async function GET(request, { params }) {
  try {
     await connectDB();

    const { id } = await params;

    const application = await Application.findById(id)
      .populate('jobId', 'title location category');

    if (!application) {
      return NextResponse.json(
        { error: "طلب التوظيف غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب بيانات الطلب" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
   await connectDB();

    const updateData = await request.json();
    const { id } = await params;

    const application = await Application.findByIdAndUpdate(
        id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('jobId', 'title location category');

    if (!application) {
      return NextResponse.json(
        { error: "طلب التوظيف غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "تم تحديث الطلب بنجاح",
      application
    });
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: "حدث خطأ في تحديث الطلب" },
      { status: 500 }
    );
  }
}