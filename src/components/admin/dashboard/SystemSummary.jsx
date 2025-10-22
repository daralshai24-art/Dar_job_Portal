// src/components/admin/dashboard/SystemSummary.jsx
export default function SystemSummary({ stats }) {
  return (
    <div className="bg-gradient-to-l from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">ملخص النظام</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-green-600">{stats.activeJobs}</div>
          <div className="text-sm text-gray-600">وظيفة نشطة</div>
          <div className="text-xs text-gray-400 mt-1">جاهزة للتقديم</div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-blue-600">{stats.pendingApplications}</div>
          <div className="text-sm text-gray-600">طلب يحتاج مراجعة</div>
          <div className="text-xs text-gray-400 mt-1">في قائمة الانتظار</div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-purple-600">{stats.totalUsers}</div>
          <div className="text-sm text-gray-600">مستخدم نشط</div>
          <div className="text-xs text-gray-400 mt-1">في النظام</div>
        </div>
      </div>
    </div>
  );
}