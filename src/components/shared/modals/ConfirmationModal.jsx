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
  initialFormData = {},
  updateFormData,
}) => {
  const [localPassword, setLocalPassword] = useState("");
  const [localFormData, setLocalFormData] = useState({ name: "" });

  // Initialize form data only when modal opens - FIXED VERSION
  useEffect(() => {
    if (isOpen) {
      setLocalPassword("");
      const newFormData = initialFormData || { name: "" };
      setLocalFormData(newFormData);
      
      // Only update context if form data is different from current state
      if (updateFormData && JSON.stringify(newFormData) !== JSON.stringify(localFormData)) {
        updateFormData(newFormData);
      }
    }
  }, [isOpen]); // Remove initialFormData and updateFormData from dependencies

  // Alternative better approach - remove the context update entirely from here
  // and handle it in the form change handler only

  if (!isOpen) return null;

  const handleFormChange = (field, value) => {
    const newFormData = { ...localFormData, [field]: value };
    setLocalFormData(newFormData);
    if (updateFormData) {
      updateFormData(newFormData);
    }
  };

  const handleConfirmClick = () => {
    if (type === "resetPassword") {
      onConfirm(localPassword);
    } else if (type === "categoryForm") {
      onConfirm(localFormData);
    } else {
      onConfirm(); // For simple confirmations without data
    }
  };

  const renderCustomContent = () => {
    if (type === "resetPassword") {
      return (
        <input
          type="password"
          className="w-full border border-gray-300 rounded p-2 mb-4"
          placeholder="كلمة المرور الجديدة"
          value={localPassword}
          onChange={(e) => setLocalPassword(e.target.value)}
        />
      );
    }

    if (type === "categoryForm") {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">اسم الفئة</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded p-2"
              value={localFormData.name || ""}
              onChange={(e) => handleFormChange("name", e.target.value)}
              placeholder="أدخل اسم الفئة"
            />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg text-right">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg text-gray-800">{title}</h2>
          <button onClick={onClose} disabled={loading}>
            <X size={20} />
          </button>
        </div>

        {/* Message */}
        {message && <p className="text-gray-600 mb-4">{message}</p>}

        {/* Custom Content */}
        {renderCustomContent()}

        {/* Buttons */}
        <div className="flex justify-between gap-2 mt-4">
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