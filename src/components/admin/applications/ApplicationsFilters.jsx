import { Search, RefreshCw, Medal } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/shared/ui/Card";
import Button from "@/components/shared/ui/Button";
import { FilterSelect } from "@/components/common/Select";

export const ApplicationsFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onRefresh,
  loading,
  totalCount,
  filteredCount
}) => {
  const statusOptions = [
    { value: "all", label: "جميع الحالات" },
    { value: "pending", label: "قيد المراجعة" },
    { value: "reviewed", label: "تم المراجعة" },
    { value: "interview_scheduled", label: "مقابلة مجدولة" },
    { value: "interview_completed", label: "تمت المقابلة" },
    { value: "rejected", label: "مرفوض" },
    { value: "hired", label: "مقبول" },
    // Add Silver Medalist here so dropdown reflects it if selected
    { value: "silver_medalist", label: "🥈 المرشحين المميزين" }
  ];

  const isSilverMedalistSelected = statusFilter === "silver_medalist";

  return (
    <Card className="relative overflow-visible">
      <CardHeader title="تصفية الطلبات" />
      <CardContent className="overflow-visible">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">

          {/* Right Side: Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto flex-1">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D6B666]" size={20} />
              <input
                type="text"
                placeholder="ابحث بالاسم أو البريد الإلكتروني..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B38025]"
              />
            </div>

            {/* Status Filter */}
            <div className="w-full sm:w-56 relative z-50">
              <FilterSelect
                value={statusFilter}
                onChange={onStatusFilterChange}
                options={statusOptions}
                placeholder="اختر حالة الطلب"
                isSearchable={false}
              />
            </div>
          </div>

          {/* Left Side: Quick Actions */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            {/* Silver Medalist Toggle Button */}
            <button
              onClick={() => onStatusFilterChange(isSilverMedalistSelected ? "all" : "silver_medalist")}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-200 text-sm font-medium whitespace-nowrap flex-1 lg:flex-none justify-center
                ${isSilverMedalistSelected
                  ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm ring-1 ring-blue-200"
                  : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300"
                }
              `}
            >
              <Medal size={16} className={isSilverMedalistSelected ? "text-blue-600" : "text-gray-400"} />
              <span>المرشحين المميزين</span>
            </button>

            {/* Refresh Button */}
            <Button
              onClick={onRefresh}
              loading={loading}
              variant="outline"
              className="h-[42px] px-4"
            >
              <RefreshCw size={16} />
            </Button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 text-sm text-gray-600 border-t pt-4">
          عرض <span className="text-[#B38025] font-bold">{filteredCount}</span> من{" "}
          <span className="text-gray-500">{totalCount}</span> طلب
          {isSilverMedalistSelected && (
            <span className="mr-2 text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs">
              تصفية: المرشحين المميزين
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};