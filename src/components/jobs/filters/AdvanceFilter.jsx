// components/jobs/filters/JobsFilters.jsx
import { Search, Filter, RefreshCw, Calendar, Users, Briefcase } from "lucide-react";
import { useState } from "react";
import Button from "@/components/shared/ui/Button";

const JobsFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onRefresh,
  loading,
  totalCount,
  filteredCount,
  // Additional filters with default functions
  dateFilter = "all",
  onDateFilterChange = () => {},
  jobTypeFilter = "all", 
  onJobTypeFilterChange = () => {},
  categoryFilter = "all",
  onCategoryFilterChange = () => {}
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Status Options
  const statusOptions = [
    { value: "all", label: "الكل" },
    { value: "active", label: "نشطة" },
    { value: "inactive", label: "غير نشطة" },
    { value: "draft", label: "مسودة" },
    { value: "closed", label: "مغلقه" },
  ];

  // Date Filter Options
  const dateOptions = [
    { value: "all", label: "جميع التواريخ" },
    { value: "today", label: "اليوم" },
    { value: "week", label: "هذا الأسبوع" },
    { value: "month", label: "هذا الشهر" },
    { value: "older", label: "أقدم من شهر" },
  ];

  // Job Type Options (from your model)
  const jobTypeOptions = [
    { value: "all", label: "جميع الأنواع" },
    { value: "Full-time", label: "دوام كامل" },
    { value: "Part-time", label: "دوام جزئي" },
    { value: "Contract", label: "عقد" },
    { value: "Freelance", label: "عمل حر" },
    { value: "Internship", label: "تدريب" },
  ];

  // Category Options (from your form)
  const categoryOptions = [
    { value: "all", label: "جميع التصنيفات" },
    { value: "تكنولوجيا", label: "تكنولوجيا" },
    { value: "مبيعات", label: "مبيعات" },
    { value: "تسويق", label: "تسويق" },
    { value: "تصميم", label: "تصميم" },
    { value: "مالية", label: "مالية" },
    { value: "موارد بشرية", label: "موارد بشرية" },
    { value: "خدمة عملاء", label: "خدمة عملاء" },
    { value: "تعليم", label: "تعليم" },
    { value: "رعاية صحية", label: "رعاية صحية" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Main Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D6B666]" size={20} />
          <input
            type="text"
            placeholder="البحث عن وظيفة..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B38025] focus:border-transparent transition-all duration-200"
            dir="rtl"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D6B666]" size={20} />
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B38025] focus:border-transparent appearance-none bg-white cursor-pointer transition-all duration-200"
            dir="rtl"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D6B666]" size={20} />
          <select
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value)}
            className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B38025] focus:border-transparent appearance-none bg-white cursor-pointer transition-all duration-200"
            dir="rtl"
          >
            {dateOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={onRefresh}
            loading={loading}
            variant="outline"
            className="flex-1 py-4 border-gray-300 text-[#B38025] hover:bg-[#D6B666] hover:text-white hover:border-[#D6B666]"
          >
            {!loading && <RefreshCw size={18} className="ml-2" />}
            {loading ? "جاري..." : "تحديث"}
          </Button>
          
          <Button
            onClick={() => setShowAdvanced(!showAdvanced)}
            variant="outline"
            className="px-4 py-4 border-gray-300 text-gray-600 hover:bg-gray-50"
            title="خيارات متقدمة"
          >
            <Filter size={18} />
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mt-4 text-sm text-gray-600 text-center md:text-right">
        عرض <span className="text-[#B38025] font-semibold">{filteredCount}</span> من{" "}
        <span className="font-medium">{totalCount}</span> وظيفة
      </div>

      {/* Advanced Filters (Collapsible) */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Job Type Filter */}
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D6B666]" size={18} />
              <select
                value={jobTypeFilter}
                onChange={(e) => onJobTypeFilterChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B38025] focus:border-transparent appearance-none bg-white cursor-pointer transition-all duration-200"
                dir="rtl"
              >
                {jobTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D6B666]" size={18} />
              <select
                value={categoryFilter}
                onChange={(e) => onCategoryFilterChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B38025] focus:border-transparent appearance-none bg-white cursor-pointer transition-all duration-200"
                dir="rtl"
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Advanced Filters */}
            <Button
              onClick={() => {
                onJobTypeFilterChange("all");
                onCategoryFilterChange("all");
              }}
              variant="outline"
              className="py-3 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-700"
            >
              مسح الفلاتر المتقدمة
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export { JobsFilters };