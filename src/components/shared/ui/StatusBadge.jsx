export const StatusBadge = ({ status, type = "job" }) => {
  // Job status configurations
  const jobStatusConfig = {
    draft: { label: "مسودة", className: "bg-gray-100 text-gray-800" },
    active: { label: "نشط", className: "bg-green-100 text-green-800" },
    inactive: { label: "غير نشط", className: "bg-yellow-100 text-yellow-800" },
    closed: { label: "مغلق", className: "bg-red-100 text-red-800" }
  };

  // Application status configurations
  const applicationStatusConfig = {
    pending: { label: "قيد المراجعة", className: "bg-yellow-100 text-yellow-800" },
    reviewed: { label: "تم المراجعة", className: "bg-blue-100 text-blue-800" },
    interview_scheduled: { label: "مقابلة مجدولة", className: "bg-purple-100 text-purple-800" },
    interview_completed: { label: "تمت المقابلة", className: "bg-indigo-100 text-indigo-800" },
    rejected: { label: "مرفوض", className: "bg-red-100 text-red-800" },
    hired: { label: "مقبول", className: "bg-green-100 text-green-800" }
  };

  const config = type === "application" 
    ? applicationStatusConfig[status] || applicationStatusConfig.pending
    : jobStatusConfig[status] || jobStatusConfig.draft;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};