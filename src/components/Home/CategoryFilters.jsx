import { JOB_CATEGORIES } from "@/lib/constants";
import CategoryButton from "@/components/shared/UI/CategoryButton";



const CategoryFilters = ({ selectedCategory, onCategorySelect }) => {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap justify-center gap-3">
        {JOB_CATEGORIES.map((category) => (
          <CategoryButton
            key={category}
            category={category}
            isSelected={selectedCategory === category}
            onClick={onCategorySelect}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryFilters;
