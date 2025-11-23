// src/app/feedback/[token]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle, AlertCircle, Clock, Loader2 } from "lucide-react";

export default function FeedbackPage() {
  const params = useParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tokenData, setTokenData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    technicalNotes: "",
    strengths: "",
    weaknesses: "",
    recommendation: "pending", // pending, recommend, not_recommend
    overallScore: 5
  });

  // Verify token on mount
  useEffect(() => {
    verifyToken();
  }, [params.token]);

  const verifyToken = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/feedback/verify/${params.token}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "رابط غير صالح");
        return;
      }

      setTokenData(data);
    } catch (err) {
      setError("حدث خطأ في التحقق من الرابط");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.technicalNotes.trim()) {
      alert("يرجى إضافة ملاحظاتك");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/feedback/submit/${params.token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "حدث خطأ في الإرسال");
        return;
      }

      setSuccess(true);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    } catch (err) {
      alert("حدث خطأ في الإرسال");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">جاري التحقق من الرابط...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">رابط غير صالح</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">تم الإرسال بنجاح!</h2>
          <p className="text-gray-600 mb-4">شكراً لك على وقتك وملاحظاتك القيمة</p>
          <div className="animate-pulse text-sm text-gray-500">
            سيتم تحويلك تلقائياً...
          </div>
        </div>
      </div>
    );
  }

  const application = tokenData.application;
  const job = application.jobId;
  const token = tokenData.token;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                تقييم المرشح
              </h1>
              <p className="text-gray-600">
                مرحباً <span className="font-semibold">{token.managerName}</span>
              </p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-lg text-sm">
                <Clock className="w-4 h-4" />
                <span>
                  ينتهي في {Math.ceil((new Date(token.expiresAt) - new Date()) / (1000 * 60 * 60 * 24))} أيام
                </span>
              </div>
            </div>
          </div>

          {/* Candidate Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">معلومات المرشح</h3>
              <p className="text-lg font-semibold text-gray-900">{application.name}</p>
              <p className="text-sm text-gray-600">{application.email}</p>
              <p className="text-sm text-gray-600">{application.phone}</p>
              <p className="text-sm text-gray-600">{application.city}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">معلومات الوظيفة</h3>
              <p className="text-lg font-semibold text-gray-900">{job.title}</p>
              <p className="text-sm text-gray-600">{job.location}</p>
              <p className="text-sm text-gray-600">
                {job.category?.name || "غير محدد"}
              </p>
            </div>
          </div>

          {/* CV Download */}
          {application.cv && (
            <div className="mt-4">
              <a
                href={`/api/cv/${application._id}`}
                target="_blank"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                📄 تحميل السيرة الذاتية
              </a>
            </div>
          )}
        </div>

        {/* Feedback Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            إضافة التقييم والملاحظات
          </h2>

          {/* Technical Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الملاحظات الفنية <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.technicalNotes}
              onChange={(e) => setFormData({ ...formData, technicalNotes: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="6"
              placeholder="اكتب ملاحظاتك حول المرشح، المهارات الفنية، الخبرة، إلخ..."
              required
            />
          </div>

          {/* Strengths */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نقاط القوة
            </label>
            <textarea
              value={formData.strengths}
              onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="3"
              placeholder="ما هي نقاط القوة الرئيسية للمرشح؟"
            />
          </div>

          {/* Weaknesses */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نقاط التحسين
            </label>
            <textarea
              value={formData.weaknesses}
              onChange={(e) => setFormData({ ...formData, weaknesses: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="3"
              placeholder="ما هي المجالات التي يمكن للمرشح تحسينها؟"
            />
          </div>

          {/* Overall Score */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              التقييم العام (من 1 إلى 10)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="10"
                value={formData.overallScore}
                onChange={(e) => setFormData({ ...formData, overallScore: parseInt(e.target.value) })}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-2xl font-bold text-blue-600 w-12 text-center">
                {formData.overallScore}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>ضعيف</span>
              <span>ممتاز</span>
            </div>
          </div>

          {/* Recommendation */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              التوصية
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, recommendation: "recommend" })}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  formData.recommendation === "recommend"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-300 hover:border-green-300"
                }`}
              >
                <div className="text-2xl mb-1">✅</div>
                <div className="font-medium">أوصي بالتوظيف</div>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData({ ...formData, recommendation: "pending" })}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  formData.recommendation === "pending"
                    ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                    : "border-gray-300 hover:border-yellow-300"
                }`}
              >
                <div className="text-2xl mb-1">⏸️</div>
                <div className="font-medium">يحتاج مراجعة</div>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData({ ...formData, recommendation: "not_recommend" })}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  formData.recommendation === "not_recommend"
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-gray-300 hover:border-red-300"
                }`}
              >
                <div className="text-2xl mb-1">❌</div>
                <div className="font-medium">لا أوصي</div>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                "إرسال التقييم"
              )}
            </button>
          </div>

          <p className="text-sm text-gray-500 text-center mt-4">
            بإرسالك هذا التقييم، سيتم إبلاغ فريق التوظيف بملاحظاتك
          </p>
        </form>
      </div>
    </div>
  );
}