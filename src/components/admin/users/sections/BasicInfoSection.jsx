// src/components/admin/users/sections/BasicInfoSection.jsx
import Input from "@/components/shared/ui/Input";

export const BasicInfoSection = ({ formData, errors, handleChange, loading }) => {
  return (
    <div className="space-y-4">
      <Input
        label="الاسم الكامل *"
        value={formData.name || ""}
        error={errors.name}
        onChange={(e) => handleChange("name", e.target.value)}
        placeholder="أدخل الاسم الكامل"
        disabled={loading}
      />
      <Input
        label="البريد الإلكتروني *"
        type="email"
        value={formData.email || ""}
        error={errors.email}
        onChange={(e) => handleChange("email", e.target.value)}
        placeholder="أدخل البريد الإلكتروني"
        disabled={loading}
      />
      <Input
        label="رقم الهاتف"
        value={formData.phone || ""}
        error={errors.phone}
        onChange={(e) => handleChange("phone", e.target.value)}
        placeholder="05xxxxxxxx"
        disabled={loading}
      />
    </div>
  );
};
