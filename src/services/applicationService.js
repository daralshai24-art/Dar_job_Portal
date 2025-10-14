//src/services/applicationService.js
// ==================== SERVICE LAYER ====================
// All business logic and API calls are here

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

// ==================== UTILITIES ====================

export const getStatusText = (status) => STATUS_MAP[status] || status;

export const getCurrentUser = () => {
  // TODO: Replace with actual user from auth context
  return "HR";
};

export const createTimelineEvent = (action, status, notes, changes = []) => ({
  action,
  status,
  notes,
  performedBy: getCurrentUser(),
  date: new Date(),
  changes
});

export const detectChanges = (original, updated, fields) => {
  const changes = [];
  
  fields.forEach(({ key, label }) => {
    const originalValue = original[key];
    const updatedValue = updated[key];
    
    if (originalValue === updatedValue || !updatedValue) return;
    
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
  if (!response.ok) throw new Error("Failed to update application");
  return await response.json();
};

// ==================== ACTION BUILDERS ====================

export const buildStatusChangeUpdate = (application, formData) => {
  const changes = [{
    field: 'status',
    from: application.status,
    to: formData.status,
    label: 'الحالة'
  }];

  if (formData.status === 'rejected' && formData.rejectionReason) {
    changes.push({
      field: 'rejectionReason',
      from: application.rejectionReason || '',
      to: formData.rejectionReason,
      label: 'سبب الرفض'
    });
  }

  const actionType = formData.status === 'rejected' ? ACTION_TYPES.REJECTED :
                    formData.status === 'hired' ? ACTION_TYPES.HIRED :
                    ACTION_TYPES.STATUS_CHANGED;

  const timelineEvent = createTimelineEvent(
    actionType,
    formData.status,
    `تم تغيير الحالة من "${getStatusText(application.status)}" إلى "${getStatusText(formData.status)}"`,
    changes
  );

  return {
    status: formData.status,
    ...(formData.status === 'rejected' && { rejectionReason: formData.rejectionReason }),
    timeline: [...(application.timeline || []), timelineEvent]
  };
};

export const buildScheduleInterviewUpdate = (application, formData) => {
  const interviewTypeText = 
    formData.interviewType === 'online' ? 'أونلاين' :
    formData.interviewType === 'phone' ? 'هاتفية' : 'شخصية';

  const changes = [
    { field: 'interviewDate', to: formData.interviewDate, label: 'تاريخ المقابلة' },
    { field: 'interviewTime', to: formData.interviewTime, label: 'وقت المقابلة' },
    { field: 'interviewType', to: formData.interviewType, label: 'نوع المقابلة' }
  ];

  if (formData.interviewLocation) {
    changes.push({
      field: 'interviewLocation',
      to: formData.interviewLocation,
      label: formData.interviewType === 'online' ? 'رابط المقابلة' : 'موقع المقابلة'
    });
  }

  const timelineEvent = createTimelineEvent(
    ACTION_TYPES.INTERVIEW_SCHEDULED,
    "interview_scheduled",
    `تم جدولة مقابلة ${interviewTypeText} في ${formData.interviewDate} الساعة ${formData.interviewTime}`,
    changes
  );

  return {
    status: "interview_scheduled",
    interviewDate: formData.interviewDate,
    interviewTime: formData.interviewTime,
    interviewType: formData.interviewType,
    interviewLocation: formData.interviewLocation,
    interviewNotes: formData.interviewNotes,
    timeline: [...(application.timeline || []), timelineEvent]
  };
};

export const buildRescheduleInterviewUpdate = (application, formData) => {
  const changes = [];
  
  if (application.interviewDate !== formData.interviewDate) {
    changes.push({
      field: 'interviewDate',
      from: application.interviewDate,
      to: formData.interviewDate,
      label: 'تاريخ المقابلة'
    });
  }
  
  if (application.interviewTime !== formData.interviewTime) {
    changes.push({
      field: 'interviewTime',
      from: application.interviewTime,
      to: formData.interviewTime,
      label: 'وقت المقابلة'
    });
  }

  const timelineEvent = createTimelineEvent(
    ACTION_TYPES.INTERVIEW_RESCHEDULED,
    application.status,
    `تم إعادة جدولة المقابلة من ${application.interviewDate} ${application.interviewTime} إلى ${formData.interviewDate} ${formData.interviewTime}`,
    changes
  );

  return {
    interviewDate: formData.interviewDate,
    interviewTime: formData.interviewTime,
    interviewType: formData.interviewType,
    interviewLocation: formData.interviewLocation,
    timeline: [...(application.timeline || []), timelineEvent]
  };
};

export const buildNotesUpdate = (application, formData) => {
  const noteFields = [
    { key: 'hrNotes', label: 'ملاحظات HR' },
    { key: 'technicalNotes', label: 'ملاحظات تقنية' },
    { key: 'interviewNotes', label: 'ملاحظات المقابلة' }
  ];

  const changes = detectChanges(application, formData, noteFields);
  const isUpdate = changes.some(c => application[c.field]);
  const actionType = isUpdate ? ACTION_TYPES.NOTES_UPDATED : ACTION_TYPES.NOTES_ADDED;

  const timelineEvent = createTimelineEvent(
    actionType,
    application.status,
    `تم ${isUpdate ? 'تحديث' : 'إضافة'} الملاحظات`,
    changes
  );

  return {
    hrNotes: formData.hrNotes,
    technicalNotes: formData.technicalNotes,
    interviewNotes: formData.interviewNotes,
    timeline: [...(application.timeline || []), timelineEvent]
  };
};

export const buildFeedbackUpdate = (application, formData) => {
  const feedbackFields = [
    { key: 'interviewFeedback', label: 'تقييم المقابلة' },
    { key: 'finalFeedback', label: 'التقييم النهائي' }
  ];

  const changes = detectChanges(application, formData, feedbackFields);
  const isUpdate = changes.some(c => application[c.field]);
  const actionType = isUpdate ? ACTION_TYPES.FEEDBACK_UPDATED : ACTION_TYPES.FEEDBACK_ADDED;

  const timelineEvent = createTimelineEvent(
    actionType,
    application.status,
    `تم ${isUpdate ? 'تحديث' : 'إضافة'} التقييم`,
    changes
  );

  return {
    interviewFeedback: formData.interviewFeedback,
    finalFeedback: formData.finalFeedback,
    timeline: [...(application.timeline || []), timelineEvent]
  };
};

export const buildScoreUpdate = (application, formData) => {
  const scoreFields = [
    { key: 'interviewScore', label: 'نتيجة المقابلة' },
    { key: 'strengths', label: 'نقاط القوة' },
    { key: 'weaknesses', label: 'نقاط الضعف' }
  ];

  const changes = detectChanges(application, formData, scoreFields);
  const isUpdate = application.interviewScore !== null && application.interviewScore !== undefined;
  const actionType = isUpdate ? ACTION_TYPES.SCORE_UPDATED : ACTION_TYPES.SCORE_ADDED;

  const timelineEvent = createTimelineEvent(
    actionType,
    application.status,
    `تم ${isUpdate ? 'تحديث' : 'إضافة'} نتيجة المقابلة: ${formData.interviewScore}/10`,
    changes
  );

  return {
    interviewScore: formData.interviewScore,
    strengths: formData.strengths.split(',').map(s => s.trim()).filter(s => s),
    weaknesses: formData.weaknesses.split(',').map(w => w.trim()).filter(w => w),
    timeline: [...(application.timeline || []), timelineEvent]
  };
};

export const buildCompleteInterviewUpdate = (application, formData) => {
  const changes = [
    { field: 'status', from: application.status, to: 'interview_completed', label: 'الحالة' },
    { field: 'interviewFeedback', to: formData.interviewFeedback, label: 'تقييم المقابلة' }
  ];

  if (formData.interviewScore) {
    changes.push({
      field: 'interviewScore',
      to: formData.interviewScore,
      label: 'نتيجة المقابلة'
    });
  }

  const timelineEvent = createTimelineEvent(
    ACTION_TYPES.INTERVIEW_COMPLETED,
    "interview_completed",
    `تم إكمال المقابلة بنجاح`,
    changes
  );

  return {
    status: "interview_completed",
    interviewFeedback: formData.interviewFeedback,
    ...(formData.interviewScore && { interviewScore: formData.interviewScore }),
    timeline: [...(application.timeline || []), timelineEvent]
  };
};