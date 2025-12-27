// components/admin/jobs/components/DynamicSelectWithAdd.jsx
import dynamic from 'next/dynamic';
import { Plus } from 'lucide-react';

// Dynamically import React Select with SSR disabled
const Select = dynamic(() => import('react-select'), {
  ssr: false,
  loading: () => (
    <div className="w-full border border-gray-300 rounded-xl px-3 py-2 md:px-4 md:py-3 bg-gray-100 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  )
});

// Custom styles for React Select
const selectStyles = {
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? '#D6B666' : '#d1d5db',
    borderRadius: '12px',
    padding: '2px 4px',
    textAlign: 'right',
    minHeight: '44px',
    fontSize: '14px',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(214, 182, 102, 0.2)' : 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#D6B666' : '#9ca3af'
    },
    '@media (min-width: 768px)': {
      minHeight: '52px',
    }
  }),
  menu: (base) => ({
    ...base,
    textAlign: 'right',
    borderRadius: '12px',
    overflow: 'hidden',
    fontSize: '14px',
  }),
  option: (base, state) => ({
    ...base,
    textAlign: 'right',
    fontSize: '14px',
    padding: '8px 12px',
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
  })
};

const DynamicSelectWithAdd = ({
  label,
  value,
  onChange,
  options,
  newValue,
  onNewValueChange,
  onAddNew,
  error,
  required,
  placeholder = "اختر...",
  addPlaceholder = "إضافة جديد",
  type = "text"
}) => {
  // Handle different option types (strings for titles/locations, objects for categories)
  const selectOptions = options.map(option => {
    if (typeof option === 'string') {
      return { value: option, label: option };
    } else {
      // For category objects
      return { value: option._id, label: option.name };
    }
  });

  // Find the current value's label for display
  let currentValue = selectOptions.find(opt => opt.value === value);

  // If value exists but not in options (e.g. from template auto-fill), create a temporary option for display
  // This is safe for text-based fields like Title and Location
  if (!currentValue && value && type !== 'category') {
    currentValue = { value: value, label: value };
  }

  // Determine which field to update in newOptions
  const getFieldName = () => {
    if (type === 'category') return 'category';
    if (label.includes('المسمى')) return 'title';
    if (label.includes('الموقع')) return 'location';
    return 'value';
  };

  const fieldName = getFieldName();

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Main input area */}
      <div className="flex flex-col sm:flex-row gap-3 items-start">
        {/* React Select - Full width on mobile */}
        <div className="w-full sm:flex-1">
          <Select
            value={currentValue}
            onChange={(selected) => onChange(selected?.value || '')}
            options={selectOptions}
            placeholder={placeholder}
            styles={selectStyles}
            isSearchable={true}
            isClearable={true}
            noOptionsMessage={() => "لا توجد خيارات متاحة"}
            loadingMessage={() => "جاري التحميل..."}
            className="text-right"
          />

          {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          )}
        </div>

        {/* Add New Section */}
        <div className="flex gap-2 w-full sm:w-auto sm:mt-1">
          <input
            placeholder={addPlaceholder}
            value={newValue}
            onChange={(e) => onNewValueChange(fieldName, e.target.value)}
            className="w-full sm:min-w-[140px] text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D6B666] focus:border-transparent"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onAddNew();
              }
            }}
            dir="rtl"
          />
          <button
            type="button"
            onClick={onAddNew}
            disabled={!newValue?.trim()}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[44px]"
            title="إضافة جديد"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicSelectWithAdd;