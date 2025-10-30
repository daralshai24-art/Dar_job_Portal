// src/services/applicationService.js
// ==================== SERVICE LAYER ====================
// Client side: builds minimal update payloads. Server creates timeline events.

export const ACTION_TYPES = {
  CREATED: "created",
  STATUS_CHANGED: "status_changed",
  INTERVIEW_SCHEDULED: "interview_scheduled",
  INTERVIEW_RESCHEDULED: "interview_rescheduled",
  INTERVIEW_COMPLETED: "interview_completed",
  NOTES_ADDED: "notes_added",
  NOTES_UPDATED: "notes_updated",
  FEEDBACK_ADDED: "feedback_added",
  FEEDBACK_UPDATED: "feedback_updated",
  SCORE_ADDED: "score_added",
  SCORE_UPDATED: "score_updated",
  REJECTED: "rejected",
  HIRED: "hired"
};

export const STATUS_MAP = {
  pending: "قيد المراجعة",
  reviewed: "تم المراجعة",
  interview_scheduled: "مقابلة مجدولة",
  interview_completed: "تمت المقابلة",
  rejected: "مرفوض",
  hired: "مقبول"
};

export const getStatusText = (status) => STATUS_MAP[status] || status;

// NOTE: client-side helper if you want to preview a timeline locally (not persisted)
export const createLocalTimelinePreview = (action, status, notes, changes = []) => ({
  action,
  status,
  notes,
  performedBy: "HR",
  performedByName: "HR",
  date: new Date(),
  changes
});

export const detectChanges = (original, updated, fields) => {
  const changes = [];

  fields.forEach(({ key, label }) => {
    const originalValue = original[key];
    const updatedValue = updated[key];

    // skip if not provided in updated (client is building minimal payload)
    if (updatedValue === undefined || updatedValue === null || updatedValue === "") return;

    if (originalValue === updatedValue) return;

    changes.push({
      field: key,
      from: originalValue,
      to: updatedValue,
      label
    });
  });

  return changes;
};

// ==================== API CALLS ====================
export const fetchApplication = async (applicationId) => {
  const response = await fetch(`/api/applications/${applicationId}`);
  if (!response.ok) throw new Error("Failed to fetch application");
  return await response.json();
};

export const updateApplication = async (applicationId, updateData) => {
  const response = await fetch(`/api/applications/${applicationId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("API Error:", errorData);
    throw new Error(errorData.error || "Failed to update application");
  }
  return await response.json();
};

// ==================== ACTION BUILDERS (CLIENT) ====================
// Each builder returns minimal update payload only (server will create timeline)

export const buildStatusChangeUpdate = (application, formData) => {
  const changes = [
    {
      field: "status",
      from: application.status,
      to: formData.status,
      label: "الحالة",
    },
  ];

  if (formData.status === "rejected" && formData.rejectionReason) {
    changes.push({
      field: "rejectionReason",
      from: application.rejectionReason || "",
      to: formData.rejectionReason,
      label: "سبب الرفض",
    });
  }

  const actionType =
    formData.status === "rejected"
      ? ACTION_TYPES.REJECTED
      : formData.status === "hired"
      ? ACTION_TYPES.HIRED
      : ACTION_TYPES.STATUS_CHANGED;

  const notes = `تم تغيير الحالة من "${getStatusText(application.status)}" إلى "${getStatusText(
    formData.status
  )}"`;

  return {
    // minimal fields to update
    status: formData.status,
    ...(formData.status === "rejected" && { rejectionReason: formData.rejectionReason }),
    // helper metadata for server timeline creation
    action: actionType,
    notes,
  };
};

export const buildScheduleInterviewUpdate = (application, formData) => {
  const interviewTypeText =
    formData.interviewType === "online" ? "أونلاين" : formData.interviewType === "phone" ? "هاتفية" : "شخصية";

  const notes = `تم جدولة مقابلة ${interviewTypeText} في ${formData.interviewDate} الساعة ${formData.interviewTime}`;

  return {
    status: "interview_scheduled",
    interviewDate: formData.interviewDate,
    interviewTime: formData.interviewTime,
    interviewType: formData.interviewType,
    interviewLocation: formData.interviewLocation,
    interviewNotes: formData.interviewNotes,
    action: ACTION_TYPES.INTERVIEW_SCHEDULED,
    notes,
  };
};

