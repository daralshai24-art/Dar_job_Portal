const CategoryButton = ({ 
  category, 
  isSelected, 
  onClick 
}) => {
  const baseClasses = `
    relative px-6 py-3 border-2 rounded-full font-medium overflow-hidden
    transform transition-all duration-300 ease-in-out group focus:outline-none
    focus:ring-2 focus:ring-offset-2 active:scale-95
  `;

  const selectedClasses = `
    bg-[#B38025] text-white border-[#B38025] shadow-lg shadow-[#B38025]/25 scale-105
    focus:ring-[#B38025]/50
  `;

  const unselectedClasses = `
    bg-white text-[#1D3D1E] border-gray-300 cursor-pointer
    hover:border-[#B38025] hover:text-[#B38025] hover:shadow-md hover:shadow-[#B38025]/15
    hover:scale-105 hover:-translate-y-1 focus:ring-[#B38025]/50
  `;

  return (
    <button
      onClick={() => onClick(category)}
      className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
    >
      <span className={`relative z-10 transition-all duration-300 ${
        isSelected ? 'font-semibold' : 'group-hover:text-white group-hover:font-semibold'
      }`}>
        {category}
      </span>
      
      {isSelected && (
        <div className="absolute inset-0 rounded-full bg-white/20 animate-ping pointer-events-none" />
      )}
    </button>
  );
};

export default CategoryButton;