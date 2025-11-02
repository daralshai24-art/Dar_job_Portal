"use client";

import { useEffect, useState } from "react";
import CategoryTable from "@/components/admin/settings/reference/categories/CategoryTable";
import CategoryForm from "@/components/admin/settings/reference/categories/CategoryFormModal";
import ConfirmDeleteModal from "@/components/admin/settings/reference/categories/ConfirmDeleteModal";
import { getCategories, createCategory, updateCategory, deactivateCategory } from "@/services/categoriesService";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [toast, setToast] = useState(null);

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
    setEditing(null);
    setIsFormOpen(true);
  };

  const handleEdit = (cat) => {
    setEditing(cat);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    try {
      if (editing) {
        await updateCategory(editing._id, payload);
        showToast("تم تعديل الفئة بنجاح", "success");
      } else {
        await createCategory(payload);
        showToast("تم إضافة الفئة بنجاح", "success");
      }
      setIsFormOpen(false);
      setEditing(null);
      fetchAll();
    } catch (err) {
      console.error(err);
      showToast("حدث خطأ أثناء الحفظ", "error");
    }
  };

  const handleRequestDelete = (category) => {
    setDeleteItem(category); // assign the full category object
  };

  const handleConfirmDelete = async (category) => {
    try {
      await deactivateCategory(category._id);
      setDeleteItem(null);
      showToast("تم تعطيل الفئة", "success");
      fetchAll();
    } catch (err) {
      console.error(err);
      showToast("فشل في حذف الفئة", "error");
    }
  };

  return (
    <div dir="rtl" className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">إدارة الفئات</h1>
        <button
          onClick={handleOpenAdd}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          + إضافة فئة
        </button>
      </div>

      <CategoryTable
        data={categories} // must match the prop in CategoryTable
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleRequestDelete}
      />

      {isFormOpen && (
        <CategoryForm
          open={isFormOpen}
          onClose={() => { setIsFormOpen(false); setEditing(null); }}
          initialData={editing}
          onSubmit={handleFormSubmit}
        />
      )}

      {deleteItem && (
        <ConfirmDeleteModal
          item={deleteItem}
          onClose={() => setDeleteItem(null)}
          onConfirm={() => handleConfirmDelete(deleteItem)}
        />
      )}

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
