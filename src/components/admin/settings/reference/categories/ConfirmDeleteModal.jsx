// //src\components\admin\settings\reference\categories\ConfirmDeleteModal.jsx
// "use client";

// export default function ConfirmDeleteModal({ item, onClose, onConfirm }) {
//   if (!item) return null;

//   const handleDelete = async () => {
//     await onConfirm(item);
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-md w-full max-w-md" dir="rtl">
//         <p className="text-lg mb-4">هل أنت متأكد من تعطيل هذه الفئة؟</p>
//         <div className="flex justify-end gap-2">
//           <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">إلغاء</button>
//           <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md">تعطيل</button>
//         </div>
//       </div>
//     </div>
//   );
// }
