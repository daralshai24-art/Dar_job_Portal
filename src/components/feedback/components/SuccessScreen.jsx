"use client";

import { CheckCircle } from "lucide-react";

export default function SuccessScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          تم الإرسال بنجاح!
        </h2>
        <p className="text-gray-600 mb-4">
          شكراً لك على وقتك وملاحظاتك القيمة
        </p>
        <div className="animate-pulse text-sm text-gray-500">
          سيتم تحويلك تلقائياً...
        </div>
      </div>
    </div>
  );
}
