// components/jobs/JobForm/index.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

// Shared UI Components
import Button from "@/components/shared/ui/Button";
import Input from "@/components/shared/ui/Input";
import Select from "@/components/shared/ui/Select";
import Textarea from "@/components/shared/ui/Textarea";
import LoadingSpinner from "@/components/shared/ui/LoadingSpinner";
import ErrorMessage from "@/components/shared/ui/ErrorMessage";

// Form configuration
import { 
  validateJobForm, 
  jobFormInitialData 
} from "./validation";
import { 
  formFields, 
  getStatusExplanation 
} from "./FormFields";

/**
 * Reusable Job Form Component
 * Handles both create and edit modes
 * 
 * @param {Object} props
 * @param {Object} props.initialData - Initial form data for edit mode
 * @param {string} props.mode - 'create' | 'edit'
 * @param {function} props.onSuccess - Success callback
 */
const JobForm = ({ 
  initialData = null, 
  mode = "create",
  onSuccess 
}) => {
  const router = useRouter();
  
  const [formData, setFormData] = useState(jobFormInitialData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form with initialData for edit mode
  useEffect(() => {
    if (initialData && mode === "edit") {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        location: initialData.location || "",
        salary: initialData.salary || "",
        category: initialData.category || "",
        jobType: initialData.jobType || "Full-time",
        experience: initialData.experience || "Entry Level",
        requirements: initialData.requirements || "",
        status: initialData.status || "draft",
      });
    }
  }, [initialData, mode]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: value 
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validate form
  const formErrors = validateJobForm(formData);
  if (Object.keys(formErrors).length > 0) {
    setErrors(formErrors);
    toast.error("يرجى ملء جميع الحقول المطلوبة");
    return;
  }

  setLoading(true);
  setErrors({});

  try {
    const url = mode === "create" ? "/api/jobs" : `/api/jobs/${initialData._id}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `فشل في ${mode === "create" ? "إنشاء" : "تحديث"} الوظيفة`);
    }

    const successMessage = mode === "create" 
      ? "تم إنشاء الوظيفة بنجاح!" 
      : "تم تحديث الوظيفة بنجاح!";

    toast.success(successMessage);

    //  Use router.replace() instead of router.push()
    
    router.replace("/admin/jobs");

  } catch (err) {
    console.error("Error saving job:", err);
    toast.error(err.message);
  } finally {
    setLoading(false);
  }
};
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 space-y-6 max-w-4xl mx-auto"
      dir="rtl"
    >
      {/* Header */}
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {mode === "create" ? "إضافة وظيفة جديدة" : "تعديل الوظيفة"}
        </h2>
        <p className="text-gray-600 text-sm">
          {mode === "create" 
            ? "املأ البيانات التالية لنشر الوظيفة" 
            : "قم بتعديل بيانات الوظيفة ثم احفظ التغييرات"
          }
        </p>
      </div>

      {/* Title Field */}
      <Input
        label={formFields.title.label}
        placeholder={formFields.title.placeholder}
        icon={formFields.title.icon}
        value={formData.title}
        onChange={(e) => handleChange("title", e.target.value)}
        error={errors.title}
        required={formFields.title.required}
      />

      {/* Grid Layout for Multiple Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location */}
        <Input
          label={formFields.location.label}
          placeholder={formFields.location.placeholder}
          icon={formFields.location.icon}
          value={formData.location}
          onChange={(e) => handleChange("location", e.target.value)}
          error={errors.location}
          required={formFields.location.required}
        />

        {/* Category */}
        <Select
          label={formFields.category.label}
          icon={formFields.category.icon}
          value={formData.category}
          onChange={(e) => handleChange("category", e.target.value)}
          options={[{ value: "", label: "اختر التصنيف" }, ...formFields.category.options]}
        />

        {/* Job Type */}
        <Select
          label={formFields.jobType.label}
          icon={formFields.jobType.icon}
          value={formData.jobType}
          onChange={(e) => handleChange("jobType", e.target.value)}
          options={formFields.jobType.options}
        />

        {/* Experience Level */}
        <Select
          label={formFields.experience.label}
          icon={formFields.experience.icon}
          value={formData.experience}
          onChange={(e) => handleChange("experience", e.target.value)}
          options={formFields.experience.options}
        />

        {/* Salary */}
        <Input
          label={formFields.salary.label}
          placeholder={formFields.salary.placeholder}
          icon={formFields.salary.icon}
          value={formData.salary}
          onChange={(e) => handleChange("salary", e.target.value)}
        />

        {/* Status with Explanation */}
        <div className="space-y-2">
          <Select
            label={formFields.status.label}
            icon={formFields.status.icon}
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
            options={formFields.status.options}
          />
          
          {/* Status Explanation */}
          <div className="text-xs text-gray-500 mt-2">
            {getStatusExplanation(formData.status)}
          </div>
        </div>
      </div>

      {/* Description Field */}
      <Textarea
        label={formFields.description.label}
        placeholder={formFields.description.placeholder}
        icon={formFields.description.icon}
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        error={errors.description}
        required={formFields.description.required}
        rows={5}
      />

      {/* Requirements Field */}
      <Textarea
        label={formFields.requirements.label}
        placeholder={formFields.requirements.placeholder}
        icon={formFields.requirements.icon}
        value={formData.requirements}
        onChange={(e) => handleChange("requirements", e.target.value)}
        rows={3}
      />

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/jobs")}
          disabled={loading}
        >
          إلغاء
        </Button>
        
    <Button
  type="submit"
  loading={loading}
  disabled={loading}
  className="w-full md:w-auto"
>
  {mode === "create" 
    ? (formData.status === "draft" ? "حفظ كمسودة" : "نشر الوظيفة")
    : "حفظ التغييرات"
  }
</Button>
      </div>
    </form>
  );
};

export default JobForm;