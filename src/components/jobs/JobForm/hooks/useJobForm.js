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
    categories: [],
  });
  const [newOptions, setNewOptions] = useState({
    title: "",
    location: "",
    category: "",
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
        formActionsRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, [formData.status, formActionsRef]);

  // Load dynamic options from the server
  useEffect(() => {
    loadDynamicOptions();
  }, []);

  const loadDynamicOptions = async () => {
    try {
      const res = await fetch("/api/jobs/options");
      if (!res.ok) throw new Error("Failed to fetch job options");
      const data = await res.json();
      setDynamicOptions(data);
    } catch (err) {
      console.error("Error loading options:", err);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleNewOptionChange = (field, value) => {
    setNewOptions((prev) => ({ ...prev, [field]: value }));
  };

  const addNewOption = async (field) => {
    const fieldMap = {
      titles: "title",
      locations: "location",
      categories: "category",
    };

    const singularField = fieldMap[field];
    const value = newOptions[singularField]?.trim();
    if (!value) {
      toast.error("يرجى إدخال قيمة");
      return;
    }

    if (field === "categories") {
      // Handle categories via protected API
      try {
        const res = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: value }),
        });

        const result = await res.json();

        if (res.ok && result.success) {
          setDynamicOptions((prev) => ({
            ...prev,
            categories: [...prev.categories, result.data].sort((a, b) =>
              a.name.localeCompare(b.name)
            ),
          }));
          setFormData((prev) => ({ ...prev, category: result.data._id }));
          setNewOptions((prev) => ({ ...prev, category: "" }));
          toast.success("تم إضافة التصنيف بنجاح");
        } else if (res.status === 409) {
          await loadDynamicOptions();
          const existingCat = dynamicOptions.categories.find(
            (cat) => cat.name.toLowerCase() === value.toLowerCase()
          );
          if (existingCat) {
            setFormData((prev) => ({ ...prev, category: existingCat._id }));
            toast.success(`تم اختيار التصنيف: ${value}`);
          }
        } else {
          throw new Error(result.error || result.message || "فشل في إضافة التصنيف");
        }
      } catch (err) {
        console.error("Error adding category:", err);
        toast.error(err.message || "حدث خطأ غير متوقع");
      }
      return;
    }

    // Titles & Locations: dynamically add to state
    const existingOptions = dynamicOptions[field] || [];
    const isDuplicate = existingOptions.some(
      (option) =>
        (typeof option === "string" ? option.toLowerCase() : option.name.toLowerCase()) ===
        value.toLowerCase()
    );

    if (isDuplicate) {
      toast.error("هذا الخيار موجود مسبقاً");
      return;
    }

    setDynamicOptions((prev) => ({
      ...prev,
      [field]: [...prev[field], value].sort(),
    }));

    setFormData((prev) => ({ ...prev, [singularField]: value }));
    setNewOptions((prev) => ({ ...prev, [singularField]: "" }));
    toast.success("تمت الإضافة بنجاح");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;

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
      const url =
        mode === "create" ? "/api/admin/jobs" : `/api/admin/jobs/${initialData._id}`;
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

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل في حفظ الوظيفة");

      setLoading(false);
      isSubmittingRef.current = false;
      toast.success(
        mode === "create" ? "تم إنشاء الوظيفة بنجاح!" : "تم تحديث الوظيفة بنجاح!",
        { duration: 1500 }
      );
      setTimeout(() => (window.location.href = "/admin/jobs"), 1200);
    } catch (err) {
      console.error("Error saving job:", err);
      toast.error(err.message || "حدث خطأ أثناء الحفظ");
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
    handleCancel,
  };
};
