export const JOB_DEPARTMENTS = [
  "HR",
  "IT",
  "Finance",
  "Operations",
  "Marketing",
  "Sales",
  "Other"
];

export const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship"
];

export const JOB_LEVELS = [
  "Entry Level",
  "Mid Level",
  "Senior Level",
  "Executive"
];

export const JOB_STATUS = {
  DRAFT: { label: "مسودة", color: "bg-gray-100 text-gray-800" },
  ACTIVE: { label: "نشط", color: "bg-green-100 text-green-800" },
  INACTIVE: { label: "غير نشط", color: "bg-red-100 text-red-800" },
  CLOSED: { label: "مغلق", color: "bg-gray-100 text-gray-800" }
};

export const TABLE_COLUMNS = {
  JOBS: [
    { key: "details", label: "تفاصيل الوظيفة", className: "text-right" },
    { key: "status", label: "الحالة", className: "text-center w-32" },
    { key: "applications", label: "المتقدمين", className: "text-center w-24" },
    { key: "date", label: "تاريخ النشر", className: "text-center w-32" },
    { key: "actions", label: "إجراءات", className: "w-24" }
  ]
};

export const fetchCategories = async () => {
  try {
    const res = await fetch("/api/categories");
    if (!res.ok) throw new Error("Failed to fetch categories");
    const data = await res.json();

    // Handle various response structures
    const categories = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);

    return [
      { _id: "all", name: "الكل" },
      ...categories
    ];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [{ _id: "all", name: "الكل" }];
  }
};

export const APPLICATION_STATUS_CONFIG = {
  new: { label: "جديد", className: "bg-blue-100 text-blue-800 border-blue-200" },
  screening: { label: "تحت الفرز", className: "bg-purple-100 text-purple-800 border-purple-200" },
  interview: { label: "مقابلة", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  offer: { label: "عرض عمل", className: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  hired: { label: "تم التوظيف", className: "bg-green-100 text-green-800 border-green-200" },
  rejected: { label: "مرفوض", className: "bg-red-100 text-red-800 border-red-200" },
  pending: { label: "قيد الانتظار", className: "bg-gray-100 text-gray-800 border-gray-200" }
};
