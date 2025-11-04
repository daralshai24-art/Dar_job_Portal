// src/app/api/applications/route.js
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { connectDB } from "@/lib/db";
import Application from "@/models/Application";
import Timeline from "@/models/Timeline";
import Job from "@/models/Job";

export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();

    const applicationData = {
      jobId: formData.get("jobId"),
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    };

    // ✅ Validate required fields
    if (!applicationData.jobId || !applicationData.name || !applicationData.email) {
      return NextResponse.json(
        { error: "جميع الحقول المطلوبة يجب ملؤها" },
        { status: 400 }
      );
    }

    // ✅ Ensure job exists and active
    const job = await Job.findById(applicationData.jobId);
    if (!job) return NextResponse.json({ error: "الوظيفة غير موجودة" }, { status: 404 });

    if (job.status !== "active") {
      return NextResponse.json(
        { error: "الوظيفة غير متاحة للتقديم حالياً" },
        { status: 400 }
      );
    }

    // ✅ Prevent duplicate email/phone for same job
    const normalizedEmail = applicationData.email.toLowerCase().trim();
    const normalizedPhone = applicationData.phone
      ? applicationData.phone.replace(/\D/g, "")
      : "";

    const duplicateQuery = {
      jobId: applicationData.jobId,
      $or: [],
    };

    if (normalizedEmail) duplicateQuery.$or.push({ email: normalizedEmail });
    if (normalizedPhone) duplicateQuery.$or.push({ phone: normalizedPhone });

    if (duplicateQuery.$or.length > 0) {
      const existingApplication = await Application.findOne(duplicateQuery);
      if (existingApplication) {
        return NextResponse.json(
          { error: "لقد تقدمت لهذه الوظيفة مسبقاً" },
          { status: 400 }
        );
      }
    }

    // ✅ Handle CV upload
    const cvFile = formData.get("cv");
    if (!cvFile || cvFile.size === 0) {
      return NextResponse.json({ error: "يرجى رفع السيرة الذاتية" }, { status: 400 });
    }

    const bytes = await cvFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });
    const filename = `${Date.now()}-${cvFile.name}`;
    const uploadPath = path.join(uploadsDir, filename);
    await writeFile(uploadPath, buffer);

    applicationData.cv = {
      filename,
      originalName: cvFile.name,
      path: `/uploads/${filename}`,
      size: cvFile.size,
    };

    // ✅ Create application
    const application = await Application.create(applicationData);

    // ✅ Create timeline entry in Timeline collection
    await Timeline.create({
      applicationId: application._id,
      action: "created",
      status: "pending",
      notes: "تم تقديم الطلب بنجاح",
      performedBy: null,
      performedByName: "Applicant",
    });

    // ✅ Update job stats
    await Job.findByIdAndUpdate(applicationData.jobId, {
      $inc: { applicationsCount: 1 },
      lastApplicationDate: new Date(),
    });

    // ✅ Return minimal response (timeline fetched on detail page)
    return NextResponse.json(
      {
        message: "تم إرسال طلب التوظيف بنجاح! سيتم التواصل معك قريباً",
        applicationId: application._id,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في تقديم الطلب: " + error.message },
      { status: 500 }
    );
  }
}


export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");
    const status = searchParams.get("status");

    const query = {};
    if (jobId) query.jobId = jobId;
    if (status) query.status = status;

    const applications = await Application.find(query)
      .populate("jobId", "title category location")
      .sort({ createdAt: -1 });

    return NextResponse.json(applications);

  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json({ error: "حدث خطأ في جلب الطلبات" }, { status: 500 });
  }
}


export async function DELETE() {
  try {
    await connectDB();
    await Application.deleteMany({});
    await Timeline.deleteMany({});
    return NextResponse.json({ message: "تم حذف جميع طلبات التوظيف وسجل الإجراءات" });
  } catch (error) {
    return NextResponse.json({ error: "فشل حذف الطلبات" }, { status: 500 });
  }
}
