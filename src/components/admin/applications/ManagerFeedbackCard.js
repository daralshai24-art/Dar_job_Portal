"use client";

import { useState } from "react";
import { Send, Mail, CheckCircle, Copy, Eye } from "lucide-react";
import Button from "@/components/shared/ui/Button";

export function ManagerFeedbackCard({ application }) {
  const [isOpen, setIsOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sentLink, setSentLink] = useState(null);

  const [formData, setFormData] = useState({
    managerEmail: "",
    managerName: "",
    managerRole: "technical_reviewer",
    message: "",
    expiresInDays: 7,
  });

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!formData.managerEmail || !formData.managerName) {
      alert("الرجاء إدخال البريد الإلكتروني واسم المدير");
      return;
    }
    setSending(true);
    try {
      const response = await fetch(
        `/api/applications/${application._id}/send-feedback-request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "فشل إرسال الطلب");
        return;
      }
      setSentLink(data.feedbackUrl);
      setFormData({
        managerEmail: "",
        managerName: "",
        managerRole: "technical_reviewer",
        message: "",
        expiresInDays: 7,
      });
      alert("تم إرسال طلب التقييم بنجاح!");
    } catch (error) {
      console.error(error);
      alert("حدث خطأ في إرسال الطلب");
    } finally {
      setSending(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("تم نسخ الرابط!");
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow border p-4 w-full max-w-full">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg shrink-0">
            <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="truncate">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
              طلب تقييم من مدير
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
              إرسال رابط لإضافة التقييم بدون تسجيل دخول
            </p>
          </div>
        </div>

        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full sm:w-auto flex justify-center gap-1 sm:gap-2 mt-2 sm:mt-0"
        >
          <Send className="w-4 h-4" />
          <span className="truncate">إرسال طلب</span>
        </Button>
      </div>

      {/* Existing Feedbacks */}
      {application.managerFeedbacks?.length > 0 && (
        <div className="mb-4 space-y-2 overflow-x-auto">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            التقييمات المستلمة:
          </h4>
          {application.managerFeedbacks.map((feedback, idx) => (
            <div
              key={idx}
              className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 min-w-full"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-1 sm:gap-2 flex-wrap">
                <div className="flex items-center gap-1 flex-wrap min-w-0">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  <span className="font-medium text-gray-900 dark:text-white truncate">
                    {feedback.managerName}
                  </span>
                  <span className="text-xs text-gray-500 truncate">
                    ({feedback.managerRole})
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-sm font-semibold text-purple-600">
                    {feedback.overallScore}/10
                  </span>
                  {feedback.recommendation === "recommend" && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      موصى به
                    </span>
                  )}
                  {feedback.recommendation === "not_recommend" && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                      غير موصى به
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {feedback.technicalNotes}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(feedback.submittedAt).toLocaleDateString("ar-SA")}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Send Request Form */}
      {isOpen && (
        <form onSubmit={handleSendRequest} className="mt-4 space-y-4 border-t pt-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                اسم المدير *
              </label>
              <input
                type="text"
                value={formData.managerName}
                onChange={(e) =>
                  setFormData({ ...formData, managerName: e.target.value })
                }
                className="w-full px-2 sm:px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm sm:text-base"
                placeholder="اسم المدير"
                required
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                البريد الإلكتروني *
              </label>
              <input
                type="email"
                value={formData.managerEmail}
                onChange={(e) =>
                  setFormData({ ...formData, managerEmail: e.target.value })
                }
                className="w-full px-2 sm:px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm sm:text-base"
                placeholder="manager@company.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                الدور
              </label>
              <select
                value={formData.managerRole}
                onChange={(e) =>
                  setFormData({ ...formData, managerRole: e.target.value })
                }
                className="w-full px-2 sm:px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm sm:text-base"
              >
                <option value="technical_reviewer">مراجع فني</option>
                <option value="hr_reviewer">مراجع موارد بشرية</option>
                <option value="hiring_manager">مدير التوظيف</option>
                <option value="department_head">رئيس القسم</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                صلاحية الرابط (أيام)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={formData.expiresInDays}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    expiresInDays: parseInt(e.target.value),
                  })
                }
                className="w-full px-2 sm:px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm sm:text-base"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              رسالة إضافية (اختياري)
            </label>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full px-2 sm:px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none text-sm sm:text-base"
              rows="3"
              placeholder="أضف أي ملاحظات أو تعليمات للمدير..."
            />
          </div>

          {sentLink && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border rounded-lg border-green-200 dark:border-green-800 overflow-x-auto">
              <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
                  <input
                    type="text"
                    value={sentLink}
                    readOnly
                    className="flex-1 px-2 py-1 text-sm bg-white dark:bg-gray-800 border rounded border-green-300 dark:border-green-700 truncate"
                  />
                  <Button type="button" onClick={() => copyToClipboard(sentLink)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <a
                    href={sentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-800 rounded"
                  >
                    <Eye className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <Button type="submit" disabled={sending} className="flex-1 justify-center">
              {sending ? (
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  جاري الإرسال...
                </div>
              ) : (
                <div className="flex items-center gap-2 justify-center">
                  <Send className="w-4 h-4" />
                  إرسال طلب التقييم
                </div>
              )}
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              variant="danger"
              className="flex-1 justify-center"
            >
              إلغاء
            </Button>
          </div>

        </form>
      )}
    </div>
  );
}
