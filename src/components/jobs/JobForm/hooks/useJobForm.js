// components/admin/jobs/hooks/useJobForm.js
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { validateJobForm, jobFormInitialData } from "../validation";

export const useJobForm = (initialData, mode, formActionsRef) => {
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
        category: initialData.category?._id || initialData.category || "",
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
      } else {
        console.error("Failed to load options:", res.status);
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

    console.log(`Adding new ${field}:`, value);

    // Special handling for categories
    if (field === "categories") {
      // Check if category already exists in loaded options
      const existingCategory = dynamicOptions.categories.find(cat => 
        cat.name.toLowerCase() === value.toLowerCase()
      );

      if (existingCategory) {
        // If it exists in the options, select it instead of showing error
        setFormData(prev => ({ ...prev, category: existingCategory._id }));
        setNewOptions(prev => ({ ...prev, category: "" }));
        toast.success(`تم اختيار التصنيف: ${value}`);
        return;
      }

      try {
        console.log("Sending category creation request...");
        const res = await fetch("/api/jobs/options", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            field, 
            value
          })
        });

        console.log("Response status:", res.status);
        const result = await res.json();
        console.log("Response data:", result);

        if (res.ok && result.success) {
          console.log("Category created successfully:", result.data);
          // Add the new category to the options
          setDynamicOptions(prev => ({
            ...prev,
            categories: [...prev.categories, result.data].sort((a, b) => 
              a.name.localeCompare(b.name)
            )
          }));
          
          // Set the form to use the new category
          setFormData(prev => ({ ...prev, category: result.data._id }));
          
          // Clear the new category input
          setNewOptions(prev => ({ 
            ...prev, 
            category: ""
          }));
          
          toast.success("تم إضافة التصنيف بنجاح");
        } else {
          console.error("API Error:", result);
          
          // Handle duplicate category gracefully
          if (result.error?.includes("already exists") || res.status === 409) {
            // If category already exists, refresh options and select it
            await loadDynamicOptions();
            const existingCat = dynamicOptions.categories.find(cat => 
              cat.name.toLowerCase() === value.toLowerCase()
            );
            if (existingCat) {
              setFormData(prev => ({ ...prev, category: existingCat._id }));
              toast.success(`تم اختيار التصنيف: ${value}`);
            } else {
              toast.error("التصنيف موجود مسبقاً، جاري تحديث القائمة...");
            }
            return;
          }
          
          const errorMessage = result.error || result.message || "فشل في إضافة التصنيف";
          throw new Error(errorMessage);
        }
      } catch (error) {
        console.error("Error adding new category:", error);
        
        // Handle MongoDB duplicate error gracefully
        if (error.message?.includes("duplicate key") || error.message?.includes("already exists")) {
          toast.error("التصنيف موجود مسبقاً");
          await loadDynamicOptions(); // Refresh the options
          return;
        }
        
        toast.error(error.message || "حدث خطأ غير متوقع في إضافة التصنيف");
      }
      return;
    }

    // Handle titles and locations
    const existingOptions = dynamicOptions[field] || [];
    const isDuplicate = existingOptions.some(option => {
      if (typeof option === 'string') {
        return option.toLowerCase() === value.toLowerCase();
      }
      return option.name?.toLowerCase() === value.toLowerCase();
    });

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

      const result = await res.json();

      if (res.ok) {
        setDynamicOptions(prev => ({
          ...prev,
          [field]: [...prev[field], value].sort()
        }));
        
        setFormData(prev => ({ ...prev, [singularField]: value }));
        setNewOptions(prev => ({ ...prev, [singularField]: "" }));
        toast.success("تمت الإضافة بنجاح");
      } else {
        throw new Error(result.error || "فشل في إضافة القيمة");
      }
    } catch (error) {
      console.error("Error adding new option:", error);
      toast.error(error.message || "فشل في إضافة القيمة");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
        category: formData.category,
        jobType: formData.jobType,
        experience: formData.experience,
        requirements: formData.requirements.trim(),
        status: formData.status,
      };

      console.log('Submitting job data:', submitData);

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `فشل في ${mode === "create" ? "إنشاء" : "تحديث"} الوظيفة`);
      }

      setLoading(false);
      isSubmittingRef.current = false;

      toast.success(
        mode === "create" ? "تم إنشاء الوظيفة بنجاح! " : "تم تحديث الوظيفة بنجاح! ",
        { duration: 1500 }
      );

      setTimeout(() => {
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