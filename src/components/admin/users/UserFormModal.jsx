"use client";

import Button from "@/components/shared/ui/Button";
import Modal from "@/components/common/Modal";
import { BasicInfoSection } from "./sections/BasicInfoSection";
import { PasswordSection } from "./sections/PasswordSection";
import { RoleDepartmentSection } from "./sections/RoleDepartmentSection";
import { StatusSection } from "./sections/StatusSection";
import { BioSection } from "./sections/BioSection";
import { useUserForm } from "./useUserForm";

export function UserFormModal({ isOpen, onClose, user, onSave }) {
  const { formData, errors, loading, handleChange, handleSubmit } = useUserForm({ user, onSave });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={user ? "تعديل مستخدم" : "إضافة مستخدم جديد"} loading={loading}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <BasicInfoSection {...{ formData, errors, handleChange, loading }} />
        <PasswordSection {...{ formData, errors, handleChange, loading, isUpdate: !!user }} />
        <RoleDepartmentSection {...{ formData, handleChange, loading }} />
        <StatusSection {...{ formData, handleChange, loading }} />
        <BioSection {...{ formData, handleChange, loading }} />

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="flex-1">
            إلغاء
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "جاري الحفظ..." : user ? "تحديث" : "إضافة"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
