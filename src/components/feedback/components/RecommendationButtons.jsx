// src/components/feedback/components/RecommendationButtons.jsx
"use client";

import { Check, Pause, X } from "lucide-react";

export default function RecommendationButtons({ value, onChange }) {
  if (typeof onChange !== "function") {
    throw new Error("RecommendationButtons requires an onChange function prop");
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {/* Recommend */}
      <button
        type="button"
        onClick={() => onChange("recommend")}
        className={`p-4 border-2 rounded-lg text-center transition-all ${
          value === "recommend"
            ? "border-green-500 bg-green-50 text-green-700"
            : "border-gray-300 hover:border-green-300"
        }`}
      >
        <Check
          className={`w-6 h-6 mb-1 ${
            value === "recommend" ? "text-green-700" : "text-gray-400"
          }`}
        />
        <div className="font-medium">أوصي بالتوظيف</div>
      </button>

      {/* Pending */}
      <button
        type="button"
        onClick={() => onChange("pending")}
        className={`p-4 border-2 rounded-lg text-center transition-all ${
          value === "pending"
            ? "border-yellow-500 bg-yellow-50 text-yellow-700"
            : "border-gray-300 hover:border-yellow-300"
        }`}
      >
        <Pause
          className={`w-6 h-6 mb-1 ${
            value === "pending" ? "text-yellow-700" : "text-gray-400"
          }`}
        />
        <div className="font-medium">يحتاج مراجعة</div>
      </button>

      {/* Not Recommend */}
      <button
        type="button"
        onClick={() => onChange("not_recommend")}
        className={`p-4 border-2 rounded-lg text-center transition-all ${
          value === "not_recommend"
            ? "border-red-500 bg-red-50 text-red-700"
            : "border-gray-300 hover:border-red-300"
        }`}
      >
        <X
          className={`w-6 h-6 mb-1 ${
            value === "not_recommend" ? "text-red-700" : "text-gray-400"
          }`}
        />
        <div className="font-medium">لا أوصي</div>
      </button>
    </div>
  );
}
