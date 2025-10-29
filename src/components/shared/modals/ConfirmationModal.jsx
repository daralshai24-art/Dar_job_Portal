"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/shared/ui/Button";
import { X, Eye, EyeOff } from "lucide-react";

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "تأكيد",
  cancelText = "إلغاء",
  variant = "default",
  type = null,
  loading = false,
  password = "",
  setModalState = () => {},
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [localPassword, setLocalPassword] = useState(password || "");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    setLocalPassword(password || "");
    setTouched(false);
  }, [password, isOpen]);

  const handlePasswordChange = (value) => {
    setTouched(true);
    setLocalPassword(value);
    setModalState((prev) => ({ ...prev, password: value }));
    console.log("Password typed:", value);
  };

  const passwordIsValid = localPassword && localPassword.length >= 6;
  const confirmDisabled = loading || (type === "resetPassword" && !passwordIsValid);

  if (!isOpen) return null;

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 text-right">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 id="confirmation-modal-title" className="text-lg font-bold text-gray-800">
              {title}
            </h2>
            {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
          </div>
          <button onClick={onClose} aria-label="إغلاق" className="p-2 rounded-md hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        {/* Password input */}
        {type === "resetPassword" && (
          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">كلمة المرور الجديدة</label>
            <div className="relative">
              <input
                dir="rtl"
                type={showPassword ? "text" : "password"}
                className="w-full border rounded-md px-3 py-2 pr-10 text-right focus:outline-none focus:ring-1 focus:ring-indigo-300"
                placeholder="أدخل كلمة المرور الجديدة"
                value={localPassword}
                onChange={(e) => handlePasswordChange(e.target.value)}
                onBlur={() => setTouched(true)}
                aria-invalid={touched && !passwordIsValid}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1"
                aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {touched && !passwordIsValid && (
              <p className="mt-2 text-xs text-red-600">كلمة المرور يجب أن تكون 6 أحرف على الأقل</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <div className="flex-1 flex justify-start">
            <Button variant="secondary" onClick={onClose}>
              {cancelText}
            </Button>
          </div>
          <div>
            <Button
              onClick={() => {
                if (confirmDisabled) return;
                if (typeof onConfirm === "function") onConfirm(localPassword);
              }}
              disabled={confirmDisabled}
              loading={loading}
              variant={variant === "danger" ? "danger" : variant === "success" ? "success" : "primary"}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
