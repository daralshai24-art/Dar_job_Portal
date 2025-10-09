// components/jobs/JobForm/FormFields.jsx
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Users, 
  Award,
  FileText 
} from "lucide-react";

/**
 * Job Form Fields Configuration
 */

// Status options with colors
export const statusOptions = [
  { value: "draft", label: "مسودة", color: "bg-gray-500" },
  { value: "active", label: "نشط", color: "bg-green-500" },
  { value: "inactive", label: "غير نشط", color: "bg-yellow-500" },
  { value: "closed", label: "مغلقة", color: "bg-red-500" },
];

// Job type options
export const jobTypeOptions = [
  { value: "Full-time", label: "دوام كامل" },
  { value: "Part-time", label: "دوام جزئي" },
  { value: "Contract", label: "عقد" },
  { value: "Freelance", label: "عمل حر" },
  { value: "Internship", label: "تدريب" },
];

// Experience level options
export const experienceOptions = [
  { value: "Entry Level", label: "مبتدئ" },
  { value: "Mid Level", label: "متوسط" },
  { value: "Senior Level", label: "متقدم" },
  { value: "Executive", label: "إداري" },
];

// Category options
export const categoryOptions = [
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

/**
 * Form fields configuration for the JobForm
 */
export const formFields = {
  title: {
    label: "المسمى الوظيفي *",
    placeholder: "مثال: مبرمج ويب",
    icon: Briefcase,
    type: "text",
    required: true
  },
  location: {
    label: "الموقع *", 
    placeholder: "مثال: الرياض، السعودية",
    icon: MapPin,
    type: "text",
    required: true
  },
  salary: {
    label: "الراتب",
    placeholder: "مثال: 5000 - 8000 ر.س",
    icon: DollarSign,
    type: "text",
    required: false
  },
  category: {
    label: "التصنيف",
    icon: Users,
    type: "select",
    options: categoryOptions,
    required: false
  },
  jobType: {
    label: "نوع الوظيفة", 
    icon: Briefcase,
    type: "select",
    options: jobTypeOptions,
    required: false
  },
  experience: {
    label: "مستوى الخبرة",
    icon: Award,
    type: "select", 
    options: experienceOptions,
    required: false
  },
  status: {
    label: "حالة الوظيفة",
    icon: FileText,
    type: "select",
    options: statusOptions,
    required: false
  },
  description: {
    label: "الوصف الوظيفي *",
    placeholder: "ادخل وصفاً مفصلاً للوظيفة والمتطلبات...",
    icon: FileText,
    type: "textarea",
    required: true
  },
  requirements: {
    label: "المتطلبات والمهارات",
    placeholder: "اذكر متطلبات الوظيفة والمهارات المطلوبة...", 
    icon: Award,
    type: "textarea",
    required: false
  }
};

/**
 * Get status explanation text
 */
export const getStatusExplanation = (status) => {
  const explanations = {
    draft: "⚠️ الوظيفة محفوظة ولكن غير منشورة للعموم",
    active: "✅ الوظيفة منشورة ومتاحة للتقديم", 
    inactive: "⏸️ الوظيفة متوقفة مؤقتاً عن استقبال الطلبات",
    closed: "❌ الوظيفة مغلقة ولم تعد تقبل الطلبات"
  };
  return explanations[status] || "";
};