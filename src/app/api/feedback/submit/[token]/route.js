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

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    // Get feedback data
    const body = await request.json();
    const { technicalNotes, strengths, weaknesses, recommendation, overallScore } = body;

    if (!technicalNotes || !technicalNotes.trim()) {
      return NextResponse.json(
        { error: "الملاحظات الفنية مطلوبة" },
        { status: 400 }
      );
    }

    // Verify token
    const result = await FeedbackToken.verifyToken(token);

    if (!result.valid) {
      return NextResponse.json(
        { error: "رابط غير صالح أو منتهي الصلاحية" },
        { status: 400 }
      );
    }

    const feedbackToken = result.token;

    // Check if already submitted
    if (feedbackToken.feedbackSubmitted) {
      return NextResponse.json(
        { error: "تم إرسال التقييم مسبقاً" },
        { status: 400 }
      );
    }

    const applicationId = feedbackToken.applicationId._id;

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

    // Update application based on manager role
    if (feedbackToken.managerRole === "technical_reviewer") {
      application.technicalNotes = technicalNotes;

      // Store full feedback in a new field (we'll add this to schema)
      if (!application.managerFeedbacks) {
        application.managerFeedbacks = [];
      }
      application.managerFeedbacks.push(feedbackData);
    } else if (feedbackToken.managerRole === "hr_reviewer") {
      application.hrNotes = technicalNotes;

      if (!application.managerFeedbacks) {
        application.managerFeedbacks = [];
      }
      application.managerFeedbacks.push(feedbackData);
    } else {
      // For other roles, just add to feedbacks array
      if (!application.managerFeedbacks) {
        application.managerFeedbacks = [];
      }
      application.managerFeedbacks.push(feedbackData);
    }

    // Update strengths and weaknesses if provided
    if (strengths) {
      const strengthsList = strengths.split('\n').filter(s => s.trim());
      if (strengthsList.length > 0) {
        application.strengths = [...(application.strengths || []), ...strengthsList];
      }
    }

    if (weaknesses) {
      const weaknessesList = weaknesses.split('\n').filter(w => w.trim());
      if (weaknessesList.length > 0) {
        application.weaknesses = [...(application.weaknesses || []), ...weaknessesList];
      }
    }

    // Save application
    await application.save();

    // Mark token as used
    await feedbackToken.markAsUsed();

    // 🆕 Trigger Committee Logic if this feedback is part of a committee
    if (feedbackToken.applicationCommitteeId) {
      try {
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