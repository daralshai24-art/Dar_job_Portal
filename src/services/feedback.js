// src/services/feedback.js
export const verifyToken = async (token) => {
  try {
    const res = await fetch(`/api/feedback/verify/${token}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "رابط غير صالح");
    return data;
  } catch (err) {
    throw new Error(err.message || "حدث خطأ في التحقق من الرابط");
  }
};

export const submitFeedback = async (token, formData) => {
  try {
    const res = await fetch(`/api/feedback/submit/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "حدث خطأ في الإرسال");
    return data;
  } catch (err) {
    throw new Error(err.message || "حدث خطأ في الإرسال");
  }
};
