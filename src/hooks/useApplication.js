//src/hooks/useApplication.js
// ==================== CLEAN HOOK - ONLY UI LOGIC ====================
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
      setApplication(data);
      initializeFormData(data);
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
      interviewDate: data.interviewDate ? new Date(data.interviewDate).toISOString().split('T')[0] : "",
      interviewTime: data.interviewTime || "",
      interviewType: data.interviewType || "in_person",
      interviewLocation: data.interviewLocation || "",
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

  const executeUpdate = async (buildUpdateFn, successMessage) => {
    try {
      setSaving(true);
      const updateData = buildUpdateFn(application, formData);
      await applicationService.updateApplication(applicationId, updateData);
      toast.success(successMessage);
      setEditing(false);
      await fetchApplication();
    } catch (error) {
      console.error("Error:", error);
      toast.error("فشل في التحديث");
    } finally {
      setSaving(false);
    }
  };

  // ==================== ACTION HANDLERS ====================

  const handleStatusChange = async (newStatus) => {
    // Create updated form data with new status
    const updatedFormData = { ...formData, status: newStatus };
    
    const validation = validationService.validateStatusChange(application, updatedFormData);
    if (!validation.isValid) {
      toast.error(validation.errors[0]);
      return;
    }
    
    // Pass the updated form data to the build function
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
      applicationService.buildScheduleInterviewUpdate,
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
      applicationService.buildRescheduleInterviewUpdate,
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
      applicationService.buildNotesUpdate,
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
      applicationService.buildFeedbackUpdate,
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
      applicationService.buildScoreUpdate,
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
      applicationService.buildCompleteInterviewUpdate,
      "تم تحديد المقابلة كمكتملة"
    );
  };

  // ==================== LIFECYCLE ====================

  useEffect(() => {
    if (applicationId) fetchApplication();
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