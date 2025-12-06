// src/components/jobs/public/FiltersSidebar.jsx
"use client";

import { Filter, Search, Briefcase, MapPin, Clock } from "lucide-react";
import { memo } from "react";
import { useCategories } from "@/hooks/useCategories";
import LoadingSpinner from "@/components/shared/ui/LoadingSpinner";

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
  locations,
  jobTypes
}) => {
  const { categories, loading } = useCategories();

  const hasActiveFilters = searchTerm || selectedCategory !== "all" || selectedLocation !== "الكل";

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <LoadingSpinner message="جاري تحميل التصنيفات..." size="small" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 lg:p-6 lg:sticky lg:top-24 transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Filter size={20} className="ml-2 text-[#B38025]" />
          خيارات البحث
        </h3>
        <button
          onClick={onResetFilters}
          className="text-sm text-[#B38025] hover:text-[#D6B666] font-medium transition-colors"
        >
          إعادة تعيين
        </button>
      </div>

      {/* Filter Content */}
      <div className="space-y-4 lg:space-y-6">
        <SearchFilter searchTerm={searchTerm} onSearchChange={onSearchChange} />
        <SelectFilter
          label="التصنيف"
          icon={Briefcase}
          value={selectedCategory}
          onChange={onCategoryChange}
          options={categories.map(cat => ({ value: cat._id, label: cat.name }))}
        />
        <SelectFilter
          label="الموقع"
          icon={MapPin}
          value={selectedLocation}
          onChange={onLocationChange}
          options={locations.map(loc => ({ value: loc, label: loc }))}
        />
        <SelectFilter
          label="نوع الوظيفة"
          icon={Clock}
          value={selectedJobType}
          onChange={onJobTypeChange}
          options={jobTypes.map(type => ({ value: type, label: type }))}
        />

        {hasActiveFilters && (
          <ActiveFilters
            categories={categories}
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            selectedLocation={selectedLocation}
            onClearSearch={() => onSearchChange("")}
            onClearCategory={() => onCategoryChange("all")}
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
        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B38025]/20 focus:border-[#B38025] transition-all bg-gray-50 focus:bg-white"
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
      <Icon size={16} className="ml-2 text-gray-500" />
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B38025]/20 focus:border-[#B38025] transition-all bg-gray-50 focus:bg-white appearance-none"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
));

const ActiveFilters = memo(({ categories, searchTerm, selectedCategory, selectedLocation, onClearSearch, onClearCategory, onClearLocation }) => {
  const getCategoryName = (categoryId) => {
    if (categoryId === "all") return "الكل";
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : categoryId;
  };

  return (
    <div className="border-t border-gray-100 pt-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">خيارات البحث النشطة:</h4>
      <div className="space-y-2">
        {searchTerm && (
          <FilterTag
            label={`البحث: ${searchTerm}`}
            onClear={onClearSearch}
            color="blue"
          />
        )}
        {selectedCategory !== "all" && (
          <FilterTag
            label={`التصنيف: ${getCategoryName(selectedCategory)}`}
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
  );
});

const FilterTag = memo(({ label, onClear, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200"
  };

  return (
    <div className={`flex items-center justify-between ${colorClasses[color]} px-3 py-2 rounded-lg border transition-all hover:shadow-sm`}>
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