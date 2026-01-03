// src/app/api/applications/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/apiAuth";
import Application from "@/models/Application";
import Timeline from "@/models/Timeline";
import { updateApplicationServer } from "@/services/serverApplicationService";
import { meetingService } from "@/services/meeting/MeetingService";
// Ensure models are registered for population
import "@/models/Category";
import "@/models/Job";
import "@/models/Committee";
import "@/models/ApplicationCommittee";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // 🔒 Security Check
    const { getServerSession } = await import("next-auth");
    const { authOptions } = await import("@/lib/auth.config");
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid application id" },
        { status: 400 }
      );
    }

    // Populate jobId and category
    const application = await Application.findById(id)
      .populate({
        path: "jobId",
        select: "title location category createdAt department", // Include department
        populate: { path: "category", select: "name" },
      })
      .populate({
        path: "applicationCommitteeId",
        select: "committeeId status votingResults",
        populate: {
          path: "committeeId",
          select: "name"
        }
      })
      .lean();

    if (!application) {
      return NextResponse.json(
        { error: "طلب التوظيف غير موجود" },
        { status: 404 }
      );
    }

    // 👷 Department Manager Guard (Flow 11)
    if (session.user.role === "department_manager") {
      const jobDept = application.jobId?.department;
      const userDept = session.user.department;
      if (!jobDept || jobDept !== userDept) {
        return NextResponse.json(
          { error: "ليس لديك صلاحية لعرض هذا الطلب" },
          { status: 403 }
        );
      }
    }

    const timeline = await Timeline.find({ applicationId: id })
      .populate("performedBy", "name email")
      .sort({ createdAt: -1 })
      .lean();

    const responseApp = { ...application, timeline };
    return NextResponse.json({ application: responseApp, timeline });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب بيانات الطلب" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid application id" },
        { status: 400 }
      );
    }


    const updateData = await request.json();

    // Fetch existing application to get name for Calendar Event
    const existingApp = await Application.findById(id).select("name meetingId meetingProvider meetingLink").lean();
    if (!existingApp) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }
    const applicantName = existingApp.name;
    const { meetingId: existingMeetingId, meetingProvider: existingProvider } = existingApp;

    // Logic: If user provided a link manually in 'interviewLocation', use it.
    // Otherwise, generate one using Jitsi.

    const isScheduling = updateData.status === "interview_scheduled";
    const isRescheduling = updateData.action === "interview_rescheduled";

    const isOnline = updateData.interviewType === "online";
    const isInPerson = updateData.interviewType === "in_person";

    // We only care if meaningful status change happens OR it's an explicit reschedule action
    if ((isScheduling || isRescheduling) && (isOnline || isInPerson)) {
      console.log("--- MEETING GENERATION START ---");
      console.log("Action:", updateData.action);
      console.log("Type:", updateData.interviewType);

      const manualLink = updateData.interviewLocation;
      const hasManualLink = manualLink && (manualLink.includes("http") || manualLink.includes("www"));
      const isSameAsExisting = manualLink === existingApp.meetingLink;

      // Only treat as manual override if the user actually CHANGED the link.
      // If it's the same link we pre-filled, we should regenerate the meeting (to update Calendar).
      if (hasManualLink && !isSameAsExisting) {
        console.log("Using manual meeting link:", manualLink);
        updateData.meetingLink = manualLink;
        updateData.meetingId = "manual-" + Date.now();
        updateData.meetingProvider = "manual";
      } else {
        const subject = isRescheduling
          ? `مقابلة توظيف: ${applicantName} (معاد جدولتها)`
          : `مقابلة توظيف: ${applicantName}`;

        const meetingDetails = {
          subject: subject,
          startTime: updateData.interviewDate + "T" + updateData.interviewTime,
          description: isOnline ? "Online Interview via Job Portal" : `In-Person Interview at ${updateData.interviewLocation || "Location TBD"}`,
          location: updateData.interviewLocation, // Pass location directly
          isOnline: isOnline // Pass explicit flag
        };

        console.log("Meeting Details:", meetingDetails);

        let meetingResult = null;

        // 1. If Rescheduling, DELETE the old meeting first
        if (isRescheduling && existingMeetingId) {
          console.log("Rescheduling: Deleting old meeting first:", existingMeetingId);
          await meetingService.deleteMeeting(existingMeetingId);
        }

        // 2. CREATE new meeting
        console.log("Calling meetingService.createMeeting...");
        meetingResult = await meetingService.createMeeting(meetingDetails);
        console.log("Meeting Result:", JSON.stringify(meetingResult, null, 2));

        if (meetingResult) {
          updateData.meetingLink = meetingResult.meetingLink || existingApp.meetingLink;
          updateData.meetingId = meetingResult.meetingId;
          updateData.meetingProvider = meetingResult.provider;
          updateData.interviewLocation = updateData.meetingLink;
          console.log("Meeting Link Assigned:", updateData.meetingLink);
        } else {
          console.error("❌ CRITICAL: createMeeting returned null/false!");
        }
      }
    } else {
      console.log("--- SKIPPING MEETING GENERATION ---");
      console.log("isScheduling:", isScheduling);
      console.log("isRescheduling:", isRescheduling);
      console.log("interviewType:", updateData.interviewType);
    }
    // ==================== END MEETING GENERATION ====================

    let currentUser = null;
    try {
      currentUser = await getAuthUser(request);
    } catch (err) {
      console.warn("Auth not available:", err?.message || err);
    }

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { application, timelineEntry } = await updateApplicationServer({
      applicationId: id,
      user: {
        id: currentUser.id || currentUser._id,
        name: currentUser.name,
        email: currentUser.email,
      },
      updateData,
    });

    // Populate jobId and category again for updated app
    const updatedApp = await Application.findById(application._id)
      .populate({
        path: "jobId",
        select: "title location category createdAt",
        populate: { path: "category", select: "name" },
      })
      .populate({
        path: "applicationCommitteeId",
        select: "committeeId status votingResults",
        populate: {
          path: "committeeId",
          select: "name"
        }
      })
      .lean();

    const timeline = await Timeline.find({ applicationId: id })
      .populate("performedBy", "name email")
      .sort({ createdAt: -1 })
      .lean();

    const responseApp = { ...updatedApp, timeline };

    return NextResponse.json({
      message: "تم تحديث الطلب بنجاح",
      application: responseApp,
      timelineEntry,
    });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في تحديث الطلب" },
      { status: 500 }
    );
  }
}
