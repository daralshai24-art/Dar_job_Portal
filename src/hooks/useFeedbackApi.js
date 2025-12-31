//src\hooks\useFeedbackApi.js
"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function useFeedbackApi(tokenParam) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tokenData, setTokenData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    technicalNotes: "",
    recommendation: "pending",
    overallScore: 5,
  });

  const verifyToken = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/feedback/verify/${tokenParam}`);
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
      toast.error("يرجى إضافة الملاحظات الفنية");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("جاري إرسال التقييم...");

    try {
      const response = await fetch(`/api/feedback/submit/${tokenParam}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "حدث خطأ في الإرسال", { id: toastId });
        return;
      }

      toast.success("تم إرسال التقييم بنجاح", { id: toastId });
      setSuccess(true);

      // Redirect to home page after 2 seconds
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      toast.error("حدث خطأ في الشبكة", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    loading,
    error,
    tokenData,
    success,
    submitting,
    formData,
    setFormData,
    verifyToken,
    handleSubmit,
  };
}
