// components/jobs/JobStatusBadge.jsx
/**
 * Reusable Job Status Badge Component
 */
const JobStatusBadge = ({ status }) => {
  const statusConfig = {
    draft: {
      label: "مسودة",
      className: "bg-gray-100 text-gray-800"
    },
    active: {
      label: "نشط", 
      className: "bg-green-100 text-green-800"
    },
    inactive: {
      label: "غير نشط",
      className: "bg-yellow-100 text-yellow-800"
    },
    closed: {
      label: "مغلق",
      className: "bg-red-100 text-red-800"
    }
  };

  const config = statusConfig[status] || statusConfig.draft;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};

export default JobStatusBadge;