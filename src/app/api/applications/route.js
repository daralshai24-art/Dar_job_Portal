// src/app/api/applications/route.js (FIXED - Correct Import Path)
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { connectDB } from "@/lib/db";
import Application from "@/models/Application";
import Timeline from "@/models/Timeline";
import Job from "@/models/Job";

// Email service import removed from top-level to avoid ESM require errors
import Committee from "@/models/Committee";
import applicationCommitteeService from "@/services/committee/ApplicationCommitteeService";

export async function POST(request) {
  try {
    await connectDB();

    // Dynamically import emailService to avoid ESM circular dependency issues
    let emailService;
    try {
      const emailModule = await import("@/services/email");
      emailService = emailModule.default;
    } catch (e) {
      console.error("Failed to load email service:", e);
    }

    const formData = await request.formData();

    const applicationData = {
      jobId: formData.get("jobId"),
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      city: formData.get("city"),
      nationality: formData.get("nationality"),
      dataConfirmation: formData.get("dataConfirmation") === "true",
    };

    // ✅ Validate required fields
    if (!applicationData.jobId || !applicationData.name || !applicationData.email || !applicationData.nationality || !applicationData.phone) {
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

    // ✅ Handle Experience File upload (Required)
    const experienceFile = formData.get("experience");
    if (!experienceFile || experienceFile.size === 0) {
      return NextResponse.json({ error: "يرجى رفع ملف الخبرات" }, { status: 400 });
    }

    const expBytes = await experienceFile.arrayBuffer();
    const expBuffer = Buffer.from(expBytes);
    // Use same uploads directory
    const expFilename = `exp-${Date.now()}-${experienceFile.name}`;
    const expUploadPath = path.join(uploadsDir, expFilename);
    await writeFile(expUploadPath, expBuffer);

    applicationData.experience = {
      filename: expFilename,
      originalName: experienceFile.name,
      path: `/uploads/${expFilename}`,
      size: experienceFile.size,
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

    // ==================== 🆕 AUTOMATIC COMMITTEE ASSIGNMENT ====================
    try {
      // 1. Try to find a committee for the Department
      let matchedCommittee = await Committee.findOne({
        department: job.department,
        isActive: true,
        "settings.autoAssignToApplications": true
      });

      // 2. Fallback: Try to find a committee for the Category
      if (!matchedCommittee) {
        matchedCommittee = await Committee.findOne({
          category: job.category,
          isActive: true,
          "settings.autoAssignToApplications": true
        });
      }

      // 3. Assign if found
      if (matchedCommittee) {
        console.log(`[AutoAssign] Assigning committee "${matchedCommittee.name}" to application ${application._id}`);
        await applicationCommitteeService.assignCommittee(application._id, matchedCommittee._id);

        // Add timeline entry
        await Timeline.create({
          applicationId: application._id,
          action: "status_changed", // or a specific action if available
          status: "pending", // Application status doesn't strictly change, but we add a note
          notes: `تم تعيين لجنة "${matchedCommittee.name}" تلقائياً للنظر في الطلب`,
          performedBy: null,
          performedByName: "System",
        });
      } else {
        console.log(`[AutoAssign] No matching auto-assign committee found for Job: ${job.title} (Dept: ${job.department})`);
      }
    } catch (assignError) {
      console.error("[AutoAssign] Failed to assign committee:", assignError);
      // We do not block the response, just log the error
    }
    // ==================== END COMMITTEE ASSIGNMENT ====================

    // ==================== 🆕 SEND CONFIRMATION EMAIL ====================

    if (emailService) {
      try {
        // Populate job details for email
        const populatedApp = await Application.findById(application._id)
          .populate({
            path: "jobId",
            select: "title location category department", // Ensure department is selected
            populate: { path: "category", select: "name" }
          })
          .lean();

        // Prepare application data for email
        const appData = {
          ...populatedApp,
          _id: populatedApp._id.toString(),
          jobId: populatedApp.jobId ? {
            ...populatedApp.jobId,
            _id: populatedApp.jobId._id.toString()
          } : null
        };

        // 1. Send Applicant Confirmation
        emailService.sendApplicationReceived({
          application: appData,
          triggeredBy: null
        }).catch(err => console.error("Applicant email error:", err.message));

        // 2. [New] Internal Team Alerts (Managed by Rules)
        await emailService.sendNewApplicationAlert({
          application: appData,
          triggeredBy: null
        });

      } catch (emailError) {
        console.error("📧 Email notification error (non-critical):", emailError.message);
      }
    }
    // ==================== END EMAIL LOGIC ====================

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

    // 🔒 Security Check
    const { getServerSession } = await import("next-auth");
    const { authOptions } = await import("@/lib/auth.config");
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");
    const status = searchParams.get("status");

    const query = {};
    if (jobId) query.jobId = jobId;
    if (status) query.status = status;

    // 👷 Department Manager Filtering (Flow 11)
    if (session.user.role === "department_manager") {
      // Filter by department
      // 1. Find jobs in user's department
      // (If user has no department, they see nothing)
      if (!session.user.department) {
        return NextResponse.json([]);
      }

      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      // 2. Find jobs belonging to this department
      // We only want applications for jobs in THIS department
      const deptJobs = await Job.find({ department: session.user.department }).select("_id");
      const deptJobIds = deptJobs.map(j => j._id);

      // Add to query
      // If jobId was already passed in query, ideally we check if it is in deptJobIds.
      if (query.jobId) {
        const isAllowed = deptJobIds.some(id => id.toString() === query.jobId);
        if (!isAllowed) {
          return NextResponse.json([]); // Explicitly return empty if searching for unauthorized job
        }
        // query.jobId is already set
      } else {
        // Filter by all allowed jobs
        query.jobId = { $in: deptJobIds };
      }
    }
    // Admin/HR see all (no extra filter needed)

    const applications = await Application.find(query)
      .populate("jobId", "title category location department")
      .sort({ createdAt: -1 });

    return NextResponse.json(applications);

  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json({
      error: "حدث خطأ في جلب الطلبات"
    }, { status: 500 });
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