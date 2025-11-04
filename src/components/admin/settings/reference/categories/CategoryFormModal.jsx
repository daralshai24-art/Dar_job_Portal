// //src\components\admin\settings\reference\categories\CategoryFormModal.jsx
// "use client";

// import { useEffect, useState } from "react";

// export default function CategoryFormModal({ open, onClose, initialData, onSubmit }) {
//   const [name, setName] = useState(initialData?.name || "");
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     setName(initialData?.name || "");
//   }, [initialData]);

//   if (!open) return null;

//   const handleSave = async () => {
//     if (!name.trim()) return;
//     setSaving(true);
//     try {
//       await onSubmit({ name: name.trim() });
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-md w-full max-w-md" dir="rtl">
//         <h2 className="text-lg font-semibold mb-4">{initialData ? "تعديل فئة" : "إضافة فئة"}</h2>
//         <label className="block text-sm font-medium text-gray-700 mb-2">اسم الفئة</label>
//         <input
//           className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
//         <div className="flex justify-end gap-2">
//           <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">إلغاء</button>
//           <button
//             onClick={handleSave}
//             disabled={saving}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
//           >
//             {saving ? "جاري الحفظ..." : "حفظ"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
