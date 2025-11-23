// src\app\api\feedback\verify\[token]\route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import FeedbackToken from "@/models/FeedbackToken";

/**
 * Verify feedback token
 * Public endpoint - no auth required
 */
export async function GET(request, { params }) {
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

    // Verify token
    const result = await FeedbackToken.verifyToken(token);

    if (!result.valid) {
      let errorMessage = "رابط غير صالح أو منتهي الصلاحية";
      
      if (result.reason === "invalid_or_expired") {
        errorMessage = "هذا الرابط غير صالح أو منتهي الصلاحية";
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    const feedbackToken = result.token;

    // Check if feedback already submitted
    if (feedbackToken.feedbackSubmitted) {
      return NextResponse.json(
        { error: "تم إرسال التقييم مسبقاً" },
        { status: 400 }
      );
    }

    // Return token data with application info
    return NextResponse.json({
      token: {
        _id: feedbackToken._id,
        managerName: feedbackToken.managerName,
        managerEmail: feedbackToken.managerEmail,
        managerRole: feedbackToken.managerRole,
        expiresAt: feedbackToken.expiresAt,
        accessCount: feedbackToken.accessCount
      },
      application: {
        _id: feedbackToken.applicationId._id,
        name: feedbackToken.applicationId.name,
        email: feedbackToken.applicationId.email,
        phone: feedbackToken.applicationId.phone,
        city: feedbackToken.applicationId.city,
        status: feedbackToken.applicationId.status,
        cv: feedbackToken.applicationId.cv,
        jobId: {
          _id: feedbackToken.applicationId.jobId._id,
          title: feedbackToken.applicationId.jobId.title,
          location: feedbackToken.applicationId.jobId.location,
          category: feedbackToken.applicationId.jobId.category
        }
      }
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في التحقق من الرابط" },
      { status: 500 }
    );
  }
}