//src\components\feedback\FeedbackForm.jsx
"use client";

import { Loader2 } from "lucide-react";
import Button from "@/components/shared/ui/Button";

export default function FeedbackForm({
  formData,
  submitting,
  onChange,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        إضافة التقييم والملاحظات
      </h2>

      {/* Technical Notes */}
      <FormTextArea
        label="الملاحظات الفنية"
        required
        rows={6}
        placeholder="اكتب ملاحظاتك حول المرشح، المهارات الفنية، الخبرة، إلخ..."
        value={formData.technicalNotes}
        onChange={(v) => onChange("technicalNotes", v)}
      />

      {/* Strengths */}
      <FormTextArea
        label="نقاط القوة"
        rows={3}
        placeholder="ما هي نقاط القوة الرئيسية للمرشح؟"
        value={formData.strengths}
        onChange={(v) => onChange("strengths", v)}
      />

      {/* Weaknesses */}
      <FormTextArea
        label="نقاط التحسين"
        rows={3}
        placeholder="ما هي المجالات التي يمكن للمرشح تحسينها؟"
        value={formData.weaknesses}
        onChange={(v) => onChange("weaknesses", v)}
      />

      {/* Score */}
      <ScoreInput
        value={formData.overallScore}
        onChange={(v) => onChange("overallScore", v)}
      />

      {/* Recommendation */}
      <RecommendationSelector
        value={formData.recommendation}
        onChange={(v) => onChange("recommendation", v)}
      />

      <div className="flex gap-4 mt-6">
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
  );
}

/* ================= Small reusable sub-components ================= */

function FormTextArea({ label, onChange, value, required, ...props }) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        {...props}
      />
    </div>
  );
}

function ScoreInput({ value, onChange }) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        التقييم العام (من 1 إلى 10)
      </label>

      <div className="flex items-center gap-4">
        <input
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-2xl font-bold text-blue-600 w-12 text-center">
          {value}
        </span>
      </div>

      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>ضعيف</span>
        <span>ممتاز</span>
      </div>
    </div>
  );
}

function RecommendationSelector({ value, onChange }) {
  const options = [
    { id: "recommend", label: "أوصي بالتوظيف", icon: "✅", color: "green" },
    { id: "pending", label: "يحتاج مراجعة", icon: "⏸️", color: "yellow" },
    { id: "not_recommend", label: "لا أوصي", icon: "❌", color: "red" },
  ];

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        التوصية
      </label>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`p-4 border-2 rounded-lg text-center transition-all ${
              value === opt.id
                ? `border-${opt.color}-500 bg-${opt.color}-50 text-${opt.color}-700`
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <div className="text-2xl mb-1">{opt.icon}</div>
            <div className="font-medium">{opt.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
