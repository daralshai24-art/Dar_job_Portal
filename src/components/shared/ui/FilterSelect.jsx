import { Filter } from "lucide-react";

export const FilterSelect = ({ 
  value,
  onChange,
  options = [],
  placeholder = "تصفية",
  className = ""
}) => {
  return (
    <div className={`relative ${className}`}>
      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D6B666]" size={20} />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B38025] cursor-pointer"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};