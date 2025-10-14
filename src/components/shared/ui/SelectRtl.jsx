import dynamic from "next/dynamic";
import PropTypes from "prop-types";

// Dynamically import react-select to avoid SSR issues
const Select = dynamic(() => import("react-select"), { ssr: false });

// Shared custom styles
const selectStyles = {
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? "#D6B666" : "#d1d5db",
    borderRadius: "12px",
    padding: "2px 4px",
    textAlign: "right",
    minHeight: "44px",
    fontSize: "14px",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(214,182,102,0.2)" : "none",
    "&:hover": {
      borderColor: state.isFocused ? "#D6B666" : "#9ca3af",
    },
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Fix dropdown clipping
  menu: (base) => ({
    ...base,
    textAlign: "right",
    borderRadius: "12px",
    overflow: "hidden",
    fontSize: "14px",
  }),
  option: (base, state) => ({
    ...base,
    textAlign: "right",
    backgroundColor: state.isSelected
      ? "#D6B666"
      : state.isFocused
      ? "#fef6e6"
      : "white",
    color: state.isSelected ? "white" : "#374151",
    fontSize: "14px",
    padding: "8px 12px",
  }),
  placeholder: (base) => ({
    ...base,
    textAlign: "right",
    color: "#9ca3af",
    fontSize: "14px",
  }),
  singleValue: (base) => ({
    ...base,
    textAlign: "right",
    color: "#374151",
    fontSize: "14px",
  }),
};

// Reusable RTL Select Component
const SelectRtl = ({
  label,
  value,
  onChange,
  options,
  error,
  required = false,
  placeholder = "اختر...",
  isSearchable = true,
  isClearable = true,
  className = "",
}) => {
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <Select
        value={selectedOption || null}
        onChange={(selected) => onChange(selected?.value || "")}
        options={options}
        placeholder={placeholder}
        styles={selectStyles}
        isSearchable={isSearchable}
        isClearable={isClearable}
        noOptionsMessage={() => "لا توجد خيارات متاحة"}
        loadingMessage={() => "جاري التحميل..."}
        className="text-right"
        menuPortalTarget={typeof window !== "undefined" ? document.body : null}
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

SelectRtl.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  error: PropTypes.string,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  isSearchable: PropTypes.bool,
  isClearable: PropTypes.bool,
  className: PropTypes.string,
};

export default SelectRtl;
