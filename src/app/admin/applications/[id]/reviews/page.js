"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApplication } from "@/hooks/useApplication";
import {
  ArrowLeft,
  Send,
  Mail,
  CheckCircle,
  Copy,
  Eye,
  Loader2,
} from "lucide-react";
import Button from "@/components/shared/ui/Button";
import SelectRtl from "@/components/shared/ui/SelectRtl";
import { toast } from "react-hot-toast";
import { COMMITTEE_ROLES } from "@/lib/constants";
import PendingReviewersList from "./PendingReviewersList";

export default function ApplicationReviewsPage() {
  const params = useParams();
  const router = useRouter();
  const { application, loading, fetchApplication } = useApplication(params.id);

  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        // Fetch users (assuming /api/users returns { data: [...] } or just [...])
        // We'll try to fetch all active users
        const res = await fetch("/api/users?limit=100"); // Adjust limit as needed
        const data = await res.json();
        if (res.ok) {
          // API returns direct array [{}, {}]
          if (Array.isArray(data)) {
            setUsers(data);
          } else {
            setUsers(data.users || data.data || []);
          }
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setIsLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  const [sending, setSending] = useState(false);
  const [sentLink, setSentLink] = useState(null);
  const [formData, setFormData] = useState({
    managerEmail: "",
    managerName: "",
    managerRole: "technical_reviewer",
    message: "",
    expiresInDays: 7,
  });

  if (loading)
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (!application)
    return (
      <div className="p-12 text-center text-red-500">Application not found</div>
    );

  const handleSendRequest = async (e) => {
    e.preventDefault();
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
      if (!response.ok) throw new Error(data.error || "Failed to send request");

      setSentLink(data.feedbackUrl);
      setFormData((prev) => ({ ...prev, managerEmail: "", managerName: "" })); // Clear fields
      toast.success("تم إرسال طلب التقييم بنجاح");
      fetchApplication(); // Refresh to potentially show new pending status if we tracked it
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSending(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("تم نسخ الرابط");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            إدارة التقييمات والمراجعات
          </h1>
          <p className="text-gray-500">
            للطلب: {application.name} - {application.jobId?.title}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Send Request Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="font-bold flex items-center gap-2 mb-4 text-gray-800 border-b pb-2">
              <Send className="w-5 h-5 text-indigo-600" />
              إرسال طلب تقييم جديد
            </h3>

            <form onSubmit={handleSendRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  اختر المدير
                </label>
                <SelectRtl
                  placeholder="ابحث عن المدير..."
                  options={users.map((u) => ({
                    value: u.email,
                    label: u.name, // Display name only as requested
                    user: u,
                  }))}
                  value={formData.managerEmail}
                  onChange={(email) => {
                    const selectedUser = users.find((u) => u.email === email);
                    if (selectedUser) {
                      setFormData((prev) => ({
                        ...prev,
                        managerEmail: selectedUser.email,
                        managerName: selectedUser.name,
                        // Intelligent role selection based on user role
                        managerRole:
                          selectedUser.role === "hr_manager"
                            ? "hr_reviewer"
                            : selectedUser.role === "manager"
                              ? "hiring_manager"
                              : "technical_reviewer",
                      }));
                    } else {
                      setFormData((prev) => ({
                        ...prev,
                        managerEmail: email,
                        managerName: "",
                      }));
                    }
                  }}
                  isSearchable
                  required
                  className="mb-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  البريد الإلكتروني
                </label>
                <input
                  readOnly
                  type="email"
                  className="w-full p-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  value={formData.managerEmail}
                  placeholder="سيتم تعبئته تلقائياً عند اختيار المدير"
                />
              </div>

              {/* Role selection hidden as requested - auto-assigned based on user type */}

              <div>
                <label className="block text-sm font-medium mb-1">
                  رسالة (اختياري)
                </label>
                <textarea
                  className="w-full p-2 border rounded-lg"
                  rows="3"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                />
              </div>

              <Button
                type="submit"
                disabled={sending}
                className="w-full justify-center"
              >
                {sending ? <Loader2 className="animate-spin" /> : "إرسال الطلب"}
              </Button>
            </form>

            {sentLink && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-800 font-semibold mb-2">
                  تم إنشاء الرابط بنجاح:
                </p>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={sentLink}
                    className="flex-1 text-xs p-1 border rounded bg-white"
                  />
                  <button
                    onClick={() => copyToClipboard(sentLink)}
                    className="p-1 hover:bg-green-100 rounded"
                  >
                    <Copy className="w-4 h-4 text-green-600" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Reviews List & Pending */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Reviewers Section (NEW) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
            <h3 className="font-bold flex items-center gap-2 mb-4 text-gray-800 border-b pb-2">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              بانتظار التقييم
              <span className="text-sm font-normal text-gray-500 mr-2">
                (المراجعين الذين لم يرسلوا تقييمهم بعد)
              </span>
            </h3>

            {/* We need to fetch committee members to show this list. 
                            Since application object might not have full committee members, 
                            we will fetch them on mount. */}
            <PendingReviewersList applicationId={application._id} />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="font-bold flex items-center gap-2 mb-6 text-gray-800 border-b pb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              التقييمات المستلمة
              <span className="text-sm font-normal text-gray-500 mr-2">
                ({application.managerFeedbacks?.length || 0})
              </span>
            </h3>

            {!application.managerFeedbacks?.length ? (
              <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-lg border border-dashed">
                لا توجد تقييمات حتى الآن
              </div>
            ) : (
              <div className="space-y-4">
                {application.managerFeedbacks.map((feedback, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                          {feedback.managerName?.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">
                            {feedback.managerName}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {feedback.managerEmail} • {feedback.managerRole}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="bg-white px-2 py-1 rounded border text-sm font-bold shadow-sm">
                          {feedback.overallScore}/10
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(feedback.submittedAt).toLocaleDateString(
                            "ar-SA"
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="pl-13 space-y-3">
                      {feedback.recommendation && (
                        <div
                          className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 
                                                    ${feedback.recommendation === 'recommend' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}"
                        >
                          {feedback.recommendation === "recommend"
                            ? "🟢 يوصي بالتوظيف"
                            : "🔴 لا يوصي بالتوظيف"}
                        </div>
                      )}

                      {feedback.technicalNotes && (
                        <div className="bg-white p-3 rounded border text-sm text-gray-700">
                          <strong className="block text-xs text-gray-500 mb-1">
                            الملاحظات الفنية:
                          </strong>
                          {feedback.technicalNotes}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        {feedback.strengths?.length > 0 && (
                          <div>
                            <strong className="block text-xs text-green-600 mb-1">
                              نقاط القوة:
                            </strong>
                            <ul className="list-disc list-inside text-xs text-gray-600">
                              {feedback.strengths.map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {feedback.weaknesses?.length > 0 && (
                          <div>
                            <strong className="block text-xs text-red-600 mb-1">
                              نقاط الضعف:
                            </strong>
                            <ul className="list-disc list-inside text-xs text-gray-600">
                              {feedback.weaknesses.map((w, i) => (
                                <li key={i}>{w}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
