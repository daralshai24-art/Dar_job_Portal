// src/components/admin/dashboard/StatCard.jsx
import { TrendingUp, AlertCircle } from "lucide-react";

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color, 
  bgColor, 
  trend, 
  onClick 
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-full ${bgColor} group-hover:scale-110 transition-transform`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
      
      {/* Trend indicator */}
      {trend === "positive" && (
        <div className="flex items-center mt-3 text-green-600 text-xs">
          <TrendingUp className="w-3 h-3 ml-1" />
          <span>حالة جيدة</span>
        </div>
      )}
      {trend === "attention" && (
        <div className="flex items-center mt-3 text-yellow-600 text-xs">
          <AlertCircle className="w-3 h-3 ml-1" />
          <span>يتطلب الانتباه</span>
        </div>
      )}
    </div>
  );
}