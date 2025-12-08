// src/components/admin/users/useUserForm.js
"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { validateUserData, sanitizeUserInput } from "@/services/user/validation";

export function useUserForm({ user = null, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    department: "",
    bio: "",
    status: "active",
    isDefaultCommitteeMember: false,
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Initialize form when editing user
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
        role: user.role || "",
        department: user.department || "",
        bio: user.bio || "",
        status: user.status || "active",
        isDefaultCommitteeMember: user.isDefaultCommitteeMember || false,
        phone: user.phone || "",
      });
    } else {
      // Create new user - reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        department: "",
        bio: "",
        status: "active",
        isDefaultCommitteeMember: false,
        phone: "",
      });
    }
  }, [user]);


  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: null })); // clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const sanitized = sanitizeUserInput(formData);
    const validation = validateUserData(sanitized, !!user);

    if (!validation.isValid) {
      const fieldErrors = {};
      validation.errors.forEach((err) => {
        // Simple mapping: pick field name from message if possible
        if (err.includes("الاسم")) fieldErrors.name = err;
        else if (err.includes("البريد")) fieldErrors.email = err;
        else if (err.includes("كلمة المرور")) fieldErrors.password = err;
        else if (err.includes("الدور")) fieldErrors.role = err;
        else if (err.includes("القسم")) fieldErrors.department = err;
        else if (err.includes("رقم الهاتف")) fieldErrors.phone = err;
        else if (err.includes("النبذة")) fieldErrors.bio = err;
      });
      setErrors(fieldErrors);
      toast.error("الرجاء تصحيح الأخطاء في النموذج");
      setLoading(false);
      return;
    }

    try {
      await onSave(sanitized); // This should call useUsers.handleCreateUser or handleUpdateUser
      toast.success(user ? "تم تحديث المستخدم" : "تم إضافة المستخدم");
    } catch (err) {
      toast.error(err.message || "حدث خطأ أثناء الحفظ");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    errors,
    loading,
    handleChange,
    handleSubmit,
  };
}
