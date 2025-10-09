// components/jobs/public/FiltersSidebar.jsx
"use client";

import { Filter, Search, Briefcase, MapPin, Clock } from "lucide-react";
import { memo } from "react";

const FiltersSidebar = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedLocation,
  onLocationChange,
  selectedJobType,
  onJobTypeChange,
  onResetFilters,
  categories,
  locations,
  jobTypes
}) => {
  const hasActiveFilters = searchTerm || selectedCategory !== "الكل" || selectedLocation !== "الكل";

  return (
    <div className="bg-white rounded-xl shadow-md p-4 lg:p-6 lg:sticky lg:top-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Filter size={20} className="ml-2" />
           خيارات البحث
        </h3>
        <button
          onClick={onResetFilters}
          className="text-sm text-[#B38025] hover:text-[#D6B666] font-medium"
        >
          إعادة تعيين
        </button>
      </div>

      {/* Filter Content */}
      <div className="space-y-4 lg:space-y-6">
        <SearchFilter searchTerm={searchTerm} onSearchChange={onSearchChange} />
        <SelectFilter label="التصنيف" icon={Briefcase} value={selectedCategory} onChange={onCategoryChange} options={categories} />
        <SelectFilter label="الموقع" icon={MapPin} value={selectedLocation} onChange={onLocationChange} options={locations} />
        <SelectFilter label="نوع الوظيفة" icon={Clock} value={selectedJobType} onChange={onJobTypeChange} options={jobTypes} />
        
        {hasActiveFilters && (
          <ActiveFilters 
            searchTerm={searchTerm} 
            selectedCategory={selectedCategory} 
            selectedLocation={selectedLocation} 
            onClearSearch={() => onSearchChange("")} 
            onClearCategory={() => onCategoryChange("الكل")} 
            onClearLocation={() => onLocationChange("الكل")} 
          />
        )}
      </div>
    </div>
  );
};

// Memoized sub-components to prevent unnecessary re-renders
const SearchFilter = memo(({ searchTerm, onSearchChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      البحث في الوظائف
    </label>
    <div className="relative">
      <input
        type="text"
        placeholder="ابحث هنا..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B38025] focus:border-transparent transition-colors"
      />
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={18}
      />
    </div>
  </div>
));

const SelectFilter = memo(({ label, icon: Icon, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
      <Icon size={16} className="ml-2" />
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B38025] focus:border-transparent transition-colors"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
));

const ActiveFilters = memo(({ searchTerm, selectedCategory, selectedLocation, onClearSearch, onClearCategory, onClearLocation }) => (
  <div className="border-t pt-4">
    <h4 className="text-sm font-medium text-gray-700 mb-2">خيارات البحث النشطة :</h4>
    <div className="space-y-2">
      {searchTerm && (
        <FilterTag 
          label={`البحث: ${searchTerm}`}
          onClear={onClearSearch}
          color="blue"
        />
      )}
      {selectedCategory !== "الكل" && (
        <FilterTag 
          label={`التصنيف: ${selectedCategory}`}
          onClear={onClearCategory}
          color="green"
        />
      )}
      {selectedLocation !== "الكل" && (
        <FilterTag 
          label={`الموقع: ${selectedLocation}`}
          onClear={onClearLocation}
          color="purple"
        />
      )}
    </div>
  </div>
));

const FilterTag = memo(({ label, onClear, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200", 
    purple: "bg-purple-50 text-purple-700 border-purple-200"
  };

  return (
    <div className={`flex items-center justify-between ${colorClasses[color]} px-3 py-2 rounded-lg border`}>
      <span className="text-sm">{label}</span>
      <button
        onClick={onClear}
        className="hover:opacity-70 transition-opacity text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
});

// Display names for better debugging
SearchFilter.displayName = 'SearchFilter';
SelectFilter.displayName = 'SelectFilter';
ActiveFilters.displayName = 'ActiveFilters';
FilterTag.displayName = 'FilterTag';

export default memo(FiltersSidebar);