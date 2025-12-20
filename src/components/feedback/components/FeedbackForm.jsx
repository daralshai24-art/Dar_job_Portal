"use client";

import React, { useState } from "react";
import RecommendationButtons from "./RecommendationButtons";
import { Loader2, Star } from "lucide-react";
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



            {/* Overall Score */}
            <ScoreInput
                value={formData.overallScore}
                onChange={(val) => setFormData({ ...formData, overallScore: val })}
            />

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

function ScoreInput({ value, onChange }) {
    const [hoveredStar, setHoveredStar] = useState(0);

    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                التقييم العام
            </label>

            <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        className="focus:outline-none transition-transform hover:scale-110"
                    >
                        <Star
                            className={`w-8 h-8 ${star <= (hoveredStar || value)
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-100 text-gray-300"
                                }`}
                        />
                    </button>
                ))}
                <span className="mr-4 text-sm font-medium text-gray-600">
                    {value > 0 ? `${value} من 5` : "بدون تقييم"}
                </span>
            </div>

            <div className="flex justify-between text-xs text-gray-500 mt-2 max-w-[200px]">
                <span>ضعيف</span>
                <span>ممتاز</span>
            </div>
        </div>
    );
}
