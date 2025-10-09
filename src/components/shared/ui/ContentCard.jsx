// components/shared/ui/ContentCard.jsx
/**
 * Reusable Content Card Component
 */
const ContentCard = ({ 
  title, 
  icon: Icon, 
  children, 
  className = "" 
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      {title && (
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          {Icon && <Icon className="ml-2 h-5 w-5 text-[#B38025]" />}
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

export default ContentCard;