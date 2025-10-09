// components/admin/jobs/JobActions.js
import { Eye, Users, Edit, Trash2, MoreHorizontal, Power } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { JOB_STATUS } from "@/lib/constants";

export const JobActions = ({ 
  job, 
  onDelete, 
  onToggleStatus, 
  actionLoading 
}) => {
  const router = useRouter();
  const [showMoreActions, setShowMoreActions] = useState(false);

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      'draft': 'active',
      'active': 'inactive', 
      'inactive': 'active',
      'closed': 'draft'
    };
    return statusFlow[currentStatus] || 'active';
  };

  const getStatusLabel = (currentStatus) => {
    const nextStatus = getNextStatus(currentStatus);
    const nextStatusConfig = JOB_STATUS[nextStatus.toUpperCase()];
    return currentStatus === 'active' ? 'تعطيل' : `تفعيل (${nextStatusConfig.label})`;
  };

  const getStatusMessage = (currentStatus) => {
    const nextStatus = getNextStatus(currentStatus);
    const statusConfig = JOB_STATUS[nextStatus.toUpperCase()];
    
    const messages = {
      'active': `سيتم إيقاف الوظيفة "${job.title}" ولن تظهر للمستخدمين.`,
      'inactive': `سيتم تفعيل الوظيفة "${job.title}" وستظهر للمستخدمين.`,
      'draft': `سيتم نشر الوظيفة "${job.title}" وستظهر للمستخدمين.`
    };

    return messages[currentStatus] || `سيتم تغيير حالة الوظيفة إلى ${statusConfig.label}.`;
  };

  const handleDeleteClick = () => {
    onDelete(job._id, job.title);
    setShowMoreActions(false);
  };

  const handleStatusClick = () => {
    onToggleStatus(job._id, job.status);
    setShowMoreActions(false);
  };

  const mainActions = [
    {
      icon: Eye,
      label: "عرض الوظيفة",
      color: "text-blue-600 hover:bg-blue-50",
      onClick: () => router.push(`/admin/jobs/${job._id}`)
    },
    {
      icon: Users,
      label: "عرض الطلبات",
      color: "text-purple-600 hover:bg-purple-50",
      onClick: () => router.push(`/admin/jobs/${job._id}/applications`)
    }
  ];

  const moreActions = [
    {
      icon: Edit,
      label: "تعديل الوظيفة",
      color: "text-yellow-600 hover:bg-yellow-50",
      onClick: () => router.push(`/admin/jobs/${job._id}/edit`),
      disabled: actionLoading === job._id
    },
    {
      icon: Power,
      label: getStatusLabel(job.status),
      color: job.status === 'active' ? "text-orange-600 hover:bg-orange-50" : "text-green-600 hover:bg-green-50",
      onClick: handleStatusClick,
      disabled: actionLoading === job._id
    },
    {
      icon: Trash2,
      label: "حذف الوظيفة",
      color: "text-red-600 hover:bg-red-50",
      onClick: handleDeleteClick,
      disabled: actionLoading === job._id
    }
  ];

  return (
    <div className="flex items-center justify-end gap-1">
      {/* Main Actions - Always Visible */}
      {mainActions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          disabled={action.disabled}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${action.color} ${
            action.disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          title={action.label}
        >
          <action.icon size={16} />
        </button>
      ))}
      
      {/* More Actions Dropdown */}
      <div className="relative">
        <button 
          onClick={() => setShowMoreActions(!showMoreActions)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
        >
          <MoreHorizontal size={16} />
        </button>

        {/* Dropdown Menu */}
        {showMoreActions && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowMoreActions(false)}
            />
            
            {/* Menu */}
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
              {moreActions.map((action, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick();
                  }}
                  disabled={action.disabled}
                  className={`flex items-center w-full px-4 py-2 text-sm text-right transition-colors ${action.color} ${
                    action.disabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <action.icon size={16} className="ml-2" />
                  {action.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};