// src\components\public\NoResults.jsx
"use client";

import { Search, Filter } from "lucide-react";

const NoResults = ({ 
  hasFilters = false, 
  onClearFilters,
}) => {
  return (
    <div className="text-center py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {hasFilters ? "لم نعثر على نتائج" : "لا توجد وظائف متاحة حالياً"}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {hasFilters 
            ? "جرب تعديل خيارات البحث أو إعادة تعيين الفلاتر"
            : "تفقد مرة أخرى لاحقاً للاطلاع على الوظائف الجديدة"
          }
        </p>

        {hasFilters && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="bg-[#B38025] text-white px-6 py-3 rounded-lg hover:bg-[#D6B666] hover:text-[#1D3D1E] transition-all duration-300 font-medium inline-flex items-center gap-2"
          >
            <Filter size={18} />
            إعادة تعيين الفلاتر
          </button>
        )}
      </div>
    </div>
  );
};

export default NoResults;