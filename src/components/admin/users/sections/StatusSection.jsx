// src/components/admin/users/sections/StatusSection.jsx
import { FilterSelect } from "@/components/common/Select";
import { USER_STATUS, STATUS_LABELS } from "@/services/userService";

export const StatusSection = ({ formData, handleChange, loading }) => {
  return (
    <div className="space-y-4">
      <FilterSelect
        label="الحالة"
        value={formData.status || USER_STATUS.ACTIVE}
        onChange={(value) => handleChange("status", value)}
        options={Object.keys(USER_STATUS).map((key) => ({
          label: STATUS_LABELS[USER_STATUS[key]],
          value: USER_STATUS[key],
        }))}
        disabled={loading}
      />
    </div>
  );
};
