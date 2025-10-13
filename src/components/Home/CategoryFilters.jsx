// src/components/home/CategoryFilters.jsx
"use client";

import { useEffect, useState } from "react";
import CategoryButton from "@/components/shared/UI/CategoryButton";
import { fetchCategories } from "@/lib/constants";
import LoadingSpinner from "@/components/shared/UI/LoadingSpinner";

const CategoryFilters = ({ selectedCategory, onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
        setError(error.message);
        // Set default categories if API fails
        setCategories([{
          _id: "all",
          name: "الكل"
        }]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="mb-8 flex justify-center">
        <LoadingSpinner message="جاري تحميل التصنيفات..." size="small" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8 text-center">
        <p className="text-red-500 text-sm mb-2">حدث خطأ في تحميل التصنيفات</p>
        <button 
          onClick={() => window.location.reload()}
          className="text-blue-500 text-sm hover:underline"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <CategoryButton
            key={category._id}
            category={category.name}
            isSelected={selectedCategory === category._id}
            onClick={() => onCategorySelect(category._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryFilters;