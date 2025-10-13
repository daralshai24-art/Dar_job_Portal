//src/app/api/applications/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Application from "@/models/Application";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const application = await Application.findById(id)
      .populate({
        path: 'jobId',
        select: 'title location category',
        populate: {
          path: 'category',
          select: 'name'
        }
      });

    if (!application) {
      return NextResponse.json(
        { error: "طلب التوظيف غير موجود" },
        { status: 404 }
      );
    }

    // Extract category name from the populated category object
    const categoryName = application.jobId?.category?.name;

    // Return the application with categoryName included
    const responseData = {
      ...application.toObject(),
      categoryName: categoryName || "غير محدد"
    };
    
    return NextResponse.json(responseData);
  } catch (error) {
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
    ).populate({
      path: 'jobId',
      select: 'title location category',
      populate: {
        path: 'category',
        select: 'name'
      }
    });

    if (!application) {
      return NextResponse.json(
        { error: "طلب التوظيف غير موجود" },
        { status: 404 }
      );
    }

    // Extract category name from the populated category object
    const categoryName = application.jobId?.category?.name;

    return NextResponse.json({
      message: "تم تحديث الطلب بنجاح",
      application: {
        ...application.toObject(),
        categoryName: categoryName || "غير محدد"
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ في تحديث الطلب" },
      { status: 500 }
    );
  }
}