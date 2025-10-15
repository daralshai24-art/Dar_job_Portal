// components/admin/users/UserFormModal.jsx
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Button from "@/components/shared/ui/Button";
import {
  USER_ROLES,
  USER_STATUS,
  DEPARTMENTS,
  ROLE_LABELS,
  STATUS_LABELS,
  DEPARTMENT_LABELS,
} from "@/services/userService";

export function UserFormModal({ isOpen, onClose, onSave, user, loading }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: USER_ROLES.VIEWER,
    department: DEPARTMENTS.HR,
    status: USER_STATUS.ACTIVE,
    phone: "",
    position: "",
    bio: "",
  });

  const [errors, setErrors] = useState({});

  // Initialize form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
        role: user.role || USER_ROLES.VIEWER,
        department: user.department || DEPARTMENTS.HR,
        status: user.status || USER_STATUS.ACTIVE,
        phone: user.phone || "",
        position: user.position || "",
        bio: user.bio || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: USER_ROLES.VIEWER,
        department: DEPARTMENTS.HR,
        status: USER_STATUS.ACTIVE,
        phone: "",
        position: "",
        bio: "",
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const handleChange = (field, value) => {
    // Trim password fields to avoid whitespace issues
    const processedValue = (field === 'password' || field === 'confirmPassword') 
      ? value.trim() 
      : value;
    
    setFormData((prev) => ({ ...prev, [field]: processedValue }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
    
    // Clear confirmPassword error if password changes
    if (field === 'password' && errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name?.trim()) {
      newErrors.name = "الاسم مطلوب";
    }

    // Email validation
    if (!formData.email?.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صالح";
    }

    // Password validation (only for new users or if password is being changed)
    const hasPassword = formData.password && formData.password.trim().length > 0;
    
    if (!user && !hasPassword) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (hasPassword && formData.password.trim().length < 6) {
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }

    // Confirm password validation - only if password is valid
    if (hasPassword && formData.password.trim().length >= 6) {
      const trimmedPassword = formData.password.trim();
      const trimmedConfirm = formData.confirmPassword.trim();
      
      if (!trimmedConfirm) {
        newErrors.confirmPassword = "يرجى تأكيد كلمة المرور";
      } else if (trimmedPassword !== trimmedConfirm) {
        newErrors.confirmPassword = "كلمة المرور غير متطابقة";
        console.log("Password mismatch:", {
          password: `'${trimmedPassword}'`,
          confirm: `'${trimmedConfirm}'`,
          passwordLength: trimmedPassword.length,
          confirmLength: trimmedConfirm.length
        });
      }
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = "الدور الوظيفي مطلوب";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Debug: Log the form data
    console.log("Form Data:", {
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      match: formData.password === formData.confirmPassword
    });

    const validationErrors = validate();
    
    // Debug: Log validation errors
    console.log("Validation Errors:", validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Show the first error in a toast
      const firstError = Object.values(validationErrors)[0];
      console.error("CLIENT-SIDE Validation failed:", firstError);
      return;
    }

    console.log("✅ CLIENT-SIDE validation passed! Sending to server...");

    // Prepare data (exclude confirmPassword and empty password for updates)
    const submitData = { ...formData };
    delete submitData.confirmPassword;
    
    // Don't send password if it's empty (for updates)
    if (user && !submitData.password) {
      delete submitData.password;
    }

    console.log("Submitting data:", submitData);

    try {
      await onSave(submitData);
      console.log("✅ Server responded successfully!");
    } catch (error) {
      console.error("❌ Server error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" dir="rtl">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              {user ? "تعديل مستخدم" : "إضافة مستخدم جديد"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Info Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                المعلومات الأساسية
              </h3>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الكامل <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="أدخل الاسم الكامل"
                  disabled={loading}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="example@email.com"
                  disabled={loading}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="05xxxxxxxx"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                {user ? "تغيير كلمة المرور (اختياري)" : "كلمة المرور"}
              </h3>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور {!user && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={user ? "اتركه فارغاً إذا لم ترغب بالتغيير" : "أدخل كلمة المرور"}
                  disabled={loading}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              {formData.password && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تأكيد كلمة المرور <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.confirmPassword ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="أعد إدخال كلمة المرور"
                    disabled={loading}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>
              )}
            </div>

            {/* Role & Department Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                الدور والقسم
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الدور الوظيفي <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleChange("role", e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.role ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={loading}
                  >
                    {Object.entries(ROLE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-500">{errors.role}</p>
                  )}
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    القسم
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleChange("department", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={loading}
                  >
                    {Object.entries(DEPARTMENT_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المسمى الوظيفي
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleChange("position", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="مثال: مدير موارد بشرية"
                  disabled={loading}
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحالة
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading}
                >
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bio Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                نبذة مختصرة
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نبذة عن المستخدم
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="معلومات إضافية عن المستخدم..."
                  disabled={loading}
                  maxLength={500}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.bio.length}/500 حرف
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="flex-1"
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? "جاري الحفظ..." : user ? "تحديث" : "إضافة"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}