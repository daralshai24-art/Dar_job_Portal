import { Search, RefreshCw, RotateCcw } from "lucide-react";
import Button from "@/components/shared/ui/Button";
import { FilterSelect } from "@/components/common/Select";
import { ROLE_LABELS, STATUS_LABELS, DEPARTMENT_LABELS } from "@/services/userService";

export function UsersFilters({
  filters,
  onFilterChange,
  onReset,
  onRefresh,
  loading,
  totalCount,
  filteredCount,
}) {
  // Convert labels to options format for FilterSelect
  const roleOptions = [
    { value: "all", label: "جميع الأدوار" },
    ...Object.entries(ROLE_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  ];

  const statusOptions = [
    { value: "all", label: "جميع الحالات" },
    ...Object.entries(STATUS_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  ];

  const departmentOptions = [
    { value: "all", label: "جميع الأقسام" },
    ...Object.entries(DEPARTMENT_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="البحث بالاسم أو البريد الإلكتروني..."
              value={filters.search}
              onChange={(e) => onFilterChange("search", e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B38025] focus:border-transparent"
            />
          </div>
        </div>

        {/* Role Filter */}
        <div className="lg:w-48">
          <FilterSelect
            value={filters.role}
            onChange={(value) => onFilterChange("role", value)}
            options={roleOptions}
            placeholder="الدور"
          />
        </div>

        {/* Status Filter */}
        <div className="lg:w-48">
          <FilterSelect
            value={filters.status}
            onChange={(value) => onFilterChange("status", value)}
            options={statusOptions}
            placeholder="الحالة"
          />
        </div>

        {/* Department Filter */}
        <div className="lg:w-48">
          <FilterSelect
            value={filters.department}
            onChange={(value) => onFilterChange("department", value)}
            options={departmentOptions}
            placeholder="القسم"

          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onReset}
            disabled={loading}
            title="إعادة تعيين الفلاتر"
          >
            <RotateCcw size={18} className="ml-2" />
            إعادة تعيين
          </Button>
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={loading}
            title="تحديث البيانات"
          >
            <RefreshCw size={18} className={`ml-2 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mt-4 text-sm text-gray-600">
        عرض {filteredCount} من {totalCount} مستخدم
      </div>
    </div>
  );
}
