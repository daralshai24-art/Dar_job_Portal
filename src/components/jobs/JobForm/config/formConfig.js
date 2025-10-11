import { 
  Briefcase, 
  MapPin, 
  Users, 
  Award,
  FileText,
  Clock,
  Save,
  Send,
  Edit,
  X
} from "lucide-react";

/**
 * Form fields configuration for the JobForm
 */
export const formFields = {
  title: {
    label: "المسمى الوظيفي ",
    placeholder: "اختر المسمى الوظيفي",
    icon: Briefcase,
    type: "select",
    required: true
  },
  location: {
    label: "الموقع ", 
    placeholder: "اختر الموقع",
    icon: MapPin,
    type: "select",
    required: true
  },
  category: {
    label: "التصنيف",
    icon: Users,
    type: "select",
    required: true
  },
  jobType: {
    label: "نوع الوظيفة", 
    icon: Clock,
    type: "select",
    options: [
      { value: "Full-time", label: "دوام كامل" },
      { value: "Part-time", label: "دوام جزئي" },
      { value: "Contract", label: "عقد" },
      { value: "Freelance", label: "عمل حر" },
      { value: "Internship", label: "تدريب" },
    ],
    required: false
  },
  experience: {
    label: "مستوى الخبرة",
    icon: Award,
    type: "select", 
    options: [
      { value: "Entry Level", label: "مبتدئ" },
      { value: "Mid Level", label: "متوسط" },
      { value: "Senior Level", label: "متقدم" },
      { value: "Executive", label: "إداري" },
    ],
    required: false
  },
  status: {
    label: "حالة الوظيفة",
    icon: FileText,
    type: "select",
    options: [
      { value: "draft", label: "مسودة" },
      { value: "active", label: "نشط" },
      { value: "inactive", label: "غير نشط" },
      { value: "closed", label: "مغلقة" },
    ],
    required: false
  },
  description: {
    label: "الوصف الوظيفي",
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
 * Button configuration with icons
 */
/**
 * Button configuration with icons
 */
export const buttonConfig = {
  cancel: {
    label: "إلغاء",
    icon: X,
    variant: "outline" // This maps to 'outline'
  },
  create: {
    draft: {
      label: "حفظ كمسودة",
      icon: Save,
      variant: "default" // This maps to 'light' 
    },
    publish: {
      label: "نشر الوظيفة", 
      icon: Send,
      variant: "primary" // This maps to 'primary' in 
    }
  },
  edit: {
    label: "حفظ التغييرات",
    icon: Edit,
    variant: "primary" // This maps to 'primary' 
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