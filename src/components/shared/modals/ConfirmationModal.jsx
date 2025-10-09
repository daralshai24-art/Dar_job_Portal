// components/shared/modals/ConfirmationModal.jsx - FIXED BACKDROP
"use client";

import { AlertTriangle, CheckCircle, Trash2, Power, Info } from "lucide-react";
import Button from "@/components/shared/ui/Button";

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "تأكيد الإجراء",
  message = "هل أنت متأكد من تنفيذ هذا الإجراء؟",
  confirmText = "تأكيد",
  cancelText = "إلغاء",
  variant = "warning",
  loading = false,
  type = "general"
}) => {
  if (!isOpen) return null;

  // Variant styles
  const variantStyles = {
    danger: {
      icon: Trash2,
      iconColor: "text-red-600",
      bgColor: "bg-red-50",
      buttonVariant: "danger"
    },
    warning: {
      icon: AlertTriangle,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-50",
      buttonVariant: "warning"
    },
    success: {
      icon: CheckCircle,
      iconColor: "text-green-600",
      bgColor: "bg-green-50",
      buttonVariant: "primary"
    },
    info: {
      icon: Info,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
      buttonVariant: "primary"
    }
  };

  const styles = variantStyles[variant];
  const IconComponent = type === "delete" ? Trash2 : 
                       type === "status" ? Power : 
                       styles.icon;

  return (
    <>
      {/* Lighter Backdrop */}
      <div 
        className="fixed inset-0  bg-opacity-100 backdrop-blur-xs z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-auto transform transition-all">
          {/* Header */}
          <div className={`p-6 rounded-t-2xl ${styles.bgColor}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full bg-white ${styles.iconColor}`}>
                <IconComponent size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                <p className="text-gray-600 text-sm mt-1">{message}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 flex items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              {cancelText}
            </Button>
            
            <Button
              variant={styles.buttonVariant}
              onClick={onConfirm}
              loading={loading}
              disabled={loading}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};