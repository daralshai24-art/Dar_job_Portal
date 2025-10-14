// ==================== STATUS CARD ====================
// src/components/admin/applications/StatusCard.jsx

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/shared/ui/Card";
import SelectRtl from "@/components/shared/ui/SelectRtl"; 
import Textarea from "@/components/shared/ui/Textarea";
import Button from "@/components/shared/ui/Button";
import { AlertCircle } from "lucide-react";

// ========== Helpers ==========
const getStatusColor = (status) => {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800",
    reviewed: "bg-blue-100 text-blue-800",
    interview_scheduled: "bg-purple-100 text-purple-800",
    interview_completed: "bg-indigo-100 text-indigo-800",
    rejected: "bg-red-100 text-red-800",
    hired: "bg-green-100 text-green-800",
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
    hired: "مقبول",
  };
  return texts[status] || status;
};

// ========== Main Component ==========
export const StatusCard = ({
  application,
  formData,
  editing,
  onFormChange,
  onStatusChange,
  saving,
}) => {
  const [localStatus, setLocalStatus] = useState(formData.status);

  const statusOptions = [
    { value: "pending", label: "قيد المراجعة" },
    { value: "reviewed", label: "تم المراجعة" },
    { value: "interview_scheduled", label: "مقابلة مجدولة" },
    { value: "interview_completed", label: "تمت المقابلة" },
    { value: "rejected", label: "مرفوض" },
    { value: "hired", label: "مقبول" },
  ];

  const handleStatusChange = (value) => {
    setLocalStatus(value);
    onFormChange("status", value);
  };

  const handleRejectionReasonChange = (e) => {
    onFormChange("rejectionReason", e.target.value);
  };

  const handleStatusSubmit = () => {
    // Just call the handler - validation is done in the hook
    onStatusChange(formData.status);
  };

  // Keep local state synced with external form data
  useEffect(() => {
    setLocalStatus(formData.status);
  }, [formData.status]);

  return (
    <Card>
      <CardHeader title="حالة الطلب" />

      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الحالة الحالية
          </label>

          {editing ? (
            <div className="space-y-4">
              {/* Reusable RTL Select */}
              <SelectRtl
                value={localStatus}
                onChange={handleStatusChange}
                options={statusOptions}
                placeholder="اختر الحالة"
                isSearchable={false}
              />

              {/* Rejection Reason - Shows when status is rejected */}
              {formData.status === "rejected" && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    سبب الرفض <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={formData.rejectionReason || ""}
                    onChange={handleRejectionReasonChange}
                    placeholder="يرجى توضيح سبب رفض الطلب بشكل واضح..."
                    rows={4}
                    className="w-full"
                  />
                  {!formData.rejectionReason?.trim() && (
                    <div className="flex items-center mt-2 text-red-600 text-sm">
                      <AlertCircle size={16} className="ml-1" />
                      سبب الرفض مطلوب
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleStatusSubmit}
                loading={saving}
                disabled={formData.status === application?.status}
                className="w-full"
              >
                تحديث الحالة
              </Button>
            </div>
          ) : (
            <div>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  application?.status
                )}`}
              >
                {getStatusText(application?.status)}
              </span>

              {/* Show rejection reason when rejected */}
              {application?.status === "rejected" &&
                application?.rejectionReason && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm font-medium text-red-800 mb-1">
                      سبب الرفض:
                    </p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {application.rejectionReason}
                    </p>
                  </div>
                )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};