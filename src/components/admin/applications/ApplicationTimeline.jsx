//components/admin/applications/ApplicationTimeline.jsx 
import { Calendar, User, Clock, CheckCircle, XCircle, MessageCircle, Edit, FileText } from "lucide-react";

const getActionIcon = (action) => {
  const icons = {
    created: FileText,
    updated: Edit,
    interview_scheduled: Calendar,
    interview_completed: CheckCircle,
    hired: CheckCircle,
    rejected: XCircle,
    status_changed: MessageCircle
  };
  return icons[action] || MessageCircle;
};

const getActionText = (action) => {
  const texts = {
    created: "تم تقديم الطلب",
    updated: "تم التحديث",
    interview_scheduled: "تم جدولة مقابلة",
    interview_completed: "تم إكمال المقابلة",
    hired: "تم التوظيف",
    rejected: "تم الرفض",
    status_changed: "تم تغيير الحالة"
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
    hired: "bg-green-100 text-green-800"
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
    hired: "مقبول"
  };
  return texts[status] || status;
};

// Component to display detailed changes
const ChangeDetails = ({ changes = [] }) => {
  if (!changes || changes.length === 0) return null;

  return (
    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
        <Edit className="w-3 h-3 ml-1" />
        التغييرات المطبقة:
      </div>
      <div className="space-y-2">
        {changes.map((change, index) => (
          <div key={index} className="text-sm">
            <div className="font-medium text-gray-800">{change.label}:</div>
            {change.field === 'status' ? (
              <div className="flex items-center space-x-2 space-x-reverse text-gray-600">
                <span className="line-through text-red-500">{getStatusText(change.from)}</span>
                <span>→</span>
                <span className="text-green-600 font-medium">{getStatusText(change.to)}</span>
              </div>
            ) : change.field === 'interviewScore' ? (
              <div className="flex items-center space-x-2 space-x-reverse text-gray-600">
                <span className="line-through text-red-500">{change.from || 'غير محدد'}</span>
                <span>→</span>
                <span className="text-green-600 font-medium">{change.to}/10</span>
              </div>
            ) : change.field.includes('Notes') || change.field.includes('Feedback') ? (
              <div className="text-gray-600">
                {change.to && change.to.length > 100 
                  ? `${change.to.substring(0, 100)}...` 
                  : change.to || 'تمت الإضافة'
                }
              </div>
            ) : change.field.includes('interviewDate') || change.field.includes('interviewTime') ? (
              <div className="flex items-center space-x-2 space-x-reverse text-gray-600">
                <span className="line-through text-red-500">{change.from || 'غير محدد'}</span>
                <span>→</span>
                <span className="text-green-600 font-medium">{change.to}</span>
              </div>
            ) : (
              <div className="text-gray-600">تم التحديث</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
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

  const sortedTimeline = [...timeline].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">سجل التقدم</h3>
      
      <div className="relative">
        <div className="absolute right-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        <div className="space-y-6">
          {sortedTimeline.map((event, index) => {
            const IconComponent = getActionIcon(event.action);
            
            return (
              <div key={index} className="relative flex items-start space-x-4 space-x-reverse group">
                {/* Timeline dot */}
                <div className={`relative z-10 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                  event.status === 'hired' ? 'bg-green-500' :
                  event.status === 'rejected' ? 'bg-red-500' :
                  event.status === 'interview_scheduled' ? 'bg-purple-500' :
                  event.status === 'interview_completed' ? 'bg-indigo-500' :
                  'bg-[#B38025]'
                }`}>
                  <IconComponent className="w-3 h-3 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="font-medium text-gray-900">
                        {getActionText(event.action)}
                      </span>
                      {event.status && (
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                          {getStatusText(event.status)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-3 h-3 ml-1" />
                      {new Date(event.date).toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>

                  {event.notes && (
                    <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                      {event.notes}
                    </p>
                  )}

                  {/* Show detailed changes */}
                  {event.changes && event.changes.length > 0 && (
                    <ChangeDetails changes={event.changes} />
                  )}

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