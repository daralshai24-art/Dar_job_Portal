import React from "react";

/**
 * FiltersContainer
 * - title: optional title string
 * - children: content
 * - totalCount, filteredCount: optional numbers to show summary
 */
export function FiltersContainer({ title, children, totalCount, filteredCount }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        </div>
      )}
      <div>{children}</div>
      {typeof filteredCount !== "undefined" && typeof totalCount !== "undefined" && (
        <div className="mt-4 text-sm text-gray-600">
          عرض <span className="text-[#B38025] font-medium">{filteredCount}</span> من{" "}
          <span className="text-[#B38025] font-medium">{totalCount}</span>
        </div>
      )}
    </div>
  );
}
