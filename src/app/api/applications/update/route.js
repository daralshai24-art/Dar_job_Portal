import { updateApplication } from "@/services/applicationService";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import { meetingService } from "@/services/meeting/MeetingService";

export async function PUT(req) {
  await connectDB();
  const body = await req.json();

  const { applicationId, updateData } = body;
  const userId = req.headers.get("x-user-id"); // from auth session

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // CHECKPOINT 1: Intercept Meeting Scheduling
  // If status is "interview_scheduled" and type is "online", generate meeting link
  if (updateData.status === "interview_scheduled" && updateData.interviewType === "online") {
    // Only create if not already exists (or maybe always create new for now?)
    // For simplicity, we create a new one.
    const meetingDetails = {
      subject: "Job Interview", // Ideally get job title if possible, but keep simple
      startTime: updateData.interviewDate + "T" + updateData.interviewTime, // Rough construct
      description: "Online Interview via Job Portal"
    };

    const meetingResult = await meetingService.createMeeting(meetingDetails);

    if (meetingResult) {
      updateData.meetingLink = meetingResult.meetingLink;
      updateData.meetingId = meetingResult.meetingId;
      updateData.meetingProvider = meetingResult.provider;
    }
  }

  // CHECKPOINT 2: Intercept Meeting Rescheduling
  // If rescheduling an existing online interview
  if (updateData.action === "interview_rescheduled" && updateData.interviewType === "online") {
    // Ideally we update the old meeting if we had the ID, or create new
    // For now, let's treat it as creating a new one to be safe and simple
    const meetingDetails = {
      subject: "Rescheduled Job Interview",
      startTime: updateData.interviewDate + "T" + updateData.interviewTime,
      description: "Rescheduled Online Interview"
    };

    const meetingResult = await meetingService.createMeeting(meetingDetails);

    if (meetingResult) {
      updateData.meetingLink = meetingResult.meetingLink;
      updateData.meetingId = meetingResult.meetingId;
      updateData.meetingProvider = meetingResult.provider;
    }
  }

  // FIX: updateApplication signature is (id, data), userId is handled by session/headers in the called API
  const result = await updateApplication(applicationId, updateData);
  return NextResponse.json(result);
}
