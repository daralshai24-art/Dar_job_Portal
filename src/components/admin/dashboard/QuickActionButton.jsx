// src/components/admin/dashboard/QuickActionButton.jsx
export default function QuickActionButton({ 
  title, 
  description, 
  icon: Icon, 
  action, 
  color 
}) {
  return (
    <button
      onClick={action}
      className={`
        w-full flex items-center justify-between p-4 text-white rounded-lg 
        transition-all duration-300 ease-in-out 
        transform hover:scale-[1.02] hover:shadow-md 
        ${color} cursor-pointer shadow-sm
        border border-transparent hover:border-white/20
      `}
    >
      <div className="flex items-center">
        <Icon className="w-5 h-5 ml-3 transition-transform duration-300 ease-in-out transform group-hover:scale-110" />
        <div className="text-right">
          <div className="font-medium text-sm transition-all duration-300 ease-in-out group-hover:translate-x-1">
            {title}
          </div>
          <div className="text-xs opacity-90 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
            {description}
          </div>
        </div>
      </div>
    </button>
  );
}