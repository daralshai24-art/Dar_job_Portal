// src/components/admin/dashboard/StatusBadge.jsx
import { Clock, CheckCircle2, XCircle, Eye } from "lucide-react";

export default function StatusBadge({ status }) {
  const statusConfig = {
    pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
    approved: { color: "bg-green-100 text-green-800", icon: CheckCircle2 },
    rejected: { color: "bg-red-100 text-red-800", icon: XCircle },
    reviewed: { color: "bg-blue-100 text-blue-800", icon: Eye }
  };

  const config = statusConfig[status] || statusConfig.pending;
  const IconComponent = config.icon;

  const statusText = {
    'pending': 'في الانتظار',
    'approved': 'مقبول',
    'rejected': 'مرفوض',
    'reviewed': 'تم المراجعة'
  }[status] || 'في الانتظار';

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <IconComponent className="w-3 h-3 ml-1" />
      {statusText}
    </span>
  );
}