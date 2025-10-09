// components/shared/ui/Select.jsx
import { ChevronDown } from "lucide-react";

/**
 * Reusable Select Component
 * 
 * @param {Object} props
 * @param {string} props.label - Select label
 * @param {string} props.error - Error message
 * @param {string} props.icon - Lucide icon component
 * @param {Array} props.options - Array of {value, label} objects
 * @param {string} props.className - Additional classes
 */
const Select = ({
  label,
  error,
  icon: Icon,
  options = [],
  className = "",
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        
        {/* Chevron icon on the left for RTL */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
        
        <select
          className={`
            w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#D6B666] focus:border-transparent outline-none appearance-none bg-white cursor-pointer transition-all duration-200
            ${Icon ? 'pr-12' : 'pr-4'}
            ${props.multiple ? 'pl-10' : 'pl-12'}
            ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}
            ${className}
          `.trim()}
          dir="rtl"
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default Select;