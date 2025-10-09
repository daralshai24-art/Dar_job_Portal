import { Search, Filter, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/shared/ui/Card";
import Button from "@/components/shared/ui/Button";

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
    { value: "hired", label: "مقبول" }
  ];

  return (
    <Card>
      <CardHeader icon={Filter} title="تصفية الطلبات" />
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D6B666]" size={20} />
            <input
              type="text"
              placeholder="ابحث بالاسم أو البريد الإلكتروني..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B38025]"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D6B666]" size={20} />
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B38025] cursor-pointer"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh Button */}
          <Button
            onClick={onRefresh}
            loading={loading}
            variant="ghost"
            className="h-[42px]"
          >
            <RefreshCw size={16} className="ml-1" />
            تحديث
          </Button>
        </div>

        {/* Results Summary */}
        <div className="mt-4 text-sm text-gray-600">
          عرض <span className="text-[#B38025] font-medium">{filteredCount}</span> من{" "}
          <span className="text-[#B38025] font-medium">{totalCount}</span> طلب
        </div>
      </CardContent>
    </Card>
  );
};