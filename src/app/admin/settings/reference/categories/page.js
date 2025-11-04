"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
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
  
  const { showConfirmation } = useConfirmationModal();

  const fetchAll = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (err) {
      console.error(err);
      toast.error("فشل في تحميل الفئات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleOpenAdd = () => {
    showConfirmation({
      title: "إضافة فئة",
      type: "categoryForm",
      confirmText: "حفظ",
      initialFormData: { name: "" },
      onConfirm: async (formData) => {
        const categoryName = formData?.name || formData || "";
        
        if (!categoryName.trim()) {
          toast.error("يرجى إدخال اسم الفئة");
          return false;
        }

        try {
          await createCategory({ name: categoryName.trim() });
          toast.success("تم إضافة الفئة بنجاح");
          fetchAll();
          return true;
        } catch (err) {
          console.error(err);
          toast.error("حدث خطأ أثناء الحفظ");
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
          toast.error("يرجى إدخال اسم الفئة");
          return false;
        }

        try {
          await updateCategory(category._id, { name: categoryName.trim() });
          toast.success("تم تعديل الفئة بنجاح");
          fetchAll();
          return true;
        } catch (err) {
          console.error(err);
          toast.error("حدث خطأ أثناء التحديث");
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
          toast.success("تم تعطيل الفئة");
          fetchAll();
          return true;
        } catch (err) {
          console.error(err);
          toast.error("فشل في تعطيل الفئة");
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
          toast.success("تم تفعيل الفئة");
          fetchAll();
          return true;
        } catch (err) {
          console.error(err);
          toast.error("فشل في تفعيل الفئة");
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
          toast.success("تم حذف الفئة نهائياً");
          fetchAll();
          return true;
        } catch (err) {
          console.error(err);
          toast.error("فشل في حذف الفئة");
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
    </div>
  );
}