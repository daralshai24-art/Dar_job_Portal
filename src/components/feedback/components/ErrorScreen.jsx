"use client";

import { AlertCircle } from "lucide-react";
import Button from "@/components/shared/ui/Button";
import { useRouter } from "next/navigation";

export default function ErrorScreen({ message }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">رابط غير صالح</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <Button
          onClick={() => router.push("/")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          العودة للرئيسية
        </Button>
      </div>
    </div>
  );
}
