// src\app\api\applications\[id]\send-feedback-request\route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/apiAuth";
import Application from "@/models/Application";
import emailService from "@/services/email/index";
import mongoose from "mongoose";

/**
 * Send feedback request to manager
 * POST /api/applications/[id]/send-feedback-request
 */
export async function POST(request, { params }) {
  try {
    await connectDB();

    // Get authenticated user
    const currentUser = await getAuthUser(request);

    if (!currentUser) {
      return NextResponse.json(
        { error: "غير مصرح" },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "معرف طلب غير صالح" },
        { status: 400 }
      );
    }

    // Get request body
    const body = await request.json();
    const {
      managerEmail,
      managerName,
      managerRole = "technical_reviewer",
      message = "",
      expiresInDays = 1,
      resend = false // New flag
    } = body;

    // Validate required fields
    if (!managerEmail || !managerName) {
      return NextResponse.json(
        { error: "البريد الإلكتروني واسم المدير مطلوبان" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(managerEmail)) {
      return NextResponse.json(
        { error: "البريد الإلكتروني غير صالح" },
        { status: 400 }
      );
    }

    // Get application with job details
    const application = await Application.findById(id)
      .populate({
        path: "jobId",
        select: "title location category",
        populate: { path: "category", select: "name" }
      })
      .lean();

    if (!application) {
      return NextResponse.json(
        { error: "طلب التوظيف غير موجود" },
        { status: 404 }
      );
    }

    // [MODIFIED] Check for active committee to link token
    let applicationCommitteeId = undefined;
    if (application.applicationCommitteeId) {
      // Since we did not populate full committee details in the findById above (only ID ref exists if not populated)
      // application.applicationCommitteeId is likely just an ID or object with ID depending on schema definition
      // We'll trust the ID is enough for the token creation logic
      applicationCommitteeId = application.applicationCommitteeId;
      console.log(`[FeedbackRequest] Linking to Committee: ${applicationCommitteeId}`);
    }

    // Send feedback request email
    const result = await emailService.sendManagerFeedbackRequest({
      application: {
        ...application,
        _id: application._id.toString()
      },
      managerEmail,
      managerName,
      managerRole,
      message,
      expiresInDays,
      triggeredBy: currentUser.id || currentUser._id,
      metadata: { forceSend: resend }, // Pass forceSend flag via metadata logic added to emailSender
      applicationCommitteeId // [ADDED] Pass linked committee
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "فشل إرسال البريد الإلكتروني" },
        { status: 500 }
      );
    }

    // Debugging assistance
    console.log("\n==================================================================");
    console.log(`[FeedbackDebug] Generated Token URL for ${managerEmail}:`);
    console.log(result.feedbackUrl);
    console.log("==================================================================\n");

    return NextResponse.json({
      message: "تم إرسال طلب التقييم بنجاح",
      feedbackUrl: result.feedbackUrl,
      token: result.token
    });
  } catch (error) {
    console.error("Send feedback request error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في إرسال طلب التقييم" },
      { status: 500 }
    );
  }
}