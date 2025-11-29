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
  const sortedTimeline = [...timeline].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="space-y-6 w-full overflow-x-auto">
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
        سجل التقدم
      </h3>

      {sortedTimeline.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <MessageCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p>لا توجد أحداث في السجل حتى الآن</p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-10">
          {/* Timeline vertical line */}
          <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-gray-200 sm:right-auto sm:left-4"></div>

          <div className="space-y-6">
            {sortedTimeline.map((event, index) => {
              const IconComponent = getActionIcon(event.action);
              const performer =
                typeof event.performedBy === "object"
                  ? event.performedBy?.name ||
                    event.performedBy?.email ||
                    "غير معروف"
                  : "غير معروف";

              return (
                <div
                  key={index}
                  className="relative flex flex-col sm:flex-row sm:items-start gap-2"
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

                  {/* Event content */}
                  <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow min-w-[250px]">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
    <div className="flex flex-wrap items-center gap-2 min-w-0">
      <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">
        {getActionText(event.action)}
      </span>
      {event.status && (
        <span
          className={`inline-flex px-3 py-1.5 text-xs sm:text-sm font-medium rounded-full ${getStatusColor(
            event.status
          )} truncate`}
        >
          {getStatusText(event.status)}
        </span>
      )}
    </div>
    <div className="flex items-center text-xs sm:text-sm text-gray-500 gap-1 mt-1 sm:mt-0">
      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
      <span className="truncate">{formatDate(event.date)}</span>
    </div>
  </div>

  {event.notes && (
    <p className="text-sm sm:text-base text-gray-600 leading-relaxed mt-2 truncate">
      {event.notes}
    </p>
  )}

  <div className="flex items-center text-xs sm:text-sm text-gray-500 mt-2 gap-2 flex-wrap">
    <User className="w-3 h-3 sm:w-4 sm:h-4" />
    <span className="truncate">
      بواسطة: <span className="font-medium">{performer}</span>
    </span>
  </div>
</div>

                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
