// src/app/api/applications/route.js
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { connectDB } from "@/lib/db";
import Application from "@/models/Application";
import Job from "@/models/Job";
import path from "path";

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

    // ✅ Basic validation
    if (!applicationData.jobId || !applicationData.name || !applicationData.email) {
      return NextResponse.json(
        { error: "جميع الحقول المطلوبة يجب ملؤها" },
        { status: 400 }
      );
    }

    // ✅ Ensure job exists and is active
    const job = await Job.findById(applicationData.jobId);
    if (!job) {
      return NextResponse.json({ error: "الوظيفة غير موجودة" }, { status: 404 });
    }

    if (job.status !== "active") {
      return NextResponse.json(
        { error: "الوظيفة غير متاحة للتقديم حالياً" },
        { status: 400 }
      );
    }

    // ✅ Duplicate prevention (same job)
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
        let errorMessage = "لقد تقدمت لهذه الوظيفة مسبقاً";
        if (existingApplication.email === normalizedEmail)
          errorMessage = "لقد تقدمت لهذه الوظيفة مسبقاً باستخدام هذا البريد الإلكتروني";
        else if (existingApplication.phone === normalizedPhone)
          errorMessage = "لقد تقدمت لهذه الوظيفة مسبقاً باستخدام هذا رقم الهاتف";

        return NextResponse.json({ error: errorMessage }, { status: 400 });
      }
    }

    // ✅ Handle CV upload
    const cvFile = formData.get("cv");
    if (cvFile && cvFile.size > 0) {
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
    } else {
      return NextResponse.json(
        { error: "يرجى رفع السيرة الذاتية" },
        { status: 400 }
      );
    }

    // ✅ Detect current logged-in user (if any)
    // NOTE: Adjust this depending on your auth setup (e.g., JWT, session, NextAuth)
    let performedByUserId = null;

    try {
      // Example: if you store user info in headers or cookies (JWT, etc.)
      const authHeader = request.headers.get("authorization");
      if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        // Decode token here if applicable (pseudo example):
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // performedByUserId = decoded.userId;
      }
    } catch (err) {
      console.warn("Could not identify user from request:", err.message);
    }

    // ✅ Create application with real user link (if available)
    const application = await Application.create({
      ...applicationData,
      timeline: [
        {
          action: "created",
          status: "pending",
          notes: "تم تقديم الطلب بنجاح",
          performedBy: performedByUserId || null, // link if user exists, null otherwise
          date: new Date(),
        },
      ],
    });

    // ✅ Update job stats
    await Job.findByIdAndUpdate(applicationData.jobId, {
      $inc: { applicationsCount: 1 },
      lastApplicationDate: new Date(),
    });

    // ✅ Populate job details and timeline user for response
    await application.populate([
      { path: "jobId", select: "title" },
      { path: "timeline.performedBy", select: "name email role" },
    ]);

    return NextResponse.json(
      {
        message: "تم إرسال طلب التوظيف بنجاح! سيتم التواصل معك قريباً",
        application,
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
      .populate("timeline.performedBy", "name email role")
      .sort({ createdAt: -1 });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب الطلبات" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await connectDB();
    await Application.deleteMany({});
    return NextResponse.json({ message: "تم حذف جميع طلبات التوظيف" });
  } catch (error) {
    return NextResponse.json(
      { error: "فشل حذف الطلبات" },
      { status: 500 }
    );
  }
}
