//src\hooks\useFeedbackApi.js
"use client";

import { useState } from "react";

export default function useFeedbackApi(tokenParam) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tokenData, setTokenData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    technicalNotes: "",

    recommendation: "pending", // pending, recommend, not_recommend
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
      alert("يرجى إضافة ملاحظاتك");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/feedback/submit/${tokenParam}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
