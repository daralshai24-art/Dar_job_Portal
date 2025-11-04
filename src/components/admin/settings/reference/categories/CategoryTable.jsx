"use client";

export default function CategoryTable({ data = [], loading, onEdit, onDeactivate, onActivate, onPermanentDelete }) {
  if (loading) return <p className="text-center py-6">جاري التحميل...</p>;

  if (!data.length) return <p className="text-center py-6 text-gray-600">لا توجد فئات مسجلة</p>;

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-3 text-right">الاسم</th>
            <th className="p-3 text-right">الحالة</th>
            <th className="p-3 text-center">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {data.map((cat) => (
            <tr key={cat._id} className="border-b hover:bg-gray-50">
              <td className="p-3 text-right font-medium">{cat.name}</td>
              <td className="p-3 text-right">
                <span className={`px-2 py-1 rounded text-xs ${
                  cat.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {cat.isActive ? "نشطة" : "معطلة"}
                </span>
              </td>
              <td className="p-3">
                <div className="flex justify-center gap-2 flex-wrap">
                  {/* Edit Button - Always visible */}
                  <button
                    onClick={() => onEdit(cat)}
                    className="text-blue-600 hover:underline text-xs px-2 py-1 border border-blue-600 rounded hover:bg-blue-50"
                  >
                    تعديل
                  </button>
                  
                  {/* Activate/Deactivate based on current status */}
                  {!cat.isActive ? (
                    <button
                      onClick={() => onActivate(cat)}
                      className="text-green-600 hover:underline text-xs px-2 py-1 border border-green-600 rounded hover:bg-green-50"
                    >
                      تفعيل
                    </button>
                  ) : (
                    <button
                      onClick={() => onDeactivate(cat)}
                      className="text-orange-600 hover:underline text-xs px-2 py-1 border border-orange-600 rounded hover:bg-orange-50"
                    >
                      تعطيل
                    </button>
                  )}
                  
                  {/* Permanent Delete - Always visible */}
                  <button
                    onClick={() => onPermanentDelete(cat)}
                    className="text-red-600 hover:underline text-xs px-2 py-1 border border-red-600 rounded hover:bg-red-50"
                  >
                    حذف نهائي
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}