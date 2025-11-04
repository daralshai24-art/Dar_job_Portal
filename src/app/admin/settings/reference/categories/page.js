"use client";

import { useEffect, useState } from "react";
import CategoryTable from "@/components/admin/settings/reference/categories/CategoryTable";
import { useConfirmationModal } from "@/components/shared/modals/ConfirmationModalContext";
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deactivateCategory,
  activateCategory,
  deleteCategoryPermanently 
} from "@/services/categoriesService";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  const { showConfirmation } = useConfirmationModal();

  const fetchAll = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (err) {
      console.error(err);
      showToast("فشل في تحميل الفئات", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  function showToast(message, type = "info") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  const handleOpenAdd = () => {
    showConfirmation({
      title: "إضافة فئة",
      type: "categoryForm",
      confirmText: "حفظ",
      initialFormData: { name: "" },
      onConfirm: async (formData) => {
        const categoryName = formData?.name || formData || "";
        
        if (!categoryName.trim()) {
          showToast("يرجى إدخال اسم الفئة", "error");
          return false;
        }

        try {
          await createCategory({ name: categoryName.trim() });
          showToast("تم إضافة الفئة بنجاح", "success");
          fetchAll();
          return true;
        } catch (err) {
          console.error(err);
          showToast("حدث خطأ أثناء الحفظ", "error");
          return false;
        }
      },
    });
  };

  const handleEdit = (category) => {
    showConfirmation({
      title: "تعديل فئة",
      type: "categoryForm",
      confirmText: "تحديث",
      initialFormData: { name: category.name },
      onConfirm: async (formData) => {
        const categoryName = formData?.name || formData || "";
        
        if (!categoryName.trim()) {
          showToast("يرجى إدخال اسم الفئة", "error");
          return false;
        }

        try {
          await updateCategory(category._id, { name: categoryName.trim() });
          showToast("تم تعديل الفئة بنجاح", "success");
          fetchAll();
          return true;
        } catch (err) {
          console.error(err);
          showToast("حدث خطأ أثناء التحديث", "error");
          return false;
        }
      },
    });
  };

  const handleDeactivate = (category) => {
    showConfirmation({
      title: "تعطيل الفئة",
      message: `هل أنت متأكد من تعطيل الفئة "${category.name}"؟`,
      variant: "warning",
      confirmText: "تعطيل",
      onConfirm: async () => {
        try {
          await deactivateCategory(category._id);
          showToast("تم تعطيل الفئة", "success");
          fetchAll();
          return true;
        } catch (err) {
          console.error(err);
          showToast("فشل في تعطيل الفئة", "error");
          return false;
        }
      },
    });
  };

  const handleActivate = (category) => {
    showConfirmation({
      title: "تفعيل الفئة",
      message: `هل أنت متأكد من تفعيل الفئة "${category.name}"؟`,
      variant: "primary",
      confirmText: "تفعيل",
      onConfirm: async () => {
        try {
          await activateCategory(category._id);
          showToast("تم تفعيل الفئة", "success");
          fetchAll();
          return true;
        } catch (err) {
          console.error(err);
          showToast("فشل في تفعيل الفئة", "error");
          return false;
        }
      },
    });
  };

  const handlePermanentDelete = (category) => {
    showConfirmation({
      title: "حذف نهائي",
      message: `هل أنت متأكد من الحذف النهائي للفئة "${category.name}"؟ لا يمكن التراجع عن هذا الإجراء.`,
      variant: "danger",
      confirmText: "حذف نهائي",
      onConfirm: async () => {
        try {
          await deleteCategoryPermanently(category._id);
          showToast("تم حذف الفئة نهائياً", "success");
          fetchAll();
          return true;
        } catch (err) {
          console.error(err);
          showToast("فشل في حذف الفئة", "error");
          return false;
        }
      },
    });
  };

  return (
    <div dir="rtl" className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">إدارة الفئات</h1>
        <button
          onClick={handleOpenAdd}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          + إضافة فئة
        </button>
      </div>

      <CategoryTable
        data={categories}
        loading={loading}
        onEdit={handleEdit}
        onDeactivate={handleDeactivate}
        onActivate={handleActivate}
        onPermanentDelete={handlePermanentDelete}
      />

      {toast && (
        <div
          className={`fixed bottom-6 left-6 p-3 rounded shadow-lg ${
            toast.type === "success" ? "bg-green-600 text-white" : "bg-gray-800 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}