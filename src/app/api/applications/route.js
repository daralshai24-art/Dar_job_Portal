// src/app/api/applications/route.js (FIXED - Correct Import Path)
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { connectDB } from "@/lib/db";
import Application from "@/models/Application";
import Timeline from "@/models/Timeline";
import Job from "@/models/Job";

// 🆕 FIXED: Import email service from new modular structure
let emailService = null;
try {
  emailService = require("@/services/email").default; // ← Changed from emailService to email
} catch (e) {
  console.log("Email service not available yet - emails will be skipped");
}

export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();

    const applicationData = {
      jobId: formData.get("jobId"),
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      city: formData.get("city")
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

        // 2. [New] Notify Department Managers (Flow 13)
        // Check if job has a department
        if (appData.jobId && appData.jobId.department) {
          const emailRoutingService = require("@/services/email/EmailRoutingService").default;

          // Get Dept Managers for this department
          const deptManagers = await emailRoutingService.getRecipientsByRole(
            "department_manager",
            "new_dept_application",
            { department: appData.jobId.department }
          );

          for (const manager of deptManagers) {
            emailService.sendEmail({
              to: manager.email,
              subject: `طلب توظيف جديد: ${appData.jobId.title}`,
              html: `
                        <div dir="rtl">
                            <h2>طلب توظيف جديد في قسمك</h2>
                            <p>مرحباً ${manager.name}،</p>
                            <p>تم استلام طلب توظيف جديد لوظيفة <strong>${appData.jobId.title}</strong> في قسم <strong>${appData.jobId.department}</strong>.</p>
                            <p>اسم المتقدم: ${appData.name}</p>
                            <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/applications/${appData._id}">عرض الطلب</a>
                        </div>
                    `,
              emailType: "new_dept_application",
              recipientType: "manager",
              applicationId: appData._id
            }).catch(err => console.error(`Failed to notify dept manager ${manager.email}`, err.message));
          }
        }

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