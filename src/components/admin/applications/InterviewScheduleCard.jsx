// ==================== INTERVIEW SCHEDULE CARD ====================
// src/components/admin/applications/InterviewScheduleCard.jsx

import { Calendar, Clock, MapPin, Video, Phone } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/shared/ui/Card";
import SelectRtl from "@/components/shared/ui/SelectRtl";
import Input from "@/components/shared/ui/Input";
import Button from "@/components/shared/ui/Button";

export const InterviewScheduleCard = ({
  application,
  formData,
  editing,
  onFormChange,
  onSchedule,
  onReschedule,
  onComplete,
  saving,
  isScheduled,
}) => {
  const interviewTypeOptions = [
    { value: "in_person", label: "مقابلة شخصية" },
    { value: "online", label: "مقابلة أونلاين" },

  ];

  const getInterviewTypeIcon = (type) => {
    const icons = {
      in_person: MapPin,
      online: Video,
      phone: Phone,
    };
    return icons[type] || MapPin;
  };

  const getInterviewTypeText = (type) => {
    const texts = {
      in_person: "مقابلة شخصية",
      online: "مقابلة أونلاين",
    };
    return texts[type] || type;
  };

  const canCompleteInterview =
    application.status === "interview_scheduled" && isScheduled;

  return (
    <Card>
      <CardHeader
        title={isScheduled ? "جدولة المقابلة" : "جدول مقابلة جديدة"}
      />
      <CardContent className="space-y-4">
        {/* ==================== Display Current Interview Details ==================== */}
        {!editing && isScheduled && (
          <div className="space-y-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center text-gray-700">
              <Calendar size={18} className="ml-2 text-purple-600" />
              <span className="font-medium">التاريخ:</span>
              <span className="mr-2">
                {new Date(application.interviewDate).toLocaleDateString("ar-EG")}
              </span>
            </div>
            <div className="flex items-center text-gray-700">
              <Clock size={18} className="ml-2 text-purple-600" />
              <span className="font-medium">الوقت:</span>
              <span className="mr-2">{application.interviewTime}</span>
            </div>
            <div className="flex items-center text-gray-700">
              {(() => {
                const Icon = getInterviewTypeIcon(application.interviewType);
                return <Icon size={18} className="ml-2 text-purple-600" />;
              })()}
              <span className="font-medium">النوع:</span>
              <span className="mr-2">
                {getInterviewTypeText(application.interviewType)}
              </span>
            </div>
            {application.interviewLocation && (
              <div className="flex items-start text-gray-700">
                <MapPin size={18} className="ml-2 mt-1 text-purple-600" />
                <div>
                  <span className="font-medium">
                    {application.interviewType === "online"
                      ? "الرابط:"
                      : "الموقع:"}
                  </span>
                  <p className="text-sm mt-1">{application.interviewLocation}</p>
                </div>
              </div>
            )}

            {/* Show Generated Meeting Link */}
            {application.meetingLink && (
              <div className="flex items-start text-gray-700 mt-2">
                <Video size={18} className="ml-2 mt-1 text-green-600" />
                <div>
                  <span className="font-medium block mb-1">رابط الاجتماع (فيديو):</span>
                  <a
                    href={application.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors text-sm font-bold border border-green-200"
                  >
                    انضم للاجتماع
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== Edit Interview Details ==================== */}
        {editing && (
          <div className="space-y-4">
            {/* Date + Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="تاريخ المقابلة"
                type="date"
                value={formData.interviewDate}
                onChange={(e) => onFormChange("interviewDate", e.target.value)}
              // icon={Calendar}
              />
              <Input
                label="وقت المقابلة"
                type="time"
                value={formData.interviewTime}
                onChange={(e) => onFormChange("interviewTime", e.target.value)}
              // icon={Clock}
              />
            </div>

            {/* Select for Interview Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع المقابلة
              </label>
              <SelectRtl
                value={formData.interviewType}
                onChange={(val) => onFormChange("interviewType", val)}
                options={interviewTypeOptions}
                placeholder="اختر نوع المقابلة"
                isSearchable={false}
              />
            </div>

            {/* Location / Link */}
            {/* Location / Link */}
            <div dir="ltr">
              <Input
                label={
                  formData.interviewType === "online"
                    ? "رابط المقابلة (يمكنك لصق رابط خارجي هنا)"
                    : "موقع المقابلة"
                }
                value={formData.interviewLocation}
                onChange={(e) => onFormChange("interviewLocation", e.target.value)}
                placeholder={
                  formData.interviewType === "online"
                    ? "https://..."
                    : "العنوان الكامل للمقابلة"
                }
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {isScheduled ? (
                <Button
                  onClick={onReschedule}
                  loading={saving}
                  className="flex-1"
                  variant="primary"
                >
                  إعادة جدولة المقابلة
                </Button>
              ) : (
                <Button
                  onClick={onSchedule}
                  loading={saving}
                  className="flex-1"
                  variant="primary"
                >
                  جدولة المقابلة
                </Button>
              )}
            </div>
          </div>
        )}

        {/* ==================== Complete Interview Button ==================== */}
        {!editing && canCompleteInterview && (
          <Button
            onClick={onComplete}
            loading={saving}
            className="w-full"
            variant="success"
          >
            تحديد المقابلة كمكتملة
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
