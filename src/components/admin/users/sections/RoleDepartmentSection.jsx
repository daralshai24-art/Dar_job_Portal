// src/components/admin/users/sections/RoleDepartmentSection.jsx
import { FilterSelect } from "@/components/common/Select";
import { USER_ROLES, DEPARTMENTS, ROLE_LABELS, DEPARTMENT_LABELS } from "@/services/userService";

export const RoleDepartmentSection = ({ formData, handleChange, loading }) => {
  return (
    <div className="space-y-4">
      <FilterSelect
        label="الدور الوظيفي *"
        value={formData.role || ""}
        onChange={(value) => handleChange("role", value)}
        options={Object.keys(USER_ROLES).map((key) => ({ label: ROLE_LABELS[USER_ROLES[key]], value: USER_ROLES[key] }))}
        disabled={loading}
      />
      <FilterSelect
        label="القسم"
        value={formData.department || ""}
        onChange={(value) => handleChange("department", value)}
        options={Object.keys(DEPARTMENTS).map((key) => ({ label: DEPARTMENT_LABELS[DEPARTMENTS[key]], value: DEPARTMENTS[key] }))}
        disabled={loading}
      />

      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          id="isDefaultCommitteeMember"
          checked={formData.isDefaultCommitteeMember || false}
          onChange={(e) => handleChange("isDefaultCommitteeMember", e.target.checked)}
          disabled={loading}
          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <label htmlFor="isDefaultCommitteeMember" className="text-sm font-medium text-gray-700 cursor-pointer">
          تعيين كعضو افتراضي (سيتم إضافته تلقائياً للجان الجديدة)
        </label>
      </div>
    </div>
  );
};
