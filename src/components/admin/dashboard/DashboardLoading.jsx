// src/components/admin/dashboard/DashboardLoading.jsx
export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
      </div>
    </div>
  );
}