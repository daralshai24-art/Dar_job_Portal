import { SearchInput } from "@/components/shared/ui/SearchInput";
import { FilterSelect } from "@/components/common/Select"; // Updated import path
import { FiltersContainer } from "@/components/shared/FiltersContainer";
import Button from "@/components/shared/ui/Button";
import { RefreshCw } from "lucide-react";

export const JobsFilters = ({
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
    { value: "all", label: "الكل" },
    { value: "active", label: "نشطة" },
    { value: "inactive", label: "غير نشطة" },
    { value: "draft", label: "مسودة" },
    { value: "closed", label: "مغلقة" }
  ];

  return (
    <FiltersContainer
      title="تصفية الوظائف"
      totalCount={totalCount}
      filteredCount={filteredCount}
      className="relative overflow-visible" // Add this to prevent clipping
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SearchInput
          placeholder="البحث عن وظيفة..."
          value={searchTerm}
          onChange={onSearchChange}
        />

        {/* Updated FilterSelect with proper props */}
        <FilterSelect
          value={statusFilter}
          onChange={onStatusFilterChange}
          options={statusOptions}
          placeholder="حالة الوظيفة"
          isSearchable={false}
        />

        <Button
          onClick={onRefresh}
          loading={loading}
          variant="outline"
          className="h-[42px]"
        >
          <RefreshCw size={16} className="ml-1" />
          تحديث
        </Button>
      </div>
    </FiltersContainer>
  );
};