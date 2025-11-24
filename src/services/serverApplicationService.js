// src/services/serverApplicationService.js (SAFE UPDATE - Won't Break Anything)
import Application from "@/models/Application";
import { createTimelineEntry } from "@/services/timelineService";

// 🆕 ONLY import if emailService exists, otherwise skip
let emailService = null;
try {
  emailService = require("@/services/email").default;
} catch (e) {
  console.log("Email service not available yet - emails will be skipped");
}

/**
 * updateApplicationServer
 * - applicationId: string
 * - user: { id/_id, name, email }
 * - updateData: partial object to set on Application
 *
 * Returns: { application, timelineEntry }
 */
export async function updateApplicationServer({ applicationId, user, updateData }) {
  if (!applicationId) throw new Error("applicationId required");

  const application = await Application.findById(applicationId);
  if (!application) throw new Error("Application not found");

  // defensive: remove client-sent timeline if present
  if (updateData.timeline) delete updateData.timeline;

  // 🆕 Store previous state for email logic (before changes)
  const previousStatus = application.status;
  const previousInterviewDate = application.interviewDate;
  const previousInterviewTime = application.interviewTime;
  const hadInterview = !!(previousInterviewDate && previousInterviewTime);

  // detect changes
  const changes = [];
  const pushChange = (field, label, normalize) => {
    if (!Object.prototype.hasOwnProperty.call(updateData, field)) return;
    const oldVal = application[field];
    const newVal = updateData[field];
    const oldN = normalize ? normalize(oldVal) : oldVal;
    const newN = normalize ? normalize(newVal) : newVal;
    if (oldN !== newN) changes.push({ field, from: oldN, to: newN, label });
  };
  const normalizeDate = (v) => (v ? new Date(v).toISOString().split("T")[0] : v);

  pushChange("interviewDate", "تاريخ المقابلة", normalizeDate);
  pushChange("interviewTime", "وقت المقابلة");
  pushChange("interviewType", "نوع المقابلة");
  pushChange("interviewLocation", "مكان المقابلة");
  pushChange("status", "الحالة");
  pushChange("rejectionReason", "سبب الرفض");

  // determine action
  let action = updateData.action || "updated";
  if (changes.length > 0 && application.interviewDate) action = "interview_rescheduled";
  if (updateData.interviewDate && !application.interviewDate) action = "interview_scheduled";
  if (updateData.status === "rejected") action = "rejected";
  if (updateData.status === "hired") action = "hired";
  if (updateData.status === "interview_completed") action = "interview_completed";

  // build notes (prefer client-sent notes)
  const notes = updateData.notes ||
    (action === "interview_scheduled"
      ? `تم جدولة مقابلة في ${updateData.interviewDate || "غير محدد"} الساعة ${updateData.interviewTime || "غير محدد"}`
      : action === "interview_rescheduled" && changes.length > 0
        ? `تم تحديث تفاصيل المقابلة: ${changes.map(c => `${c.label} من ${c.from || "غير محدد"} إلى ${c.to || "غير محدد"}`).join("، ")}`
        : updateData.rejectionReason || updateData.finalFeedback || updateData.hrNotes || ""
    );

  // apply updates
  Object.keys(updateData).forEach((key) => {
    application[key] = updateData[key];
  });

  await application.save();

  // create timeline entry in Timeline collection
  const timelineEntry = await createTimelineEntry({
    applicationId: application._id,
    performedBy: user?.id || user?._id || null,
    performedByName: user?.name || user?.email || "System",
    action,
    status: updateData.status || application.status,
    notes,
    changes,
    details: updateData.details || null,
    score: updateData.interviewScore || null
  });

  // ==================== 🆕 EMAIL NOTIFICATION LOGIC ====================
  // This section is OPTIONAL and won't break if emailService doesn't exist
  // Emails are sent asynchronously and failures won't affect the update
  
  if (emailService) {
    try {
      // Populate job details for emails
      const populatedApp = await Application.findById(application._id)
        .populate({
          path: "jobId",
          select: "title location category",
          populate: { path: "category", select: "name" }
        })
        .lean();

      // Prepare application data for emails
      const appData = {
        ...populatedApp,
        _id: populatedApp._id.toString(),
        jobId: populatedApp.jobId ? {
          ...populatedApp.jobId,
          _id: populatedApp.jobId._id.toString()
        } : null
      };

      const userId = user?.id || user?._id;

      // Determine which email to send based on action
      let emailPromise = null;

      // Interview scheduled (first time)
      if (action === "interview_scheduled" && !hadInterview) {
        emailPromise = emailService.sendInterviewScheduled({
          application: appData,
          triggeredBy: userId
        });
      }
      
      // Interview rescheduled
      else if (action === "interview_rescheduled" && hadInterview) {
        emailPromise = emailService.sendInterviewRescheduled({
          application: appData,
          triggeredBy: userId
        });
      }
      
      // Application rejected
      else if (action === "rejected" && previousStatus !== "rejected") {
        emailPromise = emailService.sendApplicationRejected({
          application: appData,
          triggeredBy: userId
        });
      }
      
      // Application accepted/hired
      else if (action === "hired" && previousStatus !== "hired") {
        emailPromise = emailService.sendApplicationAccepted({
          application: appData,
          triggeredBy: userId
        });
      }

      // Send email asynchronously (don't wait for it)
      if (emailPromise) {
        emailPromise
          .then(result => {
            if (result.success) {
              console.log(`✅ Email sent successfully: ${action} to ${appData.email}`);
            } else {
              console.warn(`⚠️ Email failed: ${result.error}`);
            }
          })
          .catch(emailError => {
            console.error("📧 Email error (non-critical):", emailError.message);
          });
      }
    } catch (emailError) {
      // Email errors should never break the application update
      console.error("📧 Email notification error (non-critical):", emailError.message);
    }
  }
  // ==================== END EMAIL LOGIC ====================

  return {
    application: await Application.findById(application._id).lean(),
    timelineEntry: timelineEntry.toObject()
  };
}