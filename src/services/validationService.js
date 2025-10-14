//src/services/validationService.js
// ==================== VALIDATION LAYER ====================

export const validateStatusChange = (application, formData) => {
  const errors = [];

  if (formData.status === application.status) {
    errors.push("الحالة لم تتغير");
  }

  if (formData.status === 'rejected' && !formData.rejectionReason?.trim()) {
    errors.push("يرجى إدخال سبب الرفض");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateInterviewSchedule = (formData) => {
  const errors = [];

  if (!formData.interviewDate) {
    errors.push("يرجى تحديد تاريخ المقابلة");
  }

  if (!formData.interviewTime) {
    errors.push("يرجى تحديد وقت المقابلة");
  }

  // Optional: Validate date is not in the past
  if (formData.interviewDate) {
    const interviewDate = new Date(formData.interviewDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (interviewDate < today) {
      errors.push("لا يمكن جدولة مقابلة في الماضي");
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateInterviewReschedule = (application, formData) => {
  const errors = [];

  if (!formData.interviewDate || !formData.interviewTime) {
    errors.push("يرجى تحديد تاريخ ووقت المقابلة الجديد");
  }

  const dateChanged = application.interviewDate !== formData.interviewDate;
  const timeChanged = application.interviewTime !== formData.interviewTime;

  if (!dateChanged && !timeChanged) {
    errors.push("لم يتم تغيير موعد المقابلة");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateNotes = (application, formData) => {
  const errors = [];

  const hasChanges = ['hrNotes', 'technicalNotes', 'interviewNotes']
    .some(key => application[key] !== formData[key] && formData[key]);

  if (!hasChanges) {
    errors.push("لم يتم إجراء أي تغييرات على الملاحظات");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateFeedback = (application, formData) => {
  const errors = [];

  const hasChanges = ['interviewFeedback', 'finalFeedback']
    .some(key => application[key] !== formData[key] && formData[key]);

  if (!hasChanges) {
    errors.push("لم يتم إجراء أي تغييرات على التقييم");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateScore = (formData) => {
  const errors = [];

  if (!formData.interviewScore) {
    errors.push("يرجى إدخال نتيجة المقابلة");
  }

  const score = parseInt(formData.interviewScore);
  if (score < 1 || score > 10) {
    errors.push("النتيجة يجب أن تكون بين 1 و 10");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateCompleteInterview = (formData) => {
  const errors = [];

  if (!formData.interviewFeedback?.trim()) {
    errors.push("يرجى إضافة تقييم المقابلة قبل اكتمالها");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};