export const buildRescheduleInterviewUpdate = (application, formData) => {
  const fromDateText = application.interviewDate || "غير محدد";
  const fromTimeText = application.interviewTime || "غير محدد";
  const notes = `تم إعادة جدولة المقابلة من ${fromDateText} ${fromTimeText} إلى ${formData.interviewDate} ${formData.interviewTime}`;

  return {
    interviewDate: formData.interviewDate,
    interviewTime: formData.interviewTime,
    interviewType: formData.interviewType,
    interviewLocation: formData.interviewLocation,
    action: ACTION_TYPES.INTERVIEW_RESCHEDULED,
    notes,
  };
};

export const buildNotesUpdate = (application, formData) => {
  const noteFields = [
    { key: "hrNotes", label: "ملاحظات HR" },
    { key: "technicalNotes", label: "ملاحظات تقنية" },
    { key: "interviewNotes", label: "ملاحظات المقابلة" },
  ];

  const changes = detectChanges(application, formData, noteFields);
  const isUpdate = changes.some((c) => application[c.field]);
  const actionType = isUpdate ? ACTION_TYPES.NOTES_UPDATED : ACTION_TYPES.NOTES_ADDED;
  const notes = `تم ${isUpdate ? "تحديث" : "إضافة"} الملاحظات`;

  return {
    hrNotes: formData.hrNotes,
    technicalNotes: formData.technicalNotes,
    interviewNotes: formData.interviewNotes,
    action: actionType,
    notes,
  };
};

export const buildFeedbackUpdate = (application, formData) => {
  const feedbackFields = [
    { key: "interviewFeedback", label: "تقييم المقابلة" },
    { key: "finalFeedback", label: "التقييم النهائي" },
  ];

  const changes = detectChanges(application, formData, feedbackFields);
  const isUpdate = changes.some((c) => application[c.field]);
  const actionType = isUpdate ? ACTION_TYPES.FEEDBACK_UPDATED : ACTION_TYPES.FEEDBACK_ADDED;
  const notes = `تم ${isUpdate ? "تحديث" : "إضافة"} التقييم`;

  return {
    interviewFeedback: formData.interviewFeedback,
    finalFeedback: formData.finalFeedback,
    action: actionType,
    notes,
  };
};

export const buildScoreUpdate = (application, formData) => {
  const scoreFields = [
    { key: "interviewScore", label: "نتيجة المقابلة" },
    { key: "strengths", label: "نقاط القوة" },
    { key: "weaknesses", label: "نقاط الضعف" },
  ];

  const changes = detectChanges(application, formData, scoreFields);
  const isUpdate = application.interviewScore !== null && application.interviewScore !== undefined;
  const actionType = isUpdate ? ACTION_TYPES.SCORE_UPDATED : ACTION_TYPES.SCORE_ADDED;
  const notes = `تم ${isUpdate ? "تحديث" : "إضافة"} نتيجة المقابلة: ${formData.interviewScore}/10`;

  return {
    interviewScore: formData.interviewScore,
    strengths: formData.strengths.split(",").map((s) => s.trim()).filter(Boolean),
    weaknesses: formData.weaknesses.split(",").map((w) => w.trim()).filter(Boolean),
    action: actionType,
    notes,
  };
};

export const buildCompleteInterviewUpdate = (application, formData) => {
  const notes = `تم إكمال المقابلة بنجاح`;

  return {
    status: "interview_completed",
    interviewFeedback: formData.interviewFeedback,
    ...(formData.interviewScore && { interviewScore: formData.interviewScore }),
    action: ACTION_TYPES.INTERVIEW_COMPLETED,
    notes,
  };
};
