import { Calendar, Clock } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/shared/ui/Card";
import Select from "@/components/shared/ui/Select";
import Input from "@/components/shared/ui/Input";
import Button from "@/components/shared/ui/Button";

const getStatusColor = (status) => {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800",
    reviewed: "bg-blue-100 text-blue-800",
    interview_scheduled: "bg-purple-100 text-purple-800",
    interview_completed: "bg-indigo-100 text-indigo-800",
    rejected: "bg-red-100 text-red-800",
    hired: "bg-green-100 text-green-800"
  };
  return colors[status] || colors.pending;
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

export const StatusCard = ({ 
  application, 
  formData, 
  editing, 
  onFormChange, 
  onScheduleInterview,
  saving 
}) => {
  const statusOptions = [
    { value: "pending", label: "قيد المراجعة" },
    { value: "reviewed", label: "تم المراجعة" },
    { value: "interview_scheduled", label: "مقابلة مجدولة" },
    { value: "interview_completed", label: "تمت المقابلة" },
    { value: "rejected", label: "مرفوض" },
    { value: "hired", label: "مقبول" }
  ];

  const interviewTypeOptions = [
    { value: "in_person", label: "مقابلة شخصية" },
    { value: "online", label: "مقابلة أونلاين" },
    { value: "phone", label: "مقابلة هاتفية" }
  ];

  return (
    <Card>
      <CardHeader title="حالة الطلب والمقابلة" />
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
            {editing ? (
              <Select
                value={formData.status}
                onChange={(e) => onFormChange("status", e.target.value)}
                options={statusOptions}
              />
            ) : (
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                {getStatusText(application.status)}
              </span>
            )}
          </div>

          {/* Interview Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ المقابلة</label>
            {editing ? (
              <Input
                type="date"
                value={formData.interviewDate}
                onChange={(e) => onFormChange("interviewDate", e.target.value)}
                icon={Calendar}
              />
            ) : (
              <div className="flex items-center">
                <Calendar size={16} className="ml-1 text-gray-500" />
                {application.interviewDate ? new Date(application.interviewDate).toLocaleDateString('ar-EG') : "لم يتم التحديد"}
              </div>
            )}
          </div>

          {/* Interview Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">وقت المقابلة</label>
            {editing ? (
              <Input
                type="time"
                value={formData.interviewTime}
                onChange={(e) => onFormChange("interviewTime", e.target.value)}
                icon={Clock}
              />
            ) : (
              <div className="flex items-center">
                <Clock size={16} className="ml-1 text-gray-500" />
                {application.interviewTime || "لم يتم التحديد"}
              </div>
            )}
          </div>

          {/* Interview Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">نوع المقابلة</label>
            {editing ? (
              <Select
                value={formData.interviewType}
                onChange={(e) => onFormChange("interviewType", e.target.value)}
                options={interviewTypeOptions}
              />
            ) : (
              <span>
                {formData.interviewType === 'in_person' ? 'مقابلة شخصية' : 
                 formData.interviewType === 'online' ? 'مقابلة أونلاين' : 'مقابلة هاتفية'}
              </span>
            )}
          </div>
        </div>

        {/* Rejection Reason - Shows when status is rejected */}
        {formData.status === 'rejected' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              سبب الرفض <span className="text-red-500">*</span>
            </label>
            {editing ? (
              <textarea
                value={formData.rejectionReason || ''}
                onChange={(e) => onFormChange("rejectionReason", e.target.value)}
                placeholder="يرجى توضيح سبب رفض الطلب..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-gray-700">
                {application.rejectionReason || 'لم يتم تحديد سبب الرفض'}
              </div>
            )}
          </div>
        )}

        {/* Interview Location/Link */}
        {editing && (
          <Input
            label={formData.interviewType === 'online' ? 'رابط المقابلة' : 'موقع المقابلة'}
            value={formData.interviewLocation}
            onChange={(e) => onFormChange("interviewLocation", e.target.value)}
            placeholder={formData.interviewType === 'online' ? 'https://meet.google.com/...' : 'العنوان الكامل للمقابلة'}
          />
        )}

        {/* Schedule Interview Button */}
        {/* {editing && formData.interviewDate && formData.interviewTime && (
          <Button
            onClick={onScheduleInterview}
            loading={saving}
            className="w-full"
          >
            تأكيد جدولة المقابلة
          </Button>
        )} */}
      </CardContent>
    </Card>
  );
};