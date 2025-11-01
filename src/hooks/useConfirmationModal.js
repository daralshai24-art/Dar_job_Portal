"use client";

import { useState, useEffect } from "react";
import Button from "@/components/shared/ui/Button";
import { X, Eye, EyeOff } from "lucide-react";

/**
 * ConfirmationModal
 *
 * Props supported (keeps backward compatibility with your previous usage):
 * - isOpen
 * - onClose
 * - onConfirm         // function: called when user confirms
 * - title
 * - message
 * - confirmText
 * - cancelText
 * - variant
 * - loading
 * - type              // if "resetPassword" will show password input
 * - password          // optional initial password (from modal state)
 * - setModalState     // optional function to update modalState externally
 */
export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "تأكيد",
  cancelText = "إلغاء",
  variant = "primary",
  loading = false,
  type = null,
  password = "",
  setModalState = undefined,
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
    // keep external modalState in sync if setter provided
    if (typeof setModalState === "function") {
      setModalState((prev) => ({ ...prev, password: value }));
    }
  };

  const passwordIsValid = localPassword && localPassword.length >= 6;
  const confirmDisabled = loading || (type === "resetPassword" && !passwordIsValid);

  if (!isOpen) return null;

  return (
    <div
      dir="rtl"
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
    >
      <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg text-right">
        {/* Header */}
        <div className="flex justify-between items-start gap-4 mb-3">
          <div className="flex-1">
            <h2 id="confirmation-modal-title" className="font-bold text-lg text-gray-800">
              {title}
            </h2>
            {message && <p className="text-gray-600 mt-2">{message}</p>}
          </div>

          {/* Close button — use arrow to avoid forwarding event to parent handlers */}
          <button
            type="button"
            onClick={() => {
              if (typeof onClose === "function") onClose();
            }}
            aria-label="إغلاق"
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Password input (for resetPassword type) */}
        {type === "resetPassword" && (
          <div className="mt-4">
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
          <div className="flex-1">
            <Button
              variant="secondary"
              onClick={() => {
                if (typeof onClose === "function") onClose();
              }}
            >
              {cancelText}
            </Button>
          </div>

          <div>
            <Button
              onClick={() => {
                if (confirmDisabled) return;
                // Call onConfirm with typed password when relevant, otherwise without args
                if (typeof onConfirm === "function") {
                  if (type === "resetPassword") {
                    onConfirm(localPassword);
                  } else {
                    onConfirm();
                  }
                }
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
