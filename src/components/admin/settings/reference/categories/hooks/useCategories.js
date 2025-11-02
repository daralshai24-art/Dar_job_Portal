import { useState, useEffect } from "react";
import { getCategories, createCategory, updateCategory, deactivateCategory } from "@/services/categoriesService";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (err) {
      setError(err.message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (payload) => {
    const newCategory = await createCategory(payload);
    setCategories([newCategory, ...categories]);
    return newCategory;
  };

  const editCategory = async (id, payload) => {
    const updated = await updateCategory(id, payload);
    setCategories(categories.map(cat => (cat._id === id ? updated : cat)));
    return updated;
  };

  const removeCategory = async (id) => {
    await deactivateCategory(id);
    setCategories(categories.map(cat => (cat._id === id ? { ...cat, isActive: false } : cat)));
  };

  return { categories, loading, error, fetchCategories, addCategory, editCategory, removeCategory };
};
