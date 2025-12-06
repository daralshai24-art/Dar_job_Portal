// src/components/home/CategoryFilters.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import { fetchCategories } from "@/lib/constants";

const CategoryFilters = ({ selectedCategory, onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);

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
    return <CategorySkeleton />;
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
    <div className="mb-8 mt-8 w-full relative group">
      {/* Scroll Fade Masks */}
      <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none md:hidden" />
      <div className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none md:hidden" />

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto py-2 pb-4 gap-3 scrollbar-brand scroll-smooth items-center justify-start"
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category._id;
          return (
            <button
              key={category._id}
              onClick={() => onCategorySelect(category._id)}
              className={`
                relative px-6 py-3 rounded-full font-bold text-sm md:text-base whitespace-nowrap transition-all duration-300 ease-out
                ${isSelected
                  ? 'bg-gradient-to-r from-[#B38025] to-[#D6B666] text-white shadow-lg shadow-[#B38025]/30 scale-105 ring-2 ring-[#B38025]/20 ring-offset-2'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#B38025] hover:text-[#B38025] hover:shadow-md hover:-translate-y-0.5'
                }
              `}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const CategorySkeleton = () => (
  <div className="mb-8 w-full overflow-hidden">
    <div className="flex overflow-x-hidden pb-4 gap-3 items-center justify-start md:justify-center animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="h-12 rounded-full bg-gray-200"
          style={{ width: Math.floor(Math.random() * (120 - 80 + 1)) + 80 + 'px' }}
        />
      ))}
    </div>
  </div>
);

export default CategoryFilters;