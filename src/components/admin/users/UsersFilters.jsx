//src\components\admin\users\UsersFilters.jsx
import { RefreshCw, Filter } from "lucide-react";
import Button from "@/components/shared/ui/Button";
import {SearchInput} from "@/components/shared/ui/SearchInput";
import { FilterSelect } from "@/components/shared/ui/FilterSelect";
import { FiltersContainer } from "@/components/shared/FiltersContainer";
import { ROLE_LABELS, STATUS_LABELS, DEPARTMENT_LABELS } from "@/services/userService";

/**
 * Expected props:
 * - filters: { search, role, status, department }
 * - onFilterChange: (field, value) => void
 * - onReset, onRefresh
 * - loading
 * - totalCount, filteredCount
 */
export default function UsersFilters({
  filters,
  onFilterChange,
  onReset,
  onRefresh,
  loading,
  totalCount = 0,
  filteredCount = 0,
}) {
  return (
    <FiltersContainer title="تصفية المستخدمين" totalCount={totalCount} filteredCount={filteredCount}>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <SearchInput
            value={filters.search}
            onChange={(val) => onFilterChange("search", val)}
            placeholder="البحث بالاسم أو البريد الإلكتروني..."
            debounce={300}
            disabled={loading}
            ariaLabel="بحث مستخدمين"
          />
        </div>

        <div className="lg:w-48">
          <FilterSelect
            value={filters.role}
            onChange={(val) => onFilterChange("role", val)}
            options={Object.entries(ROLE_LABELS).map(([v, l]) => ({ value: v, label: l }))}
            includeAllOption={true}
            allLabel="جميع الأدوار"
            disabled={loading}
          />
        </div>

        <div className="lg:w-48">
          <FilterSelect
            value={filters.status}
            onChange={(val) => onFilterChange("status", val)}
            options={Object.entries(STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }))}
            includeAllOption={true}
            allLabel="جميع الحالات"
            disabled={loading}
          />
        </div>

        <div className="lg:w-48">
          <FilterSelect
            value={filters.department}
            onChange={(val) => onFilterChange("department", val)}
            options={Object.entries(DEPARTMENT_LABELS).map(([v, l]) => ({ value: v, label: l }))}
            includeAllOption={true}
            allLabel="جميع الأقسام"
            disabled={loading}
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onReset} disabled={loading} aria-label="إعادة تعيين الفلاتر">
            <Filter size={18} className="ml-2" />
            إعادة تعيين
          </Button>

          <Button variant="outline" onClick={onRefresh} disabled={loading} aria-label="تحديث">
            <RefreshCw size={18} className={`${loading ? "animate-spin" : ""} ml-2`} />
            تحديث
          </Button>
        </div>
      </div>
    </FiltersContainer>
  );
}
