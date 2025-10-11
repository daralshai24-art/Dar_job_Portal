import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { validateJobForm, jobFormInitialData } from "../validation";

export const useJobForm = (initialData, mode, onSuccess, formActionsRef) => {
  const router = useRouter();
  const isSubmittingRef = useRef(false);
  
  const [formData, setFormData] = useState(jobFormInitialData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [dynamicOptions, setDynamicOptions] = useState({
    titles: [],
    locations: [],
    categories: []
  });
  const [newOptions, setNewOptions] = useState({
    title: "",
    location: "", 
    category: ""
  });

  // Initialize form with initialData for edit mode
  useEffect(() => {
    if (initialData && mode === "edit") {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        location: initialData.location || "",
        category: initialData.category || "",
        jobType: initialData.jobType || "Full-time",
        experience: initialData.experience || "Entry Level",
        requirements: initialData.requirements || "",
        status: initialData.status || "draft",
      });
    }
  }, [initialData, mode]);

  // Auto-scroll to buttons when status changes
  useEffect(() => {
    if (formActionsRef && formActionsRef.current) {
      setTimeout(() => {
        formActionsRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);
    }
  }, [formData.status, formActionsRef]);

  // Load dynamic options
  useEffect(() => {
    loadDynamicOptions();
  }, []);

  const loadDynamicOptions = async () => {
    try {
      const res = await fetch("/api/jobs/options");
      if (res.ok) {
        const data = await res.json();
        setDynamicOptions(data);
      }
    } catch (error) {
      console.error("Error loading dynamic options:", error);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleNewOptionChange = (field, value) => {
    setNewOptions(prev => ({ ...prev, [field]: value }));
  };

  const addNewOption = async (field) => {
    const fieldMap = {
      'titles': 'title',
      'locations': 'location', 
      'categories': 'category'
    };
    
    const singularField = fieldMap[field];
    const value = newOptions[singularField]?.trim() || '';
    
    if (!value) {
      toast.error("يرجى إدخال قيمة");
      return;
    }

    const existingOptions = dynamicOptions[field] || [];
    const isDuplicate = existingOptions.some(option => 
      option.toLowerCase() === value.toLowerCase()
    );

    if (isDuplicate) {
      toast.error("هذا الخيار موجود مسبقاً");
      return;
    }

    try {
      const res = await fetch("/api/jobs/options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, value })
      });

      if (res.ok) {
        setDynamicOptions(prev => ({
          ...prev,
          [field]: [...prev[field], value].sort()
        }));
        
        setFormData(prev => ({ ...prev, [singularField]: value }));
        setNewOptions(prev => ({ ...prev, [singularField]: "" }));
        toast.success("تمت الإضافة بنجاح");
      } else {
        throw new Error("فشل في إضافة القيمة");
      }
    } catch (error) {
      console.error("Error adding new option:", error);
      toast.error("فشل في إضافة القيمة");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmittingRef.current) {
      return;
    }

    const formErrors = validateJobForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    isSubmittingRef.current = true;
    setLoading(true);
    setErrors({});

    try {
      const url = mode === "create" ? "/api/jobs" : `/api/jobs/${initialData._id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const submitData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        category: formData.category.trim(),
        jobType: formData.jobType,
        experience: formData.experience,
        requirements: formData.requirements.trim(),
        status: formData.status,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `فشل في ${mode === "create" ? "إنشاء" : "تحديث"} الوظيفة`);
      }

      // SUCCESS
      setLoading(false);
      isSubmittingRef.current = false;

      // Show success message
      toast.success(
        mode === "create" ? "تم إنشاء الوظيفة بنجاح! " : "تم تحديث الوظيفة بنجاح! ",
        { duration: 1500 }
      );

      // BULLETPROOF NAVIGATION - ALWAYS use window.location
      setTimeout(() => {
        console.log('🚀 FORCE NAVIGATION TO /admin/jobs');
        window.location.href = "/admin/jobs";
      }, 1200);

    } catch (err) {
      console.error("Error saving job:", err);
      toast.error(err.message);
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  const handleCancel = () => {
    window.location.href = "/admin/jobs";
  };

  return {
    formData,
    loading,
    errors,
    dynamicOptions,
    newOptions,
    handleChange,
    handleNewOptionChange,
    addNewOption,
    handleSubmit,
    handleCancel
  };
};