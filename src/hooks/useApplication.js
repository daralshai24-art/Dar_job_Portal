//src\hooks\useApplication.js
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

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
    weaknesses: ""
  });

  // Status text helper
  const getStatusText = (status) => {
    const statusMap = {
      pending: "قيد المراجعة",
      reviewed: "تم المراجعة", 
      interview_scheduled: "مقابلة مجدولة",
      interview_completed: "تمت المقابلة", 
      rejected: "مرفوض",
      hired: "مقبول"
    };
    return statusMap[status] || status;
  };

  // Fetch application
  const fetchApplication = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/applications/${applicationId}`);
      if (!response.ok) throw new Error("Failed to fetch application");
      const data = await response.json();
      setApplication(data);
      initializeFormData(data);
    } catch (error) {
      toast.error("فشل في تحميل بيانات الطلب");
    } finally {
      setLoading(false);
    }
  };

  // Initialize form data
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
      weaknesses: data.weaknesses?.join(', ') || ""
    });
  };

  // Handle form changes
  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Detect what fields changed
  const detectChanges = (original, updated) => {
    const changes = [];
    
    // Status changes
    if (original.status !== updated.status) {
      changes.push({
        field: 'status',
        from: original.status,
        to: updated.status,
        label: 'الحالة'
      });
    }
    
    // HR Notes changes
    if (original.hrNotes !== updated.hrNotes && updated.hrNotes) {
      changes.push({
        field: 'hrNotes', 
        from: original.hrNotes,
        to: updated.hrNotes,
        label: 'ملاحظات HR'
      });
    }
    
    // Technical Notes changes
    if (original.technicalNotes !== updated.technicalNotes && updated.technicalNotes) {
      changes.push({
        field: 'technicalNotes',
        from: original.technicalNotes, 
        to: updated.technicalNotes,
        label: 'ملاحظات تقنية'
      });
    }
    
    // Interview Feedback changes
    if (original.interviewFeedback !== updated.interviewFeedback && updated.interviewFeedback) {
      changes.push({
        field: 'interviewFeedback',
        from: original.interviewFeedback,
        to: updated.interviewFeedback, 
        label: 'تقييم المقابلة'
      });
    }
    
    // Final Feedback changes
    if (original.finalFeedback !== updated.finalFeedback && updated.finalFeedback) {
      changes.push({
        field: 'finalFeedback',
        from: original.finalFeedback,
        to: updated.finalFeedback,
        label: 'التقييم النهائي'
      });
    }
    
    // Interview Score changes
    if (original.interviewScore !== updated.interviewScore && updated.interviewScore) {
      changes.push({
        field: 'interviewScore',
        from: original.interviewScore,
        to: updated.interviewScore,
        label: 'نتيجة المقابلة'
      });
    }

    // Interview details changes
    if (original.interviewDate !== updated.interviewDate && updated.interviewDate) {
      changes.push({
        field: 'interviewDate',
        from: original.interviewDate,
        to: updated.interviewDate,
        label: 'تاريخ المقابلة'
      });
    }

    if (original.interviewTime !== updated.interviewTime && updated.interviewTime) {
      changes.push({
        field: 'interviewTime',
        from: original.interviewTime,
        to: updated.interviewTime,
        label: 'وقت المقابلة'
      });
    }

    return changes;
  };

  // Generate detailed update notes
  const generateUpdateNotes = (changes) => {
    if (changes.length === 0) {
      return "تم تحديث البيانات بدون تغييرات محددة";
    }
    
    const changeDescriptions = changes.map(change => {
      switch (change.field) {
        case 'status':
          return `تغيير الحالة من "${getStatusText(change.from)}" إلى "${getStatusText(change.to)}"`;
        case 'hrNotes':
          return `إضافة/تعديل ملاحظات HR`;
        case 'technicalNotes':
          return `إضافة/تعديل ملاحظات تقنية`;
        case 'interviewFeedback':
          return `إضافة/تعديل تقييم المقابلة`;
        case 'finalFeedback':
          return `إضافة/تعديل التقييم النهائي`;
        case 'interviewScore':
          return `تغيير نتيجة المقابلة من ${change.from || 'غير محدد'} إلى ${change.to}`;
        case 'interviewDate':
          return `تحديث تاريخ المقابلة`;
        case 'interviewTime':
          return `تحديث وقت المقابلة`;
        default:
          return `تحديث ${change.label}`;
      }
    });
    
    return `تم تحديث: ${changeDescriptions.join('، ')}`;
  };

  // Save application
  const handleSave = async () => {
    try {
      setSaving(true);
      
      const updateData = {
        ...formData,
        strengths: formData.strengths.split(',').map(s => s.trim()).filter(s => s),
        weaknesses: formData.weaknesses.split(',').map(w => w.trim()).filter(w => w),
      };

      // Detect changes for detailed timeline
      const changes = detectChanges(application, formData);
      
      updateData.timeline = [
        ...(application.timeline || []),
        {
          action: "updated",
          status: formData.status,
          notes: generateUpdateNotes(changes),
          performedBy: "HR",
          date: new Date(),
          changes: changes
        }
      ];

      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error("Failed to update application");

      toast.success("تم حفظ التغييرات بنجاح");
      setEditing(false);
      fetchApplication();
      
    } catch (error) {
      console.error("Error:", error);
      toast.error("فشل في حفظ التغييرات");
    } finally {
      setSaving(false);
    }
  };

  // Schedule interview
  const scheduleInterview = async () => {
    if (!formData.interviewDate || !formData.interviewTime) {
      toast.error("يرجى تحديد تاريخ ووقت المقابلة");
      return;
    }

    try {
      setSaving(true);
      
      const interviewData = {
        status: "interview_scheduled",
        interviewDate: formData.interviewDate,
        interviewTime: formData.interviewTime,
        interviewType: formData.interviewType,
        interviewLocation: formData.interviewLocation,
        interviewNotes: formData.interviewNotes,
        timeline: [
          ...(application.timeline || []),
          {
            action: "interview_scheduled",
            status: "interview_scheduled",
            notes: `تم جدولة مقابلة ${formData.interviewType === 'online' ? 'أونلاين' : 'شخصية'} في ${formData.interviewDate}`,
            performedBy: "HR",
            date: new Date()
          }
        ]
      };

      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(interviewData),
      });

      if (!response.ok) throw new Error("Failed to schedule interview");

      toast.success("تم جدولة المقابلة بنجاح");
      setEditing(false);
      fetchApplication();
      
    } catch (error) {
      console.error("Error:", error);
      toast.error("فشل في جدولة المقابلة");
    } finally {
      setSaving(false);
    }
  };

  // Quick status change function
  const handleStatusChange = async (newStatus) => {
    try {
      setSaving(true);
      
      const statusMessages = {
        pending: "تم تغيير الحالة إلى قيد المراجعة",
        reviewed: "تم تغيير الحالة إلى تم المراجعة", 
        interview_scheduled: "تم تغيير الحالة إلى مقابلة مجدولة",
        interview_completed: "تم تغيير الحالة إلى تمت المقابلة",
        rejected: "تم تغيير الحالة إلى مرفوض",
        hired: "تم تغيير الحالة إلى مقبول"
      };

      const updateData = {
        status: newStatus,
        timeline: [
          ...(application.timeline || []),
          {
            action: "status_changed",
            status: newStatus,
            notes: statusMessages[newStatus] || `تم تغيير الحالة إلى ${newStatus}`,
            performedBy: "HR",
            date: new Date(),
            changes: [{
              field: 'status',
              from: application.status,
              to: newStatus,
              label: 'الحالة'
            }]
          }
        ]
      };

      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error("Failed to update status");

      toast.success("تم تغيير الحالة بنجاح");
      fetchApplication();
      
    } catch (error) {
      console.error("Error:", error);
      toast.error("فشل في تغيير الحالة");
    } finally {
      setSaving(false);
    }
  };

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
    handleSave,
    handleEditToggle: () => setEditing(!editing),
    scheduleInterview,
    handleFormChange,
    handleStatusChange
  };
};