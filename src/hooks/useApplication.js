// src/hooks/useApplication.js
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import * as applicationService from "@/services/applicationService";
import * as validationService from "@/services/validationService";

export const useApplication = (applicationId) => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    status: "",
    hrNotes: "",
    technicalNotes: "",
    finalFeedback: "",
    interviewDate: "",
    interviewTime: "",
    interviewType: "in_person",
    interviewLocation: "",
    interviewNotes: "",
    interviewFeedback: "",
    interviewScore: "",
    strengths: "",
    weaknesses: "",
    rejectionReason: ""
  });

  // ==================== DATA OPERATIONS ====================
  const fetchApplication = async () => {
    try {
      setLoading(true);
      const data = await applicationService.fetchApplication(applicationId);
      // API returns { application, timeline } (compatibility shim). We expect application.timeline included.
      const app = data.application || data;
      setApplication(app);
      initializeFormData(app);
    } catch (error) {
      toast.error("فشل في تحميل بيانات الطلب");
    } finally {
      setLoading(false);
    }
  };

  const initializeFormData = (data) => {
    setFormData({
      status: data.status || "",
      hrNotes: data.hrNotes || "",
      technicalNotes: data.technicalNotes || "",
      finalFeedback: data.finalFeedback || "",
      interviewDate: data.interviewDate ? new Date(data.interviewDate).toISOString().split("T")[0] : "",
      interviewTime: data.interviewTime || "",
      interviewType: data.interviewType || "in_person",
      // Pre-fill location with meeting link if it works online
      interviewLocation: (data.interviewType === "online" && data.meetingLink)
        ? data.meetingLink
        : (data.interviewLocation || ""),
      interviewNotes: data.interviewNotes || "",
      interviewFeedback: data.interviewFeedback || "",
      interviewScore: data.interviewScore || "",
      strengths: data.strengths?.join(', ') || "",
      weaknesses: data.weaknesses?.join(', ') || "",
      rejectionReason: data.rejectionReason || ""
    });
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // executeUpdate: buildUpdateFn(application, formData) => updateData
  const executeUpdate = async (buildUpdateFn, successMessage) => {
    try {
      setSaving(true);
      const updateData = buildUpdateFn(application, formData);
      console.log("Sending update:", JSON.stringify(updateData, null, 2));

      const result = await applicationService.updateApplication(applicationId, updateData);

      toast.success(successMessage);
      setEditing(false);

      // refresh local data
      await fetchApplication();
      return result;
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "فشل التحديث");
      throw error;
    } finally {
      setSaving(false);
    }
  };

  // ==================== ACTION HANDLERS ====================
  const handleStatusChange = async (newStatus) => {
    const updatedFormData = { ...formData, status: newStatus };

    const validation = validationService.validateStatusChange(application, updatedFormData);
    if (!validation.isValid) {
      toast.error(validation.errors[0]);
      return;
    }

    await executeUpdate(
      (app) => applicationService.buildStatusChangeUpdate(app, updatedFormData),
      "تم تغيير الحالة بنجاح"
    );
  };

  const scheduleInterview = async () => {
    const validation = validationService.validateInterviewSchedule(formData);
    if (!validation.isValid) {
      toast.error(validation.errors[0]);
      return;
    }
    await executeUpdate(
      (app) => applicationService.buildScheduleInterviewUpdate(app, formData),
      "تم جدولة المقابلة بنجاح"
    );
  };

  const rescheduleInterview = async () => {
    const validation = validationService.validateInterviewReschedule(application, formData);
    if (!validation.isValid) {
      toast.error(validation.errors[0]);
      return;
    }
    await executeUpdate(
      (app) => applicationService.buildRescheduleInterviewUpdate(app, formData),
      "تم إعادة جدولة المقابلة بنجاح"
    );
  };

  const saveNotes = async () => {
    const validation = validationService.validateNotes(application, formData);
    if (!validation.isValid) {
      toast.error(validation.errors[0]);
      return;
    }
    await executeUpdate(
      (app) => applicationService.buildNotesUpdate(app, formData),
      "تم حفظ الملاحظات بنجاح"
    );
  };

  const saveFeedback = async () => {
    const validation = validationService.validateFeedback(application, formData);
    if (!validation.isValid) {
      toast.error(validation.errors[0]);
      return;
    }
    await executeUpdate(
      (app) => applicationService.buildFeedbackUpdate(app, formData),
      "تم حفظ التقييم بنجاح"
    );
  };

  const saveScore = async () => {
    const validation = validationService.validateScore(formData);
    if (!validation.isValid) {
      toast.error(validation.errors[0]);
      return;
    }
    await executeUpdate(
      (app) => applicationService.buildScoreUpdate(app, formData),
      "تم حفظ النتيجة بنجاح"
    );
  };

  const completeInterview = async () => {
    const validation = validationService.validateCompleteInterview(formData);
    if (!validation.isValid) {
      toast.error(validation.errors[0]);
      return;
    }
    await executeUpdate(
      (app) => applicationService.buildCompleteInterviewUpdate(app, formData),
      "تم تحديد المقابلة كمكتملة"
    );
  };

  // ==================== LIFECYCLE ====================
  useEffect(() => {
    if (applicationId) fetchApplication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationId]);

  return {
    application,
    loading,
    editing,
    saving,
    formData,
    fetchApplication,
    handleFormChange,
    handleEditToggle: () => setEditing(!editing),
    handleStatusChange,
    scheduleInterview,
    rescheduleInterview,
    saveNotes,
    saveFeedback,
    saveScore,
    completeInterview
  };
};
