import { Card, CardHeader, CardContent } from "@/components/shared/ui/Card";
import { Filter } from "lucide-react";

export const FiltersContainer = ({ 
  children, 
  title = "تصفية النتائج",
  totalCount,
  filteredCount,
  className = ""
}) => {
  return (
    <Card className={className}>
      <CardHeader icon={Filter} title={title} />
      <CardContent>
        {children}
        
        {/* Results Summary */}
        {totalCount !== undefined && filteredCount !== undefined && (
          <div className="mt-4 text-sm text-gray-600">
            عرض <span className="text-[#B38025] font-medium">{filteredCount}</span> من{" "}
            <span className="text-[#B38025] font-medium">{totalCount}</span> عنصر
          </div>
        )}
      </CardContent>
    </Card>
  );
};