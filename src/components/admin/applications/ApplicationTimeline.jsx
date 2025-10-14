// components/admin/applications/ApplicationTimeline.jsx
import {
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle,
  MessageCircle,
  Edit,
  FileText,
  StickyNote,
  Star,
  Repeat,
} from "lucide-react";
import { formatDate12Hour } from "@/utils/formatDate12Hour";


const getActionIcon = (action) => {
  const icons = {
    created: FileText,
    updated: Edit,
    interview_scheduled: Calendar,
    interview_rescheduled: Repeat,
    interview_completed: CheckCircle,
    hired: CheckCircle,
    rejected: XCircle,
    status_changed: MessageCircle,
    notes_added: StickyNote,
    feedback_added: Star,
    score_added: Star,
  };
  return icons[action] || MessageCircle;
};

const getActionText = (action) => {
  const texts = {
    created: "تم تقديم الطلب",
    updated: "تم تحديث الطلب",
    interview_scheduled: "تم جدولة مقابلة",
    interview_rescheduled: "تم إعادة جدولة المقابلة",
    interview_completed: "تم إكمال المقابلة",
    hired: "تم التوظيف",
    rejected: "تم الرفض",
    status_changed: "تم تغيير الحالة",
    notes_added: "تمت إضافة ملاحظات",
    feedback_added: "تمت إضافة تقييم",
    score_added: "تمت إضافة نتيجة المقابلة",
  };
  return texts[action] || action;
};

const getStatusColor = (status) => {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800",
    reviewed: "bg-blue-100 text-blue-800",
    interview_scheduled: "bg-purple-100 text-purple-800",
    interview_completed: "bg-indigo-100 text-indigo-800",
    rejected: "bg-red-100 text-red-800",
    hired: "bg-green-100 text-green-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

const getStatusText = (status) => {
  const texts = {
    pending: "قيد المراجعة",
    reviewed: "تم المراجعة",
    interview_scheduled: "مقابلة مجدولة",
    interview_completed: "تمت المقابلة",
    rejected: "مرفوض",
    hired: "مقبول",
  };
  return texts[status] || status;
};

// --- New helper for better date formatting ---
const formatDate = (dateStr) => {
  if (!dateStr) return "غير محدد";
  return new Date(dateStr).toLocaleString("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const ApplicationTimeline = ({ timeline = [] }) => {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <MessageCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
        <p>لا توجد أحداث في السجل حتى الآن</p>
      </div>
    );
  }

  const sortedTimeline = [...timeline].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
        سجل التقدم
      </h3>

      <div className="relative">
        <div className="absolute right-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        <div className="space-y-6">
          {sortedTimeline.map((event, index) => {
            const IconComponent = getActionIcon(event.action);

            return (
              <div
                key={index}
                className="relative flex items-start space-x-3 space-x-reverse group"
              >
                {/* Timeline dot */}
                <div
                  className={`relative z-10 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    event.status === "hired"
                      ? "bg-green-500"
                      : event.status === "rejected"
                      ? "bg-red-500"
                      : event.status === "interview_scheduled"
                      ? "bg-purple-500"
                      : event.status === "interview_completed"
                      ? "bg-indigo-500"
                      : "bg-[#B38025]"
                  }`}
                >
                  <IconComponent className="w-3 h-3 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 bg-white rounded-lg border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-900">
                        {getActionText(event.action)}
                      </span>
                      {event.status && (
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            event.status
                          )}`}
                        >
                          {getStatusText(event.status)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 ml-1" />
                      {formatDate(event.date)}
                    </div>
                  </div>

                  {/* Notes or extra text */}
                 {event.action === "interview_rescheduled" && event.details ? (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      تم إعادة جدولة المقابلة من{" "}
                      <span className="text-red-500 font-medium">
                        {formatDate12Hour(event.details?.from)}
                      </span>{" "}
                      إلى{" "}
                      <span className="text-green-600 font-medium">
                        {formatDate12Hour(event.details?.to)}
                      </span>
                    </p>
                  ) : event.action === "score_added" ? (
                    <p className="text-sm text-gray-600">
                      تم إضافة نتيجة المقابلة:{" "}
                      <span className="font-bold text-green-700">
                        {event.score}/10
                      </span>
                    </p>
                  ) : event.notes ? (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {event.notes}
                    </p>
                  ) : event.action === "feedback_added" ? (
                    <p className="text-sm text-gray-600">تمت إضافة التقييم</p>
                  ) : event.action === "notes_added" ? (
                    <p className="text-sm text-gray-600">تمت إضافة الملاحظات</p>
                  ) : null}

                  {/* Performed By */}
                  {event.performedBy && (
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                      <User className="w-3 h-3 ml-1" />
                      بواسطة: {event.performedBy}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
