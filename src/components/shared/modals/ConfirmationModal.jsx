"use client";

import { useState, useEffect } from "react";
import Button from "@/components/shared/ui/Button";
import { X } from "lucide-react";

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "تأكيد",
  cancelText = "إلغاء",
  variant = "primary",
  type = null,
  loading = false,
  password = "",
  setModalState,
}) => {
  const [localPassword, setLocalPassword] = useState("");

  // Reset password input when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setLocalPassword(password || "");
    } else {
      setLocalPassword("");
    }
  }, [isOpen, password]);

  if (!isOpen) return null;

  const handleConfirmClick = () => {
    if (type === "resetPassword") {
      onConfirm(localPassword);
    } else {
      onConfirm && onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg text-right">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg text-gray-800">{title}</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Message */}
        <p className="text-gray-600 mb-4">{message}</p>

        {/* Password Input for resetPassword */}
        {type === "resetPassword" && (
          <input
            type="password"
            className="w-full border border-gray-300 rounded p-2 mb-4"
            placeholder="كلمة المرور الجديدة"
            value={localPassword}
            onChange={(e) => setLocalPassword(e.target.value)}
          />
        )}

        {/* Buttons */}
        <div className="flex justify-between">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>

          <Button
            variant={variant}
            onClick={handleConfirmClick}
            loading={loading}
            disabled={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
