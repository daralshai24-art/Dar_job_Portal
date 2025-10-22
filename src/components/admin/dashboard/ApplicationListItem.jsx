// src/components/admin/dashboard/ApplicationListItem.jsx
import StatusBadge from "./StatusBadge";
import { Users, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ApplicationListItem({ application }) {
  const router = useRouter();

  // Safe date formatting function
  const formatDate = (dateInput) => {
    try {
      const date = new Date(dateInput);
      return date.toLocaleDateString('ar-EG');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'تاريخ غير متوفر';
    }
  };

  // Safe click handler with proper ID extraction
  const handleClick = () => {
    // Try different possible ID fields
    const applicationId = application._id || application.id;
    
    if (applicationId) {
      router.push(`/admin/applications/${applicationId}`);
    } else {
      console.error('Application ID not found:', application);
      // Optionally show a toast message
      alert('تعذر فتح تفاصيل الطلب: المعرف غير متوفر');
    }
  };

  return (
    <div 
      className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center space-x-3 space-x-reverse flex-1">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        <div className="flex-1 min-w-0 text-right">
          <p className="text-sm font-medium text-gray-900 truncate">
            {application.name || 'غير معروف'}
          </p>
          <p className="text-sm text-gray-500 truncate">
            {application.jobTitle || application.jobId?.title || 'وظيفة غير محددة'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {formatDate(application.createdAt)}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 space-x-reverse">
        <StatusBadge status={application.status} />
        {application.cv?.path && (
          <FileText className="w-4 h-4 text-gray-400" />
        )}
      </div>
    </div>
  );
}