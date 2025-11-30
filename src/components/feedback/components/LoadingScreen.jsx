"use client";

import LoadingSpinner from "@/components/shared/ui/LoadingSpinner";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <LoadingSpinner className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">جاري التحقق من الرابط...</p>
      </div>
    </div>
  );
}
