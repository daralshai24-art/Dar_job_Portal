// components/common/FilterSelect.jsx
import dynamic from 'next/dynamic';
import { Filter } from "lucide-react";

// Dynamically import React Select with SSR disabled
const ReactSelect = dynamic(() => import('react-select'), {
  ssr: false,
  loading: () => (
    <div className="w-full border border-gray-300 rounded-lg px-3 py-3 bg-gray-100 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-1/2"></div>
    </div>
  )
});

// Custom styles for FilterSelect with icon space
const filterSelectStyles = {
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? '#D6B666' : '#d1d5db',
    borderRadius: '8px',
    paddingLeft: '40px', // Space for filter icon
    paddingRight: '12px',
    paddingTop: '8px',
    paddingBottom: '8px',
    textAlign: 'right',
    minHeight: '44px',
    fontSize: '14px',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(179, 128, 37, 0.2)' : 'none',
    cursor: 'pointer',
    '&:hover': {
      borderColor: state.isFocused ? '#D6B666' : '#9ca3af'
    }
  }),
  menu: (base) => ({
    ...base,
    textAlign: 'right',
    borderRadius: '8px',
    overflow: 'hidden',
    fontSize: '14px',
    zIndex: 50
  }),
  option: (base, state) => ({
    ...base,
    textAlign: 'right',
    fontSize: '14px',
    padding: '10px 12px',
    cursor: 'pointer',
    backgroundColor: state.isSelected ? '#D6B666' : state.isFocused ? '#fef6e6' : 'white',
    color: state.isSelected ? 'white' : '#374151',
    '&:hover': {
      backgroundColor: state.isSelected ? '#D6B666' : '#fef6e6'
    }
  }),
  placeholder: (base) => ({
    ...base,
    textAlign: 'right',
    color: '#9ca3af',
    fontSize: '14px',
  }),
  singleValue: (base) => ({
    ...base,
    textAlign: 'right',
    color: '#374151',
    fontSize: '14px',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#fef6e6',
    borderRadius: '6px',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: '#374151',
    fontSize: '13px',
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: '#D6B666',
    '&:hover': {
      backgroundColor: '#D6B666',
      color: 'white',
    }
  }),
  indicatorSeparator: () => ({
    display: 'none'
  })
};

/**
 * FilterSelect Component - Styled select with filter icon
 * @param {string|array} value - Current value (string or array for multi-select)
 * @param {function} onChange - Change handler
 * @param {array} options - Array of options (objects with value/label or strings)
 * @param {string} placeholder - Placeholder text
 * @param {boolean} isMulti - Enable multi-select
 * @param {boolean} isClearable - Enable clear button
 * @param {boolean} isSearchable - Enable search
 * @param {string} className - Additional CSS classes
 */
export const FilterSelect = ({
  value,
  onChange,
  options = [],
  placeholder = "تصفية",
  isMulti = false,
  isClearable = true,
  isSearchable = true,
  className = "",
  ...props
}) => {
  // Normalize options to {value, label} format
  const normalizedOptions = options.map(option => {
    if (typeof option === 'string') {
      return { value: option, label: option };
    } else if (option && typeof option === 'object') {
      return {
        value: option.value || option._id || option.id,
        label: option.label || option.name || option.title
      };
    }
    return option;
  });

  // Find current value(s) for display
  const getCurrentValue = () => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return isMulti ? [] : null;
    }

    if (isMulti) {
      const values = Array.isArray(value) ? value : [value];
      return normalizedOptions.filter(opt => values.includes(opt.value));
    } else {
      return normalizedOptions.find(opt => opt.value === value) || null;
    }
  };

  const currentValue = getCurrentValue();

  return (
    <div className={`space-y-2 ${className}`}>
      {props.label && (
        <label className="block text-sm font-medium text-gray-700">
          {props.label}
        </label>
      )}
      <div className="relative">
        {/* Filter Icon */}
        <Filter
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D6B666] z-10 pointer-events-none"
          size={20}
        />

        {/* React Select */}
        <ReactSelect
          value={currentValue}
          onChange={(selected) => {
            if (isMulti) {
              onChange(selected ? selected.map(item => item.value) : []);
            } else {
              onChange(selected?.value || '');
            }
          }}
          options={normalizedOptions}
          placeholder={placeholder}
          styles={filterSelectStyles}
          isSearchable={isSearchable}
          isClearable={isClearable}
          isMulti={isMulti}
          noOptionsMessage={() => "لا توجد خيارات متاحة"}
          loadingMessage={() => "جاري التحميل..."}
          className="text-right"
          {...props}
        />
      </div>
    </div>
  );
};

export default FilterSelect;