"use client";

export default function CategoryTable({ data = [], loading, onEdit, onDelete }) {
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
            <tr key={cat._id} className="border-b">
              <td className="p-3 text-right">{cat.name}</td>
              <td className="p-3 text-right">{cat.isActive ? "نشطة" : "معطلة"}</td>
              <td className="p-3 flex justify-center gap-4">
                <button
                  onClick={() => onEdit(cat)}
                  className="text-blue-600 hover:underline"
                >
                  تعديل
                </button>
                <button
                  onClick={() => onDelete(cat)} // pass the full category
                  className="text-red-600 hover:underline"
                >
                  تعطيل
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
