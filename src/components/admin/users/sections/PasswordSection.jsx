// src/components/admin/users/sections/PasswordSection.jsx
import Input from "@/components/shared/ui/Input";

export const PasswordSection = ({ formData, errors, handleChange, loading, isUpdate }) => {
  return (
    <div className="space-y-4">
      {!isUpdate && (
        <>
          <Input
            label="كلمة المرور *"
            type="password"
            value={formData.password || ""}
            error={errors.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="أدخل كلمة المرور"
            disabled={loading}
          />
          <Input
            label="تأكيد كلمة المرور *"
            type="password"
            value={formData.confirmPassword || ""}
            error={errors.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            placeholder="أعد إدخال كلمة المرور"
            disabled={loading}
          />
        </>
      )}
      {isUpdate && (
        <Input
          label="تغيير كلمة المرور"
          type="password"
          value={formData.password || ""}
          error={errors.password}
          onChange={(e) => handleChange("password", e.target.value)}
          placeholder="أدخل كلمة المرور الجديدة إذا أردت"
          disabled={loading}
        />
      )}
    </div>
  );
};
