// src/app/api/feedback/submit/[token]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import FeedbackToken from "@/models/FeedbackToken";
import Application from "@/models/Application";
import Timeline from "@/models/Timeline";
import emailRoutingService from "@/services/email/EmailRoutingService";
import feedbackOrchestratorService from "@/services/committee/FeedbackOrchestratorService";

/**
 * Submit manager feedback
 * Public endpoint - no auth required (uses token)
 */
export async function POST(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const { token } = resolvedParams;
    console.log(`[FeedbackSubmit] Receiving submission for Token: ${token}`);

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    // Get feedback data
    const body = await request.json();
    const { technicalNotes, strengths, weaknesses, recommendation, overallScore } = body;
    console.log(`[FeedbackSubmit] Data: Score=${overallScore}, Rec=${recommendation}`);

    if (!technicalNotes || !technicalNotes.trim()) {
      return NextResponse.json(
        { error: "الملاحظات الفنية مطلوبة" },
        { status: 400 }
      );
    }

    // Verify token
    const result = await FeedbackToken.verifyToken(token);

    if (!result.valid) {
      console.warn(`[FeedbackSubmit] Invalid Token: ${token}`);
      return NextResponse.json(
        { error: "رابط غير صالح أو منتهي الصلاحية" },
        { status: 400 }
      );
    }

    const feedbackToken = result.token;
    console.log(`[FeedbackSubmit] Token Verified. Manager: ${feedbackToken.managerEmail} (${feedbackToken.managerRole})`);

    // Check if already submitted
    if (feedbackToken.feedbackSubmitted) {
      console.warn(`[FeedbackSubmit] Token already used: ${token}`);
      return NextResponse.json(
        { error: "تم إرسال التقييم مسبقاً" },
        { status: 400 }
      );
    }

    const applicationId = feedbackToken.applicationId._id;
    console.log(`[FeedbackSubmit] Updating Application: ${applicationId}`);

    // Get application
    const application = await Application.findById(applicationId);

    if (!application) {
      return NextResponse.json(
        { error: "طلب التوظيف غير موجود" },
        { status: 404 }
      );
    }

    // Prepare feedback data
    const feedbackData = {
      managerName: feedbackToken.managerName,
      managerEmail: feedbackToken.managerEmail,
      managerRole: feedbackToken.managerRole,
      technicalNotes,
      strengths: strengths?.split('\n').filter(s => s.trim()) || [],
      weaknesses: weaknesses?.split('\n').filter(w => w.trim()) || [],
      recommendation,
      overallScore: parseInt(overallScore) || 5,
      submittedAt: new Date()
    };

    // Update application - ONLY update managerFeedbacks (Data Integrity Fix)
    // We no longer overwrite top-level technicalNotes/hrNotes/strengths/weaknesses
    // to prevent race conditions and data loss with multiple reviewers.

    if (!application.managerFeedbacks) {
      application.managerFeedbacks = [];
    }
    application.managerFeedbacks.push(feedbackData);

    // Save application
    await application.save();
    console.log(`[FeedbackSubmit] Application Saved.`);

    // Mark token as used
    await feedbackToken.markAsUsed();

    // 🆕 Trigger Committee Logic if this feedback is part of a committee
    if (feedbackToken.applicationCommitteeId) {
      try {
        console.log(`[FeedbackSubmit] Triggering Committee Logic for ${feedbackToken.applicationCommitteeId}`);
        await feedbackOrchestratorService.processFeedbackSubmission(
          feedbackToken._id,
          {
            recommendation,
            score: overallScore,
            notes: technicalNotes
          }
        );
      } catch (err) {
        console.error("Failed to process committee feedback:", err);
        // Don't fail the request, just log
      }
    }

    // Create timeline entry
    await Timeline.create({
      applicationId,
      action: "manager_feedback_received",
      status: application.status,
      notes: `تم استلام تقييم من ${feedbackToken.managerName} (${feedbackToken.managerRole})`,
      details: {
        managerName: feedbackToken.managerName,
        managerRole: feedbackToken.managerRole,
        recommendation,
        score: overallScore
      },
      performedByName: feedbackToken.managerName,
      performedBy: null // No user ID since this is external
    });

    console.log(`[FeedbackSubmit] Success.`);

    return NextResponse.json({
      message: "تم إرسال التقييم بنجاح",
      success: true
    });
  } catch (error) {
    console.error("Feedback submission error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في إرسال التقييم" },
      { status: 500 }
    );
  }
}