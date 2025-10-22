// src/components/admin/dashboard/DashboardHeader.jsx
import { TrendingUp } from "lucide-react";

export default function DashboardHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">نظرة عامة</h1>
        <p className="text-gray-600 mt-2">
          نظرة شاملة على إحصائيات ونشاطات النظام
        </p>
      </div>
      <div className="flex items-center text-green-600">
        <TrendingUp className="w-6 h-6 ml-2" />
        <span className="text-sm font-medium">لوحة التحكم الرئيسية</span>
      </div>
    </div>
  );
}