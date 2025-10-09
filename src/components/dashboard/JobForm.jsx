// components/dashboard/JobForm.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  FileText, 
  Calendar,
  Users,
  Award,
  Save,
  Plus
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function JobForm({ 
  initialData = null, 
  onSuccess,
  mode = "create" // "create" or "edit"
}) {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    category: "",
    jobType: "Full-time",
    experience: "Entry Level",
    requirements: "",
    status: "draft",
  });

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

  // Status options with colors
  const statusOptions = [
    { value: "draft", label: "مسودة", color: "bg-gray-500" },
    { value: "active", label: "نشط", color: "bg-green-500" },
    { value: "inactive", label: "غير نشط", color: "bg-yellow-500" },
    { value: "closed", label: "مغلقة", color: "bg-red-500" },
  ];

  // Job type options
  const jobTypeOptions = [
    { value: "Full-time", label: "دوام كامل" },
    { value: "Part-time", label: "دوام جزئي" },
    { value: "Contract", label: "عقد" },
    { value: "Freelance", label: "عمل حر" },
    { value: "Internship", label: "تدريب" },
  ];

  // Experience level options
  const experienceOptions = [
    { value: "Entry Level", label: "مبتدئ" },
    { value: "Mid Level", label: "متوسط" },
    { value: "Senior Level", label: "متقدم" },
    { value: "Executive", label: "إداري" },
  ];

  // Category options
  const categoryOptions = [
    { value: "تكنولوجيا", label: "تكنولوجيا" },
    { value: "مبيعات", label: "مبيعات" },
    { value: "تسويق", label: "تسويق" },
    { value: "تصميم", label: "تصميم" },
    { value: "مالية", label: "مالية" },
    { value: "موارد بشرية", label: "موارد بشرية" },
    { value: "خدمة عملاء", label: "خدمة عملاء" },
    { value: "تعليم", label: "تعليم" },
    { value: "رعاية صحية", label: "رعاية صحية" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "عنوان الوظيفة مطلوب";
    }

    if (!formData.description.trim()) {
      newErrors.description = "وصف الوظيفة مطلوب";
    }

    if (!formData.location.trim()) {
      newErrors.location = "موقع الوظيفة مطلوب";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
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

      if (onSuccess) {
        onSuccess(data.data || data);
        router.push("/admin/jobs");
      } else {
        // Default behavior: redirect to jobs list
        router.push("/admin/jobs");
      }

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

      {/* Title */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          المسمى الوظيفي *
        </label>
        <div className="relative">
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Briefcase className="h-5 w-5 text-blue-500" />
          </div>
          <input
            type="text"
            name="title"
            placeholder="مثال: مبرمج ويب"
            value={formData.title}
            onChange={handleChange}
            className={`w-full border rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-[#D6B666] focus:border-transparent outline-none transition-all duration-200 ${
              errors.title ? "border-red-300" : "border-gray-300"
            }`}
          />
        </div>
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title}</p>
        )}
      </div>

      {/* Location, Category, Job Type, Experience - Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            الموقع *
          </label>
          <div className="relative">
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <MapPin className="h-5 w-5 text-green-700" />
            </div>
            <input
              type="text"
              name="location"
              placeholder="مثال: الرياض، السعودية"
              value={formData.location}
              onChange={handleChange}
              className={`w-full border rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-[#D6B666] focus:border-transparent outline-none transition-all duration-200 ${
                errors.location ? "border-red-300" : "border-gray-300"
              }`}
            />
          </div>
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location}</p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            التصنيف
          </label>
          <div className="relative">
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Users className="h-5 w-5 text-purple-500" />
            </div>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-[#D6B666] focus:border-transparent outline-none appearance-none bg-white cursor-pointer transition-all duration-200"
            >
              <option value="">اختر التصنيف</option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Job Type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            نوع الوظيفة
          </label>
          <div className="relative">
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Briefcase className="h-5 w-5 text-blue-400" />
            </div>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-[#D6B666] focus:border-transparent outline-none appearance-none bg-white cursor-pointer transition-all duration-200"
            >
              {jobTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Experience Level */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            مستوى الخبرة
          </label>
          <div className="relative">
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Award className="h-5 w-5 text-yellow-500" />
            </div>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-[#D6B666] focus:border-transparent outline-none appearance-none bg-white cursor-pointer transition-all duration-200"
            >
              {experienceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Salary */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            الراتب
          </label>
          <div className="relative">
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <DollarSign className="h-5 w-5 text-red-600" />
            </div>
            <input
              type="text"
              name="salary"
              placeholder="مثال: 5000 - 8000 ر.س"
              value={formData.salary}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-[#D6B666] focus:border-transparent outline-none transition-all duration-200"
            />
          </div>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            حالة الوظيفة
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Calendar className="h-5 w-5 text-[#D6B666]" />
            </div>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-12 focus:ring-2 focus:ring-[#D6B666] focus:border-transparent outline-none appearance-none bg-white cursor-pointer transition-all duration-200"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {/* Status indicator dot */}
            <div className="absolute left-10 top-1/2 transform -translate-y-1/2">
              <div
                className={`w-2 h-2 rounded-full ${
                  statusOptions.find(opt => opt.value === formData.status)?.color
                }`}
              ></div>
            </div>
          </div>
          
          {/* Status explanation */}
          <div className="text-xs text-gray-500 mt-2">
            {formData.status === "draft" && "⚠️ الوظيفة محفوظة ولكن غير منشورة للعموم"}
            {formData.status === "active" && "✅ الوظيفة منشورة ومتاحة للتقديم"}
            {formData.status === "inactive" && "⏸️ الوظيفة متوقفة مؤقتاً عن استقبال الطلبات"}
            {formData.status === "closed" && "❌ الوظيفة مغلقة ولم تعد تقبل الطلبات"}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          الوصف الوظيفي *
        </label>
        <div className="relative">
          <div className="absolute right-3 top-3">
            <FileText className="h-5 w-5 text-[#D6B666]" />
          </div>
          <textarea
            name="description"
            placeholder="ادخل وصفاً مفصلاً للوظيفة والمتطلبات..."
            value={formData.description}
            onChange={handleChange}
            rows="5"
            className={`w-full border rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-[#D6B666] focus:border-transparent outline-none resize-none transition-all duration-200 ${
              errors.description ? "border-red-300" : "border-gray-300"
            }`}
          ></textarea>
        </div>
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description}</p>
        )}
      </div>

      {/* Requirements */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          المتطلبات والمهارات
        </label>
        <div className="relative">
          <div className="absolute right-3 top-3">
            <Award className="h-5 w-5 text-blue-400" />
          </div>
          <textarea
            name="requirements"
            placeholder="اذكر متطلبات الوظيفة والمهارات المطلوبة..."
            value={formData.requirements}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-[#D6B666] focus:border-transparent outline-none resize-none transition-all duration-200"
          ></textarea>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-l from-green-700 to-green-800 text-white py-3.5 rounded-xl font-medium hover:from-green-800 hover:to-green-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2 space-x-reverse">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>جاري {mode === "create" ? "الحفظ" : "التحديث"}...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2 space-x-reverse">
            {mode === "create" ? <Plus size={20} /> : <Save size={20} />}
            <span>
              {mode === "create" 
                ? (formData.status === "draft" ? "حفظ كمسودة" : "نشر الوظيفة") 
                : "حفظ التغييرات"
              }
            </span>
          </div>
        )}
      </button>
    </form>
  );
}