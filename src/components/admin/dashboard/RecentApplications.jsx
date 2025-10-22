// src/components/admin/dashboard/RecentApplications.jsx
import ApplicationListItem from "./ApplicationListItem";
import { FileText } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RecentApplications({ applications, className = "" }) {
  const router = useRouter();

  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">أحدث طلبات التوظيف</h2>
        <button 
          onClick={() => router.push('/admin/applications')}
          className="text-sm text-green-600 hover:text-green-700 font-medium"
        >
          عرض الكل
        </button>
      </div>
      
      <div className="space-y-4">
        {applications.length > 0 ? (
          applications.map((application, index) => (
            <ApplicationListItem 
              key={index} 
              application={application} 
            />
          ))
        ) : (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">لا توجد طلبات توظيف حديثة</p>
            <button 
              onClick={() => router.push('/admin/jobs/create')}
              className="mt-2 text-green-600 hover:text-green-700 text-sm font-medium"
            >
              إنشاء وظيفة جديدة
            </button>
          </div>
        )}
      </div>
    </div>
  );
}