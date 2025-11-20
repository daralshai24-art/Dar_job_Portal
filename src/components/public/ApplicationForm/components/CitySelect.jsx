"use client";

import { FilterSelect } from "@/components/common/Select";
import { SAUDI_CITIES } from "../constants/formConfig";

const CitySelect = ({ value, onChange, error, required }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        المدينة {required && <span className="text-red-500">*</span>}
      </label>

      <FilterSelect
        value={value}
        onChange={(val) => {
          // simulate normal input event so form hook works
          onChange({
            target: {
              name: "city",
              value: val
            }
          });
        }}
        options={SAUDI_CITIES}
        placeholder="اختر المدينة"
        isClearable={false}
        className="text-right"
      />

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default CitySelect;
