//src\components\feedback\states\ErrorState.jsx
"use client";

import Button from "@/components/shared/ui/Button";
import { AlertCircle } from "lucide-react";

export default function ErrorState({ error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <AlertCircle className="text-red-500 w-16 h-16 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">رابط غير صالح</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button href="/" className="px-6 py-2">
          العودة للرئيسية
        </Button>
      </div>
    </div>
  );
}
