"use client";

import React from "react";
import RecommendationButtons from "./RecommendationButtons";
import { Loader2 } from "lucide-react";
import Button from "@/components/shared/ui/Button";

export default function FeedbackForm({ formData, setFormData, submitting }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
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
          onChange={(e) =>
            setFormData({ ...formData, technicalNotes: e.target.value })
          }
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={6}
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
          onChange={(e) =>
            setFormData({ ...formData, strengths: e.target.value })
          }
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={3}
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
          onChange={(e) =>
            setFormData({ ...formData, weaknesses: e.target.value })
          }
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={3}
          placeholder="ما هي المجالات التي يمكن للمرشح تحسينها؟"
        />
      </div>
      {/* Overall Score */}
      <div className="mb-6" dir="rtl">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          التقييم العام (من 1 إلى 10)
        </label>

        <div className="flex items-center gap-4 relative">
          <div className="flex-1 relative">
            {/* Slider Input */}
            <input
              type="range"
              min={1}
              max={10}
              value={formData.overallScore}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  overallScore: parseInt(e.target.value),
                })
              }
              className="w-full h-4 rounded-full appearance-none cursor-pointer transition-all focus:outline-none"
              style={{
                background: `linear-gradient(to left, #1D3D1E 0%, #1D3D1E ${
                  ((formData.overallScore - 1) / 9) * 100
                }%, #e5e7eb ${((formData.overallScore - 1) / 9) * 100}%, #e5e7eb 100%)`,
              }}
            />

            {/* Value Bubble above thumb */}
            <div
              className="absolute -top-7 font-semibold text-white bg-[#B38025] px-2 py-1 rounded-full shadow-lg text-sm transform -translate-x-1/2 transition-all pointer-events-none"
              style={{
                left: `calc(${100 - ((formData.overallScore - 1) / 9) * 100}%)`,
              }}
            >
              {formData.overallScore}
            </div>

            {/* Custom Thumb styling */}
            <style jsx>{`
              input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 20px;
                height: 20px;
                background: #b38025; /* same as bubble */
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                border: 2px solid #fff;
                transition: transform 0.2s;
              }

              input[type="range"]::-moz-range-thumb {
                width: 20px;
                height: 20px;
                background: #b38025;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                border: 2px solid #fff;
                transition: transform 0.2s;
              }
            `}</style>
          </div>
        </div>

        {/* Labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
          <span>ضعيف</span>
          <span>ممتاز</span>
        </div>
      </div>

      <RecommendationButtons
        value={formData.recommendation}
        onChange={(val) => setFormData({ ...formData, recommendation: val })}
      />

      {/* Submit Button */}
      <div className="flex gap-4 mt-4">
        <Button
          type="submit"
          disabled={submitting}
          className="flex-1 bg-gradient-to-r from-blue-300 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-300 hover:to-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              جاري الإرسال...
            </>
          ) : (
            "إرسال التقييم"
          )}
        </Button>
      </div>

      <p className="text-sm text-gray-500 text-center mt-4">
        بإرسالك هذا التقييم، سيتم إبلاغ فريق التوظيف بملاحظاتك
      </p>
    </div>
  );
}
